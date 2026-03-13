"use client";

import { useTranslations } from "next-intl";
import { Gift } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function VoucherSection() {
  const t = useTranslations("voucher");

  return (
    <section className="py-[clamp(5rem,10vw,9rem)] px-[clamp(1.5rem,5vw,6rem)]" id="gutschein">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <Reveal>
          <div className="relative aspect-[4/3] bg-gradient-to-br from-charcoal to-forest flex items-center justify-center overflow-hidden">
            <div className="absolute inset-5 border border-gold/20" />
            <div className="text-center text-white p-12 relative z-10">
              <Gift className="w-16 h-16 text-gold-light stroke-1 mx-auto mb-8" />
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-gold-light mb-4">
                {t("visualLabel")}
              </div>
              <div className="font-[var(--font-display)] text-4xl font-light italic">
                {t("visualTitle")}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <span className="label-caps text-gold">{t("label")}</span>
          <h2 className="heading-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-charcoal mt-5 mb-6">
            {t("title")} <em>{t("titleEmphasis")}</em>
          </h2>
          <div className="gold-divider mb-8" />
          <p className="body-text max-w-[620px]">{t("text1")}</p>
          <p className="body-text max-w-[620px] mt-4">{t("text2")}</p>
          <a href="#kontakt" className="btn-primary mt-8 inline-flex">{t("cta")}</a>
        </Reveal>
      </div>
    </section>
  );
}
