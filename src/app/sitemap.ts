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
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/hotel", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/restaurant", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/events", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/ausflugsziele", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${resolvedSiteOrigin}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: locale === defaultLocale ? page.priority : page.priority * 0.95,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, `${resolvedSiteOrigin}/${l}${page.path}`])
          ),
          "x-default": `${resolvedSiteOrigin}/${defaultLocale}${page.path}`,
        },
      },
    }))
  );
}
