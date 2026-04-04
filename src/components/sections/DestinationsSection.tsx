"use client";

import { useTranslations, useLocale } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import PremiumWaveFrame from "@/components/ui/PremiumWaveFrame";
import { destinations } from "@/data/site";
import type { Locale } from "@/lib/i18n/config";

const destinationMedia = {
  default: {
    src: "/landscape_restaurant_1920w.webp",
    srcSet:
      "/landscape_restaurant_800w.webp 800w, /landscape_restaurant_1200w.webp 1200w, /landscape_restaurant_1600w.webp 1600w, /landscape_restaurant_1920w.webp 1920w",
    position: "object-center",
  },
  "arche-nebra": {
    src: "/model_1600.webp",
    srcSet:
      "/model_1200.webp 1200w, /model_1600.webp 1600w",
    position: "object-[center_50%] sm:object-center",
  },
  weinberge: {
    src: "/vineyard_1600.webp",
    srcSet:
      "/vineyard_1200.webp 1200w, /vineyard_1600.webp 1600w",
    position: "object-[center_52%] sm:object-center",
  },
  unstrutradweg: {
    src: "/river_village_1600.webp",
    srcSet:
      "/river_village_1200.webp 1200w, /river_village_1600.webp 1600w",
    position: "object-[center_54%] sm:object-center",
  },
  rotkaeppchen: {
    src: "/wine_cellar_alt_1600.webp",
    srcSet:
      "/wine_cellar_alt_1200.webp 1200w, /wine_cellar_alt_1600.webp 1600w",
    position: "object-[center_52%] sm:object-center",
  },
  memleben: {
    src: "/abbey_ruins_1600.webp",
    srcSet:
      "/abbey_ruins_1200.webp 1200w, /abbey_ruins_1600.webp 1600w",
    position: "object-[center_52%] sm:object-center",
  },
  mittelberg: {
    src: "/tower_1600.webp",
    srcSet:
      "/tower_1200.webp 1200w, /tower_1600.webp 1600w",
    position: "object-[center_52%] sm:object-center",
  },
} as const;

type DestinationCardProps = {
  id: string;
  title: string;
  label: string;
  description: string;
  delay: number;
};

function DestinationCard({
  id,
  title,
  label,
  description,
  delay,
}: DestinationCardProps) {
  const preferredMedia = destinationMedia[id as keyof typeof destinationMedia];
  const fallbackMedia = destinationMedia.default;
  const activeMedia = preferredMedia ?? fallbackMedia;
  const src = activeMedia.src;
  const srcSet = activeMedia?.srcSet;
  const positionClass = activeMedia?.position ?? fallbackMedia.position;

  return (
    <Reveal delay={delay} className="h-full">
      <article className="destination-card group h-full cursor-pointer">
        <div className="destination-card-surface">
          <PremiumWaveFrame
            src={src}
            alt={title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            outerClassName="destination-card-media"
            surfaceClassName="relative h-full"
            imageClassName={`object-cover brightness-[0.9] transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.8] ${positionClass}`}
            beforeSheen={<div className="destination-card-overlay" />}
          />

          <div className="destination-card-content">
            <span className="destination-card-distance">{label}</span>
            <h3 className="destination-card-title">{title}</h3>
            <p className="destination-card-description">{description}</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function DestinationsSection() {
  const t = useTranslations("destinations");
  const locale = useLocale() as Locale;

  return (
    <section
      className="destinations-section py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] relative overflow-hidden"
      id="ausflugsziele"
    >
      <div className="destinations-orb destinations-orb-left" />
      <div className="destinations-orb destinations-orb-right" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mx-auto mb-8" />
            <p className="body-text mx-auto max-w-[620px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {destinations.map((dest, i) => (
            <DestinationCard
              key={dest.id}
              id={dest.id}
              title={dest.name[locale]}
              label={dest.distance[locale]}
              description={dest.description[locale]}
              delay={(i % 3) * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
