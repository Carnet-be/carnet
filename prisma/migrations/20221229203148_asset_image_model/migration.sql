/*
  Warnings:

  - You are about to drop the column `images` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "images";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "AssetImage" (
    "name" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "auction_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "AssetImage_pkey" PRIMARY KEY ("fileKey")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetImage_user_id_key" ON "AssetImage"("user_id");

-- AddForeignKey
ALTER TABLE "AssetImage" ADD CONSTRAINT "AssetImage_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetImage" ADD CONSTRAINT "AssetImage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
