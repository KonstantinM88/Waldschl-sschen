"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Wifi,
  Tv,
  Phone,
  ShowerHead,
  Wind,
  CircleDot,
  Ban,
  TreePine,
  Car,
  Bike,
  Coffee,
  Dog,
  MapPin,
  Train,
  Navigation,
  Clock,
  CalendarCheck,
  LogOut,
  Headset,
  PawPrint,
  ParkingCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

/* ---------- HERO ---------- */
function HotelHero() {
  const t = useTranslations("hotelPage.hero");

  const reveal = {
    initial: { opacity: 0, y: 60, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hotel_room_1920w.webp"
          alt="Hotelzimmer im Waldschlösschen"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/10 to-charcoal/70" />
      </div>

      <div className="relative z-10 text-center text-white px-8 max-w-[900px]">
        <motion.div
          className="inline-block text-[0.7rem] font-normal tracking-[0.35em] uppercase text-gold-light mb-8"
          {...reveal}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="opacity-50 mx-4">—</span>
          {t("badge")}
          <span className="opacity-50 mx-4">—</span>
        </motion.div>

        <motion.h1
          className="heading-display text-[clamp(2.8rem,6vw,5rem)] mb-6"
          {...reveal}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("title")}
          <br />
          <em className="text-gold-light">{t("titleEmphasis")}</em>
        </motion.h1>

        <motion.p
          className="text-[clamp(0.95rem,1.5vw,1.15rem)] font-light leading-relaxed opacity-85 max-w-[620px] mx-auto mb-12"
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
          <a href="#buchen" className="btn-primary">{t("ctaBook")}</a>
          <a href="#zimmer" className="btn-outline-light">{t("ctaRooms")}</a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- INTRO ---------- */
function HotelIntro() {
  const t = useTranslations("hotelPage.intro");

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <Image
                src="/Foyer_1920w.webp"
                alt="Foyer des Hotel Waldschlösschen"
                fill
                className="object-cover hover:scale-[1.03] transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
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

          {/* Quick Facts */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { num: "24", label: "Zimmer" },
              { num: "9.1", label: "Bewertung" },
              { num: "100%", label: "Empfehlung" },
              { num: "3★", label: "Klassifizierung" },
            ].map((fact) => (
              <div
                key={fact.label}
                className="p-5 bg-sand-light text-center"
              >
                <div className="font-[var(--font-display)] text-3xl font-light text-charcoal">
                  {fact.num}
                </div>
                <div className="text-xs font-medium tracking-[0.12em] uppercase text-text-muted mt-1">
                  {fact.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- ROOMS ---------- */
function HotelRooms() {
  const t = useTranslations("hotelPage.rooms");

  const roomTypes = [
    {
      titleKey: "singleTitle" as const,
      priceKey: "singlePrice" as const,
      descKey: "singleDesc" as const,
      image: "/hotel_room_1920w.webp",
    },
    {
      titleKey: "doubleTitle" as const,
      priceKey: "doublePrice" as const,
      descKey: "doubleDesc" as const,
      image: "/library_room_1920w.webp",
    },
  ];

  return (
    <section
      className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light"
      id="zimmer"
    >
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {roomTypes.map((room, i) => (
            <Reveal key={room.titleKey} delay={i * 0.15}>
              <div className="group bg-white overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-shadow duration-500">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={room.image}
                    alt={t(room.titleKey)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-5 py-3 text-center">
                    <div className="font-[var(--font-display)] text-xl font-medium text-charcoal">
                      {t(room.priceKey)}
                    </div>
                    <div className="text-[0.6rem] tracking-[0.12em] uppercase text-text-muted mt-0.5">
                      pro Nacht
                    </div>
                  </div>
                </div>
                <div className="p-8 lg:p-10">
                  <h3 className="font-[var(--font-display)] text-2xl font-medium text-charcoal mb-3">
                    {t(room.titleKey)}
                  </h3>
                  <p className="body-text">{t(room.descKey)}</p>
                  <div className="flex items-center gap-4 mt-6 text-text-muted">
                    <Wifi className="w-4 h-4" />
                    <Tv className="w-4 h-4" />
                    <ShowerHead className="w-4 h-4" />
                    <Coffee className="w-4 h-4" />
                    <TreePine className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="text-center text-sm font-light text-text-muted mt-10 max-w-[700px] mx-auto leading-relaxed">
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
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="body-text mx-auto max-w-[560px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, i) => (
            <Reveal key={amenity.key} delay={(i % 4) * 0.08}>
              <div className="group flex flex-col items-center gap-4 p-6 bg-sand-light hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500 text-center">
                <div className="w-12 h-12 rounded-full bg-white group-hover:bg-gold/10 flex items-center justify-center transition-colors duration-500">
                  <amenity.Icon className="w-5 h-5 text-gold stroke-[1.5]" />
                </div>
                <span className="text-sm font-light text-text-secondary leading-snug">
                  {t(amenity.key)}
                </span>
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
  const images = [
    { src: "/Foyer_1920w.webp", alt: "Foyer mit historischer Glasdecke", span: "col-span-2 row-span-2" },
    { src: "/library_room_1920w.webp", alt: "Bibliothek & Lesezimmer", span: "col-span-1" },
    { src: "/hotel_room_1920w.webp", alt: "Doppelzimmer", span: "col-span-1" },
    { src: "/Schachtstube_mural_1920w.webp", alt: "Schachtstube mit historischem Wandgemälde", span: "col-span-1 row-span-2" },
    { src: "/restaurant_terrace_1920w.webp", alt: "Terrasse mit Blick ins Grüne", span: "col-span-1" },
    { src: "/landscape_restaurant_1920w.webp", alt: "Landschaft Saale-Unstrut", span: "col-span-1" },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-charcoal">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold-light">Impressionen</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5">
              Ein Blick in unser <em>Haus</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <Reveal
              key={img.src}
              delay={(i % 3) * 0.1}
              className={`${img.span} ${img.span.includes("row-span-2") ? "min-h-[400px] lg:min-h-[500px]" : "min-h-[200px] lg:min-h-[240px]"}`}
            >
              <div className="group relative w-full h-full overflow-hidden cursor-pointer">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
              </div>
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
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
        <Reveal delay={0.15}>
          <span className="label-caps text-gold">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <div className="gold-divider mb-8" />
          <p className="body-text max-w-[580px]">{t("text")}</p>

          <div className="mt-8 p-8 bg-sand-light">
            <h4 className="font-[var(--font-display)] text-lg font-medium mb-4">
              Frühstückszeiten
            </h4>
            <div className="flex justify-between py-2.5 border-b border-sand text-sm font-light">
              <span>{t("weekday")}</span>
              <span>{t("weekdayTime")}</span>
            </div>
            <div className="flex justify-between py-2.5 text-sm font-light">
              <span>{t("weekend")}</span>
              <span>{t("weekendTime")}</span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/restaurant_room_1920w.webp"
              alt="Frühstücksraum im Waldschlösschen"
              fill
              className="object-cover hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
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
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-forest text-white relative overflow-hidden">
      <div className="absolute -top-1/2 -right-[30%] w-[600px] h-[600px] rounded-full border border-gold/10" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/landscape_restaurant_1920w.webp"
                alt="Landschaft rund um das Hotel Waldschlösschen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mb-8" />
            <p className="text-lg font-light leading-relaxed text-white/75 max-w-[560px]">
              {t("text")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
              {locationFacts.map((fact) => (
                <div
                  key={fact.key}
                  className="flex items-center gap-4 p-5 border border-white/10 hover:border-gold/30 transition-colors duration-400"
                >
                  <fact.Icon className="w-5 h-5 text-gold-light stroke-[1.5] shrink-0" />
                  <span className="text-sm font-light text-white/80">{t(fact.key)}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
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
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light">
      <div className="max-w-[900px] mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="bg-white p-8 lg:p-12">
            {infoRows.map((row, i) => (
              <div
                key={row.labelKey}
                className={`flex items-center gap-5 py-5 ${i < infoRows.length - 1 ? "border-b border-sand" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-sand-light flex items-center justify-center shrink-0">
                  <row.Icon className="w-4.5 h-4.5 text-gold stroke-[1.5]" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{t(row.labelKey)}</span>
                  <span className="text-sm font-light text-text-secondary">{t(row.valueKey)}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS MINI ---------- */
function HotelTestimonials() {
  const locale = useLocale() as "de" | "en";

  const reviews = [
    {
      text: {
        de: "Sehr ruhige Lage, liebevolle Ausstattung der Zimmer, hervorragende Matratzenqualität. Kommt ganz klar auf meine Favoritenliste.",
        en: "Very quiet location, lovingly furnished rooms, outstanding mattress quality. Definitely going on my favorites list.",
      },
      author: { de: "Radtourist", en: "Cycling Tourist" },
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
      author: { de: "Kulturreisende", en: "Cultural Traveller" },
      source: "Booking.com",
    },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">Gästestimmen</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5">
              Was Gäste über unser <em>Hotel</em> sagen
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 bg-sand-light hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="flex gap-1 text-gold mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-gold stroke-gold" />
                  ))}
                </div>
                <p className="font-[var(--font-display)] text-lg font-normal italic leading-relaxed text-text-primary mb-6">
                  „{review.text[locale]}"
                </p>
                <div className="text-xs font-medium text-text-secondary">{review.author[locale]}</div>
                <div className="text-[0.7rem] font-light text-text-muted mt-1">{review.source}</div>
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
    <section className="relative py-[clamp(6rem,12vw,10rem)] px-[clamp(1.5rem,5vw,6rem)] text-center text-white overflow-hidden" id="buchen">
      <div className="absolute inset-0">
        <Image
          src="/landscape_restaurant_1920w.webp"
          alt="Landschaft Saale-Unstrut"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/85 to-forest/90" />
      </div>
      <Reveal>
        <div className="relative z-10 max-w-[700px] mx-auto">
          <span className="label-caps text-gold-light">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <p className="text-lg font-light leading-relaxed opacity-85 mb-12">{t("text")}</p>
          <div className="flex gap-5 justify-center flex-wrap">
            <a href={`tel:${siteConfig.phone}`} className="btn-primary">
              {t("ctaBook")}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light">
              {t("ctaContact")}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- MAIN EXPORT ---------- */
export default function HotelPageContent() {
  return (
    <main>
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
