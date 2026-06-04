import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import AdminSubmitButton from "@/components/admin/AdminSubmitButton";

interface AdminMetricCardProps {
  detail: string;
  href?: string;
  Icon: LucideIcon;
  label: string;
  value: number | string;
}

interface AdminFilterOption {
  label: string;
  value: string;
}

type AdminHrefParams = Record<string, string | undefined>;

interface AdminPanelProps {
  actionHref?: string;
  actionLabel?: string;
  badge?: string;
  children: React.ReactNode;
  description?: string;
  title: string;
}

export function AdminMetricCard({
  detail,
  href,
  Icon,
  label,
  value,
}: AdminMetricCardProps) {
  const content = (
    <article className="group relative overflow-hidden rounded-2xl border border-[#ded3c3] bg-[#fffdf9] px-4 py-4 shadow-[0_14px_34px_rgba(37,28,20,0.055)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d2c1aa] hover:shadow-[0_20px_44px_rgba(37,28,20,0.09)] sm:px-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#eadfce] bg-[#f6efe4] text-[#b4884c]">
          <Icon className="h-4.5 w-4.5 stroke-[1.75]" />
        </div>
        <div className="min-w-0 break-words text-right text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#9d8e78]">
          {detail}
        </div>
      </div>
      <div className="mt-5 font-[var(--font-display)] text-[clamp(1.9rem,8vw,2.35rem)] leading-none text-[#1f1b17]">
        {value}
      </div>
      <div className="mt-1.5 text-sm font-light text-[#5d564c]">{label}</div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export function AdminPanel({
  actionHref,
  actionLabel,
  badge,
  children,
  description,
  title,
}: AdminPanelProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#ded3c3] bg-[#fffdf9] p-3 shadow-[0_14px_34px_rgba(37,28,20,0.055)] sm:p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {badge ? (
            <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#b4884c]">
              {badge}
            </div>
          ) : null}
          <h2 className="mt-2 break-words font-[var(--font-display)] text-[clamp(1.35rem,6vw,1.75rem)] leading-[0.98] text-[#1f1b17] [overflow-wrap:anywhere]">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-[48rem] text-sm font-light leading-relaxed text-[#5d564c]">
              {description}
            </p>
          ) : null}
        </div>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-[#ded3c3] bg-[#f8f2ea] px-3.5 py-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#746652] transition-all duration-300 hover:border-[#cdb99d] hover:bg-white hover:text-[#201b17] sm:w-auto"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function AdminEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8cbb8] bg-[#faf6ef] px-4 py-6 text-sm font-light text-[#6c6459]">
      {children}
    </div>
  );
}

export function AdminFilterBar({
  children,
  resetHref,
  resetLabel,
  searchName = "q",
  searchLabel,
  searchPlaceholder,
  searchValue,
  submitLabel,
}: {
  children?: React.ReactNode;
  resetHref: string;
  resetLabel: string;
  searchName?: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  submitLabel: string;
}) {
  return (
    <form
      method="get"
      className="mb-5 rounded-2xl border border-[#e3d6c4] bg-[#faf6ef] p-3 sm:p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[minmax(280px,1.35fr)_repeat(4,minmax(150px,0.8fr))_auto]">
        <label className="min-w-0 rounded-xl border border-[#dfd2c0] bg-white px-4 py-3 sm:col-span-2 lg:col-span-3 2xl:col-span-1">
          <span className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
            {searchLabel}
          </span>
          <input
            name={searchName}
            type="search"
            defaultValue={searchValue}
            placeholder={searchPlaceholder}
            className="mt-2 w-full min-w-0 bg-transparent text-sm text-[#201b17] outline-none"
          />
        </label>

        {children}

        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row lg:col-span-3 2xl:col-span-1 2xl:justify-end">
          <AdminSubmitButton
            pendingLabel={`${submitLabel}...`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#cda867] bg-[#bf9556] px-5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(128,92,39,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ad8448] sm:w-auto"
          >
            {submitLabel}
          </AdminSubmitButton>
          <Link
            href={resetHref}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#dfd2c0] bg-white px-5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#cdb99d] hover:text-[#201b17] sm:w-auto"
          >
            {resetLabel}
          </Link>
        </div>
      </div>
    </form>
  );
}

export function AdminSelectField({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: AdminFilterOption[];
  value: string;
}) {
  return (
    <label className="min-w-0 rounded-xl border border-[#dfd2c0] bg-white px-4 py-3">
      <span className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="mt-2 w-full min-w-0 bg-transparent text-sm text-[#201b17] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AdminField({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block w-full min-w-0 rounded-xl border border-[#dfd2c0] bg-white px-4 py-3">
      <span className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#9e927f]">
        {label}
      </span>
      <div className="mt-2 min-w-0">{children}</div>
    </label>
  );
}

function buildAdminHref(path: string, params: AdminHrefParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export function AdminPagination({
  currentPage,
  nextLabel = "Next",
  params,
  path,
  previousLabel = "Prev",
  totalPages,
}: {
  currentPage: number;
  nextLabel?: string;
  params: AdminHrefParams;
  path: string;
  previousLabel?: string;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <Link
        href={buildAdminHref(path, {
          ...params,
          page: currentPage > 1 ? String(currentPage - 1) : undefined,
        })}
        className={[
          "inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] transition-all duration-300",
          currentPage > 1
            ? "border-[#dfd4c2] bg-white text-[#6c6459] hover:border-[#cdbca4] hover:text-[#201b17]"
            : "pointer-events-none border-[#ece3d6] bg-[#f8f3eb] text-[#b3a794]",
        ].join(" ")}
      >
        {previousLabel}
      </Link>

      {pages.map((page) => {
        const active = page === currentPage;

        return (
          <Link
            key={page}
            href={buildAdminHref(path, {
              ...params,
              page: page > 1 ? String(page) : undefined,
            })}
            className={[
              "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-all duration-300",
              active
                ? "border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] text-white shadow-[0_12px_24px_rgba(128,92,39,0.22)]"
                : "border-[#dfd4c2] bg-white text-[#6c6459] hover:border-[#cdbca4] hover:text-[#201b17]",
            ].join(" ")}
          >
            {page}
          </Link>
        );
      })}

      <Link
        href={buildAdminHref(path, {
          ...params,
          page: currentPage < totalPages ? String(currentPage + 1) : String(totalPages),
        })}
        className={[
          "inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-[0.64rem] font-medium uppercase tracking-[0.16em] transition-all duration-300",
          currentPage < totalPages
            ? "border-[#dfd4c2] bg-white text-[#6c6459] hover:border-[#cdbca4] hover:text-[#201b17]"
            : "pointer-events-none border-[#ece3d6] bg-[#f8f3eb] text-[#b3a794]",
        ].join(" ")}
      >
        {nextLabel}
      </Link>
    </div>
  );
}
