import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

interface LocaleLayoutProps {
  children: React.ReactNode;
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
