import Link from "next/link";
import {
  BedDouble,
  CalendarClock,
  CalendarDays,
  Gift,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";
import AdminNoticeToast from "@/components/admin/AdminNoticeToast";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import { getAdminDictionary, type AdminLocale } from "@/lib/admin-i18n";
import type { AdminSummary } from "@/lib/admin-dashboard";
import type { AdminFeedbackMessage } from "@/lib/admin-feedback";

interface AdminShellProps {
  badge: string;
  children: React.ReactNode;
  currentPath: string;
  description: string;
  feedback?: AdminFeedbackMessage | null;
  locale: AdminLocale;
  sessionUsername: string;
  summary: AdminSummary;
  title: string;
}

function isActivePath(currentPath: string, href: string) {
  const normalizedPath = currentPath.split("?")[0];

  if (href === "/admin") {
    return normalizedPath === href;
  }

  return normalizedPath === href || normalizedPath.startsWith(`${href}/`);
}

export default function AdminShell({
  badge,
  children,
  currentPath,
  description,
  feedback = null,
  locale,
  sessionUsername,
  summary,
  title,
}: AdminShellProps) {
  const t = getAdminDictionary(locale);

  const navigationItems = [
    {
      href: "/admin",
      label: t.dashboard.navigation.overview.label,
      detail: t.dashboard.navigation.overview.detail,
      value: `${summary.occupancyRate}%`,
      Icon: LayoutDashboard,
    },
    {
      href: "/admin/contacts",
      label: t.dashboard.navigation.contacts.label,
      detail: t.dashboard.navigation.contacts.detail,
      value: String(summary.unreadContacts),
      Icon: Mail,
    },
    {
      href: "/admin/bookings",
      label: t.dashboard.navigation.bookings.label,
      detail: t.dashboard.navigation.bookings.detail,
      value: String(summary.pendingBookings),
      Icon: CalendarDays,
    },
    {
      href: "/admin/vouchers",
      label: t.dashboard.navigation.vouchers.label,
      detail: t.dashboard.navigation.vouchers.detail,
      value: String(summary.openVouchers),
      Icon: Gift,
    },
    {
      href: "/admin/events",
      label: t.dashboard.navigation.events.label,
      detail: t.dashboard.navigation.events.detail,
      value: String(summary.upcomingEvents),
      Icon: CalendarClock,
    },
    {
      href: "/admin/menu",
      label: t.dashboard.navigation.menu.label,
      detail: t.dashboard.navigation.menu.detail,
      value: `${summary.publishedMenuItems}/${summary.totalMenuItems}`,
      Icon: UtensilsCrossed,
    },
    {
      href: "/admin/rooms",
      label: t.dashboard.navigation.rooms.label,
      detail: t.dashboard.navigation.rooms.detail,
      value: `${summary.activeRooms}/${summary.totalRooms}`,
      Icon: BedDouble,
    },
  ];
  const activeNavigationItem =
    navigationItems.find((item) => isActivePath(currentPath, item.href)) ??
    navigationItems[0];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3efe7] px-3 py-4 text-[#201b17] sm:px-5 lg:px-7">
      {feedback ? (
        <AdminNoticeToast
          dismissLabel={t.dashboard.controls.dismiss}
          feedback={feedback}
        />
      ) : null}
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[292px_minmax(0,1fr)] xl:gap-5">
          <aside className="rounded-2xl border border-[#2e2822] bg-[#1d1915] p-3 text-white shadow-[0_24px_70px_rgba(24,18,13,0.2)] sm:p-4 xl:sticky xl:top-5 xl:max-h-[calc(100vh-2.5rem)] xl:overflow-y-auto xl:p-5 xl:[scrollbar-color:rgba(216,189,132,0.45)_transparent] xl:[scrollbar-width:thin]">
            <details className="group/mobile-nav xl:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-3 transition-colors duration-300 hover:bg-white/[0.07]">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/12 text-white/82">
                    <Menu className="h-5 w-5 stroke-[1.9]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[rgba(232,214,183,0.72)]">
                      {t.dashboard.navigationLabel}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-semibold text-white">
                      {activeNavigationItem.label}
                    </span>
                  </span>
                </span>
                <span className="rounded-full border border-white/10 bg-black/12 px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-white/72">
                  {activeNavigationItem.value}
                </span>
              </summary>

              <nav className="mt-3 grid grid-cols-1 gap-2">
                {navigationItems.map((item) => {
                  const active = isActivePath(currentPath, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "group flex min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-3 transition-all duration-300",
                        active
                          ? "border-[rgba(212,188,142,0.32)] bg-[rgba(212,188,142,0.16)] shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                          : "border-white/8 bg-white/[0.035] hover:border-white/16 hover:bg-white/[0.07]",
                      ].join(" ")}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={[
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                            active
                              ? "bg-[rgba(212,188,142,0.2)] text-[rgba(244,234,214,0.96)]"
                              : "bg-black/10 text-white/72 group-hover:text-white/88",
                          ].join(" ")}
                        >
                          <item.Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-white">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block truncate text-xs font-light text-white/54">
                            {item.detail}
                          </span>
                        </span>
                      </span>
                      <span
                        className={[
                          "rounded-full border px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.14em]",
                          active
                            ? "border-[rgba(233,216,186,0.2)] bg-[rgba(233,216,186,0.12)] text-[rgba(255,248,235,0.96)]"
                            : "border-white/10 bg-black/10 text-white/68",
                        ].join(" ")}
                      >
                        {item.value}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </details>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[rgba(232,214,183,0.88)]">
                <ShieldCheck className="h-3.5 w-3.5 stroke-[1.85]" />
                {t.dashboard.badge}
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-[2.05rem] leading-[0.92] text-white">
                {t.dashboard.shell.title}
              </h1>
              <p className="mt-3 text-sm font-light leading-relaxed text-white/68">
                {t.dashboard.shell.description}
              </p>
            </div>

            <div className="mt-4 hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 xl:block">
              <div className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[rgba(232,214,183,0.78)]">
                {t.dashboard.shell.sessionLabel}
              </div>
              <div className="mt-2 text-lg font-medium text-white">{sessionUsername}</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/12 px-3 py-3">
                  <div className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-white/48">
                    {t.dashboard.shell.occupancyLabel}
                  </div>
                  <div className="mt-2 text-2xl font-[var(--font-display)] text-white">
                    {summary.occupancyRate}%
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/12 px-3 py-3">
                  <div className="text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-white/48">
                    {t.dashboard.shell.inventoryLabel}
                  </div>
                  <div className="mt-2 text-2xl font-[var(--font-display)] text-white">
                    {summary.availableInventory}
                  </div>
                </div>
              </div>
            </div>

            <nav className="hidden xl:mt-4 xl:block">
              <div className="mb-3 hidden px-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[rgba(232,214,183,0.72)] xl:block">
                {t.dashboard.navigationLabel}
              </div>
              <div className="space-y-2 pr-1">
                {navigationItems.map((item) => {
                  const active = isActivePath(currentPath, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "group flex min-w-[10.5rem] shrink-0 items-center justify-between gap-3 rounded-xl border px-3 py-3 transition-all duration-300 sm:min-w-[12rem] xl:min-w-0 xl:px-3.5 xl:py-3",
                        active
                          ? "border-[rgba(212,188,142,0.32)] bg-[rgba(212,188,142,0.16)] shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                          : "border-white/8 bg-white/[0.035] hover:border-white/16 hover:bg-white/[0.07]",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300",
                            active
                              ? "bg-[rgba(212,188,142,0.2)] text-[rgba(244,234,214,0.96)]"
                              : "bg-black/10 text-white/72 group-hover:text-white/88",
                          ].join(" ")}
                        >
                          <item.Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white">{item.label}</div>
                          <div className="hidden text-xs font-light leading-relaxed text-white/54 sm:block">
                            {item.detail}
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          "rounded-full border px-2.5 py-1 text-[0.54rem] font-semibold uppercase tracking-[0.12em] xl:px-2.5 xl:text-[0.58rem] xl:tracking-[0.14em]",
                          active
                            ? "border-[rgba(233,216,186,0.2)] bg-[rgba(233,216,186,0.12)] text-[rgba(255,248,235,0.96)]"
                            : "border-white/10 bg-black/10 text-white/68",
                        ].join(" ")}
                      >
                        {item.value}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          <div className="min-w-0 space-y-4 xl:space-y-5">
            <header className="rounded-2xl border border-[#ded3c3] bg-[#fffdf9] px-4 py-4 shadow-[0_14px_34px_rgba(37,28,20,0.055)] sm:px-6 sm:py-5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="min-w-0 max-w-[54rem]">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#eadfcf] bg-[#faf7f1] px-3 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
                    {badge}
                  </div>
                  <h2 className="mt-4 max-w-[13ch] break-words font-[var(--font-display)] text-[clamp(1.85rem,7vw,3.25rem)] leading-[0.96] text-[#1f1b17] [overflow-wrap:anywhere] md:max-w-[18ch]">
                    {title}
                  </h2>
                  <p className="mt-3 text-sm font-light leading-relaxed text-[#5d564c] sm:text-[0.98rem]">
                    {description}
                  </p>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-[auto_auto] xl:flex xl:flex-wrap xl:justify-end">
                  <AdminLocaleSwitcher
                    locale={locale}
                    currentPath={currentPath}
                    variant="light"
                  />
                  <Link
                    href="/"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#dfd2c0] bg-[#faf7f1] px-5 text-center text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#5d564c] transition-all duration-300 hover:border-[#cdb99d] hover:bg-white hover:text-[#201b17] sm:w-auto"
                  >
                    {t.dashboard.openWebsite}
                  </Link>
                  <form action="/api/admin/logout" method="get" className="w-full sm:w-auto">
                    <AdminSubmitButton
                      pendingLabel={`${t.dashboard.logout}...`}
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#cda867] bg-[#bf9556] px-5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(128,92,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ad8448] sm:w-auto"
                    >
                      <LogOut className="h-3.5 w-3.5 stroke-[2]" />
                      {t.dashboard.logout}
                    </AdminSubmitButton>
                  </form>
                </div>
              </div>
            </header>

            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
