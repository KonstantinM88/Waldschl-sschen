import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { setContactReadStateAction } from "@/app/admin/contact-actions";
import AdminPendingFieldset from "@/components/admin/AdminPendingFieldset";
import AdminShell from "@/components/admin/AdminShell";
import { AdminPanel } from "@/components/admin/AdminUi";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";
import {
  formatAdminDateTime,
  getAdminContactById,
  getAdminPageContext,
  getAdminSearchParam,
  getAdminSummary,
  resolveAdminSearchParams,
} from "@/lib/admin-dashboard";
import {
  buildAdminPath,
  getAdminFeedbackFromSearchParams,
  resolveAdminReturnTo,
} from "@/lib/admin-feedback";

export const dynamic = "force-dynamic";

export default async function AdminContactDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await resolveAdminSearchParams(searchParams);

  const [{ locale, session, t }, summary, contact] = await Promise.all([
    getAdminPageContext(`/admin/contacts/${id}`),
    getAdminSummary(),
    getAdminContactById(id),
  ]);

  if (!contact) {
    notFound();
  }

  const backHref = resolveAdminReturnTo(
    getAdminSearchParam(resolvedSearchParams, "returnTo"),
    "/admin/contacts"
  );
  const currentPath = buildAdminPath(`/admin/contacts/${id}`, {
    returnTo: backHref,
  });
  const feedback = getAdminFeedbackFromSearchParams(
    locale,
    getAdminSearchParam(resolvedSearchParams, "notice"),
    getAdminSearchParam(resolvedSearchParams, "tone")
  );

  return (
    <AdminShell
      badge={t.dashboard.pages.contacts.badge}
      currentPath={currentPath}
      description={t.dashboard.pages.contacts.detail.description}
      feedback={feedback}
      locale={locale}
      sessionUsername={session.sub}
      summary={summary}
      title={t.dashboard.pages.contacts.detail.title}
    >
      <div className="flex flex-wrap gap-3">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
        >
          {t.dashboard.controls.backToList}
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <AdminPanel badge={t.dashboard.pages.contacts.badge} title={contact.subject}>
          <div className="grid grid-cols-1 gap-3 text-sm text-[#4f483f]">
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.contacts.fields.name}
              </div>
              <div className="mt-2 text-base font-medium text-[#201b17]">{contact.name}</div>
            </div>
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.contacts.fields.email}
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="mt-2 inline-flex items-center gap-2 text-[#6c6459] hover:text-[#201b17]"
              >
                <Mail className="h-4 w-4 stroke-[1.8]" />
                {contact.email}
              </a>
            </div>
            <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
              <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                {t.dashboard.pages.contacts.fields.phone}
              </div>
              <div className="mt-2 text-[#201b17]">
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-2 text-[#6c6459] hover:text-[#201b17]"
                  >
                    <Phone className="h-4 w-4 stroke-[1.8]" />
                    {contact.phone}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.contacts.fields.locale}
                </div>
                <div className="mt-2 text-[#201b17]">{contact.locale.toUpperCase()}</div>
              </div>
              <div className="rounded-[1.15rem] border border-[#eadfcf] bg-[#fcfaf6] px-4 py-4">
                <div className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
                  {t.dashboard.pages.contacts.fields.created}
                </div>
                <div className="mt-2 text-[#201b17]">
                  {formatAdminDateTime(contact.createdAt, locale)}
                </div>
              </div>
            </div>

            <form action={setContactReadStateAction} className="pt-2">
              <input type="hidden" name="id" value={contact.id} />
              <input type="hidden" name="returnTo" value={currentPath} />
              <AdminPendingFieldset>
                <input
                  type="hidden"
                  name="readState"
                  value={contact.readAt ? "unread" : "read"}
                />
                <AdminSubmitButton
                  pendingLabel={`${
                    contact.readAt
                      ? t.dashboard.controls.markUnread
                      : t.dashboard.controls.markRead
                  }...`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdbca4] hover:text-[#201b17]"
                >
                  {contact.readAt
                    ? t.dashboard.controls.markUnread
                    : t.dashboard.controls.markRead}
                </AdminSubmitButton>
              </AdminPendingFieldset>
            </form>
          </div>
        </AdminPanel>

        <AdminPanel
          badge={t.dashboard.pages.contacts.fields.message}
          title={t.dashboard.pages.contacts.fields.subject}
        >
          <div className="whitespace-pre-wrap rounded-[1.2rem] border border-[#eadfcf] bg-[#fcfaf6] px-5 py-5 text-sm font-light leading-relaxed text-[#4f483f]">
            {contact.message}
          </div>
        </AdminPanel>
      </section>
    </AdminShell>
  );
}
