/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "nom" TEXT,
ADD COLUMN     "nom_entreprise" TEXT,
ADD COLUMN     "prenom" TEXT,
ADD COLUMN     "tel" TEXT,
ALTER COLUMN "email" SET NOT NULL;
