-- Residential address of the guest, collected during online booking for
-- invoice and contract purposes. The full Meldeschein for foreign guests is
-- still completed on site at check-in under BMG sections 29-30.
ALTER TABLE "Guest"
ADD COLUMN "street" TEXT,
ADD COLUMN "postalCode" TEXT,
ADD COLUMN "city" TEXT,
ADD COLUMN "country" TEXT;
