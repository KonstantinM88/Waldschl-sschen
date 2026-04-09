import type { BookingLocale } from "@/lib/booking-shared";

export type BookingRouteLocale = Extract<BookingLocale, "de" | "en">;

export interface BookingFlowState {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId?: string;
}

export function toBookingRouteLocale(locale: string): BookingRouteLocale {
  return locale === "en" ? "en" : "de";
}

export function toBookingDisplayLocale(
  routeLocale: BookingRouteLocale,
  lang?: string
): BookingLocale {
  return lang === "en" || lang === "ru" || lang === "de" ? lang : routeLocale;
}

export function buildBookingHref(options: {
  pathSuffix: string;
  routeLocale: BookingRouteLocale;
  targetLocale: BookingLocale;
  state: BookingFlowState;
}) {
  const { pathSuffix, routeLocale, targetLocale, state } = options;
  const nextRouteLocale = targetLocale === "en" ? "en" : "de";
  const search = new URLSearchParams({
    checkIn: state.checkIn,
    checkOut: state.checkOut,
    guests: String(state.guests),
  });

  if (state.roomId) {
    search.set("room", state.roomId);
  }

  if (targetLocale === "ru") {
    search.set("lang", "ru");
    return `/${routeLocale}${pathSuffix}?${search.toString()}`;
  }

  return `/${nextRouteLocale}${pathSuffix}?${search.toString()}`;
}
