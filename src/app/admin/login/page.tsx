import { cookies } from "next/headers";
import { Shield } from "lucide-react";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { normalizeAdminNextPath } from "@/lib/admin-auth";
import {
  getAdminDictionary,
  getAdminLocaleFromCookieStore,
} from "@/lib/admin-i18n";

interface AdminLoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const cookieStore = await cookies();
  const locale = getAdminLocaleFromCookieStore(cookieStore);
  const t = getAdminDictionary(locale);
  const { next } = await searchParams;
  const nextPath = normalizeAdminNextPath(next);
  const currentPath = next ? `/admin/login?next=${encodeURIComponent(nextPath)}` : "/admin/login";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#120f0d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,188,142,0.14),transparent_24%),radial-gradient(circle_at_80%_12%,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,rgba(18,15,13,0.98),rgba(12,10,9,1))]" />
      <div className="absolute left-[-8rem] top-[-8rem] h-[20rem] w-[20rem] rounded-full border border-[rgba(212,188,142,0.16)] bg-[radial-gradient(circle,rgba(212,188,142,0.12),transparent_70%)] blur-2xl" />
      <div className="absolute bottom-[-9rem] right-[-7rem] h-[22rem] w-[22rem] rounded-full border border-white/6 bg-[radial-gradient(circle,rgba(212,188,142,0.1),transparent_72%)] blur-3xl" />

      <div className="relative z-[1] mx-auto flex min-h-screen w-full max-w-[1180px] items-center px-5 py-10 sm:px-8">
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.26)] sm:p-9">
            <div className="flex justify-end">
              <AdminLocaleSwitcher
                locale={locale}
                currentPath={currentPath}
                variant="dark"
              />
            </div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(212,188,142,0.24)] bg-[rgba(212,188,142,0.08)] text-[rgba(232,214,183,0.98)]">
              <Shield className="h-6 w-6 stroke-[1.8]" />
            </div>
            <div className="mt-8 max-w-[34rem]">
              <div className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[rgba(232,214,183,0.84)]">
                {t.loginPage.badge}
              </div>
              <h1 className="mt-4 font-[var(--font-display)] text-[clamp(2.5rem,7vw,4.3rem)] leading-[0.92] text-white">
                {t.loginPage.title}
              </h1>
              <p className="mt-5 max-w-[32rem] text-[0.98rem] font-light leading-relaxed text-white/70 sm:text-[1.05rem]">
                {t.loginPage.description}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {t.loginPage.features.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm font-light text-white/76"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.26)] sm:p-9">
            <div className="mb-8">
              <div className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[rgba(232,214,183,0.78)]">
                {t.loginPage.formBadge}
              </div>
              <h2 className="mt-3 font-[var(--font-display)] text-[2.25rem] leading-none text-white">
                {t.loginPage.formTitle}
              </h2>
              <p className="mt-4 text-sm font-light leading-relaxed text-white/62">
                {t.loginPage.formDescription}
              </p>
            </div>

            <AdminLoginForm locale={locale} nextPath={nextPath} />
          </section>
        </div>
      </div>
    </main>
  );
}
