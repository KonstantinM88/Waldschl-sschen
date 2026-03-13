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
      className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-forest text-white relative overflow-hidden"
      id="events"
    >
      <div className="absolute -top-1/2 -right-[30%] w-[600px] h-[600px] rounded-full border border-gold/10" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <Reveal>
          <div className="text-center">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
              {t("title")} <br /><em>{t("titleEmphasis")}</em>
            </h2>
            <p className="body-text mx-auto max-w-[620px] text-white/70">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          {eventCards.map((card, i) => (
            <Reveal key={card.key} delay={i * 0.1}>
              <div className="group p-10 border border-white/10 hover:border-gold/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <card.Icon className="w-8 h-8 text-gold-light stroke-[1.5] mb-6 relative z-10" />
                <h3 className="font-[var(--font-display)] text-2xl font-normal mb-4 relative z-10">
                  {t(`${card.key}.title`)}
                </h3>
                <p className="text-[0.95rem] font-light leading-relaxed opacity-75 relative z-10">
                  {t(`${card.key}.desc`)}
                </p>
                <a
                  href="#kontakt"
                  className="inline-flex items-center gap-2 mt-6 text-xs font-medium tracking-[0.12em] uppercase text-gold-light group-hover:gap-3.5 transition-all relative z-10"
                >
                  {t("more")} →
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
