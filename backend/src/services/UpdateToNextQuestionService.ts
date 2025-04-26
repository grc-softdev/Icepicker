import prismaClient from "../prisma";
import { getIO } from "../socket";
import { GetSessionService } from "./GetSessionService";

class UpdateToNextQuestionService {
  async execute(sessionId: string) {
    const session = await prismaClient.session.findUnique({
      where: { id: sessionId },
      include: {
        questions: {
          orderBy: { createdAt: "asc" },
          include: { question: true },
        },
        currentQuestion: true,
      },
    });

    if (!session) throw new Error("Session not found.");

    const currentIndex = session.questions.findIndex(
      (quest) => quest.questionId === session.currentQuestionId
    );

    const nextIndex =
      currentIndex + 1 >= session.questions.length ? 0 : currentIndex + 1;
    const nextQuestion = session.questions[nextIndex];

    await prismaClient.session.update({
      where: { id: sessionId },
      data: { currentQuestionId: nextQuestion.question.id },
      include: {
        currentQuestion: true,
      },
    });

    const updatedSession = await new GetSessionService().execute({
      sessionId,
    });

    const io = getIO()
    
    io.to(sessionId).emit("sessionUpdated", updatedSession);

    return updatedSession;
  }
}

export { UpdateToNextQuestionService };
