"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-dashboard";
import { resolveAdminReturnTo, withAdminNotice } from "@/lib/admin-feedback";
import { prisma } from "@/lib/prisma";

const eventBaseSchema = z.object({
  date: z.string().trim().min(1),
  description: z.string().trim().optional(),
  descriptionEn: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  isPublished: z.boolean().default(false),
  title: z.string().trim().min(1),
  titleEn: z.string().trim().optional(),
});

const updateEventSchema = eventBaseSchema.extend({
  id: z.string().min(1),
});

const deleteEventSchema = z.object({
  id: z.string().min(1),
});

const bulkEventVisibilitySchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  visibility: z.enum(["draft", "published"]),
});

function parseEventDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid event date.");
  }

  return parsedDate;
}

function normalizeEventPayload(parsed: z.infer<typeof eventBaseSchema>) {
  return {
    date: parseEventDate(parsed.date),
    description: parsed.description?.trim() || null,
    descriptionEn: parsed.descriptionEn?.trim() || null,
    imageUrl: parsed.imageUrl?.trim() || null,
    isPublished: parsed.isPublished,
    title: parsed.title,
    titleEn: parsed.titleEn?.trim() || null,
  };
}

export async function createEventAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/events");

  const parsed = eventBaseSchema.parse({
    date: formData.get("date"),
    description: formData.get("description"),
    descriptionEn: formData.get("descriptionEn"),
    imageUrl: formData.get("imageUrl"),
    isPublished: formData.get("isPublished") === "on",
    title: formData.get("title"),
    titleEn: formData.get("titleEn"),
  });

  await prisma.event.create({
    data: normalizeEventPayload(parsed),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/events");

  redirect(withAdminNotice(returnTo, "created"));
}

export async function updateEventAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/events");

  const parsed = updateEventSchema.parse({
    id: formData.get("id"),
    date: formData.get("date"),
    description: formData.get("description"),
    descriptionEn: formData.get("descriptionEn"),
    imageUrl: formData.get("imageUrl"),
    isPublished: formData.get("isPublished") === "on",
    title: formData.get("title"),
    titleEn: formData.get("titleEn"),
  });

  await prisma.event.update({
    where: {
      id: parsed.id,
    },
    data: normalizeEventPayload(parsed),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${parsed.id}`);

  redirect(withAdminNotice(returnTo, "saved"));
}

export async function deleteEventAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/events");

  const parsed = deleteEventSchema.parse({
    id: formData.get("id"),
  });

  await prisma.event.delete({
    where: {
      id: parsed.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/events");

  redirect(withAdminNotice(returnTo, "deleted"));
}

export async function bulkUpdateEventVisibilityAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/events");

  const ids = formData
    .getAll("ids")
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  if (!ids.length) {
    redirect(withAdminNotice(returnTo, "selection-required", "warning"));
  }

  const parsed = bulkEventVisibilitySchema.parse({
    ids,
    visibility: formData.get("visibility"),
  });

  await prisma.event.updateMany({
    where: {
      id: {
        in: parsed.ids,
      },
    },
    data: {
      isPublished: parsed.visibility === "published",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/events");

  redirect(withAdminNotice(returnTo, "bulk-updated"));
}
