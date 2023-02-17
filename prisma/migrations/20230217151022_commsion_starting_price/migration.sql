-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "winner" BOOLEAN NOT NULL DEFAULT false;
