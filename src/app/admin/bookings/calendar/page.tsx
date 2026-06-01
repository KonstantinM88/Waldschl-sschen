import AdminBookingCalendar from "@/components/admin/AdminBookingCalendar";
import AdminShell from "@/components/admin/AdminShell";
import {
  formatCalendarMonthParam,
  getAdminCalendarMonth,
  normalizeCalendarMonthParam,
  shiftCalendarMonth,
} from "@/lib/admin-booking-views";
import {
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  resolveAdminSearchParams,
} from "@/lib/admin-dashboard";
import { getAdminFeedbackFromSearchParams } from "@/lib/admin-feedback";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);
  const { year, month } = normalizeCalendarMonthParam(
    getAdminSearchParam(params, "month")
  );

  const [{ locale, session, t }, summary, calendar] = await Promise.all([
    getAdminPageContext("/admin/bookings/calendar"),
    getAdminSummary(),
    getAdminCalendarMonth(year, month),
  ]);

  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );

  const previous = shiftCalendarMonth(year, month, -1);
  const next = shiftCalendarMonth(year, month, 1);
  const tc = t.dashboard.pages.calendar;

  return (
    <AdminShell
      badge={tc.badge}
      currentPath="/admin/bookings/calendar"
      description={tc.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={tc.title}
    >
      <AdminBookingCalendar
        calendar={calendar}
        locale={locale}
        previousHref={`/admin/bookings/calendar?month=${formatCalendarMonthParam(previous.year, previous.month)}`}
        nextHref={`/admin/bookings/calendar?month=${formatCalendarMonthParam(next.year, next.month)}`}
        todayHref="/admin/bookings/calendar"
        newBookingHref="/admin/bookings/new"
        labels={{
          title: tc.calendar.title,
          subtitle: tc.calendar.subtitle,
          today: tc.calendar.today,
          newBooking: tc.calendar.newBooking,
          occupancy: tc.calendar.occupancy,
          available: tc.calendar.available,
          arrivals: tc.calendar.arrivals,
          departures: tc.calendar.departures,
          full: tc.calendar.full,
          free: tc.calendar.free,
          legend: tc.calendar.legend,
          legendLow: tc.calendar.legendLow,
          legendMid: tc.calendar.legendMid,
          legendHigh: tc.calendar.legendHigh,
          legendFull: tc.calendar.legendFull,
          weekdays: tc.calendar.weekdays,
          selectDay: tc.calendar.selectDay,
          capacityLabel: tc.calendar.capacityLabel,
        }}
      />
    </AdminShell>
  );
}
