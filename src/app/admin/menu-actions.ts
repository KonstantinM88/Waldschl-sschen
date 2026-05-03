"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-dashboard";
import { resolveAdminReturnTo, withAdminNotice } from "@/lib/admin-feedback";
import {
  saveUploadedImageAsWebp,
  saveUploadedVideoFile,
} from "@/lib/admin-image-upload";
import { slugifyMenuValue } from "@/lib/restaurant-menu";
import { prisma } from "@/lib/prisma";

const categoryBaseSchema = z.object({
  descriptionDe: z.string().trim().optional(),
  descriptionEn: z.string().trim().optional(),
  isActive: z.boolean().default(false),
  slug: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
  titleDe: z.string().trim().min(1),
  titleEn: z.string().trim().optional(),
});

const updateCategorySchema = categoryBaseSchema.extend({
  id: z.string().min(1),
});

const itemBaseSchema = z.object({
  allergens: z.string().trim().optional(),
  categoryId: z.string().min(1),
  descriptionDe: z.string().trim().optional(),
  descriptionEn: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
  videoUrl: z.string().trim().optional(),
  isPublished: z.boolean().default(false),
  isSignature: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  nameDe: z.string().trim().min(1),
  nameEn: z.string().trim().optional(),
  price: z.coerce.number().positive(),
  priceNoteDe: z.string().trim().optional(),
  priceNoteEn: z.string().trim().optional(),
  priceVariants: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

const updateItemSchema = itemBaseSchema.extend({
  id: z.string().min(1),
});

const idSchema = z.object({
  id: z.string().min(1),
});

function getImageFile(formData: FormData) {
  const file = formData.get("imageFile");

  return file instanceof File ? file : null;
}

function getVideoFile(formData: FormData) {
  const file = formData.get("videoFile");

  return file instanceof File ? file : null;
}

function createSlug(inputSlug: string | undefined, fallback: string) {
  const base = inputSlug?.trim() || fallback;

  return slugifyMenuValue(base);
}

function parsePriceVariants(value?: string) {
  const lines = value
    ?.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines?.length) {
    return Prisma.JsonNull;
  }

  const variants = lines.map((line) => {
    const [labelInput, priceInput] = line.split("|").map((part) => part?.trim());
    const label = labelInput || "";
    const price = Number(priceInput?.replace(",", "."));

    if (!label || !Number.isFinite(price) || price < 0) {
      throw new Error("Invalid price variant.");
    }

    return {
      label,
      price,
    };
  });

  return variants;
}

function normalizeCategoryData(parsed: z.infer<typeof categoryBaseSchema>) {
  return {
    descriptionDe: parsed.descriptionDe?.trim() || null,
    descriptionEn: parsed.descriptionEn?.trim() || null,
    isActive: parsed.isActive,
    sortOrder: parsed.sortOrder,
    titleDe: parsed.titleDe,
    titleEn: parsed.titleEn?.trim() || null,
  };
}

async function normalizeItemData(
  parsed: z.infer<typeof itemBaseSchema>,
  imageFile: File | null,
  videoFile: File | null
) {
  const uploadedImageUrl = await saveUploadedImageAsWebp(
    imageFile,
    "restaurant-menu"
  );
  const uploadedVideoUrl = await saveUploadedVideoFile(
    videoFile,
    "restaurant-menu"
  );
  const manualImageUrl = parsed.imageUrl?.trim() || null;
  const manualVideoUrl = parsed.videoUrl?.trim() || null;
  const imageUrl = uploadedImageUrl ?? manualImageUrl;
  const videoUrl = uploadedVideoUrl ?? manualVideoUrl;

  return {
    allergens: parsed.allergens?.trim() || null,
    categoryId: parsed.categoryId,
    descriptionDe: parsed.descriptionDe?.trim() || null,
    descriptionEn: parsed.descriptionEn?.trim() || null,
    imageUrl,
    videoUrl,
    isPublished: parsed.isPublished,
    isSignature: parsed.isSignature,
    isVegetarian: parsed.isVegetarian,
    nameDe: parsed.nameDe,
    nameEn: parsed.nameEn?.trim() || null,
    price: new Prisma.Decimal(parsed.price),
    priceNoteDe: parsed.priceNoteDe?.trim() || null,
    priceNoteEn: parsed.priceNoteEn?.trim() || null,
    priceVariants: parsePriceVariants(parsed.priceVariants),
    sortOrder: parsed.sortOrder,
  };
}

function revalidateRestaurantMenu() {
  revalidatePath("/admin");
  revalidatePath("/admin/menu");
  revalidatePath("/de/restaurant");
  revalidatePath("/en/restaurant");
}

export async function createMenuCategoryAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/menu");

  const parsed = categoryBaseSchema.parse({
    descriptionDe: formData.get("descriptionDe"),
    descriptionEn: formData.get("descriptionEn"),
    isActive: formData.get("isActive") === "on",
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
  });

  await prisma.restaurantMenuCategory.create({
    data: {
      ...normalizeCategoryData(parsed),
      slug: createSlug(parsed.slug, parsed.titleDe),
    },
  });

  revalidateRestaurantMenu();
  redirect(withAdminNotice(returnTo, "created"));
}

export async function updateMenuCategoryAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/menu");

  const parsed = updateCategorySchema.parse({
    descriptionDe: formData.get("descriptionDe"),
    descriptionEn: formData.get("descriptionEn"),
    id: formData.get("id"),
    isActive: formData.get("isActive") === "on",
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
  });

  await prisma.restaurantMenuCategory.update({
    where: {
      id: parsed.id,
    },
    data: {
      ...normalizeCategoryData(parsed),
      slug: createSlug(parsed.slug, parsed.titleDe),
    },
  });

  revalidateRestaurantMenu();
  redirect(withAdminNotice(returnTo, "saved"));
}

export async function deleteMenuCategoryAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/menu");
  const parsed = idSchema.parse({
    id: formData.get("id"),
  });

  await prisma.restaurantMenuCategory.delete({
    where: {
      id: parsed.id,
    },
  });

  revalidateRestaurantMenu();
  redirect(withAdminNotice(returnTo, "deleted"));
}

export async function createMenuItemAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/menu");

  const parsed = itemBaseSchema.parse({
    allergens: formData.get("allergens"),
    categoryId: formData.get("categoryId"),
    descriptionDe: formData.get("descriptionDe"),
    descriptionEn: formData.get("descriptionEn"),
    imageUrl: formData.get("imageUrl"),
    videoUrl: formData.get("videoUrl"),
    isPublished: formData.get("isPublished") === "on",
    isSignature: formData.get("isSignature") === "on",
    isVegetarian: formData.get("isVegetarian") === "on",
    nameDe: formData.get("nameDe"),
    nameEn: formData.get("nameEn"),
    price: formData.get("price"),
    priceNoteDe: formData.get("priceNoteDe"),
    priceNoteEn: formData.get("priceNoteEn"),
    priceVariants: formData.get("priceVariants"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
  });

  await prisma.restaurantMenuItem.create({
    data: {
      ...(await normalizeItemData(
        parsed,
        getImageFile(formData),
        getVideoFile(formData)
      )),
      slug: createSlug(parsed.slug, parsed.nameDe),
    },
  });

  revalidateRestaurantMenu();
  redirect(withAdminNotice(returnTo, "created"));
}

export async function updateMenuItemAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/menu");

  const parsed = updateItemSchema.parse({
    allergens: formData.get("allergens"),
    categoryId: formData.get("categoryId"),
    descriptionDe: formData.get("descriptionDe"),
    descriptionEn: formData.get("descriptionEn"),
    id: formData.get("id"),
    imageUrl: formData.get("imageUrl"),
    videoUrl: formData.get("videoUrl"),
    isPublished: formData.get("isPublished") === "on",
    isSignature: formData.get("isSignature") === "on",
    isVegetarian: formData.get("isVegetarian") === "on",
    nameDe: formData.get("nameDe"),
    nameEn: formData.get("nameEn"),
    price: formData.get("price"),
    priceNoteDe: formData.get("priceNoteDe"),
    priceNoteEn: formData.get("priceNoteEn"),
    priceVariants: formData.get("priceVariants"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
  });

  await prisma.restaurantMenuItem.update({
    where: {
      id: parsed.id,
    },
    data: {
      ...(await normalizeItemData(
        parsed,
        getImageFile(formData),
        getVideoFile(formData)
      )),
      slug: createSlug(parsed.slug, parsed.nameDe),
    },
  });

  revalidateRestaurantMenu();
  redirect(withAdminNotice(returnTo, "saved"));
}

export async function deleteMenuItemAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/menu");
  const parsed = idSchema.parse({
    id: formData.get("id"),
  });

  await prisma.restaurantMenuItem.delete({
    where: {
      id: parsed.id,
    },
  });

  revalidateRestaurantMenu();
  redirect(withAdminNotice(returnTo, "deleted"));
}
