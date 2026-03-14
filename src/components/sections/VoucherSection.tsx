"use client";

import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";

export default function VoucherSection() {
  const t = useTranslations("voucher");
  const voucherBannerSrcSet = [
    "/gutschein_banner_800w.webp 800w",
    "/gutschein_banner_1200w.webp 1200w",
    "/gutschein_banner_1600w.webp 1600w",
    "/gutschein_banner_1920w.webp 1920w",
  ].join(", ");

  return (
    <section className="voucher-section py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)] relative overflow-hidden" id="gutschein">
      <div className="voucher-orb voucher-orb-left" />
      <div className="voucher-orb voucher-orb-right" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2.5rem,6vw,7rem)] items-center relative z-10">
        <Reveal>
          <div className="voucher-media-card group">
            <div className="voucher-media-surface">
              <video
                className="voucher-media-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/gutschein_banner_1200w.webp"
                aria-hidden="true"
              >
                <source src="/gutschein_video.webm" type="video/webm" />
                <img
                  src="/gutschein_banner_1920w.webp"
                  srcSet={voucherBannerSrcSet}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  alt=""
                  aria-hidden="true"
                  className="voucher-media-video"
                  loading="lazy"
                />
              </video>

              <div className="voucher-media-overlay" />
              <div className="voucher-media-frame voucher-media-frame-outer" />
              <div className="voucher-media-frame voucher-media-frame-inner" />

            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="voucher-content-panel">
            <span className="label-caps text-gold">{t("label")}</span>
            <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
              {t("title")} <em>{t("titleEmphasis")}</em>
            </h2>
            <div className="gold-divider mb-8" />
            <p className="body-text max-w-[620px]">{t("text1")}</p>
            <p className="body-text max-w-[620px] mt-4">{t("text2")}</p>
            <a href="#kontakt" className="btn-primary mt-8 inline-flex">{t("cta")}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
