-- AlterTable
ALTER TABLE "Auction" ADD COLUMN     "pause_date" TIMESTAMP(3),
ALTER COLUMN "end_date" DROP NOT NULL;
