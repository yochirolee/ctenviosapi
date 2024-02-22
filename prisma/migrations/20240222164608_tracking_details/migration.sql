/*
  Warnings:

  - You are about to drop the column `image` on the `TrackingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `TrackingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `TrackingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TrackingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TrackingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `TrackingDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TrackingDetails" DROP COLUMN "image",
DROP COLUMN "locationId",
DROP COLUMN "notes",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy",
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "createdBy" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
