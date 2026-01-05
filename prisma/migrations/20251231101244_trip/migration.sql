/*
  Warnings:

  - Added the required column `transportType` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransportType" AS ENUM ('AIR', 'ROAD', 'RAIL', 'SEA');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "transportType" "TransportType" NOT NULL;
