/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Reaction` table. All the data in the column will be lost.
  - The primary key for the `UserReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `UserReaction` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `UserReaction` table. All the data in the column will be lost.
  - Added the required column `currentQuestionId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserReaction_userId_reactionId_key";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "currentQuestionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserReaction" DROP CONSTRAINT "UserReaction_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD CONSTRAINT "UserReaction_pkey" PRIMARY KEY ("userId", "reactionId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
