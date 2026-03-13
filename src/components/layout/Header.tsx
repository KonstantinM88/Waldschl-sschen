"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { href: "#hotel", label: t("hotel") },
    { href: "#restaurant", label: t("restaurant") },
    { href: "#events", label: t("events") },
    { href: "#ausflugsziele", label: t("destinations") },
    { href: "#kontakt", label: t("contact") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-[clamp(1.5rem,4vw,4rem)] h-20 flex items-center justify-between transition-all duration-500",
        scrolled
          ? "bg-cream/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)] h-[70px]"
          : "bg-transparent"
      )}
      role="banner"
    >
      <Link
        href="/"
        className={cn(
          "font-[var(--font-display)] text-[1.35rem] font-medium tracking-[0.02em] transition-colors duration-500",
          scrolled ? "text-charcoal" : "text-white"
        )}
        aria-label="Waldschlösschen Startseite"
      >
        Waldschlösschen
        <span className="block text-[0.65rem] font-[var(--font-body)] font-light tracking-[0.25em] uppercase opacity-70 mt-0.5">
          Saale-Unstrut
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-10" role="navigation" aria-label="Hauptnavigation">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "text-[0.8rem] font-normal tracking-[0.08em] uppercase transition-colors duration-300 relative group",
              scrolled ? "text-text-secondary" : "text-white/85"
            )}
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
        <a
          href="/en"
          className={cn(
            "text-[0.7rem] tracking-[0.1em] uppercase opacity-60 hover:opacity-100 transition-opacity",
            scrolled ? "text-text-secondary" : "text-white/85"
          )}
        >
          EN
        </a>
        <a
          href="#buchen"
          className={cn(
            "text-[0.75rem] font-medium tracking-[0.12em] uppercase px-6 py-2.5 border transition-all duration-300 hover:bg-gold hover:border-gold hover:text-white",
            scrolled ? "border-charcoal text-charcoal" : "border-white/40 text-white"
          )}
        >
          {t("book")}
        </a>
      </nav>

      {/* Mobile Toggle */}
      <button
        className="lg:hidden flex flex-col gap-[5px] p-2 z-[1001]"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
      >
        <span
          className={cn(
            "w-6 h-[1.5px] transition-all duration-300",
            scrolled && !mobileOpen ? "bg-charcoal" : "bg-white",
            mobileOpen && "rotate-45 translate-y-[6.5px]"
          )}
        />
        <span
          className={cn(
            "w-6 h-[1.5px] transition-all duration-300",
            scrolled && !mobileOpen ? "bg-charcoal" : "bg-white",
            mobileOpen && "opacity-0"
          )}
        />
        <span
          className={cn(
            "w-6 h-[1.5px] transition-all duration-300",
            scrolled && !mobileOpen ? "bg-charcoal" : "bg-white",
            mobileOpen && "-rotate-45 -translate-y-[6.5px]"
          )}
        />
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-charcoal flex flex-col items-center justify-center gap-8 z-[999]"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
                className="text-white text-xl tracking-[0.15em] uppercase font-light"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#buchen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gold text-lg tracking-[0.15em] uppercase border border-gold px-8 py-3 mt-4"
              onClick={() => setMobileOpen(false)}
            >
              {t("book")}
            </motion.a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
