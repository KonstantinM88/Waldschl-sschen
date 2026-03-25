"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Compass,
  Bike,
  Mountain,
  Wine,
  Landmark,
  Map,
  TreePine,
  Sun,
  Camera,
  Clock,
  ChevronRight,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

/* ================================================================ HERO */
function DestHero() {
  const t = useTranslations("destinationsPage.hero");
  const r = { initial: { opacity: 0, y: 60, filter: "blur(4px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" } };

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/landscape_restaurant_1920w.webp" alt="Naturpark Saale-Unstrut-Triasland" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/25 via-charcoal/10 to-charcoal/70" />
      </div>
      <div className="relative z-10 text-center text-white px-8 max-w-[900px]">
        <motion.div className="inline-block text-[0.7rem] font-normal tracking-[0.35em] uppercase text-gold-light mb-8" {...r} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <span className="opacity-50 mx-4">—</span>{t("badge")}<span className="opacity-50 mx-4">—</span>
        </motion.div>
        <motion.h1 className="heading-display text-[clamp(2.8rem,6vw,5rem)] mb-6" {...r} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          {t("title")}<br /><em className="text-gold-light">{t("titleEmphasis")}</em>
        </motion.h1>
        <motion.p className="text-[clamp(0.95rem,1.5vw,1.15rem)] font-light leading-relaxed opacity-85 max-w-[640px] mx-auto mb-12" {...r} transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          {t("subtitle")}
        </motion.p>
        <motion.div className="flex gap-5 justify-center flex-wrap" {...r} transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <a href="#highlights" className="btn-primary">{t("ctaExplore")}</a>
          <a href="#aktiv" className="btn-outline-light">{t("ctaActive")}</a>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================ INTRO */
function DestIntro() {
  const t = useTranslations("destinationsPage.intro");
  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/landscape_restaurant_1920w.webp" alt="Saale-Unstrut Landschaft" fill className="object-cover hover:scale-[1.03] transition-transform duration-700" sizes="(max-width:1024px)100vw,50vw" />
            <div className="absolute -bottom-5 -right-5 w-[200px] h-[200px] border border-gold opacity-30 -z-10" />
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <span className="label-caps text-gold">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">{t("title")} <em>{t("titleEmphasis")}</em></h2>
          <div className="gold-divider mb-8" />
          <p className="body-text max-w-[620px]">{t("text1")}</p>
          <p className="body-text max-w-[620px] mt-5">{t("text2")}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================ HIGHLIGHTS — big featured cards */
function DestHighlights() {
  const t = useTranslations("destinationsPage.highlights");
  const locale = useLocale() as "de" | "en";

  const items = [
    { key: "arche" as const, image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900&q=80", Icon: Landmark, span: "lg:col-span-2 lg:row-span-2", aspect: "aspect-auto h-full min-h-[380px] lg:min-h-[520px]" },
    { key: "mittelberg" as const, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", Icon: Mountain, span: "", aspect: "aspect-[4/3]" },
    { key: "weinberge" as const, image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80", Icon: Wine, span: "", aspect: "aspect-[4/3]" },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-charcoal text-white" id="highlights">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">{t("title")} <em>{t("titleEmphasis")}</em></h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.12} className={item.span}>
              <div className={`group relative overflow-hidden cursor-pointer ${item.aspect}`}>
                <Image src={item.image} alt={t(`${item.key}.title`)} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent group-hover:from-charcoal/90 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                  <item.Icon className="w-6 h-6 text-gold-light stroke-[1.5] mb-4" />
                  <span className="block text-[0.65rem] font-medium tracking-[0.2em] uppercase text-gold-light mb-2">{t(`${item.key}.distance`)}</span>
                  <h3 className="font-[var(--font-display)] text-2xl lg:text-3xl font-normal mb-3">{t(`${item.key}.title`)}</h3>
                  <p className="text-sm font-light leading-relaxed text-white/70 max-w-[460px]">{t(`${item.key}.desc`)}</p>
                </div>
              </div>
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
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">{t("title")} <em>{t("titleEmphasis")}</em></h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={(i % 3) * 0.1}>
              <div className="group bg-white p-8 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500">
                <div className="flex items-center justify-between mb-5">
                  <item.Icon className="w-6 h-6 text-gold stroke-[1.5]" />
                  <span className="text-[0.65rem] font-medium tracking-[0.15em] uppercase text-gold">{t(`${item.key}.distance`)}</span>
                </div>
                <h3 className="font-[var(--font-display)] text-xl font-medium text-charcoal mb-3">{t(`${item.key}.title`)}</h3>
                <p className="text-sm font-light leading-relaxed text-text-secondary">{t(`${item.key}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ ACTIVE — Radfahren, Wandern, Wein */
function DestActive() {
  const t = useTranslations("destinationsPage.active");

  const activities = [
    { key: "radfahren" as const, Icon: Bike, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80" },
    { key: "wandern" as const, Icon: TreePine, image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80" },
    { key: "wein" as const, Icon: Wine, image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80" },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="aktiv">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">{t("title")} <em>{t("titleEmphasis")}</em></h2>
            <p className="body-text mx-auto max-w-[620px]">{t("text")}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activities.map((a, i) => (
            <Reveal key={a.key} delay={i * 0.12}>
              <div className="group">
                <div className="relative aspect-[4/3] overflow-hidden mb-6">
                  <Image src={a.image} alt={t(`${a.key}.title`)} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                </div>
                <a.Icon className="w-6 h-6 text-gold stroke-[1.5] mb-3" />
                <h3 className="font-[var(--font-display)] text-2xl font-medium text-charcoal mb-3">{t(`${a.key}.title`)}</h3>
                <p className="body-text">{t(`${a.key}.desc`)}</p>
                {a.key === "radfahren" && (
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium tracking-[0.1em] uppercase text-gold">
                    <Bike className="w-3.5 h-3.5" /> {t("bikeNote")}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ REGION INFO */
function DestRegion() {
  const t = useTranslations("destinationsPage.region");
  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-forest text-white relative overflow-hidden">
      <div className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full border border-gold/10" />
      <div className="max-w-[1100px] mx-auto relative z-10 text-center">
        <Reveal>
          <span className="label-caps text-gold-light">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">{t("title")} <em>{t("titleEmphasis")}</em></h2>
          <p className="text-lg font-light leading-relaxed text-white/75 mx-auto max-w-[680px]">{t("text")}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14">
            {[
              { num: "1.000+", label: "ha Weinberge" },
              { num: "60+", label: "Weingüter" },
              { num: "230 km", label: "Fernwanderwege" },
              { num: "189 km", label: "Unstrutradweg" },
            ].map((f) => (
              <div key={f.label} className="p-6 border border-white/10">
                <div className="font-[var(--font-display)] text-3xl font-light text-gold-light">{f.num}</div>
                <div className="text-xs font-light tracking-[0.1em] uppercase text-white/50 mt-2">{f.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================ CTA */
function DestCta() {
  const t = useTranslations("destinationsPage.cta");
  return (
    <section className="relative py-[clamp(6rem,12vw,10rem)] px-[clamp(1.5rem,5vw,6rem)] text-center text-white overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/landscape_restaurant_1920w.webp" alt="Saale-Unstrut" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/85 to-forest/92" />
      </div>
      <Reveal>
        <div className="relative z-10 max-w-[700px] mx-auto">
          <span className="label-caps text-gold-light">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">{t("title")} <em>{t("titleEmphasis")}</em></h2>
          <p className="text-lg font-light leading-relaxed opacity-85 mb-12">{t("text")}</p>
          <div className="flex gap-5 justify-center flex-wrap">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary">{t("ctaBook")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light">{t("ctaEmail")}</a>
          </div>
        </div>
      </Reveal>
    </section>
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
