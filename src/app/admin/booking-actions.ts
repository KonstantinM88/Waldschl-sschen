"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookingStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-dashboard";
import { resolveAdminReturnTo, withAdminNotice } from "@/lib/admin-feedback";
import { prisma } from "@/lib/prisma";

const bookingStatusSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(BookingStatus),
});

const bulkBookingStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.nativeEnum(BookingStatus),
});

export async function updateBookingStatusAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/bookings");

  const parsed = bookingStatusSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  await prisma.booking.update({
    where: {
      id: parsed.id,
    },
    data: {
      status: parsed.status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/rooms");
  revalidatePath(`/admin/bookings/${parsed.id}`);

  redirect(withAdminNotice(returnTo, "status-updated"));
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

  await prisma.booking.updateMany({
    where: {
      id: {
        in: parsed.ids,
      },
    },
    data: {
      status: parsed.status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/rooms");

  redirect(withAdminNotice(returnTo, "bulk-updated"));
}
