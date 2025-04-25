import prismaClient from "../prisma";
import { getIO } from "../socket";
import { transformQuestions } from "../utils/transformQuestions";
import { GetSessionService } from "./GetSessionService";

interface ModifyRequest {
  questionId: string;
  tone: "funnier" | "serious" | "exciting";
  sessionId: string;
}

class ModifyQuestionService {
  async execute({ questionId, tone, sessionId }: ModifyRequest) {
    const question = await prismaClient.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new Error("Question not found");
    }

    const updatedSession = await new GetSessionService().execute({ sessionId });
    const io = getIO()
    io.to(sessionId).emit("sessionUpdated", updatedSession);

    const modified = await transformQuestions([{ name: question.name }], tone);
    return modified;
  }
}

export { ModifyQuestionService };
