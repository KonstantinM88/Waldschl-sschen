import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/data/site";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventsPageContent from "@/components/sections/EventsPageContent";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const nl = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  const t = await getTranslations({ locale: nl, namespace: "eventsPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${nl}/events`, languages: { de: "/de/events", en: "/en/events" } },
    openGraph: { title: t("title"), description: t("description"), type: "website", locale: nl === "de" ? "de_DE" : "en_US", alternateLocale: nl === "de" ? "en_US" : "de_DE" },
  };
}

export default function EventsPage() {
  const eventVenueSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Waldschlösschen — Eventlocation",
    description: "Historische Eventlocation für Hochzeiten, Familienfeiern, Tagungen und Veranstaltungen im denkmalgeschützten Gebäude des 19. Jahrhunderts im Naturpark Saale-Unstrut-Triasland.",
    address: { "@type": "PostalAddress", streetAddress: siteConfig.address.street, addressLocality: siteConfig.address.city, postalCode: siteConfig.address.zip, addressCountry: "DE", addressRegion: "Sachsen-Anhalt" },
    geo: { "@type": "GeoCoordinates", latitude: siteConfig.coordinates.lat, longitude: siteConfig.coordinates.lng },
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: `${siteConfig.url}/events`,
    maximumAttendeeCapacity: 50,
    image: [`${siteConfig.url}/Foyer_1920w.webp`, `${siteConfig.url}/Schachtstube_mural_1920w.webp`, `${siteConfig.url}/restaurant_private_room_1920w.webp`],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Standesamt im Haus", value: true },
      { "@type": "LocationFeatureSpecification", name: "Kostenloser Parkplatz", value: true },
      { "@type": "LocationFeatureSpecification", name: "Restaurant & Catering", value: true },
      { "@type": "LocationFeatureSpecification", name: "Übernachtungsmöglichkeiten", value: true },
      { "@type": "LocationFeatureSpecification", name: "Tagungstechnik", value: true },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Feiern & Events", item: `${siteConfig.url}/events` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Kann man im Waldschlösschen standesamtlich heiraten?", acceptedAnswer: { "@type": "Answer", text: "Ja, seit März 2017 ist im Lichthof des Waldschlösschens eine Zweigstelle des Standesamtes der Verbandsgemeinde Unstrut-Tal eingerichtet. Das Trauzimmer bietet Platz für bis zu 14 Personen plus Brautpaar." } },
      { "@type": "Question", name: "Wie viele Personen passen in die Veranstaltungsräume?", acceptedAnswer: { "@type": "Answer", text: "Die Schachtstube bietet Platz für bis zu 50 Personen, das Bergmannszimmer für bis zu 30 Personen. Das Trauzimmer im Foyer fasst 14+2 Personen." } },
      { "@type": "Question", name: "Welche Veranstaltungen können im Waldschlösschen gefeiert werden?", acceptedAnswer: { "@type": "Answer", text: "Hochzeiten, Familienfeiern (Geburtstage, Taufen, Jugendweihen, Konfirmationen), Tagungen, Seminare, Firmenfeiern und weitere Veranstaltungen jeglicher Art." } },
      { "@type": "Question", name: "Gibt es Übernachtungsmöglichkeiten für Hochzeitsgäste?", acceptedAnswer: { "@type": "Answer", text: "Ja, das Hotel verfügt über 24 komfortable Doppelzimmer direkt im Haus, ideal für Hochzeitsgäste." } },
      { "@type": "Question", name: "Wie kann ich eine Veranstaltung im Waldschlösschen anfragen?", acceptedAnswer: { "@type": "Answer", text: "Telefonisch unter +49 34461 255360 oder per E-Mail an info@waldschloesschen-wangen.de. Wir erstellen Ihnen gern ein individuelles Angebot." } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventVenueSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <EventsPageContent />
      <Footer />
    </>
  );
}
