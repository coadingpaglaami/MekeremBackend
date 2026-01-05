-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TRAVELLER', 'CARRIER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,
    "password" TEXT,
    "refreshToken" TEXT,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "oauthProvider" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
