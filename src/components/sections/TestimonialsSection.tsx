"use client";

import { useTranslations, useLocale } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import { testimonials } from "@/data/site";
import type { Locale } from "@/lib/i18n/config";

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");
  const locale = useLocale() as Locale;

  return (
    <section className="testimonials-section py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] relative overflow-hidden">
      <div className="testimonials-orb testimonials-orb-left" />
      <div className="testimonials-orb testimonials-orb-right" />

      <div className="max-w-[1260px] mx-auto text-center relative z-10">
        <Reveal>
          <span className="label-caps text-gold">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <div className="gold-divider mx-auto mt-7" />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 mt-12 sm:mt-14 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1} className="h-full">
              <article className="testimonial-card group text-left h-full">
                <div className="testimonial-card-surface">
                  <span className="testimonial-stars">★★★★★</span>
                  <p className="testimonial-quote">
                    „{item.text[locale]}”
                  </p>
                  <div className="testimonial-meta">
                    <div className="testimonial-author">{item.author[locale]}</div>
                    <div className="testimonial-source">{item.source}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
