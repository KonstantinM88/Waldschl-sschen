import { notFound } from "next/navigation";
import AdminReceiptPrintControls from "@/components/admin/AdminReceiptPrintControls";
import { siteConfig } from "@/data/site";
import { requireAdminSession } from "@/lib/admin-dashboard";
import {
  createGermanBookingReceipt,
  formatGermanReceiptCurrency,
  formatGermanReceiptDate,
  formatGermanReceiptDateTime,
} from "@/lib/booking-receipt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBookingReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const [booking, resolvedSearchParams] = await Promise.all([
    prisma.booking.findUnique({
      where: { id },
      include: {
        guest: true,
        room: true,
      },
    }),
    searchParams,
  ]);

  if (!booking) {
    notFound();
  }

  const receipt = createGermanBookingReceipt(booking);
  const autoPrint = resolvedSearchParams?.print === "1";

  return (
    <main className="min-h-screen bg-[#eee9df] px-3 py-5 text-[#201b17] sm:px-6 sm:py-8 print:min-h-0 print:bg-white print:p-0">
      <style>{`
        @page {
          size: A4;
          margin: 12mm;
        }
      `}</style>

      <AdminReceiptPrintControls
        autoPrint={autoPrint}
        backHref={`/admin/bookings/${booking.id}`}
      />

      <article className="mx-auto max-w-[210mm] overflow-hidden rounded-2xl border border-[#d8cbb8] bg-[#fffdf9] shadow-[0_22px_60px_rgba(42,32,22,0.12)] print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <header className="flex flex-col justify-between gap-6 bg-[#201b17] px-7 py-7 text-white sm:flex-row sm:items-start print:px-0 print:pb-5 print:pt-0 print:text-black">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#e6cfaa] print:text-[#6c6459]">
              {siteConfig.shortName}
            </div>
            <h1 className="mt-2 font-[var(--font-display)] text-4xl font-medium leading-none">
              Buchungsbeleg
            </h1>
            <p className="mt-3 text-sm text-[#d6cbbd] print:text-[#5d564c]">
              Aktueller Stand der Reservierung
            </p>
          </div>
          <dl className="grid gap-2 text-sm sm:text-right">
            <div>
              <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-[#b9aa96] print:text-[#786e61]">
                Buchungsnummer
              </dt>
              <dd className="mt-1 break-all font-medium">{receipt.bookingId}</dd>
            </div>
            <div>
              <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-[#b9aa96] print:text-[#786e61]">
                Erstellt am
              </dt>
              <dd className="mt-1">{formatGermanReceiptDateTime(receipt.issuedAt)}</dd>
            </div>
          </dl>
        </header>

        <div className="px-7 py-7 print:px-0 print:py-5">
          <section className="grid grid-cols-1 gap-7 sm:grid-cols-2 print:grid-cols-2">
            <div>
              <h2 className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#b4884c]">
                Aussteller
              </h2>
              <address className="mt-3 not-italic text-sm leading-6 text-[#4f483f]">
                <strong className="font-semibold text-[#201b17]">{siteConfig.name}</strong>
                <br />
                {siteConfig.address.street}
                <br />
                {siteConfig.address.zip} {siteConfig.address.city}
                <br />
                {siteConfig.address.country}
                <br />
                {siteConfig.phoneDisplay}
                <br />
                {siteConfig.email}
              </address>
            </div>
            <div>
              <h2 className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#b4884c]">
                Gast
              </h2>
              <address className="mt-3 not-italic text-sm leading-6 text-[#4f483f]">
                <strong className="font-semibold text-[#201b17]">{receipt.guestName}</strong>
                <br />
                {receipt.addressLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
                {receipt.email}
                {receipt.phone ? (
                  <>
                    <br />
                    {receipt.phone}
                  </>
                ) : null}
              </address>
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-3 border-y border-[#ded3c3] py-5 sm:grid-cols-2 print:grid-cols-2">
            <ReceiptDetail label="Buchungsstatus" value={receipt.statusLabel} />
            <ReceiptDetail
              label="Buchung vom"
              value={formatGermanReceiptDateTime(receipt.bookingCreatedAt)}
            />
            <ReceiptDetail label="Anreise" value={formatGermanReceiptDate(receipt.checkIn)} />
            <ReceiptDetail label="Abreise" value={formatGermanReceiptDate(receipt.checkOut)} />
            <ReceiptDetail label="Zimmer" value={receipt.roomLabel} />
            <ReceiptDetail label="Verpflegung" value={receipt.mealPlanLabel} />
          </section>

          <section className="mt-8">
            <h2 className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#b4884c]">
              Leistungsübersicht
            </h2>
            <div className="mt-4 overflow-x-auto print:overflow-visible">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm print:min-w-0">
                <thead>
                  <tr className="border-y border-[#ded3c3] text-[0.62rem] uppercase tracking-[0.12em] text-[#786e61]">
                    <th className="py-3 pr-3 font-semibold">Leistung</th>
                    <th className="px-3 py-3 text-center font-semibold">Menge</th>
                    <th className="px-3 py-3 text-right font-semibold">Einzelpreis</th>
                    <th className="py-3 pl-3 text-right font-semibold">Betrag</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.lineItems.map((line) => (
                    <tr key={line.label} className="border-b border-[#eadfce] align-top">
                      <td className="py-4 pr-3">
                        <strong className="block font-semibold text-[#201b17]">{line.label}</strong>
                        <span className="mt-1 block text-xs text-[#786e61]">{line.description}</span>
                      </td>
                      <td className="px-3 py-4 text-center text-[#5d564c]">{line.quantity}</td>
                      <td className="px-3 py-4 text-right text-[#5d564c]">
                        {formatGermanReceiptCurrency(line.unitPrice)}
                      </td>
                      <td className="py-4 pl-3 text-right font-semibold text-[#201b17]">
                        {formatGermanReceiptCurrency(line.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={3} className="pt-5 text-right text-sm font-semibold">
                      Gesamtbetrag
                    </th>
                    <td className="pt-5 text-right text-xl font-semibold">
                      {formatGermanReceiptCurrency(receipt.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {receipt.reservations.length ? (
            <section className="mt-8 rounded-xl border border-[#ded3c3] bg-[#faf7f1] px-5 py-4 print:break-inside-avoid">
              <h2 className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#b4884c]">
                Weitere Reservierungen
              </h2>
              <ul className="mt-3 space-y-1 text-sm text-[#4f483f]">
                {receipt.reservations.map((reservation) => (
                  <li key={reservation}>{reservation}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="mt-8 border-l-2 border-[#b4884c] bg-[#faf7f1] px-4 py-3 text-xs leading-5 text-[#6c6459] print:break-inside-avoid">
            Dieser Buchungsbeleg dokumentiert den aktuell gespeicherten Stand der
            Reservierung. Er ist kein Zahlungsnachweis und keine Rechnung.
          </p>
        </div>
      </article>
    </main>
  );
}

function ReceiptDetail({ label, value }: { label: string; value: string }) {
  return (
    <dl>
      <dt className="text-[0.62rem] uppercase tracking-[0.12em] text-[#8f836f]">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-[#201b17]">{value}</dd>
    </dl>
  );
}
