-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PENDING', 'ONGOING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Trip" (
    "id" UUID NOT NULL,
    "travellerId" UUID NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "luggageWeight" INTEGER NOT NULL,
    "maxTripPerDay" INTEGER,
    "tripStatus" "TripStatus" NOT NULL DEFAULT 'PENDING',
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "tripNotes" TEXT NOT NULL,
    "tripDurationDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
