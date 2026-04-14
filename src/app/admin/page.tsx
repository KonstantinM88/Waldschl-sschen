import {
  BedDouble,
  CalendarCheck2,
  CalendarDays,
  Gift,
  Hotel,
  Mail,
} from "lucide-react";
import type { BookingStatus } from "@prisma/client";
import AdminBookingStatusBadge from "@/components/admin/AdminBookingStatusBadge";
import AdminShell from "@/components/admin/AdminShell";
import { AdminMetricCard, AdminPanel } from "@/components/admin/AdminUi";
import {
  getAdminPageContext,
  getAdminSummary,
} from "@/lib/admin-dashboard";

export const dynamic = "force-dynamic";

function getBookingShare(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export default async function AdminDashboardPage() {
  const [{ locale, session, t }, summary] = await Promise.all([
    getAdminPageContext("/admin"),
    getAdminSummary(),
  ]);

  const bookingMixTotal =
    summary.pendingBookings + summary.confirmedBookings + summary.checkedInBookings;

  const bookingMix = [
    {
      status: "PENDING" as BookingStatus,
      label: t.dashboard.bookingStatuses.PENDING,
      value: summary.pendingBookings,
      share: getBookingShare(summary.pendingBookings, bookingMixTotal),
      href: "/admin/bookings",
    },
    {
      status: "CONFIRMED" as BookingStatus,
      label: t.dashboard.bookingStatuses.CONFIRMED,
      value: summary.confirmedBookings,
      share: getBookingShare(summary.confirmedBookings, bookingMixTotal),
      href: "/admin/bookings",
    },
    {
      status: "CHECKED_IN" as BookingStatus,
      label: t.dashboard.bookingStatuses.CHECKED_IN,
      value: summary.checkedInBookings,
      share: getBookingShare(summary.checkedInBookings, bookingMixTotal),
      href: "/admin/bookings",
    },
  ];

  const priorityStats = [
    {
      href: "/admin/contacts",
      label: t.dashboard.overview.stats.unreadContacts,
      value: summary.unreadContacts,
    },
    {
      href: "/admin/bookings",
      label: t.dashboard.overview.stats.pendingBookings,
      value: summary.pendingBookings,
    },
    {
      href: "/admin/vouchers",
      label: t.dashboard.overview.stats.openVouchers,
      value: summary.openVouchers,
    },
    {
      href: "/admin/events",
      label: t.dashboard.overview.stats.upcomingEvents,
      value: summary.upcomingEvents,
    },
  ];

  return (
    <AdminShell
      badge={t.dashboard.overview.badge}
      currentPath="/admin"
      description={t.dashboard.overview.description}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.overview.title}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-6">
        <AdminMetricCard
          detail={t.dashboard.statCards.contacts.detail(summary.unreadContacts)}
          href="/admin/contacts"
          Icon={Mail}
          label={t.dashboard.statCards.contacts.label}
          value={summary.totalContacts}
        />
        <AdminMetricCard
          detail={t.dashboard.statCards.bookings.detail(summary.pendingBookings)}
          href="/admin/bookings"
          Icon={CalendarDays}
          label={t.dashboard.statCards.bookings.label}
          value={summary.totalBookings}
        />
        <AdminMetricCard
          detail={t.dashboard.statCards.vouchers.detail}
          href="/admin/vouchers"
          Icon={Gift}
          label={t.dashboard.statCards.vouchers.label}
          value={summary.openVouchers}
        />
        <AdminMetricCard
          detail={t.dashboard.statCards.events.detail(summary.upcomingEvents)}
          href="/admin/events"
          Icon={CalendarCheck2}
          label={t.dashboard.statCards.events.label}
          value={summary.publishedEvents}
        />
        <AdminMetricCard
          detail={`${summary.occupiedInventory}/${summary.totalInventory}`}
          href="/admin/rooms"
          Icon={Hotel}
          label={t.dashboard.overview.stats.occupancyRate}
          value={`${summary.occupancyRate}%`}
        />
        <AdminMetricCard
          detail={`${summary.activeRooms}/${summary.totalRooms}`}
          href="/admin/rooms"
          Icon={BedDouble}
          label={t.dashboard.overview.stats.availableInventory}
          value={summary.availableInventory}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AdminPanel
          description={t.dashboard.overview.queueDescription}
          title={t.dashboard.overview.queueTitle}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {priorityStats.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4 transition-all duration-300 hover:border-[#dfd4c2] hover:bg-white"
              >
                <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
                  {item.label}
                </div>
                <div className="mt-3 font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
                  {item.value}
                </div>
              </a>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel
          description={t.dashboard.overview.occupancyDescription}
          title={t.dashboard.overview.occupancyTitle}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
                {t.dashboard.overview.stats.activeRooms}
              </div>
              <div className="mt-3 font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
                {summary.activeRooms}/{summary.totalRooms}
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
                {t.dashboard.overview.stats.availableInventory}
              </div>
              <div className="mt-3 font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
                {summary.availableInventory}
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
                {t.dashboard.overview.stats.occupiedInventory}
              </div>
              <div className="mt-3 font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
                {summary.occupiedInventory}
              </div>
            </div>
            <div className="rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
                {t.dashboard.overview.stats.occupancyRate}
              </div>
              <div className="mt-3 font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
                {summary.occupancyRate}%
              </div>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-full bg-[#efe7dc]">
            <div
              className="h-3 rounded-full bg-[linear-gradient(90deg,#d8bd84_0%,#c39a5d_100%)]"
              style={{ width: `${summary.occupancyRate}%` }}
            />
          </div>
        </AdminPanel>
      </section>

      <AdminPanel
        description={t.dashboard.overview.bookingMixDescription}
        title={t.dashboard.overview.bookingMixTitle}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {bookingMix.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-[1.45rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4 transition-all duration-300 hover:border-[#dfd4c2] hover:bg-white"
            >
              <div className="flex items-center justify-between gap-4">
                <AdminBookingStatusBadge label={item.label} status={item.status} />
                <div className="rounded-full border border-[#eadfcf] bg-white px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                  {item.share}%
                </div>
              </div>
              <div className="mt-4 font-[var(--font-display)] text-[2.1rem] leading-none text-[#201b17]">
                {item.value}
              </div>
              <div className="mt-4 overflow-hidden rounded-full bg-[#efe7dc]">
                <div
                  className="h-2.5 rounded-full bg-[linear-gradient(90deg,#d8bd84_0%,#b4884c_100%)]"
                  style={{ width: `${item.share}%` }}
                />
              </div>
            </a>
          ))}
        </div>
      </AdminPanel>
    </AdminShell>
  );
}
