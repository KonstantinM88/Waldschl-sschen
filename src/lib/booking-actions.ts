"use server";

import { createHash, randomInt } from "node:crypto";
import { z, ZodError } from "zod";
import { BookingMealPlan, Prisma } from "@prisma/client";
import {
  createBooking,
  validateBookingRequest,
  type CreateBookingInput,
} from "@/lib/booking-engine";
import type { BookingLocale } from "@/lib/booking-shared";
import { BOOKING_TERMS_VERSION } from "@/lib/booking-terms";
import { getHotelNotifyAddress, sendEmail } from "@/lib/email";
import {
  buildBookingVerificationEmail,
  buildGuestReceivedEmail,
  buildHotelNotificationEmail,
  type BookingEmailData,
} from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";

export interface SubmitHotelBookingState {
  status: "idle" | "code-sent" | "success" | "error";
  errorMessage?: string;
  infoMessage?: string;
  verificationId?: string;
  maskedEmail?: string;
  expiresAt?: string;
  bookingId?: string;
  roomType?: string;
  totalAmount?: number;
}

const VERIFICATION_CODE_EXPIRY_MINUTES = 15;
const VERIFICATION_MAX_ATTEMPTS = 5;
const VERIFICATION_CLEANUP_RETENTION_MS = 24 * 60 * 60 * 1000;

const pendingBookingPayloadSchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.number().int().min(1).max(4),
  mealPlan: z.nativeEnum(BookingMealPlan),
  dogCount: z.number().int().min(0).max(4),
  bicycleReserved: z.boolean(),
  restaurantReservationTime: z.string().trim().max(20).optional(),
  locale: z.enum(["de", "en", "ru"]),
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(50).optional(),
  street: z.string().trim().min(1).max(180),
  postalCode: z.string().trim().min(1).max(20),
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(2000).optional(),
});

type PendingBookingPayload = z.infer<typeof pendingBookingPayloadSchema>;

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
    termsRequired:
      "Bitte lesen und akzeptieren Sie die Buchungsbedingungen, bevor wir den Bestätigungscode senden.",
    codeSent:
      "Wir haben Ihnen einen sechsstelligen Bestätigungscode per E-Mail gesendet.",
    codeSendFailed:
      "Der Bestätigungscode konnte nicht per E-Mail gesendet werden. Bitte prüfen Sie Ihre E-Mail-Adresse oder versuchen Sie es später erneut.",
    codeInvalid:
      "Der eingegebene Bestätigungscode ist ungültig.",
    codeExpired:
      "Der Bestätigungscode ist abgelaufen. Bitte senden Sie die Buchungsanfrage erneut.",
    codeAttemptsExceeded:
      "Der Bestätigungscode wurde zu oft falsch eingegeben. Bitte senden Sie die Buchungsanfrage erneut.",
    codeMissing:
      "Bitte geben Sie den sechsstelligen Bestätigungscode ein.",
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
    termsRequired:
      "Please read and accept the booking conditions before we send the confirmation code.",
    codeSent:
      "We have sent a six-digit confirmation code to your email address.",
    codeSendFailed:
      "We could not send the confirmation code by email. Please check your email address or try again later.",
    codeInvalid:
      "The confirmation code is invalid.",
    codeExpired:
      "The confirmation code has expired. Please submit the booking request again.",
    codeAttemptsExceeded:
      "The confirmation code was entered incorrectly too many times. Please submit the booking request again.",
    codeMissing:
      "Please enter the six-digit confirmation code.",
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
    termsRequired:
      "Ознакомьтесь с условиями бронирования и примите их перед отправкой кода подтверждения.",
    codeSent:
      "Мы отправили шестизначный код подтверждения на ваш e-mail.",
    codeSendFailed:
      "Не удалось отправить код подтверждения по e-mail. Проверьте адрес или повторите попытку позже.",
    codeInvalid:
      "Введён неверный код подтверждения.",
    codeExpired:
      "Срок действия кода истёк. Отправьте заявку на бронирование ещё раз.",
    codeAttemptsExceeded:
      "Код введён неверно слишком много раз. Отправьте заявку на бронирование ещё раз.",
    codeMissing:
      "Введите шестизначный код подтверждения.",
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

function normalizeActionIntent(value: FormDataEntryValue | null) {
  return value === "confirm-code" ? "confirm-code" : "request-code";
}

function buildPendingBookingPayload(formData: FormData, locale: BookingLocale) {
  return pendingBookingPayloadSchema.parse({
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
}

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return email;
  }

  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}${"*".repeat(Math.max(localPart.length - visible.length, 2))}@${domain}`;
}

function createVerificationCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function getVerificationHashSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    "wald-booking-email-verification"
  );
}

function hashVerificationCode({
  code,
  email,
  expiresAt,
}: {
  code: string;
  email: string;
  expiresAt: Date;
}) {
  return createHash("sha256")
    .update(getVerificationHashSecret())
    .update(":")
    .update(email.trim().toLowerCase())
    .update(":")
    .update(expiresAt.toISOString())
    .update(":")
    .update(code)
    .digest("hex");
}

function codeSentState(
  verification: {
    id: string;
    email: string;
    expiresAt: Date;
  },
  locale: BookingLocale,
  errorMessage?: string
): SubmitHotelBookingState {
  return {
    status: "code-sent",
    verificationId: verification.id,
    maskedEmail: maskEmail(verification.email),
    expiresAt: verification.expiresAt.toISOString(),
    infoMessage: actionCopy[locale].codeSent,
    errorMessage,
  };
}

function parseVerificationCode(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\D/g, "").slice(0, 6);
}

function toVerificationPayloadJson(payload: PendingBookingPayload) {
  return JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonObject;
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

async function cleanupOldBookingVerifications() {
  const retentionDate = new Date(
    Date.now() - VERIFICATION_CLEANUP_RETENTION_MS
  );

  await prisma.bookingEmailVerification.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: retentionDate,
          },
        },
        {
          consumedAt: {
            lt: retentionDate,
          },
        },
      ],
    },
  });
}

async function requestBookingVerificationCode(
  formData: FormData,
  locale: BookingLocale
): Promise<SubmitHotelBookingState> {
  const t = actionCopy[locale];

  if (formData.get("termsAccepted") !== "on") {
    return {
      status: "error",
      errorMessage: t.termsRequired,
    };
  }

  const payload = buildPendingBookingPayload(formData, locale);
  await validateBookingRequest(payload);

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + VERIFICATION_CODE_EXPIRY_MINUTES * 60 * 1000
  );
  const code = createVerificationCode();

  await cleanupOldBookingVerifications();

  const verification = await prisma.bookingEmailVerification.create({
    data: {
      email: payload.email,
      codeHash: hashVerificationCode({
        code,
        email: payload.email,
        expiresAt,
      }),
      payload: toVerificationPayloadJson(payload),
      locale,
      termsAcceptedAt: now,
      termsVersion: BOOKING_TERMS_VERSION,
      expiresAt,
    },
  });
  const mail = buildBookingVerificationEmail(
    {
      code,
      firstName: payload.firstName,
      lastName: payload.lastName,
      expiresInMinutes: VERIFICATION_CODE_EXPIRY_MINUTES,
    },
    locale
  );
  const result = await sendEmail({
    to: payload.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  if (!result.ok) {
    await prisma.bookingEmailVerification
      .delete({
        where: {
          id: verification.id,
        },
      })
      .catch(() => null);

    return {
      status: "error",
      errorMessage: t.codeSendFailed,
    };
  }

  return codeSentState(verification, locale);
}

async function confirmBookingVerificationCode(
  formData: FormData,
  locale: BookingLocale
): Promise<SubmitHotelBookingState> {
  const t = actionCopy[locale];
  const verificationId = String(formData.get("verificationId") ?? "");
  const code = parseVerificationCode(formData.get("verificationCode"));

  if (!verificationId) {
    return {
      status: "error",
      errorMessage: t.codeMissing,
    };
  }

  const verification = await prisma.bookingEmailVerification.findUnique({
    where: {
      id: verificationId,
    },
  });

  if (!verification || verification.consumedAt) {
    return {
      status: "error",
      errorMessage: t.codeExpired,
    };
  }

  const effectiveLocale =
    verification.locale === "en" || verification.locale === "ru"
      ? verification.locale
      : locale;

  if (code.length !== 6) {
    return codeSentState(
      verification,
      effectiveLocale,
      actionCopy[effectiveLocale].codeMissing
    );
  }

  if (verification.expiresAt <= new Date()) {
    return codeSentState(verification, effectiveLocale, actionCopy[effectiveLocale].codeExpired);
  }

  if (verification.attempts >= VERIFICATION_MAX_ATTEMPTS) {
    return codeSentState(
      verification,
      effectiveLocale,
      actionCopy[effectiveLocale].codeAttemptsExceeded
    );
  }

  const expectedHash = hashVerificationCode({
    code,
    email: verification.email,
    expiresAt: verification.expiresAt,
  });

  if (expectedHash !== verification.codeHash) {
    const updated = await prisma.bookingEmailVerification.update({
      where: {
        id: verification.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    return codeSentState(
      updated,
      effectiveLocale,
      actionCopy[effectiveLocale].codeInvalid
    );
  }

  const consumeResult = await prisma.bookingEmailVerification.updateMany({
    where: {
      id: verification.id,
      consumedAt: null,
      attempts: {
        lt: VERIFICATION_MAX_ATTEMPTS,
      },
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      consumedAt: new Date(),
    },
  });

  if (consumeResult.count !== 1) {
    return {
      status: "error",
      errorMessage: actionCopy[effectiveLocale].codeExpired,
    };
  }

  const payload = pendingBookingPayloadSchema.parse(
    verification.payload
  ) as PendingBookingPayload;
  const verifiedAt = new Date();
  const result = await createBooking({
    ...payload,
    termsAcceptedAt: verification.termsAcceptedAt,
    termsVersion: verification.termsVersion,
    emailVerifiedAt: verifiedAt,
  } satisfies CreateBookingInput);

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
    effectiveLocale
  );

  return {
    status: "success",
    bookingId: result.bookingId,
    roomType: result.roomType,
    totalAmount: result.totalAmount,
  };
}

export async function submitHotelBookingAction(
  _previousState: SubmitHotelBookingState,
  formData: FormData
): Promise<SubmitHotelBookingState> {
  const locale = normalizeBookingLocale(formData.get("locale"));

  try {
    return normalizeActionIntent(formData.get("intent")) === "confirm-code"
      ? confirmBookingVerificationCode(formData, locale)
      : requestBookingVerificationCode(formData, locale);
  } catch (error) {
    return {
      status: "error",
      errorMessage: localizeBookingError(error, locale),
    };
  }
}
