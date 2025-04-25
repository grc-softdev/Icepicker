import prismaClient from "../prisma";

interface ListQuestionRequest {
  sessionId: string;
}

class ListQuestionService {
  async execute({ sessionId }: ListQuestionRequest) {
    const session = await prismaClient.session.findUnique({
      where: { id: sessionId },
      select: {
        currentQuestionId: true,
        questions: {
          orderBy: {
            question: {
              createdAt: "desc",
            },
          },
          include: {
            question: {
              include: {
                reactions: {
                  include: {
                    userReactions: {
                      include: {
                        user: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session) throw new Error("Session not found.");

    const questionsWithStatus = session.questions.map(({ question }) => ({
      ...question,
      isCurrent: question.id === session.currentQuestionId,
      reactions: question.reactions.map((reaction) => ({
        ...reaction,
        users: reaction.userReactions.map((us) => us.user)
      })),
    }));
    console.log(questionsWithStatus);
    return questionsWithStatus;
  }
}

export { ListQuestionService };
