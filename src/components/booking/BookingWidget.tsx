"use client";

import { useMemo, useState } from "react";
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { de, enUS, ru } from "date-fns/locale";
import { CalendarDays, Search, Users } from "lucide-react";
import {
  HOTEL_CHECK_IN_TIME,
  HOTEL_CHECK_OUT_TIME,
  HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME,
  type BookingLocale,
} from "@/lib/booking-shared";

interface BookingWidgetProps {
  action: string;
  className?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  languageQueryValue?: BookingLocale;
  locale?: BookingLocale;
  minCheckIn?: string;
}

const dateLocales = {
  de,
  en: enUS,
  ru,
} as const;

const copy = {
  de: {
    badge: "Direkt buchen",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Gäste",
    guestsOne: "1 Gast",
    guestsTwo: "2 Gäste",
    guestsThree: "3 Gäste",
    guestsFour: "4 Gäste",
    submit: "Verfügbarkeit prüfen",
    checkInTime: `ab ${HOTEL_CHECK_IN_TIME} Uhr`,
    checkOutTime: `bis ${HOTEL_CHECK_OUT_TIME} Uhr`,
    sameDayRule: `Heute bis ${HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME} Uhr Berliner Zeit`,
    summary: (nights: number) => `${nights} Nacht${nights === 1 ? "" : "e"} · Frühstück vorausgewählt`,
  },
  en: {
    badge: "Book direct",
    checkIn: "Check-in",
    checkOut: "Check-out",
    guests: "Guests",
    guestsOne: "1 guest",
    guestsTwo: "2 guests",
    guestsThree: "3 guests",
    guestsFour: "4 guests",
    submit: "Check availability",
    checkInTime: `from ${HOTEL_CHECK_IN_TIME}`,
    checkOutTime: `until ${HOTEL_CHECK_OUT_TIME}`,
    sameDayRule: `Today until ${HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME} Berlin time`,
    summary: (nights: number) => `${nights} night${nights === 1 ? "" : "s"} · Breakfast preselected`,
  },
  ru: {
    badge: "Прямое бронирование",
    checkIn: "Заезд",
    checkOut: "Выезд",
    guests: "Гости",
    guestsOne: "1 гость",
    guestsTwo: "2 гостя",
    guestsThree: "3 гостя",
    guestsFour: "4 гостя",
    submit: "Проверить наличие",
    checkInTime: `с ${HOTEL_CHECK_IN_TIME}`,
    checkOutTime: `до ${HOTEL_CHECK_OUT_TIME}`,
    sameDayRule: `Сегодня до ${HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME} по Берлину`,
    summary: (nights: number) => `${nights} ноч. · завтрак выбран по умолчанию`,
  },
} as const;

function toLocale(locale?: BookingLocale): BookingLocale {
  return locale === "en" || locale === "ru" ? locale : "de";
}

export default function BookingWidget({
  action,
  className,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  languageQueryValue,
  locale = "de",
  minCheckIn,
}: BookingWidgetProps) {
  const normalizedLocale = toLocale(locale);
  const t = copy[normalizedLocale];
  const fallbackCheckIn = minCheckIn ?? format(new Date(), "yyyy-MM-dd");
  const fallbackCheckOut = format(addDays(parseISO(fallbackCheckIn), 1), "yyyy-MM-dd");

  const [checkIn, setCheckIn] = useState(initialCheckIn ?? fallbackCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? fallbackCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  const nights = useMemo(() => {
    try {
      const total = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
      return total > 0 ? total : 1;
    } catch {
      return 1;
    }
  }, [checkIn, checkOut]);

  const summary = useMemo(() => {
    try {
      return `${format(parseISO(checkIn), "dd MMM", { locale: dateLocales[normalizedLocale] })} - ${format(
        parseISO(checkOut),
        "dd MMM",
        { locale: dateLocales[normalizedLocale] }
      )} · ${t.summary(nights)}`;
    } catch {
      return t.summary(nights);
    }
  }, [checkIn, checkOut, nights, normalizedLocale, t]);

  return (
    <form
      action={action}
      method="GET"
      className={[
        "rounded-[1.8rem] border border-[rgba(212,188,142,0.22)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,231,0.92))] p-4 shadow-[0_24px_70px_rgba(32,24,16,0.08)] backdrop-blur-sm sm:p-5",
        className ?? "",
      ].join(" ")}
    >
      {languageQueryValue ? (
        <input name="lang" type="hidden" value={languageQueryValue} />
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e4d7c5] bg-white/75 px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
          <Search className="h-3.5 w-3.5 stroke-[1.9]" />
          {t.badge}
        </span>
        <div className="text-right text-[0.68rem] font-light text-[#6b6256]">
          {summary}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_0.8fr_auto]">
        <label className="rounded-[1.3rem] border border-[#eadfcf] bg-white px-4 py-3">
          <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
            <CalendarDays className="h-4 w-4 stroke-[1.8]" />
            {t.checkIn}
          </span>
          <span className="mt-1 block text-[0.72rem] font-light text-[#7b7368]">
            {t.checkInTime}
          </span>
          <input
            name="checkIn"
            type="date"
            min={fallbackCheckIn}
            value={checkIn}
            onChange={(event) => {
              const nextCheckIn = event.target.value;
              setCheckIn(nextCheckIn);

              if (nextCheckIn >= checkOut) {
                setCheckOut(format(addDays(parseISO(nextCheckIn), 1), "yyyy-MM-dd"));
              }
            }}
            className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
          />
        </label>

        <label className="rounded-[1.3rem] border border-[#eadfcf] bg-white px-4 py-3">
          <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
            <CalendarDays className="h-4 w-4 stroke-[1.8]" />
            {t.checkOut}
          </span>
          <span className="mt-1 block text-[0.72rem] font-light text-[#7b7368]">
            {t.checkOutTime}
          </span>
          <input
            name="checkOut"
            type="date"
            min={format(addDays(parseISO(checkIn), 1), "yyyy-MM-dd")}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
          />
        </label>

        <label className="rounded-[1.3rem] border border-[#eadfcf] bg-white px-4 py-3">
          <span className="flex items-center gap-2 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
            <Users className="h-4 w-4 stroke-[1.8]" />
            {t.guests}
          </span>
          <select
            name="guests"
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            className="mt-3 w-full bg-transparent text-sm text-[#201b17] outline-none"
          >
            <option value={1}>{t.guestsOne}</option>
            <option value={2}>{t.guestsTwo}</option>
            <option value={3}>{t.guestsThree}</option>
            <option value={4}>{t.guestsFour}</option>
          </select>
        </label>

        <button
          type="submit"
          className="inline-flex min-h-[4.25rem] items-center justify-center rounded-[1.3rem] border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_18px_34px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_22px_40px_rgba(128,92,39,0.3)]"
        >
          {t.submit}
        </button>
      </div>
      <p className="mt-3 text-xs font-light leading-relaxed text-[#7b7368]">
        {t.sameDayRule}
      </p>
    </form>
  );
}
