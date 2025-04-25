import prismaClient from "../prisma";
import { getIO } from "../socket";

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

    const fullUpdatedSession = await prismaClient.session.findUnique({
      where: { id: sessionId },
      include: {
        users: true,
        questions: {
          orderBy: { createdAt: "asc" },
          include: { question: { include: { reactions: true } } },
        },
        currentQuestion: {
          include: { reactions: true },
        },
        currentUser: true,
      },
    });
    const io = getIO()
    io.to(sessionId).emit("sessionUpdated", fullUpdatedSession);

    return fullUpdatedSession;
  }
}

export { UpdateToNextQuestionService };
