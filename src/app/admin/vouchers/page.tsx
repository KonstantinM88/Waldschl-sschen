import Link from "next/link";
import { Gift, Mail, Ticket } from "lucide-react";
import {
  bulkUpdateVoucherStateAction,
  createVoucherAction,
} from "@/app/admin/voucher-actions";
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
  formatAdminCurrency,
  formatAdminDateTime,
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  getVouchersPage,
  normalizeAdminPageParam,
  normalizeAdminSearchQuery,
  normalizeVoucherStateFilter,
  resolveAdminSearchParams,
  truncate,
} from "@/lib/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminVouchersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await resolveAdminSearchParams(searchParams);
  const query = normalizeAdminSearchQuery(getAdminSearchParam(params, "q"));
  const stateFilter = normalizeVoucherStateFilter(
    getAdminSearchParam(params, "state")
  );
  const page = normalizeAdminPageParam(getAdminSearchParam(params, "page"));

  const [{ locale, session, t }, summary, voucherPage] = await Promise.all([
    getAdminPageContext("/admin/vouchers"),
    getAdminSummary(),
    getVouchersPage({
      page,
      pageSize: 10,
      query,
      state: stateFilter,
    }),
  ]);

  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(params, "notice"),
    getAdminSearchParam(params, "tone")
  );
  const currentListPath = buildAdminPath("/admin/vouchers", {
    q: query || undefined,
    state: stateFilter !== "all" ? stateFilter : undefined,
    page: page > 1 ? String(page) : undefined,
  });
  const exportHref = buildAdminPath("/api/admin/export/vouchers", {
    q: query || undefined,
    state: stateFilter !== "all" ? stateFilter : undefined,
  });

  const stateOptions = [
    {
      label: t.dashboard.pages.vouchers.filters.states.all,
      value: "all",
    },
    {
      label: t.dashboard.pages.vouchers.filters.states.open,
      value: "open",
    },
    {
      label: t.dashboard.pages.vouchers.filters.states.redeemed,
      value: "redeemed",
    },
  ];

  return (
    <AdminShell
      badge={t.dashboard.pages.vouchers.badge}
      currentPath={currentListPath}
      description={t.dashboard.pages.vouchers.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.pages.vouchers.title}
    >
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:max-w-[760px]">
        <AdminMetricCard
          detail={t.dashboard.statCards.vouchers.detail}
          Icon={Gift}
          label={t.dashboard.pages.vouchers.stats.open}
          value={summary.openVouchers}
        />
        <AdminMetricCard
          detail={t.dashboard.pages.vouchers.stats.redeemed}
          Icon={Ticket}
          label={t.dashboard.pages.vouchers.stats.redeemed}
          value={summary.redeemedVouchers}
        />
      </section>

      <AdminPanel
        badge={t.dashboard.pages.vouchers.badge}
        title={t.dashboard.pages.vouchers.form.createTitle}
      >
        <form action={createVoucherAction}>
          <input type="hidden" name="returnTo" value={currentListPath} />
          <AdminPendingFieldset>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              <AdminField label={t.dashboard.pages.vouchers.form.code}>
                <input
                  name="code"
                  type="text"
                  placeholder="WALD-..."
                  className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
              <AdminField label={t.dashboard.pages.vouchers.form.buyerName}>
                <input
                  name="buyerName"
                  type="text"
                  required
                  className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
              <AdminField label={t.dashboard.pages.vouchers.form.buyerEmail}>
                <input
                  name="buyerEmail"
                  type="email"
                  required
                  className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
              <AdminField label={t.dashboard.pages.vouchers.form.amount}>
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.3fr]">
              <AdminField label={t.dashboard.pages.vouchers.form.recipient}>
                <input
                  name="recipient"
                  type="text"
                  className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
              <AdminField label={t.dashboard.pages.vouchers.form.message}>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                />
              </AdminField>
            </div>

            <div className="mt-4 flex flex-col gap-4 border-t border-[#eee5d9] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-3 text-sm font-light text-[#4f483f]">
                <input
                  name="isRedeemed"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                />
                {t.dashboard.pages.vouchers.form.isRedeemed}
              </label>

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
        badge={t.dashboard.sections.vouchersBadge}
        description={t.dashboard.sections.items(voucherPage.pagination.totalItems)}
        title={t.dashboard.sections.vouchersTitle}
      >
        <AdminFilterBar
          resetHref="/admin/vouchers"
          resetLabel={t.dashboard.controls.reset}
          searchLabel={t.dashboard.controls.searchLabel}
          searchPlaceholder={t.dashboard.pages.vouchers.filters.searchPlaceholder}
          searchValue={query}
          submitLabel={t.dashboard.controls.apply}
        >
          <AdminSelectField
            label={t.dashboard.pages.vouchers.filters.stateLabel}
            name="state"
            options={stateOptions}
            value={stateFilter}
          />
        </AdminFilterBar>

        {voucherPage.items.length ? (
          <form action={bulkUpdateVoucherStateAction}>
            <input type="hidden" name="returnTo" value={currentListPath} />
            <AdminPendingFieldset>
              <div className="mb-4 flex flex-col gap-3 rounded-[1.35rem] border border-[#eadfcf] bg-[#faf7f1] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm font-light text-[#5d564c]">
                  {t.dashboard.sections.items(voucherPage.pagination.totalItems)}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <AdminSubmitButton
                    name="state"
                    value="redeemed"
                    pendingLabel={`${t.dashboard.controls.bulkRedeem}...`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                  >
                    {t.dashboard.controls.bulkRedeem}
                  </AdminSubmitButton>
                  <AdminSubmitButton
                    name="state"
                    value="open"
                    pendingLabel={`${t.dashboard.controls.bulkReopen}...`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                  >
                    {t.dashboard.controls.bulkReopen}
                  </AdminSubmitButton>
                </div>
              </div>

              <div className="space-y-3">
                {voucherPage.items.map((voucher) => (
                  <article
                    key={voucher.id}
                    className="rounded-[1.45rem] border border-[#eee5d9] bg-[#fcfaf6] px-4 py-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex gap-4">
                        <label className="pt-1">
                          <input
                            type="checkbox"
                            name="ids"
                            value={voucher.id}
                            className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                          />
                        </label>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-medium text-[#201b17]">
                              {voucher.buyerName}
                            </h3>
                            <span
                              className={[
                                "rounded-full px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em]",
                                voucher.isRedeemed
                                  ? "border border-[#d4e2d3] bg-[#eef8ee] text-[#56714d]"
                                  : "border border-[#eadfcf] bg-white text-[#8f836f]",
                              ].join(" ")}
                            >
                              {voucher.isRedeemed
                                ? t.dashboard.pages.vouchers.stats.redeemed
                                : t.dashboard.pages.vouchers.stats.open}
                            </span>
                            <span className="rounded-full border border-[#eadfcf] bg-white px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#8f836f]">
                              {voucher.code}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-[#4f483f] md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-3 py-3">
                              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                                {t.dashboard.pages.vouchers.fields.amount}
                              </div>
                              <div className="mt-2">
                                {formatAdminCurrency(voucher.amount, locale)}
                              </div>
                            </div>
                            <div className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-3 py-3">
                              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                                {t.dashboard.pages.vouchers.fields.recipient}
                              </div>
                              <div className="mt-2">{voucher.recipient ?? "-"}</div>
                            </div>
                            <div className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-3 py-3">
                              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                                {t.dashboard.pages.vouchers.fields.created}
                              </div>
                              <div className="mt-2">
                                {formatAdminDateTime(voucher.createdAt, locale)}
                              </div>
                            </div>
                            <div className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-3 py-3">
                              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                                {t.dashboard.pages.vouchers.fields.redeemed}
                              </div>
                              <div className="mt-2">
                                {voucher.redeemedAt
                                  ? formatAdminDateTime(voucher.redeemedAt, locale)
                                  : "-"}
                              </div>
                            </div>
                          </div>

                          <a
                            href={`mailto:${voucher.buyerEmail}`}
                            className="mt-4 inline-flex items-center gap-2 text-sm text-[#6c6459] hover:text-[#201b17]"
                          >
                            <Mail className="h-4 w-4 stroke-[1.8]" />
                            {voucher.buyerEmail}
                          </a>

                          {voucher.message ? (
                            <p className="mt-3 text-sm font-light leading-relaxed text-[#4f483f]">
                              {truncate(voucher.message, 180)}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-start gap-3 xl:items-end">
                        <div className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                          {voucher.code}
                        </div>
                        <Link
                          href={buildAdminPath(`/admin/vouchers/${voucher.id}`, {
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
          <AdminEmptyState>{t.dashboard.sections.noVouchers}</AdminEmptyState>
        )}

        <AdminPagination
          currentPage={voucherPage.pagination.page}
          nextLabel={t.dashboard.controls.next}
          path="/admin/vouchers"
          params={{
            q: query || undefined,
            state: stateFilter !== "all" ? stateFilter : undefined,
          }}
          previousLabel={t.dashboard.controls.previous}
          totalPages={voucherPage.pagination.totalPages}
        />
      </AdminPanel>
    </AdminShell>
  );
}
