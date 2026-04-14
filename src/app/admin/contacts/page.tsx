import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { bulkSetContactReadStateAction } from "@/app/admin/contact-actions";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import {
  AdminEmptyState,
  AdminFilterBar,
  AdminMetricCard,
  AdminPagination,
  AdminPanel,
  AdminSelectField,
} from "@/components/admin/AdminUi";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import {
  buildAdminPath,
  getAdminFeedbackFromSearchParams,
} from "@/lib/admin-feedback";
import {
  formatAdminDateTime,
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  getContactsPage,
  normalizeAdminPageParam,
  normalizeAdminSearchQuery,
  normalizeContactReadFilter,
  resolveAdminSearchParams,
  truncate,
} from "@/lib/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);
  const query = normalizeAdminSearchQuery(getAdminSearchParam(params, "q"));
  const readState = normalizeContactReadFilter(getAdminSearchParam(params, "read"));
  const page = normalizeAdminPageParam(getAdminSearchParam(params, "page"));

  const [{ locale, session, t }, summary, contactPage] = await Promise.all([
    getAdminPageContext("/admin/contacts"),
    getAdminSummary(),
    getContactsPage({
      page,
      pageSize: 10,
      query,
      readState,
    }),
  ]);

  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );
  const currentListPath = buildAdminPath("/admin/contacts", {
    q: query || undefined,
    read: readState !== "all" ? readState : undefined,
    page: page > 1 ? String(page) : undefined,
  });
  const exportHref = buildAdminPath("/api/admin/export/contacts", {
    q: query || undefined,
    read: readState !== "all" ? readState : undefined,
  });

  return (
    <AdminShell
      badge={t.dashboard.pages.contacts.badge}
      currentPath={currentListPath}
      description={t.dashboard.pages.contacts.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.pages.contacts.title}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:max-w-[760px]">
        <AdminMetricCard
          detail={t.dashboard.sections.items(summary.totalContacts)}
          Icon={Mail}
          label={t.dashboard.pages.contacts.stats.total}
          value={summary.totalContacts}
        />
        <AdminMetricCard
          detail={t.dashboard.sections.unread}
          Icon={Mail}
          label={t.dashboard.pages.contacts.stats.unread}
          value={summary.unreadContacts}
        />
      </section>

      <AdminPanel
        actionHref={exportHref}
        actionLabel={t.dashboard.controls.exportCsv}
        badge={t.dashboard.sections.inboxBadge}
        description={t.dashboard.sections.items(contactPage.pagination.totalItems)}
        title={t.dashboard.sections.inboxTitle}
      >
        <AdminFilterBar
          resetHref="/admin/contacts"
          resetLabel={t.dashboard.controls.reset}
          searchLabel={t.dashboard.controls.searchLabel}
          searchPlaceholder={t.dashboard.pages.contacts.filters.searchPlaceholder}
          searchValue={query}
          submitLabel={t.dashboard.controls.apply}
        >
          <AdminSelectField
            label={t.dashboard.pages.contacts.filters.readStateLabel}
            name="read"
            options={[
              {
                label: t.dashboard.pages.contacts.filters.readStates.all,
                value: "all",
              },
              {
                label: t.dashboard.pages.contacts.filters.readStates.unread,
                value: "unread",
              },
              {
                label: t.dashboard.pages.contacts.filters.readStates.read,
                value: "read",
              },
            ]}
            value={readState}
          />
        </AdminFilterBar>

        {contactPage.items.length ? (
          <form action={bulkSetContactReadStateAction}>
            <input type="hidden" name="returnTo" value={currentListPath} />
            <AdminPendingFieldset>
              <div className="mb-4 flex flex-col gap-3 rounded-[1.35rem] border border-[#eadfcf] bg-[#faf7f1] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm font-light text-[#5d564c]">
                  {t.dashboard.sections.items(contactPage.pagination.totalItems)}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <AdminSubmitButton
                    name="readState"
                    value="read"
                    pendingLabel={`${t.dashboard.controls.bulkMarkRead}...`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                  >
                    {t.dashboard.controls.bulkMarkRead}
                  </AdminSubmitButton>
                  <AdminSubmitButton
                    name="readState"
                    value="unread"
                    pendingLabel={`${t.dashboard.controls.bulkMarkUnread}...`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                  >
                    {t.dashboard.controls.bulkMarkUnread}
                  </AdminSubmitButton>
                </div>
              </div>

              <div className="space-y-3">
                {contactPage.items.map((contact) => (
                  <article
                    key={contact.id}
                    className="rounded-[1.45rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex gap-4">
                        <label className="pt-1">
                          <input
                            type="checkbox"
                            name="ids"
                            value={contact.id}
                            className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                          />
                        </label>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-medium text-[#201b17]">
                              {contact.name}
                            </h3>
                            {contact.readAt ? null : (
                              <span className="rounded-full border border-[#f1c7bb] bg-[#fff1ed] px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#a14f43]">
                                {t.dashboard.sections.unread}
                              </span>
                            )}
                            <span className="rounded-full border border-[#eadfcf] bg-white px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                              {contact.locale.toUpperCase()}
                            </span>
                          </div>
                          <div className="mt-2 text-sm font-light text-[#5d564c]">
                            {contact.subject}
                          </div>
                          <p className="mt-3 text-sm font-light leading-relaxed text-[#4f483f]">
                            {truncate(contact.message, 220)}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#6c6459]">
                            <a
                              href={`mailto:${contact.email}`}
                              className="inline-flex items-center gap-2 hover:text-[#201b17]"
                            >
                              <Mail className="h-4 w-4 stroke-[1.8]" />
                              {contact.email}
                            </a>
                            {contact.phone ? (
                              <a
                                href={`tel:${contact.phone}`}
                                className="inline-flex items-center gap-2 hover:text-[#201b17]"
                              >
                                <Phone className="h-4 w-4 stroke-[1.8]" />
                                {contact.phone}
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                        <div className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                          {formatAdminDateTime(contact.createdAt, locale)}
                        </div>
                        <Link
                          href={buildAdminPath(`/admin/contacts/${contact.id}`, {
                            returnTo: currentListPath,
                          })}
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                        >
                          {t.dashboard.controls.openDetails}
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </AdminPendingFieldset>
          </form>
        ) : (
          <AdminEmptyState>{t.dashboard.sections.noContacts}</AdminEmptyState>
        )}

        <AdminPagination
          currentPage={contactPage.pagination.page}
          nextLabel={t.dashboard.controls.next}
          path="/admin/contacts"
          params={{
            q: query || undefined,
            read: readState !== "all" ? readState : undefined,
          }}
          previousLabel={t.dashboard.controls.previous}
          totalPages={contactPage.pagination.totalPages}
        />
      </AdminPanel>
    </AdminShell>
  );
}
