"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function CulinarySection() {
  const locale = useLocale();
  const t = useTranslations("culinary");
  const bookingHref = `/${locale}/hotel/buchen`;

  const hours = [
    { label: t("daily"), time: t("dailyTime") },
    { label: t("kitchen"), time: t("kitchenTime") },
    { label: t("breakfastWeek"), time: t("breakfastWeekTime") },
    { label: t("breakfastWeekend"), time: t("breakfastWeekendTime") },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="restaurant">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
        <Reveal>
          <div className="culinary-mosaic grid grid-cols-2 gap-3 sm:gap-4">
            <div className="culinary-card group col-span-2 aspect-[16/10]">
              <div className="culinary-card-surface">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                  alt="Regionale Spezialitäten"
                  fill
                  className="object-cover brightness-[0.9] transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="culinary-card-overlay" />
              </div>
            </div>
            <div className="culinary-card group aspect-square">
              <div className="culinary-card-surface">
                <Image
                  src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80"
                  alt="Dessert"
                  fill
                  className="object-cover brightness-[0.94] transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="25vw"
                />
                <div className="culinary-card-overlay" />
              </div>
            </div>
            <div className="culinary-card group aspect-square">
              <div className="culinary-card-surface">
                <Image
                  src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80"
                  alt="Wein aus Saale-Unstrut"
                  fill
                  className="object-cover brightness-[0.94] transition-transform duration-700 group-hover:scale-[1.05]"
                  sizes="25vw"
                />
                <div className="culinary-card-overlay" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <span className="label-caps text-gold">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
            {t("title")} <br /><em>{t("titleEmphasis")}</em>
          </h2>
          <div className="gold-divider mb-8" />
          <p className="body-text max-w-[620px]">{t("text1")}</p>
          <p className="body-text max-w-[620px] mt-4">{t("text2")}</p>

          <div className="culinary-hours-card mt-8 p-5 sm:p-8">
            <h3 className="mb-4 font-[var(--font-display)] text-[1.26rem] font-medium text-charcoal">
              {t("hours")}
            </h3>
            {hours.map((row, i) => (
              <div
                key={i}
                className="culinary-hours-row flex justify-between py-2.5 text-sm font-light"
              >
                <span className="text-charcoal/78">{row.label}</span>
                <span className="font-medium text-charcoal/86">{row.time}</span>
              </div>
            ))}
          </div>

          <a href={bookingHref} className="btn-dark mt-8 inline-flex">
            {t("ctaTable")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
