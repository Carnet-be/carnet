-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "lat" DROP DEFAULT,
ALTER COLUMN "lon" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "zipCode" TEXT;
