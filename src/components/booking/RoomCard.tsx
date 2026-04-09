import Link from "next/link";
import { BedDouble, Coffee, ShieldCheck, Users } from "lucide-react";
import type { AvailableRoom, BookingLocale } from "@/lib/booking-engine";

interface RoomCardProps {
  className?: string;
  ctaHref?: string;
  locale?: BookingLocale;
  room: AvailableRoom;
}

const copy = {
  de: {
    available: (count: number) => `${count} verfugbar`,
    breakfast: "Frühstück inklusive",
    cta: "Zimmer wählen",
    from: "ab",
    guests: (count: number) => `bis ${count} Gast${count === 1 ? "" : "e"}`,
    night: "/ Nacht",
  },
  en: {
    available: (count: number) => `${count} available`,
    breakfast: "Breakfast included",
    cta: "Select room",
    from: "from",
    guests: (count: number) => `up to ${count} guest${count === 1 ? "" : "s"}`,
    night: "/ night",
  },
  ru: {
    available: (count: number) => `${count} доступно`,
    breakfast: "Завтрак включён",
    cta: "Выбрать номер",
    from: "от",
    guests: (count: number) => `до ${count} гост.`,
    night: "/ ночь",
  },
} as const;

function formatCurrency(value: number, locale: BookingLocale) {
  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-GB" : "de-DE";

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RoomCard({
  room,
  locale = "de",
  ctaHref,
  className,
}: RoomCardProps) {
  const t = copy[locale === "en" || locale === "ru" ? locale : "de"];
  const amenities = room.amenities.slice(0, 4);
  const isExternalCta = Boolean(ctaHref && /^(mailto:|tel:|https?:)/i.test(ctaHref));

  return (
    <article
      className={[
        "overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(248,243,236,0.94))] shadow-[0_28px_70px_rgba(28,21,16,0.08)]",
        className ?? "",
      ].join(" ")}
    >
      <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[16/11]">
        <img
          src={room.imageUrl ?? "/Hotel/room_1600.webp"}
          alt={room.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.08)_0%,rgba(15,12,10,0.1)_34%,rgba(15,12,10,0.6)_100%)]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/12 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 stroke-[1.85] text-[#f1dfba]" />
            {t.breakfast}
          </span>
          <span className="rounded-full border border-white/12 bg-black/18 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-white/86 backdrop-blur-sm">
            {t.available(room.availableCount)}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="font-[var(--font-display)] text-[2rem] leading-[0.95] text-white sm:text-[2.25rem]">
            {room.title}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.72rem] uppercase tracking-[0.14em] text-white/72">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 stroke-[1.8]" />
              {t.guests(room.maxGuests)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5 stroke-[1.8]" />
              {room.type}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
              {t.from}
            </div>
            <div className="mt-1 font-[var(--font-display)] text-[2.35rem] leading-none text-[#201b17]">
              {formatCurrency(room.basePrice, locale)}
              <span className="ml-2 text-base text-[#6c6459]">{t.night}</span>
            </div>
          </div>

          <div className="rounded-full border border-[#eadfcf] bg-[#faf7f1] px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#6c6459]">
            {room.nights} x {formatCurrency(room.basePrice, locale)}
          </div>
        </div>

        <p className="mt-5 text-sm font-light leading-relaxed text-[#4f483f]">
          {room.shortDescription ?? room.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {amenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-2 rounded-full border border-[#e8ddcf] bg-white px-3 py-2 text-[0.68rem] font-medium text-[#5a5349]"
            >
              <Coffee className="h-3.5 w-3.5 stroke-[1.8] text-[#b4884c]" />
              {amenity}
            </span>
          ))}
        </div>

        {ctaHref ? (
          isExternalCta ? (
            <a
              href={ctaHref}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]"
            >
              {t.cta}
            </a>
          ) : (
            <Link
              href={ctaHref}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]"
            >
              {t.cta}
            </Link>
          )
        ) : null}
      </div>
    </article>
  );
}
