import { siteConfig } from "@/data/site";
import type { BookingLocale } from "@/lib/booking-shared";

export interface BookingEmailData {
  bookingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalAmount: number;
  mealPlanLabel?: string;
  street?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  cancellationReason?: string | null;
}

export interface BookingVerificationEmailData {
  code: string;
  firstName: string;
  lastName: string;
  expiresInMinutes: number;
}

function formatCurrency(value: number, locale: BookingLocale) {
  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-GB" : "de-DE";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string, locale: BookingLocale) {
  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-GB" : "de-DE";
  try {
    return new Intl.DateTimeFormat(intlLocale, { dateStyle: "long" }).format(
      new Date(`${value}T12:00:00Z`)
    );
  } catch {
    return value;
  }
}

const GOLD = "#b4884c";
const INK = "#201b17";
const CREAM = "#faf7f1";

function shell(title: string, bodyRows: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f3efe7;font-family:Georgia,'Times New Roman',serif;color:${INK}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3efe7;padding:28px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fffdf9;border:1px solid #e2d7c8;border-radius:18px;overflow:hidden">
<tr><td style="background:${INK};padding:26px 32px">
<div style="color:#e8d6b7;font-size:11px;letter-spacing:3px;text-transform:uppercase">${siteConfig.shortName}</div>
<div style="color:#fff;font-size:26px;margin-top:8px;line-height:1.1">${title}</div>
</td></tr>
<tr><td style="padding:28px 32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.6">
${bodyRows}
</table>
</td></tr>
<tr><td style="padding:20px 32px;background:${CREAM};border-top:1px solid #eadfce;font-size:12px;color:#7b7368;line-height:1.6">
${footer}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function detailRows(data: BookingEmailData, locale: BookingLocale, labels: Record<string, string>) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:7px 0;color:#7b7368;width:44%">${label}</td><td style="padding:7px 0;color:${INK};font-weight:bold">${value}</td></tr>`;
  return `
${row(labels.room, data.roomTitle)}
${row(labels.checkIn, formatDate(data.checkIn, locale))}
${row(labels.checkOut, formatDate(data.checkOut, locale))}
${row(labels.nights, String(data.nights))}
${row(labels.guests, String(data.guests))}
${data.mealPlanLabel ? row(labels.meal, data.mealPlanLabel) : ""}
${row(labels.total, formatCurrency(data.totalAmount, locale))}
${row(labels.bookingId, data.bookingId)}`;
}

const copy = {
  de: {
    receivedTitle: "Buchungsanfrage erhalten",
    receivedIntro: (name: string) =>
      `Liebe/r ${name}, vielen Dank für Ihre Reservierungsanfrage. Wir haben sie erhalten und melden uns in Kürze mit der Bestätigung.`,
    confirmedTitle: "Ihre Buchung ist bestätigt",
    confirmedIntro: (name: string) =>
      `Liebe/r ${name}, wir freuen uns, Ihre Buchung zu bestätigen. Wir freuen uns auf Ihren Aufenthalt.`,
    cancelledTitle: "Ihre Buchung wurde storniert",
    cancelledIntro: (name: string) =>
      `Liebe/r ${name}, Ihre Buchung wurde storniert. Bei Fragen erreichen Sie uns jederzeit.`,
    reason: "Grund",
    detailsTitle: "Details Ihres Aufenthalts",
    labels: {
      room: "Zimmer",
      checkIn: "Anreise",
      checkOut: "Abreise",
      nights: "Nächte",
      guests: "Gäste",
      meal: "Verpflegung",
      total: "Gesamtbetrag",
      bookingId: "Buchungsnummer",
    },
    footer: `${siteConfig.name} · ${siteConfig.address.street}, ${siteConfig.address.zip} ${siteConfig.address.city} · ${siteConfig.phoneDisplay} · ${siteConfig.email}`,
  },
  en: {
    receivedTitle: "Booking request received",
    receivedIntro: (name: string) =>
      `Dear ${name}, thank you for your reservation request. We have received it and will get back to you shortly with a confirmation.`,
    confirmedTitle: "Your booking is confirmed",
    confirmedIntro: (name: string) =>
      `Dear ${name}, we are pleased to confirm your booking. We look forward to welcoming you.`,
    cancelledTitle: "Your booking has been cancelled",
    cancelledIntro: (name: string) =>
      `Dear ${name}, your booking has been cancelled. If you have any questions, please contact us anytime.`,
    reason: "Reason",
    detailsTitle: "Your stay details",
    labels: {
      room: "Room",
      checkIn: "Check-in",
      checkOut: "Check-out",
      nights: "Nights",
      guests: "Guests",
      meal: "Meal plan",
      total: "Total amount",
      bookingId: "Booking number",
    },
    footer: `${siteConfig.name} · ${siteConfig.address.street}, ${siteConfig.address.zip} ${siteConfig.address.city} · ${siteConfig.phoneDisplay} · ${siteConfig.email}`,
  },
  ru: {
    receivedTitle: "Заявка на бронирование получена",
    receivedIntro: (name: string) =>
      `Уважаемый(ая) ${name}, благодарим за заявку на бронирование. Мы её получили и вскоре свяжемся с вами для подтверждения.`,
    confirmedTitle: "Ваше бронирование подтверждено",
    confirmedIntro: (name: string) =>
      `Уважаемый(ая) ${name}, рады подтвердить ваше бронирование. Будем рады видеть вас у нас.`,
    cancelledTitle: "Ваше бронирование отменено",
    cancelledIntro: (name: string) =>
      `Уважаемый(ая) ${name}, ваше бронирование было отменено. Если есть вопросы — мы всегда на связи.`,
    reason: "Причина",
    detailsTitle: "Детали проживания",
    labels: {
      room: "Номер",
      checkIn: "Заезд",
      checkOut: "Выезд",
      nights: "Ночей",
      guests: "Гостей",
      meal: "Питание",
      total: "Итоговая сумма",
      bookingId: "Номер брони",
    },
    footer: `${siteConfig.name} · ${siteConfig.address.street}, ${siteConfig.address.zip} ${siteConfig.address.city} · ${siteConfig.phoneDisplay} · ${siteConfig.email}`,
  },
} as const;

function intro(text: string) {
  return `<tr><td style="padding-bottom:18px;font-size:15px;line-height:1.65">${text}</td></tr>`;
}

function detailsBlock(
  data: BookingEmailData,
  locale: BookingLocale,
  t: (typeof copy)[BookingLocale]
) {
  return `<tr><td style="padding-top:6px">
<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};margin-bottom:10px">${t.detailsTitle}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${detailRows(data, locale, t.labels)}
</table>
</td></tr>`;
}

export function buildGuestReceivedEmail(data: BookingEmailData, locale: BookingLocale) {
  const t = copy[locale];
  const name = `${data.firstName} ${data.lastName}`.trim();
  const html = shell(
    t.receivedTitle,
    intro(t.receivedIntro(name)) + detailsBlock(data, locale, t),
    t.footer
  );
  return { subject: `${t.receivedTitle} · ${data.bookingId}`, html };
}

export function buildGuestConfirmedEmail(data: BookingEmailData, locale: BookingLocale) {
  const t = copy[locale];
  const name = `${data.firstName} ${data.lastName}`.trim();
  const html = shell(
    t.confirmedTitle,
    intro(t.confirmedIntro(name)) + detailsBlock(data, locale, t),
    t.footer
  );
  return { subject: `${t.confirmedTitle} · ${data.bookingId}`, html };
}

export function buildGuestCancelledEmail(data: BookingEmailData, locale: BookingLocale) {
  const t = copy[locale];
  const name = `${data.firstName} ${data.lastName}`.trim();
  const reasonRow = data.cancellationReason
    ? `<tr><td style="padding-top:6px;font-size:14px;color:#7b7368">${t.reason}: <span style="color:${INK}">${data.cancellationReason}</span></td></tr>`
    : "";
  const html = shell(
    t.cancelledTitle,
    intro(t.cancelledIntro(name)) + detailsBlock(data, locale, t) + reasonRow,
    t.footer
  );
  return { subject: `${t.cancelledTitle} · ${data.bookingId}`, html };
}

export function buildBookingVerificationEmail(
  data: BookingVerificationEmailData,
  locale: BookingLocale
) {
  const name = `${data.firstName} ${data.lastName}`.trim();
  const t = {
    de: {
      title: "Buchung per E-Mail bestätigen",
      intro: `Liebe/r ${name}, bitte bestätigen Sie Ihre E-Mail-Adresse, damit wir Ihre Buchungsanfrage abschließen können.`,
      codeLabel: "Ihr Bestätigungscode",
      expires: `Der Code ist ${data.expiresInMinutes} Minuten gültig.`,
      note:
        "Falls Sie diese Buchung nicht angefragt haben, können Sie diese E-Mail ignorieren.",
      subject: "Bestätigungscode für Ihre Buchung",
      footer: copy.de.footer,
    },
    en: {
      title: "Confirm booking by email",
      intro: `Dear ${name}, please confirm your email address so we can complete your booking request.`,
      codeLabel: "Your confirmation code",
      expires: `The code is valid for ${data.expiresInMinutes} minutes.`,
      note:
        "If you did not request this booking, you can ignore this email.",
      subject: "Confirmation code for your booking",
      footer: copy.en.footer,
    },
    ru: {
      title: "Подтверждение бронирования по e-mail",
      intro: `Уважаемый(ая) ${name}, подтвердите ваш e-mail, чтобы мы могли завершить заявку на бронирование.`,
      codeLabel: "Ваш код подтверждения",
      expires: `Код действует ${data.expiresInMinutes} минут.`,
      note:
        "Если вы не отправляли заявку на бронирование, просто проигнорируйте это письмо.",
      subject: "Код подтверждения бронирования",
      footer: copy.ru.footer,
    },
  }[locale];
  const codeBlock = `<tr><td style="padding:16px 0 18px">
<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};margin-bottom:10px">${t.codeLabel}</div>
<div style="display:inline-block;padding:14px 18px;border:1px solid #e2d7c8;border-radius:14px;background:${CREAM};font-size:28px;letter-spacing:8px;font-weight:bold;color:${INK}">${data.code}</div>
<div style="margin-top:12px;font-size:13px;color:#7b7368">${t.expires}</div>
</td></tr>`;
  const note = `<tr><td style="padding-top:4px;font-size:13px;line-height:1.6;color:#7b7368">${t.note}</td></tr>`;
  const html = shell(t.title, intro(t.intro) + codeBlock + note, t.footer);

  return {
    subject: t.subject,
    html,
    text: `${t.title}\n\n${t.intro}\n\n${t.codeLabel}: ${data.code}\n${t.expires}\n\n${t.note}`,
  };
}

/**
 * Internal hotel notification (always German), with guest contact + address.
 */
export function buildHotelNotificationEmail(data: BookingEmailData) {
  const t = copy.de;
  const address = [data.street, `${data.postalCode ?? ""} ${data.city ?? ""}`.trim(), data.country]
    .filter(Boolean)
    .join(", ");
  const contactRows = `
<tr><td style="padding:7px 0;color:#7b7368;width:44%">Gast</td><td style="padding:7px 0;color:${INK};font-weight:bold">${data.firstName} ${data.lastName}</td></tr>
<tr><td style="padding:7px 0;color:#7b7368">E-Mail</td><td style="padding:7px 0;color:${INK}">${data.email}</td></tr>
${data.phone ? `<tr><td style="padding:7px 0;color:#7b7368">Telefon</td><td style="padding:7px 0;color:${INK}">${data.phone}</td></tr>` : ""}
${address ? `<tr><td style="padding:7px 0;color:#7b7368">Anschrift</td><td style="padding:7px 0;color:${INK}">${address}</td></tr>` : ""}`;
  const body =
    intro("Es ist eine neue Buchungsanfrage über die Website eingegangen.") +
    detailsBlock(data, "de", t) +
    `<tr><td style="padding-top:18px">
<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};margin-bottom:10px">Gastdaten</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">${contactRows}</table>
</td></tr>`;
  const html = shell("Neue Buchung", body, t.footer);
  return { subject: `Neue Buchung · ${data.firstName} ${data.lastName} · ${data.bookingId}`, html };
}
