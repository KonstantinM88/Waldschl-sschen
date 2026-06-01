"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, LogIn, LogOut } from "lucide-react";
import type { CalendarMonth } from "@/lib/booking-lifecycle";
import type { AdminLocale } from "@/lib/admin-i18n";

interface AdminBookingCalendarProps {
  calendar: CalendarMonth;
  locale: AdminLocale;
  previousHref: string;
  nextHref: string;
  todayHref: string;
  newBookingHref: string;
  labels: {
    title: string;
    subtitle: string;
    today: string;
    newBooking: string;
    occupancy: string;
    available: string;
    arrivals: string;
    departures: string;
    full: string;
    free: string;
    legend: string;
    legendLow: string;
    legendMid: string;
    legendHigh: string;
    legendFull: string;
    weekdays: readonly string[];
    selectDay: string;
    capacityLabel: string;
  };
}

const intlByLocale: Record<AdminLocale, string> = {
  de: "de-DE",
  ru: "ru-RU",
};

function occupancyTone(ratio: number) {
  if (ratio <= 0) {
    return {
      bg: "bg-[#f4f0e8]",
      bar: "bg-[#d9d0bf]",
      text: "text-[#9a8f7c]",
    };
  }
  if (ratio < 0.5) {
    return {
      bg: "bg-[#eef6ea]",
      bar: "bg-[#7fae63]",
      text: "text-[#4d6e38]",
    };
  }
  if (ratio < 0.8) {
    return {
      bg: "bg-[#fdf4e0]",
      bar: "bg-[#dcab53]",
      text: "text-[#8d6421]",
    };
  }
  if (ratio < 1) {
    return {
      bg: "bg-[#fcecdd]",
      bar: "bg-[#d98b4b]",
      text: "text-[#9b5a25]",
    };
  }
  return {
    bg: "bg-[#fbe7e2]",
    bar: "bg-[#cf6a55]",
    text: "text-[#9f4636]",
  };
}

export default function AdminBookingCalendar({
  calendar,
  locale,
  previousHref,
  nextHref,
  todayHref,
  newBookingHref,
  labels,
}: AdminBookingCalendarProps) {
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const monthLabel = useMemo(() => {
    const date = new Date(Date.UTC(calendar.year, calendar.month - 1, 1, 12));
    return new Intl.DateTimeFormat(intlByLocale[locale], {
      month: "long",
      year: "numeric",
    }).format(date);
  }, [calendar.year, calendar.month, locale]);

  // Monday-first grid offset.
  const leadingBlanks = useMemo(() => {
    const first = new Date(Date.UTC(calendar.year, calendar.month - 1, 1, 12));
    const weekday = first.getUTCDay(); // 0 = Sun
    return (weekday + 6) % 7;
  }, [calendar.year, calendar.month]);

  const todayIso = new Date().toISOString().slice(0, 10);
  const activeCell = calendar.days.find((day) => day.date === activeDate) ?? null;

  return (
    <div className="rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-3 shadow-[0_14px_34px_rgba(37,28,20,0.055)] sm:p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
            {labels.title}
          </div>
          <h2 className="mt-2 font-[var(--font-display)] text-[clamp(1.5rem,5vw,2rem)] capitalize leading-none text-[#1f1b17]">
            {monthLabel}
          </h2>
          <p className="mt-2 max-w-[42rem] text-sm font-light text-[#5d564c]">
            {labels.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={previousHref}
            aria-label="prev"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dfd2c0] bg-[#faf7f1] text-[#6c6459] transition-all duration-300 hover:border-[#cdb99d] hover:bg-white hover:text-[#201b17]"
          >
            <ChevronLeft className="h-4.5 w-4.5 stroke-[1.9]" />
          </Link>
          <Link
            href={todayHref}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#dfd2c0] bg-[#faf7f1] px-4 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdb99d] hover:bg-white hover:text-[#201b17]"
          >
            {labels.today}
          </Link>
          <Link
            href={nextHref}
            aria-label="next"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dfd2c0] bg-[#faf7f1] text-[#6c6459] transition-all duration-300 hover:border-[#cdb99d] hover:bg-white hover:text-[#201b17]"
          >
            <ChevronRight className="h-4.5 w-4.5 stroke-[1.9]" />
          </Link>
          <Link
            href={newBookingHref}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#cda867] bg-[#bf9556] px-4 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(128,92,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ad8448]"
          >
            {labels.newBooking}
          </Link>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1.5 sm:gap-2">
        {labels.weekdays.map((day) => (
          <div
            key={day}
            className="px-1 text-center text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-[#9e927f]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {Array.from({ length: leadingBlanks }).map((_, index) => (
          <div key={`blank-${index}`} className="aspect-square" />
        ))}

        {calendar.days.map((day) => {
          const ratio = day.capacity ? day.occupied / day.capacity : 0;
          const tone = occupancyTone(ratio);
          const dayNumber = Number(day.date.slice(8, 10));
          const isToday = day.date === todayIso;
          const isActive = day.date === activeDate;

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setActiveDate(isActive ? null : day.date)}
              className={[
                "group relative flex aspect-square flex-col justify-between rounded-xl border p-1.5 text-left transition-all duration-200 sm:p-2",
                tone.bg,
                isActive
                  ? "border-[#bf9556] ring-2 ring-[rgba(191,149,86,0.35)]"
                  : isToday
                    ? "border-[#cda867]"
                    : "border-[#e7ddcd] hover:border-[#d2c1aa]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "text-xs font-semibold sm:text-sm",
                    isToday ? "text-[#9b5a25]" : "text-[#3a342c]",
                  ].join(" ")}
                >
                  {dayNumber}
                </span>
                <span className={["text-[0.58rem] font-semibold tabular-nums", tone.text].join(" ")}>
                  {day.capacity ? `${day.occupied}/${day.capacity}` : "—"}
                </span>
              </div>

              <div className="space-y-1">
                {(day.arrivals > 0 || day.departures > 0) && (
                  <div className="flex items-center gap-1.5 text-[0.54rem] font-medium">
                    {day.arrivals > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[#4d6e38]">
                        <LogIn className="h-2.5 w-2.5 stroke-[2.4]" />
                        {day.arrivals}
                      </span>
                    )}
                    {day.departures > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[#9b5a25]">
                        <LogOut className="h-2.5 w-2.5 stroke-[2.4]" />
                        {day.departures}
                      </span>
                    )}
                  </div>
                )}
                <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
                  <div
                    className={["h-full rounded-full", tone.bar].join(" ")}
                    style={{ width: `${Math.min(Math.round(ratio * 100), 100)}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {activeCell ? (
        <div className="mt-5 rounded-2xl border border-[#e3d6c4] bg-[#faf6ef] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-[var(--font-display)] text-lg text-[#1f1b17]">
              {new Intl.DateTimeFormat(intlByLocale[locale], {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(new Date(`${activeCell.date}T12:00:00Z`))}
            </div>
            <Link
              href={`${newBookingHref}${newBookingHref.includes("?") ? "&" : "?"}checkIn=${activeCell.date}`}
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#cda867] bg-[#bf9556] px-3 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#ad8448]"
            >
              {labels.newBooking}
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[#eadfcf] bg-white px-3 py-2.5">
              <div className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#9e927f]">
                {labels.occupancy}
              </div>
              <div className="mt-1 text-lg font-semibold text-[#1f1b17]">
                {activeCell.occupied}/{activeCell.capacity}
              </div>
            </div>
            <div className="rounded-xl border border-[#eadfcf] bg-white px-3 py-2.5">
              <div className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#9e927f]">
                {labels.available}
              </div>
              <div className="mt-1 text-lg font-semibold text-[#4d6e38]">
                {activeCell.available}
              </div>
            </div>
            <div className="rounded-xl border border-[#eadfcf] bg-white px-3 py-2.5">
              <div className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#9e927f]">
                {labels.arrivals}
              </div>
              <div className="mt-1 text-lg font-semibold text-[#1f1b17]">
                {activeCell.arrivals}
              </div>
            </div>
            <div className="rounded-xl border border-[#eadfcf] bg-white px-3 py-2.5">
              <div className="text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[#9e927f]">
                {labels.departures}
              </div>
              <div className="mt-1 text-lg font-semibold text-[#1f1b17]">
                {activeCell.departures}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-[0.7rem] font-light text-[#9a8f7c]">
          {labels.selectDay}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#ece3d6] pt-4 text-[0.58rem] font-medium text-[#6c6459]">
        <span className="uppercase tracking-[0.14em] text-[#9e927f]">
          {labels.legend}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7fae63]" />
          {labels.legendLow}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#dcab53]" />
          {labels.legendMid}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d98b4b]" />
          {labels.legendHigh}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#cf6a55]" />
          {labels.legendFull}
        </span>
      </div>
    </div>
  );
}
