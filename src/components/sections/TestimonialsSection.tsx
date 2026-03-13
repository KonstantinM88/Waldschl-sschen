"use client";

import { useTranslations, useLocale } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import { testimonials } from "@/data/site";
import type { Locale } from "@/lib/i18n/config";

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const locale = useLocale() as Locale;

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light">
      <div className="max-w-[1200px] mx-auto text-center">
        <Reveal>
          <span className="label-caps text-gold">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {testimonials.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1}>
              <div className="p-10 bg-white text-left hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="text-gold text-sm tracking-[3px] mb-6">★★★★★</div>
                <p className="font-[var(--font-display)] text-lg font-normal italic leading-relaxed text-text-primary mb-6">
                  „{item.text[locale]}"
                </p>
                <div className="text-xs font-medium text-text-secondary">{item.author[locale]}</div>
                <div className="text-[0.7rem] font-light text-text-muted mt-1">{item.source}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
