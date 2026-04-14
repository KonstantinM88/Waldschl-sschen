import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type {
  BookingStatus,
  ContactSubmission,
  Event,
  GiftVoucher,
  Prisma,
  Room,
} from "@prisma/client";
import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import {
  getAdminDictionary,
  getAdminIntlLocale,
  getAdminLocaleFromCookieStore,
  type AdminLocale,
} from "@/lib/admin-i18n";
import {
  ACTIVE_BOOKING_STATUSES,
  ensureDefaultRooms,
} from "@/lib/booking-engine";
import { prisma } from "@/lib/prisma";

type SearchParamsValue = string | string[] | undefined;
type SearchParamsShape = Record<string, SearchParamsValue>;

export type RecentBooking = Prisma.BookingGetPayload<{
  include: {
    guest: true;
    room: true;
  };
}>;

export type ContactReadFilter = "all" | "read" | "unread";
export type VoucherStateFilter = "all" | "open" | "redeemed";
export type EventVisibilityFilter = "all" | "draft" | "published";
export type EventTimeFilter = "all" | "past" | "upcoming";

export interface AdminPaginationMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminPaginatedResult<T> {
  items: T[];
  pagination: AdminPaginationMeta;
}

type ActiveRoomBookingCount = {
  roomId: string;
  _count: {
    _all: number;
  };
};

export interface AdminSummary {
  activeRooms: number;
  availableInventory: number;
  checkedInBookings: number;
  confirmedBookings: number;
  openVouchers: number;
  occupancyRate: number;
  occupiedInventory: number;
  pendingBookings: number;
  publishedEvents: number;
  redeemedVouchers: number;
  totalBookings: number;
  totalContacts: number;
  totalInventory: number;
  totalRooms: number;
  unreadContacts: number;
  upcomingEvents: number;
}

export interface AdminPageContext {
  currentPath: string;
  locale: AdminLocale;
  session: {
    exp: number;
    sub: string;
  };
  t: ReturnType<typeof getAdminDictionary>;
}

interface ContactListOptions {
  limit?: number;
  query?: string;
  readState?: ContactReadFilter;
}

interface BookingListOptions {
  limit?: number;
  query?: string;
  status?: BookingStatus | "all";
}

interface VoucherListOptions {
  limit?: number;
  query?: string;
  state?: VoucherStateFilter;
}

interface EventListOptions {
  limit?: number;
  query?: string;
  time?: EventTimeFilter;
  visibility?: EventVisibilityFilter;
}

interface ContactPageOptions extends ContactListOptions {
  page?: number;
  pageSize?: number;
}

interface BookingPageOptions extends BookingListOptions {
  page?: number;
  pageSize?: number;
}

interface VoucherPageOptions extends VoucherListOptions {
  page?: number;
  pageSize?: number;
}

interface EventPageOptions extends EventListOptions {
  page?: number;
  pageSize?: number;
}

export function formatAdminDateTime(date: Date, locale: AdminLocale) {
  return new Intl.DateTimeFormat(getAdminIntlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatAdminDateTimeInput(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatAdminCurrency(value: number | string, locale: AdminLocale) {
  return new Intl.NumberFormat(getAdminIntlLocale(locale), {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function getFirstSearchParamValue(value: SearchParamsValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export async function resolveAdminSearchParams(
  input?: Promise<SearchParamsShape> | SearchParamsShape
) {
  return (await input) ?? {};
}

export function getAdminSearchParam(params: SearchParamsShape, key: string) {
  return getFirstSearchParamValue(params[key]);
}

export function normalizeAdminSearchQuery(value?: string | null) {
  return value?.trim() ?? "";
}

export function normalizeAdminPageParam(value?: string | null) {
  const parsed = Number.parseInt(value ?? "", 10);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return 1;
}

export function normalizeContactReadFilter(value?: string | null): ContactReadFilter {
  if (value === "read" || value === "unread") {
    return value;
  }

  return "all";
}

export function normalizeBookingStatusFilter(value?: string | null): BookingStatus | "all" {
  const normalized = value?.trim().toUpperCase();
  const statuses: BookingStatus[] = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "CHECKED_IN",
    "CHECKED_OUT",
    "NO_SHOW",
  ];

  return statuses.includes(normalized as BookingStatus)
    ? (normalized as BookingStatus)
    : "all";
}

export function normalizeVoucherStateFilter(value?: string | null): VoucherStateFilter {
  if (value === "open" || value === "redeemed") {
    return value;
  }

  return "all";
}

export function normalizeEventVisibilityFilter(
  value?: string | null
): EventVisibilityFilter {
  if (value === "draft" || value === "published") {
    return value;
  }

  return "all";
}

export function normalizeEventTimeFilter(value?: string | null): EventTimeFilter {
  if (value === "past" || value === "upcoming") {
    return value;
  }

  return "all";
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(sessionToken);

  if (!session) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return session;
}

export async function getAdminPageContext(currentPath: string): Promise<AdminPageContext> {
  const cookieStore = await cookies();
  const locale = getAdminLocaleFromCookieStore(cookieStore);
  const t = getAdminDictionary(locale);
  const session = await requireAdminSession();

  return {
    currentPath,
    locale,
    session,
    t,
  };
}

export async function getAdminSummary(): Promise<AdminSummary> {
  await ensureDefaultRooms();

  const now = new Date();
  const activeRoomBookingCountsPromise = (
    prisma.booking as unknown as {
      groupBy: (args: unknown) => Promise<ActiveRoomBookingCount[]>;
    }
  ).groupBy({
    by: ["roomId"],
    where: {
      status: {
        in: [...ACTIVE_BOOKING_STATUSES],
      },
    },
    _count: {
      _all: true,
    },
  });

  const [
    totalContacts,
    unreadContacts,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    checkedInBookings,
    openVouchers,
    redeemedVouchers,
    publishedEvents,
    upcomingEvents,
    rooms,
    activeRoomBookingCounts,
  ]: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    Room[],
    ActiveRoomBookingCount[],
  ] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { readAt: null } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "CHECKED_IN" } }),
    prisma.giftVoucher.count({ where: { isRedeemed: false } }),
    prisma.giftVoucher.count({ where: { isRedeemed: true } }),
    prisma.event.count({ where: { isPublished: true } }),
    prisma.event.count({ where: { date: { gte: now } } }),
    prisma.room.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    activeRoomBookingCountsPromise,
  ]);

  const totalInventory = rooms.reduce((sum, room) => sum + room.inventory, 0);
  const activeRooms = rooms.filter((room) => room.isActive).length;
  const occupiedInventory = activeRoomBookingCounts.reduce(
    (sum, roomBookingCount) => sum + roomBookingCount._count._all,
    0
  );
  const availableInventory = Math.max(totalInventory - occupiedInventory, 0);
  const occupancyRate = totalInventory
    ? Math.round((occupiedInventory / totalInventory) * 100)
    : 0;

  return {
    activeRooms,
    availableInventory,
    checkedInBookings,
    confirmedBookings,
    openVouchers,
    occupancyRate,
    occupiedInventory,
    pendingBookings,
    publishedEvents,
    redeemedVouchers,
    totalBookings,
    totalContacts,
    totalInventory,
    totalRooms: rooms.length,
    unreadContacts,
    upcomingEvents,
  };
}

export async function getRecentContacts(
  options: ContactListOptions = {}
): Promise<ContactSubmission[]> {
  const { limit = 24, query = "", readState = "all" } = options;
  const trimmedQuery = normalizeAdminSearchQuery(query);
  const filters: Prisma.ContactSubmissionWhereInput[] = [];

  if (readState === "read") {
    filters.push({
      readAt: {
        not: null,
      },
    });
  }

  if (readState === "unread") {
    filters.push({
      readAt: null,
    });
  }

  if (trimmedQuery) {
    filters.push({
      OR: [
        {
          name: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          subject: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          message: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  return prisma.contactSubmission.findMany({
    where: filters.length ? { AND: filters } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

function createAdminPaginationMeta(
  totalItems: number,
  page: number,
  pageSize: number
): AdminPaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return {
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
}

function getContactWhereInput(
  query: string,
  readState: ContactReadFilter
): Prisma.ContactSubmissionWhereInput | undefined {
  const trimmedQuery = normalizeAdminSearchQuery(query);
  const filters: Prisma.ContactSubmissionWhereInput[] = [];

  if (readState === "read") {
    filters.push({
      readAt: {
        not: null,
      },
    });
  }

  if (readState === "unread") {
    filters.push({
      readAt: null,
    });
  }

  if (trimmedQuery) {
    filters.push({
      OR: [
        {
          name: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          subject: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          message: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  return filters.length ? { AND: filters } : undefined;
}

export async function getRecentBookings(
  options: BookingListOptions = {}
): Promise<RecentBooking[]> {
  const { limit = 24, query = "", status = "all" } = options;
  const trimmedQuery = normalizeAdminSearchQuery(query);
  const filters: Prisma.BookingWhereInput[] = [];

  if (status !== "all") {
    filters.push({
      status,
    });
  }

  if (trimmedQuery) {
    filters.push({
      OR: [
        {
          id: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          guest: {
            is: {
              OR: [
                {
                  firstName: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
        {
          room: {
            is: {
              OR: [
                {
                  titleDe: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  titleEn: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  titleRu: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      ],
    });
  }

  return prisma.booking.findMany({
    where: filters.length ? { AND: filters } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      guest: true,
      room: true,
    },
  });
}

function getBookingWhereInput(
  query: string,
  status: BookingStatus | "all"
): Prisma.BookingWhereInput | undefined {
  const trimmedQuery = normalizeAdminSearchQuery(query);
  const filters: Prisma.BookingWhereInput[] = [];

  if (status !== "all") {
    filters.push({
      status,
    });
  }

  if (trimmedQuery) {
    filters.push({
      OR: [
        {
          id: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          guest: {
            is: {
              OR: [
                {
                  firstName: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
        {
          room: {
            is: {
              OR: [
                {
                  titleDe: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  titleEn: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
                {
                  titleRu: {
                    contains: trimmedQuery,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
      ],
    });
  }

  return filters.length ? { AND: filters } : undefined;
}

export async function getRecentVouchers(
  options: VoucherListOptions = {}
): Promise<GiftVoucher[]> {
  const { limit = 24, query = "", state = "all" } = options;
  const where = getVoucherWhereInput(query, state);

  return prisma.giftVoucher.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

function getVoucherWhereInput(
  query: string,
  state: VoucherStateFilter
): Prisma.GiftVoucherWhereInput | undefined {
  const trimmedQuery = normalizeAdminSearchQuery(query);
  const filters: Prisma.GiftVoucherWhereInput[] = [];

  if (state === "open") {
    filters.push({
      isRedeemed: false,
    });
  }

  if (state === "redeemed") {
    filters.push({
      isRedeemed: true,
    });
  }

  if (trimmedQuery) {
    filters.push({
      OR: [
        {
          code: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          buyerName: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          buyerEmail: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          recipient: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          message: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  return filters.length ? { AND: filters } : undefined;
}

export async function getAdminEvents(
  options: EventListOptions = {}
): Promise<Event[]> {
  const { limit = 24, query = "", time = "all", visibility = "all" } = options;
  const where = getEventWhereInput(query, time, visibility);

  return prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
    take: limit,
  });
}

function getEventWhereInput(
  query: string,
  time: EventTimeFilter,
  visibility: EventVisibilityFilter
): Prisma.EventWhereInput | undefined {
  const trimmedQuery = normalizeAdminSearchQuery(query);
  const now = new Date();
  const filters: Prisma.EventWhereInput[] = [];

  if (visibility === "published") {
    filters.push({
      isPublished: true,
    });
  }

  if (visibility === "draft") {
    filters.push({
      isPublished: false,
    });
  }

  if (time === "upcoming") {
    filters.push({
      date: {
        gte: now,
      },
    });
  }

  if (time === "past") {
    filters.push({
      date: {
        lt: now,
      },
    });
  }

  if (trimmedQuery) {
    filters.push({
      OR: [
        {
          title: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          titleEn: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          descriptionEn: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  return filters.length ? { AND: filters } : undefined;
}

export async function getRoomsWithBookingCounts() {
  await ensureDefaultRooms();

  const activeRoomBookingCounts = await (
    prisma.booking as unknown as {
      groupBy: (args: unknown) => Promise<ActiveRoomBookingCount[]>;
    }
  ).groupBy({
    by: ["roomId"],
    where: {
      status: {
        in: [...ACTIVE_BOOKING_STATUSES],
      },
    },
    _count: {
      _all: true,
    },
  });

  const rooms = await prisma.room.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const activeBookingCounts = Object.fromEntries(
    activeRoomBookingCounts.map((entry) => [entry.roomId, entry._count._all])
  );

  return {
    activeBookingCounts,
    rooms,
  };
}

export async function getContactsPage(
  options: ContactPageOptions = {}
): Promise<AdminPaginatedResult<ContactSubmission>> {
  const {
    page = 1,
    pageSize = 12,
    query = "",
    readState = "all",
  } = options;
  const where = getContactWhereInput(query, readState);
  const totalItems = await prisma.contactSubmission.count({ where });
  const pagination = createAdminPaginationMeta(totalItems, page, pageSize);
  const skip = (pagination.page - 1) * pagination.pageSize;

  const items = await prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: pagination.pageSize,
  });

  return {
    items,
    pagination,
  };
}

export async function getBookingsPage(
  options: BookingPageOptions = {}
): Promise<AdminPaginatedResult<RecentBooking>> {
  const {
    page = 1,
    pageSize = 12,
    query = "",
    status = "all",
  } = options;
  const where = getBookingWhereInput(query, status);
  const totalItems = await prisma.booking.count({ where });
  const pagination = createAdminPaginationMeta(totalItems, page, pageSize);
  const skip = (pagination.page - 1) * pagination.pageSize;

  const items = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: pagination.pageSize,
    include: {
      guest: true,
      room: true,
    },
  });

  return {
    items,
    pagination,
  };
}

export async function getAdminContactById(id: string) {
  return prisma.contactSubmission.findUnique({
    where: {
      id,
    },
  });
}

export async function getAdminBookingById(id: string) {
  return prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      guest: true,
      room: true,
    },
  });
}

export async function getVouchersPage(
  options: VoucherPageOptions = {}
): Promise<AdminPaginatedResult<GiftVoucher>> {
  const {
    page = 1,
    pageSize = 12,
    query = "",
    state = "all",
  } = options;
  const where = getVoucherWhereInput(query, state);
  const totalItems = await prisma.giftVoucher.count({ where });
  const pagination = createAdminPaginationMeta(totalItems, page, pageSize);
  const skip = (pagination.page - 1) * pagination.pageSize;

  const items = await prisma.giftVoucher.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: pagination.pageSize,
  });

  return {
    items,
    pagination,
  };
}

export async function getEventsPage(
  options: EventPageOptions = {}
): Promise<AdminPaginatedResult<Event>> {
  const {
    page = 1,
    pageSize = 12,
    query = "",
    time = "all",
    visibility = "all",
  } = options;
  const where = getEventWhereInput(query, time, visibility);
  const totalItems = await prisma.event.count({ where });
  const pagination = createAdminPaginationMeta(totalItems, page, pageSize);
  const skip = (pagination.page - 1) * pagination.pageSize;

  const items = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
    skip,
    take: pagination.pageSize,
  });

  return {
    items,
    pagination,
  };
}

export async function getAdminVoucherById(id: string) {
  return prisma.giftVoucher.findUnique({
    where: {
      id,
    },
  });
}

export async function getAdminEventById(id: string) {
  return prisma.event.findUnique({
    where: {
      id,
    },
  });
}
