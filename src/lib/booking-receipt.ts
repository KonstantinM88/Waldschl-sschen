import {
  BookingMealPlan,
  type BookingStatus,
  type RoomType,
} from "@prisma/client";
import { siteConfig } from "@/data/site";
import { getMealPlanLabel, getRoomTypeLabel } from "@/lib/booking-engine";

interface DecimalLike {
  toString(): string;
}

export interface BookingReceiptSource {
  id: string;
  status: BookingStatus;
  assignedRoomNumber: string | null;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  basePricePerNight: DecimalLike;
  baseTotal: DecimalLike;
  mealPlan: BookingMealPlan;
  mealPlanPricePerGuest: DecimalLike;
  mealPlanTotal: DecimalLike;
  extraBeds: number;
  extraBedPricePerNight: DecimalLike;
  extraBedTotal: DecimalLike;
  dogCount: number;
  dogFeePerNight: DecimalLike;
  dogFeeTotal: DecimalLike;
  bicycleReserved: boolean;
  restaurantReservationTime: string | null;
  totalAmount: DecimalLike;
  createdAt: Date;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    street: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
  };
  room: {
    type: RoomType;
  };
}

export interface BookingReceiptLine {
  description: string;
  label: string;
  quantity: string;
  total: number;
  unitPrice: number;
}

export interface GermanBookingReceipt {
  addressLines: string[];
  bookingCreatedAt: Date;
  bookingId: string;
  checkIn: Date;
  checkOut: Date;
  email: string;
  guestName: string;
  guests: number;
  issuedAt: Date;
  lineItems: BookingReceiptLine[];
  mealPlanLabel: string;
  nights: number;
  phone: string | null;
  reservations: string[];
  roomLabel: string;
  statusLabel: string;
  totalAmount: number;
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Anfrage offen",
  CONFIRMED: "Bestätigt",
  CANCELLED: "Storniert",
  CHECKED_IN: "Eingecheckt",
  CHECKED_OUT: "Ausgecheckt",
  NO_SHOW: "Nicht angereist",
};

function toNumber(value: DecimalLike) {
  return Number(value.toString());
}

export function formatGermanReceiptCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatGermanReceiptDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "long",
    timeZone: "Europe/Berlin",
  }).format(value);
}

export function formatGermanReceiptDateTime(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(value);
}

export function createGermanBookingReceipt(
  booking: BookingReceiptSource,
  issuedAt: Date = new Date()
): GermanBookingReceipt {
  const roomType = getRoomTypeLabel(booking.room.type, "de");
  const roomLabel = booking.assignedRoomNumber
    ? `${roomType}, Zimmer ${booking.assignedRoomNumber}`
    : roomType;
  const lineItems: BookingReceiptLine[] = [
    {
      label: "Übernachtung",
      description: `${roomLabel}, ${booking.guests} ${
        booking.guests === 1 ? "Gast" : "Gäste"
      }`,
      quantity: `${booking.nights} ${
        booking.nights === 1 ? "Nacht" : "Nächte"
      }`,
      unitPrice: toNumber(booking.basePricePerNight),
      total: toNumber(booking.baseTotal),
    },
  ];

  if (booking.mealPlan !== BookingMealPlan.ROOM_ONLY) {
    lineItems.push({
      label: getMealPlanLabel(booking.mealPlan, "de"),
      description: "Verpflegung pro Gast und Nacht",
      quantity: `${booking.guests} × ${booking.nights}`,
      unitPrice: toNumber(booking.mealPlanPricePerGuest),
      total: toNumber(booking.mealPlanTotal),
    });
  }

  if (booking.extraBeds > 0) {
    lineItems.push({
      label: "Zusatzbett",
      description: "Zusatzbett pro Nacht",
      quantity: `${booking.extraBeds} × ${booking.nights}`,
      unitPrice: toNumber(booking.extraBedPricePerNight),
      total: toNumber(booking.extraBedTotal),
    });
  }

  if (booking.dogCount > 0) {
    lineItems.push({
      label: "Hundezuschlag",
      description: "Hund pro Nacht",
      quantity: `${booking.dogCount} × ${booking.nights}`,
      unitPrice: toNumber(booking.dogFeePerNight),
      total: toNumber(booking.dogFeeTotal),
    });
  }

  const addressLines = [
    booking.guest.street,
    [booking.guest.postalCode, booking.guest.city].filter(Boolean).join(" "),
    booking.guest.country,
  ].filter((value): value is string => Boolean(value));
  const reservations = [
    booking.bicycleReserved ? "Fahrrad reserviert (kostenfrei)" : null,
    booking.restaurantReservationTime
      ? `Restaurantreservierung: ${booking.restaurantReservationTime} Uhr`
      : null,
  ].filter((value): value is string => Boolean(value));

  return {
    addressLines,
    bookingCreatedAt: booking.createdAt,
    bookingId: booking.id,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    email: booking.guest.email,
    guestName: `${booking.guest.firstName} ${booking.guest.lastName}`.trim(),
    guests: booking.guests,
    issuedAt,
    lineItems,
    mealPlanLabel: getMealPlanLabel(booking.mealPlan, "de"),
    nights: booking.nights,
    phone: booking.guest.phone,
    reservations,
    roomLabel,
    statusLabel: STATUS_LABELS[booking.status],
    totalAmount: toNumber(booking.totalAmount),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailDetailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 0;color:#786e61;width:42%;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#201b17;font-weight:600;vertical-align:top">${escapeHtml(value)}</td>
  </tr>`;
}

export function buildGermanBookingReceiptEmail(receipt: GermanBookingReceipt) {
  const address = receipt.addressLines.join(", ");
  const lineRows = receipt.lineItems
    .map(
      (line) => `<tr>
        <td style="padding:11px 8px 11px 0;border-bottom:1px solid #eadfce;vertical-align:top">
          <strong style="display:block;color:#201b17">${escapeHtml(line.label)}</strong>
          <span style="display:block;margin-top:3px;color:#786e61;font-size:12px">${escapeHtml(line.description)}</span>
        </td>
        <td style="padding:11px 8px;border-bottom:1px solid #eadfce;text-align:center;vertical-align:top;color:#5d564c">${escapeHtml(line.quantity)}</td>
        <td style="padding:11px 8px;border-bottom:1px solid #eadfce;text-align:right;vertical-align:top;color:#5d564c">${escapeHtml(formatGermanReceiptCurrency(line.unitPrice))}</td>
        <td style="padding:11px 0 11px 8px;border-bottom:1px solid #eadfce;text-align:right;vertical-align:top;font-weight:600;color:#201b17">${escapeHtml(formatGermanReceiptCurrency(line.total))}</td>
      </tr>`
    )
    .join("");
  const reservationRows = receipt.reservations.length
    ? `<div style="margin-top:20px;padding:15px 18px;border:1px solid #eadfce;border-radius:12px;background:#faf7f1">
        <div style="font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#b4884c;margin-bottom:8px">Weitere Reservierungen</div>
        ${receipt.reservations
          .map(
            (reservation) =>
              `<div style="margin-top:4px;color:#4f483f">${escapeHtml(reservation)}</div>`
          )
          .join("")}
      </div>`
    : "";
  const contactRows = [
    emailDetailRow("Gast", receipt.guestName),
    address ? emailDetailRow("Anschrift", address) : "",
    emailDetailRow("E-Mail", receipt.email),
    receipt.phone ? emailDetailRow("Telefon", receipt.phone) : "",
  ].join("");

  const html = `<!doctype html>
<html lang="de">
<body style="margin:0;padding:0;background:#f3efe7;font-family:Arial,Helvetica,sans-serif;color:#201b17">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:28px 0;background:#f3efe7">
    <tr><td align="center">
      <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;background:#fffdf9;border:1px solid #ded3c3;border-radius:16px;overflow:hidden">
        <tr><td style="padding:26px 32px;background:#201b17;color:#fff">
          <div style="color:#e6cfaa;font-size:11px;letter-spacing:2.5px;text-transform:uppercase">${escapeHtml(siteConfig.shortName)}</div>
          <div style="margin-top:8px;font-family:Georgia,'Times New Roman',serif;font-size:30px">Buchungsbeleg</div>
          <div style="margin-top:8px;color:#d6cbbd;font-size:13px">Buchung ${escapeHtml(receipt.bookingId)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <p style="margin:0 0 20px;line-height:1.6;color:#4f483f">Guten Tag ${escapeHtml(receipt.guestName)}, anbei erhalten Sie den aktuellen Buchungsbeleg zu Ihrem Aufenthalt.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
            ${emailDetailRow("Buchungsstatus", receipt.statusLabel)}
            ${emailDetailRow("Buchung vom", formatGermanReceiptDateTime(receipt.bookingCreatedAt))}
            ${emailDetailRow("Beleg erstellt am", formatGermanReceiptDateTime(receipt.issuedAt))}
            ${emailDetailRow("Anreise", formatGermanReceiptDate(receipt.checkIn))}
            ${emailDetailRow("Abreise", formatGermanReceiptDate(receipt.checkOut))}
            ${emailDetailRow("Zimmer", receipt.roomLabel)}
            ${emailDetailRow("Verpflegung", receipt.mealPlanLabel)}
          </table>

          <div style="margin-top:24px;font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#b4884c">Gastdaten</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;font-size:14px">${contactRows}</table>

          <div style="margin-top:24px;font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#b4884c">Leistungsübersicht</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;font-size:13px;border-top:1px solid #eadfce">
            <tr style="color:#786e61;font-size:11px;text-transform:uppercase;letter-spacing:1px">
              <th align="left" style="padding:9px 8px 9px 0;border-bottom:1px solid #eadfce">Leistung</th>
              <th align="center" style="padding:9px 8px;border-bottom:1px solid #eadfce">Menge</th>
              <th align="right" style="padding:9px 8px;border-bottom:1px solid #eadfce">Einzelpreis</th>
              <th align="right" style="padding:9px 0 9px 8px;border-bottom:1px solid #eadfce">Betrag</th>
            </tr>
            ${lineRows}
            <tr>
              <td colspan="3" style="padding:16px 8px 0 0;text-align:right;font-weight:600">Gesamtbetrag</td>
              <td style="padding:16px 0 0 8px;text-align:right;font-size:18px;font-weight:700;color:#201b17">${escapeHtml(formatGermanReceiptCurrency(receipt.totalAmount))}</td>
            </tr>
          </table>
          ${reservationRows}

          <div style="margin-top:24px;padding:14px 16px;border-left:3px solid #b4884c;background:#faf7f1;color:#6c6459;font-size:12px;line-height:1.6">
            Dieser Buchungsbeleg dokumentiert den aktuell gespeicherten Stand der Reservierung. Er ist kein Zahlungsnachweis und keine Rechnung.
          </div>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#faf7f1;border-top:1px solid #eadfce;color:#786e61;font-size:12px;line-height:1.6">
          ${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.address.street)}, ${escapeHtml(siteConfig.address.zip)} ${escapeHtml(siteConfig.address.city)} · ${escapeHtml(siteConfig.phoneDisplay)} · ${escapeHtml(siteConfig.email)}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const textLines = [
    "BUCHUNGSBELEG",
    `Buchung: ${receipt.bookingId}`,
    `Erstellt am: ${formatGermanReceiptDateTime(receipt.issuedAt)}`,
    "",
    `Gast: ${receipt.guestName}`,
    address ? `Anschrift: ${address}` : "",
    `E-Mail: ${receipt.email}`,
    receipt.phone ? `Telefon: ${receipt.phone}` : "",
    "",
    `Status: ${receipt.statusLabel}`,
    `Anreise: ${formatGermanReceiptDate(receipt.checkIn)}`,
    `Abreise: ${formatGermanReceiptDate(receipt.checkOut)}`,
    `Zimmer: ${receipt.roomLabel}`,
    `Verpflegung: ${receipt.mealPlanLabel}`,
    "",
    "Leistungsübersicht:",
    ...receipt.lineItems.map(
      (line) =>
        `${line.label} (${line.quantity} × ${formatGermanReceiptCurrency(line.unitPrice)}): ${formatGermanReceiptCurrency(line.total)}`
    ),
    `Gesamtbetrag: ${formatGermanReceiptCurrency(receipt.totalAmount)}`,
    ...receipt.reservations.map((reservation) => `Weitere Reservierung: ${reservation}`),
    "",
    "Dieser Buchungsbeleg dokumentiert den aktuell gespeicherten Stand der Reservierung. Er ist kein Zahlungsnachweis und keine Rechnung.",
  ].filter(Boolean);

  return {
    subject: `Buchungsbeleg · ${receipt.bookingId}`,
    html,
    text: textLines.join("\n"),
  };
}
