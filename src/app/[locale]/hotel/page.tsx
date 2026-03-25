import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/data/site";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HotelPageContent from "@/components/sections/HotelPageContent";

interface HotelPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HotelPageProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
  const t = await getTranslations({
    locale: normalizedLocale,
    namespace: "hotelPage.meta",
  });

  const canonicalPath = `/${normalizedLocale}/hotel`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalPath,
      languages: {
        de: "/de/hotel",
        en: "/en/hotel",
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

export default function HotelPage() {
  const hotelSchema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: siteConfig.name,
    description:
      "Boutique-Hotel im denkmalgeschützten Gebäude des 19. Jahrhunderts, inmitten des Naturparks Saale-Unstrut-Triasland. 24 komfortable Doppelzimmer, Restaurant, Biergarten und Veranstaltungsräume.",
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
    url: `${siteConfig.url}/hotel`,
    priceRange: "€€",
    starRating: { "@type": "Rating", ratingValue: "3" },
    numberOfRooms: siteConfig.rooms,
    checkinTime: "14:00",
    checkoutTime: "11:00",
    petsAllowed: true,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Kostenloses WLAN", value: true },
      { "@type": "LocationFeatureSpecification", name: "Kostenloser Parkplatz", value: true },
      { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
      { "@type": "LocationFeatureSpecification", name: "Biergarten", value: true },
      { "@type": "LocationFeatureSpecification", name: "Kostenloser Fahrradverleih", value: true },
      { "@type": "LocationFeatureSpecification", name: "Frühstücksbuffet", value: true },
      { "@type": "LocationFeatureSpecification", name: "Veranstaltungsräume", value: true },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "9.1",
      bestRating: "10",
      ratingCount: "6",
      reviewCount: "6",
    },
    image: [
      `${siteConfig.url}/hotel_room_1920w.webp`,
      `${siteConfig.url}/Foyer_1920w.webp`,
      `${siteConfig.url}/library_room_1920w.webp`,
    ],
    hasMap: `https://www.google.com/maps?q=${siteConfig.coordinates.lat},${siteConfig.coordinates.lng}`,
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
        name: "Hotel",
        item: `${siteConfig.url}/hotel`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Wie viele Zimmer hat das Hotel Waldschlösschen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Das Hotel Waldschlösschen verfügt über 24 individuell gestaltete Doppelzimmer mit romantischer, gemütlicher Ausstattung.",
        },
      },
      {
        "@type": "Question",
        name: "Was kosten die Zimmer im Hotel Waldschlösschen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Einzelzimmer ab 79,00 € pro Nacht, Doppelzimmer ab 125,00 € pro Nacht. Die Preise beinhalten ein reichhaltiges Frühstück vom Buffet und eine Flasche Mineralwasser.",
        },
      },
      {
        "@type": "Question",
        name: "Sind Haustiere im Hotel Waldschlösschen erlaubt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, Hunde sind im Hotel willkommen. Es fällt eine Gebühr von 15,00 € pro Tag an.",
        },
      },
      {
        "@type": "Question",
        name: "Wann ist der Check-in im Hotel Waldschlösschen?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Der Check-in ist ab 14:00 Uhr möglich, der Check-out bis 11:00 Uhr. Die Rezeption ist von 07:00 bis 22:00 Uhr besetzt.",
        },
      },
      {
        "@type": "Question",
        name: "Gibt es kostenlose Parkplätze am Hotel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja, das Hotel bietet kostenfreie Parkplätze für PKW und Busse direkt am Haus.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }}
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
      <HotelPageContent />
      <Footer />
    </>
  );
}
