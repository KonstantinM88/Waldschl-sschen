import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CircleAlert,
  Gift,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  TentTree,
} from "lucide-react";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-auth";
import {
  getAdminDictionary,
  getAdminIntlLocale,
  getAdminLocaleFromCookieStore,
  type AdminLocale,
} from "@/lib/admin-i18n";

export const dynamic = "force-dynamic";

function formatDateTime(date: Date, locale: AdminLocale) {
  return new Intl.DateTimeFormat(getAdminIntlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCurrency(value: number, locale: AdminLocale) {
  return new Intl.NumberFormat(getAdminIntlLocale(locale), {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

async function requireAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(sessionToken);

  if (!session) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return session;
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const locale = getAdminLocaleFromCookieStore(cookieStore);
  const t = getAdminDictionary(locale);
  const session = await requireAdminSession();

  const [
    totalContacts,
    unreadContacts,
    totalBookings,
    pendingBookings,
    openVouchers,
    publishedEvents,
    recentContacts,
    recentBookings,
    recentVouchers,
    upcomingEvents,
  ] = await Promise.all([
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { readAt: null } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.giftVoucher.count({ where: { isRedeemed: false } }),
    prisma.event.count({ where: { isPublished: true } }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.giftVoucher.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.event.findMany({
      where: { date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 6,
    }),
  ]);

  const statCards = [
    {
      label: t.dashboard.statCards.contacts.label,
      value: totalContacts,
      detail: t.dashboard.statCards.contacts.detail(unreadContacts),
      Icon: Mail,
    },
    {
      label: t.dashboard.statCards.bookings.label,
      value: totalBookings,
      detail: t.dashboard.statCards.bookings.detail(pendingBookings),
      Icon: CalendarDays,
    },
    {
      label: t.dashboard.statCards.vouchers.label,
      value: openVouchers,
      detail: t.dashboard.statCards.vouchers.detail,
      Icon: Gift,
    },
    {
      label: t.dashboard.statCards.events.label,
      value: publishedEvents,
      detail: t.dashboard.statCards.events.detail(upcomingEvents.length),
      Icon: TentTree,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-4 py-5 text-[#201b17] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <header className="rounded-[2rem] border border-[#d9cdb9] bg-[linear-gradient(135deg,#1d1916_0%,#28211d_54%,#161311_100%)] px-5 py-5 text-white shadow-[0_28px_80px_rgba(18,12,9,0.18)] sm:px-7 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[rgba(232,214,183,0.88)]">
                <ShieldCheck className="h-3.5 w-3.5 stroke-[1.85]" />
                {t.dashboard.badge}
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.92]">
                {t.dashboard.title}
              </h1>
              <p className="mt-3 max-w-[42rem] text-sm font-light leading-relaxed text-white/70 sm:text-[0.98rem]">
                {t.dashboard.loggedInAsPrefix}{" "}
                <span className="font-medium text-white">{session.sub}</span>
                . {t.dashboard.loggedInAsSuffix}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <AdminLocaleSwitcher locale={locale} currentPath="/admin" />
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white/86 transition-all duration-300 hover:bg-white/10"
              >
                {t.dashboard.openWebsite}
              </Link>
              <a
                href="/api/admin/logout"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[rgba(212,188,142,0.26)] bg-[rgba(212,188,142,0.12)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[rgba(244,234,214,0.96)] transition-all duration-300 hover:bg-[rgba(212,188,142,0.18)]"
              >
                <LogOut className="h-3.5 w-3.5 stroke-[2]" />
                {t.dashboard.logout}
              </a>
            </div>
          </div>
        </header>

        <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <article
              key={card.label}
              className="rounded-[1.7rem] border border-[#dfd4c2] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3ede2] text-[#b4884c]">
                  <card.Icon className="h-5 w-5 stroke-[1.7]" />
                </div>
                <div className="text-right text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
                  {card.detail}
                </div>
              </div>
              <div className="mt-6 font-[var(--font-display)] text-[2.4rem] leading-none text-[#201b17]">
                {card.value}
              </div>
              <div className="mt-2 text-sm font-light text-[#5d564c]">{card.label}</div>
            </article>
          ))}
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="rounded-[1.9rem] border border-[#dfd4c2] bg-white p-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#b4884c]">
                  {t.dashboard.sections.inboxBadge}
                </div>
                <h2 className="mt-2 font-[var(--font-display)] text-[2rem] leading-none text-[#201b17]">
                  {t.dashboard.sections.inboxTitle}
                </h2>
              </div>
              <div className="rounded-full border border-[#eadfcf] bg-[#faf7f1] px-3 py-1.5 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#8f836f]">
                {t.dashboard.sections.items(recentContacts.length)}
              </div>
            </div>

            <div className="space-y-3">
              {recentContacts.length ? (
                recentContacts.map((contact) => (
                  <article
                    key={contact.id}
                    className="rounded-[1.45rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-medium text-[#201b17]">{contact.name}</h3>
                          {contact.readAt ? null : (
                            <span className="rounded-full border border-[#f1c7bb] bg-[#fff1ed] px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#a14f43]">
                              {t.dashboard.sections.unread}
                            </span>
                          )}
                          <span className="rounded-full border border-[#eadfcf] bg-white px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                            {contact.locale.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2 text-sm font-light text-[#5d564c]">{contact.subject}</div>
                        <p className="mt-3 text-sm font-light leading-relaxed text-[#4f483f]">
                          {truncate(contact.message, 220)}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#6c6459]">
                          <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 hover:text-[#201b17]">
                            <Mail className="h-4 w-4 stroke-[1.8]" />
                            {contact.email}
                          </a>
                          {contact.phone ? (
                            <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-2 hover:text-[#201b17]">
                              <Phone className="h-4 w-4 stroke-[1.8]" />
                              {contact.phone}
                            </a>
                          ) : null}
                        </div>
                      </div>
                      <div className="shrink-0 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                        {formatDateTime(contact.createdAt, locale)}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.45rem] border border-dashed border-[#ddd1be] bg-[#faf7f1] px-4 py-6 text-sm font-light text-[#6c6459]">
                  {t.dashboard.sections.noContacts}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <section className="rounded-[1.9rem] border border-[#dfd4c2] bg-white p-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:p-6">
              <div className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#b4884c]">
                {t.dashboard.sections.bookingBadge}
              </div>
              <h2 className="mt-2 font-[var(--font-display)] text-[1.8rem] leading-none text-[#201b17]">
                {t.dashboard.sections.bookingTitle}
              </h2>

              <div className="mt-5 space-y-3">
                {recentBookings.length ? (
                  recentBookings.map((booking) => (
                    <article
                      key={booking.id}
                      className="rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-[#201b17]">{booking.guestName}</h3>
                          <div className="mt-1 text-sm font-light text-[#5d564c]">{booking.roomType}</div>
                        </div>
                        <span className="rounded-full border border-[#eadfcf] bg-white px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                          {t.dashboard.bookingStatuses[booking.status]}
                        </span>
                      </div>
                      <div className="mt-3 text-sm font-light leading-relaxed text-[#4f483f]">
                        {formatDateTime(booking.checkIn, locale)} - {formatDateTime(booking.checkOut, locale)}
                      </div>
                      <a href={`mailto:${booking.guestEmail}`} className="mt-3 inline-flex items-center gap-2 text-sm text-[#6c6459] hover:text-[#201b17]">
                        <Mail className="h-4 w-4 stroke-[1.8]" />
                        {booking.guestEmail}
                      </a>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-dashed border-[#ddd1be] bg-[#faf7f1] px-4 py-5 text-sm font-light text-[#6c6459]">
                    {t.dashboard.sections.noBookings}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.9rem] border border-[#dfd4c2] bg-white p-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:p-6">
              <div className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#b4884c]">
                {t.dashboard.sections.vouchersBadge}
              </div>
              <h2 className="mt-2 font-[var(--font-display)] text-[1.8rem] leading-none text-[#201b17]">
                {t.dashboard.sections.vouchersTitle}
              </h2>

              <div className="mt-5 space-y-3">
                {recentVouchers.length ? (
                  recentVouchers.map((voucher) => (
                    <article
                      key={voucher.id}
                      className="rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-[#201b17]">{voucher.buyerName}</h3>
                          <div className="mt-1 text-sm font-light text-[#5d564c]">{voucher.code}</div>
                        </div>
                        <span className="rounded-full border border-[#eadfcf] bg-white px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                          {formatCurrency(voucher.amount, locale)}
                        </span>
                      </div>
                      <a href={`mailto:${voucher.buyerEmail}`} className="mt-3 inline-flex items-center gap-2 text-sm text-[#6c6459] hover:text-[#201b17]">
                        <Mail className="h-4 w-4 stroke-[1.8]" />
                        {voucher.buyerEmail}
                      </a>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-dashed border-[#ddd1be] bg-[#faf7f1] px-4 py-5 text-sm font-light text-[#6c6459]">
                    {t.dashboard.sections.noVouchers}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.9rem] border border-[#dfd4c2] bg-white p-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3ede2] text-[#b4884c]">
                  <CircleAlert className="h-4.5 w-4.5 stroke-[1.9]" />
                </div>
                <div>
                  <div className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#b4884c]">
                    {t.dashboard.sections.eventsBadge}
                  </div>
                  <h2 className="mt-2 font-[var(--font-display)] text-[1.8rem] leading-none text-[#201b17]">
                    {t.dashboard.sections.eventsTitle}
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {upcomingEvents.length ? (
                  upcomingEvents.map((event) => (
                    <article
                      key={event.id}
                      className="rounded-[1.35rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4"
                    >
                      <h3 className="text-sm font-medium text-[#201b17]">{event.title}</h3>
                      <div className="mt-1 text-sm font-light text-[#5d564c]">
                        {formatDateTime(event.date, locale)}
                      </div>
                      <div className="mt-3 text-sm font-light leading-relaxed text-[#4f483f]">
                        {truncate(event.description ?? t.dashboard.sections.noDescription, 140)}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[1.35rem] border border-dashed border-[#ddd1be] bg-[#faf7f1] px-4 py-5 text-sm font-light text-[#6c6459]">
                    {t.dashboard.sections.noEvents}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
