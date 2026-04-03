"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Bike,
  Compass,
  Landmark,
  Map,
  Mountain,
  Sun,
  TreePine,
  Wine,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import PremiumWaveFrame from "@/components/ui/PremiumWaveFrame";
import { siteConfig } from "@/data/site";

/* ================================================================ HERO */
function DestHero() {
  const t = useTranslations("destinationsPage.hero");
  const reveal = {
    initial: { opacity: 0, y: 60, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <PremiumWaveFrame
      src="/landscape_restaurant_1920w.webp"
      alt="Naturpark Saale-Unstrut-Triasland"
      sizes="100vw"
      priority
      outerClassName="relative flex h-[78vh] min-h-[540px] items-center justify-center overflow-hidden sm:h-[85vh] sm:min-h-[600px]"
      surfaceClassName="dest-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-charcoal/24 via-charcoal/8 to-charcoal/74" />}
      afterSheen={<div className="dest-hero-shine" aria-hidden="true" />}
    >
      <div className="relative z-10 mx-auto max-w-[920px] px-5 text-center text-white sm:px-8">
        <motion.div
          className="dest-hero-kicker inline-block max-w-[19rem] text-balance mb-6 text-[0.58rem] font-normal uppercase leading-[1.85] tracking-[0.2em] sm:mb-8 sm:max-w-none sm:text-[0.7rem] sm:tracking-[0.35em]"
          {...reveal}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="dest-hero-kicker-mark mx-2.5 sm:mx-4">—</span>
          {t("badge")}
          <span className="dest-hero-kicker-mark mx-2.5 sm:mx-4">—</span>
        </motion.div>

        <motion.h1
          className="dest-hero-title heading-display mb-4 text-[clamp(2.18rem,11.4vw,4.7rem)] leading-[0.95] sm:mb-6 sm:text-[clamp(2.8rem,6vw,5rem)]"
          {...reveal}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("title")}
          <br />
          <em>{t("titleEmphasis")}</em>
        </motion.h1>

        <motion.p
          className="dest-hero-subtitle mx-auto mb-8 max-w-[22rem] text-[0.94rem] font-light leading-relaxed sm:mb-12 sm:max-w-[700px] sm:text-[clamp(0.95rem,1.5vw,1.15rem)]"
          {...reveal}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="mx-auto flex max-w-[18rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5"
          {...reveal}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#highlights" className="btn-primary w-full sm:w-auto">{t("ctaExplore")}</a>
          <a href="#aktiv" className="btn-outline-light w-full sm:w-auto">{t("ctaActive")}</a>
        </motion.div>
      </div>
    </PremiumWaveFrame>
  );
}

/* ================================================================ INTRO */
function DestIntro() {
  const t = useTranslations("destinationsPage.intro");

  const facts = [
    { value: "4", suffix: "min", label: t("stats.arche"), Icon: Landmark },
    { value: "60+", suffix: "", label: t("stats.wineries"), Icon: Wine },
    { value: "189", suffix: "km", label: t("stats.cycling"), Icon: Bike },
    { value: "UNESCO", suffix: "", label: t("stats.culture"), Icon: Map },
  ];

  return (
    <section className="voucher-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="voucher-orb voucher-orb-left" />
      <div className="voucher-orb voucher-orb-right" />

      <div className="relative z-[1] mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-[clamp(3rem,6vw,8rem)] lg:grid-cols-2">
        <Reveal>
          <PremiumWaveFrame
            src="/landscape_restaurant_1920w.webp"
            alt="Saale-Unstrut Landschaft"
            sizes="(max-width: 1024px) 100vw, 50vw"
            outerClassName="voucher-media-card"
            surfaceClassName="voucher-media-surface aspect-[5/4] sm:aspect-[4/5]"
            imageClassName="voucher-media-video object-cover"
            beforeSheen={<div className="voucher-media-overlay" />}
            afterSheen={
              <>
                <div className="voucher-media-frame voucher-media-frame-outer" />
                <div className="voucher-media-frame voucher-media-frame-inner" />
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.2}>
          <div className="voucher-content-panel">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2rem,8.6vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mb-8" />
            <p className="body-text max-w-[620px]">{t("text1")}</p>
            <p className="body-text mt-5 max-w-[620px]">{t("text2")}</p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="testimonial-card group h-full">
                  <div className="testimonial-card-surface min-h-0 p-5 sm:p-6">
                    <div className="relative z-[1] mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-sand-light shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-500 group-hover:bg-gold/10">
                      <fact.Icon className="h-5 w-5 text-gold stroke-[1.5]" />
                    </div>
                    <div className="relative z-[1] flex items-end gap-1 font-[var(--font-display)] leading-none text-charcoal">
                      <span className="text-[2rem] font-light">{fact.value}</span>
                      {fact.suffix ? <span className="pb-1 text-[0.8rem] font-normal uppercase tracking-[0.12em] text-text-muted sm:text-[0.9rem] sm:tracking-[0.14em]">{fact.suffix}</span> : null}
                    </div>
                    <div className="relative z-[1] mt-2 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-text-muted sm:text-[0.72rem] sm:tracking-[0.16em]">
                      {fact.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================ HIGHLIGHTS */
function DestHighlights() {
  const t = useTranslations("destinationsPage.highlights");

  const items = [
    {
      key: "arche" as const,
      image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=85&auto=format&fit=crop",
      Icon: Landmark,
      span: "lg:col-span-2 lg:row-span-2",
      aspect: "aspect-[5/4] sm:aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px] sm:min-h-[340px]",
    },
    {
      key: "mittelberg" as const,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85&auto=format&fit=crop",
      Icon: Mountain,
      span: "",
      aspect: "aspect-[5/4] sm:aspect-[4/3]",
    },
    {
      key: "weinberge" as const,
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=85&auto=format&fit=crop",
      Icon: Wine,
      span: "",
      aspect: "aspect-[5/4] sm:aspect-[4/3]",
    },
  ];

  return (
    <section className="bg-charcoal py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] text-white" id="highlights">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-white">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.key} delay={index * 0.12} className={item.span}>
              <PremiumWaveFrame
                src={item.image}
                alt={t(`${item.key}.title`)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                outerClassName={`spaces-card relative cursor-pointer ${item.aspect}`}
                surfaceClassName="spaces-card-surface"
                imageClassName="object-cover brightness-[0.86] transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.7]"
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-6 sm:p-8 lg:p-10">
                    <div className="relative z-[1] max-w-[32rem]">
                      <item.Icon className="mb-4 h-6 w-6 text-gold-light stroke-[1.5]" />
                      <span className="mb-2 block text-[0.6rem] font-medium uppercase tracking-[0.15em] text-gold-light sm:text-[0.66rem] sm:tracking-[0.18em]">
                        {t(`${item.key}.distance`)}
                      </span>
                      <h3 className="mb-3 font-[var(--font-display)] text-[clamp(1.5rem,7vw,2.7rem)] font-normal text-white sm:text-[clamp(1.8rem,2.4vw,2.7rem)]">
                        {t(`${item.key}.title`)}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-white/74">
                        {t(`${item.key}.desc`)}
                      </p>
                    </div>
                  </div>
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ DESTINATIONS GRID */
function DestGrid() {
  const t = useTranslations("destinationsPage.grid");

  const items = [
    { key: "rotkaeppchen" as const, Icon: Wine },
    { key: "memleben" as const, Icon: Landmark },
    { key: "naumburg" as const, Icon: Landmark },
    { key: "eisleben" as const, Icon: Landmark },
    { key: "freibad" as const, Icon: Sun },
    { key: "burgscheidungen" as const, Icon: Landmark },
  ];

  return (
    <section className="bg-sand-light py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.key} delay={(index % 3) * 0.1}>
              <div className="testimonial-card group h-full">
                <div className="testimonial-card-surface min-h-0 p-6 sm:p-7 lg:p-8">
                  <div className="relative z-[1] mb-5 flex items-center justify-between gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sand-light shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-500 group-hover:bg-gold/10">
                      <item.Icon className="h-5 w-5 text-gold stroke-[1.5]" />
                    </span>
                    <span className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-gold sm:text-[0.65rem] sm:tracking-[0.16em]">
                      {t(`${item.key}.distance`)}
                    </span>
                  </div>
                  <h3 className="relative z-[1] mb-3 font-[var(--font-display)] text-xl font-medium text-charcoal">
                    {t(`${item.key}.title`)}
                  </h3>
                  <p className="relative z-[1] text-sm font-light leading-relaxed text-text-secondary">
                    {t(`${item.key}.desc`)}
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

/* ================================================================ ACTIVE */
function DestActive() {
  const t = useTranslations("destinationsPage.active");

  const activities = [
    {
      key: "radfahren" as const,
      Icon: Bike,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&q=85&auto=format&fit=crop",
    },
    {
      key: "wandern" as const,
      Icon: TreePine,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=85&auto=format&fit=crop",
    },
    {
      key: "wein" as const,
      Icon: Wine,
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=85&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="aktiv">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="body-text mx-auto max-w-[680px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {activities.map((activity, index) => (
            <Reveal key={activity.key} delay={index * 0.12}>
              <PremiumWaveFrame
                src={activity.image}
                alt={t(`${activity.key}.title`)}
                sizes="(max-width: 1024px) 100vw, 33vw"
                outerClassName="spaces-card relative aspect-[6/7] sm:aspect-[4/5] cursor-pointer"
                surfaceClassName="spaces-card-surface"
                imageClassName="object-cover brightness-[0.88] transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.7]"
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-6 sm:p-8 lg:p-10">
                    <div className="relative z-[1] max-w-[26rem]">
                      <activity.Icon className="mb-4 h-6 w-6 text-gold-light stroke-[1.5]" />
                      <h3 className="mb-3 font-[var(--font-display)] text-[clamp(1.45rem,6vw,2.2rem)] font-normal text-white sm:text-[clamp(1.7rem,2vw,2.2rem)]">
                        {t(`${activity.key}.title`)}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-white/76">
                        {t(`${activity.key}.desc`)}
                      </p>
                      {activity.key === "radfahren" ? (
                        <div className="mt-5 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-center text-[0.58rem] font-medium uppercase leading-relaxed tracking-[0.14em] text-gold-light backdrop-blur-sm sm:text-[0.62rem] sm:tracking-[0.16em]">
                          <Bike className="h-3.5 w-3.5 stroke-[1.8]" />
                          {t("bikeNote")}
                        </div>
                      ) : null}
                    </div>
                  </div>
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ REGION */
function DestRegion() {
  const t = useTranslations("destinationsPage.region");

  const facts = [
    { value: "1.000+", label: t("stats.vineyards"), Icon: Wine },
    { value: "60+", label: t("stats.wineries"), Icon: Compass },
    { value: "230 km", label: t("stats.hiking"), Icon: TreePine },
    { value: "189 km", label: t("stats.cycling"), Icon: Bike },
  ];

  return (
    <section className="events-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] text-white">
      <div className="events-orb events-orb-right" />
      <div className="events-orb events-orb-left" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-white">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mx-auto mb-8" />
            <p className="mx-auto max-w-[760px] text-lg font-light leading-relaxed text-white/72">
              {t("text")}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {facts.map((fact, index) => (
            <Reveal key={fact.label} delay={index * 0.08}>
              <div className="events-card group relative h-full">
                <div className="events-card-surface flex h-full flex-col justify-between">
                  <div className="events-card-glow" />
                  <span className="events-card-icon">
                    <fact.Icon className="h-4 w-4 stroke-[1.8]" />
                  </span>
                  <div className="events-card-title text-[1.8rem] md:text-[2rem]">{fact.value}</div>
                  <p className="events-card-desc mt-3 text-sm leading-relaxed">
                    {fact.label}
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

/* ================================================================ CTA */
function DestCta() {
  const t = useTranslations("destinationsPage.cta");

  return (
    <PremiumWaveFrame
      src="/landscape_restaurant_1920w.webp"
      alt="Saale-Unstrut"
      sizes="100vw"
      outerClassName="relative overflow-hidden py-[clamp(5rem,11vw,10rem)] px-[clamp(1.25rem,5vw,6rem)] text-center text-white"
      surfaceClassName="dest-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-forest/84 to-forest/92" />}
      afterSheen={<div className="dest-hero-shine dest-hero-shine-soft" aria-hidden="true" />}
    >
      <Reveal>
        <div className="relative z-10 mx-auto max-w-[720px]">
          <span className="dest-hero-kicker label-caps text-gold-light max-w-[19rem] text-balance inline-block leading-[1.8] tracking-[0.2em] sm:max-w-none sm:tracking-[0.3em]">{t("label")}</span>
          <h2 className="dest-hero-title heading-display mt-5 mb-5 text-[clamp(1.95rem,8.2vw,3.8rem)] text-white sm:mb-6 sm:text-[clamp(2.2rem,4.5vw,3.8rem)]">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <p className="dest-hero-subtitle mb-8 text-[0.98rem] font-light leading-relaxed sm:mb-12 sm:text-lg">{t("text")}</p>
          <div className="mx-auto flex max-w-[18rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary w-full sm:w-auto">{t("ctaBook")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light w-full sm:w-auto">{t("ctaEmail")}</a>
          </div>
        </div>
      </Reveal>
    </PremiumWaveFrame>
  );
}

/* ================================================================ EXPORT */
export default function DestinationsPageContent() {
  return (
    <main>
      <DestHero />
      <DestIntro />
      <DestHighlights />
      <DestGrid />
      <DestActive />
      <DestRegion />
      <DestCta />
    </main>
  );
}
