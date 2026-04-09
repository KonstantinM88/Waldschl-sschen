"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { normalizeAmenities } from "@/lib/booking-engine";
import { prisma } from "@/lib/prisma";

const roomUpdateSchema = z.object({
  id: z.string().min(1),
  basePrice: z.coerce.number().positive(),
  descriptionDe: z.string().trim().min(1),
  descriptionEn: z.string().trim().min(1),
  descriptionRu: z.string().trim().min(1),
  imageUrl: z.string().trim().optional(),
  inventory: z.coerce.number().int().min(0),
  isActive: z.boolean().default(false),
  maxGuests: z.coerce.number().int().min(1).max(10),
  shortDescriptionDe: z.string().trim().optional(),
  shortDescriptionEn: z.string().trim().optional(),
  shortDescriptionRu: z.string().trim().optional(),
  titleDe: z.string().trim().min(1),
  titleEn: z.string().trim().min(1),
  titleRu: z.string().trim().min(1),
});

export async function updateRoomAction(formData: FormData) {
  const parsed = roomUpdateSchema.parse({
    id: formData.get("id"),
    basePrice: formData.get("basePrice"),
    descriptionDe: formData.get("descriptionDe"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionRu: formData.get("descriptionRu"),
    imageUrl: formData.get("imageUrl"),
    inventory: formData.get("inventory"),
    isActive: formData.get("isActive") === "on",
    maxGuests: formData.get("maxGuests"),
    shortDescriptionDe: formData.get("shortDescriptionDe"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    shortDescriptionRu: formData.get("shortDescriptionRu"),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
    titleRu: formData.get("titleRu"),
  });

  const rawAmenities = String(formData.get("amenities") ?? "");
  const amenities = normalizeAmenities(rawAmenities.split(/\r?\n/g));

  await prisma.room.update({
    where: {
      id: parsed.id,
    },
    data: {
      basePrice: new Prisma.Decimal(parsed.basePrice),
      descriptionDe: parsed.descriptionDe,
      descriptionEn: parsed.descriptionEn,
      descriptionRu: parsed.descriptionRu,
      imageUrl: parsed.imageUrl?.trim() || null,
      inventory: parsed.inventory,
      isActive: parsed.isActive,
      maxGuests: parsed.maxGuests,
      shortDescriptionDe: parsed.shortDescriptionDe?.trim() || null,
      shortDescriptionEn: parsed.shortDescriptionEn?.trim() || null,
      shortDescriptionRu: parsed.shortDescriptionRu?.trim() || null,
      titleDe: parsed.titleDe,
      titleEn: parsed.titleEn,
      titleRu: parsed.titleRu,
      amenities,
    },
  });

  revalidatePath("/admin");
}
