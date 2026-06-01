"use server";

import { ZodError } from "zod";
import { BookingMealPlan } from "@prisma/client";
import { createBooking } from "@/lib/booking-engine";
import type { BookingLocale } from "@/lib/booking-shared";
import { getHotelNotifyAddress, sendEmail } from "@/lib/email";
import {
  buildGuestReceivedEmail,
  buildHotelNotificationEmail,
  type BookingEmailData,
} from "@/lib/email-templates";

export interface SubmitHotelBookingState {
  status: "idle" | "success" | "error";
  errorMessage?: string;
  bookingId?: string;
  roomType?: string;
  totalAmount?: number;
}

const actionCopy = {
  de: {
    genericError:
      "Die Buchung konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut.",
    invalidInput:
      "Bitte prüfen Sie Ihre Angaben. Einige Felder sind unvollständig oder ungültig.",
    dateTooLate:
      "Eine Anreise heute ist nur bis 13:00 Uhr Berliner Zeit online buchbar. Bitte waehlen Sie den naechsten moeglichen Anreisetag.",
    soldOut:
      "Dieses Zimmer ist für den gewählten Zeitraum leider nicht mehr verfügbar.",
    unavailable:
      "Das gewählte Zimmer steht aktuell nicht mehr zur Verfügung.",
    capacity:
      "Die Gästeanzahl passt nicht zur gewählten Zimmerkategorie.",
  },
  en: {
    genericError:
      "We could not save the booking right now. Please try again.",
    invalidInput:
      "Please review your details. Some fields are incomplete or invalid.",
    dateTooLate:
      "Same-day check-in can only be booked online until 13:00 Berlin time. Please select the next available arrival date.",
    soldOut:
      "This room is no longer available for the selected dates.",
    unavailable:
      "The selected room is currently no longer available.",
    capacity:
      "The guest count does not fit the selected room category.",
  },
  ru: {
    genericError:
      "Сейчас не удалось сохранить бронирование. Пожалуйста, попробуйте ещё раз.",
    invalidInput:
      "Проверьте введённые данные. Некоторые поля заполнены некорректно или не полностью.",
    dateTooLate:
      "Заезд сегодня можно забронировать онлайн только до 13:00 по времени Берлина. Выберите ближайшую доступную дату заезда.",
    soldOut:
      "Этот номер уже недоступен на выбранные даты.",
    unavailable:
      "Выбранный номер сейчас больше недоступен.",
    capacity:
      "Количество гостей не соответствует выбранной категории номера.",
  },
} as const;

function normalizeBookingLocale(value: FormDataEntryValue | null): BookingLocale {
  return value === "en" || value === "ru" ? value : "de";
}

function normalizeMealPlan(value: FormDataEntryValue | null) {
  return value === BookingMealPlan.ROOM_ONLY ||
    value === BookingMealPlan.HALF_BOARD
    ? value
    : BookingMealPlan.BREAKFAST;
}

function localizeBookingError(error: unknown, locale: BookingLocale) {
  const t = actionCopy[locale];

  if (error instanceof ZodError) {
    return t.invalidInput;
  }

  if (error instanceof Error) {
    if (
      error.message.includes("sold out") ||
      error.message.includes("Inventory is sold out")
    ) {
      return t.soldOut;
    }

    if (error.message.includes("not available")) {
      return t.unavailable;
    }

    if (error.message.includes("Guest count exceeds")) {
      return t.capacity;
    }

    if (error.message.includes("Invalid booking date range")) {
      return t.invalidInput;
    }

    if (error.message.includes("no longer bookable")) {
      return t.dateTooLate;
    }
  }

  return t.genericError;
}

/**
 * Sends guest acknowledgement + hotel notification. Never throws — email
 * problems must not surface as a failed booking.
 */
async function dispatchBookingEmails(
  emailData: BookingEmailData,
  locale: BookingLocale
) {
  try {
    const guest = buildGuestReceivedEmail(emailData, locale);
    const hotel = buildHotelNotificationEmail(emailData);

    await Promise.allSettled([
      sendEmail({
        to: emailData.email,
        subject: guest.subject,
        html: guest.html,
        replyTo: getHotelNotifyAddress(),
      }),
      sendEmail({
        to: getHotelNotifyAddress(),
        subject: hotel.subject,
        html: hotel.html,
        replyTo: emailData.email,
      }),
    ]);
  } catch {
    // swallow — booking already persisted
  }
}

export async function submitHotelBookingAction(
  _previousState: SubmitHotelBookingState,
  formData: FormData
): Promise<SubmitHotelBookingState> {
  const locale = normalizeBookingLocale(formData.get("locale"));

  try {
    const result = await createBooking({
      roomId: String(formData.get("roomId") ?? ""),
      checkIn: String(formData.get("checkIn") ?? ""),
      checkOut: String(formData.get("checkOut") ?? ""),
      guests: Number(formData.get("guests") ?? 1),
      mealPlan: normalizeMealPlan(formData.get("mealPlan")),
      dogCount: Number(formData.get("dogCount") ?? 0),
      bicycleReserved: formData.get("bicycleReserved") === "on",
      restaurantReservationTime:
        String(formData.get("restaurantReservationTime") ?? "").trim() || undefined,
      locale,
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      street: String(formData.get("street") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      country: String(formData.get("country") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim() || undefined,
    });

    await dispatchBookingEmails(
      {
        bookingId: result.bookingId,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        phone: result.phone,
        roomTitle: result.roomType,
        checkIn: result.checkIn,
        checkOut: result.checkOut,
        nights: result.nights,
        guests: result.guests,
        totalAmount: result.totalAmount,
        mealPlanLabel: result.mealPlanLabel,
        street: result.street,
        postalCode: result.postalCode,
        city: result.city,
        country: result.country,
      },
      locale
    );

    return {
      status: "success",
      bookingId: result.bookingId,
      roomType: result.roomType,
      totalAmount: result.totalAmount,
    };
  } catch (error) {
    return {
      status: "error",
      errorMessage: localizeBookingError(error, locale),
    };
  }
}
