import { normalizeAdminNextPath } from "@/lib/admin-auth";
import { getAdminDictionary, type AdminLocale } from "@/lib/admin-i18n";

export type AdminNoticeCode =
  | "created"
  | "saved"
  | "deleted"
  | "status-updated"
  | "bulk-updated"
  | "selection-required";

export type AdminNoticeTone = "success" | "warning" | "error";

export interface AdminFeedbackMessage {
  code: AdminNoticeCode;
  description: string;
  title: string;
  tone: AdminNoticeTone;
}

export function buildAdminPath(
  path: string,
  params: Record<string, string | undefined>
) {
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

export function resolveAdminReturnTo(
  value: FormDataEntryValue | null | undefined,
  fallbackPath: string
) {
  if (typeof value !== "string") {
    return fallbackPath;
  }

  return normalizeAdminNextPath(value) || fallbackPath;
}

export function withAdminNotice(
  path: string,
  code: AdminNoticeCode,
  tone: AdminNoticeTone = "success"
) {
  const url = new URL(path, "http://admin.local");

  url.searchParams.set("notice", code);
  url.searchParams.set("tone", tone);

  return `${url.pathname}${url.search}`;
}

export function getAdminFeedbackFromSearchParams(
  locale: AdminLocale,
  notice?: string | null,
  tone?: string | null
): AdminFeedbackMessage | null {
  const t = getAdminDictionary(locale);
  const normalizedTone: AdminNoticeTone =
    tone === "warning" || tone === "error" ? tone : "success";

  switch (notice) {
    case "created":
      return {
        code: "created",
        description: t.dashboard.feedback.created.description,
        title: t.dashboard.feedback.created.title,
        tone: normalizedTone,
      };
    case "saved":
      return {
        code: "saved",
        description: t.dashboard.feedback.saved.description,
        title: t.dashboard.feedback.saved.title,
        tone: normalizedTone,
      };
    case "deleted":
      return {
        code: "deleted",
        description: t.dashboard.feedback.deleted.description,
        title: t.dashboard.feedback.deleted.title,
        tone: normalizedTone,
      };
    case "status-updated":
      return {
        code: "status-updated",
        description: t.dashboard.feedback.statusUpdated.description,
        title: t.dashboard.feedback.statusUpdated.title,
        tone: normalizedTone,
      };
    case "bulk-updated":
      return {
        code: "bulk-updated",
        description: t.dashboard.feedback.bulkUpdated.description,
        title: t.dashboard.feedback.bulkUpdated.title,
        tone: normalizedTone,
      };
    case "selection-required":
      return {
        code: "selection-required",
        description: t.dashboard.feedback.selectionRequired.description,
        title: t.dashboard.feedback.selectionRequired.title,
        tone: "warning",
      };
    default:
      return null;
  }
}
