/*
  Warnings:

  - You are about to drop the `UserReaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,questionId,name]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserReaction" DROP CONSTRAINT "UserReaction_reactionId_fkey";

-- DropForeignKey
ALTER TABLE "UserReaction" DROP CONSTRAINT "UserReaction_userId_fkey";

-- DropIndex
DROP INDEX "Reaction_questionId_name_key";

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "amount" DROP DEFAULT,
ALTER COLUMN "name" DROP DEFAULT;

-- DropTable
DROP TABLE "UserReaction";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_questionId_name_key" ON "Reaction"("userId", "questionId", "name");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
