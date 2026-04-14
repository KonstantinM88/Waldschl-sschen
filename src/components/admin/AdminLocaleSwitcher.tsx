import { getAdminDictionary, type AdminLocale } from "@/lib/admin-i18n";

interface AdminLocaleSwitcherProps {
  currentPath: string;
  locale: AdminLocale;
  variant?: "dark" | "light";
}

export default function AdminLocaleSwitcher({
  currentPath,
  locale,
  variant = "light",
}: AdminLocaleSwitcherProps) {
  const t = getAdminDictionary(locale);
  const light = variant === "light";

  return (
    <div
      className={[
        "inline-flex items-center gap-1.5 rounded-full border p-1.5 backdrop-blur-sm",
        light
          ? "border-[#ddd2c0] bg-[#f7f1e8] shadow-[0_10px_24px_rgba(28,21,16,0.05)]"
          : "border-white/10 bg-white/5",
      ].join(" ")}
    >
      <span
        className={[
          "px-2 text-[0.58rem] font-medium uppercase tracking-[0.16em]",
          light ? "text-[#8f816d]" : "text-white/54",
        ].join(" ")}
      >
        {t.common.localeLabel}
      </span>
      {(["de", "ru"] as const).map((option) => {
        const active = option === locale;

        return (
          <a
            key={option}
            href={`/api/admin/locale?lang=${option}&next=${encodeURIComponent(currentPath)}`}
            className={[
              "inline-flex min-w-[3rem] h-9 items-center justify-center rounded-full px-3.5 text-[0.64rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300",
              active
                ? light
                  ? "border border-[#d7b57e] bg-[linear-gradient(135deg,#ead8b8_0%,#ddc08d_100%)] text-[#5b4420] shadow-[0_8px_18px_rgba(128,92,39,0.18)]"
                  : "border border-[rgba(212,188,142,0.22)] bg-[rgba(212,188,142,0.18)] text-[rgba(244,234,214,0.98)]"
                : light
                  ? "text-[#6d6254] hover:bg-white hover:text-[#201b17]"
                  : "text-white/68 hover:bg-white/8 hover:text-white/92",
            ].join(" ")}
            aria-current={active ? "true" : undefined}
          >
            {t.common.languages[option]}
          </a>
        );
      })}
    </div>
  );
}
