"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BadgeEuro,
  ChefHat,
  Check,
  ChevronDown,
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
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";
import type { PublicRestaurantMenuCategory } from "@/lib/restaurant-menu-shared";

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
          <a href="#speisekarte" className="btn-outline-light">{t("ctaMenu")}</a>
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
   MENU — Live menu from admin
   ================================================================ */
const MENU_FALLBACK_IMAGE = "/restaurant-menu/default.webp";

type PublicRestaurantMenuItem = PublicRestaurantMenuCategory["items"][number];

interface RestaurantMenuMediaProps {
  imageClassName?: string;
  item: PublicRestaurantMenuItem;
  priority?: boolean;
  sizes: string;
  wrapperClassName: string;
}

function RestaurantMenuMedia({
  imageClassName = "object-cover",
  item,
  priority = false,
  sizes,
  wrapperClassName,
}: RestaurantMenuMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const posterUrl = item.imageUrl || MENU_FALLBACK_IMAGE;
  const canPlayVideo = Boolean(item.videoUrl) && !hasVideoError;

  const playVideo = () => {
    if (!canPlayVideo || !videoRef.current) {
      return;
    }

    setIsPlaying(true);
    void videoRef.current.play().catch(() => {
      setIsPlaying(false);
    });
  };

  const pauseVideo = (reset = false) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.pause();

    if (reset) {
      video.currentTime = 0;
    }

    setIsPlaying(false);
  };

  const isDesktopPointer = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <button
      type="button"
      aria-label={item.name}
      disabled={!canPlayVideo}
      className={`group/media absolute inset-0 block h-full w-full overflow-hidden text-left disabled:cursor-default ${wrapperClassName}`}
      onClick={() => {
        if (!canPlayVideo || isDesktopPointer()) {
          return;
        }

        if (isPlaying) {
          pauseVideo(false);
        } else {
          playVideo();
        }
      }}
      onMouseEnter={() => {
        if (isDesktopPointer()) {
          playVideo();
        }
      }}
      onMouseLeave={() => {
        if (isDesktopPointer()) {
          pauseVideo(true);
        }
      }}
    >
      <Image
        src={posterUrl}
        alt={item.name}
        fill
        sizes={sizes}
        priority={priority}
        className={[
          imageClassName,
          "transition-all duration-700",
          canPlayVideo && isPlaying
            ? "scale-[1.08] opacity-0"
            : "opacity-100 group-hover/media:scale-[1.04]",
        ].join(" ")}
      />
      {canPlayVideo ? (
        <video
          ref={videoRef}
          src={item.videoUrl ?? undefined}
          poster={posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className={[
            "absolute inset-0 h-full w-full object-cover transition-all duration-700",
            isPlaying ? "scale-[1.08] opacity-100" : "scale-100 opacity-0",
          ].join(" ")}
          onError={() => {
            setHasVideoError(true);
            setIsPlaying(false);
          }}
        />
      ) : null}
      {canPlayVideo ? (
        <span
          className={[
            "pointer-events-none absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white shadow-[0_16px_34px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-300",
            isPlaying ? "scale-95 opacity-0" : "scale-100 opacity-100",
          ].join(" ")}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current stroke-[1.8]" />
          ) : (
            <Play className="h-4 w-4 fill-current stroke-[1.8]" />
          )}
        </span>
      ) : null}
    </button>
  );
}

function RestaurantMenuShowcase({
  categories,
}: {
  categories: PublicRestaurantMenuCategory[];
}) {
  const locale = useLocale() as "de" | "en";
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  if (!categories.length) {
    return null;
  }

  const activeCategory =
    categories.find((category) => category.slug === activeSlug) ?? categories[0];
  const featuredItem =
    activeCategory.items.find((item) => item.isSignature) ?? activeCategory.items[0];
  const supportingItems = activeCategory.items.filter(
    (item) => item.id !== featuredItem?.id
  );
  const activeCategoryIndex = Math.max(
    categories.findIndex((category) => category.slug === activeCategory.slug),
    0
  );
  const priceFormatter = new Intl.NumberFormat(locale === "en" ? "en-US" : "de-DE", {
    currency: "EUR",
    style: "currency",
  });
  const copy =
    locale === "en"
      ? {
          badge: "Menu · April 2026",
          title: "Seasonal dishes with",
          titleEmphasis: "Waldschlösschen character",
          text:
            "A modern view into our current restaurant menu: asparagus season, regional classics, crisp flammkuchen and desserts from the Waldschlösschen kitchen.",
          signature: "Recommendation",
          vegetarian: "Vegetarian",
          allergens: "Allergens",
          fromPdf: "From the current house menu",
          categoryLabel: "Menu category",
          categoryHint: "Choose what you would like to explore",
        }
      : {
          badge: "Speisekarte · April 2026",
          title: "Saisonale Gerichte mit",
          titleEmphasis: "Waldschlösschen Charakter",
          text:
            "Ein moderner Blick in unsere aktuelle Karte: Spargelzeit, regionale Klassiker, krosse Flammkuchen und Desserts aus der Waldschlösschen-Küche.",
          signature: "Empfehlung",
          vegetarian: "Vegetarisch",
          allergens: "Allergene",
          fromPdf: "Aus der aktuellen Hauskarte",
          categoryLabel: "Menükategorie",
          categoryHint: "Wählen Sie, worauf Sie gerade Lust haben",
        };
  const formatPrice = (price: number) => priceFormatter.format(price);
  const formatItemCount = (count: number) =>
    locale === "en"
      ? `${count} ${count === 1 ? "item" : "items"}`
      : `${count} ${count === 1 ? "Position" : "Positionen"}`;
  const renderPrice = (
    item: PublicRestaurantMenuCategory["items"][number],
    compact = false
  ) => {
    if (item.priceVariants.length) {
      return (
        <div
          className={[
            "flex flex-wrap items-center gap-2",
            compact ? "justify-end" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {item.priceVariants.map((variant) => (
            <span
              key={`${variant.label}-${variant.price}`}
              className={[
                "inline-flex items-center gap-2 rounded-full border border-white/[0.16] bg-black/[0.28] backdrop-blur-md",
                compact
                  ? "min-h-9 px-3 text-xs"
                  : "min-h-12 px-4 text-sm sm:text-base",
              ].join(" ")}
            >
              <span className="text-white/[0.58]">{variant.label}</span>
              <span className="font-medium text-white">{formatPrice(variant.price)}</span>
            </span>
          ))}
        </div>
      );
    }

    return (
      <span
        className={[
          "inline-flex items-center justify-center rounded-full border border-white/[0.16] bg-black/[0.28] font-medium text-white backdrop-blur-md",
          compact ? "min-h-9 px-3 text-sm" : "min-h-12 px-4 text-xl",
        ].join(" ")}
      >
        {formatPrice(item.price)}
      </span>
    );
  };

  return (
    <section
      id="speisekarte"
      className="relative overflow-hidden bg-[#15120f] px-[clamp(1.25rem,5vw,6rem)] py-[clamp(5rem,10vw,9rem)] text-white"
    >
      <div className="absolute inset-0 opacity-[0.18]">
        <Image
          src="/restaurant_room_1920w.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,177,111,0.24),transparent_32%),linear-gradient(180deg,rgba(21,18,15,0.72)_0%,#15120f_72%)]" />

      <div className="relative z-[1] mx-auto max-w-[1480px]">
        <Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.58fr)] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.08] px-4 py-2 text-xs font-medium text-[#f2d49b] backdrop-blur-md">
                <ChefHat className="h-4 w-4 stroke-[1.7]" />
                {copy.badge}
              </div>
              <h2 className="mt-6 max-w-[760px] font-[var(--font-display)] text-[clamp(2.4rem,5.6vw,5.2rem)] leading-[0.92] text-white">
                {copy.title} <em>{copy.titleEmphasis}</em>
              </h2>
            </div>
            <p className="max-w-[620px] text-base font-light leading-relaxed text-white/72 lg:text-lg">
              {copy.text}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 space-y-4">
            <div className="sm:hidden">
              <div className="overflow-hidden rounded-[1.6rem] border border-[#f2d49b]/[0.22] bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.055))] p-3 shadow-[0_22px_54px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <button
                  type="button"
                  aria-expanded={mobileCategoriesOpen}
                  onClick={() => setMobileCategoriesOpen((open) => !open)}
                  className="flex min-h-16 w-full items-center justify-between gap-4 rounded-[1.25rem] border border-white/[0.12] bg-[#211b16]/[0.92] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.58rem] font-medium uppercase text-[#f2d49b]">
                      {copy.categoryLabel}
                    </span>
                    <span className="mt-1 block break-words text-[1rem] font-medium leading-tight text-white">
                      {activeCategory.title}
                    </span>
                  </span>
                  <span
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f2d49b]/[0.22] bg-[#f2d49b]/[0.12] text-[#f2d49b] transition-transform duration-300",
                      mobileCategoriesOpen ? "rotate-180" : "",
                    ].join(" ")}
                  >
                    <ChevronDown className="h-4 w-4 stroke-[2]" />
                  </span>
                </button>

                {mobileCategoriesOpen ? (
                  <div className="mt-3 rounded-[1.25rem] border border-white/[0.1] bg-[#17120f]/[0.92] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <p className="px-3 pb-2 pt-1 text-xs font-light leading-relaxed text-white/[0.48]">
                      {copy.categoryHint}
                    </p>
                    <div className="max-h-[54vh] space-y-1 overflow-y-auto pr-1 [scrollbar-color:#d8bd84_transparent] [scrollbar-width:thin]">
                      {categories.map((category) => {
                        const active = category.slug === activeCategory.slug;

                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                              setActiveSlug(category.slug);
                              setMobileCategoriesOpen(false);
                            }}
                            className={[
                              "flex min-h-12 w-full items-center justify-between gap-3 rounded-[1rem] px-3 py-2.5 text-left text-sm font-medium leading-tight transition-all duration-300",
                              active
                                ? "bg-[#d8bd84] text-[#17120d] shadow-[0_14px_28px_rgba(216,189,132,0.2)]"
                                : "text-white/[0.78] hover:bg-white/[0.07] hover:text-white",
                            ].join(" ")}
                          >
                            <span className="min-w-0 break-words">{category.title}</span>
                            {active ? (
                              <Check className="h-4 w-4 shrink-0 stroke-[2.2]" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="hidden flex-wrap gap-3 rounded-[1.6rem] border border-white/[0.1] bg-black/[0.16] p-2 backdrop-blur-md sm:flex lg:hidden">
              {categories.map((category) => {
                const active = category.slug === activeCategory.slug;

                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveSlug(category.slug)}
                    className={[
                      "inline-flex min-h-12 max-w-full items-center justify-center rounded-full border px-4 text-center text-sm font-medium leading-tight transition-all duration-300 md:px-5",
                      active
                        ? "border-[#d8bd84] bg-[#d8bd84] text-[#17120d] shadow-[0_18px_36px_rgba(216,189,132,0.24)]"
                        : "border-white/[0.12] bg-white/[0.07] text-white/72 backdrop-blur-md hover:border-white/[0.26] hover:text-white",
                    ].join(" ")}
                  >
                    {category.title}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 hidden grid-cols-[minmax(270px,0.32fr)_minmax(0,1fr)] gap-6 lg:grid xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-8">
          <Reveal delay={0.14} className="h-full">
            <aside className="sticky top-28 overflow-hidden rounded-[1.9rem] border border-white/[0.11] bg-[#211a14]/[0.78] p-3 shadow-[0_28px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <div className="px-3 pb-4 pt-2">
                <div className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#f2d49b]">
                  {copy.categoryLabel}
                </div>
                <p className="mt-2 text-sm font-light leading-relaxed text-white/[0.58]">
                  {copy.categoryHint}
                </p>
              </div>

              <div className="max-h-[calc(100vh-230px)] space-y-1.5 overflow-y-auto pr-1 [scrollbar-color:#d8bd84_transparent] [scrollbar-width:thin]">
                {categories.map((category, index) => {
                  const active = category.slug === activeCategory.slug;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveSlug(category.slug)}
                      className={[
                        "group/menu relative flex min-h-[4.4rem] w-full items-center gap-3 rounded-[1.25rem] px-3.5 py-3 text-left transition-all duration-300",
                        active
                          ? "bg-[#d8bd84] text-[#17120d] shadow-[0_18px_38px_rgba(216,189,132,0.22)]"
                          : "text-white/72 hover:bg-white/[0.075] hover:text-white",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-300",
                          active
                            ? "border-[#17120d]/10 bg-[#17120d]/10 text-[#17120d]"
                            : "border-white/[0.1] bg-white/[0.045] text-[#f2d49b]",
                        ].join(" ")}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-sm font-medium leading-tight">
                          {category.title}
                        </span>
                        <span
                          className={[
                            "mt-1 block text-xs font-light",
                            active ? "text-[#17120d]/60" : "text-white/[0.42]",
                          ].join(" ")}
                        >
                          {formatItemCount(category.items.length)}
                        </span>
                      </span>
                      {active ? (
                        <Check className="h-4 w-4 shrink-0 stroke-[2.2]" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </aside>
          </Reveal>

          <div className="min-w-0 space-y-6">
            {featuredItem ? (
              <Reveal delay={0.18}>
                <article className="overflow-hidden rounded-[2.15rem] border border-white/[0.12] bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.055))] shadow-[0_34px_92px_rgba(0,0,0,0.31)] backdrop-blur-xl">
                  <div className="grid min-h-[520px] xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
                    <div className="relative min-h-[520px] overflow-hidden bg-[#2b241c]">
                      <RestaurantMenuMedia
                        key={featuredItem.id}
                        item={featuredItem}
                        sizes="(max-width: 1280px) 62vw, 46vw"
                        wrapperClassName=""
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,6,0.04)_0%,rgba(10,8,6,0.16)_45%,rgba(10,8,6,0.58)_100%)]" />
                      <div className="pointer-events-none absolute left-6 top-6 inline-flex max-w-[calc(100%-3rem)] items-center gap-2 rounded-full border border-[#f2d49b]/[0.28] bg-[#15120f]/[0.48] px-4 py-2 text-xs font-medium text-[#ffe7b2] backdrop-blur-md">
                        {featuredItem.isSignature ? (
                          <Sparkles className="h-3.5 w-3.5 shrink-0 stroke-[1.8]" />
                        ) : (
                          <ChefHat className="h-3.5 w-3.5 shrink-0 stroke-[1.8]" />
                        )}
                        <span className="min-w-0 truncate">
                          {featuredItem.isSignature ? copy.signature : activeCategory.title}
                        </span>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-col justify-between p-8 xl:p-10">
                      <div>
                        <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-[#f2d49b]">
                          <span>{String(activeCategoryIndex + 1).padStart(2, "0")}</span>
                          <span className="h-1 w-1 rounded-full bg-[#f2d49b]/60" />
                          <span>{activeCategory.title}</span>
                        </div>

                        <h3 className="mt-7 break-words font-[var(--font-display)] text-[clamp(3rem,4.5vw,4.75rem)] leading-[0.88] text-white">
                          {featuredItem.name}
                        </h3>

                        {featuredItem.description ? (
                          <p className="mt-6 max-w-[620px] text-base font-light leading-relaxed text-white/[0.68] xl:text-lg">
                            {featuredItem.description}
                          </p>
                        ) : null}

                        <div className="mt-6 flex flex-wrap gap-2">
                          {featuredItem.isSignature ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#f2d49b]/30 bg-[#f2d49b]/[0.14] px-3 py-1.5 text-xs font-medium text-[#ffe7b2]">
                              <Sparkles className="h-3.5 w-3.5 stroke-[1.8]" />
                              {copy.signature}
                            </span>
                          ) : null}
                          {featuredItem.isVegetarian ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#9bc98c]/30 bg-[#9bc98c]/[0.16] px-3 py-1.5 text-xs font-medium text-[#d8f4cc]">
                              <Leaf className="h-3.5 w-3.5 stroke-[1.8]" />
                              {copy.vegetarian}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-10 border-t border-white/[0.1] pt-7">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                          <div>
                            <div className="text-sm font-light text-white/[0.46]">
                              {copy.fromPdf}
                            </div>
                            {featuredItem.allergens ? (
                              <div className="mt-2 text-xs font-light text-white/[0.42]">
                                {copy.allergens}: {featuredItem.allergens}
                              </div>
                            ) : null}
                            {featuredItem.priceNote ? (
                              <div className="mt-2 text-xs font-light text-white/[0.42]">
                                {featuredItem.priceNote}
                              </div>
                            ) : null}
                          </div>
                          <div className="shrink-0">{renderPrice(featuredItem)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ) : null}

            <Reveal delay={0.22}>
              <div className="overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#1b1511]/[0.68] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl xl:p-6">
                <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <div className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[#f2d49b]">
                      {formatItemCount(activeCategory.items.length)}
                    </div>
                    <h3 className="mt-2 break-words font-[var(--font-display)] text-[2.15rem] leading-none text-white">
                      {activeCategory.title}
                    </h3>
                  </div>
                  {activeCategory.description ? (
                    <p className="max-w-[500px] text-sm font-light leading-relaxed text-white/[0.54]">
                      {activeCategory.description}
                    </p>
                  ) : null}
                </div>

                <div className="divide-y divide-white/[0.075]">
                  {supportingItems.map((item, index) => (
                    <article
                      key={item.id}
                      className="group/item grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-5 transition-colors duration-300 hover:bg-white/[0.035] xl:grid-cols-[104px_minmax(0,1fr)] xl:gap-5"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-[1.15rem] bg-[#2b241c]">
                        <RestaurantMenuMedia
                          item={item}
                          sizes="104px"
                          wrapperClassName=""
                          imageClassName="object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_54%,rgba(10,8,6,0.32)_100%)]" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="text-xs font-light text-[#f2d49b]/70">
                                {String(index + 2).padStart(2, "0")}
                              </span>
                              {item.isSignature ? (
                                <span className="rounded-full bg-[#f2d49b]/[0.13] px-2.5 py-1 text-[0.7rem] font-medium text-[#f2d49b]">
                                  {copy.signature}
                                </span>
                              ) : null}
                              {item.isVegetarian ? (
                                <span className="rounded-full bg-[#9bc98c]/[0.13] px-2.5 py-1 text-[0.7rem] font-medium text-[#d8f4cc]">
                                  {copy.vegetarian}
                                </span>
                              ) : null}
                            </div>
                            <h4 className="break-words font-[var(--font-display)] text-[1.7rem] leading-none text-white transition-colors duration-300 group-hover/item:text-[#ffe7b2]">
                              {item.name}
                            </h4>
                            {item.description ? (
                              <p className="mt-3 max-w-[720px] text-sm font-light leading-relaxed text-white/[0.58]">
                                {item.description}
                              </p>
                            ) : null}
                            {item.allergens ? (
                              <div className="mt-3 text-xs font-light text-white/[0.34]">
                                {copy.allergens}: {item.allergens}
                              </div>
                            ) : null}
                            {item.priceNote ? (
                              <div className="mt-2 text-xs font-light text-white/[0.34]">
                                {item.priceNote}
                              </div>
                            ) : null}
                          </div>

                          <div className="shrink-0 xl:max-w-[280px]">
                            {renderPrice(item, true)}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:hidden">
          {featuredItem ? (
            <Reveal delay={0.16}>
              <article className="group relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/[0.12] bg-white/[0.08] shadow-[0_28px_80px_rgba(0,0,0,0.28)] backdrop-blur-md">
                <RestaurantMenuMedia
                  key={featuredItem.id}
                  item={featuredItem}
                  sizes="(max-width: 1280px) 100vw, 42vw"
                  wrapperClassName=""
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,6,0.08)_0%,rgba(10,8,6,0.38)_42%,rgba(10,8,6,0.9)_100%)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {featuredItem.isSignature ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#f2d49b]/30 bg-[#f2d49b]/[0.18] px-3 py-1.5 text-xs font-medium text-[#ffe7b2]">
                        <Sparkles className="h-3.5 w-3.5 stroke-[1.8]" />
                        {copy.signature}
                      </span>
                    ) : null}
                    {featuredItem.isVegetarian ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#9bc98c]/30 bg-[#9bc98c]/[0.16] px-3 py-1.5 text-xs font-medium text-[#d8f4cc]">
                        <Leaf className="h-3.5 w-3.5 stroke-[1.8]" />
                        {copy.vegetarian}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-light text-white/[0.58]">
                        {copy.fromPdf}
                      </div>
                      <h3 className="mt-2 break-words font-[var(--font-display)] text-[clamp(2rem,7vw,3.6rem)] leading-[0.92] text-white">
                        {featuredItem.name}
                      </h3>
                    </div>
                    <div className="shrink-0">
                      {renderPrice(featuredItem)}
                    </div>
                  </div>
                  {featuredItem.description ? (
                    <p className="mt-4 max-w-[680px] text-sm font-light leading-relaxed text-white/72 sm:text-base">
                      {featuredItem.description}
                    </p>
                  ) : null}
                  {featuredItem.allergens ? (
                    <div className="mt-4 text-xs font-light text-white/[0.45]">
                      {copy.allergens}: {featuredItem.allergens}
                    </div>
                  ) : null}
                  {featuredItem.priceNote ? (
                    <div className="mt-2 text-xs font-light text-white/[0.45]">
                      {featuredItem.priceNote}
                    </div>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ) : null}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {supportingItems.map((item, index) => (
              <Reveal key={item.id} delay={0.1 + (index % 6) * 0.04}>
                <article className="group h-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.075] shadow-[0_20px_54px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.18]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#2b241c]">
                    <RestaurantMenuMedia
                      item={item}
                      sizes="(max-width: 768px) 100vw, 30vw"
                      wrapperClassName=""
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(10,8,6,0.48)_100%)]" />
                    <div className="pointer-events-none absolute bottom-3 right-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-[1.2rem] text-white">
                      <BadgeEuro className="h-4 w-4 stroke-[1.8]" />
                      {renderPrice(item, true)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {item.isSignature ? (
                        <span className="rounded-full bg-[#f2d49b]/[0.14] px-3 py-1 text-xs font-medium text-[#f2d49b]">
                          {copy.signature}
                        </span>
                      ) : null}
                      {item.isVegetarian ? (
                        <span className="rounded-full bg-[#9bc98c]/[0.13] px-3 py-1 text-xs font-medium text-[#d8f4cc]">
                          {copy.vegetarian}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="break-words font-[var(--font-display)] text-[1.55rem] leading-none text-white">
                      {item.name}
                    </h3>
                    {item.description ? (
                      <p className="mt-3 text-sm font-light leading-relaxed text-white/[0.62]">
                        {item.description}
                      </p>
                    ) : null}
                    {item.allergens ? (
                      <div className="mt-4 text-xs font-light text-white/[0.36]">
                        {copy.allergens}: {item.allergens}
                      </div>
                    ) : null}
                    {item.priceNote ? (
                      <div className="mt-2 text-xs font-light text-white/[0.36]">
                        {item.priceNote}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
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
export default function RestaurantPageContent({
  menuCategories,
}: {
  menuCategories: PublicRestaurantMenuCategory[];
}) {
  return (
    <main>
      <RestaurantHero />
      <RestaurantIntro />
      <RestaurantCuisine />
      <RestaurantMenuShowcase categories={menuCategories} />
      <RestaurantSpaces />
      <RestaurantGallery />
      <RestaurantHours />
      <RestaurantEvents />
      <RestaurantTestimonials />
      <RestaurantCta />
    </main>
  );
}
