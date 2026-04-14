"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { AdminFeedbackMessage } from "@/lib/admin-feedback";

export default function AdminNoticeToast({
  dismissLabel,
  feedback,
}: {
  dismissLabel: string;
  feedback: AdminFeedbackMessage;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("notice");
    params.delete("tone");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  if (!visible) {
    return null;
  }

  const toneClasses =
    feedback.tone === "warning"
      ? "border-[#e9d9b5] bg-[#fff8ea] text-[#7c5f2b]"
      : feedback.tone === "error"
        ? "border-[#efc2bb] bg-[#fff2ef] text-[#9b5147]"
        : "border-[#d5e3d5] bg-[#f2faf2] text-[#4d6a4c]";

  const Icon = feedback.tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 w-[min(92vw,420px)]">
      <div
        className={[
          "pointer-events-auto rounded-[1.45rem] border px-4 py-4 shadow-[0_24px_50px_rgba(28,21,16,0.12)] backdrop-blur-sm",
          toneClasses,
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70">
            <Icon className="h-4.5 w-4.5 stroke-[2]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{feedback.title}</div>
            <p className="mt-1 text-sm leading-relaxed opacity-90">{feedback.description}</p>
          </div>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 transition-colors hover:bg-white"
            aria-label={dismissLabel}
          >
            <X className="h-4 w-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
}
