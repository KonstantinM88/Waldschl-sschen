import Link from "next/link";
import type { BookingLocale } from "@/lib/booking-engine";
import {
  buildBookingHref,
  type BookingFlowState,
  type BookingRouteLocale,
} from "@/lib/booking-navigation";

interface BookingLanguageSwitcherProps {
  currentLocale: BookingLocale;
  label: string;
  pathSuffix: string;
  routeLocale: BookingRouteLocale;
  state: BookingFlowState;
}

export default function BookingLanguageSwitcher({
  currentLocale,
  label,
  pathSuffix,
  routeLocale,
  state,
}: BookingLanguageSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 border-b border-[#eadfcf] pb-5">
      <span className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#9c7b4b]">
        {label}
      </span>
      <div className="inline-flex rounded-full border border-[#e4d7c5] bg-white/82 p-1 shadow-[0_12px_30px_rgba(32,24,16,0.06)]">
        {(["de", "en", "ru"] as const).map((languageOption) => {
          const isActive = currentLocale === languageOption;

          return (
            <Link
              key={languageOption}
              href={buildBookingHref({
                pathSuffix,
                routeLocale,
                targetLocale: languageOption,
                state,
              })}
              className={[
                "inline-flex min-w-[3.35rem] items-center justify-center rounded-full px-3 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-all duration-300",
                isActive
                  ? "bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] text-white shadow-[0_12px_24px_rgba(128,92,39,0.18)]"
                  : "text-[#6c6459] hover:bg-[#f7f1e8] hover:text-[#201b17]",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {languageOption.toUpperCase()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
