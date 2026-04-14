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
    <article className="rounded-[1.7rem] border border-[#dfd4c2] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_22px_44px_rgba(28,21,16,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3ede2] text-[#b4884c]">
          <Icon className="h-5 w-5 stroke-[1.7]" />
        </div>
        <div className="text-right text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#9e927f]">
          {detail}
        </div>
      </div>
      <div className="mt-6 font-[var(--font-display)] text-[2.4rem] leading-none text-[#201b17]">
        {value}
      </div>
      <div className="mt-2 text-sm font-light text-[#5d564c]">{label}</div>
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
    <section className="rounded-[1.9rem] border border-[#dfd4c2] bg-white p-5 shadow-[0_18px_40px_rgba(28,21,16,0.06)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {badge ? (
            <div className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[#b4884c]">
              {badge}
            </div>
          ) : null}
          <h2 className="mt-2 font-[var(--font-display)] text-[1.9rem] leading-none text-[#201b17]">
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
            className="rounded-full border border-[#eadfcf] bg-[#faf7f1] px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#8f836f] transition-all duration-300 hover:border-[#d8c8b2] hover:text-[#201b17]"
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
    <div className="rounded-[1.45rem] border border-dashed border-[#ddd1be] bg-[#faf7f1] px-4 py-6 text-sm font-light text-[#6c6459]">
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
      className="mb-5 rounded-[1.45rem] border border-[#eadfcf] bg-[#faf7f1] p-4"
    >
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.8fr))]">
        <label className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-4 py-3">
          <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
            {searchLabel}
          </span>
          <input
            name={searchName}
            type="search"
            defaultValue={searchValue}
            placeholder={searchPlaceholder}
            className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
          />
        </label>

        {children}

        <div className="flex flex-col gap-3 sm:flex-row xl:col-span-1 xl:justify-end">
          <AdminSubmitButton
            pendingLabel={`${submitLabel}...`}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[rgba(184,136,76,0.22)] bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_30px_rgba(128,92,39,0.22)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_36px_rgba(128,92,39,0.3)]"
          >
            {submitLabel}
          </AdminSubmitButton>
          <Link
            href={resetHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#dfd4c2] bg-white px-5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[#6c6459] transition-all duration-300 hover:border-[#d3c4b0] hover:text-[#201b17]"
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
    <label className="rounded-[1.1rem] border border-[#eadfcf] bg-white px-4 py-3">
      <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="mt-2 w-full bg-transparent text-sm text-[#201b17] outline-none"
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
    <label className="rounded-[1.2rem] border border-[#eadfcf] bg-white px-4 py-3">
      <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-[#9e927f]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
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
