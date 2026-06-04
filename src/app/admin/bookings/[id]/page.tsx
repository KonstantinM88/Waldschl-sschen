import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingMealPlan, BookingStatus } from "@prisma/client";
import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  LogIn,
  LogOut,
  Mail,
  PawPrint,
  Printer,
  Users,
  XCircle,
} from "lucide-react";
import {
  cancelBookingAction,
  saveBookingAssignedRoomNumberAction,
  saveBookingAdminNotesAction,
  sendBookingReceiptEmailAction,
  updateBookingGuestAction,
  updateBookingStayAndServicesAction,
  updateBookingStatusAction,
} from "@/app/admin/booking-actions";
import AdminBookingStatusBadge from "@/components/admin/AdminBookingStatusBadge";
import AdminConfirmButton from "@/components/admin/AdminConfirmButton";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import { AdminField, AdminPanel } from "@/components/admin/AdminUi";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import {
  formatAdminCurrency,
  formatAdminDateTime,
  getAdminBookingById,
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  resolveAdminSearchParams,
} from "@/lib/admin-dashboard";
import {
  buildAdminPath,
  getAdminFeedbackFromSearchParams,
  resolveAdminReturnTo,
} from "@/lib/admin-feedback";
import {
  BOOKING_STATUS_TRANSITIONS,
  BOOKING_STAY_SERVICE_AUDIT_FIELDS,
  canEditBookingStayAndServices,
  type BookingStayServiceAuditField,
} from "@/lib/booking-lifecycle";
import { formatHotelDate, parseHotelDateInput } from "@/lib/booking-dates";
import { getMealPlanLabel, getRoomTypeLabel } from "@/lib/booking-engine";
import { HOTEL_ROOM_NUMBER_INPUT_PATTERN } from "@/lib/booking-shared";

const STATUS_ACTION_ICON: Partial<Record<BookingStatus, typeof CheckCircle2>> = {
  CONFIRMED: CheckCircle2,
  CHECKED_IN: LogIn,
  CHECKED_OUT: LogOut,
  NO_SHOW: XCircle,
  PENDING: CalendarClock,
};

const GUEST_CHANGE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "street",
  "postalCode",
  "city",
  "country",
  "locale",
  "notes",
  "isForeignGuest",
  "dateOfBirth",
  "nationality",
  "passportNumber",
  "passportIssuingCountry",
  "passportExpiryDate",
] as const;

type GuestChangeField = (typeof GUEST_CHANGE_FIELDS)[number];

interface GuestChangeEntry {
  field: GuestChangeField;
  nextValue: string | null;
  previousValue: string | null;
}

interface BookingChangeEntry {
  field: BookingStayServiceAuditField;
  nextValue: string | null;
  previousValue: string | null;
}

const BOOKING_CHANGE_CURRENCY_FIELDS = new Set<BookingStayServiceAuditField>([
  "mealPlanPricePerGuest",
  "mealPlanTotal",
  "dogFeeTotal",
  "baseTotal",
  "extraBedTotal",
  "totalAmount",
]);

function parseGuestChanges(value: unknown): GuestChangeEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return [];
    }

    const change = entry as Record<string, unknown>;
    if (
      typeof change.field !== "string" ||
      !GUEST_CHANGE_FIELDS.includes(change.field as GuestChangeField)
    ) {
      return [];
    }

    return [
      {
        field: change.field as GuestChangeField,
        previousValue:
          typeof change.previousValue === "string" ? change.previousValue : null,
        nextValue: typeof change.nextValue === "string" ? change.nextValue : null,
      },
    ];
  });
}

function parseBookingChanges(value: unknown): BookingChangeEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return [];
    }

    const change = entry as Record<string, unknown>;
    if (
      typeof change.field !== "string" ||
      !BOOKING_STAY_SERVICE_AUDIT_FIELDS.includes(
        change.field as BookingStayServiceAuditField
      )
    ) {
      return [];
    }

    return [
      {
        field: change.field as BookingStayServiceAuditField,
        previousValue:
          typeof change.previousValue === "string" ? change.previousValue : null,
        nextValue: typeof change.nextValue === "string" ? change.nextValue : null,
      },
    ];
  });
}

function getLifecycleCancellationReason(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const reason = (value as Record<string, unknown>).cancellationReason;
  return typeof reason === "string" && reason.trim() ? reason : null;
}

function formatGuestDateInput(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await resolveAdminSearchParams(searchParams);

  const [{ locale, session, t }, summary, booking] = await Promise.all([
    getAdminPageContext(`/admin/bookings/${id}`),
    getAdminSummary(),
    getAdminBookingById(id),
  ]);

  if (!booking) {
    notFound();
  }

  const backHref = resolveAdminReturnTo(
    getAdminSearchParam(resolvedSearchParams, "returnTo"),
    "/admin/bookings"
  );
  const currentPath = buildAdminPath(`/admin/bookings/${id}`, {
    returnTo: backHref,
  });
  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(resolvedSearchParams, "notice"),
    getAdminSearchParam(resolvedSearchParams, "tone")
  );

  // Only the transitions the lifecycle matrix permits from the current status.
  const allowedTransitions = BOOKING_STATUS_TRANSITIONS[booking.status].filter(
    (status) => status !== "CANCELLED"
  );
  const canCancel =
    BOOKING_STATUS_TRANSITIONS[booking.status].includes("CANCELLED");
  const guestFieldLabels = t.dashboard.pages.bookings.detail.guestFields;
  const guestAddress = [
    booking.guest.street,
    [booking.guest.postalCode, booking.guest.city].filter(Boolean).join(" "),
    booking.guest.country,
  ].filter(Boolean);
  const hasPassportData = Boolean(
    booking.guest.isForeignGuest ||
      booking.guest.dateOfBirth ||
      booking.guest.nationality ||
      booking.guest.passportNumber ||
      booking.guest.passportIssuingCountry ||
      booking.guest.passportExpiryDate
  );
  const canEditStayAndServices = canEditBookingStayAndServices(booking.status);
  const isCheckedIn = booking.status === BookingStatus.CHECKED_IN;
  const bookingFieldLabels = t.dashboard.pages.bookings.detail.bookingFields;
  const formatBookingChangeValue = (
    field: BookingStayServiceAuditField,
    value: string | null
  ) => {
    if (!value) {
      return t.dashboard.pages.bookings.detail.emptyValue;
    }

    if (field === "bicycleReserved") {
      return value === "true" ? t.dashboard.controls.yes : t.dashboard.controls.no;
    }

    if (
      field === "mealPlan" &&
      Object.values(BookingMealPlan).includes(value as BookingMealPlan)
    ) {
      return getMealPlanLabel(value as BookingMealPlan, locale);
    }

    if (field === "checkIn" || field === "checkOut") {
      try {
        return formatHotelDate(parseHotelDateInput(value), locale);
      } catch {
        return value;
      }
    }

    if (BOOKING_CHANGE_CURRENCY_FIELDS.has(field)) {
      return formatAdminCurrency(value, locale);
    }

    return value;
  };
  const formatGuestChangeValue = (
    field: GuestChangeField,
    value: string | null
  ) => {
    if (!value) {
      return t.dashboard.pages.bookings.detail.emptyValue;
    }

    if (field === "isForeignGuest") {
      return value === "true" ? t.dashboard.controls.yes : t.dashboard.controls.no;
    }

    return value;
  };

  return (
    <AdminShell
      badge={t.dashboard.pages.bookings.badge}
      currentPath={currentPath}
      description={t.dashboard.pages.bookings.detail.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.pages.bookings.detail.title}
    >
      <div className="flex flex-wrap gap-3">
        <Link
          href={backHref}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-5 text-center text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17] sm:w-auto"
        >
          {t.dashboard.controls.backToList}
        </Link>
        <Link
          href={`/admin/bookings/${booking.id}/receipt?print=1`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#dfd4c2] bg-white px-5 text-center text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17] sm:w-auto"
        >
          <Printer className="h-4 w-4 stroke-[1.8]" />
          {t.dashboard.pages.bookings.detail.printReceipt}
        </Link>
        <form action={sendBookingReceiptEmailAction} className="contents">
          <input type="hidden" name="id" value={booking.id} />
          <input type="hidden" name="returnTo" value={currentPath} />
          <AdminSubmitButton
            pendingLabel={t.dashboard.pages.bookings.detail.sendingReceipt}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#cda867] bg-[#bf9556] px-5 text-center text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_25px_rgba(128,92,39,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ad8448] sm:w-auto"
          >
            <Mail className="h-4 w-4 stroke-[1.8]" />
            {t.dashboard.pages.bookings.detail.sendReceipt}
          </AdminSubmitButton>
        </form>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <AdminPanel badge={t.dashboard.pages.bookings.badge} title={booking.id}>
          <div className="grid grid-cols-1 gap-3 text-sm text-[#4f483f]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.bookingId}
                </div>
                <div className="mt-2 break-all text-[#201b17]">{booking.id}</div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.room}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {getRoomTypeLabel(booking.room.type, locale)}
                </div>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.bookings.filters.statusLabel}
              </div>
              <div className="mt-2">
                <AdminBookingStatusBadge
                  label={t.dashboard.bookingStatuses[booking.status]}
                  status={booking.status}
                />
              </div>
            </div>

            <form
              action={saveBookingAssignedRoomNumberAction}
              className="rounded-[1.15rem] border border-[#e3d6c4] bg-[#faf6ef] px-4 py-4"
            >
              <input type="hidden" name="id" value={booking.id} />
              <input type="hidden" name="returnTo" value={currentPath} />
              <AdminPendingFieldset className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="min-w-0 flex-1 rounded-xl border border-[#dfd2c0] bg-white px-4 py-3">
                  <span className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
                    {t.dashboard.pages.bookings.fields.assignedRoomNumber}
                  </span>
                  <input
                    name="assignedRoomNumber"
                    type="text"
                    inputMode="numeric"
                    pattern={HOTEL_ROOM_NUMBER_INPUT_PATTERN}
                    maxLength={3}
                    defaultValue={booking.assignedRoomNumber ?? ""}
                    placeholder={t.dashboard.pages.bookings.detail.assignedRoomNumberHint}
                    className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </label>
                <AdminSubmitButton
                  pendingLabel={`${t.dashboard.controls.save}...`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#dfd4c2] bg-white px-5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                >
                  {t.dashboard.controls.save}
                </AdminSubmitButton>
              </AdminPendingFieldset>
            </form>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.stay}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {formatHotelDate(booking.checkIn, locale)} - {formatHotelDate(booking.checkOut, locale)}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.nights}
                </div>
                <div className="mt-2 text-[#201b17]">{booking.nights}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.guests}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 text-[#201b17]">
                  <Users className="h-4 w-4 stroke-[1.8]" />
                  {booking.guests}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.locale}
                </div>
                <div className="mt-2 text-[#201b17]">{booking.locale.toUpperCase()}</div>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.created}
                </div>
                {booking.source !== "WEB" ? (
                  <span className="rounded-full border border-[#e0d6ef] bg-[#f4f0fb] px-2.5 py-1 text-[0.56rem] font-medium uppercase tracking-[0.14em] text-[#6a5a93]">
                    {t.dashboard.bookingSources[booking.source]}
                  </span>
                ) : (
                  <span className="rounded-full border border-[#cfe0f0] bg-[#eef4fb] px-2.5 py-1 text-[0.56rem] font-medium uppercase tracking-[0.14em] text-[#4a6a90]">
                    {t.dashboard.bookingSources.WEB}
                  </span>
                )}
              </div>
              <div className="mt-2 text-[#201b17]">
                {formatAdminDateTime(booking.createdAt, locale)}
              </div>
              <div className="mt-4 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.bookings.fields.updated}
              </div>
              <div className="mt-2 text-[#201b17]">
                {formatAdminDateTime(booking.updatedAt, locale)}
              </div>

              <div className="mt-4 space-y-1.5 border-t border-[#ece3d6] pt-4 text-[0.78rem]">
                {booking.confirmedAt ? (
                  <div className="flex items-center justify-between text-[#5d564c]">
                    <span>{t.dashboard.bookingStatuses.CONFIRMED}</span>
                    <span>{formatAdminDateTime(booking.confirmedAt, locale)}</span>
                  </div>
                ) : null}
                {booking.checkedInAt ? (
                  <div className="flex items-center justify-between text-[#5d564c]">
                    <span>{t.dashboard.bookingStatuses.CHECKED_IN}</span>
                    <span>{formatAdminDateTime(booking.checkedInAt, locale)}</span>
                  </div>
                ) : null}
                {booking.checkedOutAt ? (
                  <div className="flex items-center justify-between text-[#5d564c]">
                    <span>{t.dashboard.bookingStatuses.CHECKED_OUT}</span>
                    <span>{formatAdminDateTime(booking.checkedOutAt, locale)}</span>
                  </div>
                ) : null}
                {booking.cancelledAt ? (
                  <div className="flex items-center justify-between text-[#9f4636]">
                    <span>{t.dashboard.bookingStatuses.CANCELLED}</span>
                    <span>{formatAdminDateTime(booking.cancelledAt, locale)}</span>
                  </div>
                ) : null}
                {booking.autoCompletedAt ? (
                  <div className="flex items-center justify-between text-[#9e927f]">
                    <span>{t.dashboard.pages.bookings.detail.autoCompleted}</span>
                    <span>{formatAdminDateTime(booking.autoCompletedAt, locale)}</span>
                  </div>
                ) : null}
              </div>

              {booking.cancellationReason ? (
                <div className="mt-4 rounded-xl border border-[#efc9bd] bg-[#fff3ef] px-3 py-2.5">
                  <div className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#9f4638]">
                    {t.dashboard.pages.bookings.detail.cancellationReason}
                  </div>
                  <div className="mt-1 text-[0.82rem] text-[#7f3128]">
                    {booking.cancellationReason}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-[1.15rem] border border-[#e3d6c4] bg-[#faf6ef] px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#b4884c]">
                  {t.dashboard.pages.bookings.detail.lifecycleTitle}
                </div>
                <AdminBookingStatusBadge
                  label={t.dashboard.bookingStatuses[booking.status]}
                  status={booking.status}
                />
              </div>

              {allowedTransitions.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {allowedTransitions.map((status) => {
                    const Icon = STATUS_ACTION_ICON[status] ?? CheckCircle2;
                    const isPrimary =
                      status === "CONFIRMED" || status === "CHECKED_IN";
                    return (
                      <form
                        key={status}
                        action={updateBookingStatusAction}
                        className="contents"
                      >
                        <input type="hidden" name="id" value={booking.id} />
                        <input type="hidden" name="returnTo" value={currentPath} />
                        <input type="hidden" name="status" value={status} />
                        <AdminSubmitButton
                          pendingLabel={`${t.dashboard.bookingStatuses[status]}...`}
                          className={[
                            "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[0.62rem] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                            isPrimary
                              ? "border-[#cda867] bg-[#bf9556] text-white shadow-[0_14px_28px_rgba(128,92,39,0.18)] hover:-translate-y-0.5 hover:bg-[#ad8448]"
                              : "border-[#dfd4c2] bg-white text-[#6c6459] hover:border-[#cdbca4] hover:text-[#201b17]",
                          ].join(" ")}
                        >
                          <Icon className="h-3.5 w-3.5 stroke-[2]" />
                          {t.dashboard.bookingStatuses[status]}
                        </AdminSubmitButton>
                      </form>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-[0.8rem] font-light text-[#9a8f7c]">
                  {t.dashboard.pages.bookings.detail.lifecycleLocked}
                </p>
              )}

              {canCancel ? (
                <form action={cancelBookingAction} className="mt-4">
                  <input type="hidden" name="id" value={booking.id} />
                  <input type="hidden" name="returnTo" value={currentPath} />
                  <AdminPendingFieldset>
                    <input
                      type="text"
                      name="reason"
                      maxLength={500}
                      placeholder={t.dashboard.pages.bookings.detail.cancelReasonPlaceholder}
                      className="min-h-11 w-full rounded-xl border border-[#efc9bd] bg-white px-4 text-sm text-[#201b17] outline-none focus:border-[#dfa99b]"
                    />
                    <AdminConfirmButton
                      confirmMessage={t.dashboard.pages.bookings.detail.cancelConfirm}
                      pendingLabel={`${t.dashboard.pages.bookings.detail.cancel}...`}
                      className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#efc9bd] bg-[#fff3ef] px-5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#9f4638] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#dfa99b] hover:bg-white hover:text-[#7f3128]"
                    >
                      <XCircle className="h-3.5 w-3.5 stroke-[2]" />
                      {t.dashboard.pages.bookings.detail.cancel}
                    </AdminConfirmButton>
                  </AdminPendingFieldset>
                </form>
              ) : null}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel badge={t.dashboard.sections.bookingBadge} title={booking.guest.email}>
          <div className="grid grid-cols-1 gap-3 text-sm text-[#4f483f]">
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.bookings.fields.roomRate}
              </div>
              <div className="mt-2 text-[#201b17]">
                {formatAdminCurrency(booking.basePricePerNight.toString(), locale)}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.baseTotal}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {formatAdminCurrency(booking.baseTotal.toString(), locale)}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.mealPlanTotal}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {formatAdminCurrency(booking.mealPlanTotal.toString(), locale)}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.extraBedTotal}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {formatAdminCurrency(booking.extraBedTotal.toString(), locale)}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.dogFeeTotal}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {formatAdminCurrency(booking.dogFeeTotal.toString(), locale)}
                </div>
              </div>
            </div>
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.bookings.fields.total}
              </div>
              <div className="mt-2 text-lg font-medium text-[#201b17]">
                {formatAdminCurrency(booking.totalAmount.toString(), locale)}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.dogs}
                </div>
                <div className="mt-2 inline-flex items-center gap-2 text-[#201b17]">
                  <PawPrint className="h-4 w-4 stroke-[1.8]" />
                  {booking.dogCount}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.bicycle}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {booking.bicycleReserved
                    ? t.dashboard.controls.yes
                    : t.dashboard.controls.no}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.restaurant}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {booking.restaurantReservationTime ?? "-"}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.mealPlan}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {getMealPlanLabel(booking.mealPlan, locale)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.extraBeds}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {booking.extraBeds}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.bookings.fields.breakfast}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {booking.breakfastIncluded
                    ? t.dashboard.controls.yes
                    : t.dashboard.controls.no}
                </div>
              </div>
            </div>

            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.bookings.fields.guest}
              </div>
              <div className="mt-2 text-base font-medium text-[#201b17]">
                {booking.guest.firstName} {booking.guest.lastName}
              </div>
              <a
                href={`mailto:${booking.guest.email}`}
                className="mt-3 inline-flex items-center gap-2 break-all text-[#6c6459] hover:text-[#201b17]"
              >
                <Mail className="h-4 w-4 stroke-[1.8]" />
                {booking.guest.email}
              </a>
              <div className="mt-3 text-[#201b17]">
                {booking.guest.phone ?? "-"}
              </div>
              {guestAddress.length ? (
                <div className="mt-3 whitespace-pre-line text-[#6c6459]">
                  {guestAddress.join("\n")}
                </div>
              ) : null}
            </div>

            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.bookings.fields.notes}
              </div>
              <div className="mt-2 whitespace-pre-wrap text-[#201b17]">
                {booking.notes ?? "-"}
              </div>
            </div>

            <form
              action={saveBookingAdminNotesAction}
              className="rounded-[1.15rem] border border-[#e3d6c4] bg-[#faf6ef] px-4 py-4"
            >
              <input type="hidden" name="id" value={booking.id} />
              <input type="hidden" name="returnTo" value={currentPath} />
              <AdminPendingFieldset>
                <div className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#b4884c]">
                  {t.dashboard.pages.bookings.detail.adminNotes}
                </div>
                <textarea
                  name="adminNotes"
                  rows={3}
                  defaultValue={booking.adminNotes ?? ""}
                  placeholder={t.dashboard.pages.bookings.detail.adminNotesHint}
                  className="mt-3 w-full rounded-xl border border-[#dfd2c0] bg-white px-3.5 py-3 text-sm text-[#201b17] outline-none focus:border-[#c6aa7b]"
                />
                <AdminSubmitButton
                  pendingLabel={`${t.dashboard.controls.save}...`}
                  className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#dfd4c2] bg-white px-5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                >
                  {t.dashboard.controls.save}
                </AdminSubmitButton>
              </AdminPendingFieldset>
            </form>
          </div>
        </AdminPanel>
      </section>

      <AdminPanel
        badge={t.dashboard.pages.bookings.detail.lifecycleHistoryTitle}
        description={t.dashboard.pages.bookings.detail.lifecycleHistoryDescription}
        title={t.dashboard.pages.bookings.detail.lifecycleHistoryTitle}
      >
        {booking.lifecycleEvents.length ? (
          <div className="space-y-3">
            {booking.lifecycleEvents.map((event) => {
              const cancellationReason = getLifecycleCancellationReason(
                event.details
              );
              const actorLabel =
                t.dashboard.pages.bookings.detail.lifecycleActorLabels[
                  event.actorType
                ];

              return (
                <article
                  key={event.id}
                  className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#b4884c]">
                        {
                          t.dashboard.pages.bookings.detail.lifecycleEventLabels[
                            event.eventType
                          ]
                        }
                      </div>
                      <div className="mt-2 text-xs text-[#6c6459]">
                        {actorLabel}
                        {event.actorName ? `: ${event.actorName}` : ""}
                      </div>
                    </div>
                    <div className="text-[0.68rem] text-[#8f836f]">
                      {formatAdminDateTime(event.createdAt, locale)}
                    </div>
                  </div>

                  {event.fromStatus || event.toStatus ? (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {event.fromStatus ? (
                        <div className="rounded-xl bg-white px-3 py-3">
                          <div className="text-[0.54rem] font-medium uppercase tracking-[0.12em] text-[#9e927f]">
                            {t.dashboard.pages.bookings.detail.statusFrom}
                          </div>
                          <div className="mt-2">
                            <AdminBookingStatusBadge
                              label={
                                t.dashboard.bookingStatuses[event.fromStatus]
                              }
                              status={event.fromStatus}
                            />
                          </div>
                        </div>
                      ) : null}
                      {event.toStatus ? (
                        <div className="rounded-xl border border-[#e1d5c3] bg-white px-3 py-3">
                          <div className="text-[0.54rem] font-medium uppercase tracking-[0.12em] text-[#9e927f]">
                            {t.dashboard.pages.bookings.detail.statusTo}
                          </div>
                          <div className="mt-2">
                            <AdminBookingStatusBadge
                              label={t.dashboard.bookingStatuses[event.toStatus]}
                              status={event.toStatus}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {cancellationReason ? (
                    <div className="mt-3 rounded-xl border border-[#efc9bd] bg-[#fff3ef] px-3 py-3">
                      <div className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#9f4638]">
                        {t.dashboard.pages.bookings.detail.cancellationReason}
                      </div>
                      <div className="mt-1 whitespace-pre-wrap text-xs text-[#7f3128]">
                        {cancellationReason}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d8cbb8] bg-[#faf6ef] px-4 py-6 text-sm font-light text-[#6c6459]">
            {t.dashboard.pages.bookings.detail.lifecycleHistoryEmpty}
          </div>
        )}
      </AdminPanel>

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <details className="group/stay-editor self-start overflow-hidden rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-3 shadow-[0_14px_34px_rgba(37,28,20,0.055)] sm:p-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-xl border border-[#eadfce] bg-[#faf6ef] px-4 py-4 transition-colors duration-200 hover:bg-white [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
                {t.dashboard.controls.edit}
              </span>
              <span className="mt-2 block font-[var(--font-display)] text-[clamp(1.35rem,6vw,1.75rem)] leading-[0.98] text-[#1f1b17]">
                {t.dashboard.pages.bookings.detail.stayServicesTitle}
              </span>
              <span className="mt-3 block text-sm font-light leading-relaxed text-[#5d564c]">
                {t.dashboard.pages.bookings.detail.stayServicesDescription}
              </span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dfd2c0] bg-white text-[#8f836f]">
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open/stay-editor:rotate-180" />
            </span>
          </summary>

          {canEditStayAndServices ? (
            <form
              action={updateBookingStayAndServicesAction}
              className="mt-5 border-t border-[#eee5d9] pt-5"
            >
              <input type="hidden" name="id" value={booking.id} />
              <input type="hidden" name="returnTo" value={currentPath} />
              {isCheckedIn ? (
                <input
                  type="hidden"
                  name="checkIn"
                  value={booking.checkIn.toISOString().slice(0, 10)}
                />
              ) : null}
              <AdminPendingFieldset>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <AdminField label={t.dashboard.pages.newBooking.form.checkIn}>
                    <input
                      name={isCheckedIn ? undefined : "checkIn"}
                      type="date"
                      required
                      disabled={isCheckedIn}
                      defaultValue={booking.checkIn.toISOString().slice(0, 10)}
                      className="w-full bg-transparent text-sm text-[#201b17] outline-none disabled:cursor-not-allowed disabled:text-[#9e927f]"
                    />
                  </AdminField>
                  <AdminField label={t.dashboard.pages.newBooking.form.checkOut}>
                    <input
                      name="checkOut"
                      type="date"
                      required
                      defaultValue={booking.checkOut.toISOString().slice(0, 10)}
                      className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                    />
                  </AdminField>
                  <AdminField label={t.dashboard.pages.newBooking.form.mealPlan}>
                    <select
                      name="mealPlan"
                      defaultValue={booking.mealPlan}
                      className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                    >
                      {Object.values(BookingMealPlan).map((mealPlan) => (
                        <option key={mealPlan} value={mealPlan}>
                          {t.dashboard.pages.newBooking.form.mealPlans[mealPlan]}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                  <AdminField label={t.dashboard.pages.newBooking.form.dogs}>
                    <select
                      name="dogCount"
                      defaultValue={String(booking.dogCount)}
                      className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                    >
                      {[0, 1, 2, 3, 4].map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                  <AdminField label={t.dashboard.pages.newBooking.form.restaurant}>
                    <input
                      name="restaurantReservationTime"
                      type="text"
                      maxLength={20}
                      defaultValue={booking.restaurantReservationTime ?? ""}
                      placeholder={
                        t.dashboard.pages.newBooking.form.restaurantPlaceholder
                      }
                      className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                    />
                  </AdminField>
                  <label className="flex min-h-[4.6rem] items-center gap-3 rounded-xl border border-[#dfd2c0] bg-white px-4 py-3 text-sm text-[#3a342c]">
                    <input
                      name="bicycleReserved"
                      type="checkbox"
                      defaultChecked={booking.bicycleReserved}
                      className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                    />
                    {t.dashboard.pages.newBooking.form.bicycle}
                  </label>
                </div>

                <div className="mt-4 rounded-xl border border-[#e3d6c4] bg-[#faf6ef] px-4 py-3 text-xs font-light leading-relaxed text-[#6c6459]">
                  {t.dashboard.pages.bookings.detail.stayServicesPricingHint}
                  {isCheckedIn ? (
                    <span className="mt-1 block font-medium text-[#9b5a25]">
                      {t.dashboard.pages.bookings.detail.checkedInDateHint}
                    </span>
                  ) : null}
                </div>

                <AdminSubmitButton
                  pendingLabel={`${t.dashboard.controls.save}...`}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#cda867] bg-[#bf9556] px-5 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(128,92,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ad8448] sm:w-auto"
                >
                  {t.dashboard.controls.save}
                </AdminSubmitButton>
              </AdminPendingFieldset>
            </form>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-[#d8cbb8] bg-[#faf6ef] px-4 py-5 text-sm font-light text-[#6c6459]">
              {t.dashboard.pages.bookings.detail.stayServicesLocked}
            </div>
          )}
        </details>

        <AdminPanel
          badge={t.dashboard.pages.bookings.detail.bookingChangeHistoryTitle}
          description={
            t.dashboard.pages.bookings.detail.bookingChangeHistoryDescription
          }
          title={t.dashboard.pages.bookings.detail.bookingChangeHistoryTitle}
        >
          {booking.bookingChangeLogs.length ? (
            <div className="space-y-3">
              {booking.bookingChangeLogs.map((log) => {
                const changes = parseBookingChanges(log.changes);

                return (
                  <article
                    key={log.id}
                    className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4"
                  >
                    <div className="flex flex-col gap-1 text-[0.68rem] text-[#8f836f] sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        {t.dashboard.pages.bookings.detail.changedBy}:{" "}
                        <strong className="font-medium text-[#4f483f]">
                          {log.changedBy}
                        </strong>
                      </span>
                      <span>{formatAdminDateTime(log.createdAt, locale)}</span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {changes.map((change) => (
                        <div
                          key={change.field}
                          className="rounded-xl border border-[#eee5d9] bg-white px-3 py-3"
                        >
                          <div className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#b4884c]">
                            {bookingFieldLabels[change.field]}
                          </div>
                          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="min-w-0 rounded-lg bg-[#faf6ef] px-3 py-2">
                              <div className="text-[0.54rem] font-medium uppercase tracking-[0.12em] text-[#9e927f]">
                                {t.dashboard.pages.bookings.detail.previousValue}
                              </div>
                              <div className="mt-1 whitespace-pre-wrap break-words text-xs text-[#6c6459]">
                                {formatBookingChangeValue(
                                  change.field,
                                  change.previousValue
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 rounded-lg border border-[#e1d5c3] bg-[#fffdf9] px-3 py-2">
                              <div className="text-[0.54rem] font-medium uppercase tracking-[0.12em] text-[#9e927f]">
                                {t.dashboard.pages.bookings.detail.nextValue}
                              </div>
                              <div className="mt-1 whitespace-pre-wrap break-words text-xs text-[#201b17]">
                                {formatBookingChangeValue(
                                  change.field,
                                  change.nextValue
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d8cbb8] bg-[#faf6ef] px-4 py-6 text-sm font-light text-[#6c6459]">
              {t.dashboard.pages.bookings.detail.bookingChangeHistoryEmpty}
            </div>
          )}
        </AdminPanel>
      </section>

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <details className="group/guest-editor self-start overflow-hidden rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-3 shadow-[0_14px_34px_rgba(37,28,20,0.055)] sm:p-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-xl border border-[#eadfce] bg-[#faf6ef] px-4 py-4 transition-colors duration-200 hover:bg-white [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
                {t.dashboard.controls.edit}
              </span>
              <span className="mt-2 block font-[var(--font-display)] text-[clamp(1.35rem,6vw,1.75rem)] leading-[0.98] text-[#1f1b17]">
                {t.dashboard.pages.bookings.detail.guestDataTitle}
              </span>
              <span className="mt-3 block text-sm font-light leading-relaxed text-[#5d564c]">
                {t.dashboard.pages.bookings.detail.guestDataDescription}
              </span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dfd2c0] bg-white text-[#8f836f]">
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open/guest-editor:rotate-180" />
            </span>
          </summary>

          <form
            action={updateBookingGuestAction}
            className="mt-5 border-t border-[#eee5d9] pt-5"
          >
            <input type="hidden" name="id" value={booking.id} />
            <input type="hidden" name="returnTo" value={currentPath} />
            <AdminPendingFieldset>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AdminField label={guestFieldLabels.firstName}>
                  <input
                    name="firstName"
                    type="text"
                    required
                    maxLength={120}
                    defaultValue={booking.guest.firstName}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={guestFieldLabels.lastName}>
                  <input
                    name="lastName"
                    type="text"
                    required
                    maxLength={120}
                    defaultValue={booking.guest.lastName}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={guestFieldLabels.email}>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    defaultValue={booking.guest.email}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={guestFieldLabels.phone}>
                  <input
                    name="phone"
                    type="tel"
                    maxLength={50}
                    defaultValue={booking.guest.phone ?? ""}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={guestFieldLabels.street}>
                  <input
                    name="street"
                    type="text"
                    maxLength={180}
                    defaultValue={booking.guest.street ?? ""}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={guestFieldLabels.postalCode}>
                  <input
                    name="postalCode"
                    type="text"
                    maxLength={20}
                    defaultValue={booking.guest.postalCode ?? ""}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={guestFieldLabels.city}>
                  <input
                    name="city"
                    type="text"
                    maxLength={120}
                    defaultValue={booking.guest.city ?? ""}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={guestFieldLabels.country}>
                  <input
                    name="country"
                    type="text"
                    maxLength={120}
                    defaultValue={booking.guest.country ?? ""}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={guestFieldLabels.locale}>
                  <select
                    name="locale"
                    defaultValue={booking.guest.locale}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  >
                    <option value="de">DE</option>
                    <option value="en">EN</option>
                    <option value="ru">RU</option>
                  </select>
                </AdminField>
                <div className="sm:col-span-2">
                  <AdminField label={guestFieldLabels.notes}>
                    <textarea
                      name="notes"
                      rows={4}
                      maxLength={2000}
                      defaultValue={booking.guest.notes ?? ""}
                      className="block w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                    />
                  </AdminField>
                </div>

                <details
                  open={hasPassportData}
                  className="group/passport rounded-xl border border-[#dfd2c0] bg-[#faf6ef] p-3 sm:col-span-2"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-lg px-1 py-1 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">
                      <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[#b4884c]">
                        {t.dashboard.pages.bookings.detail.passportDataTitle}
                      </span>
                      <span className="mt-1 block text-xs font-light leading-relaxed text-[#6c6459]">
                        {t.dashboard.pages.bookings.detail.passportDataDescription}
                      </span>
                    </span>
                    <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-[#b4884c] transition-transform duration-300 group-open/passport:rotate-180" />
                  </summary>

                  <div className="mt-4 border-t border-[#e7dbc9] pt-4">
                    <label className="flex items-center gap-3 rounded-xl border border-[#dfd2c0] bg-white px-4 py-3 text-sm text-[#3a342c]">
                      <input
                        name="isForeignGuest"
                        type="checkbox"
                        defaultChecked={booking.guest.isForeignGuest}
                        className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                      />
                      {guestFieldLabels.isForeignGuest}
                    </label>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <AdminField label={guestFieldLabels.dateOfBirth}>
                        <input
                          name="dateOfBirth"
                          type="date"
                          defaultValue={formatGuestDateInput(booking.guest.dateOfBirth)}
                          className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                        />
                      </AdminField>
                      <AdminField label={guestFieldLabels.nationality}>
                        <input
                          name="nationality"
                          type="text"
                          maxLength={120}
                          defaultValue={booking.guest.nationality ?? ""}
                          className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                        />
                      </AdminField>
                      <AdminField label={guestFieldLabels.passportNumber}>
                        <input
                          name="passportNumber"
                          type="text"
                          maxLength={80}
                          defaultValue={booking.guest.passportNumber ?? ""}
                          className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                        />
                      </AdminField>
                      <AdminField label={guestFieldLabels.passportIssuingCountry}>
                        <input
                          name="passportIssuingCountry"
                          type="text"
                          maxLength={120}
                          defaultValue={booking.guest.passportIssuingCountry ?? ""}
                          className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                        />
                      </AdminField>
                      <AdminField label={guestFieldLabels.passportExpiryDate}>
                        <input
                          name="passportExpiryDate"
                          type="date"
                          defaultValue={formatGuestDateInput(
                            booking.guest.passportExpiryDate
                          )}
                          className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                        />
                      </AdminField>
                    </div>
                  </div>
                </details>
              </div>

              <AdminSubmitButton
                pendingLabel={`${t.dashboard.controls.save}...`}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#cda867] bg-[#bf9556] px-5 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(128,92,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ad8448] sm:w-auto"
              >
                {t.dashboard.controls.save}
              </AdminSubmitButton>
            </AdminPendingFieldset>
          </form>
        </details>

        <AdminPanel
          badge={t.dashboard.pages.bookings.detail.changeHistoryTitle}
          description={t.dashboard.pages.bookings.detail.changeHistoryDescription}
          title={t.dashboard.pages.bookings.detail.changeHistoryTitle}
        >
          {booking.guestChangeLogs.length ? (
            <div className="space-y-3">
              {booking.guestChangeLogs.map((log) => {
                const changes = parseGuestChanges(log.changes);

                return (
                  <article
                    key={log.id}
                    className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4"
                  >
                    <div className="flex flex-col gap-1 text-[0.68rem] text-[#8f836f] sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        {t.dashboard.pages.bookings.detail.changedBy}:{" "}
                        <strong className="font-medium text-[#4f483f]">
                          {log.changedBy}
                        </strong>
                      </span>
                      <span>{formatAdminDateTime(log.createdAt, locale)}</span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {changes.map((change) => (
                        <div
                          key={change.field}
                          className="rounded-xl border border-[#eee5d9] bg-white px-3 py-3"
                        >
                          <div className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#b4884c]">
                            {guestFieldLabels[change.field]}
                          </div>
                          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="min-w-0 rounded-lg bg-[#faf6ef] px-3 py-2">
                              <div className="text-[0.54rem] font-medium uppercase tracking-[0.12em] text-[#9e927f]">
                                {t.dashboard.pages.bookings.detail.previousValue}
                              </div>
                              <div className="mt-1 whitespace-pre-wrap break-words text-xs text-[#6c6459]">
                                {formatGuestChangeValue(
                                  change.field,
                                  change.previousValue
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 rounded-lg border border-[#e1d5c3] bg-[#fffdf9] px-3 py-2">
                              <div className="text-[0.54rem] font-medium uppercase tracking-[0.12em] text-[#9e927f]">
                                {t.dashboard.pages.bookings.detail.nextValue}
                              </div>
                              <div className="mt-1 whitespace-pre-wrap break-words text-xs text-[#201b17]">
                                {formatGuestChangeValue(
                                  change.field,
                                  change.nextValue
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#d8cbb8] bg-[#faf6ef] px-4 py-6 text-sm font-light text-[#6c6459]">
              {t.dashboard.pages.bookings.detail.changeHistoryEmpty}
            </div>
          )}
        </AdminPanel>
      </section>
    </AdminShell>
  );
}
