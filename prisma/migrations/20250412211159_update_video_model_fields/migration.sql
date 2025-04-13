/*
  Warnings:

  - Made the column `examType` on table `Video` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_classId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_subjectId_fkey";

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "subjectId" DROP NOT NULL,
ALTER COLUMN "classId" DROP NOT NULL,
ALTER COLUMN "examType" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
