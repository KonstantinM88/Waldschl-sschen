"use client";

import { useTranslations } from "next-intl";
import { usePathname as useNextPathname } from "next/navigation";
import NextLink from "next/link";
import Reveal from "@/components/ui/Reveal";
import PremiumWaveFrame from "@/components/ui/PremiumWaveFrame";

const cards = [
  {
    key: "hotel",
    image: "/hotel_room_1920w.webp",
    responsiveSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
    imagePosition: "object-[center_52%] sm:object-center",
    pageLink: "/hotel",
  },
  {
    key: "restaurant",
    image: "/restaurant_room_1920w.webp",
    responsiveSizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
    imagePosition: "object-[center_52%] sm:object-center",
    pageLink: "/restaurant",
  },
  {
    key: "weddings",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    pageLink: "/events",
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
              <PremiumWaveFrame
                src={card.image}
                alt={t(`${card.key}.title`)}
                sizes={
                  "responsiveSizes" in card
                    ? card.responsiveSizes
                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                }
                outerClassName="h-full"
                surfaceClassName="directions-card-surface h-full"
                imageClassName={`object-cover ${
                  "imagePosition" in card ? card.imagePosition : "object-center"
                } brightness-[0.72] transition-all duration-700 group-hover:brightness-[0.58] group-hover:scale-[1.08]`}
                beforeSheen={<div className="directions-card-glow" />}
                afterSheen={
                  <>
                    <div className="directions-card-overlay" />
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-6 transition-transform duration-500 group-hover:-translate-y-2 sm:p-8 lg:p-9">
                      <span className="mb-3 block text-[0.64rem] font-medium uppercase tracking-[0.24em] text-gold-light">
                        {t(`${card.key}.label`)}
                      </span>
                      <h3 className="mb-3 font-[var(--font-display)] text-[1.95rem] font-normal leading-tight sm:text-[2rem]">
                        {t(`${card.key}.title`)}
                      </h3>
                      <p className="translate-y-2.5 text-sm font-light leading-relaxed opacity-0 transition-all delay-100 duration-500 group-hover:translate-y-0 group-hover:opacity-80">
                        {t(`${card.key}.desc`)}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.15em] text-gold-light opacity-0 transition-opacity delay-200 duration-500 group-hover:opacity-100">
                        {t("discover")} →
                      </span>
                    </div>
                  </>
                }
              />
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
