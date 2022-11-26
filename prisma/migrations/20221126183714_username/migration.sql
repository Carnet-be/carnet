/*
  Warnings:

  - You are about to drop the column `nom` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `User` table. All the data in the column will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "nom",
DROP COLUMN "prenom",
ADD COLUMN     "username" TEXT NOT NULL;
