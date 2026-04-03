"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  UtensilsCrossed,
  Wine,
  Flame,
  Sun,
  Star,
  Users,
  Leaf,
  GlassWater,
  Wheat,
  MilkOff,
  Heart,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

type ScrollDirection = "up" | "down";

const MOBILE_WAVE_QUERY = "(max-width: 1024px), (hover: none) and (pointer: coarse)";

interface RestaurantWaveFrameProps {
  src: string;
  alt: string;
  sizes: string;
  outerClassName: string;
  surfaceClassName: string;
  imageClassName?: string;
  priority?: boolean;
  beforeSheen?: ReactNode;
  afterSheen?: ReactNode;
  children?: ReactNode;
}

/* ================================================================
   UNIVERSAL WAVE FRAME — Scroll / Hover / Tap
   ================================================================ */
function RestaurantWaveFrame({
  src,
  alt,
  sizes,
  outerClassName,
  surfaceClassName,
  imageClassName = "object-cover",
  priority = false,
  beforeSheen,
  afterSheen,
  children,
}: RestaurantWaveFrameProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasScrolledRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<ScrollDirection>("down");
  const pulseDoneRef = useRef(false);
  const [mobilePulseDirection, setMobilePulseDirection] = useState<ScrollDirection | null>(null);

  const triggerMobilePulse = (direction: ScrollDirection = scrollDirectionRef.current) => {
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }

    setMobilePulseDirection(null);

    window.requestAnimationFrame(() => {
      setMobilePulseDirection(direction);
      pulseTimeoutRef.current = setTimeout(() => {
        setMobilePulseDirection(null);
      }, 1720);
    });
  };

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollYRef.current;

      if (Math.abs(delta) > 2) {
        hasScrolledRef.current = true;
        scrollDirectionRef.current = delta > 0 ? "down" : "up";
      }

      lastScrollYRef.current = nextScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const mobileMedia = window.matchMedia(MOBILE_WAVE_QUERY);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        if (mobileMedia.matches && hasScrolledRef.current && !pulseDoneRef.current) {
          pulseDoneRef.current = true;
          triggerMobilePulse(scrollDirectionRef.current);
        }

        observer.unobserve(entry.target);
      },
      {
        threshold: 0.22,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, []);

  const wrapperClassName = [
    outerClassName,
    "restaurant-wave-host",
    "group",
    mobilePulseDirection
      ? `restaurant-wave-mobile-pulse restaurant-wave-mobile-pulse-${mobilePulseDirection}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const mediaSurfaceClassName = ["restaurant-wave-surface", surfaceClassName].filter(Boolean).join(" ");

  return (
    <div
      ref={cardRef}
      className={wrapperClassName}
      onTouchStart={() => {
        triggerMobilePulse();
      }}
    >
      <div className={mediaSurfaceClassName}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={imageClassName}
          sizes={sizes}
        />
        {beforeSheen}
        <span className="restaurant-wave-sheen" aria-hidden="true" />
        {afterSheen}
      </div>
      {children}
    </div>
  );
}

/* ================================================================
   HERO
   ================================================================ */
function RestaurantHero() {
  const t = useTranslations("restaurantPage.hero");

  const reveal = {
    initial: { opacity: 0, y: 60, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <RestaurantWaveFrame
      src="/restaurant_room_1920w.webp"
      alt="Restaurant Waldschlösschen — Gastraum"
      sizes="100vw"
      priority
      outerClassName="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden"
      surfaceClassName="restaurant-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/10 to-charcoal/70" />}
      afterSheen={<div className="restaurant-hero-shine" aria-hidden="true" />}
    >
      <div className="relative z-10 text-center text-white px-8 max-w-[900px]">
        <motion.div
          className="restaurant-hero-kicker inline-block text-[0.7rem] font-normal tracking-[0.35em] uppercase mb-8"
          {...reveal}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="restaurant-hero-kicker-mark mx-4">—</span>
          {t("badge")}
          <span className="restaurant-hero-kicker-mark mx-4">—</span>
        </motion.div>

        <motion.h1
          className="restaurant-hero-title heading-display text-[clamp(2.8rem,6vw,5rem)] mb-6"
          {...reveal}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("title")}
          <br />
          <em>{t("titleEmphasis")}</em>
        </motion.h1>

        <motion.p
          className="restaurant-hero-subtitle text-[clamp(0.95rem,1.5vw,1.15rem)] font-light leading-relaxed max-w-[620px] mx-auto mb-12"
          {...reveal}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="flex gap-5 justify-center flex-wrap"
          {...reveal}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#reservieren" className="btn-primary">{t("ctaReserve")}</a>
          <a href="#speisen" className="btn-outline-light">{t("ctaMenu")}</a>
        </motion.div>
      </div>
    </RestaurantWaveFrame>
  );
}

/* ================================================================
   INTRO MEDIA
   ================================================================ */
function RestaurantIntroMediaCard() {
  return (
    <RestaurantWaveFrame
      src="/restaurant_private_room_1920w.webp"
      alt="Restaurant Waldschlösschen — Privatraum"
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
  );
}

/* ================================================================
   INTRO — Philosophy
   ================================================================ */
function RestaurantIntro() {
  const t = useTranslations("restaurantPage.intro");

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
        <Reveal>
          <RestaurantIntroMediaCard />
        </Reveal>

        <Reveal delay={0.2}>
          <div className="voucher-content-panel">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mb-8" />
            <p className="body-text max-w-[620px]">{t("text1")}</p>
            <p className="body-text max-w-[620px] mt-5">{t("text2")}</p>
            <p className="body-text max-w-[620px] mt-5">{t("text3")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   CUISINE — What we serve
   ================================================================ */
function RestaurantCuisine() {
  const t = useTranslations("restaurantPage.cuisine");

  const highlights = [
    { key: "seasonal" as const, Icon: Leaf },
    { key: "regional" as const, Icon: Wheat },
    { key: "homemade" as const, Icon: Heart },
    { key: "wine" as const, Icon: Wine },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light" id="speisen">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.1}>
              <div className="testimonial-card group h-full">
                <div className="testimonial-card-surface min-h-0 items-center p-8 text-center lg:p-10">
                  <div className="relative z-[1] mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sand-light shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-500 group-hover:bg-gold/10">
                    <item.Icon className="w-6 h-6 text-gold stroke-[1.5]" />
                  </div>
                  <h3 className="relative z-[1] font-[var(--font-display)] text-xl font-medium text-charcoal mb-3">
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

        {/* Dietary info */}
        <Reveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-text-muted">
            <span className="flex items-center gap-2 text-xs tracking-[0.08em] uppercase">
              <Leaf className="w-3.5 h-3.5 text-gold stroke-[1.5]" />
              {t("vegetarian")}
            </span>
            <span className="flex items-center gap-2 text-xs tracking-[0.08em] uppercase">
              <MilkOff className="w-3.5 h-3.5 text-gold stroke-[1.5]" />
              {t("lactoseFree")}
            </span>
            <span className="flex items-center gap-2 text-xs tracking-[0.08em] uppercase">
              <Wheat className="w-3.5 h-3.5 text-gold stroke-[1.5]" />
              {t("glutenFree")}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   SPACES — Restaurant, Kaminzimmer, Terrasse
   ================================================================ */
function RestaurantSpaces() {
  const t = useTranslations("restaurantPage.spaces");

  const spaces = [
    {
      key: "restaurant" as const,
      image: "/restaurant_room_1920w.webp",
      Icon: UtensilsCrossed,
      span: "lg:col-span-2 lg:row-span-2",
      aspect: "aspect-[16/10] lg:aspect-auto lg:h-full",
    },
    {
      key: "kamin" as const,
      image: "/library_room_1920w.webp",
      Icon: Flame,
      span: "",
      aspect: "aspect-[4/3]",
    },
    {
      key: "terrasse" as const,
      image: "/restaurant_terrace_1920w.webp",
      Icon: Sun,
      span: "",
      aspect: "aspect-[4/3]",
    },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-charcoal text-white">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="text-lg font-light leading-relaxed text-white/70 mx-auto max-w-[620px]">
              {t("text")}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {spaces.map((space, i) => (
            <Reveal key={space.key} delay={i * 0.12} className={space.span}>
              <RestaurantWaveFrame
                src={space.image}
                alt={t(`${space.key}.title`)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                outerClassName={`spaces-card relative cursor-pointer ${space.aspect}`}
                surfaceClassName="spaces-card-surface"
                imageClassName="object-cover brightness-[0.84] transition-all duration-700 group-hover:brightness-[0.7] group-hover:scale-[1.06]"
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-8 lg:p-10">
                    <div className="relative z-[1]">
                      <space.Icon className="w-6 h-6 text-gold-light stroke-[1.5] mb-4" />
                      <h3 className="font-[var(--font-display)] text-2xl font-normal mb-2">
                        {t(`${space.key}.title`)}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-white/70 max-w-[400px]">
                        {t(`${space.key}.desc`)}
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

/* ================================================================
   GALLERY
   ================================================================ */
function RestaurantGallery() {
  const images = [
    { src: "/restaurant_room_1920w.webp", alt: "Gastraum", span: "col-span-2" },
    { src: "/restaurant_private_room_1920w.webp", alt: "Separée", span: "col-span-1" },
    { src: "/restaurant_terrace_1920w.webp", alt: "Terrasse", span: "col-span-1" },
    { src: "/Schachtstube_mural_1920w.webp", alt: "Schachtstube", span: "col-span-1" },
    { src: "/library_room_1920w.webp", alt: "Kaminzimmer", span: "col-span-1" },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">Impressionen</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5">
              Einblicke in unser <em>Restaurant</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <Reveal key={img.src} delay={(i % 3) * 0.1} className={img.span}>
              <RestaurantWaveFrame
                src={img.src}
                alt={img.alt}
                sizes="(max-width: 768px) 50vw, 33vw"
                outerClassName="spaces-card relative aspect-[16/10] cursor-pointer"
                surfaceClassName="spaces-card-surface"
                imageClassName="object-cover brightness-[0.9] transition-all duration-700 group-hover:brightness-[0.74] group-hover:scale-[1.06]"
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-4 sm:p-5">
                    <span className="relative z-[1] font-[var(--font-body)] text-[0.66rem] font-light tracking-[0.16em] uppercase text-white/82">
                      {img.alt}
                    </span>
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

/* ================================================================
   OPENING HOURS
   ================================================================ */
function RestaurantHours() {
  const t = useTranslations("restaurantPage.hours");

  const rows = [
    { dayKey: "monday" as const, timeKey: "mondayTime" as const },
    { dayKey: "tueSat" as const, timeKey: "tueSatTime" as const },
    { dayKey: "sunday" as const, timeKey: "sundayTime" as const },
    { dayKey: "kitchen" as const, timeKey: "kitchenTime" as const },
    { dayKey: "kitchenSun" as const, timeKey: "kitchenSunTime" as const },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-forest text-white relative overflow-hidden" id="reservieren">
      <div className="absolute -top-1/2 -left-[20%] w-[500px] h-[500px] rounded-full border border-gold/10" />

      <div className="max-w-[1100px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,6rem)] items-center">
          <Reveal>
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mb-8" />
            <p className="text-lg font-light leading-relaxed text-white/75 max-w-[480px]">
              {t("text")}
            </p>
            <p className="text-sm font-light text-white/50 mt-6 italic">
              {t("note")}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="events-card group relative">
              <div className="events-card-surface min-h-0 p-8 lg:p-10">
                <div className="events-card-glow" />
                <div className="relative z-[1] flex items-center gap-3 mb-8">
                  <Clock className="w-5 h-5 text-gold-light stroke-[1.5]" />
                  <h3 className="font-[var(--font-display)] text-xl font-normal">{t("hoursTitle")}</h3>
                </div>
                {rows.map((row, i) => (
                  <div
                    key={row.dayKey}
                    className={`relative z-[1] flex items-center justify-between py-4 ${i < rows.length - 1 ? "border-b border-white/10" : ""}`}
                  >
                    <span className="text-sm font-light text-white/80">{t(row.dayKey)}</span>
                    <span className="text-sm font-medium text-gold-light">{t(row.timeKey)}</span>
                  </div>
                ))}
                <div className="relative z-[1] mt-8 pt-6 border-t border-white/10 text-center">
                  <p className="text-xs font-light text-white/50">{t("closed")}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <div className="flex gap-5 justify-center flex-wrap mt-14">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary">{t("ctaReserve")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light">{t("ctaEmail")}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   EVENTS TEASER
   ================================================================ */
function RestaurantEvents() {
  const t = useTranslations("restaurantPage.events");

  const items = [
    { key: "private" as const, Icon: Users },
    { key: "candle" as const, Icon: Flame },
    { key: "wine" as const, Icon: GlassWater },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="body-text mx-auto max-w-[600px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.1}>
              <div className="testimonial-card group h-full">
                <div className="testimonial-card-surface min-h-0 p-8 lg:p-10">
                  <div className="relative z-[1] mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-sand-light shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-500 group-hover:bg-gold/10">
                    <item.Icon className="w-7 h-7 text-gold stroke-[1.5]" />
                  </div>
                  <h3 className="relative z-[1] font-[var(--font-display)] text-xl font-medium text-charcoal mb-3">
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

/* ================================================================
   TESTIMONIALS
   ================================================================ */
function RestaurantTestimonials() {
  const locale = useLocale() as "de" | "en";

  const reviews = [
    {
      text: {
        de: "Durchaus gehoben-preisig, aber das Ambiente stimmt, die Karte ist reichhaltig bestückt und der Service war freundlich und flott.",
        en: "Somewhat upscale in pricing, but the ambiance is right, the menu is rich and the service was friendly and swift.",
      },
      author: { de: "Familie", en: "Family" },
      source: "Tripadvisor",
    },
    {
      text: {
        de: "Unbedingt Soljanka und Würzfleisch probieren! Das Café an der Arche Nebra gehört zum gleichen Betreiber.",
        en: "Definitely try the Soljanka and Würzfleisch! The café at the Arche Nebra belongs to the same operator.",
      },
      author: { de: "Genussreisender", en: "Food Traveller" },
      source: "Tripadvisor",
    },
    {
      text: {
        de: "Prima regionale Küche und wunderschönes Ambiente. Absolut freundlicher Service. Schöner Biergarten gleich am Haus.",
        en: "Excellent regional cuisine and wonderful ambiance. Absolutely friendly service. Lovely beer garden right at the house.",
      },
      author: { de: "Paar aus Berlin", en: "Couple from Berlin" },
      source: "Booking.com",
    },
  ];

  return (
    <section className="testimonials-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="testimonials-orb testimonials-orb-left" />
      <div className="testimonials-orb testimonials-orb-right" />

      <div className="max-w-[1200px] mx-auto relative z-[1]">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">Gästestimmen</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5">
              Was Gäste über unsere <em>Küche</em> sagen
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="testimonial-card h-full">
                <div className="testimonial-card-surface p-8 lg:p-10">
                  <div className="relative z-[1] flex gap-1 text-gold mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-gold stroke-gold" />
                    ))}
                  </div>
                  <p className="testimonial-quote relative z-[1] mb-6 !text-[1.45rem] lg:!text-[1.62rem]">
                    „{review.text[locale]}“
                  </p>
                  <div className="testimonial-meta">
                    <div className="testimonial-author">{review.author[locale]}</div>
                    <div className="testimonial-source">{review.source}</div>
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

/* ================================================================
   CTA
   ================================================================ */
function RestaurantCta() {
  const t = useTranslations("restaurantPage.cta");

  return (
    <RestaurantWaveFrame
      src="/restaurant_terrace_1920w.webp"
      alt="Terrasse Waldschlösschen"
      sizes="100vw"
      outerClassName="relative py-[clamp(6rem,12vw,10rem)] px-[clamp(1.5rem,5vw,6rem)] text-center text-white overflow-hidden"
      surfaceClassName="absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-forest/85 to-forest/92" />}
    >
      <Reveal>
        <div className="relative z-10 max-w-[700px] mx-auto">
          <span className="label-caps text-gold-light">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <p className="text-lg font-light leading-relaxed opacity-85 mb-12">{t("text")}</p>
          <div className="flex gap-5 justify-center flex-wrap">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary">{t("ctaPhone")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light">{t("ctaEmail")}</a>
          </div>
        </div>
      </Reveal>
    </RestaurantWaveFrame>
  );
}

/* ================================================================
   MAIN EXPORT
   ================================================================ */
export default function RestaurantPageContent() {
  return (
    <main>
      <RestaurantHero />
      <RestaurantIntro />
      <RestaurantCuisine />
      <RestaurantSpaces />
      <RestaurantGallery />
      <RestaurantHours />
      <RestaurantEvents />
      <RestaurantTestimonials />
      <RestaurantCta />
    </main>
  );
}
