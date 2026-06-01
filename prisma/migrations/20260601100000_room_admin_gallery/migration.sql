-- Extend room administration with room numbers, recommendations and galleries.
ALTER TABLE "Room" ADD COLUMN "roomNumber" TEXT;
ALTER TABLE "Room" ADD COLUMN "recommendationDe" TEXT;
ALTER TABLE "Room" ADD COLUMN "recommendationEn" TEXT;
ALTER TABLE "Room" ADD COLUMN "recommendationRu" TEXT;
ALTER TABLE "Room" ADD COLUMN "imageUrls" JSONB;

CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");
