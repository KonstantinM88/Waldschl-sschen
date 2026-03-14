import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { siteConfig } from "@/data/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: resolvedSiteUrl,
  title: {
    default: "Hotel & Restaurant Waldschlösschen | Saale-Unstrut",
    template: "%s | Waldschlösschen",
  },
  description:
    "Ihr Boutique-Hotel & Restaurant im Herzen des Naturparks Saale-Unstrut-Triasland. Genuss, Gastfreundschaft und unvergessliche Momente – direkt an der Arche Nebra.",
  openGraph: {
    title: "Hotel & Restaurant Waldschlösschen – Saale-Unstrut",
    description:
      "Boutique-Hotel, Fine Dining & Eventlocation inmitten traumhafter Natur.",
    type: "website",
    locale: "de_DE",
    alternateLocale: "en_US",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[var(--font-body)] bg-cream text-text-primary antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
