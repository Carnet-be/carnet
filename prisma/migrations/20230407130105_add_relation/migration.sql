-- CreateEnum
CREATE TYPE "Language" AS ENUM ('fr', 'en', 'ar', 'de', 'es', 'it', 'nl', 'pt', 'ru', 'zh', 'ja', 'ko');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('free', 'premium', 'freeTrial');

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "lat" SET DEFAULT 0,
ALTER COLUMN "lon" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "lang" "Language" NOT NULL DEFAULT 'fr',
ADD COLUMN     "subscriptionType" "SubscriptionType" NOT NULL DEFAULT 'free';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
