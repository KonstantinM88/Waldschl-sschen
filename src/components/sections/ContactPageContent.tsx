"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Bike,
  Bus,
  CalendarCheck,
  Car,
  Clock,
  Headset,
  LogOut,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Send,
  Train,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import PremiumWaveFrame from "@/components/ui/PremiumWaveFrame";
import { siteConfig } from "@/data/site";

/* ================================================================ HERO */
function ContactHero() {
  const t = useTranslations("contactPage.hero");
  const tForm = useTranslations("contactPage.form");
  const tDirections = useTranslations("contactPage.directions");
  const reveal = {
    initial: { opacity: 0, y: 60, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <PremiumWaveFrame
      src="/Foyer_1920w.webp"
      alt="Foyer Waldschlösschen"
      sizes="100vw"
      priority
      outerClassName="relative flex h-[76vh] min-h-[520px] items-center justify-center overflow-hidden sm:h-[84vh] sm:min-h-[600px]"
      surfaceClassName="events-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-charcoal/38 via-charcoal/16 to-charcoal/82" />}
      afterSheen={<div className="events-hero-shine" aria-hidden="true" />}
    >
      <div className="relative z-10 mx-auto max-w-[900px] px-5 text-center text-white sm:px-8">
        <motion.div
          className="events-hero-kicker inline-block max-w-[19rem] text-balance mb-6 text-[0.58rem] font-normal uppercase leading-[1.85] tracking-[0.2em] sm:mb-8 sm:max-w-none sm:text-[0.7rem] sm:tracking-[0.35em]"
          {...reveal}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="events-hero-kicker-mark mx-2.5 sm:mx-4">—</span>
          {t("badge")}
          <span className="events-hero-kicker-mark mx-2.5 sm:mx-4">—</span>
        </motion.div>

        <motion.h1
          className="events-hero-title heading-display mb-4 text-[clamp(2.2rem,11.4vw,4.8rem)] leading-[0.95] sm:mb-6 sm:text-[clamp(2.8rem,6vw,5rem)]"
          {...reveal}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("title")}
          <br />
          <em>{t("titleEmphasis")}</em>
        </motion.h1>

        <motion.p
          className="events-hero-subtitle mx-auto mb-8 max-w-[23rem] text-[0.94rem] font-light leading-relaxed sm:mb-12 sm:max-w-[700px] sm:text-[clamp(0.95rem,1.5vw,1.15rem)]"
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
          <a href="#kontaktformular" className="btn-primary w-full sm:w-auto">{tForm("label")}</a>
          <a href="#anfahrt" className="btn-outline-light w-full sm:w-auto">{tDirections("label")}</a>
        </motion.div>
      </div>
    </PremiumWaveFrame>
  );
}

/* ================================================================ CONTACT DETAILS */
function ContactCards() {
  const tHero = useTranslations("contactPage.hero");
  const t = useTranslations("contactPage.cards");

  const cards = [
    {
      Icon: Phone,
      titleKey: "phoneTitle" as const,
      lines: [
        { type: "link" as const, href: `tel:${siteConfig.phone}`, text: siteConfig.phoneDisplay },
        { type: "text" as const, text: "Fax: 03 44 61 / 255 362" },
      ],
    },
    {
      Icon: Mail,
      titleKey: "emailTitle" as const,
      lines: [
        { type: "link" as const, href: `mailto:${siteConfig.email}`, text: siteConfig.email },
        { type: "link" as const, href: "mailto:hotel@waldschloesschen-wangen.de", text: "hotel@waldschloesschen-wangen.de" },
      ],
    },
    {
      Icon: MapPin,
      titleKey: "addressTitle" as const,
      lines: [
        { type: "text" as const, text: siteConfig.name },
        { type: "text" as const, text: siteConfig.address.street },
        { type: "text" as const, text: `${siteConfig.address.zip} ${siteConfig.address.city}` },
      ],
    },
  ];

  return (
    <section className="voucher-section relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="voucher-orb voucher-orb-left" />
      <div className="voucher-orb voucher-orb-right" />

      <div className="relative z-[1] mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-[clamp(3rem,6vw,8rem)] lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <PremiumWaveFrame
            src="/restaurant_private_room_1920w.webp"
            alt="Private dining room at Waldschlösschen"
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
            <span className="label-caps text-gold">{tHero("badge")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2rem,8.6vw,3.8rem)] text-charcoal">
              {tHero("title")} <em>{tHero("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mb-8" />
            <p className="body-text max-w-[640px]">{tHero("subtitle")}</p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {cards.map((card) => (
                <div key={card.titleKey} className="testimonial-card group h-full">
                  <div className="testimonial-card-surface min-h-0 p-6 sm:p-7">
                    <div className="relative z-[1] mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sand-light shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-500 group-hover:bg-gold/10">
                      <card.Icon className="h-5 w-5 text-gold stroke-[1.5]" />
                    </div>
                    <h3 className="relative z-[1] mb-4 font-[var(--font-display)] text-[1.28rem] font-normal text-charcoal">
                      {t(card.titleKey)}
                    </h3>
                    <div className="relative z-[1] space-y-2.5 text-sm font-light leading-relaxed text-text-secondary">
                      {card.lines.map((line, index) =>
                        line.type === "link" ? (
                          <a
                            key={index}
                            href={line.href}
                            className="block break-words transition-colors duration-300 hover:text-gold"
                          >
                            {line.text}
                          </a>
                        ) : (
                          <p key={index}>{line.text}</p>
                        )
                      )}
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

/* ================================================================ HOURS */
function ContactHours() {
  const t = useTranslations("contactPage.hours");

  const rows = [
    { label: "monday", time: "mondayTime" },
    { label: "tueSat", time: "tueSatTime" },
    { label: "sunday", time: "sundayTime" },
    { label: "kitchen", time: "kitchenTime" },
    { label: "kitchenSun", time: "kitchenSunTime" },
  ] as const;

  const hotelRows = [
    { label: "checkin", time: "checkinTime", Icon: CalendarCheck },
    { label: "checkout", time: "checkoutTime", Icon: LogOut },
    { label: "reception", time: "receptionTime", Icon: Headset },
  ] as const;

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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal>
            <div className="events-card group h-full">
              <div className="events-card-surface h-full">
                <div className="events-card-glow" />
                <span className="events-card-icon">
                  <Clock className="h-5 w-5 text-gold-light stroke-[1.5]" />
                </span>
                <h3 className="events-card-title text-[1.45rem] md:text-[1.65rem]">{t("restaurantTitle")}</h3>

                <div className="relative z-[1] mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]">
                  {rows.map((row, index) => (
                    <div
                      key={row.label}
                      className={`flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                        index < rows.length - 1 ? "border-b border-white/10" : ""
                      }`}
                    >
                      <span className="text-sm font-light text-white/76">{t(row.label)}</span>
                      <span className="text-sm font-medium text-gold-light">{t(row.time)}</span>
                    </div>
                  ))}
                </div>

                <p className="relative z-[1] mt-5 text-xs font-light leading-relaxed text-white/56">{t("closed")}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="events-card group h-full">
              <div className="events-card-surface h-full">
                <div className="events-card-glow" />
                <span className="events-card-icon">
                  <Clock className="h-5 w-5 text-gold-light stroke-[1.5]" />
                </span>
                <h3 className="events-card-title text-[1.45rem] md:text-[1.65rem]">{t("hotelTitle")}</h3>

                <div className="relative z-[1] mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]">
                  {hotelRows.map((row, index) => (
                    <div
                      key={row.label}
                      className={`flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                        index < hotelRows.length - 1 ? "border-b border-white/10" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
                          <row.Icon className="h-4 w-4 text-gold-light stroke-[1.5]" />
                        </div>
                        <span className="text-sm font-light text-white/76">{t(row.label)}</span>
                      </div>
                      <span className="text-sm font-medium text-gold-light">{t(row.time)}</span>
                    </div>
                  ))}
                </div>

                <div className="relative z-[1] mt-6 rounded-[1.45rem] border border-white/8 bg-white/[0.04] px-5 py-4">
                  <p className="text-xs font-light leading-relaxed text-white/60">{t("breakfastNote")}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ FORM */
function ContactForm() {
  const t = useTranslations("contactPage.form");
  const tCards = useTranslations("contactPage.cards");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const subjectOptions = [
    { value: "", label: t("subjectPlaceholder") },
    { value: "zimmer", label: t("subjectRoom") },
    { value: "tisch", label: t("subjectTable") },
    { value: "hochzeit", label: t("subjectWedding") },
    { value: "feier", label: t("subjectFamily") },
    { value: "tagung", label: t("subjectMeeting") },
    { value: "gutschein", label: t("subjectVoucher") },
    { value: "sonstiges", label: t("subjectOther") },
  ];

  const detailCards = [
    {
      Icon: Phone,
      title: tCards("phoneTitle"),
      lines: [siteConfig.phoneDisplay, "Fax: 03 44 61 / 255 362"],
      href: `tel:${siteConfig.phone}`,
    },
    {
      Icon: Mail,
      title: tCards("emailTitle"),
      lines: [siteConfig.email, "hotel@waldschloesschen-wangen.de"],
      href: `mailto:${siteConfig.email}`,
    },
    {
      Icon: MapPin,
      title: tCards("addressTitle"),
      lines: [siteConfig.address.street, `${siteConfig.address.zip} ${siteConfig.address.city}`],
      href: undefined,
    },
  ];

  const handleSubmit = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-[1.1rem] border border-charcoal/12 bg-white/72 px-4 py-4 text-[0.95rem] font-light text-charcoal outline-none transition-all duration-300 placeholder:text-text-muted/55 focus:border-gold/55 focus:bg-white focus:shadow-[0_0_0_4px_rgba(196,158,98,0.12)]";

  return (
    <section
      id="kontaktformular"
      className="bg-sand-light/60 py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="body-text mx-auto max-w-[620px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="events-card group h-full">
              <div className="events-card-surface h-full">
                <div className="events-card-glow" />
                <span className="events-card-icon">
                  <Navigation className="h-5 w-5 text-gold-light stroke-[1.5]" />
                </span>
                <h3 className="events-card-title text-[1.45rem] md:text-[1.7rem]">
                  {t("title")} <span className="italic text-gold-light">{t("titleEmphasis")}</span>
                </h3>
                <p className="events-card-desc max-w-[34rem]">{t("text")}</p>

                <div className="relative z-[1] mt-8 grid gap-4">
                  {detailCards.map((item) => {
                    const content = (
                      <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.04] px-5 py-4 transition-all duration-300 hover:border-white/18 hover:bg-white/[0.06]">
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07]">
                            <item.Icon className="h-4 w-4 text-gold-light stroke-[1.5]" />
                          </div>
                          <div>
                            <div className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-gold-light/88">
                              {item.title}
                            </div>
                            <div className="mt-2 space-y-1.5 text-sm font-light leading-relaxed text-white/76">
                              {item.lines.map((line) => (
                                <p key={line}>{line}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );

                    if (!item.href) {
                      return <div key={item.title}>{content}</div>;
                    }

                    return (
                      <a key={item.title} href={item.href} className="block">
                        {content}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white/96 p-6 shadow-[0_35px_90px_rgba(22,18,12,0.12)] sm:p-8 lg:p-10">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
              <div className="absolute -top-24 right-[-8%] h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
              <div className="absolute -bottom-20 left-[-6%] h-44 w-44 rounded-full bg-charcoal/[0.04] blur-3xl" />

              <div className="relative z-[1] grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                <div>
                  <label className="mb-3 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder={t("namePlaceholder")}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                    {t("email")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder={t("emailPlaceholder")}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                    {t("phone")}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+49 ..."
                  />
                </div>

                <div>
                  <label className="mb-3 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                    {t("subject")}
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={`${inputClass} appearance-none`}
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                    {t("message")}
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} min-h-[180px] resize-y`}
                    placeholder={t("messagePlaceholder")}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "sending"}
                    className="btn-primary w-full justify-center sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    {status === "sending" ? t("sending") : t("send")}
                  </button>

                  {status === "sent" ? (
                    <span className="text-sm font-light text-forest">{t("success")}</span>
                  ) : null}
                  {status === "error" ? (
                    <span className="text-sm font-light text-red-600">{t("error")}</span>
                  ) : null}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ DIRECTIONS */
function ContactDirections() {
  const t = useTranslations("contactPage.directions");
  const tCta = useTranslations("contactPage.cta");

  const routes = [
    { key: "car" as const, Icon: Car },
    { key: "bus" as const, Icon: Bus },
    { key: "train" as const, Icon: Train },
    { key: "bike" as const, Icon: Bike },
  ];

  const mapSrc = `https://www.google.com/maps?q=${siteConfig.coordinates.lat},${siteConfig.coordinates.lng}&z=15&output=embed`;

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="anfahrt">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="mb-16 text-center">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 mb-6 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mx-auto mb-8" />
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {routes.map((route, index) => (
            <Reveal key={route.key} delay={index * 0.08}>
              <div className="testimonial-card group h-full">
                <div className="testimonial-card-surface h-full min-h-[270px] items-start p-6 sm:min-h-[290px] sm:p-7">
                  <div className="relative z-[1] mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sand-light shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-500 group-hover:bg-gold/10">
                    <route.Icon className="h-5 w-5 text-gold stroke-[1.5]" />
                  </div>
                  <h3 className="relative z-[1] mb-3 font-[var(--font-display)] text-[1.3rem] font-normal text-charcoal">
                    {t(`${route.key}.title`)}
                  </h3>
                  <p className="relative z-[1] text-sm font-light leading-relaxed text-text-secondary">
                    {t(`${route.key}.desc`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <Reveal delay={0.2}>
            <div className="events-card group h-full">
              <div className="events-card-surface h-full">
                <div className="events-card-glow" />
                <span className="events-card-icon">
                  <MapPin className="h-5 w-5 text-gold-light stroke-[1.5]" />
                </span>
                <h3 className="events-card-title text-[1.45rem] md:text-[1.65rem]">{siteConfig.name}</h3>
                <p className="events-card-desc max-w-[32rem]">
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.zip} {siteConfig.address.city}
                </p>

                <div className="relative z-[1] mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={`tel:${siteConfig.phone}`} className="btn-primary w-full sm:w-auto">
                    {tCta("ctaPhone")}
                  </a>
                  <a href={`mailto:${siteConfig.email}`} className="btn-outline-light w-full sm:w-auto">
                    {tCta("ctaEmail")}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white p-2 shadow-[0_28px_80px_rgba(22,18,12,0.12)]">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.55rem] sm:aspect-[16/10] xl:aspect-[16/9]">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(0.18) contrast(1.04) saturate(0.92)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps — Waldschlösschen Wangen"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ CTA */
function ContactCta() {
  const t = useTranslations("contactPage.cta");

  return (
    <PremiumWaveFrame
      src="/landscape_restaurant_1920w.webp"
      alt="Saale-Unstrut landscape"
      sizes="100vw"
      outerClassName="relative overflow-hidden py-[clamp(5rem,11vw,10rem)] px-[clamp(1.25rem,5vw,6rem)] text-center text-white"
      surfaceClassName="events-hero-media absolute inset-0"
      imageClassName="object-cover"
      beforeSheen={<div className="absolute inset-0 bg-gradient-to-b from-forest/84 to-forest/92" />}
      afterSheen={<div className="events-hero-shine events-hero-shine-soft" aria-hidden="true" />}
    >
      <Reveal>
        <div className="relative z-10 mx-auto max-w-[720px]">
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
            <a href={`tel:${siteConfig.phone}`} className="btn-primary w-full sm:w-auto">{t("ctaPhone")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light w-full sm:w-auto">{t("ctaEmail")}</a>
          </div>
        </div>
      </Reveal>
    </PremiumWaveFrame>
  );
}

/* ================================================================ EXPORT */
export default function ContactPageContent() {
  return (
    <main className="overflow-hidden">
      <ContactHero />
      <ContactCards />
      <ContactHours />
      <ContactForm />
      <ContactDirections />
      <ContactCta />
    </main>
  );
}
