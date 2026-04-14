import type { BookingStatus } from "@prisma/client";

const bookingStatusClasses: Record<BookingStatus, string> = {
  PENDING:
    "border-[#ead6a7] bg-[#fff6dd] text-[#8d6421]",
  CONFIRMED:
    "border-[#cfe5c6] bg-[#eef9ea] text-[#426b32]",
  CANCELLED:
    "border-[#efc2bb] bg-[#fff1ee] text-[#a24f43]",
  CHECKED_IN:
    "border-[#c8d8ef] bg-[#edf5ff] text-[#40638f]",
  CHECKED_OUT:
    "border-[#d6d2cb] bg-[#f4f1ec] text-[#6b6458]",
  NO_SHOW:
    "border-[#e6c7d7] bg-[#fbf0f6] text-[#8a4768]",
};

export default function AdminBookingStatusBadge({
  label,
  status,
}: {
  label: string;
  status: BookingStatus;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em]",
        bookingStatusClasses[status],
      ].join(" ")}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}
