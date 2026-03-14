"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import { destinations } from "@/data/site";
import type { Locale } from "@/lib/i18n/config";

const destinationFallbacks = {
  default: {
    src: "/landscape_restaurant_1920w.webp",
    srcSet:
      "/landscape_restaurant_800w.webp 800w, /landscape_restaurant_1200w.webp 1200w, /landscape_restaurant_1600w.webp 1600w, /landscape_restaurant_1920w.webp 1920w",
    position: "object-center",
  },
  "arche-nebra": {
    src: "/Foyer_1920w.webp",
    srcSet:
      "/Foyer_800w%20.webp 800w, /Foyer_1200w%20.webp 1200w, /Foyer_1600w%20.webp 1600w, /Foyer_1920w.webp 1920w",
    position: "object-[center_50%] sm:object-center",
  },
  weinberge: {
    src: "/landscape_restaurant_1920w.webp",
    srcSet:
      "/landscape_restaurant_800w.webp 800w, /landscape_restaurant_1200w.webp 1200w, /landscape_restaurant_1600w.webp 1600w, /landscape_restaurant_1920w.webp 1920w",
    position: "object-[center_52%] sm:object-center",
  },
  unstrutradweg: {
    src: "/restaurant_terrace_1920w.webp",
    srcSet:
      "/restaurant_terrace_800w.webp 800w, /restaurant_terrace_1200w.webp 1200w, /restaurant_terrace_1600w.webp 1600w, /restaurant_terrace_1920w.webp 1920w",
    position: "object-[center_54%] sm:object-center",
  },
} as const;

type DestinationCardProps = {
  id: string;
  image: string;
  title: string;
  label: string;
  description: string;
  delay: number;
};

function DestinationCard({
  id,
  image,
  title,
  label,
  description,
  delay,
}: DestinationCardProps) {
  const [useFallback, setUseFallback] = useState(false);
  const fallback = destinationFallbacks[id as keyof typeof destinationFallbacks] ?? destinationFallbacks.default;
  const src = useFallback ? fallback.src : image;
  const srcSet = useFallback ? fallback.srcSet : undefined;

  return (
    <Reveal delay={delay} className="h-full">
      <article className="destination-card group h-full cursor-pointer">
        <div className="destination-card-surface">
          <div className="destination-card-media">
            <img
              src={src}
              srcSet={srcSet}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={title}
              loading="lazy"
              onError={() => {
                if (!useFallback) {
                  setUseFallback(true);
                }
              }}
              className={`h-full w-full object-cover brightness-[0.9] transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.8] ${fallback.position}`}
            />
            <div className="destination-card-overlay" />
          </div>

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
              image={dest.image}
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
