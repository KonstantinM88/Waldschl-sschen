"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  BookingLifecycleActorType,
  BookingMealPlan,
  BookingStatus,
  Prisma,
} from "@prisma/client";
import { z, ZodError } from "zod";
import { requireAdminSession } from "@/lib/admin-dashboard";
import {
  resolveAdminReturnTo,
  withAdminNotice,
} from "@/lib/admin-feedback";
import {
  canTransitionBooking,
  createAdminBooking,
  getStatusTimestampPatch,
  updateAdminBookingStayAndServices,
  type CreateAdminBookingInput,
  type UpdateAdminBookingStayServicesInput,
} from "@/lib/booking-lifecycle";
import { getMealPlanLabel, getRoomTypeLabel } from "@/lib/booking-engine";
import { buildBookingLifecycleEventData } from "@/lib/booking-lifecycle-events";
import {
  buildGermanBookingReceiptEmail,
  createGermanBookingReceipt,
} from "@/lib/booking-receipt";
import {
  HOTEL_ROOM_NUMBER_PATTERN,
  type BookingLocale,
} from "@/lib/booking-shared";
import { sendEmail } from "@/lib/email";
import {
  buildGuestCancelledEmail,
  buildGuestConfirmedEmail,
  type BookingEmailData,
} from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";

const BOOKING_EMAIL_INCLUDE = { guest: true, room: true } as const;

interface BookingEmailSource {
  id: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;
  totalAmount: { toString(): string };
  mealPlan: Parameters<typeof getMealPlanLabel>[0];
  locale: string;
  cancellationReason: string | null;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    street: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
  };
  room: { type: Parameters<typeof getRoomTypeLabel>[0] };
}

function toBookingLocale(value: string | null | undefined): BookingLocale {
  return value === "en" || value === "ru" ? value : "de";
}

function toBookingEmailData(booking: BookingEmailSource): BookingEmailData {
  const locale = toBookingLocale(booking.locale);
  return {
    bookingId: booking.id,
    firstName: booking.guest.firstName,
    lastName: booking.guest.lastName,
    email: booking.guest.email,
    phone: booking.guest.phone,
    roomTitle: getRoomTypeLabel(booking.room.type, locale),
    checkIn: booking.checkIn.toISOString().slice(0, 10),
    checkOut: booking.checkOut.toISOString().slice(0, 10),
    nights: booking.nights,
    guests: booking.guests,
    totalAmount: Number(booking.totalAmount.toString()),
    mealPlanLabel: getMealPlanLabel(booking.mealPlan, locale),
    street: booking.guest.street,
    postalCode: booking.guest.postalCode,
    city: booking.guest.city,
    country: booking.guest.country,
    cancellationReason: booking.cancellationReason,
  };
}

const bookingStatusSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(BookingStatus),
});

const bulkBookingStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.nativeEnum(BookingStatus),
});

const cancelBookingSchema = z.object({
  id: z.string().min(1),
  reason: z.string().trim().max(500).optional(),
});

const adminNotesSchema = z.object({
  id: z.string().min(1),
  adminNotes: z.string().trim().max(2000).optional(),
});

const bookingReceiptEmailSchema = z.object({
  id: z.string().min(1),
});

const assignedRoomNumberSchema = z.object({
  id: z.string().min(1),
  assignedRoomNumber: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => !value || HOTEL_ROOM_NUMBER_PATTERN.test(value)),
});

function isValidGuestDateInput(value: string) {
  if (!value) {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const optionalGuestDateSchema = z
  .string()
  .trim()
  .max(10)
  .refine(isValidGuestDateInput)
  .optional();

const guestDetailsSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(50).optional(),
  street: z.string().trim().max(180).optional(),
  postalCode: z.string().trim().max(20).optional(),
  city: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).optional(),
  locale: z.enum(["de", "en", "ru"]),
  notes: z.string().trim().max(2000).optional(),
  isForeignGuest: z.boolean().default(false),
  dateOfBirth: optionalGuestDateSchema,
  nationality: z.string().trim().max(120).optional(),
  passportNumber: z.string().trim().max(80).optional(),
  passportIssuingCountry: z.string().trim().max(120).optional(),
  passportExpiryDate: optionalGuestDateSchema,
});

const GUEST_EDITABLE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "street",
  "postalCode",
  "city",
  "country",
  "locale",
  "notes",
  "isForeignGuest",
  "dateOfBirth",
  "nationality",
  "passportNumber",
  "passportIssuingCountry",
  "passportExpiryDate",
] as const;

type GuestEditableField = (typeof GUEST_EDITABLE_FIELDS)[number];

function parseGuestDateInput(value?: string) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function normalizeGuestComparableValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value);
}

function maskPassportNumber(value: string) {
  const normalized = value.trim();

  if (normalized.length <= 4) {
    return "*".repeat(normalized.length);
  }

  return `${"*".repeat(Math.min(normalized.length - 4, 8))}${normalized.slice(-4)}`;
}

function toGuestAuditValue(field: GuestEditableField, value: string | null) {
  if (field === "passportNumber" && value) {
    return maskPassportNumber(value);
  }

  return value;
}

function revalidateBookingViews(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/bookings/calendar");
  revalidatePath("/admin/analytics");
  revalidatePath("/admin/rooms");
  if (id) {
    revalidatePath(`/admin/bookings/${id}`);
  }
}

/**
 * Single status change. Re-validates the transition against the allowed matrix
 * and writes the matching lifecycle timestamp (confirmedAt, checkedInAt, ...).
 */
export async function updateBookingStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const parsed = bookingStatusSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.booking.findUnique({
      where: { id: parsed.id },
      select: { status: true },
    });

    if (!current) {
      return { code: "not-found" as const, booking: null };
    }

    if (
      current.status === parsed.status ||
      !canTransitionBooking(current.status, parsed.status)
    ) {
      return { code: "invalid-transition" as const, booking: null };
    }

    const now = new Date();
    const updated = await tx.booking.update({
      where: { id: parsed.id },
      data: {
        status: parsed.status,
        ...getStatusTimestampPatch(parsed.status, now),
      },
      include: BOOKING_EMAIL_INCLUDE,
    });

    await tx.bookingLifecycleEvent.create({
      data: buildBookingLifecycleEventData({
        bookingId: parsed.id,
        actorType: BookingLifecycleActorType.ADMIN,
        actorName: session.sub,
        fromStatus: current.status,
        toStatus: parsed.status,
        createdAt: now,
      }),
    });

    return { code: "updated" as const, booking: updated };
  });

  if (result.code === "not-found") {
    redirect(withAdminNotice(returnTo, "delete-blocked", "warning"));
  }

  if (result.code === "invalid-transition") {
    redirect(withAdminNotice(returnTo, "invalid-transition", "warning"));
  }

  const updated = result.booking;

  // Notify the guest when their booking gets confirmed.
  if (parsed.status === BookingStatus.CONFIRMED && updated) {
    try {
      const data = toBookingEmailData(updated as unknown as BookingEmailSource);
      const mail = buildGuestConfirmedEmail(data, toBookingLocale(updated.locale));
      await sendEmail({ to: data.email, subject: mail.subject, html: mail.html });
    } catch {
      // email failure must not block the status update
    }
  }

  revalidateBookingViews(parsed.id);
  redirect(withAdminNotice(returnTo, "status-updated"));
}

/**
 * Cancel with optional reason. Clears the inventory hold and records why.
 */
export async function cancelBookingAction(formData: FormData) {
  const session = await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const parsed = cancelBookingSchema.parse({
    id: formData.get("id"),
    reason: formData.get("reason"),
  });

  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.booking.findUnique({
      where: { id: parsed.id },
      select: { status: true },
    });

    if (!current) {
      return { code: "not-found" as const, booking: null };
    }

    if (
      current.status === BookingStatus.CANCELLED ||
      !canTransitionBooking(current.status, BookingStatus.CANCELLED)
    ) {
      return { code: "invalid-transition" as const, booking: null };
    }

    const now = new Date();
    const cancelled = await tx.booking.update({
      where: { id: parsed.id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: now,
        cancellationReason: parsed.reason || null,
      },
      include: BOOKING_EMAIL_INCLUDE,
    });

    await tx.bookingLifecycleEvent.create({
      data: buildBookingLifecycleEventData({
        bookingId: parsed.id,
        actorType: BookingLifecycleActorType.ADMIN,
        actorName: session.sub,
        fromStatus: current.status,
        toStatus: BookingStatus.CANCELLED,
        createdAt: now,
        details: parsed.reason
          ? {
              cancellationReason: parsed.reason,
            }
          : undefined,
      }),
    });

    return { code: "cancelled" as const, booking: cancelled };
  });

  if (result.code === "not-found") {
    redirect(withAdminNotice(returnTo, "delete-blocked", "warning"));
  }

  if (result.code === "invalid-transition") {
    redirect(withAdminNotice(returnTo, "invalid-transition", "warning"));
  }

  const cancelled = result.booking;

  try {
    if (!cancelled) {
      throw new Error("Cancelled booking is missing.");
    }
    const data = toBookingEmailData(cancelled as unknown as BookingEmailSource);
    const mail = buildGuestCancelledEmail(data, toBookingLocale(cancelled.locale));
    await sendEmail({ to: data.email, subject: mail.subject, html: mail.html });
  } catch {
    // email failure must not block the cancellation
  }

  revalidateBookingViews(parsed.id);
  redirect(withAdminNotice(returnTo, "status-updated"));
}

export async function saveBookingAdminNotesAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const parsed = adminNotesSchema.parse({
    id: formData.get("id"),
    adminNotes: formData.get("adminNotes"),
  });

  await prisma.booking.update({
    where: { id: parsed.id },
    data: { adminNotes: parsed.adminNotes || null },
  });

  revalidateBookingViews(parsed.id);
  redirect(withAdminNotice(returnTo, "saved"));
}

export async function sendBookingReceiptEmailAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");
  const parsedResult = bookingReceiptEmailSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsedResult.success) {
    redirect(withAdminNotice(returnTo, "invalid-input", "warning"));
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsedResult.data.id },
    include: BOOKING_EMAIL_INCLUDE,
  });

  if (!booking) {
    redirect(withAdminNotice(returnTo, "error", "error"));
  }

  const receipt = createGermanBookingReceipt(booking);
  const mail = buildGermanBookingReceiptEmail(receipt);
  const result = await sendEmail({
    to: booking.guest.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  if (!result.ok) {
    redirect(withAdminNotice(returnTo, "receipt-email-failed", "error"));
  }

  redirect(withAdminNotice(returnTo, "receipt-sent"));
}

export async function saveBookingAssignedRoomNumberAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const parsedResult = assignedRoomNumberSchema.safeParse({
    id: formData.get("id"),
    assignedRoomNumber: formData.get("assignedRoomNumber"),
  });

  if (!parsedResult.success) {
    redirect(withAdminNotice(returnTo, "invalid-input", "warning"));
  }

  await prisma.booking.update({
    where: { id: parsedResult.data.id },
    data: { assignedRoomNumber: parsedResult.data.assignedRoomNumber || null },
  });

  revalidateBookingViews(parsedResult.data.id);
  redirect(withAdminNotice(returnTo, "saved"));
}

export async function updateBookingStayAndServicesAction(formData: FormData) {
  const session = await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const input: UpdateAdminBookingStayServicesInput = {
    id: String(formData.get("id") ?? ""),
    checkIn: String(formData.get("checkIn") ?? ""),
    checkOut: String(formData.get("checkOut") ?? ""),
    mealPlan: String(formData.get("mealPlan") ?? "") as BookingMealPlan,
    dogCount: Number(formData.get("dogCount") ?? 0),
    bicycleReserved: formData.get("bicycleReserved") === "on",
    restaurantReservationTime:
      String(formData.get("restaurantReservationTime") ?? "").trim() || undefined,
  };

  try {
    await updateAdminBookingStayAndServices(input, session.sub);
  } catch (error) {
    if (error instanceof ZodError) {
      redirect(withAdminNotice(returnTo, "invalid-input", "warning"));
    }

    if (error instanceof Error) {
      if (
        error.message.includes("sold out") ||
        error.message.includes("Assigned room is occupied")
      ) {
        redirect(withAdminNotice(returnTo, "sold-out", "warning"));
      }

      if (error.message.includes("cannot be edited")) {
        redirect(withAdminNotice(returnTo, "booking-locked", "warning"));
      }

      if (
        error.message.includes("date range") ||
        error.message.includes("Check-in date")
      ) {
        redirect(withAdminNotice(returnTo, "invalid-input", "warning"));
      }
    }

    redirect(withAdminNotice(returnTo, "error", "error"));
  }

  revalidateBookingViews(input.id);
  redirect(withAdminNotice(returnTo, "saved"));
}

export async function updateBookingGuestAction(formData: FormData) {
  const session = await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const parsedResult = guestDetailsSchema.safeParse({
    id: formData.get("id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    street: formData.get("street"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    country: formData.get("country"),
    locale: formData.get("locale"),
    notes: formData.get("notes"),
    isForeignGuest: formData.get("isForeignGuest") === "on",
    dateOfBirth: formData.get("dateOfBirth"),
    nationality: formData.get("nationality"),
    passportNumber: formData.get("passportNumber"),
    passportIssuingCountry: formData.get("passportIssuingCountry"),
    passportExpiryDate: formData.get("passportExpiryDate"),
  });

  if (!parsedResult.success) {
    redirect(withAdminNotice(returnTo, "invalid-input", "warning"));
  }

  const parsed = parsedResult.data;
  const nextGuest = {
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    email: parsed.email,
    phone: parsed.phone || null,
    street: parsed.street || null,
    postalCode: parsed.postalCode || null,
    city: parsed.city || null,
    country: parsed.country || null,
    locale: parsed.locale,
    notes: parsed.notes || null,
    isForeignGuest: parsed.isForeignGuest,
    dateOfBirth: parseGuestDateInput(parsed.dateOfBirth),
    nationality: parsed.nationality || null,
    passportNumber: parsed.passportNumber || null,
    passportIssuingCountry: parsed.passportIssuingCountry || null,
    passportExpiryDate: parseGuestDateInput(parsed.passportExpiryDate),
  };

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: parsed.id },
      select: {
        guest: true,
        guestId: true,
      },
    });

    if (!booking) {
      return "not-found" as const;
    }

    const changes: Prisma.InputJsonObject[] = [];

    for (const field of GUEST_EDITABLE_FIELDS) {
      const previousValue = normalizeGuestComparableValue(booking.guest[field]);
      const nextValue = normalizeGuestComparableValue(nextGuest[field]);

      if (previousValue !== nextValue) {
        changes.push({
          field,
          previousValue: toGuestAuditValue(field, previousValue),
          nextValue: toGuestAuditValue(field, nextValue),
        });
      }
    }

    if (!changes.length) {
      return "unchanged" as const;
    }

    await tx.guest.update({
      where: { id: booking.guestId },
      data: nextGuest,
    });

    if (changes.some((change) => change.field === "locale")) {
      await tx.booking.update({
        where: { id: parsed.id },
        data: { locale: nextGuest.locale },
      });
    }

    await tx.guestChangeLog.create({
      data: {
        bookingId: parsed.id,
        guestId: booking.guestId,
        changedBy: session.sub,
        changes,
      },
    });

    return "updated" as const;
  });

  if (result === "not-found") {
    redirect(withAdminNotice(returnTo, "error", "error"));
  }

  revalidateBookingViews(parsed.id);
  redirect(withAdminNotice(returnTo, "saved"));
}

export async function bulkUpdateBookingStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const ids = formData
    .getAll("ids")
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  if (!ids.length) {
    redirect(withAdminNotice(returnTo, "selection-required", "warning"));
  }

  const parsed = bulkBookingStatusSchema.parse({
    ids,
    status: formData.get("status"),
  });

  // Only flip rows where the transition is valid; skip the rest silently.
  const candidates = await prisma.booking.findMany({
    where: { id: { in: parsed.ids } },
    select: { id: true, status: true },
  });

  const allowedIds = candidates
    .filter(
      (booking) =>
        booking.status !== parsed.status &&
        canTransitionBooking(booking.status, parsed.status)
    )
    .map((booking) => booking.id);

  if (allowedIds.length) {
    const now = new Date();
    const allowedBookings = candidates.filter((booking) =>
      allowedIds.includes(booking.id)
    );

    await prisma.$transaction(async (tx) => {
      await tx.booking.updateMany({
        where: { id: { in: allowedIds } },
        data: {
          status: parsed.status,
          ...getStatusTimestampPatch(parsed.status, now),
        },
      });

      await tx.bookingLifecycleEvent.createMany({
        data: allowedBookings.map((booking) =>
          buildBookingLifecycleEventData({
            bookingId: booking.id,
            actorType: BookingLifecycleActorType.ADMIN,
            actorName: session.sub,
            fromStatus: booking.status,
            toStatus: parsed.status,
            createdAt: now,
          })
        ),
      });
    });
  }

  revalidateBookingViews();
  redirect(withAdminNotice(returnTo, "bulk-updated"));
}

/**
 * Manual booking creation (phone / walk-in / email). Mirrors the public flow's
 * pricing + inventory guarantees but is driven by staff.
 */
export async function createAdminBookingAction(formData: FormData) {
  const session = await requireAdminSession();

  const input: CreateAdminBookingInput = {
    roomId: String(formData.get("roomId") ?? ""),
    assignedRoomNumber:
      String(formData.get("assignedRoomNumber") ?? "").trim() || undefined,
    checkIn: String(formData.get("checkIn") ?? ""),
    checkOut: String(formData.get("checkOut") ?? ""),
    guests: Number(formData.get("guests") ?? 0),
    mealPlan: (formData.get("mealPlan") as CreateAdminBookingInput["mealPlan"]) ?? undefined,
    dogCount: Number(formData.get("dogCount") ?? 0),
    bicycleReserved: formData.get("bicycleReserved") === "on",
    restaurantReservationTime:
      String(formData.get("restaurantReservationTime") ?? "").trim() || undefined,
    source: (formData.get("source") as CreateAdminBookingInput["source"]) ?? undefined,
    status: (formData.get("status") as CreateAdminBookingInput["status"]) ?? undefined,
    locale: (formData.get("locale") as CreateAdminBookingInput["locale"]) ?? undefined,
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    notes: String(formData.get("notes") ?? "").trim() || undefined,
    adminNotes: String(formData.get("adminNotes") ?? "").trim() || undefined,
  };

  let bookingId: string;

  try {
    const result = await createAdminBooking(input, session.sub);
    bookingId = result.bookingId;
  } catch (error) {
    if (error instanceof ZodError) {
      redirect(withAdminNotice("/admin/bookings/new", "invalid-input", "warning"));
    }

    if (error instanceof Error) {
      if (
        error.message.includes("sold out") ||
        error.message.includes("not available") ||
        error.message.includes("Assigned room is occupied")
      ) {
        redirect(withAdminNotice("/admin/bookings/new", "sold-out", "warning"));
      }
      if (error.message.includes("Guest count exceeds")) {
        redirect(withAdminNotice("/admin/bookings/new", "capacity", "warning"));
      }
      if (error.message.includes("Invalid booking date range")) {
        redirect(withAdminNotice("/admin/bookings/new", "invalid-input", "warning"));
      }
    }

    redirect(withAdminNotice("/admin/bookings/new", "error", "error"));
  }

  revalidateBookingViews(bookingId);
  redirect(withAdminNotice(`/admin/bookings/${bookingId}`, "created"));
}
