import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminBookingCreateForm from "@/components/admin/AdminBookingCreateForm";
import AdminShell from "@/components/admin/AdminShell";
import { getActiveRoomOptions } from "@/lib/admin-booking-views";
import {
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  resolveAdminSearchParams,
} from "@/lib/admin-dashboard";
import { getAdminFeedbackFromSearchParams } from "@/lib/admin-feedback";

export const dynamic = "force-dynamic";

function normalizeDateParam(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

export default async function AdminNewBookingPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);

  const [{ locale, session, t }, summary, rooms] = await Promise.all([
    getAdminPageContext("/admin/bookings/new"),
    getAdminSummary(),
    getActiveRoomOptions(),
  ]);

  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );

  const tn = t.dashboard.pages.newBooking;
  const initialCheckIn = normalizeDateParam(getAdminSearchParam(params, "checkIn"));

  return (
    <AdminShell
      badge={tn.badge}
      currentPath="/admin/bookings/new"
      description={tn.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={tn.title}
    >
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 rounded-xl border border-[#dfd2c0] bg-[#faf7f1] px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdb99d] hover:bg-white hover:text-[#201b17]"
      >
        <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
        {t.dashboard.controls.backToList}
      </Link>

      <AdminBookingCreateForm
        rooms={rooms}
        returnTo="/admin/bookings"
        locale={locale}
        initialCheckIn={initialCheckIn}
        labels={tn.form}
      />
    </AdminShell>
  );
}
