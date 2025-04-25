/*
  Warnings:

  - You are about to drop the `_RoomQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoomQuestions" DROP CONSTRAINT "_RoomQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomQuestions" DROP CONSTRAINT "_RoomQuestions_B_fkey";

-- DropTable
DROP TABLE "_RoomQuestions";

-- CreateTable
CREATE TABLE "_Room" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Room_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Room_B_index" ON "_Room"("B");

-- AddForeignKey
ALTER TABLE "_Room" ADD CONSTRAINT "_Room_A_fkey" FOREIGN KEY ("A") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Room" ADD CONSTRAINT "_Room_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
