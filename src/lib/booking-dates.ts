import type { BookingLocale } from "@/lib/booking-shared";

export const BERLIN_TIME_ZONE = "Europe/Berlin";

const HOTEL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

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

export function formatHotelDate(date: Date, locale: BookingLocale) {
  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-GB" : "de-DE";

  return new Intl.DateTimeFormat(intlLocale, {
    timeZone: BERLIN_TIME_ZONE,
    dateStyle: "medium",
  }).format(date);
}
