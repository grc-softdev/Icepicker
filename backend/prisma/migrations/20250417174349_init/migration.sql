/*
  Warnings:

  - You are about to drop the column `Role` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "Role",
ADD COLUMN     "role" "Role";
