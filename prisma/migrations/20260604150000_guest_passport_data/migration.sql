ALTER TABLE "Guest"
ADD COLUMN "isForeignGuest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "dateOfBirth" DATE,
ADD COLUMN "nationality" TEXT,
ADD COLUMN "passportNumber" TEXT,
ADD COLUMN "passportIssuingCountry" TEXT,
ADD COLUMN "passportExpiryDate" DATE;
