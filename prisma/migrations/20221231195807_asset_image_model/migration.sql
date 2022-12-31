/*
  Warnings:

  - The `published` column on the `Auction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AuctionState" AS ENUM ('published', 'pending');

-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "published",
ADD COLUMN     "published" "AuctionState" NOT NULL DEFAULT 'pending';
