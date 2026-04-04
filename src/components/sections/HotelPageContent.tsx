"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Ban,
  Bike,
  CalendarCheck,
  Car,
  CircleDot,
  Coffee,
  Dog,
  Headset,
  LogOut,
  MapPin,
  Navigation,
  ParkingCircle,
  PawPrint,
  Phone,
  ShowerHead,
  Star,
  Train,
  TreePine,
  Tv,
  Wifi,
  Wind,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import PremiumWaveFrame from "@/components/ui/PremiumWaveFrame";
import { siteConfig } from "@/data/site";

/* ---------- HERO ---------- */
function HotelHero() {
  const t = useTranslations("hotelPage.hero");
  const reveal = {
    initial: { opacity: 0, y: 60, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <PremiumWaveFrame
      src="/hotel_room_1920w.webp"
      alt="Hotelzimmer im Waldschlösschen"
      sizes="100vw"
      priority
      outerClassName="relative flex h-[78vh] min-h-[540px] items-center justify-center overflow-hidden sm:h-[85vh] sm:min-h-[600px]"
      surfaceClassName="events-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-charcoal/36 via-charcoal/12 to-charcoal/78" />}
      afterSheen={<div className="events-hero-shine" aria-hidden="true" />}
    >
      <div className="relative z-10 mx-auto max-w-[920px] px-5 text-center text-white sm:px-8">
        <motion.div
          className="events-hero-kicker mb-6 inline-block max-w-[19rem] text-balance text-[0.58rem] font-normal uppercase leading-[1.85] tracking-[0.2em] sm:mb-8 sm:max-w-none sm:text-[0.7rem] sm:tracking-[0.35em]"
          {...reveal}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="events-hero-kicker-mark mx-2.5 sm:mx-4">-</span>
          {t("badge")}
          <span className="events-hero-kicker-mark mx-2.5 sm:mx-4">-</span>
        </motion.div>

        <motion.h1
          className="events-hero-title heading-display mb-4 text-[clamp(2.2rem,11.2vw,4.9rem)] leading-[0.95] sm:mb-6 sm:text-[clamp(2.85rem,6vw,5rem)]"
          {...reveal}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("title")}
          <br />
          <em>{t("titleEmphasis")}</em>
        </motion.h1>

        <motion.p
          className="events-hero-subtitle mx-auto mb-8 max-w-[23rem] text-[0.94rem] font-light leading-relaxed sm:mb-12 sm:max-w-[720px] sm:text-[clamp(0.95rem,1.5vw,1.15rem)]"
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
          <a href="#buchen" className="btn-primary w-full sm:w-auto">{t("ctaBook")}</a>
          <a href="#zimmer" className="btn-outline-light w-full sm:w-auto">{t("ctaRooms")}</a>
        </motion.div>
      </div>
    </PremiumWaveFrame>
  );
}

/* ---------- INTRO ---------- */
function HotelIntro() {
  const t = useTranslations("hotelPage.intro");

  const facts = [
    { value: String(siteConfig.rooms), label: t("stats.rooms") },
    { value: "9.1", label: t("stats.rating") },
    { value: "100%", label: t("stats.recommendation") },
    { value: "3*", label: t("stats.classification") },
  ];

  return (
    <section className="voucher-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="voucher-orb voucher-orb-left" />
      <div className="voucher-orb voucher-orb-right" />

      <div className="relative z-[1] mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-[clamp(3rem,6vw,8rem)] lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <PremiumWaveFrame
            src="/Foyer_1920w.webp"
            alt="Foyer des Hotel Waldschlösschen"
            sizes="(max-width: 1024px) 100vw, 48vw"
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
            <p className="body-text max-w-[640px]">{t("text1")}</p>
            <p className="body-text mt-5 max-w-[640px]">{t("text2")}</p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {facts.map((fact) => (
                <div key={fact.label} className="testimonial-card group h-full">
                  <div className="testimonial-card-surface min-h-0 p-5 sm:p-6">
                    <div className="relative z-[1] font-[var(--font-display)] text-[2rem] font-light leading-none text-charcoal sm:text-[2.25rem]">
                      {fact.value}
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

/* ---------- ROOMS ---------- */
function HotelRooms() {
  const t = useTranslations("hotelPage.rooms");
  const tAmenities = useTranslations("hotelPage.amenities");
  const tCta = useTranslations("hotelPage.cta");

  const roomTypes = [
    {
      titleKey: "singleTitle" as const,
      priceKey: "singlePrice" as const,
      descKey: "singleDesc" as const,
      image: "/hotel_room_1920w.webp",
      features: ["wifi", "bathroom", "breakfast", "nosmoking"] as const,
    },
    {
      titleKey: "doubleTitle" as const,
      priceKey: "doublePrice" as const,
      descKey: "doubleDesc" as const,
      image: "/library_room_1920w.webp",
      features: ["wifi", "bathroom", "view", "breakfast"] as const,
    },
  ];

  return (
    <section
      id="zimmer"
      className="bg-sand-light py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]"
    >
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
          {roomTypes.map((room, index) => (
            <Reveal key={room.titleKey} delay={index * 0.12}>
              <div className="overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white shadow-[0_24px_70px_rgba(22,18,12,0.08)]">
                <PremiumWaveFrame
                  src={room.image}
                  alt={t(room.titleKey)}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  outerClassName="relative"
                  surfaceClassName="relative aspect-[5/4] overflow-hidden sm:aspect-[16/10]"
                  imageClassName="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  beforeSheen={<div className="absolute inset-0 bg-gradient-to-t from-charcoal/62 via-charcoal/10 to-transparent" />}
                  afterSheen={
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_14%,rgba(214,180,120,0.22),transparent_36%)]" />
                      <div className="absolute right-4 top-4 rounded-full border border-white/18 bg-black/24 px-4 py-2.5 text-center backdrop-blur-sm sm:right-5 sm:top-5">
                        <div className="font-[var(--font-display)] text-lg font-normal text-white sm:text-[1.25rem]">
                          {t(room.priceKey)}
                        </div>
                        <div className="mt-0.5 text-[0.56rem] font-medium uppercase tracking-[0.14em] text-white/64">
                          {t("priceUnit")}
                        </div>
                      </div>
                    </>
                  }
                />

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="font-[var(--font-display)] text-[1.8rem] font-normal text-charcoal sm:text-[2rem]">
                    {t(room.titleKey)}
                  </h3>
                  <p className="body-text mt-3">{t(room.descKey)}</p>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {room.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-charcoal/10 bg-sand-light/85 px-3.5 py-2 text-[0.66rem] font-medium uppercase tracking-[0.12em] text-text-secondary"
                      >
                        {tAmenities(feature)}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#buchen"
                    className="mt-8 inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-gold transition-all duration-300 hover:gap-3"
                  >
                    {tCta("ctaBook")}
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.26}>
          <p className="mx-auto mt-10 max-w-[760px] text-center text-sm font-light leading-relaxed text-text-muted">
            {t("priceNote")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- AMENITIES ---------- */
function HotelAmenities() {
  const t = useTranslations("hotelPage.amenities");

  const amenities = [
    { key: "wifi" as const, Icon: Wifi },
    { key: "tv" as const, Icon: Tv },
    { key: "phone" as const, Icon: Phone },
    { key: "bathroom" as const, Icon: ShowerHead },
    { key: "hairdryer" as const, Icon: Wind },
    { key: "mirror" as const, Icon: CircleDot },
    { key: "nosmoking" as const, Icon: Ban },
    { key: "view" as const, Icon: TreePine },
    { key: "parking" as const, Icon: Car },
    { key: "bicycle" as const, Icon: Bike },
    { key: "breakfast" as const, Icon: Coffee },
    { key: "pets" as const, Icon: Dog },
  ];

  return (
    <section className="events-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] text-white">
      <div className="events-orb events-orb-right" />
      <div className="events-orb events-orb-left" />

      <div className="relative z-10 mx-auto max-w-[1280px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-white">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mx-auto mb-8" />
            <p className="mx-auto max-w-[620px] text-[1rem] font-light leading-relaxed text-white/72">
              {t("text")}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {amenities.map((amenity, index) => (
            <Reveal key={amenity.key} delay={(index % 4) * 0.08}>
              <div className="events-card group h-full">
                <div className="events-card-surface h-full">
                  <div className="events-card-glow" />
                  <span className="events-card-icon">
                    <amenity.Icon className="h-5 w-5 text-gold-light stroke-[1.5]" />
                  </span>
                  <h3 className="events-card-title text-[1.08rem] leading-snug md:text-[1.2rem]">
                    {t(amenity.key)}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- GALLERY ---------- */
function HotelGallery() {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("hotelPage.gallery");

  const images = [
    {
      src: "/Foyer_1920w.webp",
      alt: {
        de: "Foyer mit historischer Glasdecke",
        en: "Foyer with historic glass ceiling",
      },
      title: {
        de: "Foyer & Glasdecke",
        en: "Foyer & glass ceiling",
      },
      className: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
      aspect: "aspect-[5/4] sm:aspect-[16/10] lg:h-full lg:min-h-[520px] lg:aspect-auto",
    },
    {
      src: "/library_room_1920w.webp",
      alt: {
        de: "Bibliothek und Lesezimmer",
        en: "Library and reading room",
      },
      title: {
        de: "Bibliothek",
        en: "Library",
      },
      className: "",
      aspect: "aspect-[5/4] sm:aspect-[4/3]",
    },
    {
      src: "/hotel_room_1920w.webp",
      alt: {
        de: "Doppelzimmer im Hotel",
        en: "Double room in the hotel",
      },
      title: {
        de: "Zimmer",
        en: "Rooms",
      },
      className: "",
      aspect: "aspect-[5/4] sm:aspect-[4/3]",
    },
    {
      src: "/Schachtstube_mural_1920w.webp",
      alt: {
        de: "Historische Schachtstube",
        en: "Historic Schachtstube",
      },
      title: {
        de: "Historische Details",
        en: "Historic details",
      },
      className: "",
      aspect: "aspect-[5/4] sm:aspect-[4/3]",
    },
    {
      src: "/restaurant_terrace_1920w.webp",
      alt: {
        de: "Terrasse mit Blick ins Grune",
        en: "Terrace with a green view",
      },
      title: {
        de: "Sonnenterrasse",
        en: "Sun terrace",
      },
      className: "",
      aspect: "aspect-[5/4] sm:aspect-[4/3]",
    },
    {
      src: "/landscape_restaurant_1920w.webp",
      alt: {
        de: "Landschaft in Saale-Unstrut",
        en: "Landscape in Saale-Unstrut",
      },
      title: {
        de: "Saale-Unstrut",
        en: "Saale-Unstrut",
      },
      className: "",
      aspect: "aspect-[5/4] sm:aspect-[4/3]",
    },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <Reveal key={image.src} delay={(index % 3) * 0.08} className={image.className}>
              <PremiumWaveFrame
                src={image.src}
                alt={image.alt[locale]}
                sizes="(max-width: 1024px) 100vw, 33vw"
                outerClassName={`spaces-card relative cursor-pointer ${image.aspect}`}
                surfaceClassName="spaces-card-surface"
                imageClassName="object-cover brightness-[0.84] transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-[0.7]"
                beforeSheen={<div className="spaces-card-glow" />}
                afterSheen={
                  <div className="spaces-card-overlay flex items-end p-6 sm:p-7">
                    <div className="relative z-[1]">
                      <span className="mb-2 block text-[0.58rem] font-medium uppercase tracking-[0.16em] text-gold-light">
                        {t("label")}
                      </span>
                      <h3 className="font-[var(--font-display)] text-[1.45rem] font-normal text-white sm:text-[1.7rem]">
                        {image.title[locale]}
                      </h3>
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

/* ---------- BREAKFAST ---------- */
function HotelBreakfast() {
  const t = useTranslations("hotelPage.breakfast");

  return (
    <section className="voucher-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="voucher-orb voucher-orb-left" />
      <div className="voucher-orb voucher-orb-right" />

      <div className="relative z-[1] mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-[clamp(3rem,6vw,8rem)] lg:grid-cols-[1.02fr_0.98fr]">
        <Reveal delay={0.15}>
          <div className="voucher-content-panel">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mb-8" />
            <p className="body-text max-w-[620px]">{t("text")}</p>

            <div className="mt-8 max-w-[460px] testimonial-card">
              <div className="testimonial-card-surface min-h-0 overflow-hidden p-0">
                <div className="border-b border-sand px-6 py-5 sm:px-7">
                  <h3 className="font-[var(--font-display)] text-[1.35rem] font-normal text-charcoal">
                    {t("scheduleTitle")}
                  </h3>
                </div>
                <div className="px-6 py-5 sm:px-7">
                  <div className="flex items-center justify-between gap-6 border-b border-sand py-3 text-sm font-light text-text-secondary">
                    <span>{t("weekday")}</span>
                    <span className="font-medium text-charcoal">{t("weekdayTime")}</span>
                  </div>
                  <div className="flex items-center justify-between gap-6 py-3 text-sm font-light text-text-secondary">
                    <span>{t("weekend")}</span>
                    <span className="font-medium text-charcoal">{t("weekendTime")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <PremiumWaveFrame
            src="/restaurant_room_1920w.webp"
            alt="Frühstücksraum im Waldschlösschen"
            sizes="(max-width: 1024px) 100vw, 48vw"
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
      </div>
    </section>
  );
}

/* ---------- LOCATION ---------- */
function HotelLocation() {
  const t = useTranslations("hotelPage.location");

  const locationFacts = [
    { key: "arche" as const, Icon: MapPin },
    { key: "radweg" as const, Icon: Bike },
    { key: "bahn" as const, Icon: Train },
    { key: "autobahn" as const, Icon: Navigation },
  ];

  return (
    <section className="events-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] text-white">
      <div className="events-orb events-orb-right" />
      <div className="events-orb events-orb-left" />

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-[clamp(3rem,6vw,8rem)] lg:grid-cols-[0.98fr_1.02fr]">
        <Reveal delay={0.18}>
          <div>
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-white">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mb-8" />
            <p className="max-w-[620px] text-[1rem] font-light leading-relaxed text-white/74 sm:text-[1.05rem]">
              {t("text")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {locationFacts.map((fact) => (
                <div
                  key={fact.key}
                  className="rounded-[1.65rem] border border-white/10 bg-white/[0.04] px-5 py-5 backdrop-blur-sm transition-all duration-300 hover:border-gold/28 hover:bg-white/[0.06]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
                      <fact.Icon className="h-5 w-5 text-gold-light stroke-[1.5]" />
                    </div>
                    <span className="pt-1 text-sm font-light leading-relaxed text-white/80">
                      {t(fact.key)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <PremiumWaveFrame
            src="/landscape_restaurant_1920w.webp"
            alt="Landschaft rund um das Hotel Waldschlösschen"
            sizes="(max-width: 1024px) 100vw, 48vw"
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
      </div>
    </section>
  );
}

/* ---------- CHECKIN INFO ---------- */
function HotelCheckin() {
  const t = useTranslations("hotelPage.checkin");

  const infoRows = [
    { labelKey: "checkinLabel" as const, valueKey: "checkinTime" as const, Icon: CalendarCheck },
    { labelKey: "checkoutLabel" as const, valueKey: "checkoutTime" as const, Icon: LogOut },
    { labelKey: "receptionLabel" as const, valueKey: "receptionTime" as const, Icon: Headset },
    { labelKey: "petsLabel" as const, valueKey: "petsInfo" as const, Icon: PawPrint },
    { labelKey: "parkingLabel" as const, valueKey: "parkingInfo" as const, Icon: ParkingCircle },
  ];

  return (
    <section className="bg-sand-light py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {infoRows.map((row, index) => (
            <Reveal key={row.labelKey} delay={(index % 5) * 0.08}>
              <div className="testimonial-card group h-full">
                <div className="testimonial-card-surface min-h-[220px] p-6 sm:min-h-[240px] sm:p-7">
                  <div className="relative z-[1] mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sand-light shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-500 group-hover:bg-gold/10">
                    <row.Icon className="h-5 w-5 text-gold stroke-[1.5]" />
                  </div>
                  <div className="relative z-[1] text-[0.68rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                    {t(row.labelKey)}
                  </div>
                  <div className="relative z-[1] mt-3 font-[var(--font-display)] text-[1.45rem] font-normal leading-snug text-charcoal">
                    {t(row.valueKey)}
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

/* ---------- TESTIMONIALS ---------- */
function HotelTestimonials() {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("hotelPage.testimonials");

  const reviews = [
    {
      text: {
        de: "Sehr ruhige Lage, liebevolle Ausstattung der Zimmer, hervorragende Matratzenqualität. Kommt ganz klar auf meine Favoritenliste.",
        en: "Very quiet location, lovingly furnished rooms, outstanding mattress quality. Definitely going on my favorites list.",
      },
      author: { de: "Radtourist", en: "Cycling tourist" },
      source: "HRS · 9.1 / 10",
    },
    {
      text: {
        de: "Geräumiges Zimmer, ruhig gelegen, fast direkt neben der Arche Nebra. Sehr nettes Personal.",
        en: "Spacious room, quietly located, almost directly next to the Arche Nebra. Very friendly staff.",
      },
      author: { de: "Paar", en: "Couple" },
      source: "Booking.com · 8.5 / 10",
    },
    {
      text: {
        de: "Das Hotel bietet eine sehr gute Rundumversorgung: bequemes Zimmer, freundliches Personal, solide Küche. Perfekte Lage für die Arche Nebra.",
        en: "The hotel offers excellent all-round service: comfortable room, friendly staff, solid cuisine. Perfect location for the Arche Nebra.",
      },
      author: { de: "Kulturreisende", en: "Cultural traveller" },
      source: "Booking.com",
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {reviews.map((review, index) => (
            <Reveal key={index} delay={index * 0.1}>
              <div className="testimonial-card group h-full">
                <div className="testimonial-card-surface">
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star key={starIndex} className="inline-block h-3.5 w-3.5 fill-gold stroke-gold" />
                    ))}
                  </div>

                  <p className="testimonial-quote">"{review.text[locale]}"</p>

                  <div className="testimonial-meta">
                    <div className="text-xs font-medium text-text-secondary">{review.author[locale]}</div>
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

/* ---------- CTA ---------- */
function HotelCta() {
  const t = useTranslations("hotelPage.cta");

  return (
    <PremiumWaveFrame
      src="/landscape_restaurant_1920w.webp"
      alt="Landschaft Saale-Unstrut"
      sizes="100vw"
      outerClassName="relative overflow-hidden py-[clamp(5rem,11vw,10rem)] px-[clamp(1.25rem,5vw,6rem)] text-center text-white"
      surfaceClassName="events-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-forest/84 to-forest/92" />}
      afterSheen={<div className="events-hero-shine events-hero-shine-soft" aria-hidden="true" />}
    >
      <Reveal>
        <div className="relative z-10 mx-auto max-w-[720px]" id="buchen">
          <span className="events-hero-kicker label-caps inline-block max-w-[19rem] text-balance text-gold-light leading-[1.8] tracking-[0.2em] sm:max-w-none sm:tracking-[0.3em]">
            {t("label")}
          </span>
          <h2 className="events-hero-title heading-display mt-5 mb-5 text-[clamp(1.95rem,8.2vw,3.8rem)] text-white sm:mb-6 sm:text-[clamp(2.2rem,4.5vw,3.8rem)]">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <p className="events-hero-subtitle mb-8 text-[0.98rem] font-light leading-relaxed sm:mb-12 sm:text-lg">
            {t("text")}
          </p>
          <div className="mx-auto flex max-w-[18rem] flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary w-full sm:w-auto">{t("ctaBook")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light w-full sm:w-auto">{t("ctaContact")}</a>
          </div>
        </div>
      </Reveal>
    </PremiumWaveFrame>
  );
}

/* ---------- MAIN EXPORT ---------- */
export default function HotelPageContent() {
  return (
    <main className="overflow-hidden">
      <HotelHero />
      <HotelIntro />
      <HotelRooms />
      <HotelAmenities />
      <HotelGallery />
      <HotelBreakfast />
      <HotelLocation />
      <HotelCheckin />
      <HotelTestimonials />
      <HotelCta />
    </main>
  );
}
