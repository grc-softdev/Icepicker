/*
  Warnings:

  - You are about to drop the column `userId` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,name]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropIndex
DROP INDEX "Reaction_userId_questionId_name_key";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "userId",
ALTER COLUMN "amount" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "UserReaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserReaction_userId_reactionId_key" ON "UserReaction"("userId", "reactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_questionId_name_key" ON "Reaction"("questionId", "name");

-- AddForeignKey
ALTER TABLE "UserReaction" ADD CONSTRAINT "UserReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReaction" ADD CONSTRAINT "UserReaction_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
