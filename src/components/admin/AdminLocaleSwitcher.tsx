import { getAdminDictionary, type AdminLocale } from "@/lib/admin-i18n";

interface AdminLocaleSwitcherProps {
  currentPath: string;
  locale: AdminLocale;
}

export default function AdminLocaleSwitcher({
  currentPath,
  locale,
}: AdminLocaleSwitcherProps) {
  const t = getAdminDictionary(locale);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
      <span className="px-2 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-white/54">
        {t.common.localeLabel}
      </span>
      {(["de", "ru"] as const).map((option) => {
        const active = option === locale;

        return (
          <a
            key={option}
            href={`/api/admin/locale?lang=${option}&next=${encodeURIComponent(currentPath)}`}
            className={[
              "inline-flex h-9 items-center justify-center rounded-full px-3.5 text-[0.64rem] font-medium uppercase tracking-[0.16em] transition-all duration-300",
              active
                ? "border border-[rgba(212,188,142,0.22)] bg-[rgba(212,188,142,0.18)] text-[rgba(244,234,214,0.98)]"
                : "text-white/68 hover:bg-white/8 hover:text-white/92",
            ].join(" ")}
          >
            {t.common.languages[option]}
          </a>
        );
      })}
    </div>
  );
}
