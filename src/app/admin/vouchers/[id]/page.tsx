import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  deleteVoucherAction,
  updateVoucherAction,
} from "@/app/admin/voucher-actions";
import AdminConfirmButton from "@/components/admin/AdminConfirmButton";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import { AdminField, AdminPanel } from "@/components/admin/AdminUi";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import {
  formatAdminCurrency,
  formatAdminDateTime,
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  getAdminVoucherById,
  resolveAdminSearchParams,
} from "@/lib/admin-dashboard";
import {
  buildAdminPath,
  getAdminFeedbackFromSearchParams,
  resolveAdminReturnTo,
} from "@/lib/admin-feedback";

export const dynamic = "force-dynamic";

export default async function AdminVoucherDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await resolveAdminSearchParams(searchParams);

  const [{ locale, session, t }, summary, voucher] = await Promise.all([
    getAdminPageContext(`/admin/vouchers/${id}`),
    getAdminSummary(),
    getAdminVoucherById(id),
  ]);

  if (!voucher) {
    notFound();
  }

  const backHref = resolveAdminReturnTo(
    getAdminSearchParam(resolvedSearchParams, "returnTo"),
    "/admin/vouchers"
  );
  const currentPath = buildAdminPath(`/admin/vouchers/${id}`, {
    returnTo: backHref,
  });
  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(resolvedSearchParams, "notice"),
    getAdminSearchParam(resolvedSearchParams, "tone")
  );

  return (
    <AdminShell
      badge={t.dashboard.pages.vouchers.badge}
      currentPath={currentPath}
      description={t.dashboard.pages.vouchers.detail.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.pages.vouchers.detail.title}
    >
      <div className="flex flex-wrap gap-3">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
        >
          {t.dashboard.controls.backToList}
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <AdminPanel badge={t.dashboard.pages.vouchers.badge} title={voucher.code}>
          <div className="grid grid-cols-1 gap-3 text-sm text-[#4f483f]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.vouchers.fields.amount}
                </div>
                <div className="mt-2 text-lg font-medium text-[#201b17]">
                  {formatAdminCurrency(voucher.amount, locale)}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.vouchers.fields.code}
                </div>
                <div className="mt-2 text-[#201b17]">{voucher.code}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.vouchers.fields.created}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {formatAdminDateTime(voucher.createdAt, locale)}
                </div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.vouchers.fields.redeemed}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {voucher.redeemedAt
                    ? formatAdminDateTime(voucher.redeemedAt, locale)
                    : "-"}
                </div>
              </div>
            </div>
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.vouchers.fields.buyerName}
              </div>
              <div className="mt-2 text-[#201b17]">{voucher.buyerName}</div>
            </div>
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.vouchers.fields.buyerEmail}
              </div>
              <div className="mt-2 text-[#201b17]">{voucher.buyerEmail}</div>
            </div>
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.vouchers.fields.recipient}
              </div>
              <div className="mt-2 text-[#201b17]">{voucher.recipient ?? "-"}</div>
            </div>
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.vouchers.fields.message}
              </div>
              <div className="mt-2 whitespace-pre-wrap text-[#201b17]">
                {voucher.message ?? "-"}
              </div>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel
          badge={t.dashboard.controls.edit}
          title={t.dashboard.pages.vouchers.form.editTitle}
        >
          <form action={updateVoucherAction}>
            <input type="hidden" name="id" value={voucher.id} />
            <input type="hidden" name="returnTo" value={currentPath} />
            <AdminPendingFieldset>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <AdminField label={t.dashboard.pages.vouchers.form.code}>
                  <input
                    name="code"
                    type="text"
                    defaultValue={voucher.code}
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
                    defaultValue={voucher.amount}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <AdminField label={t.dashboard.pages.vouchers.form.buyerName}>
                  <input
                    name="buyerName"
                    type="text"
                    required
                    defaultValue={voucher.buyerName}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={t.dashboard.pages.vouchers.form.buyerEmail}>
                  <input
                    name="buyerEmail"
                    type="email"
                    required
                    defaultValue={voucher.buyerEmail}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <AdminField label={t.dashboard.pages.vouchers.form.recipient}>
                  <input
                    name="recipient"
                    type="text"
                    defaultValue={voucher.recipient ?? ""}
                    className="w-full bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
                <AdminField label={t.dashboard.pages.vouchers.form.message}>
                  <textarea
                    name="message"
                    rows={4}
                    defaultValue={voucher.message ?? ""}
                    className="w-full resize-y bg-transparent text-sm text-[#201b17] outline-none"
                  />
                </AdminField>
              </div>

              <div className="mt-4 flex flex-col gap-4 border-t border-[#eee5d9] pt-4 lg:flex-row lg:items-center lg:justify-between">
                <label className="inline-flex items-center gap-3 text-sm font-light text-[#4f483f]">
                  <input
                    name="isRedeemed"
                    type="checkbox"
                    defaultChecked={voucher.isRedeemed}
                    className="h-4 w-4 rounded border-[#cdbca4] text-[#b4884c] focus:ring-[#d6c4a4]"
                  />
                  {t.dashboard.pages.vouchers.form.isRedeemed}
                </label>

                <AdminSubmitButton
                  pendingLabel={`${t.dashboard.controls.save}...`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]"
                >
                  {t.dashboard.controls.save}
                </AdminSubmitButton>
              </div>
            </AdminPendingFieldset>
          </form>

          <form action={deleteVoucherAction} className="mt-3">
            <input type="hidden" name="id" value={voucher.id} />
            <input type="hidden" name="returnTo" value={backHref} />
            <AdminPendingFieldset>
              <AdminConfirmButton
                confirmMessage={t.dashboard.controls.confirmDelete}
                pendingLabel={`${t.dashboard.controls.delete}...`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#e9d0cc] bg-[#fff4f2] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#9b5147] transition-all duration-300 hover:border-[#e0b2ab] hover:bg-[#fff0ed]"
              >
                <Trash2 className="h-4 w-4 stroke-[1.8]" />
                {t.dashboard.controls.delete}
              </AdminConfirmButton>
            </AdminPendingFieldset>
          </form>
        </AdminPanel>
      </section>
    </AdminShell>
  );
}
