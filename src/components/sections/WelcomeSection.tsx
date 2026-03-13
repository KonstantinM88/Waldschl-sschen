"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function WelcomeSection() {
  const t = useTranslations("welcome");

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="about">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
              alt="Waldschlösschen — Historisches Gebäude"
              fill
              className="object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute -bottom-5 -right-5 w-[200px] h-[200px] border border-gold opacity-30 -z-10" />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <span className="label-caps text-gold">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <div className="gold-divider mb-8" />
          <p className="body-text max-w-[620px]">{t("text1")}</p>
          <p className="body-text max-w-[620px] mt-5">{t("text2")}</p>
          <p className="font-[var(--font-display)] italic text-xl text-stone-dark mt-8">
            {t("signature")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
