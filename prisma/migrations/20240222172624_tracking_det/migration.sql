-- DropForeignKey
ALTER TABLE "TrackingDetails" DROP CONSTRAINT "TrackingDetails_trackingId_fkey";

-- AlterTable
ALTER TABLE "TrackingDetails" ALTER COLUMN "trackingId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "TrackingDetails" ADD CONSTRAINT "TrackingDetails_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("hbl") ON DELETE RESTRICT ON UPDATE CASCADE;
