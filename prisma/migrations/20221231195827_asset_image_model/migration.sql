/*
  Warnings:

  - You are about to drop the column `published` on the `Auction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "published",
ADD COLUMN     "state" "AuctionState" NOT NULL DEFAULT 'pending';
