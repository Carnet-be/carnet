/*
  Warnings:

  - Added the required column `auctionnaire_id` to the `Auction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "auctionnaire_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_auctionnaire_id_fkey" FOREIGN KEY ("auctionnaire_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
