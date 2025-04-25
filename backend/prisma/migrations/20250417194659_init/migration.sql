-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "currentUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_currentUserId_fkey" FOREIGN KEY ("currentUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
