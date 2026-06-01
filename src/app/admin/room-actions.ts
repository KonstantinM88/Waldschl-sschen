"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BookingMealPlan, Prisma, RoomType } from "@prisma/client";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-dashboard";
import {
  deleteUploadedPublicFile,
  saveUploadedImageAsWebp,
} from "@/lib/admin-image-upload";
import { resolveAdminReturnTo, withAdminNotice } from "@/lib/admin-feedback";
import { normalizeAmenities } from "@/lib/booking-engine";
import { prisma } from "@/lib/prisma";
import { slugifyMenuValue } from "@/lib/restaurant-menu";

const MAX_ROOM_IMAGES = 5;
const ROOM_IMAGE_UPLOAD_FOLDER = "rooms";

const roomNumberSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)
  .refine((value) => !value || /^\d{3}$/.test(value), {
    message: "Room number must contain exactly three digits.",
  });

const optionalMoneySchema = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().min(0).optional()
);

const roomBaseSchema = z.object({
  basePrice: z.coerce.number().positive(),
  priceOneGuest: optionalMoneySchema,
  priceTwoGuests: optionalMoneySchema,
  priceThreeGuests: optionalMoneySchema,
  priceFourGuests: optionalMoneySchema,
  breakfastPricePerGuest: z.coerce.number().min(0).default(0),
  halfBoardPricePerGuest: z.coerce.number().min(0).default(0),
  defaultMealPlan: z.nativeEnum(BookingMealPlan).default(BookingMealPlan.BREAKFAST),
  extraBedMax: z.coerce.number().int().min(0).max(4).default(0),
  extraBedPrice: z.coerce.number().min(0).default(0),
  descriptionDe: z.string().trim().optional(),
  descriptionEn: z.string().trim().optional(),
  descriptionRu: z.string().trim().optional(),
  inventory: z.coerce.number().int().min(0),
  isActive: z.boolean().default(false),
  maxGuests: z.coerce.number().int().min(1).max(10),
  recommendationDe: z.string().trim().optional(),
  recommendationEn: z.string().trim().optional(),
  recommendationRu: z.string().trim().optional(),
  roomNumber: roomNumberSchema,
  shortDescriptionDe: z.string().trim().optional(),
  shortDescriptionEn: z.string().trim().optional(),
  shortDescriptionRu: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  titleDe: z.string().trim().min(1),
  titleEn: z.string().trim().optional(),
  titleRu: z.string().trim().optional(),
  type: z.nativeEnum(RoomType),
});

const roomCreateSchema = roomBaseSchema.extend({
  slug: z.string().trim().optional(),
});

const roomUpdateSchema = roomBaseSchema.extend({
  id: z.string().min(1),
});

const idSchema = z.object({
  id: z.string().min(1),
});

type RoomFormData = z.infer<typeof roomBaseSchema>;

function getImageFiles(formData: FormData) {
  return formData
    .getAll("imageFiles")
    .filter((file): file is File => file instanceof File && file.size > 0);
}

function getStringList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
}

function normalizeImageUrls(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, MAX_ROOM_IMAGES);
}

function getExistingRoomImages(room: {
  imageUrl: string | null;
  imageUrls: Prisma.JsonValue | null;
}) {
  const gallery = normalizeImageUrls(room.imageUrls);

  if (gallery.length) {
    return gallery;
  }

  return room.imageUrl ? [room.imageUrl] : [];
}

function getAmenities(formData: FormData) {
  const selectedAmenities = getStringList(formData, "amenity");
  const customAmenities = String(formData.get("customAmenities") ?? "")
    .split(/\r?\n/g)
    .map((item) => item.trim())
    .filter(Boolean);

  return normalizeAmenities([...selectedAmenities, ...customAmenities]);
}

async function buildRoomImages(
  existingImages: string[],
  deletedImages: string[],
  uploadFiles: File[]
) {
  const deletedSet = new Set(deletedImages);
  const keptImages = existingImages.filter((imageUrl) => !deletedSet.has(imageUrl));
  const availableSlots = MAX_ROOM_IMAGES - keptImages.length;

  if (uploadFiles.length > availableSlots) {
    throw new Error(`A room can have up to ${MAX_ROOM_IMAGES} photos.`);
  }

  const uploadedImages: string[] = [];

  for (const file of uploadFiles) {
    const uploadedImage = await saveUploadedImageAsWebp(
      file,
      ROOM_IMAGE_UPLOAD_FOLDER
    );

    if (uploadedImage) {
      uploadedImages.push(uploadedImage);
    }
  }

  await Promise.all(deletedImages.map((imageUrl) => deleteUploadedPublicFile(imageUrl)));

  return [...keptImages, ...uploadedImages].slice(0, MAX_ROOM_IMAGES);
}

function getRoomTextData(parsed: RoomFormData) {
  const titleEn = parsed.titleEn?.trim() || parsed.titleDe;
  const titleRu = parsed.titleRu?.trim() || parsed.titleDe;
  const descriptionDe = parsed.descriptionDe?.trim() || parsed.titleDe;
  const descriptionEn = parsed.descriptionEn?.trim() || titleEn;
  const descriptionRu = parsed.descriptionRu?.trim() || titleRu;

  return {
    titleDe: parsed.titleDe,
    titleEn,
    titleRu,
    descriptionDe,
    descriptionEn,
    descriptionRu,
    shortDescriptionDe: parsed.shortDescriptionDe?.trim() || null,
    shortDescriptionEn: parsed.shortDescriptionEn?.trim() || null,
    shortDescriptionRu: parsed.shortDescriptionRu?.trim() || null,
    recommendationDe: parsed.recommendationDe?.trim() || null,
    recommendationEn: parsed.recommendationEn?.trim() || null,
    recommendationRu: parsed.recommendationRu?.trim() || null,
  };
}

function optionalDecimal(value: number | undefined) {
  return typeof value === "number" ? new Prisma.Decimal(value) : null;
}

function getRoomData(
  parsed: RoomFormData,
  amenities: string[],
  imageUrls: string[]
) {
  return {
    ...getRoomTextData(parsed),
    amenities,
    basePrice: new Prisma.Decimal(parsed.basePrice),
    priceOneGuest: optionalDecimal(parsed.priceOneGuest),
    priceTwoGuests: optionalDecimal(parsed.priceTwoGuests),
    priceThreeGuests: optionalDecimal(parsed.priceThreeGuests),
    priceFourGuests: optionalDecimal(parsed.priceFourGuests),
    breakfastPricePerGuest: new Prisma.Decimal(parsed.breakfastPricePerGuest),
    halfBoardPricePerGuest: new Prisma.Decimal(parsed.halfBoardPricePerGuest),
    defaultMealPlan: parsed.defaultMealPlan,
    extraBedMax: parsed.extraBedMax,
    extraBedPrice: new Prisma.Decimal(parsed.extraBedPrice),
    breakfastIncluded: parsed.defaultMealPlan !== BookingMealPlan.ROOM_ONLY,
    imageUrl: imageUrls[0] ?? null,
    imageUrls: imageUrls.length ? imageUrls : Prisma.JsonNull,
    inventory: parsed.inventory,
    isActive: parsed.isActive,
    maxGuests: parsed.maxGuests,
    roomNumber: parsed.roomNumber ?? null,
    sortOrder: parsed.sortOrder,
    type: parsed.type,
  };
}

async function createUniqueRoomSlug(inputSlug: string | undefined, fallback: string) {
  const baseSlug = slugifyMenuValue(inputSlug?.trim() || fallback || "room");
  let candidate = baseSlug;
  let suffix = 2;

  while (await prisma.room.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function revalidateRooms() {
  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/rooms");
  revalidatePath("/de/hotel/buchen");
  revalidatePath("/de/hotel/buchen/checkout");
  revalidatePath("/en/hotel/buchen");
  revalidatePath("/en/hotel/buchen/checkout");
}

export async function createRoomAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/rooms");
  const parsed = roomCreateSchema.parse({
    basePrice: formData.get("basePrice"),
    priceOneGuest: formData.get("priceOneGuest"),
    priceTwoGuests: formData.get("priceTwoGuests"),
    priceThreeGuests: formData.get("priceThreeGuests"),
    priceFourGuests: formData.get("priceFourGuests"),
    breakfastPricePerGuest: formData.get("breakfastPricePerGuest"),
    halfBoardPricePerGuest: formData.get("halfBoardPricePerGuest"),
    defaultMealPlan: formData.get("defaultMealPlan"),
    extraBedMax: formData.get("extraBedMax"),
    extraBedPrice: formData.get("extraBedPrice"),
    descriptionDe: formData.get("descriptionDe"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionRu: formData.get("descriptionRu"),
    inventory: formData.get("inventory"),
    isActive: formData.get("isActive") === "on",
    maxGuests: formData.get("maxGuests"),
    recommendationDe: formData.get("recommendationDe"),
    recommendationEn: formData.get("recommendationEn"),
    recommendationRu: formData.get("recommendationRu"),
    roomNumber: formData.get("roomNumber"),
    shortDescriptionDe: formData.get("shortDescriptionDe"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    shortDescriptionRu: formData.get("shortDescriptionRu"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
    titleRu: formData.get("titleRu"),
    type: formData.get("type"),
  });

  const amenities = getAmenities(formData);
  const imageUrls = await buildRoomImages([], [], getImageFiles(formData));
  const fallbackSlug = parsed.roomNumber
    ? `zimmer-${parsed.roomNumber}`
    : parsed.titleDe;
  const slug = await createUniqueRoomSlug(parsed.slug, fallbackSlug);
  const sortOrder =
    parsed.sortOrder ||
    ((await prisma.room.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? 0) + 1;

  await prisma.room.create({
    data: {
      ...getRoomData({ ...parsed, sortOrder }, amenities, imageUrls),
      slug,
    },
  });

  revalidateRooms();
  redirect(withAdminNotice(returnTo, "created"));
}

export async function updateRoomAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/rooms");

  const parsed = roomUpdateSchema.parse({
    basePrice: formData.get("basePrice"),
    priceOneGuest: formData.get("priceOneGuest"),
    priceTwoGuests: formData.get("priceTwoGuests"),
    priceThreeGuests: formData.get("priceThreeGuests"),
    priceFourGuests: formData.get("priceFourGuests"),
    breakfastPricePerGuest: formData.get("breakfastPricePerGuest"),
    halfBoardPricePerGuest: formData.get("halfBoardPricePerGuest"),
    defaultMealPlan: formData.get("defaultMealPlan"),
    extraBedMax: formData.get("extraBedMax"),
    extraBedPrice: formData.get("extraBedPrice"),
    descriptionDe: formData.get("descriptionDe"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionRu: formData.get("descriptionRu"),
    id: formData.get("id"),
    inventory: formData.get("inventory"),
    isActive: formData.get("isActive") === "on",
    maxGuests: formData.get("maxGuests"),
    recommendationDe: formData.get("recommendationDe"),
    recommendationEn: formData.get("recommendationEn"),
    recommendationRu: formData.get("recommendationRu"),
    roomNumber: formData.get("roomNumber"),
    shortDescriptionDe: formData.get("shortDescriptionDe"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    shortDescriptionRu: formData.get("shortDescriptionRu"),
    sortOrder: formData.get("sortOrder"),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
    titleRu: formData.get("titleRu"),
    type: formData.get("type"),
  });

  const currentRoom = await prisma.room.findUniqueOrThrow({
    where: {
      id: parsed.id,
    },
    select: {
      imageUrl: true,
      imageUrls: true,
    },
  });
  const amenities = getAmenities(formData);
  const imageUrls = await buildRoomImages(
    getExistingRoomImages(currentRoom),
    getStringList(formData, "deleteImageUrls"),
    getImageFiles(formData)
  );

  await prisma.room.update({
    where: {
      id: parsed.id,
    },
    data: getRoomData(parsed, amenities, imageUrls),
  });

  revalidateRooms();
  redirect(withAdminNotice(returnTo, "saved"));
}

export async function deleteRoomAction(formData: FormData) {
  await requireAdminSession();
  const returnTo = resolveAdminReturnTo(formData.get("returnTo"), "/admin/rooms");
  const parsed = idSchema.parse({
    id: formData.get("id"),
  });
  const [room, bookingCount] = await Promise.all([
    prisma.room.findUniqueOrThrow({
      where: {
        id: parsed.id,
      },
      select: {
        imageUrl: true,
        imageUrls: true,
      },
    }),
    prisma.booking.count({
      where: {
        roomId: parsed.id,
      },
    }),
  ]);

  if (bookingCount > 0) {
    redirect(withAdminNotice(returnTo, "delete-blocked", "warning"));
  }

  await prisma.room.delete({
    where: {
      id: parsed.id,
    },
  });
  await Promise.all(
    getExistingRoomImages(room).map((imageUrl) => deleteUploadedPublicFile(imageUrl))
  );

  revalidateRooms();
  redirect(withAdminNotice(returnTo, "deleted"));
}
