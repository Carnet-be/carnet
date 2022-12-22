-- DropForeignKey
ALTER TABLE "AuctionSpecs" DROP CONSTRAINT "AuctionSpecs_auction_id_fkey";

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "bidder_id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bid_auction_id_key" ON "Bid"("auction_id");

-- AddForeignKey
ALTER TABLE "AuctionSpecs" ADD CONSTRAINT "AuctionSpecs_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
