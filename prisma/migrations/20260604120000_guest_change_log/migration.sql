CREATE TABLE "GuestChangeLog" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestChangeLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GuestChangeLog_bookingId_createdAt_idx"
ON "GuestChangeLog"("bookingId", "createdAt");

CREATE INDEX "GuestChangeLog_guestId_createdAt_idx"
ON "GuestChangeLog"("guestId", "createdAt");

ALTER TABLE "GuestChangeLog"
ADD CONSTRAINT "GuestChangeLog_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GuestChangeLog"
ADD CONSTRAINT "GuestChangeLog_guestId_fkey"
FOREIGN KEY ("guestId") REFERENCES "Guest"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
