/*
  Warnings:

  - You are about to drop the column `maxTripPerDay` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CarrierProfile" ADD COLUMN     "carrierRating" DOUBLE PRECISION DEFAULT 5.0,
ADD COLUMN     "maxTripPerDay" INTEGER;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "maxTripPerDay";
