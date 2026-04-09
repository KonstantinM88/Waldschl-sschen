"use server";

import { ZodError } from "zod";
import { createBooking, type BookingLocale } from "@/lib/booking-engine";

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
  }

  return t.genericError;
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
      dogCount: Number(formData.get("dogCount") ?? 0),
      bicycleReserved: formData.get("bicycleReserved") === "on",
      restaurantReservationTime:
        String(formData.get("restaurantReservationTime") ?? "").trim() || undefined,
      locale,
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || undefined,
      notes: String(formData.get("notes") ?? "").trim() || undefined,
    });

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
