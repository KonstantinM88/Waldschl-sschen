import { siteConfig } from "@/data/site";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

interface LocaleHeadProps {
  params: Promise<{ locale: string }>;
}

const resolvedSiteOrigin = (() => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    siteConfig.url;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return "http://localhost:3000";
  }
})();

export default async function Head({ params }: LocaleHeadProps) {
  const { locale } = await params;
  const normalizedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  const canonical = `${resolvedSiteOrigin}/${normalizedLocale}`;

  return (
    <>
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="de" href={`${resolvedSiteOrigin}/de`} />
      <link rel="alternate" hrefLang="en" href={`${resolvedSiteOrigin}/en`} />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${resolvedSiteOrigin}/de`}
      />
    </>
  );
}
