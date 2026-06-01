import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { z } from "zod";
import {
  BookingMealPlan,
  BookingSource,
  BookingStatus,
  Prisma,
  RoomType,
  type Room,
} from "@prisma/client";
import { parseHotelDateInput } from "@/lib/booking-dates";
import {
  ACTIVE_BOOKING_STATUSES,
  ensureDefaultRooms,
} from "@/lib/booking-engine";
import { DOG_FEE_PER_NIGHT } from "@/lib/booking-shared";
import { prisma } from "@/lib/prisma";

/**
 * Status transition matrix. The admin UI only ever offers transitions that are
 * allowed here, and the server action re-validates against the same map so a
 * crafted request can never push a booking into an inconsistent state.
 */
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED", "NO_SHOW"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  CHECKED_IN: ["CHECKED_OUT"],
  CHECKED_OUT: [],
  CANCELLED: ["PENDING"],
  NO_SHOW: ["PENDING"],
};

export function canTransitionBooking(from: BookingStatus, to: BookingStatus) {
  if (from === to) {
    return true;
  }

  return BOOKING_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Status occupies inventory (counts against availability). CANCELLED / NO_SHOW /
 * CHECKED_OUT do not, which is what frees the room automatically.
 */
export function statusHoldsInventory(status: BookingStatus) {
  return (ACTIVE_BOOKING_STATUSES as readonly BookingStatus[]).includes(status);
}

function lifecycleTimestampPatch(
  status: BookingStatus,
  now: Date
): Prisma.BookingUpdateInput {
  switch (status) {
    case "CONFIRMED":
      return { confirmedAt: now };
    case "CHECKED_IN":
      return { checkedInAt: now };
    case "CHECKED_OUT":
      return { checkedOutAt: now };
    case "CANCELLED":
      return { cancelledAt: now };
    default:
      return {};
  }
}

/**
 * Returns the lifecycle timestamp field(s) that should be written when a booking
 * moves into `status`. Exposed so the status-update action can merge it.
 */
export function getStatusTimestampPatch(status: BookingStatus) {
  return lifecycleTimestampPatch(status, new Date());
}

// ---------------------------------------------------------------------------
// Automatic room release (expiry sweep)
// ---------------------------------------------------------------------------

export interface ExpirySweepResult {
  checkedOut: number;
  noShow: number;
  processedAt: string;
}

/**
 * Frees rooms that should no longer hold inventory:
 *
 *  - CHECKED_IN bookings whose checkOut date has passed  -> CHECKED_OUT
 *  - PENDING / CONFIRMED bookings whose checkOut has passed and were never
 *    checked in                                           -> NO_SHOW
 *
 * Idempotent: running it twice changes nothing the second time. Called both
 * on-demand (cron route) and lazily on admin reads.
 */
export async function processExpiredBookings(
  reference: Date = new Date()
): Promise<ExpirySweepResult> {
  const today = startOfDay(reference);

  const [checkedOut, noShow] = await prisma.$transaction([
    prisma.booking.updateMany({
      where: {
        status: BookingStatus.CHECKED_IN,
        checkOut: { lte: today },
      },
      data: {
        status: BookingStatus.CHECKED_OUT,
        checkedOutAt: reference,
        autoCompletedAt: reference,
      },
    }),
    prisma.booking.updateMany({
      where: {
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        checkOut: { lte: today },
      },
      data: {
        status: BookingStatus.NO_SHOW,
        autoCompletedAt: reference,
      },
    }),
  ]);

  return {
    checkedOut: checkedOut.count,
    noShow: noShow.count,
    processedAt: reference.toISOString(),
  };
}

let lastLazySweep = 0;
const LAZY_SWEEP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Throttled lazy sweep for admin page loads. Keeps the dashboard accurate even
 * when no external scheduler is configured, without hammering the DB on every
 * navigation.
 */
export async function lazyProcessExpiredBookings() {
  const now = Date.now();

  if (now - lastLazySweep < LAZY_SWEEP_INTERVAL_MS) {
    return null;
  }

  lastLazySweep = now;

  try {
    return await processExpiredBookings();
  } catch {
    lastLazySweep = 0;
    return null;
  }
}

// ---------------------------------------------------------------------------
// Manual booking creation by admin
// ---------------------------------------------------------------------------

const ADMIN_SOURCES = [
  BookingSource.ADMIN,
  BookingSource.PHONE,
  BookingSource.EMAIL,
  BookingSource.WALK_IN,
] as const;

const createAdminBookingSchema = z.object({
  roomId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.coerce.number().int().min(1).max(4),
  mealPlan: z.nativeEnum(BookingMealPlan).default(BookingMealPlan.BREAKFAST),
  dogCount: z.coerce.number().int().min(0).max(4).default(0),
  bicycleReserved: z.boolean().default(false),
  restaurantReservationTime: z.string().trim().max(20).optional(),
  source: z.enum([
    BookingSource.ADMIN,
    BookingSource.PHONE,
    BookingSource.EMAIL,
    BookingSource.WALK_IN,
  ]).default(BookingSource.ADMIN),
  status: z
    .enum([BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN])
    .default(BookingStatus.CONFIRMED),
  locale: z.enum(["de", "en", "ru"]).default("de"),
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(50).optional(),
  notes: z.string().trim().max(2000).optional(),
  adminNotes: z.string().trim().max(2000).optional(),
});

export type CreateAdminBookingInput = z.input<typeof createAdminBookingSchema>;

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

/**
 * Creates a booking on behalf of a guest (phone / walk-in / email request).
 * Unlike the public flow this lets the admin pick the initial status and the
 * source channel, but it shares the exact same pricing + inventory logic so a
 * manually-entered stay never double-books a room or mis-prices.
 */
export async function createAdminBooking(input: CreateAdminBookingInput) {
  const validated = createAdminBookingSchema.parse(input);
  const checkIn = parseHotelDateInput(validated.checkIn);
  const checkOut = parseHotelDateInput(validated.checkOut);
  const nights = differenceInCalendarDays(checkOut, checkIn);

  if (!Number.isFinite(nights) || nights < 1) {
    throw new Error("Invalid booking date range.");
  }

  return prisma.$transaction(async (tx) => {
    const transactionClient = tx as unknown as typeof prisma;

    await ensureDefaultRooms(transactionClient);

    const room = await transactionClient.room.findUnique({
      where: { id: validated.roomId },
    });

    if (!room || !room.isActive) {
      throw new Error("Selected room is not available.");
    }

    if (!canHostGuestCount(room, validated.guests)) {
      throw new Error("Guest count exceeds room capacity.");
    }

    // Inventory check only matters when the new booking will actually hold a room.
    if (statusHoldsInventory(validated.status)) {
      const overlappingBookings = await transactionClient.booking.count({
        where: {
          roomId: room.id,
          status: { in: [...ACTIVE_BOOKING_STATUSES] },
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
      });

      if (overlappingBookings >= room.inventory) {
        throw new Error("Room inventory is sold out for the selected dates.");
      }
    }

    const occupancyBasePrice = getOccupancyPrice(room, validated.guests);
    const mealPlanPricePerGuest = getMealPlanPricePerGuest(room, validated.mealPlan);
    const mealPlanTotalPerNight = mealPlanPricePerGuest.mul(validated.guests);
    const extraBeds = getExtraBedCount(room, validated.guests);
    const extraBedPricePerNight = toDecimal(room.extraBedPrice);
    const extraBedTotalPerNight = extraBedPricePerNight.mul(extraBeds);

    const baseTotal = occupancyBasePrice.mul(nights);
    const mealPlanTotal = mealPlanTotalPerNight.mul(nights);
    const extraBedTotal = extraBedTotalPerNight.mul(nights);
    const dogFeePerNight = new Prisma.Decimal(DOG_FEE_PER_NIGHT);
    const dogFeeTotal = dogFeePerNight.mul(validated.dogCount).mul(nights);
    const totalAmount = baseTotal
      .add(mealPlanTotal)
      .add(extraBedTotal)
      .add(dogFeeTotal);

    const guest = await transactionClient.guest.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phone: validated.phone || null,
        notes: validated.notes || null,
        locale: validated.locale,
      },
    });

    const now = new Date();

    const booking = await transactionClient.booking.create({
      data: {
        guestId: guest.id,
        roomId: room.id,
        checkIn,
        checkOut,
        guests: validated.guests,
        nights,
        basePricePerNight: occupancyBasePrice,
        baseTotal,
        mealPlan: validated.mealPlan,
        mealPlanPricePerGuest,
        mealPlanTotal,
        extraBeds,
        extraBedPricePerNight,
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
        adminNotes: validated.adminNotes || null,
        status: validated.status,
        source: validated.source,
        locale: validated.locale,
        confirmedAt:
          validated.status === BookingStatus.CONFIRMED ||
          validated.status === BookingStatus.CHECKED_IN
            ? now
            : null,
        checkedInAt: validated.status === BookingStatus.CHECKED_IN ? now : null,
      },
      include: { guest: true, room: true },
    });

    return {
      bookingId: booking.id,
      totalAmount: Number(totalAmount),
    };
  });
}

// ---------------------------------------------------------------------------
// Calendar occupancy
// ---------------------------------------------------------------------------

export interface CalendarDayCell {
  date: string;
  occupied: number;
  capacity: number;
  available: number;
  arrivals: number;
  departures: number;
}

export interface CalendarMonth {
  year: number;
  month: number;
  capacity: number;
  days: CalendarDayCell[];
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Builds a per-day occupancy grid for one month. A booking occupies every night
 * from checkIn (inclusive) to checkOut (exclusive). Capacity is the sum of all
 * active room inventory.
 */
export async function getCalendarMonth(
  year: number,
  month: number
): Promise<CalendarMonth> {
  await ensureDefaultRooms();

  const monthStart = startOfMonth(new Date(Date.UTC(year, month - 1, 1, 12)));
  const monthEnd = endOfMonth(monthStart);
  // Pad the query window so multi-night stays crossing month boundaries count.
  const windowStart = addDays(monthStart, -31);
  const windowEnd = addDays(monthEnd, 1);

  const [rooms, bookings] = await Promise.all([
    prisma.room.findMany({ where: { isActive: true } }),
    prisma.booking.findMany({
      where: {
        status: { in: [...ACTIVE_BOOKING_STATUSES] },
        checkIn: { lt: windowEnd },
        checkOut: { gt: windowStart },
      },
      select: { checkIn: true, checkOut: true },
    }),
  ]);

  const capacity = rooms.reduce((sum, room) => sum + room.inventory, 0);

  const days: CalendarDayCell[] = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  }).map((day) => {
    const dayStart = startOfDay(day);
    const nextDay = addDays(dayStart, 1);

    let occupied = 0;
    let arrivals = 0;
    let departures = 0;

    for (const booking of bookings) {
      const ci = startOfDay(booking.checkIn);
      const co = startOfDay(booking.checkOut);

      if (ci < nextDay && co > dayStart) {
        occupied += 1;
      }
      if (ci.getTime() === dayStart.getTime()) {
        arrivals += 1;
      }
      if (co.getTime() === dayStart.getTime()) {
        departures += 1;
      }
    }

    return {
      date: isoDate(dayStart),
      occupied,
      capacity,
      available: Math.max(capacity - occupied, 0),
      arrivals,
      departures,
    };
  });

  return { year, month, capacity, days };
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface BookingAnalytics {
  rangeDays: number;
  totalBookings: number;
  confirmedRevenue: number;
  pendingRevenue: number;
  realizedRevenue: number;
  roomNights: number;
  availableRoomNights: number;
  occupancyRate: number;
  adr: number;
  revpar: number;
  averageLeadTimeDays: number;
  averageStayNights: number;
  cancellationRate: number;
  noShowRate: number;
  sourceMix: { source: BookingSource; count: number }[];
  statusMix: { status: BookingStatus; count: number }[];
  monthlyRevenue: { month: string; revenue: number; bookings: number }[];
}

const REVENUE_STATUSES: BookingStatus[] = [
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
  BookingStatus.CHECKED_OUT,
];

/**
 * Hotel KPIs over a trailing window (default 30 days, keyed on checkIn date):
 * occupancy, ADR (average daily rate), RevPAR (revenue per available room),
 * lead time, length of stay, cancellation / no-show rates and channel mix.
 */
export async function getBookingAnalytics(
  rangeDays = 30,
  reference: Date = new Date()
): Promise<BookingAnalytics> {
  await ensureDefaultRooms();

  const windowEnd = startOfDay(addDays(reference, 1));
  const windowStart = startOfDay(addDays(reference, -rangeDays));

  const [rooms, bookings] = await Promise.all([
    prisma.room.findMany({ where: { isActive: true } }),
    prisma.booking.findMany({
      where: {
        checkIn: { gte: windowStart, lt: windowEnd },
      },
      select: {
        status: true,
        source: true,
        nights: true,
        guests: true,
        totalAmount: true,
        baseTotal: true,
        createdAt: true,
        checkIn: true,
      },
    }),
  ]);

  const capacity = rooms.reduce((sum, room) => sum + room.inventory, 0);
  const availableRoomNights = capacity * rangeDays;

  let confirmedRevenue = 0;
  let pendingRevenue = 0;
  let realizedRevenue = 0;
  let roomNights = 0;
  let leadTimeSum = 0;
  let leadTimeCount = 0;
  let stayNightsSum = 0;
  let cancelled = 0;
  let noShow = 0;

  const sourceCounts = new Map<BookingSource, number>();
  const statusCounts = new Map<BookingStatus, number>();
  const monthlyMap = new Map<string, { revenue: number; bookings: number }>();

  for (const booking of bookings) {
    const total = Number(booking.totalAmount);
    sourceCounts.set(booking.source, (sourceCounts.get(booking.source) ?? 0) + 1);
    statusCounts.set(booking.status, (statusCounts.get(booking.status) ?? 0) + 1);

    if (booking.status === BookingStatus.CANCELLED) {
      cancelled += 1;
      continue;
    }
    if (booking.status === BookingStatus.NO_SHOW) {
      noShow += 1;
      continue;
    }

    roomNights += booking.nights;
    stayNightsSum += booking.nights;

    const lead = differenceInCalendarDays(booking.checkIn, booking.createdAt);
    if (Number.isFinite(lead) && lead >= 0) {
      leadTimeSum += lead;
      leadTimeCount += 1;
    }

    if (REVENUE_STATUSES.includes(booking.status)) {
      confirmedRevenue += total;
      if (
        booking.status === BookingStatus.CHECKED_IN ||
        booking.status === BookingStatus.CHECKED_OUT
      ) {
        realizedRevenue += total;
      }
    } else if (booking.status === BookingStatus.PENDING) {
      pendingRevenue += total;
    }

    const monthKey = booking.checkIn.toISOString().slice(0, 7);
    const monthEntry = monthlyMap.get(monthKey) ?? { revenue: 0, bookings: 0 };
    monthEntry.revenue += total;
    monthEntry.bookings += 1;
    monthlyMap.set(monthKey, monthEntry);
  }

  const validBookings = bookings.length - cancelled - noShow;
  const occupancyRate = availableRoomNights
    ? Math.round((roomNights / availableRoomNights) * 100)
    : 0;
  const adr = roomNights ? confirmedRevenue / roomNights : 0;
  const revpar = availableRoomNights ? confirmedRevenue / availableRoomNights : 0;

  return {
    rangeDays,
    totalBookings: bookings.length,
    confirmedRevenue: Math.round(confirmedRevenue * 100) / 100,
    pendingRevenue: Math.round(pendingRevenue * 100) / 100,
    realizedRevenue: Math.round(realizedRevenue * 100) / 100,
    roomNights,
    availableRoomNights,
    occupancyRate,
    adr: Math.round(adr * 100) / 100,
    revpar: Math.round(revpar * 100) / 100,
    averageLeadTimeDays: leadTimeCount
      ? Math.round((leadTimeSum / leadTimeCount) * 10) / 10
      : 0,
    averageStayNights: validBookings
      ? Math.round((stayNightsSum / validBookings) * 10) / 10
      : 0,
    cancellationRate: bookings.length
      ? Math.round((cancelled / bookings.length) * 100)
      : 0,
    noShowRate: bookings.length
      ? Math.round((noShow / bookings.length) * 100)
      : 0,
    sourceMix: [...sourceCounts.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count),
    statusMix: [...statusCounts.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count),
    monthlyRevenue: [...monthlyMap.entries()]
      .map(([month, value]) => ({
        month,
        revenue: Math.round(value.revenue * 100) / 100,
        bookings: value.bookings,
      }))
      .sort((a, b) => a.month.localeCompare(b.month)),
  };
}

// ---------------------------------------------------------------------------
// Arrivals / departures (today board)
// ---------------------------------------------------------------------------

export async function getTodayBoard(reference: Date = new Date()) {
  const today = startOfDay(reference);
  const tomorrow = addDays(today, 1);

  const [arrivals, departures, inHouse] = await Promise.all([
    prisma.booking.findMany({
      where: {
        checkIn: { gte: today, lt: tomorrow },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
      include: { guest: true, room: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        checkOut: { gte: today, lt: tomorrow },
        status: BookingStatus.CHECKED_IN,
      },
      include: { guest: true, room: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.booking.findMany({
      where: { status: BookingStatus.CHECKED_IN },
      include: { guest: true, room: true },
      orderBy: { checkOut: "asc" },
    }),
  ]);

  return { arrivals, departures, inHouse };
}

export function getAdminBookingSources() {
  return ADMIN_SOURCES;
}
