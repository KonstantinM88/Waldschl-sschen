"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import PremiumWaveFrame from "@/components/ui/PremiumWaveFrame";

const spaces = [
  {
    key: "foyer",
    image: "/Foyer_1920w.webp",
    responsiveSizes: "(max-width: 768px) 100vw, (max-width: 1280px) 58vw, 50vw",
    imagePosition: "object-[center_46%] sm:object-center",
    colSpan: "col-span-12 lg:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    key: "lobby",
    image: "/library_room_1920w.webp",
    responsiveSizes: "(max-width: 768px) 100vw, (max-width: 1280px) 42vw, 50vw",
    imagePosition: "object-[center_50%] sm:object-center",
    colSpan: "col-span-12 lg:col-span-5",
    aspect: "aspect-[4/3] lg:aspect-auto lg:h-full",
  },
  {
    key: "schachtstube",
    image: "/Schachtstube_mural_1920w.webp",
    responsiveSizes: "(max-width: 768px) 50vw, (max-width: 1280px) 34vw, 33vw",
    imagePosition: "object-center",
    colSpan: "col-span-6 lg:col-span-4",
    aspect: "aspect-square",
  },
  {
    key: "sommergarten",
    image: "/restaurant_terrace_1920w.webp",
    responsiveSizes: "(max-width: 768px) 50vw, (max-width: 1280px) 34vw, 33vw",
    imagePosition: "object-[center_52%] sm:object-center",
    colSpan: "col-span-6 lg:col-span-4",
    aspect: "aspect-square",
  },
  {
    key: "bergmannszimmer",
    image: "/restaurant_private_room_1920w.webp",
    responsiveSizes: "(max-width: 768px) 100vw, (max-width: 1280px) 34vw, 33vw",
    imagePosition: "object-[center_52%] sm:object-center",
    colSpan: "col-span-12 lg:col-span-4",
    aspect: "aspect-square lg:aspect-square",
  },
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
            <div className="gold-divider mx-auto mb-7" />
            <p className="body-text mx-auto max-w-[620px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {spaces.map((space, i) => (
            <Reveal key={space.key} delay={i * 0.1} className={space.colSpan}>
              <PremiumWaveFrame
                src={space.image}
                alt={t(`${space.key}.name`)}
                sizes={space.responsiveSizes}
                outerClassName={`spaces-card relative cursor-pointer ${space.aspect}`}
                surfaceClassName="spaces-card-surface"
                imageClassName={`object-cover ${space.imagePosition} brightness-[0.82] transition-all duration-700 group-hover:brightness-[0.68] group-hover:scale-[1.06]`}
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-5 sm:p-7">
                    <div>
                      <span className="mb-2 block font-[var(--font-body)] text-[0.68rem] font-light uppercase tracking-[0.16em] text-white/76">
                        {t(`${space.key}.label`)}
                      </span>
                      <span className="font-[var(--font-display)] text-[1.7rem] font-normal leading-tight text-white sm:text-[1.88rem]">
                        {t(`${space.key}.name`)}
                      </span>
                    </div>
                  </div>
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
