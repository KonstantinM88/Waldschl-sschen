import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { defaultLocale, locales } from "@/lib/i18n/config";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const languageAlternates = Object.fromEntries(
    locales.map((locale) => [locale, `${resolvedSiteOrigin}/${locale}`])
  );

  return locales.map((locale) => ({
    url: `${resolvedSiteOrigin}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === defaultLocale ? 1 : 0.9,
    alternates: {
      languages: {
        ...languageAlternates,
        "x-default": `${resolvedSiteOrigin}/${defaultLocale}`,
      },
    },
  }));
}
