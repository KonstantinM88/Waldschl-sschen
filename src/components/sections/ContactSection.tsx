"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

export default function ContactSection() {
  const t = useTranslations("contact");
  const [formState, setFormState] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });

  const subjectOptions = [
    { value: "", label: t("subjectOptions.placeholder") },
    { value: "zimmer", label: t("subjectOptions.room") },
    { value: "tisch", label: t("subjectOptions.table") },
    { value: "hochzeit", label: t("subjectOptions.wedding") },
    { value: "feier", label: t("subjectOptions.family") },
    { value: "tagung", label: t("subjectOptions.meeting") },
    { value: "gutschein", label: t("subjectOptions.voucher") },
    { value: "sonstiges", label: t("subjectOptions.other") },
  ];

  const handleSubmit = async () => {
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      setFormState({ name: "", email: "", phone: "", subject: "", message: "" });
      alert("Nachricht gesendet!");
    } catch {
      alert("Fehler beim Senden.");
    }
  };

  const inputClass =
    "font-[var(--font-body)] text-[0.95rem] font-light py-3.5 bg-transparent border-0 border-b border-white/20 text-white outline-none focus:border-gold transition-colors placeholder:text-white/30";

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-charcoal text-white" id="kontakt">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mt-16">
          <Reveal>
            <h3 className="font-[var(--font-display)] text-xl font-normal mb-6">{t("address")}</h3>
            <p className="text-[0.95rem] font-light leading-8 opacity-75">
              {siteConfig.name}<br />
              {siteConfig.address.street}<br />
              {siteConfig.address.zip} {siteConfig.address.city}<br />
              {siteConfig.address.country}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h3 className="font-[var(--font-display)] text-xl font-normal mb-6">{t("contactTitle")}</h3>
            <p className="text-[0.95rem] font-light leading-8 opacity-75">
              <a href={`tel:${siteConfig.phone}`} className="hover:text-gold-light hover:opacity-100 transition-all">
                {siteConfig.phoneDisplay}
              </a>
              <br />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-gold-light hover:opacity-100 transition-all">
                {siteConfig.email}
              </a>
            </p>
            <p className="text-[0.95rem] font-light leading-8 opacity-75 mt-4">
              A 38 → Abfahrt Querfurt<br />
              → Richtung Nebra → Kleinwangen
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <h3 className="font-[var(--font-display)] text-xl font-normal mb-6">{t("hours")}</h3>
            <p className="text-[0.95rem] font-light leading-8 opacity-75">
              Restaurant: täglich 12–21 Uhr<br />
              Küchenschluss: 20:00 Uhr<br />
              Frühstück Mo–Fr: 07–10 Uhr<br />
              Frühstück Sa–So: 08–10 Uhr
            </p>
            <p className="text-[0.95rem] font-light leading-8 opacity-75 mt-4">
              Rezeption: 07:00 – 22:00 Uhr<br />
              Check-in: ab 15:00 Uhr<br />
              Check-out: bis 11:00 Uhr
            </p>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal>
          <div className="mt-16 pt-16 border-t border-white/10">
            <h3 className="font-[var(--font-display)] text-2xl font-normal text-center mb-8">
              {t("formTitle")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="contact-name"
                  className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-white/50 mb-3"
                >
                  {t("formName")}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className={inputClass}
                  placeholder="Max Mustermann"
                  autoComplete="name"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="contact-email"
                  className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-white/50 mb-3"
                >
                  {t("formEmail")}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className={inputClass}
                  placeholder="ihre@email.de"
                  autoComplete="email"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="contact-phone"
                  className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-white/50 mb-3"
                >
                  {t("formPhone")}
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                  className={inputClass}
                  placeholder="+49 ..."
                  autoComplete="tel"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="contact-subject"
                  className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-white/50 mb-3"
                >
                  {t("formSubject")}
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  className={`${inputClass} [&>option]:text-charcoal`}
                >
                  {subjectOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col md:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-white/50 mb-3"
                >
                  {t("formMessage")}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className={`${inputClass} min-h-[120px] resize-y`}
                  placeholder="..."
                  autoComplete="off"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary"
                >
                  {t("formSend")}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Map placeholder */}
        <Reveal>
          <div className="mt-16 aspect-[21/6] bg-charcoal-light border border-white/8 flex items-center justify-center">
            <div className="text-center opacity-30">
              <MapPin className="w-12 h-12 mx-auto stroke-1" />
              <p className="mt-3 text-sm">Google Maps</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
