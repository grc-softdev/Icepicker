import prismaClient from "../prisma";

const defaultReactions = ["thumb", "laugh","surprise", "heart"]

class CreateQuestionService {
  async execute({ name, sessionId }: { name: string, sessionId: string }) {
    const question = await prismaClient.question.create({
      data: {
        name, 

        reactions: {
          create: defaultReactions.map((reactionName) => ({
            name: reactionName,
            amount: 0, 
            sessionId,
          })),
        }
      },
      include: {
        reactions: {
          include: {
            userReactions: {
              include: {
                user: true,
              }
            }
          }
        }
      },
    });
    console.log(question)
    return question;
  }
}

export { CreateQuestionService };