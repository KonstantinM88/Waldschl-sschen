"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function HeroSection() {
  const t = useTranslations("hero");
  const heroImageSrcSet = [
    "/restaurant_terrace_800w.webp 800w",
    "/restaurant_terrace_1200w.webp 1200w",
    "/restaurant_terrace_1600w.webp 1600w",
    "/restaurant_terrace_1920w.webp 1920w",
  ].join(", ");

  const reveal = {
    initial: { opacity: 0, y: 60, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <section
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/restaurant_terrace_1920w.webp"
          srcSet={heroImageSrcSet}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,14,14,0.42) 0%, rgba(14,14,14,0.24) 32%, rgba(14,14,14,0.42) 66%, rgba(14,14,14,0.72) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[960px] px-2 text-center text-white sm:px-8">
        <motion.div
          className="mb-6 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-[var(--font-body)] text-[0.62rem] font-normal tracking-[0.28em] uppercase text-gold-light sm:mb-8 sm:text-[0.7rem] sm:tracking-[0.35em]"
          {...reveal}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="opacity-50">—</span>
          {t("badge")}
          <span className="opacity-50">—</span>
        </motion.div>

        <motion.h1
          className="mb-5 font-[var(--font-display)] text-[clamp(3rem,10vw,6rem)] font-light leading-[0.98] tracking-[-0.02em] text-balance sm:mb-6 sm:leading-[1.02]"
          {...reveal}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("title")}
          <br />
          <em className="italic font-normal text-gold-light">{t("titleEmphasis")}</em>
        </motion.h1>

        <motion.p
          className="mx-auto mb-10 max-w-[640px] font-[var(--font-body)] text-[clamp(1rem,2.4vw,1.18rem)] font-light leading-[1.7] text-white/85 sm:mb-12"
          {...reveal}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-5"
          {...reveal}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#buchen" className="btn-primary justify-center sm:min-w-[220px]">
            {t("ctaBook")}
          </a>
          <a href="#restaurant" className="btn-outline-light justify-center sm:min-w-[220px]">
            {t("ctaTable")}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/55 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        whileHover={{ y: 2 }}
      >
        <motion.span
          className="text-[0.65rem] tracking-[0.24em] uppercase"
          animate={{ opacity: [0.55, 0.95, 0.55], y: [0, 2, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {t("scroll")}
        </motion.span>
        <div className="relative flex h-[56px] w-[32px] items-start justify-center rounded-full border border-white/30 bg-white/8 p-1 shadow-[0_14px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <motion.span
            className="block h-2.5 w-2.5 rounded-full bg-gold-light shadow-[0_0_16px_rgba(212,188,142,0.8)]"
            animate={{ y: [0, 20, 0], opacity: [1, 0.35, 1], scale: [1, 0.86, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          />
        </div>
      </motion.a>
    </section>
  );
}
