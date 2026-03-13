"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { destinations } from "@/data/site";
import type { Locale } from "@/lib/i18n/config";

export default function DestinationsSection() {
  const t = useTranslations("destinations");
  const locale = useLocale() as Locale;

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="ausflugsziele">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <Reveal key={dest.id} delay={(i % 3) * 0.1}>
              <div className="group cursor-pointer">
                <div className="aspect-[3/2] relative overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="py-7">
                  <span className="text-[0.7rem] font-normal tracking-[0.12em] uppercase text-gold">
                    {dest.distance[locale]}
                  </span>
                  <h3 className="font-[var(--font-display)] text-xl font-medium mt-2 mb-2">
                    {dest.name[locale]}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-text-secondary">
                    {dest.description[locale]}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
