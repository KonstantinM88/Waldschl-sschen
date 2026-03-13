import { useTranslations } from "next-intl";
import Link from "next/link";
import { siteConfig } from "@/data/site";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-[#111] text-white py-[clamp(4rem,8vw,6rem)] px-[clamp(1.5rem,5vw,6rem)]" role="contentinfo">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-white/8">
          {/* Brand */}
          <div>
            <Link href="/" className="block font-[var(--font-display)] text-2xl font-medium tracking-[0.02em] mb-6">
              Waldschlösschen
              <span className="block text-[0.65rem] font-[var(--font-body)] font-light tracking-[0.25em] uppercase opacity-70 mt-0.5">
                Saale-Unstrut · seit 2012
              </span>
            </Link>
            <p className="text-sm font-light leading-relaxed opacity-60 max-w-[320px]">
              {t("tagline")}
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-gold-light mb-6">
              {t("discover")}
            </h4>
            <nav className="flex flex-col">
              <a href="#hotel" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{nav("hotel")}</a>
              <a href="#restaurant" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{nav("restaurant")}</a>
              <a href="#events" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{nav("events")}</a>
              <a href="#ausflugsziele" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{nav("destinations")}</a>
            </nav>
          </div>

          {/* Service */}
          <div>
            <h4 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-gold-light mb-6">
              {t("service")}
            </h4>
            <nav className="flex flex-col">
              <a href="#buchen" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{t("bookRoom")}</a>
              <a href="#restaurant" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{t("reserveTable")}</a>
              <a href="#gutschein" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{t("vouchers")}</a>
              <a href="#events" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{t("arrangements")}</a>
              <a href="#kontakt" className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">{nav("contact")}</a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-gold-light mb-6">
              {nav("contact")}
            </h4>
            <div className="flex flex-col">
              <a href={`tel:${siteConfig.phone}`} className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">
                {siteConfig.phoneDisplay}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="text-sm font-light leading-[2.2] opacity-55 hover:opacity-100 hover:text-gold-light transition-all">
                {siteConfig.email}
              </a>
              <span className="text-sm font-light leading-[2.2] opacity-55">{siteConfig.address.street}</span>
              <span className="text-sm font-light leading-[2.2] opacity-55">{siteConfig.address.zip} {siteConfig.address.city}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-xs font-light opacity-40 gap-4">
          <span>{t("copyright")}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-100 transition-opacity">{t("privacy")}</a>
            <a href="#" className="hover:opacity-100 transition-opacity">{t("imprint")}</a>
            <a href="#" className="hover:opacity-100 transition-opacity">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
