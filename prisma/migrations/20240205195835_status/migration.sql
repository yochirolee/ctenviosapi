/*
  Warnings:

  - You are about to drop the column `status` on the `Tracking` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Tracking" DROP COLUMN "status",
ADD COLUMN     "statusId" INTEGER;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "TrackingStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TrackingStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TrackingStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
