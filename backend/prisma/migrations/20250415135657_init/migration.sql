/*
  Warnings:

  - A unique constraint covering the columns `[userId,sessionId,questionId,type]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Reaction_userId_sessionId_type_key";

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "questionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_sessionId_questionId_type_key" ON "Reaction"("userId", "sessionId", "questionId", "type");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
