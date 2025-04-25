/*
  Warnings:

  - A unique constraint covering the columns `[questionId,name,sessionId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_questionId_name_key";

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_questionId_name_sessionId_key" ON "Reaction"("questionId", "name", "sessionId");
