/*
  Warnings:

  - A unique constraint covering the columns `[name,year,brand_id]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Model_name_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_year_brand_id_key" ON "Model"("name", "year", "brand_id");
