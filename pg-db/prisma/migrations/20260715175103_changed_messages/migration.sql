/*
  Warnings:

  - Added the required column `sentAt` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "InterviewStatus" ADD VALUE 'Marking';

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "feedback" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL;
