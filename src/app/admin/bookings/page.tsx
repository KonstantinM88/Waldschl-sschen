import Link from "next/link";
import { BookingStatus } from "@prisma/client";
import { CalendarDays, Mail, PawPrint, Users } from "lucide-react";
import { bulkUpdateBookingStatusAction } from "@/app/admin/booking-actions";
import AdminBookingStatusBadge from "@/components/admin/AdminBookingStatusBadge";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import {
  AdminEmptyState,
  AdminFilterBar,
  AdminMetricCard,
  AdminPagination,
  AdminPanel,
  AdminSelectField,
} from "@/components/admin/AdminUi";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import {
  buildAdminPath,
  getAdminFeedbackFromSearchParams,
} from "@/lib/admin-feedback";
import {
  formatAdminCurrency,
  formatAdminDateTime,
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  getBookingsPage,
  normalizeAdminPageParam,
  normalizeAdminSearchQuery,
  normalizeBookingStatusFilter,
  resolveAdminSearchParams,
  truncate,
} from "@/lib/admin-dashboard";
import { formatHotelDate } from "@/lib/booking-dates";
import { getRoomTypeLabel } from "@/lib/booking-engine";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);
  const query = normalizeAdminSearchQuery(getAdminSearchParam(params, "q"));
  const statusFilter = normalizeBookingStatusFilter(
    getAdminSearchParam(params, "status")
  );
  const page = normalizeAdminPageParam(getAdminSearchParam(params, "page"));

  const [{ locale, session, t }, summary, bookingPage] = await Promise.all([
    getAdminPageContext("/admin/bookings"),
    getAdminSummary(),
    getBookingsPage({
      page,
      pageSize: 10,
      query,
      status: statusFilter,
    }),
  ]);

  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );
  const currentListPath = buildAdminPath("/admin/bookings", {
    q: query || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page: page > 1 ? String(page) : undefined,
  });
  const exportHref = buildAdminPath("/api/admin/export/bookings", {
    q: query || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const bookingStatusOptions = [
    {
      label: t.dashboard.pages.bookings.filters.allStatuses,
      value: "all",
    },
    ...([
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "CHECKED_IN",
      "CHECKED_OUT",
      "NO_SHOW",
    ] as BookingStatus[]).map((status) => ({
      label: t.dashboard.bookingStatuses[status],
      value: status,
    })),
  ];

  return (
    <AdminShell
      badge={t.dashboard.pages.bookings.badge}
      currentPath={currentListPath}
      description={t.dashboard.pages.bookings.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.pages.bookings.title}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <AdminMetricCard
          detail={t.dashboard.statCards.bookings.detail(summary.pendingBookings)}
          Icon={CalendarDays}
          label={t.dashboard.pages.bookings.stats.total}
          value={summary.totalBookings}
        />
        <AdminMetricCard
          detail={t.dashboard.bookingStatuses.PENDING}
          Icon={CalendarDays}
          label={t.dashboard.pages.bookings.stats.pending}
          value={summary.pendingBookings}
        />
        <AdminMetricCard
          detail={t.dashboard.bookingStatuses.CONFIRMED}
          Icon={CalendarDays}
          label={t.dashboard.pages.bookings.stats.confirmed}
          value={summary.confirmedBookings}
        />
        <AdminMetricCard
          detail={t.dashboard.bookingStatuses.CHECKED_IN}
          Icon={Users}
          label={t.dashboard.pages.bookings.stats.checkedIn}
          value={summary.checkedInBookings}
        />
      </section>

      <AdminPanel
        actionHref={exportHref}
        actionLabel={t.dashboard.controls.exportCsv}
        badge={t.dashboard.sections.bookingBadge}
        description={t.dashboard.sections.items(bookingPage.pagination.totalItems)}
        title={t.dashboard.sections.bookingTitle}
      >
        <AdminFilterBar
          resetHref="/admin/bookings"
          resetLabel={t.dashboard.controls.reset}
          searchLabel={t.dashboard.controls.searchLabel}
          searchPlaceholder={t.dashboard.pages.bookings.filters.searchPlaceholder}
          searchValue={query}
          submitLabel={t.dashboard.controls.apply}
        >
          <AdminSelectField
            label={t.dashboard.pages.bookings.filters.statusLabel}
            name="status"
            options={bookingStatusOptions}
            value={statusFilter}
          />
        </AdminFilterBar>

        {bookingPage.items.length ? (
          <form action={bulkUpdateBookingStatusAction}>
            <input type="hidden" name="returnTo" value={currentListPath} />
            <AdminPendingFieldset>
              <div className="mb-4 flex flex-col gap-3 rounded-[1.35rem] border border-[#eadfcf] bg-[#faf7f1] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm font-light text-[#5d564c]">
                  {t.dashboard.sections.items(bookingPage.pagination.totalItems)}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    name="status"
                    defaultValue={statusFilter === "all" ? "PENDING" : statusFilter}
                    className="min-h-11 rounded-full border border-[#dfd4c2] bg-white px-4 text-sm text-[#201b17] outline-none"
                  >
                    {bookingStatusOptions
                      .filter((option) => option.value !== "all")
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                  <AdminSubmitButton
                    pendingLabel={`${t.dashboard.controls.bulkSaveStatus}...`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                  >
                    {t.dashboard.controls.bulkSaveStatus}
                  </AdminSubmitButton>
                </div>
              </div>

              <div className="space-y-3">
                {bookingPage.items.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-[1.45rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex gap-4">
                        <label className="pt-1">
                          <input
                            type="checkbox"
                            name="ids"
                            value={booking.id}
                            className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                          />
                        </label>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-medium text-[#201b17]">
                            {booking.guest.firstName} {booking.guest.lastName}
                          </h3>
                          <AdminBookingStatusBadge
                            label={t.dashboard.bookingStatuses[booking.status]}
                            status={booking.status}
                          />
                          <span className="rounded-full border border-[#eadfcf] bg-white px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                            {booking.locale.toUpperCase()}
                          </span>
                          </div>

                          <div className="mt-2 text-sm font-light text-[#5d564c]">
                            {getRoomTypeLabel(booking.room.type, locale)}
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-[#4f483f] md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-3 py-3">
                              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                                {t.dashboard.pages.bookings.fields.stay}
                              </div>
                              <div className="mt-2">
                                {formatHotelDate(booking.checkIn, locale)} - {formatHotelDate(booking.checkOut, locale)}
                              </div>
                            </div>
                            <div className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-3 py-3">
                              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                                {t.dashboard.pages.bookings.fields.guests}
                              </div>
                              <div className="mt-2 inline-flex items-center gap-2">
                                <Users className="h-4 w-4 stroke-[1.8]" />
                                {booking.guests}
                              </div>
                            </div>
                            <div className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-3 py-3">
                              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                                {t.dashboard.pages.bookings.fields.total}
                              </div>
                              <div className="mt-2">
                                {formatAdminCurrency(booking.totalAmount.toString(), locale)}
                              </div>
                            </div>
                            <div className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-3 py-3">
                              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                                {t.dashboard.pages.bookings.fields.created}
                              </div>
                              <div className="mt-2">
                                {formatAdminDateTime(booking.createdAt, locale)}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#6c6459]">
                            <a
                              href={`mailto:${booking.guest.email}`}
                              className="inline-flex items-center gap-2 hover:text-[#201b17]"
                            >
                              <Mail className="h-4 w-4 stroke-[1.8]" />
                              {booking.guest.email}
                            </a>
                            {booking.dogCount > 0 ? (
                              <span className="inline-flex items-center gap-2">
                                <PawPrint className="h-4 w-4 stroke-[1.8]" />
                                {booking.dogCount}
                              </span>
                            ) : null}
                          </div>

                          {booking.notes ? (
                            <p className="mt-4 text-sm font-light leading-relaxed text-[#4f483f]">
                              {truncate(booking.notes, 220)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-3 xl:items-end">
                        <div className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                          {booking.id}
                        </div>
                        <Link
                          href={buildAdminPath(`/admin/bookings/${booking.id}`, {
                            returnTo: currentListPath,
                          })}
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                        >
                          {t.dashboard.controls.openDetails}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </AdminPendingFieldset>
          </form>
        ) : (
          <AdminEmptyState>{t.dashboard.sections.noBookings}</AdminEmptyState>
        )}

        <AdminPagination
          currentPage={bookingPage.pagination.page}
          nextLabel={t.dashboard.controls.next}
          path="/admin/bookings"
          params={{
            q: query || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
          }}
          previousLabel={t.dashboard.controls.previous}
          totalPages={bookingPage.pagination.totalPages}
        />
      </AdminPanel>
    </AdminShell>
  );
}
