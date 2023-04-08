/*
  Warnings:

  - The `currency` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AppCurrency" AS ENUM ('EUR', 'USD', 'GBP', 'MAD');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "currency",
ADD COLUMN     "currency" "AppCurrency" NOT NULL DEFAULT 'EUR';

-- DropEnum
DROP TYPE "Currency";
