import { normalizeAdminNextPath } from "@/lib/admin-auth";
import { getAdminDictionary, type AdminLocale } from "@/lib/admin-i18n";

export type AdminNoticeCode =
  | "created"
  | "saved"
  | "deleted"
  | "delete-blocked"
  | "status-updated"
  | "bulk-updated"
  | "receipt-sent"
  | "receipt-email-failed"
  | "selection-required"
  | "invalid-transition"
  | "booking-locked"
  | "invalid-input"
  | "sold-out"
  | "capacity"
  | "error";

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
    case "delete-blocked":
      return {
        code: "delete-blocked",
        description: t.dashboard.feedback.deleteBlocked.description,
        title: t.dashboard.feedback.deleteBlocked.title,
        tone: "warning",
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
    case "receipt-sent":
      return {
        code: "receipt-sent",
        description: t.dashboard.feedback.receiptSent.description,
        title: t.dashboard.feedback.receiptSent.title,
        tone: normalizedTone,
      };
    case "receipt-email-failed":
      return {
        code: "receipt-email-failed",
        description: t.dashboard.feedback.receiptEmailFailed.description,
        title: t.dashboard.feedback.receiptEmailFailed.title,
        tone: "error",
      };
    case "selection-required":
      return {
        code: "selection-required",
        description: t.dashboard.feedback.selectionRequired.description,
        title: t.dashboard.feedback.selectionRequired.title,
        tone: "warning",
      };
    case "invalid-transition":
      return {
        code: "invalid-transition",
        description: t.dashboard.feedback.invalidTransition.description,
        title: t.dashboard.feedback.invalidTransition.title,
        tone: "warning",
      };
    case "booking-locked":
      return {
        code: "booking-locked",
        description: t.dashboard.feedback.bookingLocked.description,
        title: t.dashboard.feedback.bookingLocked.title,
        tone: "warning",
      };
    case "invalid-input":
      return {
        code: "invalid-input",
        description: t.dashboard.feedback.invalidInput.description,
        title: t.dashboard.feedback.invalidInput.title,
        tone: "warning",
      };
    case "sold-out":
      return {
        code: "sold-out",
        description: t.dashboard.feedback.soldOut.description,
        title: t.dashboard.feedback.soldOut.title,
        tone: "warning",
      };
    case "capacity":
      return {
        code: "capacity",
        description: t.dashboard.feedback.capacity.description,
        title: t.dashboard.feedback.capacity.title,
        tone: "warning",
      };
    case "error":
      return {
        code: "error",
        description: t.dashboard.feedback.error.description,
        title: t.dashboard.feedback.error.title,
        tone: "error",
      };
    default:
      return null;
  }
}
