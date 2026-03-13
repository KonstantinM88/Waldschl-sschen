"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const cards = [
  {
    key: "hotel",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
  },
  {
    key: "restaurant",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
          {cards.map((card, i) => (
            <Reveal key={card.key} delay={i * 0.1}>
              <div className="group relative aspect-[3/4] overflow-hidden cursor-pointer">
                <Image
                  src={card.image}
                  alt={t(`${card.key}.title`)}
                  fill
                  className="object-cover brightness-[0.7] group-hover:brightness-50 group-hover:scale-[1.08] transition-all duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-10 z-10 group-hover:-translate-y-2.5 transition-transform duration-500">
                  <span className="text-[0.65rem] font-medium tracking-[0.25em] uppercase text-gold-light mb-3 block">
                    {t(`${card.key}.label`)}
                  </span>
                  <h3 className="font-[var(--font-display)] text-[1.8rem] font-normal leading-tight mb-3">
                    {t(`${card.key}.title`)}
                  </h3>
                  <p className="text-sm font-light leading-relaxed opacity-0 translate-y-2.5 group-hover:opacity-80 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {t(`${card.key}.desc`)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.15em] uppercase text-gold-light mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    {t("discover")} →
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
