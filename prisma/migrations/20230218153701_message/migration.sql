-- CreateEnum
CREATE TYPE "IntermalMessageType" AS ENUM ('client', 'admin');

-- AlterTable
ALTER TABLE "InternalMessage" ADD COLUMN     "type" "IntermalMessageType" NOT NULL DEFAULT 'client';
