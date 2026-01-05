-- CreateTable
CREATE TABLE "CarrierProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "nidNumber" TEXT NOT NULL,
    "nidFrontImage" TEXT,
    "nidBackImage" TEXT,
    "passportImage" TEXT,
    "drivingLicenseFront" TEXT,
    "drivingLicenseBack" TEXT,
    "selfies" TEXT[],
    "addressLineOne" TEXT,
    "addressLineTwo" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "isVerified" BOOLEAN DEFAULT false,

    CONSTRAINT "CarrierProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarrierProfile_userId_key" ON "CarrierProfile"("userId");

-- AddForeignKey
ALTER TABLE "CarrierProfile" ADD CONSTRAINT "CarrierProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
