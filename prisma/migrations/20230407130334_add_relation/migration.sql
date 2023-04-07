/*
  Warnings:

  - The `locale` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "locale",
ADD COLUMN     "locale" "Language";
