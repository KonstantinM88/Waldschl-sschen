import type { Metadata } from "next";
import { Alex_Brush, Cormorant_Garamond, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { siteConfig } from "@/data/site";
import "./globals.css";

const fontBody = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-body-next",
});

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display-next",
});

const fontScript = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-script-next",
});

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
    <html
      lang={locale}
      className={`scroll-smooth ${fontBody.variable} ${fontDisplay.variable} ${fontScript.variable}`}
    >
      <body className="font-[var(--font-body)] bg-cream text-text-primary antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
