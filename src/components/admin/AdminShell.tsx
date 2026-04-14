import Link from "next/link";
import {
  BedDouble,
  CalendarClock,
  CalendarDays,
  Gift,
  LayoutDashboard,
  LogOut,
  Mail,
  ShieldCheck,
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
      href: "/admin/rooms",
      label: t.dashboard.navigation.rooms.label,
      detail: t.dashboard.navigation.rooms.detail,
      value: `${summary.activeRooms}/${summary.totalRooms}`,
      Icon: BedDouble,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-5 text-[#201b17] sm:px-6 lg:px-8">
      {feedback ? (
        <AdminNoticeToast
          dismissLabel={t.dashboard.controls.dismiss}
          feedback={feedback}
        />
      ) : null}
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-[#d9cdb9] bg-[linear-gradient(165deg,#191613_0%,#221c18_48%,#151210_100%)] p-5 text-white shadow-[0_28px_80px_rgba(18,12,9,0.18)] sm:p-6 xl:sticky xl:top-5 xl:h-fit">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[rgba(232,214,183,0.88)]">
                <ShieldCheck className="h-3.5 w-3.5 stroke-[1.85]" />
                {t.dashboard.badge}
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-[2.2rem] leading-[0.92] text-white">
                {t.dashboard.shell.title}
              </h1>
              <p className="mt-3 text-sm font-light leading-relaxed text-white/68">
                {t.dashboard.shell.description}
              </p>
            </div>

            <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[rgba(232,214,183,0.78)]">
                {t.dashboard.shell.sessionLabel}
              </div>
              <div className="mt-2 text-lg font-medium text-white">{sessionUsername}</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[1.1rem] border border-white/10 bg-black/10 px-3 py-3">
                  <div className="text-[0.56rem] font-medium uppercase tracking-[0.16em] text-white/48">
                    {t.dashboard.shell.occupancyLabel}
                  </div>
                  <div className="mt-2 text-2xl font-[var(--font-display)] text-white">
                    {summary.occupancyRate}%
                  </div>
                </div>
                <div className="rounded-[1.1rem] border border-white/10 bg-black/10 px-3 py-3">
                  <div className="text-[0.56rem] font-medium uppercase tracking-[0.16em] text-white/48">
                    {t.dashboard.shell.inventoryLabel}
                  </div>
                  <div className="mt-2 text-2xl font-[var(--font-display)] text-white">
                    {summary.availableInventory}
                  </div>
                </div>
              </div>
            </div>

            <nav className="mt-5">
              <div className="mb-3 px-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[rgba(232,214,183,0.72)]">
                {t.dashboard.navigationLabel}
              </div>
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const active = isActivePath(currentPath, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "group flex items-center justify-between gap-3 rounded-[1.35rem] border px-4 py-3.5 transition-all duration-300",
                        active
                          ? "border-[rgba(212,188,142,0.28)] bg-[rgba(212,188,142,0.14)] shadow-[0_14px_28px_rgba(0,0,0,0.16)]"
                          : "border-white/8 bg-white/[0.035] hover:border-white/14 hover:bg-white/[0.06]",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-300",
                            active
                              ? "bg-[rgba(212,188,142,0.2)] text-[rgba(244,234,214,0.96)]"
                              : "bg-black/10 text-white/72 group-hover:text-white/88",
                          ].join(" ")}
                        >
                          <item.Icon className="h-4.5 w-4.5 stroke-[1.8]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.label}</div>
                          <div className="text-xs font-light leading-relaxed text-white/54">
                            {item.detail}
                          </div>
                        </div>
                      </div>
                      <div
                        className={[
                          "rounded-full border px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.14em]",
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

          <div className="space-y-5">
            <header className="rounded-[2rem] border border-[#dfd4c2] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:px-7 sm:py-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-[54rem]">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-[#faf7f1] px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#b4884c]">
                    {badge}
                  </div>
                  <h2 className="mt-4 font-[var(--font-display)] text-[clamp(2.2rem,4vw,3.7rem)] leading-[0.94] text-[#201b17]">
                    {title}
                  </h2>
                  <p className="mt-3 text-sm font-light leading-relaxed text-[#5d564c] sm:text-[0.98rem]">
                    {description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <AdminLocaleSwitcher
                    locale={locale}
                    currentPath={currentPath}
                    variant="light"
                  />
                  <Link
                    href="/"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-[#faf7f1] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#5d564c] transition-all duration-300 hover:border-[#d2c3af] hover:text-[#201b17]"
                  >
                    {t.dashboard.openWebsite}
                  </Link>
                  <form action="/api/admin/logout" method="get">
                    <AdminSubmitButton
                      pendingLabel={`${t.dashboard.logout}...`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[rgba(184,136,76,0.2)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]"
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
