import { differenceInCalendarDays } from "date-fns";
import { z } from "zod";
import {
  BookingLifecycleActorType,
  BookingLifecycleEventType,
  BookingMealPlan,
  BookingStatus,
  Prisma,
  RoomType,
  type Room,
} from "@prisma/client";
import {
  assertBookableCheckInDateInput,
  parseHotelDateInput,
} from "@/lib/booking-dates";
import { buildBookingLifecycleEventData } from "@/lib/booking-lifecycle-events";
import {
  type AvailableRoom,
  type AvailableMealPlanOption,
  type BookingLocale,
  DOG_FEE_PER_NIGHT,
} from "@/lib/booking-shared";
import { prisma } from "@/lib/prisma";

export const ACTIVE_BOOKING_STATUSES = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
] as const;

const bookingDateSchema = z.object({
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
});

const createBookingSchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.number().int().min(1).max(4),
  mealPlan: z.nativeEnum(BookingMealPlan).default(BookingMealPlan.BREAKFAST),
  dogCount: z.number().int().min(0).max(4).default(0),
  bicycleReserved: z.boolean().default(false),
  restaurantReservationTime: z.string().trim().max(20).optional(),
  locale: z.enum(["de", "en", "ru"]).default("de"),
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(50).optional(),
  street: z.string().trim().min(1).max(180),
  postalCode: z.string().trim().min(1).max(20),
  city: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(2000).optional(),
  termsAcceptedAt: z.date().optional(),
  termsVersion: z.string().trim().max(40).optional(),
  emailVerifiedAt: z.date().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

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
    priceOneGuest: new Prisma.Decimal(79),
    priceTwoGuests: null,
    priceThreeGuests: null,
    priceFourGuests: null,
    breakfastPricePerGuest: new Prisma.Decimal(0),
    halfBoardPricePerGuest: new Prisma.Decimal(35),
    defaultMealPlan: BookingMealPlan.BREAKFAST,
    extraBedMax: 0,
    extraBedPrice: new Prisma.Decimal(0),
    imageUrl: "/Hotel/arched_window_bedroom_1600.webp",
    titleDe: "Einzelzimmer",
    titleEn: "Single room",
    titleRu: "Одноместный номер",
    shortDescriptionDe: "Ruhiges Zimmer fur Alleinreisende mit Boutique-Atmosphare.",
    shortDescriptionEn: "Quiet room for solo travellers with a boutique atmosphere.",
    shortDescriptionRu: "Тихий номер для одного гостя с бутик-атмосферой.",
    descriptionDe:
      "Ein ruhiger Ruckzugsort fur Alleinreisende mit hochwertigem Bett, naturlichen Materialien und wahlbarer Verpflegung.",
    descriptionEn:
      "A calm retreat for solo travellers with a high-quality bed, natural materials and selectable meal options.",
    descriptionRu:
      "Спокойный номер для одного гостя с качественной кроватью, натуральными материалами и выбором питания.",
    amenities: ["WiFi", "Dusche / Bad", "TV", "Fruhstuck wahlbar"],
    sortOrder: 1,
  },
  {
    slug: "double",
    type: RoomType.DOUBLE,
    inventory: 22,
    maxGuests: 4,
    basePrice: new Prisma.Decimal(125),
    priceOneGuest: new Prisma.Decimal(105),
    priceTwoGuests: new Prisma.Decimal(125),
    priceThreeGuests: new Prisma.Decimal(150),
    priceFourGuests: new Prisma.Decimal(175),
    breakfastPricePerGuest: new Prisma.Decimal(0),
    halfBoardPricePerGuest: new Prisma.Decimal(35),
    defaultMealPlan: BookingMealPlan.BREAKFAST,
    extraBedMax: 2,
    extraBedPrice: new Prisma.Decimal(25),
    imageUrl: "/Hotel/bedroom_balcony_1600.webp",
    titleDe: "Doppelzimmer",
    titleEn: "Double room",
    titleRu: "Двухместный номер",
    shortDescriptionDe: "Grosszugiges Zimmer fur zwei Gaste mit Blick in die Natur.",
    shortDescriptionEn: "Spacious room for two guests with views of the landscape.",
    shortDescriptionRu: "Просторный номер для двух гостей с видом на природу.",
    descriptionDe:
      "Grosszugig, hell und stilvoll komponiert mit komfortablem Doppelbett, Sitzbereich und wahlbarer Verpflegung.",
    descriptionEn:
      "Spacious, bright and elegantly composed with a comfortable double bed, seating area and selectable meal options.",
    descriptionRu:
      "Просторный, светлый и элегантный номер с большой кроватью, зоной отдыха и выбором питания.",
    amenities: ["WiFi", "Sitzbereich", "TV", "Fruhstuck wahlbar"],
    sortOrder: 2,
  },
] as const;

type PrismaRoomClient = {
  room: {
    upsert: typeof prisma.room.upsert;
  };
};

type AvailableRoomsQueryResult = Room[];

type ReservedRoomCount = {
  roomId: string;
  _count: {
    _all: number;
  };
};

type BookingCreationClient = typeof prisma;

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

const MEAL_PLAN_COPY: Record<
  BookingMealPlan,
  Record<BookingLocale, { description: string; label: string }>
> = {
  [BookingMealPlan.ROOM_ONLY]: {
    de: {
      label: "Ohne Fruhstuck",
      description: "Nur Ubernachtung, keine Verpflegung.",
    },
    en: {
      label: "Room only",
      description: "Accommodation without breakfast or dinner.",
    },
    ru: {
      label: "Без завтрака",
      description: "Только проживание, без питания.",
    },
  },
  [BookingMealPlan.BREAKFAST]: {
    de: {
      label: "Mit Fruhstuck",
      description: "Fruhstuck ist fur diese Anfrage vorausgewahlt.",
    },
    en: {
      label: "With breakfast",
      description: "Breakfast is preselected for this request.",
    },
    ru: {
      label: "С завтраком",
      description: "Этот вариант выбран по умолчанию.",
    },
  },
  [BookingMealPlan.HALF_BOARD]: {
    de: {
      label: "Fruhstuck + Abendessen",
      description: "Fruhstuck und Abendessen fur jeden Gast.",
    },
    en: {
      label: "Breakfast + dinner",
      description: "Breakfast and dinner for each guest.",
    },
    ru: {
      label: "Завтрак + ужин",
      description: "Завтрак и ужин для каждого гостя.",
    },
  },
};

function toDecimal(value: Prisma.Decimal | number | string | null | undefined) {
  return new Prisma.Decimal(value ?? 0);
}

function getOccupancyPrice(room: Room, guests: number) {
  const priceByGuests = {
    1: room.priceOneGuest,
    2: room.priceTwoGuests,
    3: room.priceThreeGuests,
    4: room.priceFourGuests,
  } as const;

  return toDecimal(priceByGuests[guests as 1 | 2 | 3 | 4] ?? room.basePrice);
}

function getMealPlanPricePerGuest(room: Room, mealPlan: BookingMealPlan) {
  if (mealPlan === BookingMealPlan.BREAKFAST) {
    return toDecimal(room.breakfastPricePerGuest);
  }

  if (mealPlan === BookingMealPlan.HALF_BOARD) {
    return toDecimal(room.halfBoardPricePerGuest);
  }

  return new Prisma.Decimal(0);
}

function getStandardGuestCapacity(room: Pick<Room, "type">) {
  return room.type === RoomType.SINGLE ? 1 : 2;
}

function getExtraBedCount(room: Pick<Room, "type" | "extraBedMax">, guests: number) {
  return Math.max(guests - getStandardGuestCapacity(room), 0);
}

function canHostGuestCount(room: Room, guests: number) {
  if (guests > room.maxGuests) {
    return false;
  }

  return getExtraBedCount(room, guests) <= room.extraBedMax;
}

function calculateRoomRate(room: Room, guests: number, mealPlan: BookingMealPlan) {
  if (!canHostGuestCount(room, guests)) {
    throw new Error("Guest count exceeds room capacity.");
  }

  const occupancyBasePrice = getOccupancyPrice(room, guests);
  const mealPlanPricePerGuest = getMealPlanPricePerGuest(room, mealPlan);
  const mealPlanTotalPerNight = mealPlanPricePerGuest.mul(guests);
  const extraBeds = getExtraBedCount(room, guests);
  const extraBedPricePerNight = toDecimal(room.extraBedPrice);
  const extraBedTotalPerNight = extraBedPricePerNight.mul(extraBeds);
  const totalPricePerNight = occupancyBasePrice
    .add(mealPlanTotalPerNight)
    .add(extraBedTotalPerNight);

  return {
    extraBeds,
    extraBedPricePerNight,
    extraBedTotalPerNight,
    mealPlanPricePerGuest,
    mealPlanTotalPerNight,
    occupancyBasePrice,
    totalPricePerNight,
  };
}

function getMealPlanOptions(
  room: Room,
  guests: number,
  nights: number,
  locale: BookingLocale
): AvailableMealPlanOption[] {
  return [
    BookingMealPlan.ROOM_ONLY,
    BookingMealPlan.BREAKFAST,
    BookingMealPlan.HALF_BOARD,
  ].map((mealPlan) => {
    const copy = MEAL_PLAN_COPY[mealPlan][locale];
    const pricePerGuest = Number(getMealPlanPricePerGuest(room, mealPlan));
    const pricePerNight = pricePerGuest * guests;

    return {
      description: copy.description,
      label: copy.label,
      pricePerGuest,
      pricePerNight,
      totalPrice: pricePerNight * nights,
      value: mealPlan,
    };
  });
}

export async function ensureDefaultRooms(client: PrismaRoomClient = prisma) {
  await Promise.all(
    DEFAULT_ROOMS.map((room) =>
      client.room.upsert({
        where: { slug: room.slug },
        update: {},
        create: {
          slug: room.slug,
          type: room.type,
          inventory: room.inventory,
          maxGuests: room.maxGuests,
          basePrice: room.basePrice,
          priceOneGuest: room.priceOneGuest,
          priceTwoGuests: room.priceTwoGuests,
          priceThreeGuests: room.priceThreeGuests,
          priceFourGuests: room.priceFourGuests,
          breakfastPricePerGuest: room.breakfastPricePerGuest,
          halfBoardPricePerGuest: room.halfBoardPricePerGuest,
          defaultMealPlan: room.defaultMealPlan,
          extraBedMax: room.extraBedMax,
          extraBedPrice: room.extraBedPrice,
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
  assertBookableCheckInDateInput(checkInInput);
  const normalizedLocale = toBookingLocale(locale);

  const roomResultsPromise: Promise<AvailableRoomsQueryResult> = prisma.room.findMany({
    where: {
      isActive: true,
      maxGuests: {
        gte: guests,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const reservedCountsPromise = (
    prisma.booking as unknown as {
      groupBy: (args: unknown) => Promise<ReservedRoomCount[]>;
    }
  ).groupBy({
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
  });

  const [rooms, reservedCounts]: [AvailableRoomsQueryResult, ReservedRoomCount[]] =
    await Promise.all([
      roomResultsPromise,
      reservedCountsPromise,
    ]);

  const reservedByRoom = new Map(
    reservedCounts.map((entry) => [entry.roomId, entry._count._all])
  );

  return rooms
    .map((room: Room) => {
      const reserved = reservedByRoom.get(room.id) ?? 0;
      const available = Math.max(room.inventory - reserved, 0);
      const localized = getLocalizedRoomField(room, normalizedLocale);
      if (!canHostGuestCount(room, guests)) {
        return null;
      }

      const defaultMealPlan = room.defaultMealPlan ?? BookingMealPlan.BREAKFAST;
      const rate = calculateRoomRate(room, guests, defaultMealPlan);
      const basePrice = Number(rate.totalPricePerNight);

      return {
        id: room.id,
        slug: room.slug,
        type: room.type,
        title: localized.title,
        description: localized.description,
        shortDescription: localized.shortDescription,
        imageUrl: room.imageUrl,
        gallery: normalizeAmenities(room.imageUrls),
        amenities: normalizeAmenities(room.amenities),
        basePrice,
        breakfastIncluded: defaultMealPlan !== BookingMealPlan.ROOM_ONLY,
        defaultMealPlan,
        extraBedMax: room.extraBedMax,
        extraBedPrice: Number(rate.extraBedPricePerNight),
        extraBedTotalPerNight: Number(rate.extraBedTotalPerNight),
        extraBeds: rate.extraBeds,
        inventory: room.inventory,
        bookedCount: reserved,
        availableCount: available,
        maxGuests: room.maxGuests,
        mealOptions: getMealPlanOptions(room, guests, nights, normalizedLocale),
        guests,
        nights,
        occupancyBasePrice: Number(rate.occupancyBasePrice),
        totalBasePrice: basePrice * nights,
        locale: normalizedLocale,
      } satisfies AvailableRoom;
    })
    .filter((room): room is AvailableRoom => Boolean(room && room.availableCount > 0));
}

async function prepareBookingCreation(
  input: CreateBookingInput,
  client: BookingCreationClient
) {
  const validated = createBookingSchema.parse(input);
  const checkIn = parseBookingDate(validated.checkIn);
  const checkOut = parseBookingDate(validated.checkOut);
  const nights = assertDateRange(checkIn, checkOut);
  assertBookableCheckInDateInput(validated.checkIn);

  await ensureDefaultRooms(client);

  const room = await client.room.findUnique({
    where: {
      id: validated.roomId,
    },
  });

  if (!room || !room.isActive) {
    throw new Error("Selected room is not available.");
  }

  if (!canHostGuestCount(room, validated.guests)) {
    throw new Error("Guest count exceeds room capacity.");
  }

  const overlappingBookings = await client.booking.count({
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

  const rate = calculateRoomRate(room, validated.guests, validated.mealPlan);
  const basePricePerNight = rate.occupancyBasePrice;
  const baseTotal = basePricePerNight.mul(nights);
  const mealPlanTotal = rate.mealPlanTotalPerNight.mul(nights);
  const extraBedTotal = rate.extraBedTotalPerNight.mul(nights);
  const dogFeePerNight = new Prisma.Decimal(DOG_FEE_PER_NIGHT);
  const dogFeeTotal = dogFeePerNight.mul(validated.dogCount).mul(nights);
  const totalAmount = baseTotal
    .add(mealPlanTotal)
    .add(extraBedTotal)
    .add(dogFeeTotal);

  return {
    basePricePerNight,
    baseTotal,
    checkIn,
    checkOut,
    dogFeePerNight,
    dogFeeTotal,
    extraBedTotal,
    mealPlanTotal,
    nights,
    rate,
    room,
    totalAmount,
    validated,
  };
}

export async function validateBookingRequest(input: CreateBookingInput) {
  await prepareBookingCreation(input, prisma);
}

export async function createBooking(input: CreateBookingInput) {
  return prisma.$transaction(async (tx) => {
    const transactionClient = tx as unknown as typeof prisma;
    const {
      basePricePerNight,
      baseTotal,
      checkIn,
      checkOut,
      dogFeePerNight,
      dogFeeTotal,
      extraBedTotal,
      mealPlanTotal,
      nights,
      rate,
      room,
      totalAmount,
      validated,
    } = await prepareBookingCreation(input, transactionClient);

    const guest = await transactionClient.guest.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone || null,
        street: validated.street,
        postalCode: validated.postalCode,
        city: validated.city,
        country: validated.country,
        notes: validated.notes || null,
        locale: validated.locale,
      },
    });

    const booking = await transactionClient.booking.create({
      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: validated.guests,
        nights,
        basePricePerNight,
        baseTotal,
        mealPlan: validated.mealPlan,
        mealPlanPricePerGuest: rate.mealPlanPricePerGuest,
        mealPlanTotal,
        extraBeds: rate.extraBeds,
        extraBedPricePerNight: rate.extraBedPricePerNight,
        extraBedTotal,
        dogCount: validated.dogCount,
        dogFeePerNight,
        dogFeeTotal,
        bicycleReserved: validated.bicycleReserved,
        restaurantReservationTime:
          validated.restaurantReservationTime?.trim() || null,
        totalAmount,
        breakfastIncluded: validated.mealPlan !== BookingMealPlan.ROOM_ONLY,
        notes: validated.notes || null,
        termsAcceptedAt: validated.termsAcceptedAt ?? null,
        termsVersion: validated.termsVersion ?? null,
        emailVerifiedAt: validated.emailVerifiedAt ?? null,
        locale: validated.locale,
      },
      include: {
        guest: true,
        room: true,
      },
    });

    await transactionClient.bookingLifecycleEvent.create({
      data: buildBookingLifecycleEventData({
        bookingId: booking.id,
        eventType: BookingLifecycleEventType.CREATED,
        actorType: BookingLifecycleActorType.GUEST,
        toStatus: booking.status,
        details: {
          source: "WEB",
        },
      }),
    });

    return {
      bookingId: booking.id,
      roomType:
        ROOM_TYPE_LABELS[room.type as RoomType][
          toBookingLocale(validated.locale)
        ],
      totalAmount: Number(totalAmount),
      checkIn: validated.checkIn,
      checkOut: validated.checkOut,
      nights,
      guests: validated.guests,
      mealPlanLabel: MEAL_PLAN_COPY[validated.mealPlan][
        toBookingLocale(validated.locale)
      ].label,
      firstName: validated.firstName,
      lastName: validated.lastName,
      email: validated.email,
      phone: validated.phone ?? null,
      street: validated.street,
      postalCode: validated.postalCode,
      city: validated.city,
      country: validated.country,
    };
  });
}

export function getRoomTypeLabel(type: RoomType, locale: BookingLocale) {
  return ROOM_TYPE_LABELS[type][toBookingLocale(locale)];
}

export function getMealPlanLabel(
  mealPlan: BookingMealPlan,
  locale: BookingLocale
) {
  return MEAL_PLAN_COPY[mealPlan][toBookingLocale(locale)].label;
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
