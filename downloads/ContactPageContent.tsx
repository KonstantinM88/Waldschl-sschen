"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Car,
  Bus,
  Bike,
  Train,
  Navigation,
  Send,
  CalendarCheck,
  LogOut,
  Headset,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

/* ================================================================ HERO */
function ContactHero() {
  const t = useTranslations("contactPage.hero");
  const r = { initial: { opacity: 0, y: 60, filter: "blur(4px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" } };

  return (
    <section className="relative h-[65vh] min-h-[480px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/Foyer_1920w.webp" alt="Foyer Waldschlösschen" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/15 to-charcoal/70" />
      </div>
      <div className="relative z-10 text-center text-white px-8 max-w-[800px]">
        <motion.div className="inline-block text-[0.7rem] font-normal tracking-[0.35em] uppercase text-gold-light mb-8" {...r} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <span className="opacity-50 mx-4">—</span>{t("badge")}<span className="opacity-50 mx-4">—</span>
        </motion.div>
        <motion.h1 className="heading-display text-[clamp(2.6rem,5.5vw,4.5rem)] mb-6" {...r} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          {t("title")}<br /><em className="text-gold-light">{t("titleEmphasis")}</em>
        </motion.h1>
        <motion.p className="text-[clamp(0.95rem,1.5vw,1.1rem)] font-light leading-relaxed opacity-85 max-w-[560px] mx-auto" {...r} transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          {t("subtitle")}
        </motion.p>
      </div>
    </section>
  );
}

/* ================================================================ CONTACT CARDS */
function ContactCards() {
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
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <Reveal key={card.titleKey} delay={i * 0.1}>
              <div className="group p-8 lg:p-10 bg-sand-light hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 text-center">
                <div className="w-14 h-14 rounded-full bg-white group-hover:bg-gold/10 flex items-center justify-center mx-auto mb-6 transition-colors duration-500">
                  <card.Icon className="w-6 h-6 text-gold stroke-[1.5]" />
                </div>
                <h3 className="font-[var(--font-display)] text-xl font-medium text-charcoal mb-4">{t(card.titleKey)}</h3>
                <div className="space-y-1">
                  {card.lines.map((line, j) =>
                    line.type === "link" ? (
                      <a key={j} href={line.href} className="block text-sm font-light text-text-secondary hover:text-gold transition-colors">{line.text}</a>
                    ) : (
                      <p key={j} className="text-sm font-light text-text-secondary">{line.text}</p>
                    )
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
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
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-charcoal text-white">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5">{t("title")} <em>{t("titleEmphasis")}</em></h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Restaurant hours */}
          <Reveal>
            <div className="bg-white/[0.06] border border-white/10 backdrop-blur-sm p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-5 h-5 text-gold-light stroke-[1.5]" />
                <h3 className="font-[var(--font-display)] text-xl font-normal">{t("restaurantTitle")}</h3>
              </div>
              {rows.map((row, i) => (
                <div key={row.label} className={`flex items-center justify-between py-4 ${i < rows.length - 1 ? "border-b border-white/10" : ""}`}>
                  <span className="text-sm font-light text-white/80">{t(row.label)}</span>
                  <span className="text-sm font-medium text-gold-light">{t(row.time)}</span>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs font-light text-white/50">{t("closed")}</p>
              </div>
            </div>
          </Reveal>

          {/* Hotel hours */}
          <Reveal delay={0.15}>
            <div className="bg-white/[0.06] border border-white/10 backdrop-blur-sm p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-5 h-5 text-gold-light stroke-[1.5]" />
                <h3 className="font-[var(--font-display)] text-xl font-normal">{t("hotelTitle")}</h3>
              </div>
              {hotelRows.map((row, i) => (
                <div key={row.label} className={`flex items-center gap-4 py-5 ${i < hotelRows.length - 1 ? "border-b border-white/10" : ""}`}>
                  <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                    <row.Icon className="w-4 h-4 text-gold-light stroke-[1.5]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-light text-white/80">{t(row.label)}</span>
                    <span className="text-sm font-medium text-gold-light">{t(row.time)}</span>
                  </div>
                </div>
              ))}
              <div className="mt-8 p-5 bg-white/[0.04] border border-white/8">
                <p className="text-xs font-light text-white/60 leading-relaxed">{t("breakfastNote")}</p>
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

  const handleSubmit = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setStatus("sent"); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  const inputClass = "w-full font-[var(--font-body)] text-[0.95rem] font-light py-3.5 px-0 bg-transparent border-0 border-b border-charcoal/15 text-charcoal outline-none focus:border-gold transition-colors placeholder:text-text-muted/50";

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[900px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">{t("title")} <em>{t("titleEmphasis")}</em></h2>
            <p className="body-text mx-auto max-w-[560px]">{t("text")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="bg-sand-light p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-text-muted mb-3 block">{t("name")}</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder={t("namePlaceholder")} />
              </div>
              <div>
                <label className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-text-muted mb-3 block">{t("email")}</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder={t("emailPlaceholder")} />
              </div>
              <div>
                <label className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-text-muted mb-3 block">{t("phone")}</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+49 ..." />
              </div>
              <div>
                <label className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-text-muted mb-3 block">{t("subject")}</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={`${inputClass} [&>option]:text-charcoal`}>
                  {subjectOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-text-muted mb-3 block">{t("message")}</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} min-h-[140px] resize-y`} placeholder={t("messagePlaceholder")} />
              </div>
              <div className="md:col-span-2 flex items-center gap-6">
                <button type="button" onClick={handleSubmit} disabled={status === "sending"} className="btn-primary">
                  <Send className="w-4 h-4" />
                  {status === "sending" ? t("sending") : t("send")}
                </button>
                {status === "sent" && <span className="text-sm font-light text-forest">{t("success")}</span>}
                {status === "error" && <span className="text-sm font-light text-red-600">{t("error")}</span>}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================ DIRECTIONS */
function ContactDirections() {
  const t = useTranslations("contactPage.directions");

  const routes = [
    { key: "car" as const, Icon: Car },
    { key: "bus" as const, Icon: Bus },
    { key: "train" as const, Icon: Train },
    { key: "bike" as const, Icon: Bike },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route, i) => (
            <Reveal key={route.key} delay={i * 0.1}>
              <div className="group bg-white p-8 hover:shadow-[0_16px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-sand-light group-hover:bg-gold/10 flex items-center justify-center mb-5 transition-colors duration-500">
                  <route.Icon className="w-5 h-5 text-gold stroke-[1.5]" />
                </div>
                <h3 className="font-[var(--font-display)] text-lg font-medium text-charcoal mb-3">{t(`${route.key}.title`)}</h3>
                <p className="text-sm font-light leading-relaxed text-text-secondary">{t(`${route.key}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Map placeholder */}
        <Reveal delay={0.3}>
          <div className="mt-12 aspect-[21/8] bg-charcoal border border-charcoal/10 flex items-center justify-center overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2500!2d${siteConfig.coordinates.lng}!3d${siteConfig.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a4261a9fc5a10b%3A0x20896c73e68446b6!2sWaldschl%C3%B6sschen+Wangen!5e0!3m2!1sde!2sde!4v1`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(0.3) contrast(1.05)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps — Waldschlösschen Wangen"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================ CTA */
function ContactCta() {
  const t = useTranslations("contactPage.cta");
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
            <a href={`tel:${siteConfig.phone}`} className="btn-primary">{t("ctaPhone")}</a>
            <a href={`mailto:${siteConfig.email}`} className="btn-outline-light">{t("ctaEmail")}</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ================================================================ EXPORT */
export default function ContactPageContent() {
  return (
    <main>
      <ContactHero />
      <ContactCards />
      <ContactHours />
      <ContactForm />
      <ContactDirections />
      <ContactCta />
    </main>
  );
}
