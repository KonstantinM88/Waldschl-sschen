-- CreateTable
CREATE TABLE "RestaurantMenuCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleDe" TEXT NOT NULL,
    "titleEn" TEXT,
    "descriptionDe" TEXT,
    "descriptionEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantMenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantMenuItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nameDe" TEXT NOT NULL,
    "nameEn" TEXT,
    "descriptionDe" TEXT,
    "descriptionEn" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "allergens" TEXT,
    "isSignature" BOOLEAN NOT NULL DEFAULT false,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantMenuCategory_slug_key" ON "RestaurantMenuCategory"("slug");

-- CreateIndex
CREATE INDEX "RestaurantMenuCategory_isActive_sortOrder_idx" ON "RestaurantMenuCategory"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantMenuItem_slug_key" ON "RestaurantMenuItem"("slug");

-- CreateIndex
CREATE INDEX "RestaurantMenuItem_categoryId_isPublished_sortOrder_idx" ON "RestaurantMenuItem"("categoryId", "isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "RestaurantMenuItem_isPublished_sortOrder_idx" ON "RestaurantMenuItem"("isPublished", "sortOrder");

-- AddForeignKey
ALTER TABLE "RestaurantMenuItem" ADD CONSTRAINT "RestaurantMenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RestaurantMenuCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
