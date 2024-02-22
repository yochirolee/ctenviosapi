-- CreateTable
CREATE TABLE "TrackingDetails" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trackingId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "status" "TrackingStatus" NOT NULL,
    "image" TEXT,
    "notes" TEXT,

    CONSTRAINT "TrackingDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrackingDetails" ADD CONSTRAINT "TrackingDetails_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
