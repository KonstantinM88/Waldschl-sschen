import { BedDouble, Hotel, Layers3, Warehouse } from "lucide-react";
import AdminRoomManagement from "@/components/admin/AdminRoomManagement";
import AdminShell from "@/components/admin/AdminShell";
import { AdminMetricCard } from "@/components/admin/AdminUi";
import {
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  getRoomsWithBookingCounts,
  resolveAdminSearchParams,
} from "@/lib/admin-dashboard";
import { getAdminFeedbackFromSearchParams } from "@/lib/admin-feedback";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);
  const [{ locale, session, t }, summary, roomData] = await Promise.all([
    getAdminPageContext("/admin/rooms"),
    getAdminSummary(),
    getRoomsWithBookingCounts(),
  ]);
  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );

  return (
    <AdminShell
      badge={t.dashboard.pages.rooms.badge}
      currentPath="/admin/rooms"
      description={t.dashboard.pages.rooms.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.pages.rooms.title}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <AdminMetricCard
          detail={`${summary.activeRooms}/${summary.totalRooms}`}
          Icon={BedDouble}
          label={t.dashboard.pages.rooms.stats.active}
          value={summary.activeRooms}
        />
        <AdminMetricCard
          detail={t.dashboard.pages.rooms.stats.inventory}
          Icon={Warehouse}
          label={t.dashboard.pages.rooms.stats.inventory}
          value={summary.totalInventory}
        />
        <AdminMetricCard
          detail={t.dashboard.pages.rooms.stats.occupied}
          Icon={Hotel}
          label={t.dashboard.pages.rooms.stats.occupied}
          value={summary.occupiedInventory}
        />
        <AdminMetricCard
          detail={t.dashboard.pages.rooms.stats.available}
          Icon={Layers3}
          label={t.dashboard.pages.rooms.stats.available}
          value={summary.availableInventory}
        />
      </section>

      <AdminRoomManagement
        activeBookingCounts={roomData.activeBookingCounts}
        locale={locale}
        returnTo="/admin/rooms"
        rooms={roomData.rooms}
      />
    </AdminShell>
  );
}
