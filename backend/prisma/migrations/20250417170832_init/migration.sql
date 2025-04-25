-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_currentQuestionId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "currentQuestionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
