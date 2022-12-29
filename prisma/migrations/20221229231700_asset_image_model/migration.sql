-- DropForeignKey
ALTER TABLE "AuctionSpecs" DROP CONSTRAINT "AuctionSpecs_auction_id_fkey";

-- AddForeignKey
ALTER TABLE "AuctionSpecs" ADD CONSTRAINT "AuctionSpecs_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
