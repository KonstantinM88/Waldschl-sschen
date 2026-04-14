import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import {
  formatAdminCurrency,
  formatAdminDateTime,
  getAdminEvents,
  getRecentBookings,
  getRecentContacts,
  getRecentVouchers,
  normalizeAdminSearchQuery,
  normalizeBookingStatusFilter,
  normalizeContactReadFilter,
  normalizeEventTimeFilter,
  normalizeEventVisibilityFilter,
  normalizeVoucherStateFilter,
} from "@/lib/admin-dashboard";
import {
  getAdminDictionary,
  getAdminLocaleFromCookieStore,
  type AdminLocale,
} from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

type CsvRow = Array<string | number | null | undefined>;

function escapeCsvCell(value: string | number | null | undefined) {
  const normalized = String(value ?? "");

  if (!/[",\n\r]/.test(normalized)) {
    return normalized;
  }

  return `"${normalized.replace(/"/g, "\"\"")}"`;
}

function buildCsv(rows: CsvRow[]) {
  return `\uFEFF${rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n")}\r\n`;
}

function formatDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function getFileName(resource: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  return `admin-${resource}-${stamp}.csv`;
}

function csvResponse(resource: string, rows: CsvRow[]) {
  return new NextResponse(buildCsv(rows), {
    headers: {
      "cache-control": "no-store",
      "content-disposition": `attachment; filename="${getFileName(resource)}"`,
      "content-type": "text/csv; charset=utf-8",
    },
  });
}

function getLocale() {
  return cookies().then((cookieStore) => getAdminLocaleFromCookieStore(cookieStore));
}

async function ensureAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) {
    return null;
  }

  return session;
}

function getContactsRows(locale: AdminLocale, contacts: Awaited<ReturnType<typeof getRecentContacts>>) {
  const t = getAdminDictionary(locale);

  return [
    [
      t.dashboard.pages.contacts.fields.created,
      t.dashboard.pages.contacts.fields.name,
      t.dashboard.pages.contacts.fields.email,
      t.dashboard.pages.contacts.fields.phone,
      t.dashboard.pages.contacts.fields.subject,
      t.dashboard.pages.contacts.fields.message,
      t.dashboard.pages.contacts.fields.locale,
      t.dashboard.pages.contacts.filters.readStateLabel,
    ],
    ...contacts.map((contact) => [
      formatAdminDateTime(contact.createdAt, locale),
      contact.name,
      contact.email,
      contact.phone ?? "",
      contact.subject,
      contact.message,
      contact.locale,
      contact.readAt
        ? t.dashboard.pages.contacts.filters.readStates.read
        : t.dashboard.pages.contacts.filters.readStates.unread,
    ]),
  ];
}

function getBookingsRows(locale: AdminLocale, bookings: Awaited<ReturnType<typeof getRecentBookings>>) {
  const t = getAdminDictionary(locale);

  return [
    [
      t.dashboard.pages.bookings.fields.bookingId,
      t.dashboard.pages.bookings.fields.created,
      t.dashboard.pages.bookings.fields.guest,
      t.dashboard.pages.bookings.fields.room,
      t.dashboard.pages.bookings.fields.stay,
      t.dashboard.pages.bookings.fields.nights,
      t.dashboard.pages.bookings.fields.guests,
      t.dashboard.pages.bookings.fields.total,
      t.dashboard.pages.bookings.fields.locale,
      t.dashboard.pages.bookings.filters.statusLabel,
      t.dashboard.pages.bookings.fields.notes,
    ],
    ...bookings.map((booking) => [
      booking.id,
      formatAdminDateTime(booking.createdAt, locale),
      `${booking.guest.firstName} ${booking.guest.lastName}`.trim(),
      booking.room.titleDe,
      `${formatDateOnly(booking.checkIn)} - ${formatDateOnly(booking.checkOut)}`,
      booking.nights,
      booking.guests,
      formatAdminCurrency(booking.totalAmount.toString(), locale),
      booking.locale,
      t.dashboard.bookingStatuses[booking.status],
      booking.notes ?? "",
    ]),
  ];
}

function getVouchersRows(locale: AdminLocale, vouchers: Awaited<ReturnType<typeof getRecentVouchers>>) {
  const t = getAdminDictionary(locale);

  return [
    [
      t.dashboard.pages.vouchers.fields.created,
      t.dashboard.pages.vouchers.fields.code,
      t.dashboard.pages.vouchers.fields.buyerName,
      t.dashboard.pages.vouchers.fields.buyerEmail,
      t.dashboard.pages.vouchers.fields.recipient,
      t.dashboard.pages.vouchers.fields.amount,
      t.dashboard.pages.vouchers.filters.stateLabel,
      t.dashboard.pages.vouchers.fields.redeemed,
      t.dashboard.pages.vouchers.fields.message,
    ],
    ...vouchers.map((voucher) => [
      formatAdminDateTime(voucher.createdAt, locale),
      voucher.code,
      voucher.buyerName,
      voucher.buyerEmail,
      voucher.recipient ?? "",
      formatAdminCurrency(voucher.amount, locale),
      voucher.isRedeemed
        ? t.dashboard.pages.vouchers.filters.states.redeemed
        : t.dashboard.pages.vouchers.filters.states.open,
      voucher.redeemedAt ? formatAdminDateTime(voucher.redeemedAt, locale) : "",
      voucher.message ?? "",
    ]),
  ];
}

function getEventsRows(locale: AdminLocale, events: Awaited<ReturnType<typeof getAdminEvents>>) {
  const t = getAdminDictionary(locale);

  return [
    [
      t.dashboard.pages.events.fields.date,
      t.dashboard.pages.events.fields.primaryTitle,
      t.dashboard.pages.events.fields.secondaryTitle,
      t.dashboard.pages.events.fields.visibility,
      t.dashboard.pages.events.fields.description,
      t.dashboard.pages.events.fields.descriptionEn,
      t.dashboard.pages.events.fields.imageUrl,
      t.dashboard.pages.events.fields.created,
    ],
    ...events.map((event) => [
      formatAdminDateTime(event.date, locale),
      event.title,
      event.titleEn ?? "",
      event.isPublished
        ? t.dashboard.pages.events.filters.visibilities.published
        : t.dashboard.pages.events.filters.visibilities.draft,
      event.description ?? "",
      event.descriptionEn ?? "",
      event.imageUrl ?? "",
      formatAdminDateTime(event.createdAt, locale),
    ]),
  ];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  if (!(await ensureAdminSession())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { resource } = await params;
  const locale = await getLocale();
  const query = normalizeAdminSearchQuery(request.nextUrl.searchParams.get("q"));

  switch (resource) {
    case "contacts": {
      const readState = normalizeContactReadFilter(request.nextUrl.searchParams.get("read"));
      const contacts = await getRecentContacts({
        limit: 10_000,
        query,
        readState,
      });

      return csvResponse(resource, getContactsRows(locale, contacts));
    }
    case "bookings": {
      const status = normalizeBookingStatusFilter(request.nextUrl.searchParams.get("status"));
      const bookings = await getRecentBookings({
        limit: 10_000,
        query,
        status,
      });

      return csvResponse(resource, getBookingsRows(locale, bookings));
    }
    case "vouchers": {
      const state = normalizeVoucherStateFilter(request.nextUrl.searchParams.get("state"));
      const vouchers = await getRecentVouchers({
        limit: 10_000,
        query,
        state,
      });

      return csvResponse(resource, getVouchersRows(locale, vouchers));
    }
    case "events": {
      const visibility = normalizeEventVisibilityFilter(
        request.nextUrl.searchParams.get("visibility")
      );
      const time = normalizeEventTimeFilter(request.nextUrl.searchParams.get("time"));
      const events = await getAdminEvents({
        limit: 10_000,
        query,
        time,
        visibility,
      });

      return csvResponse(resource, getEventsRows(locale, events));
    }
    default:
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}
