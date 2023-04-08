/*
  Warnings:

  - The `build_year` column on the `Auction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Auction" DROP COLUMN "build_year",
ADD COLUMN     "build_year" INTEGER;
