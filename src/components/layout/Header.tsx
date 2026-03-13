"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function CastleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 55.5H63"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 55.5V35.5L22.5 27.5L31 35.5V55.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41 55.5V24L50 16L59 24V55.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 27.5H50"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M47 55.5V41.5H53V55.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 41H26.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M45.5 29.5H54.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M50 16V11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M47 13.5H53"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
          "flex min-w-0 items-center gap-2 transition-colors duration-500 sm:gap-2.5",
          scrolled ? "text-charcoal" : "text-white"
        )}
        aria-label="Waldschlösschen Startseite"
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 sm:h-10 sm:w-10",
            scrolled
              ? "border-gold/35 bg-gold/8 text-gold-dark"
              : "border-white/30 bg-white/8 text-gold-light"
          )}
        >
          <CastleMark className="h-[1.6rem] w-[1.6rem] sm:h-[1.8rem] sm:w-[1.8rem]" />
        </span>
        <span className="flex min-w-0 flex-col items-center">
          <span
            className={cn(
              "brand-script max-w-full truncate text-[clamp(1.52rem,4.2vw,2.32rem)] leading-[0.84] sm:text-[clamp(1.7rem,4.4vw,2.48rem)]",
              scrolled ? "text-charcoal" : "text-white"
            )}
          >
            Waldschlösschen
          </span>
          <span
            className={cn(
              "mt-0.5 pl-[0.18em] text-center text-[0.5rem] font-[var(--font-body)] font-light tracking-[0.31em] uppercase sm:text-[0.58rem] sm:tracking-[0.34em]",
              scrolled ? "text-text-secondary" : "text-white/72"
            )}
          >
            Saale-Unstrut
          </span>
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
          className={cn("btn-primary btn-header", scrolled && "btn-header-scrolled")}
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
              className="btn-primary mt-4"
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
