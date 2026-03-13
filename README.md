# Hotel & Restaurant Waldschlösschen — Website

Premium boutique hotel & restaurant website für das Waldschlösschen in Wangen/Nebra,
Saale-Unstrut-Triasland.

## Tech Stack

| Tool         | Version  |
|-------------|---------|
| Next.js     | 15.2.8  |
| React       | 19      |
| TypeScript  | 5.9.3   |
| Prisma      | 6.19.2  |
| Node.js     | v22.14  |
| Tailwind CSS| 4       |

## Zusätzliche Bibliotheken

- **next-intl** — i18n (DE / EN)
- **framer-motion** — Animationen
- **lucide-react** — Icons
- **zod** — Formvalidierung
- **clsx + tailwind-merge** — Utility-Klassen

## Projektstruktur

```
src/
├── app/
│   ├── globals.css          # Tailwind 4 Theme + Custom Styles
│   ├── layout.tsx           # Root Layout mit Fonts & Metadata
│   ├── page.tsx             # Hauptseite (DE default)
│   ├── [locale]/
│   │   ├── layout.tsx       # Locale Layout
│   │   └── page.tsx         # Locale-spezifische Seite
│   └── api/
│       └── contact/
│           └── route.ts     # Contact Form API
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Sticky Header + Mobile Menu
│   │   └── Footer.tsx       # Premium Footer
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── WelcomeSection.tsx
│   │   ├── DirectionsSection.tsx
│   │   ├── SpacesSection.tsx
│   │   ├── CulinarySection.tsx
│   │   ├── EventsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── VoucherSection.tsx
│   │   ├── DestinationsSection.tsx
│   │   ├── CtaSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/
│       └── Reveal.tsx       # Scroll-Animation Wrapper
├── data/
│   ├── site.ts              # Site Config & Content Data
│   └── messages/
│       ├── de.json          # Deutsche Übersetzungen
│       └── en.json          # Englische Übersetzungen
├── lib/
│   ├── prisma.ts            # Prisma Client Singleton
│   ├── utils.ts             # cn() Utility
│   └── i18n/
│       ├── config.ts        # i18n Konfiguration
│       └── request.ts       # next-intl Request Handler
└── middleware.ts             # i18n Routing Middleware
```

## Setup

```bash
# 1. Dependencies installieren
npm install

# 2. Umgebungsvariablen setzen
cp .env.example .env
# DATABASE_URL anpassen

# 3. Datenbank erstellen
npx prisma db push
npx prisma generate

# 4. Entwicklungsserver starten
npm run dev
```

## Seiten

| Seite              | Route             |
|-------------------|-------------------|
| Hauptseite (DE)   | `/`               |
| Hauptseite (EN)   | `/en`             |

## Features

- **Responsive Design** — Mobile-first, optimiert für alle Geräte
- **i18n** — Deutsch (Standard) + Englisch
- **SEO** — Meta Tags, Open Graph, schema.org Structured Data
- **Animations** — Framer Motion scroll-reveal Animationen
- **Contact Form** — API Route mit Zod-Validierung + Prisma
- **Premium Design** — Luxury-minimal, editorial typography, earth tones
- **Accessibility** — ARIA Labels, Keyboard Navigation, Kontrast

## Design Palette

- Cream: `#FAF8F4`
- Sand: `#E8DFD3`
- Forest Green: `#2C3E2D`
- Gold: `#C9A96E`
- Charcoal: `#1A1A1A`

## Fonts

- Display: **Cormorant Garamond** (Google Fonts)
- Body: **Outfit** (Google Fonts)
