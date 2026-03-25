"use client";

import { useTranslations } from "next-intl";
import { usePathname as useNextPathname } from "next/navigation";
import NextLink from "next/link";
import Reveal from "@/components/ui/Reveal";

const cards = [
  {
    key: "hotel",
    image: "/hotel_room_1920w.webp",
    srcSet: "/hotel_room_800w.webp 800w, /hotel_room_1200w.webp 1200w, /hotel_room_1600w.webp 1600w, /hotel_room_1920w.webp 1920w",
    responsiveSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
    imagePosition: "object-[center_52%] sm:object-center",
    pageLink: "/hotel",
  },
  {
    key: "restaurant",
    image: "/restaurant_room_1920w.webp",
    srcSet: "/restaurant_room_800w.webp 800w, /restaurant_room_1200w.webp 1200w, /restaurant_room_1600w.webp 1600w, /restaurant_room_1920w.webp 1920w",
    responsiveSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
    imagePosition: "object-[center_52%] sm:object-center",
  },
  {
    key: "weddings",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
  },
  {
    key: "family",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  },
] as const;

export default function DirectionsSection() {
  const t = useTranslations("directions");
  const pathname = useNextPathname();
  const activeLocale = pathname.startsWith("/en") ? "en" : "de";

  return (
    <section
      className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-charcoal text-white"
      id="hotel"
    >
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-4">
          {cards.map((card, i) => {
            const cardContent = (
              <div className="directions-card-surface">
                <div className="directions-card-glow" />
                <img
                  src={card.image}
                  srcSet={"srcSet" in card ? card.srcSet : undefined}
                  sizes={
                    "srcSet" in card
                      ? card.responsiveSizes
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  }
                  alt={t(`${card.key}.title`)}
                  loading="lazy"
                  className={`h-full w-full object-cover ${
                    "imagePosition" in card ? card.imagePosition : "object-center"
                  } brightness-[0.72] transition-all duration-700 group-hover:brightness-[0.58] group-hover:scale-[1.08]`}
                />
                <div className="directions-card-overlay" />

                <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-8 lg:p-9 group-hover:-translate-y-2 transition-transform duration-500">
                  <span className="mb-3 block text-[0.64rem] font-medium tracking-[0.24em] uppercase text-gold-light">
                    {t(`${card.key}.label`)}
                  </span>
                  <h3 className="mb-3 font-[var(--font-display)] text-[1.95rem] font-normal leading-tight sm:text-[2rem]">
                    {t(`${card.key}.title`)}
                  </h3>
                  <p className="text-sm font-light leading-relaxed opacity-0 translate-y-2.5 group-hover:opacity-80 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {t(`${card.key}.desc`)}
                  </p>
                  <span className="inline-flex items-center gap-2 mt-4 text-[0.7rem] tracking-[0.15em] uppercase text-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {t("discover")} →
                  </span>
                </div>
              </div>
            );

            return (
              <Reveal key={card.key} delay={i * 0.1}>
                {"pageLink" in card ? (
                  <NextLink
                    href={`/${activeLocale}${card.pageLink}`}
                    className="directions-card group relative aspect-[3/4] cursor-pointer block"
                  >
                    {cardContent}
                  </NextLink>
                ) : (
                  <div className="directions-card group relative aspect-[3/4] cursor-pointer">
                    {cardContent}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
