import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/data/site";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DestinationsPageContent from "@/components/sections/DestinationsPageContent";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const nl = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
  const t = await getTranslations({ locale: nl, namespace: "destinationsPage.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: `/${nl}/ausflugsziele`, languages: { de: "/de/ausflugsziele", en: "/en/ausflugsziele" } },
    openGraph: { title: t("title"), description: t("description"), type: "website", locale: nl === "de" ? "de_DE" : "en_US", alternateLocale: nl === "de" ? "en_US" : "de_DE" },
  };
}

export default function DestinationsPage() {
  const touristSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Saale-Unstrut-Triasland — Ausflugsziele ab Hotel Waldschlösschen",
    description: "Ausflugsziele und Sehenswürdigkeiten im Naturpark Saale-Unstrut-Triasland: Arche Nebra, Himmelsscheibe, Weinberge, Unstrutradweg, Kloster Memleben, Rotkäppchen Sektkellerei und mehr.",
    url: `${siteConfig.url}/ausflugsziele`,
    touristType: ["Kulturtourismus", "Radtourismus", "Weintourismus", "Naturtourismus"],
    geo: { "@type": "GeoCoordinates", latitude: siteConfig.coordinates.lat, longitude: siteConfig.coordinates.lng },
    includesAttraction: [
      { "@type": "TouristAttraction", name: "Arche Nebra", description: "Museum zur Himmelsscheibe von Nebra" },
      { "@type": "TouristAttraction", name: "Mittelberg & Himmelsauge", description: "Fundort der Himmelsscheibe mit 30 m Aussichtsturm" },
      { "@type": "TouristAttraction", name: "Weinberge Saale-Unstrut", description: "Nördlichste Qualitätsweinregion Deutschlands" },
      { "@type": "TouristAttraction", name: "Unstrutradweg", description: "189 km Radweg entlang der Unstrut" },
      { "@type": "TouristAttraction", name: "Kloster & Kaiserpfalz Memleben", description: "Historische Klosteranlage" },
      { "@type": "TouristAttraction", name: "Rotkäppchen Sektkellerei Freyburg", description: "Berühmte Sektkellerei, 365 Tage geöffnet" },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Ausflugsziele", item: `${siteConfig.url}/ausflugsziele` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Welche Ausflugsziele gibt es in der Nähe des Hotel Waldschlösschen?", acceptedAnswer: { "@type": "Answer", text: "Direkt vor der Tür: Arche Nebra (4 Min.), Mittelberg mit Himmelsauge. In der Region: Weinberge Saale-Unstrut, Unstrutradweg (ab Hotel), Kloster Memleben (12 km), Rotkäppchen Sektkellerei Freyburg (27 km), Naumburger Dom (UNESCO, 45 km), Lutherstadt Eisleben (40 km)." } },
      { "@type": "Question", name: "Kann man am Hotel Waldschlösschen Fahrräder ausleihen?", acceptedAnswer: { "@type": "Answer", text: "Ja, Leihfahrräder stehen den Hotelgästen kostenlos zur Verfügung. Das Hotel liegt direkt am Unstrutradweg (189 km) und am Himmelsscheibenradweg (71 km)." } },
      { "@type": "Question", name: "Was ist die Arche Nebra?", acceptedAnswer: { "@type": "Answer", text: "Die Arche Nebra ist ein Museum zur weltberühmten Himmelsscheibe von Nebra, einem der bedeutendsten archäologischen Funde Europas. Sie liegt nur 4 Gehminuten vom Hotel entfernt und bietet ein Planetarium sowie Ausstellungen zur Geschichte des Fundorts." } },
      { "@type": "Question", name: "Welche Radwege gibt es in der Region?", acceptedAnswer: { "@type": "Answer", text: "Der Unstrutradweg (189 km) von Kefferhausen nach Naumburg und der Himmelsscheibenradweg (71 km) von Nebra nach Halle/Saale verlaufen direkt am Hotel. Zudem gibt es die 26 km Rundtour Nebra–Ziegelrodaer Forst–Pretitz." } },
      { "@type": "Question", name: "Ist die Region Saale-Unstrut ein Weinanbaugebiet?", acceptedAnswer: { "@type": "Answer", text: "Ja, Saale-Unstrut ist die nördlichste Qualitätsweinregion Deutschlands mit über 1.000 Hektar Rebfläche, jahrhundertealten Steilterrassen und über 60 Weingütern. Der Weingenuss ist ein Highlight der Region." } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <DestinationsPageContent />
      <Footer />
    </>
  );
}
