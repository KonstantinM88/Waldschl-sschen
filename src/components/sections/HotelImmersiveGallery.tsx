"use client";

import { startTransition, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trees,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";

type Lang = "de" | "en";

interface GalleryItem {
  key: string;
  mobileSrc: string;
  desktopSrc: string;
  eyebrow: Record<Lang, string>;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  metric: Record<Lang, string>;
  tags: Record<Lang, string[]>;
}

const HOTEL_GALLERY_ITEMS: GalleryItem[] = [
  {
    key: "room",
    mobileSrc: "/Hotel/room_1200.webp",
    desktopSrc: "/Hotel/room_1600.webp",
    eyebrow: {
      de: "Signature Room",
      en: "Signature room",
    },
    title: {
      de: "Ankommen mit Ruhe",
      en: "Arrive into calm",
    },
    description: {
      de: "Warme Materialien, weiche Stoffe und ein klares Raumgefuhl fur einen ruhigen Start in den Aufenthalt.",
      en: "Warm materials, soft textures and a clear spatial rhythm for a quiet start to your stay.",
    },
    metric: {
      de: "Ruhiges Premium-Zimmer",
      en: "Quiet premium room",
    },
    tags: {
      de: ["Soft light", "Abendstimmung"],
      en: ["Soft light", "Evening mood"],
    },
  },
  {
    key: "arched-window",
    mobileSrc: "/Hotel/arched_window_bedroom_1200.webp",
    desktopSrc: "/Hotel/arched_window_bedroom_1600.webp",
    eyebrow: {
      de: "Historische Fensterlinie",
      en: "Historic window line",
    },
    title: {
      de: "Bogenfenster & Schlafkomfort",
      en: "Arched windows & rest",
    },
    description: {
      de: "Die historische Architektur trifft auf ruhige Stoffe und ein helles, offenes Zimmerbild.",
      en: "Historic architecture meets calm textures and a bright, open room composition.",
    },
    metric: {
      de: "Licht, Hohe, Charakter",
      en: "Light, height, character",
    },
    tags: {
      de: ["Heritage view", "Tageslicht"],
      en: ["Heritage view", "Daylight"],
    },
  },
  {
    key: "balcony",
    mobileSrc: "/Hotel/bedroom_balcony_1200.webp",
    desktopSrc: "/Hotel/bedroom_balcony_1600.webp",
    eyebrow: {
      de: "Zimmer mit Balkon",
      en: "Room with balcony",
    },
    title: {
      de: "Morgensonne am Balkon",
      en: "Morning sun on the balcony",
    },
    description: {
      de: "Ein heller Ruckzugsort mit offenem Blick und luftiger Verbindung nach draussen.",
      en: "A bright retreat with an open view and an airy connection to the outdoors.",
    },
    metric: {
      de: "Ausblick direkt am Zimmer",
      en: "View directly from the room",
    },
    tags: {
      de: ["Balcony", "Fresh air"],
      en: ["Balcony", "Fresh air"],
    },
  },
  {
    key: "bathroom",
    mobileSrc: "/Hotel/bathroom_bathtub_1200.webp",
    desktopSrc: "/Hotel/bathroom_bathtub_1600.webp",
    eyebrow: {
      de: "Bad & Entspannung",
      en: "Bath & unwind",
    },
    title: {
      de: "Bad mit Wanne",
      en: "Bathroom with tub",
    },
    description: {
      de: "Naturtone, saubere Linien und eine tiefe Wanne fur einen ruhigen Tagesausklang.",
      en: "Natural tones, clean lines and a deep bathtub for a calm end to the day.",
    },
    metric: {
      de: "Private Wellness-Momente",
      en: "Private wellness moments",
    },
    tags: {
      de: ["Tub", "Warm tones"],
      en: ["Tub", "Warm tones"],
    },
  },
  {
    key: "wine-book",
    mobileSrc: "/Hotel/wine_book_balcony_1200.webp",
    desktopSrc: "/Hotel/wine_book_balcony_1600.webp",
    eyebrow: {
      de: "Private Pause",
      en: "Private pause",
    },
    title: {
      de: "Lesen, Wein, Aussicht",
      en: "Read, sip, unwind",
    },
    description: {
      de: "Eine intime Szene fur stille Stunden mit Buch, Glas und Blick in die Landschaft.",
      en: "An intimate setting for quiet hours with a book, a glass and a view of the landscape.",
    },
    metric: {
      de: "Ruhe mit Aussicht",
      en: "Quiet with a view",
    },
    tags: {
      de: ["Balcony moment", "Evening calm"],
      en: ["Balcony moment", "Evening calm"],
    },
  },
  {
    key: "desk-tv",
    mobileSrc: "/Hotel/desk_chair_tv_1200.webp",
    desktopSrc: "/Hotel/desk_chair_tv_1600.webp",
    eyebrow: {
      de: "Arbeiten & Abschalten",
      en: "Work & unwind",
    },
    title: {
      de: "Schreibtisch, Sessel, TV",
      en: "Desk, armchair, TV",
    },
    description: {
      de: "Ein ausgewogener Raum fur produktive Stunden und entspanntes Zurucklehnen am Abend.",
      en: "A balanced room for productive hours and relaxed evenings afterwards.",
    },
    metric: {
      de: "Businessfreundlich komponiert",
      en: "Composed for business stays",
    },
    tags: {
      de: ["Desk zone", "Evening setup"],
      en: ["Desk zone", "Evening setup"],
    },
  },
  {
    key: "armchair-window",
    mobileSrc: "/Hotel/armchair_book_window_1200.webp",
    desktopSrc: "/Hotel/armchair_book_window_1600.webp",
    eyebrow: {
      de: "Leseplatz am Fenster",
      en: "Reading corner by the window",
    },
    title: {
      de: "Lehnstuhl mit Tageslicht",
      en: "Armchair in daylight",
    },
    description: {
      de: "Ein ruhiger Blickpunkt im Zimmer, geschaffen fur kurze Pausen und langsame Morgen.",
      en: "A calm focal point in the room, designed for short breaks and slow mornings.",
    },
    metric: {
      de: "Ruhige Lesemomente",
      en: "Quiet reading moments",
    },
    tags: {
      de: ["Reading nook", "Soft daylight"],
      en: ["Reading nook", "Soft daylight"],
    },
  },
  {
    key: "corner-window",
    mobileSrc: "/Hotel/room_corner_window_1200.webp",
    desktopSrc: "/Hotel/room_corner_window_1600.webp",
    eyebrow: {
      de: "Mehr Perspektive",
      en: "More perspective",
    },
    title: {
      de: "Eckzimmer mit Weite",
      en: "Corner room with breadth",
    },
    description: {
      de: "Mehr Blickachsen, mehr Licht und ein offenes Raumgefuhl fur langere Aufenthalte.",
      en: "More sightlines, more daylight and an open spatial feel for longer stays.",
    },
    metric: {
      de: "Offen & lichtstark",
      en: "Open and light-filled",
    },
    tags: {
      de: ["Corner view", "Open feel"],
      en: ["Corner view", "Open feel"],
    },
  },
  {
    key: "bedroom-alt",
    mobileSrc: "/Hotel/bedroom_alt_1200.webp",
    desktopSrc: "/Hotel/bedroom_alt_1600.webp",
    eyebrow: {
      de: "Zweite Raumstimmung",
      en: "Alternate room mood",
    },
    title: {
      de: "Warme Zimmerkomposition",
      en: "Warm room composition",
    },
    description: {
      de: "Textilien, Holz und ruhige Farbwerte schaffen eine entspannte Premium-Atmosphare.",
      en: "Textiles, wood and quiet color values shape a relaxed premium atmosphere.",
    },
    metric: {
      de: "Warme Materialitat",
      en: "Warm material palette",
    },
    tags: {
      de: ["Warm palette", "Soft textures"],
      en: ["Warm palette", "Soft textures"],
    },
  },
  {
    key: "lamp",
    mobileSrc: "/Hotel/room_lamp_1200.webp",
    desktopSrc: "/Hotel/room_lamp_1600.webp",
    eyebrow: {
      de: "Stille Details",
      en: "Quiet details",
    },
    title: {
      de: "Lichtakzente im Zimmer",
      en: "Light accents in the room",
    },
    description: {
      de: "Eine Szene fur die leisen Qualitaten des Hauses: Licht, Textur und geborgene Abendruhe.",
      en: "A scene for the quieter qualities of the house: light, texture and sheltered evening calm.",
    },
    metric: {
      de: "Atmosphare bis ins Detail",
      en: "Atmosphere down to the detail",
    },
    tags: {
      de: ["Ambient light", "Evening tone"],
      en: ["Ambient light", "Evening tone"],
    },
  },
];

const GALLERY_COPY = {
  de: {
    intro:
      "Eine kuratierte Bildstrecke aus Zimmern, Bad, Balkon und den ruhigen Details unseres Hauses. Die Galerie lauft automatisch, bleibt aber auf Tap und Hover voll steuerbar.",
    pills: ["10 kuratierte Szenen", "Mobile & Desktop", "Auto-Play Galerie"],
    live: "Live Galerie",
    activeScene: "Aktive Szene",
    next: "Nachste Szene",
    previous: "Vorherige Szene",
    hint: "Tippen, wischen oder per Klick die Szene wechseln.",
    highlights: [
      { label: "Zimmer", value: "10 Bildwelten", Icon: BedDouble },
      { label: "Bad", value: "Wanne & Details", Icon: Bath },
      { label: "Ruhe", value: "Licht & Aussicht", Icon: Trees },
    ],
  },
  en: {
    intro:
      "A curated image sequence of rooms, bath, balcony and the quieter details of the house. The gallery runs automatically but stays fully controllable on tap and hover.",
    pills: ["10 curated scenes", "Mobile & desktop", "Auto-play gallery"],
    live: "Live gallery",
    activeScene: "Active scene",
    next: "Next scene",
    previous: "Previous scene",
    hint: "Tap, swipe or click to switch the scene.",
    highlights: [
      { label: "Rooms", value: "10 visual scenes", Icon: BedDouble },
      { label: "Bath", value: "Tub & details", Icon: Bath },
      { label: "Calm", value: "Light & views", Icon: Trees },
    ],
  },
} as const;

function HotelGalleryPicture({
  mobileSrc,
  desktopSrc,
  alt,
  wrapperClassName,
  imageClassName,
  priority = false,
}: {
  mobileSrc: string;
  desktopSrc: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <picture className={["block h-full w-full", wrapperClassName].filter(Boolean).join(" ")}>
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      <source media="(min-width: 768px)" srcSet={desktopSrc} />
      <img
        src={desktopSrc}
        alt={alt}
        draggable={false}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={imageClassName}
      />
    </picture>
  );
}

function GalleryThumb({
  item,
  index,
  locale,
  active,
  onSelect,
  compact = false,
}: {
  item: GalleryItem;
  index: number;
  locale: Lang;
  active: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "group relative overflow-hidden rounded-[1.45rem] border text-left transition-all duration-400",
        compact
          ? "min-w-[74%] snap-start p-2.5 sm:min-w-[44%]"
          : "w-full p-3",
        active
          ? "border-gold/34 bg-[linear-gradient(135deg,rgba(255,251,245,0.98),rgba(246,238,225,0.94))] shadow-[0_22px_48px_rgba(21,16,11,0.12)]"
          : "border-charcoal/10 bg-white/86 hover:border-gold/24 hover:bg-white/94",
      ].join(" ")}
      aria-pressed={active}
    >
      <motion.span
        className={[
          "pointer-events-none absolute inset-0 rounded-[inherit] border transition-opacity duration-300",
          active ? "border-white/58 opacity-100" : "border-white/0 opacity-0",
        ].join(" ")}
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
      />
      <div className="relative z-[1] flex items-center gap-3">
        <div className={`relative overflow-hidden rounded-[1.05rem] ${compact ? "h-[5.1rem] w-[5.8rem]" : "h-[5.35rem] w-[6.9rem]"}`}>
          <HotelGalleryPicture
            mobileSrc={item.mobileSrc}
            desktopSrc={item.desktopSrc}
            alt={item.title[locale]}
            wrapperClassName="absolute inset-0"
            imageClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/36 via-transparent to-transparent" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-gold">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="mt-1 line-clamp-2 font-[var(--font-display)] text-[1.05rem] leading-tight text-charcoal">
            {item.title[locale]}
          </div>
          <div className="mt-1.5 line-clamp-2 text-[0.74rem] font-light leading-relaxed text-text-muted">
            {item.metric[locale]}
          </div>
        </div>
        <ArrowUpRight
          className={[
            "h-4 w-4 shrink-0 stroke-[1.85] transition-all duration-300",
            active ? "translate-y-0 text-charcoal" : "translate-y-0.5 text-gold/70 group-hover:translate-y-0",
          ].join(" ")}
        />
      </div>
    </button>
  );
}

export default function HotelImmersiveGallery() {
  const locale = useLocale() as Lang;
  const t = useTranslations("hotelPage.gallery");
  const copy = GALLERY_COPY[locale];
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const activeItem = HOTEL_GALLERY_ITEMS[activeIndex];

  useEffect(() => {
    if (paused || reduceMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setDirection(1);
      startTransition(() => {
        setActiveIndex((current) => (current + 1) % HOTEL_GALLERY_ITEMS.length);
      });
    }, 5600);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [paused, reduceMotion]);

  const goToIndex = (nextIndex: number) => {
    if (nextIndex === activeIndex) {
      return;
    }

    setDirection(nextIndex > activeIndex ? 1 : -1);
    startTransition(() => {
      setActiveIndex(nextIndex);
    });
  };

  const shiftIndex = (step: 1 | -1) => {
    setDirection(step);
    startTransition(() => {
      setActiveIndex((current) => (current + step + HOTEL_GALLERY_ITEMS.length) % HOTEL_GALLERY_ITEMS.length);
    });
  };

  return (
    <section className="relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-[clamp(1.25rem,5vw,6rem)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(214,180,120,0.16),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(33,43,38,0.08),transparent_24%),linear-gradient(180deg,rgba(250,247,241,0.78),rgba(255,255,255,0.98))]" />

      <div className="relative z-[1] mx-auto max-w-[1450px]">
        <Reveal>
          <div className="mx-auto mb-10 max-w-[760px] text-center lg:mb-14">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display mt-5 text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <p className="mx-auto mt-6 max-w-[720px] text-[0.98rem] font-light leading-relaxed text-text-secondary sm:text-[1.05rem]">
              {copy.intro}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {copy.pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-charcoal/10 bg-white/82 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-text-secondary shadow-[0_12px_24px_rgba(22,18,12,0.05)] backdrop-blur-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] xl:gap-6">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-[2rem] border border-charcoal/12 bg-[#181411] p-[0.45rem] shadow-[0_42px_110px_rgba(18,13,10,0.22)]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="relative aspect-[5/6] overflow-hidden rounded-[1.7rem] bg-[#161210] sm:aspect-[16/10] xl:min-h-[720px] xl:aspect-auto">
                <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_18%_18%,rgba(236,208,167,0.18),transparent_24%),radial-gradient(circle_at_84%_12%,rgba(255,255,255,0.12),transparent_22%)]" />

                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={activeItem.key}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.045, x: direction > 0 ? 34 : -34 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02, x: direction > 0 ? -24 : 24 }}
                    transition={{ duration: reduceMotion ? 0.24 : 0.78, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <HotelGalleryPicture
                      mobileSrc={activeItem.mobileSrc}
                      desktopSrc={activeItem.desktopSrc}
                      alt={activeItem.title[locale]}
                      priority={activeIndex === 0}
                      wrapperClassName="absolute inset-0"
                      imageClassName="h-full w-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(18,14,10,0.18)_0%,rgba(18,14,10,0.04)_28%,rgba(18,14,10,0.52)_72%,rgba(18,14,10,0.82)_100%)]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%] bg-[radial-gradient(circle_at_50%_100%,rgba(214,180,120,0.18),transparent_54%)]" />

                <div className="absolute left-4 top-4 z-[3] flex flex-wrap items-center gap-2 sm:left-6 sm:top-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/22 px-3.5 py-2 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-white/88 backdrop-blur-sm sm:px-4">
                    <Sparkles className="h-3 w-3 stroke-[1.8] text-gold-light" />
                    {copy.live}
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/10 px-3.5 py-2 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-white/76 backdrop-blur-sm sm:px-4">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(HOTEL_GALLERY_ITEMS.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-[3] p-5 sm:p-6 lg:p-8">
                  <div className="max-w-[42rem]">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={`${activeItem.key}-copy`}
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                        transition={{ duration: reduceMotion ? 0.2 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="inline-flex items-center rounded-full border border-white/14 bg-black/20 px-3 py-1.5 text-[0.56rem] font-medium uppercase tracking-[0.16em] text-gold-light backdrop-blur-sm sm:px-3.5">
                          {activeItem.eyebrow[locale]}
                        </span>
                        <h3 className="mt-4 font-[var(--font-display)] text-[clamp(2rem,8vw,3.35rem)] leading-[0.94] text-white">
                          {activeItem.title[locale]}
                        </h3>
                        <p className="mt-4 max-w-[38rem] text-[0.93rem] font-light leading-relaxed text-white/80 sm:text-[1rem]">
                          {activeItem.description[locale]}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {activeItem.tags[locale].map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.13em] text-white/76 backdrop-blur-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        aria-label={copy.previous}
                        onClick={() => shiftIndex(-1)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-black/22 text-white/84 backdrop-blur-sm transition-all duration-300 hover:border-gold/32 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4 stroke-[2]" />
                      </button>
                      <button
                        type="button"
                        aria-label={copy.next}
                        onClick={() => shiftIndex(1)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-black/22 text-white/84 backdrop-blur-sm transition-all duration-300 hover:border-gold/32 hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4 stroke-[2]" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 sm:min-w-[17rem] sm:justify-end">
                      <span className="text-[0.64rem] font-medium uppercase tracking-[0.16em] text-white/62">
                        {copy.activeScene}
                      </span>
                      <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/18 sm:max-w-[12rem]">
                        <motion.span
                          key={`${activeItem.key}-progress`}
                          className="absolute inset-y-0 left-0 rounded-full bg-gold-light"
                          initial={{ width: "0%" }}
                          animate={{ width: reduceMotion ? "100%" : "100%" }}
                          transition={{ duration: reduceMotion ? 0.18 : 5.6, ease: "linear" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="hidden h-full xl:flex xl:flex-col xl:gap-4">
              <div className="rounded-[2rem] border border-charcoal/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(246,239,228,0.92))] p-5 shadow-[0_26px_60px_rgba(21,16,11,0.1)]">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold">
                      {copy.activeScene}
                    </div>
                    <div className="mt-3 font-[var(--font-display)] text-[2rem] leading-none text-charcoal">
                      {activeItem.metric[locale]}
                    </div>
                    <p className="mt-3 max-w-[23rem] text-sm font-light leading-relaxed text-text-secondary">
                      {copy.hint}
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-charcoal/10 bg-white/72 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                    <div className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-text-muted">
                      {copy.live}
                    </div>
                    <div className="mt-2 text-[1.1rem] font-light text-charcoal">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(HOTEL_GALLERY_ITEMS.length).padStart(2, "0")}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {copy.highlights.map((highlight) => (
                    <div
                      key={highlight.label}
                      className="rounded-[1.3rem] border border-charcoal/10 bg-white/68 px-4 py-4"
                    >
                      <highlight.Icon className="h-4 w-4 text-gold stroke-[1.7]" />
                      <div className="mt-3 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-text-muted">
                        {highlight.label}
                      </div>
                      <div className="mt-1.5 text-sm font-light leading-snug text-charcoal">
                        {highlight.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white/88 p-3 shadow-[0_22px_54px_rgba(21,16,11,0.08)]">
                <div className="hotel-gallery-scroll flex h-full flex-col gap-3 overflow-y-auto pr-1">
                  {HOTEL_GALLERY_ITEMS.map((item, index) => (
                    <GalleryThumb
                      key={item.key}
                      item={item}
                      index={index}
                      locale={locale}
                      active={index === activeIndex}
                      onSelect={() => goToIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="xl:hidden">
            <div className="mt-5 rounded-[1.7rem] border border-charcoal/10 bg-white/88 p-4 shadow-[0_22px_54px_rgba(21,16,11,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-gold">
                    {copy.activeScene}
                  </div>
                  <div className="mt-2 font-[var(--font-display)] text-[1.65rem] leading-none text-charcoal">
                    {activeItem.metric[locale]}
                  </div>
                </div>
                <span className="rounded-full border border-charcoal/10 bg-sand-light px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-text-secondary">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(HOTEL_GALLERY_ITEMS.length).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-sm font-light leading-relaxed text-text-secondary">
                {copy.hint}
              </p>
            </div>

            <div className="hotel-gallery-scroll mt-4 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
              {HOTEL_GALLERY_ITEMS.map((item, index) => (
                <GalleryThumb
                  key={`${item.key}-mobile`}
                  item={item}
                  index={index}
                  locale={locale}
                  active={index === activeIndex}
                  onSelect={() => goToIndex(index)}
                  compact
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
