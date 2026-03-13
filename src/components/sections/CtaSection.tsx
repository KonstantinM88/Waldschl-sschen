"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

export default function CtaSection() {
  const t = useTranslations("cta");

  return (
    <section className="relative py-[clamp(6rem,12vw,10rem)] px-[clamp(1.5rem,5vw,6rem)] text-center text-white overflow-hidden" id="buchen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(44,62,45,0.85), rgba(44,62,45,0.9)),
            url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80')
          `,
        }}
      />
      <Reveal>
        <div className="relative z-10 max-w-[700px] mx-auto">
          <span className="label-caps text-gold-light">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <p className="text-lg font-light leading-relaxed opacity-85 mb-12">{t("text")}</p>
          <div className="flex gap-5 justify-center flex-wrap">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary">{t("phone")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light">{t("email")}</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
