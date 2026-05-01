import type { Metadata, Viewport } from "next";
import { Alex_Brush, Cormorant_Garamond, Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { siteConfig } from "@/data/site";
import { defaultOpenGraphImages } from "@/lib/seo";
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
  applicationName: siteConfig.shortName,
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
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Hotel & Restaurant Waldschlösschen | Saale-Unstrut",
    description:
      "Boutique-Hotel, Restaurant und Eventlocation in der Saale-Unstrut Region.",
    images: defaultOpenGraphImages,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#15120f",
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
