"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function CulinarySection() {
  const t = useTranslations("culinary");

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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 aspect-[16/10] relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                alt="Regionale Spezialitäten"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="aspect-square relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80"
                alt="Dessert"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="25vw"
              />
            </div>
            <div className="aspect-square relative overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80"
                alt="Wein aus Saale-Unstrut"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="25vw"
              />
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

          <div className="mt-8 p-8 bg-sand-light">
            <h4 className="font-[var(--font-display)] text-lg font-medium mb-4">{t("hours")}</h4>
            {hours.map((row, i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b border-sand last:border-b-0 text-sm font-light"
              >
                <span>{row.label}</span>
                <span>{row.time}</span>
              </div>
            ))}
          </div>

          <a href="#buchen" className="btn-dark mt-8 inline-flex">
            {t("ctaTable")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
