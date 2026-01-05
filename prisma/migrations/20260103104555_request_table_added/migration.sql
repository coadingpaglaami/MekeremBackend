-- CreateEnum
CREATE TYPE "requestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "SendRequest" (
    "id" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "tripId" UUID NOT NULL,
    "requestMessage" TEXT NOT NULL,
    "status" "requestStatus" NOT NULL DEFAULT 'PENDING',
    "productWeight" INTEGER NOT NULL,
    "productImage" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SendRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SendRequest" ADD CONSTRAINT "SendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendRequest" ADD CONSTRAINT "SendRequest_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
