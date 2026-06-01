import { siteConfig } from "@/data/site";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Sender shown to guests. Configure RESEND_FROM as e.g.
 * "Hotel Waldschloesschen <buchung@waldschloesschen-wangen.de>".
 * The domain must be verified in Resend.
 */
function getFromAddress() {
  return (
    process.env.RESEND_FROM?.trim() ||
    `${siteConfig.shortName} <onboarding@resend.dev>`
  );
}

/**
 * Hotel inbox that receives new-booking notifications.
 */
export function getHotelNotifyAddress() {
  return process.env.BOOKING_NOTIFY_EMAIL?.trim() || siteConfig.email;
}

/**
 * Sends one email through Resend's REST API. Intentionally dependency-free.
 *
 * Fail-safe: if RESEND_API_KEY is missing the call is skipped (not an error),
 * and any transport failure is swallowed into a result object so a booking is
 * never lost because an email could not be delivered.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return { ok: false, skipped: true };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { ok: false, error: `Resend ${response.status}: ${detail}` };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

/**
 * Sends multiple emails without letting one failure block the others.
 */
export async function sendEmails(inputs: SendEmailInput[]) {
  return Promise.allSettled(inputs.map((input) => sendEmail(input)));
}
