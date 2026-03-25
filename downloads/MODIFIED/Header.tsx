"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import NextLink from "next/link";
import {usePathname as useNextPathname} from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import {locales} from "@/lib/i18n/config";
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
  const pathname = useNextPathname();
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setLanguageOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const releaseOverlayLock = () => {
      setMobileOpen(false);
      setLanguageOpen(false);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    window.addEventListener("hashchange", releaseOverlayLock);
    window.addEventListener("popstate", releaseOverlayLock);

    return () => {
      window.removeEventListener("hashchange", releaseOverlayLock);
      window.removeEventListener("popstate", releaseOverlayLock);
    };
  }, []);

  const navLinks = [
    { href: "/hotel", label: t("hotel"), isPage: true },
    { href: "#restaurant", label: t("restaurant"), isPage: false },
    { href: "#events", label: t("events"), isPage: false },
    { href: "#ausflugsziele", label: t("destinations"), isPage: false },
    { href: "#kontakt", label: t("contact"), isPage: false },
  ];

  const activeLocale = pathname.startsWith("/en") ? "en" : "de";
  const localePrefixPattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`);
  const currentPath = pathname.replace(localePrefixPattern, "") || "/";
  const homeHref = `/${activeLocale}`;
  const languageOptions = [
    {
      value: "de" as const,
      shortLabel: "DE",
      label: "Deutsch",
      subtitle: "German",
      flagClassName: "language-flag-de",
    },
    {
      value: "en" as const,
      shortLabel: "EN",
      label: "English",
      subtitle: "English",
      flagClassName: "language-flag-en",
    },
  ];

  const buildLocaleHref = (nextLocale: "de" | "en") =>
    `/${nextLocale}${currentPath === "/" ? "" : currentPath}`;

  const handleLocaleChange = (nextLocale: "de" | "en") => {
    const nextHref = buildLocaleHref(nextLocale);

    if (nextHref !== pathname) {
      window.location.assign(nextHref);
    }
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setLanguageOpen(false);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-[clamp(1.5rem,4vw,4rem)] h-20 flex items-center justify-between transition-all duration-500",
        mobileOpen
          ? "bg-transparent h-[70px]"
          : scrolled
          ? "bg-cream/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)] h-[70px]"
          : "bg-transparent"
      )}
      role="banner"
    >
      <NextLink
        href={homeHref}
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
              "header-script mt-0.5 text-center text-[0.82rem] leading-none sm:text-[0.92rem]",
              scrolled ? "text-text-secondary" : "text-white/72"
            )}
          >
            Saale-Unstrut
          </span>
        </span>
      </NextLink>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center gap-5 xl:gap-6" role="navigation" aria-label="Hauptnavigation">
        {navLinks.map((link) => {
          const linkClasses = cn(
            "header-script header-nav-readable relative whitespace-nowrap text-[1.28rem] leading-none transition-colors duration-300 group xl:text-[1.4rem]",
            scrolled ? "header-nav-readable-scrolled text-charcoal" : "text-white/95"
          );

          return link.isPage ? (
            <NextLink key={link.href} href={`/${activeLocale}${link.href}`} className={linkClasses}>
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </NextLink>
          ) : (
            <a key={link.href} href={link.href} className={linkClasses}>
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          );
        })}
        <div className="relative" ref={languageMenuRef}>
          <button
            type="button"
            aria-label="Sprache wählen"
            aria-haspopup="menu"
            aria-expanded={languageOpen}
            onClick={() => setLanguageOpen((open) => !open)}
            className={cn("language-trigger", scrolled && "language-trigger-scrolled")}
          >
            <span className="language-trigger-icon" aria-hidden="true">
              <Globe2 className="h-3.5 w-3.5 stroke-[1.8]" />
            </span>
            <span className="language-trigger-code">{activeLocale.toUpperCase()}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 stroke-[1.8] transition-transform duration-300",
                languageOpen && "rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {languageOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className={cn("language-menu", scrolled && "language-menu-scrolled")}
                role="menu"
              >
                {languageOptions.map((option) => {
                  const isActive = option.value === activeLocale;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={isActive}
                      className={cn("language-option", isActive && "language-option-active")}
                      onClick={() => {
                        setLanguageOpen(false);
                        handleLocaleChange(option.value);
                      }}
                    >
                      <span className="language-option-main">
                        <span
                          className={cn("language-flag", option.flagClassName)}
                          aria-hidden="true"
                        />
                        <span className="language-option-copy">
                          <span className="language-option-label">{option.label}</span>
                          <span className="language-option-meta">{option.subtitle}</span>
                        </span>
                      </span>
                      <Check
                        className={cn(
                          "h-4 w-4 stroke-[2] transition-opacity duration-200",
                          isActive ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        onClick={() => {
          if (mobileOpen) {
            closeMobileMenu();
            return;
          }
          setMobileOpen(true);
        }}
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
            transition={{ duration: 0.24 }}
            className="mobile-menu-shell"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeMobileMenu();
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 12 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-menu-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mobile-menu-kicker"
              >
                Menu
              </motion.p>

              <div className="mobile-menu-links">
                {navLinks.map((link, i) => {
                  const mobileProps = {
                    initial: { opacity: 0, y: 16 } as const,
                    animate: { opacity: 1, y: 0 } as const,
                    transition: { delay: i * 0.05 + 0.1 },
                    className: "mobile-menu-link header-script",
                    onClick: closeMobileMenu,
                  };

                  return link.isPage ? (
                    <motion.div key={link.href} {...mobileProps}>
                      <NextLink
                        href={`/${activeLocale}${link.href}`}
                        className="mobile-menu-link header-script"
                        onClick={closeMobileMenu}
                      >
                        {link.label}
                      </NextLink>
                    </motion.div>
                  ) : (
                    <motion.a key={link.href} href={link.href} {...mobileProps}>
                      {link.label}
                    </motion.a>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                className="mobile-language-row"
              >
                {languageOptions.map((option) => {
                  const isActive = option.value === activeLocale;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={cn("language-chip", isActive && "language-chip-active")}
                      onClick={() => {
                        closeMobileMenu();
                        handleLocaleChange(option.value);
                      }}
                    >
                      <span className="language-chip-row">
                        <span
                          className={cn("language-flag", option.flagClassName)}
                          aria-hidden="true"
                        />
                        <span className="language-chip-title">{option.shortLabel}</span>
                      </span>
                      <span className="language-chip-subtitle">{option.label}</span>
                    </button>
                  );
                })}
              </motion.div>

              <motion.a
                href="#buchen"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="btn-primary mobile-menu-book"
                onClick={closeMobileMenu}
              >
                {t("book")}
              </motion.a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
