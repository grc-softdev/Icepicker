-- CreateEnum
CREATE TYPE "Role" AS ENUM ('HOST', 'GUEST');

-- AlterTable
ALTER TABLE "SessionUser" ADD COLUMN     "role" "Role";
