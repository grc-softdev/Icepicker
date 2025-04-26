-- DropIndex
DROP INDEX "Reaction_questionId_name_sessionId_key";

-- CreateIndex
CREATE INDEX "Reaction_questionId_name_sessionId_idx" ON "Reaction"("questionId", "name", "sessionId");
