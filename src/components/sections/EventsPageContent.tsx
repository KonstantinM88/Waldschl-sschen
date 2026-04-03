"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  BedDouble,
  Building2,
  Cake,
  Camera,
  Car,
  ChevronRight,
  Church,
  Flower2,
  Heart,
  Monitor,
  Music,
  Star,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import PremiumWaveFrame from "@/components/ui/PremiumWaveFrame";
import { siteConfig } from "@/data/site";

/* ================================================================ HERO */
function EventsHero() {
  const t = useTranslations("eventsPage.hero");
  const reveal = {
    initial: { opacity: 0, y: 60, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <PremiumWaveFrame
      src="/Foyer_1920w.webp"
      alt="Foyer Waldschlösschen — Eventlocation"
      sizes="100vw"
      priority
      outerClassName="relative flex min-h-[600px] items-center justify-center overflow-hidden h-[85vh]"
      surfaceClassName="events-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-charcoal/34 via-charcoal/10 to-charcoal/78" />}
      afterSheen={<div className="events-hero-shine" aria-hidden="true" />}
    >
      <div className="relative z-10 max-w-[900px] px-8 text-center text-white">
        <motion.div
          className="events-hero-kicker inline-block mb-8 text-[0.7rem] font-normal uppercase tracking-[0.35em]"
          {...reveal}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="events-hero-kicker-mark mx-4">—</span>
          {t("badge")}
          <span className="events-hero-kicker-mark mx-4">—</span>
        </motion.div>

        <motion.h1
          className="events-hero-title heading-display mb-6 text-[clamp(2.8rem,6vw,5rem)]"
          {...reveal}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("title")}
          <br />
          <em>{t("titleEmphasis")}</em>
        </motion.h1>

        <motion.p
          className="events-hero-subtitle mx-auto mb-12 max-w-[680px] text-[clamp(0.95rem,1.5vw,1.15rem)] font-light leading-relaxed"
          {...reveal}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-5"
          {...reveal}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#anfrage" className="btn-primary">{t("ctaInquiry")}</a>
          <a href="#hochzeit" className="btn-outline-light">{t("ctaWeddings")}</a>
        </motion.div>
      </div>
    </PremiumWaveFrame>
  );
}

/* ================================================================ INTRO */
function EventsIntro() {
  const t = useTranslations("eventsPage.intro");

  const facts = [
    { value: "50", label: t("stats.guests"), Icon: Users },
    { value: "5", label: t("stats.venues"), Icon: Building2 },
    { value: "24", label: t("stats.rooms"), Icon: BedDouble },
    { value: "2017", label: t("stats.registry"), Icon: Church },
  ];

  return (
    <section className="voucher-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="voucher-orb voucher-orb-left" />
      <div className="voucher-orb voucher-orb-right" />

      <div className="relative z-[1] mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-[clamp(3rem,6vw,8rem)] lg:grid-cols-2">
        <Reveal>
          <PremiumWaveFrame
            src="/Schachtstube_mural_1920w.webp"
            alt="Schachtstube — Veranstaltungsraum"
            sizes="(max-width: 1024px) 100vw, 50vw"
            outerClassName="voucher-media-card"
            surfaceClassName="voucher-media-surface aspect-[4/5]"
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
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
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
                    <div className="relative z-[1] font-[var(--font-display)] text-[2rem] font-light leading-none text-charcoal">
                      {fact.value}
                    </div>
                    <div className="relative z-[1] mt-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-text-muted">
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

/* ================================================================ WEDDINGS */
function EventsWeddings() {
  const t = useTranslations("eventsPage.weddings");

  const weddingCards = [
    {
      key: "registry" as const,
      image: "/Foyer_1920w.webp",
      Icon: Church,
      badge: t("registryBadge"),
      title: t("registryTitle"),
      desc: t("registryDesc"),
      note: t("registryNote"),
    },
    {
      key: "celebration" as const,
      image: "/restaurant_private_room_1920w.webp",
      Icon: Heart,
      badge: "",
      title: t("celebrationTitle"),
      desc: t("celebrationDesc"),
      note: "",
    },
  ];

  const services = [
    { Icon: UtensilsCrossed, key: "menuPlanning" as const },
    { Icon: Flower2, key: "decoration" as const },
    { Icon: Music, key: "music" as const },
    { Icon: Camera, key: "photo" as const },
    { Icon: Cake, key: "cake" as const },
    { Icon: Car, key: "accommodation" as const },
  ];

  return (
    <section className="bg-sand-light py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="hochzeit">
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {weddingCards.map((card, index) => (
            <Reveal key={card.key} delay={index * 0.12}>
              <PremiumWaveFrame
                src={card.image}
                alt={card.title}
                sizes="(max-width: 1024px) 100vw, 50vw"
                outerClassName="spaces-card relative aspect-[16/11] cursor-pointer"
                surfaceClassName="spaces-card-surface"
                imageClassName="object-cover brightness-[0.82] transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.68]"
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-8 lg:p-10">
                    <div className="relative z-[1] max-w-[34rem]">
                      {card.badge ? (
                        <span className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                          {card.badge}
                        </span>
                      ) : null}
                      <card.Icon className="mb-4 h-6 w-6 text-gold-light stroke-[1.5]" />
                      <h3 className="font-[var(--font-display)] text-[clamp(1.7rem,2.2vw,2.3rem)] font-normal text-white mb-3">
                        {card.title}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-white/78">
                        {card.desc}
                      </p>
                      {card.note ? (
                        <p className="mt-4 text-xs font-light italic leading-relaxed text-white/62">
                          {card.note}
                        </p>
                      ) : null}
                    </div>
                  </div>
                }
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.22}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {services.map((service) => (
              <div key={service.key} className="testimonial-card group h-full">
                <div className="testimonial-card-surface min-h-0 items-center p-6 text-center">
                  <div className="relative z-[1] mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sand-light shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-500 group-hover:bg-gold/10">
                    <service.Icon className="h-5 w-5 text-gold stroke-[1.5]" />
                  </div>
                  <span className="relative z-[1] text-sm font-light leading-snug text-text-secondary">
                    {t(service.key)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================ EVENT TYPES */
function EventTypes() {
  const t = useTranslations("eventsPage.types");

  const items = [
    { key: "family" as const, Icon: Users, image: "/restaurant_room_1920w.webp" },
    { key: "meetings" as const, Icon: Monitor, image: "/library_room_1920w.webp" },
    { key: "celebrations" as const, Icon: Heart, image: "/restaurant_terrace_1920w.webp" },
  ];

  return (
    <section className="events-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] text-white">
      <div className="events-orb events-orb-right" />
      <div className="events-orb events-orb-left" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-white">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mx-auto mb-8" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.key} delay={index * 0.12}>
              <PremiumWaveFrame
                src={item.image}
                alt={t(`${item.key}.title`)}
                sizes="(max-width: 1024px) 100vw, 33vw"
                outerClassName="spaces-card relative aspect-[3/4] cursor-pointer"
                surfaceClassName="spaces-card-surface"
                imageClassName="object-cover brightness-[0.84] transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.68]"
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-8 lg:p-10">
                    <div className="relative z-[1]">
                      <item.Icon className="mb-4 h-6 w-6 text-gold-light stroke-[1.5]" />
                      <h3 className="mb-3 font-[var(--font-display)] text-[clamp(1.75rem,2vw,2.2rem)] font-normal text-white">
                        {t(`${item.key}.title`)}
                      </h3>
                      <p className="max-w-[26rem] text-sm font-light leading-relaxed text-white/74">
                        {t(`${item.key}.desc`)}
                      </p>
                      <a
                        href="#anfrage"
                        className="mt-5 inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-gold-light transition-all duration-300 group-hover:gap-3"
                      >
                        {t("inquire")}
                        <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
                      </a>
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

/* ================================================================ SPACES */
function EventSpaces() {
  const t = useTranslations("eventsPage.spaces");

  const spaces = [
    {
      key: "foyer" as const,
      image: "/Foyer_1920w.webp",
      capacity: "14+2",
      span: "lg:col-span-2 lg:row-span-2",
      aspect: "aspect-[16/10] lg:aspect-auto lg:h-full min-h-[320px]",
    },
    {
      key: "schachtstube" as const,
      image: "/Schachtstube_mural_1920w.webp",
      capacity: "50",
      span: "",
      aspect: "aspect-[4/3]",
    },
    {
      key: "bergmann" as const,
      image: "/restaurant_private_room_1920w.webp",
      capacity: "30",
      span: "",
      aspect: "aspect-[4/3]",
    },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="body-text mx-auto max-w-[640px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {spaces.map((space, index) => (
            <Reveal key={space.key} delay={index * 0.1} className={space.span}>
              <PremiumWaveFrame
                src={space.image}
                alt={t(`${space.key}.title`)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                outerClassName={`spaces-card relative cursor-pointer ${space.aspect}`}
                surfaceClassName="spaces-card-surface"
                imageClassName="object-cover brightness-[0.84] transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.7]"
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-8 lg:p-10">
                    <div className="flex w-full items-end justify-between gap-5">
                      <div className="relative z-[1] max-w-[24rem]">
                        <span className="mb-2 block text-[0.66rem] font-medium uppercase tracking-[0.18em] text-gold-light">
                          {t(`${space.key}.sub`)}
                        </span>
                        <h3 className="font-[var(--font-display)] text-[clamp(1.7rem,2.1vw,2.25rem)] font-normal text-white">
                          {t(`${space.key}.title`)}
                        </h3>
                      </div>
                      <div className="relative z-[1] shrink-0 rounded-full border border-white/16 bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
                        <div className="font-[var(--font-display)] text-xl font-normal text-white">{space.capacity}</div>
                        <div className="text-[0.55rem] uppercase tracking-[0.14em] text-white/60">{t("persons")}</div>
                      </div>
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

/* ================================================================ PROCESS */
function EventProcess() {
  const t = useTranslations("eventsPage.process");

  const steps = [
    { num: "01", key: "contact" as const },
    { num: "02", key: "visit" as const },
    { num: "03", key: "plan" as const },
    { num: "04", key: "celebrate" as const },
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
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.key} delay={index * 0.1}>
              <div className="events-card group relative h-full">
                <div className="events-card-surface h-full">
                  <div className="events-card-glow" />
                  <span className="events-card-icon text-[0.64rem] font-semibold tracking-[0.18em] text-gold-light">
                    {step.num}
                  </span>
                  <h3 className="events-card-title text-[1.45rem] md:text-[1.55rem]">
                    {t(`${step.key}.title`)}
                  </h3>
                  <p className="events-card-desc">
                    {t(`${step.key}.desc`)}
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

/* ================================================================ TESTIMONIALS */
function EventsTestimonials() {
  const t = useTranslations("eventsPage.testimonials");
  const locale = useLocale() as "de" | "en";

  const reviews = [
    {
      text: {
        de: "Wir haben unsere Hochzeit im Waldschlösschen gefeiert. Das Ambiente war außergewöhnlich, die Betreuung herzlich und der Ablauf bis ins Detail stimmig.",
        en: "We celebrated our wedding at Waldschlösschen. The ambiance was extraordinary, the support warm, and every detail of the day felt perfectly composed.",
      },
      author: {
        de: "Brautpaar aus Halle",
        en: "Wedding couple from Halle",
      },
      source: {
        de: "Hochzeitsfeier",
        en: "Wedding reception",
      },
    },
    {
      text: {
        de: "Von der ersten Besichtigung bis zum letzten Gang des Menüs war alles hervorragend organisiert. Unsere Familienfeier hatte genau die festliche Ruhe, die wir gesucht haben.",
        en: "From the first viewing to the final course of the menu, everything was exceptionally well organised. Our family celebration had exactly the festive calm we were looking for.",
      },
      author: {
        de: "Familie aus Leipzig",
        en: "Family from Leipzig",
      },
      source: {
        de: "Familienfest",
        en: "Family celebration",
      },
    },
    {
      text: {
        de: "Die Verbindung aus historischem Haus, professioneller Planung und regionaler Küche macht das Waldschlösschen zu einer starken Adresse für Firmenveranstaltungen.",
        en: "The combination of a historic house, professional planning and regional cuisine makes Waldschlösschen a compelling venue for corporate events.",
      },
      author: {
        de: "Unternehmen aus Naumburg",
        en: "Company from Naumburg",
      },
      source: {
        de: "Tagung & Dinner",
        en: "Conference & dinner",
      },
    },
  ];

  return (
    <section className="testimonials-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="testimonials-orb testimonials-orb-left" />
      <div className="testimonials-orb testimonials-orb-right" />

      <div className="relative z-[1] mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="testimonial-card group h-full">
                <div className="testimonial-card-surface">
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star key={starIndex} className="inline-block h-3.5 w-3.5 fill-gold stroke-gold" />
                    ))}
                  </div>

                  <p className="testimonial-quote">„{review.text[locale]}“</p>

                  <div className="testimonial-meta">
                    <div className="text-xs font-medium text-text-secondary">{review.author[locale]}</div>
                    <div className="testimonial-source">{review.source[locale]}</div>
                  </div>
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
function EventsCta() {
  const t = useTranslations("eventsPage.cta");

  return (
    <PremiumWaveFrame
      src="/landscape_restaurant_1920w.webp"
      alt="Landschaft Saale-Unstrut"
      sizes="100vw"
      outerClassName="relative overflow-hidden py-[clamp(6rem,12vw,10rem)] px-[clamp(1.5rem,5vw,6rem)] text-center text-white"
      surfaceClassName="events-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-forest/84 to-forest/92" />}
      afterSheen={<div className="events-hero-shine events-hero-shine-soft" aria-hidden="true" />}
    >
      <Reveal>
        <div className="relative z-10 mx-auto max-w-[720px]">
          <span className="events-hero-kicker label-caps text-gold-light">{t("label")}</span>
          <h2 className="events-hero-title heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-white">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <p className="events-hero-subtitle mb-12 text-lg font-light leading-relaxed">{t("text")}</p>
          <div className="flex flex-wrap justify-center gap-5">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary">{t("ctaPhone")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light">{t("ctaEmail")}</a>
          </div>
        </div>
      </Reveal>
    </PremiumWaveFrame>
  );
}

/* ================================================================ EXPORT */
export default function EventsPageContent() {
  return (
    <main>
      <EventsHero />
      <EventsIntro />
      <EventsWeddings />
      <EventTypes />
      <EventSpaces />
      <EventProcess />
      <EventsTestimonials />
      <EventsCta />
    </main>
  );
}
