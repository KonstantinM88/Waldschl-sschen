"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Check,
  Coffee,
  Images,
  Users,
} from "lucide-react";
import type { AvailableRoom, BookingLocale } from "@/lib/booking-shared";

interface RoomCardProps {
  className?: string;
  ctaHref?: string;
  locale?: BookingLocale;
  room: AvailableRoom;
}

const copy = {
  de: {
    available: (count: number) => `${count} verfügbar`,
    lastRooms: (count: number) =>
      count === 1 ? "Nur noch 1 Zimmer frei" : `Nur noch ${count} Zimmer frei`,
    breakfast: "Frühstück vorausgewählt",
    cta: "Zimmer wählen",
    from: "ab",
    guests: (count: number) => `bis ${count} Gast${count === 1 ? "" : "e"}`,
    night: "/ Nacht",
    amenitiesTitle: "Ausstattung",
    totalFor: (nights: number) => `Gesamt für ${nights} Nacht${nights === 1 ? "" : "e"}`,
    photos: (count: number) => `${count} Fotos`,
  },
  en: {
    available: (count: number) => `${count} available`,
    lastRooms: (count: number) =>
      count === 1 ? "Only 1 room left" : `Only ${count} rooms left`,
    breakfast: "Breakfast preselected",
    cta: "Select room",
    from: "from",
    guests: (count: number) => `up to ${count} guest${count === 1 ? "" : "s"}`,
    night: "/ night",
    amenitiesTitle: "Amenities",
    totalFor: (nights: number) => `Total for ${nights} night${nights === 1 ? "" : "s"}`,
    photos: (count: number) => `${count} photos`,
  },
  ru: {
    available: (count: number) => `${count} доступно`,
    lastRooms: (count: number) =>
      count === 1 ? "Остался 1 номер" : `Осталось ${count} номера`,
    breakfast: "Завтрак выбран",
    cta: "Выбрать номер",
    from: "от",
    guests: (count: number) => `до ${count} гост.`,
    night: "/ ночь",
    amenitiesTitle: "Удобства",
    totalFor: (nights: number) => `Итого за ${nights} ноч.`,
    photos: (count: number) => `${count} фото`,
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

const LOW_AVAILABILITY_THRESHOLD = 3;

export default function RoomCard({
  room,
  locale = "de",
  ctaHref,
  className,
}: RoomCardProps) {
  const t = copy[locale === "en" || locale === "ru" ? locale : "de"];

  // Build the image set: main image first, then any gallery entries (deduped).
  const images = [room.imageUrl, ...room.gallery].filter(
    (value, index, all): value is string =>
      Boolean(value) && all.indexOf(value) === index
  );
  const fallback = "/Hotel/room_1600.webp";
  const allImages = images.length ? images : [fallback];

  const [activeImage, setActiveImage] = useState(0);
  const amenities = room.amenities.slice(0, 6);
  const isExternalCta = Boolean(ctaHref && /^(mailto:|tel:|https?:)/i.test(ctaHref));
  const lowAvailability =
    room.availableCount > 0 && room.availableCount <= LOW_AVAILABILITY_THRESHOLD;
  const totalForStay = room.basePrice * room.nights;

  const ctaClass =
    "mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]";

  return (
    <article
      className={[
        "overflow-hidden rounded-[2rem] border border-[#e2d7c8] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(248,243,236,0.94))] shadow-[0_28px_70px_rgba(28,21,16,0.08)]",
        className ?? "",
      ].join(" ")}
    >
      <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[16/11]">
        <Image
          key={allImages[activeImage]}
          src={allImages[activeImage]}
          alt={room.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,12,10,0.08)_0%,rgba(15,12,10,0.1)_34%,rgba(15,12,10,0.62)_100%)]" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/12 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            <Coffee className="h-3.5 w-3.5 stroke-[1.85] text-[#f1dfba]" />
            {t.breakfast}
          </span>
          {allImages.length > 1 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/22 px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-white/86 backdrop-blur-sm">
              <Images className="h-3.5 w-3.5 stroke-[1.85]" />
              {t.photos(allImages.length)}
            </span>
          ) : null}
        </div>

        <div className="absolute right-4 top-4">
          <span
            className={[
              "rounded-full border px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm",
              lowAvailability
                ? "border-[#e7b6a3] bg-[#b4543a]/85 text-white"
                : "border-white/12 bg-black/22 text-white/86",
            ].join(" ")}
          >
            {lowAvailability ? t.lastRooms(room.availableCount) : t.available(room.availableCount)}
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

      {allImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto px-4 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {allImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(index)}
              className={[
                "relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition-all duration-200",
                index === activeImage
                  ? "border-[#bf9556] ring-2 ring-[rgba(191,149,86,0.3)]"
                  : "border-[#e8ddcf] opacity-70 hover:opacity-100",
              ].join(" ")}
              aria-label={`${room.title} ${index + 1}`}
            >
              <Image src={image} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

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

          <div className="rounded-2xl border border-[#eadfcf] bg-[#faf7f1] px-4 py-2.5 text-right">
            <div className="text-[0.56rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
              {t.totalFor(room.nights)}
            </div>
            <div className="mt-1 text-lg font-semibold text-[#201b17]">
              {formatCurrency(totalForStay, locale)}
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm font-light leading-relaxed text-[#4f483f]">
          {room.shortDescription ?? room.description}
        </p>

        {amenities.length ? (
          <>
            <div className="mt-6 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[#9c7b4b]">
              {t.amenitiesTitle}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-2 text-sm font-light text-[#5a5349]"
                >
                  <Check className="h-4 w-4 shrink-0 stroke-[2.2] text-[#b4884c]" />
                  {amenity}
                </span>
              ))}
            </div>
          </>
        ) : null}

        {ctaHref ? (
          isExternalCta ? (
            <a href={ctaHref} className={ctaClass}>
              {t.cta}
            </a>
          ) : (
            <Link href={ctaHref} className={ctaClass}>
              {t.cta}
            </Link>
          )
        ) : null}
      </div>
    </article>
  );
}
