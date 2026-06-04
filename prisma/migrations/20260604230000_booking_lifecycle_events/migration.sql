CREATE TYPE "BookingLifecycleEventType" AS ENUM (
  'CREATED',
  'STATUS_CHANGED',
  'CANCELLED',
  'AUTO_STATUS_CHANGED'
);

CREATE TYPE "BookingLifecycleActorType" AS ENUM (
  'GUEST',
  'ADMIN',
  'SYSTEM'
);

CREATE TABLE "BookingLifecycleEvent" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "eventType" "BookingLifecycleEventType" NOT NULL,
  "fromStatus" "BookingStatus",
  "toStatus" "BookingStatus",
  "actorType" "BookingLifecycleActorType" NOT NULL,
  "actorName" TEXT,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BookingLifecycleEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BookingLifecycleEvent_bookingId_createdAt_idx"
ON "BookingLifecycleEvent"("bookingId", "createdAt");

ALTER TABLE "BookingLifecycleEvent"
ADD CONSTRAINT "BookingLifecycleEvent_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "Booking"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill the lifecycle that can be reconstructed from existing timestamps.
INSERT INTO "BookingLifecycleEvent" (
  "id",
  "bookingId",
  "eventType",
  "fromStatus",
  "toStatus",
  "actorType",
  "actorName",
  "details",
  "createdAt"
)
SELECT
  'ble_created_' || "id",
  "id",
  'CREATED'::"BookingLifecycleEventType",
  NULL,
  CASE
    WHEN "source" = 'WEB'::"BookingSource" THEN 'PENDING'::"BookingStatus"
    ELSE NULL
  END,
  CASE
    WHEN "source" = 'WEB'::"BookingSource"
      THEN 'GUEST'::"BookingLifecycleActorType"
    ELSE 'ADMIN'::"BookingLifecycleActorType"
  END,
  NULL,
  jsonb_build_object('backfilled', true, 'source', "source"::text),
  "createdAt"
FROM "Booking";

INSERT INTO "BookingLifecycleEvent" (
  "id", "bookingId", "eventType", "fromStatus", "toStatus",
  "actorType", "details", "createdAt"
)
SELECT
  'ble_confirmed_' || "id",
  "id",
  'STATUS_CHANGED'::"BookingLifecycleEventType",
  'PENDING'::"BookingStatus",
  'CONFIRMED'::"BookingStatus",
  'SYSTEM'::"BookingLifecycleActorType",
  jsonb_build_object('backfilled', true),
  "confirmedAt"
FROM "Booking"
WHERE "confirmedAt" IS NOT NULL;

INSERT INTO "BookingLifecycleEvent" (
  "id", "bookingId", "eventType", "fromStatus", "toStatus",
  "actorType", "details", "createdAt"
)
SELECT
  'ble_checked_in_' || "id",
  "id",
  'STATUS_CHANGED'::"BookingLifecycleEventType",
  'CONFIRMED'::"BookingStatus",
  'CHECKED_IN'::"BookingStatus",
  'SYSTEM'::"BookingLifecycleActorType",
  jsonb_build_object('backfilled', true),
  "checkedInAt"
FROM "Booking"
WHERE "checkedInAt" IS NOT NULL;

INSERT INTO "BookingLifecycleEvent" (
  "id", "bookingId", "eventType", "fromStatus", "toStatus",
  "actorType", "details", "createdAt"
)
SELECT
  'ble_cancelled_' || "id",
  "id",
  'CANCELLED'::"BookingLifecycleEventType",
  NULL,
  'CANCELLED'::"BookingStatus",
  'SYSTEM'::"BookingLifecycleActorType",
  jsonb_strip_nulls(
    jsonb_build_object(
      'backfilled', true,
      'cancellationReason', "cancellationReason"
    )
  ),
  "cancelledAt"
FROM "Booking"
WHERE "cancelledAt" IS NOT NULL;

INSERT INTO "BookingLifecycleEvent" (
  "id", "bookingId", "eventType", "fromStatus", "toStatus",
  "actorType", "details", "createdAt"
)
SELECT
  'ble_checked_out_' || "id",
  "id",
  'STATUS_CHANGED'::"BookingLifecycleEventType",
  'CHECKED_IN'::"BookingStatus",
  'CHECKED_OUT'::"BookingStatus",
  'SYSTEM'::"BookingLifecycleActorType",
  jsonb_build_object('backfilled', true),
  "checkedOutAt"
FROM "Booking"
WHERE "checkedOutAt" IS NOT NULL
  AND "autoCompletedAt" IS NULL;

INSERT INTO "BookingLifecycleEvent" (
  "id", "bookingId", "eventType", "fromStatus", "toStatus",
  "actorType", "details", "createdAt"
)
SELECT
  'ble_auto_' || "id",
  "id",
  'AUTO_STATUS_CHANGED'::"BookingLifecycleEventType",
  NULL,
  "status",
  'SYSTEM'::"BookingLifecycleActorType",
  jsonb_build_object('backfilled', true),
  "autoCompletedAt"
FROM "Booking"
WHERE "autoCompletedAt" IS NOT NULL;

INSERT INTO "BookingLifecycleEvent" (
  "id", "bookingId", "eventType", "fromStatus", "toStatus",
  "actorType", "details", "createdAt"
)
SELECT
  'ble_manual_no_show_' || "id",
  "id",
  'STATUS_CHANGED'::"BookingLifecycleEventType",
  NULL,
  'NO_SHOW'::"BookingStatus",
  'SYSTEM'::"BookingLifecycleActorType",
  jsonb_build_object('backfilled', true),
  "updatedAt"
FROM "Booking"
WHERE "status" = 'NO_SHOW'::"BookingStatus"
  AND "autoCompletedAt" IS NULL;
