ALTER TABLE "Booking"
ADD COLUMN "assignedRoomNumber" TEXT;

ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_assignedRoomNumber_format_check"
CHECK ("assignedRoomNumber" IS NULL OR "assignedRoomNumber" ~ '^[0-9]{3}$');

CREATE INDEX "Booking_assignedRoomNumber_checkIn_checkOut_idx"
ON "Booking"("assignedRoomNumber", "checkIn", "checkOut");
