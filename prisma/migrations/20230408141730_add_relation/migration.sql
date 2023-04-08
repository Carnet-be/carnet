/*
  Warnings:

  - The `currency` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD', 'GBP', 'MAD');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR';

-- DropEnum
DROP TYPE "AppCurrency";
