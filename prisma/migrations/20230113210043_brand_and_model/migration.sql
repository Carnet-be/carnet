/*
  Warnings:

  - You are about to drop the column `year_build` on the `Model` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,year]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "year_build",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "year" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_year_key" ON "Model"("name", "year");
