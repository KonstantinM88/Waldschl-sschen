import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/data/site";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

interface LocaleMetadataProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return <>{children}</>;
}

const resolvedSiteUrl = (() => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    siteConfig.url;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol);
  } catch {
    return new URL("http://localhost:3000");
  }
})();

export async function generateMetadata({
  params,
}: LocaleMetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const normalizedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
  const canonicalPath = `/${normalizedLocale}`;
  const siteOrigin = resolvedSiteUrl.origin;

  return {
    alternates: {
      canonical: canonicalPath,
      languages: {
        de: `${siteOrigin}/de`,
        en: `${siteOrigin}/en`,
        "x-default": `${siteOrigin}/de`,
      },
    },
    openGraph: {
      url: canonicalPath,
      locale: normalizedLocale === "de" ? "de_DE" : "en_US",
      alternateLocale: normalizedLocale === "de" ? "en_US" : "de_DE",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
