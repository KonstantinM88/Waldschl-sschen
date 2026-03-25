import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/data/site";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RestaurantPageContent from "@/components/sections/RestaurantPageContent";

interface RestaurantPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: RestaurantPageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
  const t = await getTranslations({
    locale: normalizedLocale,
    namespace: "restaurantPage.meta",
  });

  const canonicalPath = `/${normalizedLocale}/restaurant`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalPath,
      languages: {
        de: "/de/restaurant",
        en: "/en/restaurant",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: normalizedLocale === "de" ? "de_DE" : "en_US",
      alternateLocale: normalizedLocale === "de" ? "en_US" : "de_DE",
    },
  };
}

export default function RestaurantPage() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Restaurant Waldschlösschen",
    description:
      "Regionale, traditionelle Küche in moderner Interpretation. Saisonale Spezialitäten aus besten Zutaten im stilvollen Ambiente eines denkmalgeschützten Gebäudes im Naturpark Saale-Unstrut.",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.zip,
      addressCountry: "DE",
      addressRegion: "Sachsen-Anhalt",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.coordinates.lat,
      longitude: siteConfig.coordinates.lng,
    },
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: `${siteConfig.url}/restaurant`,
    priceRange: "€€",
    servesCuisine: ["Regional", "Deutsch", "Saisonal", "Traditionell"],
    menu: `${siteConfig.url}/restaurant`,
    acceptsReservations: "True",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Monday",
        opens: "17:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "12:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "12:00",
        closes: "20:00",
      },
    ],
    image: [
      `${siteConfig.url}/restaurant_room_1920w.webp`,
      `${siteConfig.url}/restaurant_terrace_1920w.webp`,
      `${siteConfig.url}/restaurant_private_room_1920w.webp`,
    ],
    hasMap: `https://www.google.com/maps?q=${siteConfig.coordinates.lat},${siteConfig.coordinates.lng}`,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Biergarten", value: true },
      { "@type": "LocationFeatureSpecification", name: "Terrasse", value: true },
      { "@type": "LocationFeatureSpecification", name: "Kaminzimmer", value: true },
      { "@type": "LocationFeatureSpecification", name: "Privaträume", value: true },
      { "@type": "LocationFeatureSpecification", name: "Vegetarische Optionen", value: true },
      { "@type": "LocationFeatureSpecification", name: "Glutenfreie Optionen", value: true },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Restaurant",
        item: `${siteConfig.url}/restaurant`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wann hat das Restaurant Waldschlösschen geöffnet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Montag 17:00–22:00 Uhr, Dienstag bis Samstag 12:00–22:00 Uhr (Küchenschluss 20:00), Sonntag 12:00–20:00 Uhr (Küchenschluss 19:00). Heiligabend geschlossen.",
        },
      },
      {
        "@type": "Question",
        name: "Welche Küche bietet das Restaurant Waldschlösschen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Das Restaurant serviert regionale, traditionelle Küche in moderner Interpretation mit saisonalen Spezialitäten. Vegetarische, glutenfreie und laktosefreie Optionen sind verfügbar.",
        },
      },
      {
        "@type": "Question",
        name: "Kann man im Restaurant Waldschlösschen einen Tisch reservieren?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, Tischreservierungen sind telefonisch unter +49 34461 255360 oder per E-Mail an info@waldschloesschen-wangen.de möglich.",
        },
      },
      {
        "@type": "Question",
        name: "Gibt es im Restaurant Waldschlösschen eine Terrasse?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, das Restaurant verfügt über eine sonnige Sommertterrasse und einen Biergarten mit Blick auf den Naturpark Saale-Unstrut-Triasland.",
        },
      },
      {
        "@type": "Question",
        name: "Bietet das Restaurant Waldschlösschen Räume für private Feiern?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, es stehen mehrere liebevoll gestaltete Räume für private Anlässe zur Verfügung: das Kaminzimmer, die Schachtstube und das Bergmannszimmer für Gruppen verschiedener Größen.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <RestaurantPageContent />
      <Footer />
    </>
  );
}
