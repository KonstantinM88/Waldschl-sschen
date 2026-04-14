import Link from "next/link";
import { CalendarCheck2, CircleAlert, Eye } from "lucide-react";
import {
  bulkUpdateEventVisibilityAction,
  createEventAction,
} from "@/app/admin/event-actions";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import {
  AdminEmptyState,
  AdminField,
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
  getEventsPage,
  normalizeAdminPageParam,
  normalizeAdminSearchQuery,
  normalizeEventTimeFilter,
  normalizeEventVisibilityFilter,
  resolveAdminSearchParams,
  truncate,
} from "@/lib/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);
  const query = normalizeAdminSearchQuery(getAdminSearchParam(params, "q"));
  const visibilityFilter = normalizeEventVisibilityFilter(
    getAdminSearchParam(params, "visibility")
  );
  const timeFilter = normalizeEventTimeFilter(getAdminSearchParam(params, "time"));
  const page = normalizeAdminPageParam(getAdminSearchParam(params, "page"));

  const [{ locale, session, t }, summary, eventPage] = await Promise.all([
    getAdminPageContext("/admin/events"),
    getAdminSummary(),
    getEventsPage({
      page,
      pageSize: 10,
      query,
      time: timeFilter,
      visibility: visibilityFilter,
    }),
  ]);

  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );
  const currentListPath = buildAdminPath("/admin/events", {
    q: query || undefined,
    visibility: visibilityFilter !== "all" ? visibilityFilter : undefined,
    time: timeFilter !== "all" ? timeFilter : undefined,
    page: page > 1 ? String(page) : undefined,
  });
  const exportHref = buildAdminPath("/api/admin/export/events", {
    q: query || undefined,
    visibility: visibilityFilter !== "all" ? visibilityFilter : undefined,
    time: timeFilter !== "all" ? timeFilter : undefined,
  });

  const visibilityOptions = [
    {
      label: t.dashboard.pages.events.filters.visibilities.all,
      value: "all",
    },
    {
      label: t.dashboard.pages.events.filters.visibilities.published,
      value: "published",
    },
    {
      label: t.dashboard.pages.events.filters.visibilities.draft,
      value: "draft",
    },
  ];

  const timeOptions = [
    {
      label: t.dashboard.pages.events.filters.times.all,
      value: "all",
    },
    {
      label: t.dashboard.pages.events.filters.times.upcoming,
      value: "upcoming",
    },
    {
      label: t.dashboard.pages.events.filters.times.past,
      value: "past",
    },
  ];

  return (
    <AdminShell
      badge={t.dashboard.pages.events.badge}
      currentPath={currentListPath}
      description={t.dashboard.pages.events.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.pages.events.title}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:max-w-[760px]">
        <AdminMetricCard
          detail={t.dashboard.pages.events.stats.published}
          Icon={Eye}
          label={t.dashboard.pages.events.stats.published}
          value={summary.publishedEvents}
        />
        <AdminMetricCard
          detail={t.dashboard.pages.events.stats.upcoming}
          Icon={CalendarCheck2}
          label={t.dashboard.pages.events.stats.upcoming}
          value={summary.upcomingEvents}
        />
      </section>

      <AdminPanel
        badge={t.dashboard.pages.events.badge}
        title={t.dashboard.pages.events.form.createTitle}
      >
        <form action={createEventAction}>
          <input type="hidden" name="returnTo" value={currentListPath} />
          <AdminPendingFieldset>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <AdminField label={t.dashboard.pages.events.form.title}>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
              <AdminField label={t.dashboard.pages.events.form.titleEn}>
                <input
                  name="titleEn"
                  type="text"
                  className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
              <AdminField label={t.dashboard.pages.events.form.date}>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
              <AdminField label={t.dashboard.pages.events.form.description}>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
              <AdminField label={t.dashboard.pages.events.form.descriptionEn}>
                <textarea
                  name="descriptionEn"
                  rows={4}
                  className="w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
            </div>

            <div className="mt-4 flex flex-col gap-4 border-t border-[#eee5d9] pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
                <AdminField label={t.dashboard.pages.events.form.imageUrl}>
                  <input
                    name="imageUrl"
                    type="text"
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <label className="inline-flex items-center gap-3 rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3 text-sm font-light text-[#4f483f]">
                  <input
                    name="isPublished"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                  />
                  {t.dashboard.pages.events.form.isPublished}
                </label>
              </div>

              <AdminSubmitButton
                pendingLabel={`${t.dashboard.controls.create}...`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]"
              >
                {t.dashboard.controls.create}
              </AdminSubmitButton>
            </div>
          </AdminPendingFieldset>
        </form>
      </AdminPanel>

      <AdminPanel
        actionHref={exportHref}
        actionLabel={t.dashboard.controls.exportCsv}
        badge={t.dashboard.sections.eventsBadge}
        description={t.dashboard.sections.items(eventPage.pagination.totalItems)}
        title={t.dashboard.sections.eventsTitle}
      >
        <AdminFilterBar
          resetHref="/admin/events"
          resetLabel={t.dashboard.controls.reset}
          searchLabel={t.dashboard.controls.searchLabel}
          searchPlaceholder={t.dashboard.pages.events.filters.searchPlaceholder}
          searchValue={query}
          submitLabel={t.dashboard.controls.apply}
        >
          <AdminSelectField
            label={t.dashboard.pages.events.filters.visibilityLabel}
            name="visibility"
            options={visibilityOptions}
            value={visibilityFilter}
          />
          <AdminSelectField
            label={t.dashboard.pages.events.filters.timeLabel}
            name="time"
            options={timeOptions}
            value={timeFilter}
          />
        </AdminFilterBar>

        {eventPage.items.length ? (
          <form action={bulkUpdateEventVisibilityAction}>
            <input type="hidden" name="returnTo" value={currentListPath} />
            <AdminPendingFieldset>
              <div className="mb-4 flex flex-col gap-3 rounded-[1.35rem] border border-[#eadfcf] bg-[#faf7f1] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm font-light text-[#5d564c]">
                  {t.dashboard.sections.items(eventPage.pagination.totalItems)}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <AdminSubmitButton
                    name="visibility"
                    value="published"
                    pendingLabel={`${t.dashboard.controls.bulkPublish}...`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                  >
                    {t.dashboard.controls.bulkPublish}
                  </AdminSubmitButton>
                  <AdminSubmitButton
                    name="visibility"
                    value="draft"
                    pendingLabel={`${t.dashboard.controls.bulkUnpublish}...`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                  >
                    {t.dashboard.controls.bulkUnpublish}
                  </AdminSubmitButton>
                </div>
              </div>

              <div className="space-y-3">
                {eventPage.items.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-[1.45rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex gap-4">
                        <label className="pt-1">
                          <input
                            type="checkbox"
                            name="ids"
                            value={event.id}
                            className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                          />
                        </label>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-medium text-[#201b17]">
                              {event.title}
                            </h3>
                            <span
                              className={[
                                "rounded-full px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em]",
                                event.isPublished
                                  ? "border border-[#d4e2d3] bg-[#eef8ee] text-[#56714d]"
                                  : "border border-[#eadfcf] bg-white text-[#8f836f]",
                              ].join(" ")}
                            >
                              {event.isPublished
                                ? t.dashboard.pages.events.stats.published
                                : t.dashboard.pages.events.statuses.unpublished}
                            </span>
                          </div>
                          <div className="mt-2 text-sm font-light text-[#5d564c]">
                            {formatAdminDateTime(event.date, locale)}
                          </div>
                          <p className="mt-4 text-sm font-light leading-relaxed text-[#4f483f]">
                            {truncate(
                              event.description ?? t.dashboard.sections.noDescription,
                              220
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-3 xl:items-end">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3ede2] text-[#b4884c]">
                          <CircleAlert className="h-4.5 w-4.5 stroke-[1.9]" />
                        </div>
                        <Link
                          href={buildAdminPath(`/admin/events/${event.id}`, {
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
          <AdminEmptyState>{t.dashboard.sections.noEvents}</AdminEmptyState>
        )}

        <AdminPagination
          currentPage={eventPage.pagination.page}
          nextLabel={t.dashboard.controls.next}
          path="/admin/events"
          params={{
            q: query || undefined,
            visibility: visibilityFilter !== "all" ? visibilityFilter : undefined,
            time: timeFilter !== "all" ? timeFilter : undefined,
          }}
          previousLabel={t.dashboard.controls.previous}
          totalPages={eventPage.pagination.totalPages}
        />
      </AdminPanel>
    </AdminShell>
  );
}
