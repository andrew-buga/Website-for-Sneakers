-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'men',
ADD COLUMN "collection" TEXT NOT NULL DEFAULT 'summer',
ADD COLUMN "isTrending" BOOLEAN NOT NULL DEFAULT false;
