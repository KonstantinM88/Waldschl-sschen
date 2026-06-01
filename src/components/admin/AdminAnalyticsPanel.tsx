import {
  BedDouble,
  CalendarRange,
  Coins,
  Gauge,
  PercentCircle,
  TrendingUp,
} from "lucide-react";
import type { BookingAnalytics } from "@/lib/booking-lifecycle";
import type { BookingSource, BookingStatus } from "@prisma/client";
import { formatAdminCurrency } from "@/lib/admin-dashboard";
import type { AdminLocale } from "@/lib/admin-i18n";

interface AdminAnalyticsPanelProps {
  analytics: BookingAnalytics;
  locale: AdminLocale;
  labels: {
    kpiOccupancy: string;
    kpiAdr: string;
    kpiRevpar: string;
    kpiRevenue: string;
    kpiRealized: string;
    kpiPending: string;
    kpiLeadTime: string;
    kpiStay: string;
    kpiCancellation: string;
    kpiNoShow: string;
    kpiRoomNights: string;
    days: string;
    nights: string;
    revenueTitle: string;
    revenueEmpty: string;
    sourceTitle: string;
    statusTitle: string;
    bookings: string;
  };
  statusLabels: Record<BookingStatus, string>;
  sourceLabels: Record<BookingSource, string>;
}

function MetricTile({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#ded3c3] bg-[#fffdf9] px-4 py-4 shadow-[0_14px_34px_rgba(37,28,20,0.045)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eadfce] bg-[#f6efe4] text-[#b4884c]">
          <Icon className="h-4 w-4 stroke-[1.8]" />
        </div>
        {detail ? (
          <div className="text-right text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#9d8e78]">
            {detail}
          </div>
        ) : null}
      </div>
      <div className="mt-4 font-[var(--font-display)] text-[1.8rem] leading-none text-[#1f1b17]">
        {value}
      </div>
      <div className="mt-1.5 text-[0.78rem] font-light text-[#5d564c]">{label}</div>
    </div>
  );
}

export default function AdminAnalyticsPanel({
  analytics,
  locale,
  labels,
  statusLabels,
  sourceLabels,
}: AdminAnalyticsPanelProps) {
  const currency = (value: number) => formatAdminCurrency(value, locale);
  const maxMonthly = Math.max(
    ...analytics.monthlyRevenue.map((entry) => entry.revenue),
    1
  );
  const totalSource = analytics.sourceMix.reduce((sum, entry) => sum + entry.count, 0);
  const totalStatus = analytics.statusMix.reduce((sum, entry) => sum + entry.count, 0);

  const monthFormatter = new Intl.DateTimeFormat(
    locale === "ru" ? "ru-RU" : "de-DE",
    { month: "short", year: "2-digit" }
  );

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        <MetricTile
          icon={Gauge}
          label={labels.kpiOccupancy}
          value={`${analytics.occupancyRate}%`}
          detail={`${analytics.roomNights} ${labels.nights}`}
        />
        <MetricTile
          icon={Coins}
          label={labels.kpiAdr}
          value={currency(analytics.adr)}
        />
        <MetricTile
          icon={TrendingUp}
          label={labels.kpiRevpar}
          value={currency(analytics.revpar)}
        />
        <MetricTile
          icon={CalendarRange}
          label={labels.kpiLeadTime}
          value={`${analytics.averageLeadTimeDays} ${labels.days}`}
        />
        <MetricTile
          icon={BedDouble}
          label={labels.kpiStay}
          value={`${analytics.averageStayNights} ${labels.nights}`}
        />
        <MetricTile
          icon={PercentCircle}
          label={labels.kpiCancellation}
          value={`${analytics.cancellationRate}%`}
          detail={`${labels.kpiNoShow}: ${analytics.noShowRate}%`}
        />
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#cfe5c6] bg-[#f1f8ec] px-4 py-4">
          <div className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#4d6e38]">
            {labels.kpiRevenue}
          </div>
          <div className="mt-3 font-[var(--font-display)] text-[1.9rem] leading-none text-[#2f4a1f]">
            {currency(analytics.confirmedRevenue)}
          </div>
        </div>
        <div className="rounded-2xl border border-[#c8d8ef] bg-[#eef4fc] px-4 py-4">
          <div className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#40638f]">
            {labels.kpiRealized}
          </div>
          <div className="mt-3 font-[var(--font-display)] text-[1.9rem] leading-none text-[#2c4366]">
            {currency(analytics.realizedRevenue)}
          </div>
        </div>
        <div className="rounded-2xl border border-[#ead6a7] bg-[#fdf6e3] px-4 py-4">
          <div className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#8d6421]">
            {labels.kpiPending}
          </div>
          <div className="mt-3 font-[var(--font-display)] text-[1.9rem] leading-none text-[#6f4e15]">
            {currency(analytics.pendingRevenue)}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-4 shadow-[0_14px_34px_rgba(37,28,20,0.045)] sm:p-5">
          <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
            {labels.revenueTitle}
          </div>
          {analytics.monthlyRevenue.length ? (
            <div className="mt-5 flex h-44 items-end gap-2">
              {analytics.monthlyRevenue.map((entry) => (
                <div key={entry.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-[linear-gradient(180deg,#d8bd84_0%,#b4884c_100%)]"
                      style={{
                        height: `${Math.max((entry.revenue / maxMonthly) * 100, 3)}%`,
                      }}
                      title={currency(entry.revenue)}
                    />
                  </div>
                  <div className="text-[0.54rem] font-medium text-[#9a8f7c]">
                    {monthFormatter.format(new Date(`${entry.month}-01T12:00:00Z`))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[0.8rem] font-light text-[#9a8f7c]">
              {labels.revenueEmpty}
            </p>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-4 shadow-[0_14px_34px_rgba(37,28,20,0.045)] sm:p-5">
            <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
              {labels.sourceTitle}
            </div>
            <div className="mt-4 space-y-3">
              {analytics.sourceMix.length ? (
                analytics.sourceMix.map((entry) => {
                  const share = totalSource
                    ? Math.round((entry.count / totalSource) * 100)
                    : 0;
                  return (
                    <div key={entry.source}>
                      <div className="flex items-center justify-between text-[0.72rem] text-[#5d564c]">
                        <span>{sourceLabels[entry.source]}</span>
                        <span className="tabular-nums">
                          {entry.count} · {share}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#efe7dc]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#d8bd84_0%,#b4884c_100%)]"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[0.8rem] font-light text-[#9a8f7c]">—</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-4 shadow-[0_14px_34px_rgba(37,28,20,0.045)] sm:p-5">
            <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
              {labels.statusTitle}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {analytics.statusMix.length ? (
                analytics.statusMix.map((entry) => {
                  const share = totalStatus
                    ? Math.round((entry.count / totalStatus) * 100)
                    : 0;
                  return (
                    <div
                      key={entry.status}
                      className="rounded-xl border border-[#eadfcf] bg-[#faf6ef] px-3 py-2"
                    >
                      <div className="text-[0.56rem] font-medium uppercase tracking-[0.12em] text-[#9e927f]">
                        {statusLabels[entry.status]}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[#1f1b17]">
                        {entry.count}{" "}
                        <span className="text-[0.7rem] font-normal text-[#9a8f7c]">
                          · {share}%
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[0.8rem] font-light text-[#9a8f7c]">—</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
