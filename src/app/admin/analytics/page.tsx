import Link from "next/link";
import type { BookingSource, BookingStatus } from "@prisma/client";
import AdminAnalyticsPanel from "@/components/admin/AdminAnalyticsPanel";
import AdminShell from "@/components/admin/AdminShell";
import {
  getAdminAnalytics,
  normalizeAnalyticsRange,
} from "@/lib/admin-booking-views";
import {
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  resolveAdminSearchParams,
} from "@/lib/admin-dashboard";
import { getAdminFeedbackFromSearchParams } from "@/lib/admin-feedback";

export const dynamic = "force-dynamic";

const RANGE_OPTIONS = [7, 30, 90, 365];

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);
  const range = normalizeAnalyticsRange(getAdminSearchParam(params, "range"));

  const [{ locale, session, t }, summary, analytics] = await Promise.all([
    getAdminPageContext("/admin/analytics"),
    getAdminSummary(),
    getAdminAnalytics(range),
  ]);

  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );

  const ta = t.dashboard.pages.analytics;
  const statusLabels = t.dashboard.bookingStatuses as Record<BookingStatus, string>;
  const sourceLabels = t.dashboard.bookingSources as Record<BookingSource, string>;

  return (
    <AdminShell
      badge={ta.badge}
      currentPath="/admin/analytics"
      description={ta.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={ta.title}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
          {ta.rangeLabel}
        </span>
        {RANGE_OPTIONS.map((option) => {
          const active = option === range;
          return (
            <Link
              key={option}
              href={`/admin/analytics?range=${option}`}
              className={[
                "inline-flex min-h-9 items-center justify-center rounded-full border px-4 text-[0.62rem] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                active
                  ? "border-[rgba(184,136,76,0.3)] bg-[linear-gradient(135deg,#d8bd84_0%,#b4884c_100%)] text-white shadow-[0_12px_24px_rgba(128,92,39,0.18)]"
                  : "border-[#dfd4c2] bg-white text-[#6c6459] hover:border-[#cdbca4] hover:text-[#201b17]",
              ].join(" ")}
            >
              {ta.ranges[String(option) as "7" | "30" | "90" | "365"]}
            </Link>
          );
        })}
      </div>

      <AdminAnalyticsPanel
        analytics={analytics}
        locale={locale}
        labels={ta.metrics}
        statusLabels={statusLabels}
        sourceLabels={sourceLabels}
      />
    </AdminShell>
  );
}
