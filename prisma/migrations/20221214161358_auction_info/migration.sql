-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('Gasoline', 'Diesel', 'Electricity', 'Hybrid');

-- CreateEnum
CREATE TYPE "DurationType" AS ENUM ('ThreeDays', 'OneWeek', 'TwoWeek');

-- CreateTable
CREATE TABLE "Auction" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "brand" INTEGER NOT NULL,
    "model" INTEGER NOT NULL,
    "build_year" INTEGER NOT NULL,
    "fuel" "FuelType" NOT NULL,
    "images" TEXT[],
    "description" TEXT,
    "duration" "DurationType" NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "expected_price" DOUBLE PRECISION NOT NULL,
    "color" TEXT,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionSpecs" (
    "id" TEXT NOT NULL,
    "carrosserie" INTEGER NOT NULL,
    "transmission" INTEGER NOT NULL,
    "doors" INTEGER NOT NULL,
    "cv" DOUBLE PRECISION NOT NULL,
    "cc" DOUBLE PRECISION NOT NULL,
    "co2" DOUBLE PRECISION NOT NULL,
    "kilometrage" DOUBLE PRECISION NOT NULL,
    "version" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,

    CONSTRAINT "AuctionSpecs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionOptions" (
    "id" TEXT NOT NULL,
    "airco" BOOLEAN NOT NULL DEFAULT false,
    "electric_windows" BOOLEAN NOT NULL DEFAULT false,
    "climate_control" BOOLEAN NOT NULL DEFAULT false,
    "panoramic_roof_or_open_roof" BOOLEAN NOT NULL DEFAULT false,
    "central_locking" BOOLEAN NOT NULL DEFAULT false,
    "xenon_lighting" BOOLEAN NOT NULL DEFAULT false,
    "light_alloy_wheels" BOOLEAN NOT NULL DEFAULT false,
    "four_by_four" BOOLEAN NOT NULL DEFAULT false,
    "power_steering" BOOLEAN NOT NULL DEFAULT false,
    "cruise_control" BOOLEAN NOT NULL DEFAULT false,
    "radio_cd" BOOLEAN NOT NULL DEFAULT false,
    "parking_sensors" BOOLEAN NOT NULL DEFAULT false,
    "on_board_computer" BOOLEAN NOT NULL DEFAULT false,
    "parking_camera" BOOLEAN NOT NULL DEFAULT false,
    "start_stop" BOOLEAN NOT NULL DEFAULT false,
    "electric_mirrors" BOOLEAN NOT NULL DEFAULT false,
    "abs" BOOLEAN NOT NULL DEFAULT false,
    "tow_hook" BOOLEAN NOT NULL DEFAULT false,
    "dead_angle_detection" BOOLEAN NOT NULL DEFAULT false,
    "auction_id" TEXT NOT NULL,

    CONSTRAINT "AuctionOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionRating" (
    "id" TEXT NOT NULL,
    "handling" INTEGER,
    "tires" INTEGER,
    "exterior" INTEGER,
    "interior" INTEGER,
    "auction_id" TEXT NOT NULL,

    CONSTRAINT "AuctionRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "zipCode" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "auction_id" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuctionSpecs_auction_id_key" ON "AuctionSpecs"("auction_id");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionOptions_auction_id_key" ON "AuctionOptions"("auction_id");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionRating_auction_id_key" ON "AuctionRating"("auction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Address_auction_id_key" ON "Address"("auction_id");

-- AddForeignKey
ALTER TABLE "AuctionSpecs" ADD CONSTRAINT "AuctionSpecs_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionOptions" ADD CONSTRAINT "AuctionOptions_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionRating" ADD CONSTRAINT "AuctionRating_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
