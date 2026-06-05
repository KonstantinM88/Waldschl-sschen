ALTER TABLE "Booking"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "termsVersion" TEXT,
ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

CREATE TABLE "BookingEmailVerification" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'de',
  "termsAcceptedAt" TIMESTAMP(3) NOT NULL,
  "termsVersion" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "BookingEmailVerification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BookingEmailVerification_email_createdAt_idx"
ON "BookingEmailVerification"("email", "createdAt");

CREATE INDEX "BookingEmailVerification_expiresAt_idx"
ON "BookingEmailVerification"("expiresAt");

CREATE INDEX "BookingEmailVerification_consumedAt_expiresAt_idx"
ON "BookingEmailVerification"("consumedAt", "expiresAt");
