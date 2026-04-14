"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getAdminDictionary, type AdminLocale } from "@/lib/admin-i18n";

interface AdminLoginFormProps {
  locale: AdminLocale;
  nextPath: string;
}

export default function AdminLoginForm({ locale, nextPath }: AdminLoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy = getAdminDictionary(locale).loginForm;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setErrorMessage(null);

        const formData = new FormData(event.currentTarget);
        const username = String(formData.get("username") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        startTransition(async () => {
          try {
            const response = await fetch("/api/admin/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username,
                password,
                next: nextPath,
              }),
            });

            const data = (await response.json()) as {
              code?: "INTERNAL_ERROR" | "INVALID_CREDENTIALS" | "INVALID_PAYLOAD" | "NOT_CONFIGURED";
              redirectTo?: string;
              success?: boolean;
            };

            if (!response.ok || !data.success) {
              switch (data.code) {
                case "INVALID_CREDENTIALS":
                  setErrorMessage(copy.errors.invalidCredentials);
                  break;
                case "INVALID_PAYLOAD":
                  setErrorMessage(copy.errors.invalidPayload);
                  break;
                case "NOT_CONFIGURED":
                  setErrorMessage(copy.errors.notConfigured);
                  break;
                case "INTERNAL_ERROR":
                  setErrorMessage(copy.errors.internal);
                  break;
                default:
                  setErrorMessage(copy.errors.generic);
              }
              return;
            }

            router.replace(data.redirectTo ?? "/admin");
            router.refresh();
          } catch {
            setErrorMessage(copy.errors.generic);
          }
        });
      }}
    >
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/72"
        >
          {copy.usernameLabel}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          disabled={isPending}
          required
          className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/34 focus:border-[rgba(212,188,142,0.5)] focus:bg-white/[0.08]"
          placeholder={copy.usernamePlaceholder}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white/72"
        >
          {copy.passwordLabel}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          disabled={isPending}
          required
          className="h-12 w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/34 focus:border-[rgba(212,188,142,0.5)] focus:bg-white/[0.08]"
          placeholder={copy.passwordPlaceholder}
        />
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-[#b8645c]/35 bg-[#59261f]/40 px-4 py-3 text-sm text-[#ffd2cb]">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/14 bg-[linear-gradient(135deg,#d8bd84_0%,#c9a96e_48%,#b4884c_100%)] px-6 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(128,92,39,0.28)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_20px_40px_rgba(128,92,39,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? copy.submitPending : copy.submitIdle}
      </button>
    </form>
  );
}
