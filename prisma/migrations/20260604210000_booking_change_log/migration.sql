CREATE TABLE "BookingChangeLog" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingChangeLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BookingChangeLog_bookingId_createdAt_idx"
ON "BookingChangeLog"("bookingId", "createdAt");

ALTER TABLE "BookingChangeLog"
ADD CONSTRAINT "BookingChangeLog_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
