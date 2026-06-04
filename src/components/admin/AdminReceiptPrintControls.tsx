"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function AdminReceiptPrintControls({
  autoPrint,
  backHref,
}: {
  autoPrint: boolean;
  backHref: string;
}) {
  useEffect(() => {
    if (!autoPrint) {
      return;
    }

    const frame = window.requestAnimationFrame(() => window.print());
    return () => window.cancelAnimationFrame(frame);
  }, [autoPrint]);

  return (
    <div className="print:hidden mx-auto mb-5 flex max-w-[210mm] flex-wrap gap-3">
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d8cbb8] bg-white px-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#5d564c] transition-colors hover:border-[#bfa987] hover:text-[#201b17]"
      >
        <ArrowLeft className="h-4 w-4" />
        Zur Buchung
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#b58a4d] bg-[#b58a4d] px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#9f773f]"
      >
        <Printer className="h-4 w-4" />
        Drucken
      </button>
    </div>
  );
}
