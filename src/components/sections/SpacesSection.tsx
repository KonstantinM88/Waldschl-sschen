"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

const spaces = [
  { key: "foyer", image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80", colSpan: "col-span-12 lg:col-span-7", aspect: "aspect-[16/10]" },
  { key: "lobby", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80", colSpan: "col-span-12 lg:col-span-5", aspect: "aspect-[4/3]" },
  { key: "schachtstube", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80", colSpan: "col-span-6 lg:col-span-4", aspect: "aspect-square" },
  { key: "sommergarten", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", colSpan: "col-span-6 lg:col-span-4", aspect: "aspect-square" },
  { key: "bergmannszimmer", image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=500&q=80", colSpan: "col-span-12 lg:col-span-4", aspect: "aspect-square lg:aspect-square" },
] as const;

export default function SpacesSection() {
  const t = useTranslations("spaces");

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="body-text mx-auto max-w-[620px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-12 gap-4">
          {spaces.map((space, i) => (
            <Reveal key={space.key} delay={i * 0.1} className={space.colSpan}>
              <div className={`group relative overflow-hidden cursor-pointer ${space.aspect}`}>
                <Image
                  src={space.image}
                  alt={t(`${space.key}.name`)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent group-hover:from-charcoal/80 transition-all duration-500 flex items-end p-8">
                  <div>
                    <span className="block font-[var(--font-body)] text-[0.7rem] font-light tracking-[0.15em] uppercase text-white/70 mb-2">
                      {t(`${space.key}.label`)}
                    </span>
                    <span className="font-[var(--font-display)] text-2xl font-normal text-white">
                      {t(`${space.key}.name`)}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
