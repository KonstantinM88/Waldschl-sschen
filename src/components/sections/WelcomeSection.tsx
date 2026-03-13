"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";

export default function WelcomeSection() {
  const t = useTranslations("welcome");
  const imageSrcSet = [
    "/landscape_restaurant_800w.webp 800w",
    "/landscape_restaurant_1200w.webp 1200w",
    "/landscape_restaurant_1600w.webp 1600w",
    "/landscape_restaurant_1920w.webp 1920w",
  ].join(", ");

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="about">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
        <Reveal>
          <div className="group relative mx-auto w-full max-w-[720px]">
            <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[1.85rem] bg-[radial-gradient(70%_70%_at_50%_50%,rgba(201,169,110,0.24)_0%,rgba(201,169,110,0)_100%)] blur-xl" />

            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/55 bg-white/30 p-2 shadow-[0_24px_56px_rgba(20,24,32,0.2)] backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-[6px] rounded-[1.38rem] border border-white/65" />
              <div className="pointer-events-none absolute inset-[12px] rounded-[1.12rem] border border-gold/35" />

              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.08rem]">
                <img
                  src="/landscape_restaurant_1920w.webp"
                  srcSet={imageSrcSet}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  alt="Waldschlösschen — Restaurant-Landschaft"
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(170deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_34%,rgba(8,8,10,0.16)_100%)]" />
              </div>
            </div>

            <div className="pointer-events-none absolute -left-2 top-1/2 h-16 w-[2px] -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-gold/70 to-transparent" />
            <div className="pointer-events-none absolute -right-2 top-1/2 h-16 w-[2px] -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-gold/70 to-transparent" />
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
