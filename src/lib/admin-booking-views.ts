import { BookingStatus, type Room } from "@prisma/client";
import {
  getBookingAnalytics,
  getCalendarMonth,
  getTodayBoard,
  lazyProcessExpiredBookings,
  type BookingAnalytics,
  type CalendarMonth,
} from "@/lib/booking-lifecycle";
import { ensureDefaultRooms } from "@/lib/booking-engine";
import { prisma } from "@/lib/prisma";

export interface AdminRoomOption {
  id: string;
  type: Room["type"];
  titleDe: string;
  titleEn: string;
  titleRu: string;
  roomNumber: string | null;
  maxGuests: number;
  inventory: number;
  basePrice: number;
  priceOneGuest: number | null;
  priceTwoGuests: number | null;
  priceThreeGuests: number | null;
  priceFourGuests: number | null;
  breakfastPricePerGuest: number;
  halfBoardPricePerGuest: number;
  extraBedMax: number;
  extraBedPrice: number;
  defaultMealPlan: Room["defaultMealPlan"];
}

function toNumber(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }
  return Number(value);
}

/**
 * Active rooms, shaped for the manual booking form so it can compute prices
 * client-side without another round trip.
 */
export async function getActiveRoomOptions(): Promise<AdminRoomOption[]> {
  await ensureDefaultRooms();

  const rooms = await prisma.room.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return rooms.map((room) => ({
    id: room.id,
    type: room.type,
    titleDe: room.titleDe,
    titleEn: room.titleEn,
    titleRu: room.titleRu,
    roomNumber: room.roomNumber,
    maxGuests: room.maxGuests,
    inventory: room.inventory,
    basePrice: Number(room.basePrice),
    priceOneGuest: toNumber(room.priceOneGuest),
    priceTwoGuests: toNumber(room.priceTwoGuests),
    priceThreeGuests: toNumber(room.priceThreeGuests),
    priceFourGuests: toNumber(room.priceFourGuests),
    breakfastPricePerGuest: Number(room.breakfastPricePerGuest),
    halfBoardPricePerGuest: Number(room.halfBoardPricePerGuest),
    extraBedMax: room.extraBedMax,
    extraBedPrice: Number(room.extraBedPrice),
    defaultMealPlan: room.defaultMealPlan,
  }));
}

/**
 * Per-status totals for the bookings filter chips / overview board.
 */
export async function getBookingStatusCounts(): Promise<
  Record<BookingStatus, number>
> {
  const grouped = await (
    prisma.booking as unknown as {
      groupBy: (args: unknown) => Promise<
        { status: BookingStatus; _count: { _all: number } }[]
      >;
    }
  ).groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const counts: Record<BookingStatus, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
    CHECKED_IN: 0,
    CHECKED_OUT: 0,
    NO_SHOW: 0,
  };

  for (const entry of grouped) {
    counts[entry.status] = entry._count._all;
  }

  return counts;
}

export function normalizeCalendarMonthParam(
  value?: string | null,
  reference: Date = new Date()
) {
  const match = /^(\d{4})-(\d{2})$/.exec(value ?? "");

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (year >= 2000 && year <= 2100 && month >= 1 && month <= 12) {
      return { year, month };
    }
  }

  return {
    year: reference.getFullYear(),
    month: reference.getMonth() + 1,
  };
}

export function shiftCalendarMonth(year: number, month: number, delta: number) {
  const base = new Date(Date.UTC(year, month - 1 + delta, 1, 12));
  return {
    year: base.getUTCFullYear(),
    month: base.getUTCMonth() + 1,
  };
}

export function formatCalendarMonthParam(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function normalizeAnalyticsRange(value?: string | null) {
  const parsed = Number.parseInt(value ?? "", 10);
  const allowed = [7, 30, 90, 365];
  return allowed.includes(parsed) ? parsed : 30;
}

/**
 * Calendar data with a throttled lazy sweep so the view is accurate even
 * without an external cron configured.
 */
export async function getAdminCalendarMonth(
  year: number,
  month: number
): Promise<CalendarMonth> {
  await lazyProcessExpiredBookings();
  return getCalendarMonth(year, month);
}

export async function getAdminAnalytics(
  rangeDays: number
): Promise<BookingAnalytics> {
  await lazyProcessExpiredBookings();
  return getBookingAnalytics(rangeDays);
}

export async function getAdminTodayBoard() {
  await lazyProcessExpiredBookings();
  return getTodayBoard();
}
