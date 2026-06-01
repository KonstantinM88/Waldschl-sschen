-- Booking source: web (guest self-service) vs admin (manual entry by staff)
CREATE TYPE "BookingSource" AS ENUM ('WEB', 'ADMIN', 'PHONE', 'EMAIL', 'WALK_IN');

ALTER TABLE "Booking"
ADD COLUMN "source" "BookingSource" NOT NULL DEFAULT 'WEB',
ADD COLUMN "adminNotes" TEXT,
ADD COLUMN "cancellationReason" TEXT,
ADD COLUMN "confirmedAt" TIMESTAMP(3),
ADD COLUMN "cancelledAt" TIMESTAMP(3),
ADD COLUMN "checkedInAt" TIMESTAMP(3),
ADD COLUMN "checkedOutAt" TIMESTAMP(3),
ADD COLUMN "autoCompletedAt" TIMESTAMP(3);

-- Backfill lifecycle timestamps for existing rows so analytics has data to work with.
UPDATE "Booking" SET "confirmedAt" = "updatedAt"  WHERE "status" = 'CONFIRMED';
UPDATE "Booking" SET "checkedInAt" = "updatedAt"  WHERE "status" = 'CHECKED_IN';
UPDATE "Booking" SET "checkedOutAt" = "updatedAt" WHERE "status" = 'CHECKED_OUT';
UPDATE "Booking" SET "cancelledAt" = "updatedAt"  WHERE "status" = 'CANCELLED';

-- Index to make the expiry sweep (status + checkOut/checkIn windows) fast.
CREATE INDEX "Booking_status_checkOut_idx" ON "Booking"("status", "checkOut");
CREATE INDEX "Booking_source_createdAt_idx" ON "Booking"("source", "createdAt");
