import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/data/site";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactPageContent from "@/components/sections/ContactPageContent";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const nl = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  const t = await getTranslations({ locale: nl, namespace: "contactPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${nl}/kontakt`, languages: { de: "/de/kontakt", en: "/en/kontakt" } },
    openGraph: { title: t("title"), description: t("description"), type: "website", locale: nl === "de" ? "de_DE" : "en_US", alternateLocale: nl === "de" ? "en_US" : "de_DE" },
  };
}

export default function ContactPage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    description: "Hotel & Restaurant Waldschlösschen — Boutique-Hotel, Restaurant, Café und Eventlocation im denkmalgeschützten Gebäude des 19. Jahrhunderts im Naturpark Saale-Unstrut-Triasland.",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: "Nebra (Unstrut)",
      addressRegion: "Sachsen-Anhalt",
      postalCode: siteConfig.address.zip,
      addressCountry: "DE",
    },
    geo: { "@type": "GeoCoordinates", latitude: siteConfig.coordinates.lat, longitude: siteConfig.coordinates.lng },
    telephone: siteConfig.phone,
    email: siteConfig.email,
    url: siteConfig.url,
    priceRange: "€€",
    image: `${siteConfig.url}/Foyer_1920w.webp`,
    hasMap: `https://www.google.com/maps?q=${siteConfig.coordinates.lat},${siteConfig.coordinates.lng}`,
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "17:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "12:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "20:00" },
    ],
    contactPoint: [
      { "@type": "ContactPoint", telephone: siteConfig.phone, contactType: "reservations", availableLanguage: ["German","English"] },
      { "@type": "ContactPoint", email: siteConfig.email, contactType: "customer service" },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Kontakt & Anfahrt", item: `${siteConfig.url}/kontakt` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Wie erreiche ich das Hotel Waldschlösschen mit dem Auto?", acceptedAnswer: { "@type": "Answer", text: "Über die A38, Abfahrt Querfurt, Richtung Nebra. In Nebra der Beschilderung nach Kleinwangen (2 km) folgen. Kostenlose Parkplätze für PKW und Busse direkt am Haus." } },
      { "@type": "Question", name: "Wie erreiche ich das Hotel mit öffentlichen Verkehrsmitteln?", acceptedAnswer: { "@type": "Answer", text: "Die Bushaltestelle 'Großwangen, Parkplatz Himmelsscheibe' befindet sich direkt vor dem Haus. Der Bahnhof Wangen ist nur 400 m entfernt (ca. 5 Minuten zu Fuß)." } },
      { "@type": "Question", name: "Wie kann ich einen Tisch im Restaurant reservieren?", acceptedAnswer: { "@type": "Answer", text: "Telefonisch unter +49 34461 255360, per E-Mail an info@waldschloesschen-wangen.de oder über unser Online-Kontaktformular." } },
      { "@type": "Question", name: "Wie sind die Öffnungszeiten des Restaurants?", acceptedAnswer: { "@type": "Answer", text: "Montag 17–22 Uhr, Dienstag bis Samstag 12–22 Uhr (Küchenschluss 20 Uhr), Sonntag 12–20 Uhr (Küchenschluss 19 Uhr). Heiligabend geschlossen." } },
      { "@type": "Question", name: "Wie weit ist der Flughafen Erfurt entfernt?", acceptedAnswer: { "@type": "Answer", text: "Der Flughafen Erfurt-Weimar ist ca. 72 km vom Hotel Waldschlösschen entfernt." } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <ContactPageContent />
      <Footer />
    </>
  );
}
