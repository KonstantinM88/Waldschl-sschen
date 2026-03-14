"use client";

import { useTranslations } from "next-intl";
import { Heart, Users, Monitor, Globe } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const eventCards = [
  { key: "weddings", Icon: Heart },
  { key: "family", Icon: Users },
  { key: "meetings", Icon: Monitor },
  { key: "arrangements", Icon: Globe },
] as const;

export default function EventsSection() {
  const t = useTranslations("events");

  return (
    <section
      className="events-section py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] text-white relative overflow-hidden"
      id="events"
    >
      <div className="events-orb events-orb-right" />
      <div className="events-orb events-orb-left" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <Reveal>
          <div className="text-center">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
              {t("title")} <br /><em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mx-auto mb-8" />
            <p className="body-text mx-auto max-w-[620px] text-white/70">{t("text")}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-2 lg:gap-6">
          {eventCards.map((card, i) => (
            <Reveal key={card.key} delay={i * 0.1}>
              <div className="events-card group relative">
                <div className="events-card-surface">
                  <div className="events-card-glow" />

                  <span className="events-card-icon">
                    <card.Icon className="h-4 w-4 stroke-[1.8]" />
                  </span>

                  <h3 className="events-card-title">{t(`${card.key}.title`)}</h3>
                  <p className="events-card-desc">{t(`${card.key}.desc`)}</p>

                  <a href="#kontakt" className="events-card-link">
                    {t("more")} →
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
