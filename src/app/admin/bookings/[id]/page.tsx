import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingStatus } from "@prisma/client";
import { Mail, PawPrint, Users } from "lucide-react";
import { updateBookingStatusAction } from "@/app/admin/booking-actions";
import AdminBookingStatusBadge from "@/components/admin/AdminBookingStatusBadge";
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
import { formatHotelDate } from "@/lib/booking-dates";
import { getRoomTypeLabel } from "@/lib/booking-engine";

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

  const bookingStatusOptions = ([
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "CHECKED_IN",
    "CHECKED_OUT",
    "NO_SHOW",
  ] as BookingStatus[]).map((status) => ({
    label: t.dashboard.bookingStatuses[status],
    value: status,
  }));

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
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
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
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.bookings.fields.created}
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
            </div>

            <form action={updateBookingStatusAction} className="pt-2">
              <input type="hidden" name="id" value={booking.id} />
              <input type="hidden" name="returnTo" value={currentPath} />
              <AdminPendingFieldset>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    name="status"
                    defaultValue={booking.status}
                    className="min-h-11 flex-1 rounded-full border border-[#dfd4c2] bg-white px-4 text-sm text-[#201b17] outline-none"
                  >
                    {bookingStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <AdminSubmitButton
                    pendingLabel={`${t.dashboard.controls.saveStatus}...`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                  >
                    {t.dashboard.controls.saveStatus}
                  </AdminSubmitButton>
                </div>
              </AdminPendingFieldset>
            </form>
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
                className="mt-3 inline-flex items-center gap-2 text-[#6c6459] hover:text-[#201b17]"
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
          </div>
        </AdminPanel>
      </section>
    </AdminShell>
  );
}
