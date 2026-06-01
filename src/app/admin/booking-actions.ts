"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookingStatus } from "@prisma/client";
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
  type CreateAdminBookingInput,
} from "@/lib/booking-lifecycle";
import { getMealPlanLabel, getRoomTypeLabel } from "@/lib/booking-engine";
import type { BookingLocale } from "@/lib/booking-shared";
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
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const parsed = bookingStatusSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  const current = await prisma.booking.findUnique({
    where: { id: parsed.id },
    select: { status: true },
  });

  if (!current) {
    redirect(withAdminNotice(returnTo, "delete-blocked", "warning"));
  }

  if (!canTransitionBooking(current.status, parsed.status)) {
    redirect(withAdminNotice(returnTo, "invalid-transition", "warning"));
  }

  const updated = await prisma.booking.update({
    where: { id: parsed.id },
    data: {
      status: parsed.status,
      ...getStatusTimestampPatch(parsed.status),
    },
    include: BOOKING_EMAIL_INCLUDE,
  });

  // Notify the guest when their booking gets confirmed.
  if (parsed.status === BookingStatus.CONFIRMED) {
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
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const parsed = cancelBookingSchema.parse({
    id: formData.get("id"),
    reason: formData.get("reason"),
  });

  const current = await prisma.booking.findUnique({
    where: { id: parsed.id },
    select: { status: true },
  });

  if (!current) {
    redirect(withAdminNotice(returnTo, "delete-blocked", "warning"));
  }

  if (!canTransitionBooking(current.status, BookingStatus.CANCELLED)) {
    redirect(withAdminNotice(returnTo, "invalid-transition", "warning"));
  }

  const cancelled = await prisma.booking.update({
    where: { id: parsed.id },
    data: {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
      cancellationReason: parsed.reason || null,
    },
    include: BOOKING_EMAIL_INCLUDE,
  });

  try {
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

export async function bulkUpdateBookingStatusAction(formData: FormData) {
  await requireAdminSession();
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
    .filter((booking) => canTransitionBooking(booking.status, parsed.status))
    .map((booking) => booking.id);

  if (allowedIds.length) {
    await prisma.booking.updateMany({
      where: { id: { in: allowedIds } },
      data: {
        status: parsed.status,
        ...getStatusTimestampPatch(parsed.status),
      },
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
  await requireAdminSession();

  const input: CreateAdminBookingInput = {
    roomId: String(formData.get("roomId") ?? ""),
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
    const result = await createAdminBooking(input);
    bookingId = result.bookingId;
  } catch (error) {
    if (error instanceof ZodError) {
      redirect(withAdminNotice("/admin/bookings/new", "invalid-input", "warning"));
    }

    if (error instanceof Error) {
      if (
        error.message.includes("sold out") ||
        error.message.includes("not available")
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
