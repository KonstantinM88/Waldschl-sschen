import type { BookingLocale } from "@/lib/booking-shared";
import {
  HOTEL_CHECK_OUT_TIME,
  HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME,
} from "@/lib/booking-shared";

export const BERLIN_TIME_ZONE = "Europe/Berlin";

const HOTEL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const CHECK_OUT_HOUR = Number(HOTEL_CHECK_OUT_TIME.slice(0, 2));
const SAME_DAY_BOOKING_CUTOFF_SECONDS =
  Number(HOTEL_SAME_DAY_BOOKING_CUTOFF_TIME.slice(0, 2)) * 60 * 60;
const CHECK_OUT_RELEASE_SECONDS = CHECK_OUT_HOUR * 60 * 60;

interface BerlinDateParts {
  day: number;
  hour: number;
  minute: number;
  month: number;
  second: number;
  year: number;
}

function getBerlinDateParts(reference: Date = new Date()): BerlinDateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BERLIN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(reference);

  const byType = new Map(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(byType.get("year")),
    month: Number(byType.get("month")),
    day: Number(byType.get("day")),
    hour: Number(byType.get("hour")),
    minute: Number(byType.get("minute")),
    second: Number(byType.get("second")),
  };
}

function formatHotelDateInput(year: number, month: number, day: number) {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

export function parseHotelDateInput(value: string) {
  const match = HOTEL_DATE_PATTERN.exec(value);

  if (!match) {
    throw new Error("Invalid hotel date input.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid hotel date input.");
  }

  return date;
}

export function isHotelDateInput(value?: string | null) {
  if (!value) {
    return false;
  }

  try {
    parseHotelDateInput(value);
    return true;
  } catch {
    return false;
  }
}

export function addHotelDateDays(value: string, days: number) {
  const date = parseHotelDateInput(value);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

export function getBerlinTodayDateInput(reference: Date = new Date()) {
  const parts = getBerlinDateParts(reference);
  return formatHotelDateInput(parts.year, parts.month, parts.day);
}

export function isSameDayBookingWindowOpen(reference: Date = new Date()) {
  const parts = getBerlinDateParts(reference);
  const currentSeconds =
    parts.hour * 60 * 60 + parts.minute * 60 + parts.second;

  return currentSeconds <= SAME_DAY_BOOKING_CUTOFF_SECONDS;
}

export function getEarliestBookableCheckInDate(reference: Date = new Date()) {
  const today = getBerlinTodayDateInput(reference);

  return isSameDayBookingWindowOpen(reference)
    ? today
    : addHotelDateDays(today, 1);
}

export function getDefaultBookingDateRange(reference: Date = new Date()) {
  const checkIn = getEarliestBookableCheckInDate(reference);

  return {
    checkIn,
    checkOut: addHotelDateDays(checkIn, 1),
  };
}

export function resolveBookableDateRange({
  checkIn,
  checkOut,
  reference = new Date(),
}: {
  checkIn?: string | null;
  checkOut?: string | null;
  reference?: Date;
}) {
  const defaultRange = getDefaultBookingDateRange(reference);
  const earliestCheckIn = getEarliestBookableCheckInDate(reference);
  const selectedCheckIn =
    isHotelDateInput(checkIn) && checkIn! >= earliestCheckIn
      ? checkIn!
      : defaultRange.checkIn;
  const selectedCheckOut =
    isHotelDateInput(checkOut) && checkOut! > selectedCheckIn
      ? checkOut!
      : addHotelDateDays(selectedCheckIn, 1);

  return {
    checkIn: selectedCheckIn,
    checkOut: selectedCheckOut,
    minCheckIn: earliestCheckIn,
  };
}

export function assertBookableCheckInDateInput(
  value: string,
  reference: Date = new Date()
) {
  parseHotelDateInput(value);

  if (value < getEarliestBookableCheckInDate(reference)) {
    throw new Error("Check-in date is no longer bookable.");
  }
}

export function getLatestReleasableCheckOutDate(reference: Date = new Date()) {
  const today = getBerlinTodayDateInput(reference);
  const parts = getBerlinDateParts(reference);
  const currentSeconds =
    parts.hour * 60 * 60 + parts.minute * 60 + parts.second;

  return currentSeconds >= CHECK_OUT_RELEASE_SECONDS
    ? today
    : addHotelDateDays(today, -1);
}

export function formatHotelDate(date: Date, locale: BookingLocale) {
  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-GB" : "de-DE";

  return new Intl.DateTimeFormat(intlLocale, {
    timeZone: BERLIN_TIME_ZONE,
    dateStyle: "medium",
  }).format(date);
}
