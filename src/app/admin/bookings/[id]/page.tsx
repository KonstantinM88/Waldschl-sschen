import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingStatus } from "@prisma/client";
import {
  CalendarClock,
  CheckCircle2,
  LogIn,
  LogOut,
  Mail,
  PawPrint,
  Users,
  XCircle,
} from "lucide-react";
import {
  cancelBookingAction,
  saveBookingAdminNotesAction,
  updateBookingStatusAction,
} from "@/app/admin/booking-actions";
import AdminBookingStatusBadge from "@/components/admin/AdminBookingStatusBadge";
import AdminConfirmButton from "@/components/admin/AdminConfirmButton";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import { AdminPanel } from "@/components/admin/AdminUi";
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
import { BOOKING_STATUS_TRANSITIONS } from "@/lib/booking-lifecycle";
import { formatHotelDate } from "@/lib/booking-dates";
import { getMealPlanLabel, getRoomTypeLabel } from "@/lib/booking-engine";

const STATUS_ACTION_ICON: Partial<Record<BookingStatus, typeof CheckCircle2>> = {
  CONFIRMED: CheckCircle2,
  CHECKED_IN: LogIn,
  CHECKED_OUT: LogOut,
  NO_SHOW: XCircle,
  PENDING: CalendarClock,
};

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
    </AdminShell>
  );
}
