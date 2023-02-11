/*
  Warnings:

  - The `doors` column on the `AuctionSpecs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `lat` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lon` on table `Address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "lat" SET NOT NULL,
ALTER COLUMN "lon" SET NOT NULL;

-- AlterTable
ALTER TABLE "AuctionSpecs" DROP COLUMN "doors",
ADD COLUMN     "doors" INTEGER;
