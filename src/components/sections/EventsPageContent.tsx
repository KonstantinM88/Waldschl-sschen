"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Monitor,
  GlassWater,
  Cake,
  Church,
  Star,
  MapPin,
  UtensilsCrossed,
  Car,
  Music,
  Camera,
  Flower2,
  ChevronRight,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

/* ================================================================ HERO */
function EventsHero() {
  const t = useTranslations("eventsPage.hero");
  const reveal = {
    initial: { opacity: 0, y: 60, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/Foyer_1920w.webp"
          alt="Foyer Waldschlösschen — Eventlocation"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/10 to-charcoal/70" />
      </div>
      <div className="relative z-10 text-center text-white px-8 max-w-[900px]">
        <motion.div className="inline-block text-[0.7rem] font-normal tracking-[0.35em] uppercase text-gold-light mb-8" {...reveal} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <span className="opacity-50 mx-4">—</span>{t("badge")}<span className="opacity-50 mx-4">—</span>
        </motion.div>
        <motion.h1 className="heading-display text-[clamp(2.8rem,6vw,5rem)] mb-6" {...reveal} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          {t("title")}<br /><em className="text-gold-light">{t("titleEmphasis")}</em>
        </motion.h1>
        <motion.p className="text-[clamp(0.95rem,1.5vw,1.15rem)] font-light leading-relaxed opacity-85 max-w-[620px] mx-auto mb-12" {...reveal} transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          {t("subtitle")}
        </motion.p>
        <motion.div className="flex gap-5 justify-center flex-wrap" {...reveal} transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <a href="#anfrage" className="btn-primary">{t("ctaInquiry")}</a>
          <a href="#hochzeit" className="btn-outline-light">{t("ctaWeddings")}</a>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================ INTRO */
function EventsIntro() {
  const t = useTranslations("eventsPage.intro");
  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(3rem,6vw,8rem)] items-center">
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden relative">
              <Image src="/Schachtstube_mural_1920w.webp" alt="Schachtstube — Veranstaltungsraum" fill className="object-cover hover:scale-[1.03] transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
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
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { num: "50", label: "max. Personen" },
              { num: "5", label: "Räume" },
              { num: "80+", label: "Jahre Geschichte" },
              { num: "♥", label: "Standesamt im Haus" },
            ].map((f) => (
              <div key={f.label} className="p-5 bg-sand-light text-center">
                <div className="font-[var(--font-display)] text-3xl font-light text-charcoal">{f.num}</div>
                <div className="text-xs font-medium tracking-[0.12em] uppercase text-text-muted mt-1">{f.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================ WEDDINGS */
function EventsWeddings() {
  const t = useTranslations("eventsPage.weddings");
  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light" id="hochzeit">
      <div className="max-w-[1400px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="body-text mx-auto max-w-[640px]">{t("text")}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registry office card */}
          <Reveal>
            <div className="group bg-white overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-shadow duration-500">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/Foyer_1920w.webp" alt="Standesamt im Waldschlösschen" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
                <div className="absolute top-6 left-6 bg-gold/95 backdrop-blur-sm px-5 py-2.5">
                  <span className="text-[0.65rem] font-medium tracking-[0.15em] uppercase text-white">{t("registryBadge")}</span>
                </div>
              </div>
              <div className="p-8 lg:p-10">
                <Church className="w-6 h-6 text-gold stroke-[1.5] mb-4" />
                <h3 className="font-[var(--font-display)] text-2xl font-medium text-charcoal mb-3">{t("registryTitle")}</h3>
                <p className="body-text">{t("registryDesc")}</p>
                <p className="text-sm font-light text-text-muted mt-4 italic">{t("registryNote")}</p>
              </div>
            </div>
          </Reveal>

          {/* Celebration card */}
          <Reveal delay={0.15}>
            <div className="group bg-white overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-shadow duration-500">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/restaurant_private_room_1920w.webp" alt="Hochzeitsfeier im Waldschlösschen" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
              </div>
              <div className="p-8 lg:p-10">
                <Heart className="w-6 h-6 text-gold stroke-[1.5] mb-4" />
                <h3 className="font-[var(--font-display)] text-2xl font-medium text-charcoal mb-3">{t("celebrationTitle")}</h3>
                <p className="body-text">{t("celebrationDesc")}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Wedding services */}
        <Reveal delay={0.2}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
            {[
              { Icon: UtensilsCrossed, key: "menuPlanning" as const },
              { Icon: Flower2, key: "decoration" as const },
              { Icon: Music, key: "music" as const },
              { Icon: Camera, key: "photo" as const },
              { Icon: Cake, key: "cake" as const },
              { Icon: Car, key: "accommodation" as const },
            ].map((s) => (
              <div key={s.key} className="flex flex-col items-center gap-3 p-5 bg-white text-center">
                <s.Icon className="w-5 h-5 text-gold stroke-[1.5]" />
                <span className="text-xs font-light text-text-secondary">{t(s.key)}</span>
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
    { key: "celebrations" as const, Icon: GlassWater, image: "/restaurant_terrace_1920w.webp" },
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
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.12}>
              <div className="group relative overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image src={item.image} alt={t(`${item.key}.title`)} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent group-hover:from-charcoal/90 transition-all duration-500" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                  <item.Icon className="w-6 h-6 text-gold-light stroke-[1.5] mb-4" />
                  <h3 className="font-[var(--font-display)] text-2xl font-normal mb-3">{t(`${item.key}.title`)}</h3>
                  <p className="text-sm font-light leading-relaxed text-white/70">{t(`${item.key}.desc`)}</p>
                  <a href="#anfrage" className="inline-flex items-center gap-2 mt-5 text-[0.7rem] tracking-[0.15em] uppercase text-gold-light group-hover:gap-3 transition-all">
                    {t("inquire")} <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
                  </a>
                </div>
              </div>
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
    { key: "foyer" as const, image: "/Foyer_1920w.webp", capacity: "14+2", span: "col-span-2 row-span-2", aspect: "aspect-auto h-full min-h-[400px]" },
    { key: "schachtstube" as const, image: "/Schachtstube_mural_1920w.webp", capacity: "50", span: "", aspect: "aspect-[4/3]" },
    { key: "bergmann" as const, image: "/restaurant_private_room_1920w.webp", capacity: "30", span: "", aspect: "aspect-[4/3]" },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {spaces.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.1} className={s.span}>
              <div className={`group relative overflow-hidden cursor-pointer ${s.aspect}`}>
                <Image src={s.image} alt={t(`${s.key}.title`)} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="block text-[0.65rem] font-medium tracking-[0.2em] uppercase text-gold-light mb-2">{t(`${s.key}.sub`)}</span>
                      <h3 className="font-[var(--font-display)] text-2xl font-normal text-white">{t(`${s.key}.title`)}</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 text-center">
                      <div className="font-[var(--font-display)] text-lg text-white">{s.capacity}</div>
                      <div className="text-[0.55rem] tracking-[0.12em] uppercase text-white/60">{t("persons")}</div>
                    </div>
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
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-forest text-white relative overflow-hidden">
      <div className="absolute -top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full border border-gold/10" />
      <div className="max-w-[1100px] mx-auto relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-caps text-gold-light">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-white mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.key} delay={i * 0.1}>
              <div className="group p-8 border border-white/10 hover:border-gold/30 transition-all duration-500 text-center">
                <div className="font-[var(--font-display)] text-4xl font-light text-gold-light/40 mb-4">{step.num}</div>
                <h3 className="font-[var(--font-display)] text-xl font-normal mb-3">{t(`${step.key}.title`)}</h3>
                <p className="text-sm font-light leading-relaxed text-white/65">{t(`${step.key}.desc`)}</p>
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
  const locale = useLocale() as "de" | "en";
  const reviews = [
    {
      text: { de: "Wir haben unsere Hochzeit im Waldschlösschen gefeiert — das Ambiente ist einzigartig, der Service herzlich und das Essen hervorragend. Ein unvergesslicher Tag!", en: "We celebrated our wedding at Waldschlösschen — the ambiance is unique, the service warm and the food outstanding. An unforgettable day!" },
      author: { de: "Brautpaar aus Halle", en: "Wedding couple from Halle" }, source: "Hochzeit",
    },
    {
      text: { de: "Die liebevoll gestalteten Räume haben unsere Familienfeier zu etwas ganz Besonderem gemacht. Das Team hat sich um alles gekümmert.", en: "The lovingly designed rooms made our family celebration something truly special. The team took care of everything." },
      author: { de: "Familie aus Leipzig", en: "Family from Leipzig" }, source: "Familienfeier",
    },
    {
      text: { de: "Perfekter Ort für unser Firmenseminar. Historisches Flair, ruhige Lage, und abends das beste Essen der Region.", en: "Perfect place for our company seminar. Historic flair, quiet location, and the best food in the region in the evening." },
      author: { de: "Unternehmer", en: "Entrepreneur" }, source: "Tagung",
    },
  ];

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] bg-sand-light">
      <div className="max-w-[1200px] mx-auto">
        <Reveal><div className="text-center mb-16">
          <span className="label-caps text-gold">Stimmen</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5">Was unsere Gäste <em>erzählen</em></h2>
        </div></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 bg-white hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="flex gap-1 text-gold mb-6">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-gold stroke-gold" />)}</div>
                <p className="font-[var(--font-display)] text-lg font-normal italic leading-relaxed text-text-primary mb-6">„{r.text[locale]}"</p>
                <div className="text-xs font-medium text-text-secondary">{r.author[locale]}</div>
                <div className="text-[0.7rem] font-light text-text-muted mt-1">{r.source}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ CTA / INQUIRY */
function EventsCta() {
  const t = useTranslations("eventsPage.cta");
  return (
    <section className="relative py-[clamp(6rem,12vw,10rem)] px-[clamp(1.5rem,5vw,6rem)] text-center text-white overflow-hidden" id="anfrage">
      <div className="absolute inset-0">
        <Image src="/landscape_restaurant_1920w.webp" alt="Landschaft Saale-Unstrut" fill className="object-cover" sizes="100vw" />
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
