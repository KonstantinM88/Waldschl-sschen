import { differenceInCalendarDays } from "date-fns";
import { BookingStatus, Prisma, RoomType } from "@prisma/client";
import { z } from "zod";
import { parseHotelDateInput } from "@/lib/booking-dates";
import { prisma } from "@/lib/prisma";

export type BookingLocale = "de" | "en" | "ru";

export interface AvailableRoom {
  amenities: string[];
  availableCount: number;
  basePrice: number;
  bookedCount: number;
  breakfastIncluded: boolean;
  description: string;
  guests: number;
  id: string;
  imageUrl: string | null;
  inventory: number;
  locale: BookingLocale;
  maxGuests: number;
  nights: number;
  shortDescription: string | null;
  slug: string;
  title: string;
  totalBasePrice: number;
  type: RoomType;
}

export const ACTIVE_BOOKING_STATUSES = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
] as const;

export const DOG_FEE_PER_NIGHT = 15;
export const FREE_BICYCLE_PRICE = 0;

const bookingDateSchema = z.object({
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
});

const createBookingSchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.number().int().min(1).max(2),
  dogCount: z.number().int().min(0).max(4).default(0),
  bicycleReserved: z.boolean().default(false),
  restaurantReservationTime: z.string().trim().max(20).optional(),
  locale: z.enum(["de", "en", "ru"]).default("de"),
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(50).optional(),
  notes: z.string().trim().max(2000).optional(),
});

const ROOM_TYPE_LABELS: Record<RoomType, Record<BookingLocale, string>> = {
  SINGLE: {
    de: "Einzelzimmer",
    en: "Single room",
    ru: "Одноместный номер",
  },
  DOUBLE: {
    de: "Doppelzimmer",
    en: "Double room",
    ru: "Двухместный номер",
  },
};

const DEFAULT_ROOMS = [
  {
    slug: "single",
    type: RoomType.SINGLE,
    inventory: 2,
    maxGuests: 1,
    basePrice: new Prisma.Decimal(79),
    imageUrl: "/Hotel/arched_window_bedroom_1600.webp",
    titleDe: "Einzelzimmer",
    titleEn: "Single room",
    titleRu: "Одноместный номер",
    shortDescriptionDe: "Ruhiges Zimmer fur Alleinreisende mit Boutique-Atmosphare.",
    shortDescriptionEn: "Quiet room for solo travellers with a boutique atmosphere.",
    shortDescriptionRu: "Тихий номер для одного гостя с бутик-атмосферой.",
    descriptionDe:
      "Ein ruhiger Ruckzugsort fur Alleinreisende mit hochwertigem Bett, naturlichen Materialien und reichhaltigem Fruhstucksbuffet inklusive.",
    descriptionEn:
      "A calm retreat for solo travellers with a high-quality bed, natural materials and a rich breakfast buffet included.",
    descriptionRu:
      "Спокойный номер для одного гостя с качественной кроватью, натуральными материалами и включённым завтраком-буфетом.",
    amenities: ["WiFi", "Dusche / Bad", "TV", "Frühstück inklusive"],
    sortOrder: 1,
  },
  {
    slug: "double",
    type: RoomType.DOUBLE,
    inventory: 22,
    maxGuests: 2,
    basePrice: new Prisma.Decimal(125),
    imageUrl: "/Hotel/bedroom_balcony_1600.webp",
    titleDe: "Doppelzimmer",
    titleEn: "Double room",
    titleRu: "Двухместный номер",
    shortDescriptionDe: "Grosszugiges Zimmer fur zwei Gaste mit Blick in die Natur.",
    shortDescriptionEn: "Spacious room for two guests with views of the landscape.",
    shortDescriptionRu: "Просторный номер для двух гостей с видом на природу.",
    descriptionDe:
      "Grosszugig, hell und stilvoll komponiert mit komfortablem Doppelbett, Sitzbereich und reichhaltigem Fruhstucksbuffet inklusive.",
    descriptionEn:
      "Spacious, bright and elegantly composed with a comfortable double bed, seating area and a rich breakfast buffet included.",
    descriptionRu:
      "Просторный, светлый и элегантный номер с большой кроватью, зоной отдыха и включённым завтраком-буфетом.",
    amenities: ["WiFi", "Sitzbereich", "TV", "Frühstück inklusive"],
    sortOrder: 2,
  },
] as const;

type PrismaRoomClient =
  | Pick<typeof prisma, "room">
  | Pick<Prisma.TransactionClient, "room">;

function toBookingLocale(locale?: string | null): BookingLocale {
  return locale === "en" || locale === "ru" ? locale : "de";
}

function parseBookingDate(value: string) {
  return parseHotelDateInput(value);
}

function assertDateRange(checkIn: Date, checkOut: Date) {
  const nights = differenceInCalendarDays(checkOut, checkIn);

  if (!Number.isFinite(nights) || nights < 1) {
    throw new Error("Invalid booking date range.");
  }

  return nights;
}

function getLocalizedRoomField(room: {
  descriptionDe: string;
  descriptionEn: string;
  descriptionRu: string;
  shortDescriptionDe: string | null;
  shortDescriptionEn: string | null;
  shortDescriptionRu: string | null;
  titleDe: string;
  titleEn: string;
  titleRu: string;
}, locale: BookingLocale) {
  if (locale === "en") {
    return {
      title: room.titleEn,
      description: room.descriptionEn,
      shortDescription: room.shortDescriptionEn,
    };
  }

  if (locale === "ru") {
    return {
      title: room.titleRu,
      description: room.descriptionRu,
      shortDescription: room.shortDescriptionRu,
    };
  }

  return {
    title: room.titleDe,
    description: room.descriptionDe,
    shortDescription: room.shortDescriptionDe,
  };
}

export function normalizeAmenities(amenities: unknown) {
  if (Array.isArray(amenities)) {
    return amenities
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  return [];
}

export async function ensureDefaultRooms(client: PrismaRoomClient = prisma) {
  await Promise.all(
    DEFAULT_ROOMS.map((room) =>
      client.room.upsert({
        where: { slug: room.slug },
        update: {
          inventory: room.inventory,
          maxGuests: room.maxGuests,
          breakfastIncluded: true,
          sortOrder: room.sortOrder,
          type: room.type,
        },
        create: {
          slug: room.slug,
          type: room.type,
          inventory: room.inventory,
          maxGuests: room.maxGuests,
          basePrice: room.basePrice,
          breakfastIncluded: true,
          isActive: true,
          sortOrder: room.sortOrder,
          titleDe: room.titleDe,
          titleEn: room.titleEn,
          titleRu: room.titleRu,
          shortDescriptionDe: room.shortDescriptionDe,
          shortDescriptionEn: room.shortDescriptionEn,
          shortDescriptionRu: room.shortDescriptionRu,
          descriptionDe: room.descriptionDe,
          descriptionEn: room.descriptionEn,
          descriptionRu: room.descriptionRu,
          imageUrl: room.imageUrl,
          amenities: room.amenities,
        },
      })
    )
  );
}

export async function getAvailableRooms(
  checkInInput: string,
  checkOutInput: string,
  guests: number,
  locale: BookingLocale = "de"
): Promise<AvailableRoom[]> {
  bookingDateSchema.parse({
    checkIn: checkInInput,
    checkOut: checkOutInput,
  });

  if (!Number.isInteger(guests) || guests < 1) {
    throw new Error("Guests must be a positive integer.");
  }

  await ensureDefaultRooms();

  const checkIn = parseBookingDate(checkInInput);
  const checkOut = parseBookingDate(checkOutInput);
  const nights = assertDateRange(checkIn, checkOut);
  const normalizedLocale = toBookingLocale(locale);

  const [rooms, reservedCounts] = await Promise.all([
    prisma.room.findMany({
      where: {
        isActive: true,
        maxGuests: {
          gte: guests,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.booking.groupBy({
      by: ["roomId"],
      where: {
        status: {
          in: [...ACTIVE_BOOKING_STATUSES],
        },
        checkIn: {
          lt: checkOut,
        },
        checkOut: {
          gt: checkIn,
        },
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const reservedByRoom = new Map(
    reservedCounts.map((entry) => [entry.roomId, entry._count._all])
  );

  return rooms
    .map((room) => {
      const reserved = reservedByRoom.get(room.id) ?? 0;
      const available = Math.max(room.inventory - reserved, 0);
      const localized = getLocalizedRoomField(room, normalizedLocale);
      const basePrice = Number(room.basePrice);

      return {
        id: room.id,
        slug: room.slug,
        type: room.type,
        title: localized.title,
        description: localized.description,
        shortDescription: localized.shortDescription,
        imageUrl: room.imageUrl,
        amenities: normalizeAmenities(room.amenities),
        basePrice,
        breakfastIncluded: room.breakfastIncluded,
        inventory: room.inventory,
        bookedCount: reserved,
        availableCount: available,
        maxGuests: room.maxGuests,
        guests,
        nights,
        totalBasePrice: basePrice * nights,
        locale: normalizedLocale,
      } satisfies AvailableRoom;
    })
    .filter((room) => room.availableCount > 0);
}

export async function createBooking(input: z.infer<typeof createBookingSchema>) {
  const validated = createBookingSchema.parse(input);
  const checkIn = parseBookingDate(validated.checkIn);
  const checkOut = parseBookingDate(validated.checkOut);
  const nights = assertDateRange(checkIn, checkOut);

  return prisma.$transaction(async (tx) => {
    await ensureDefaultRooms(tx);

    const room = await tx.room.findUnique({
      where: {
        id: validated.roomId,
      },
    });

    if (!room || !room.isActive) {
      throw new Error("Selected room is not available.");
    }

    if (validated.guests > room.maxGuests) {
      throw new Error("Guest count exceeds room capacity.");
    }

    const overlappingBookings = await tx.booking.count({
      where: {
        roomId: room.id,
        status: {
          in: [...ACTIVE_BOOKING_STATUSES],
        },
        checkIn: {
          lt: checkOut,
        },
        checkOut: {
          gt: checkIn,
        },
      },
    });

    if (overlappingBookings >= room.inventory) {
      throw new Error("Room inventory is sold out for the selected dates.");
    }

    const basePricePerNight = room.basePrice;
    const baseTotal = basePricePerNight.mul(nights);
    const dogFeePerNight = new Prisma.Decimal(DOG_FEE_PER_NIGHT);
    const dogFeeTotal = dogFeePerNight.mul(validated.dogCount).mul(nights);
    const totalAmount = baseTotal.add(dogFeeTotal);

    const guest = await tx.guest.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone || null,
        notes: validated.notes || null,
        locale: validated.locale,
      },
    });

    const booking = await tx.booking.create({
      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: validated.guests,
        nights,
        basePricePerNight,
        baseTotal,
        dogCount: validated.dogCount,
        dogFeePerNight,
        dogFeeTotal,
        bicycleReserved: validated.bicycleReserved,
        restaurantReservationTime:
          validated.restaurantReservationTime?.trim() || null,
        totalAmount,
        breakfastIncluded: room.breakfastIncluded,
        notes: validated.notes || null,
        locale: validated.locale,
      },
      include: {
        guest: true,
        room: true,
      },
    });

    return {
      bookingId: booking.id,
      roomType: ROOM_TYPE_LABELS[room.type][toBookingLocale(validated.locale)],
      totalAmount: Number(totalAmount),
    };
  });
}

export function getRoomTypeLabel(type: RoomType, locale: BookingLocale) {
  return ROOM_TYPE_LABELS[type][toBookingLocale(locale)];
}

export function getDefaultRestaurantTimeOptions(locale: BookingLocale) {
  const label = {
    de: "Tischreservierung am Anreisetag",
    en: "Restaurant table on arrival evening",
    ru: "Столик в ресторане в вечер заезда",
  }[toBookingLocale(locale)];

  return {
    label,
    options: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
  };
}
