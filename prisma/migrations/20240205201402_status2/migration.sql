/*
  Warnings:

  - You are about to drop the column `statusId` on the `Tracking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tracking" DROP CONSTRAINT "Tracking_statusId_fkey";

-- AlterTable
ALTER TABLE "Tracking" DROP COLUMN "statusId",
ADD COLUMN     "status" TEXT;
