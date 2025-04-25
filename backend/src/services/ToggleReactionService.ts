import prismaClient from "../prisma";
import { GetSessionService } from "./GetSessionService";
import { getIO } from "../socket";

interface ToggleReactionRequest {
  userId: string;
  questionId: string;
  reactionName: string;
  sessionId: string;
}
class ToggleReactionService {
  async execute({
    userId,
    questionId,
    reactionName,
    sessionId,
  }: ToggleReactionRequest) {
    const name = reactionName;

    const reaction = await prismaClient.reaction.findFirst({
      where: {
        questionId,
        name,
        sessionId,
      },
      include: {
        userReactions: true,
      },
    });
  
    if (!reaction) {
      throw new Error("Reaction not found");
    }

    const userReaction = await prismaClient.userReaction.findUnique({
      where: {
        userId_reactionId: {
          userId,
          reactionId: reaction.id,
        },
      },
    });

    if (userReaction) {
      await prismaClient.userReaction.delete({
        where: {
          userId_reactionId: {
            userId,
            reactionId: reaction.id,
          },
        },
      });

      await prismaClient.reaction.update({
        where: { id: reaction.id },
        data: { amount: { decrement: 1 } },
      });

      const allReactions = await prismaClient.reaction.findMany({
        where: { questionId, sessionId },
        include: {
          userReactions: {
            include: {
              user: true,
            },
          },
        },
      });

      const payload = allReactions.map((reaction) => ({
        id: reaction.id,
        name: reaction.name,
        amount: reaction.amount,
        questionId: reaction.questionId,
        users: reaction.userReactions.map((userReaction) => ({
          name: userReaction.user.name,
          id: userReaction.user.id,
        })),
      }));

      const updatedSession = await new GetSessionService().execute({
        sessionId,
      });
      const io = getIO()
      io.to(sessionId).emit("sessionUpdated", updatedSession);

      const question = await prismaClient.question.findUnique({
        where: { id: questionId },
      });

      return {
        id: questionId,
        name: question?.name || "",
        reactions: payload,
      };
    } else {
      await prismaClient.userReaction.create({
        data: {
          userId,
          reactionId: reaction.id,
        },
      });

      await prismaClient.reaction.update({
        where: { id: reaction.id },
        data: { amount: { increment: 1 } },
      });

      const updated = await prismaClient.reaction.findUnique({
        where: { id: reaction.id },
        include: {
          userReactions: {
            include: { user: true },
          },
        },
      });

      const allReactions = await prismaClient.reaction.findMany({
        where: { questionId },
        include: {
          userReactions: {
            include: {
              user: true,
            },
          },
        },
      });

      const payload = allReactions.map((reaction) => ({
        id: reaction.id,
        name: reaction.name,
        amount: reaction.amount,
        questionId: reaction.questionId,
        users: reaction.userReactions.map((userReaction) => ({
          name: userReaction.user.name,
          id: userReaction.user.id,
        })),
      }));

      const updatedSession = await new GetSessionService().execute({
        sessionId,
      });
      const io = getIO()
      io.to(sessionId).emit("sessionUpdated", updatedSession);

      const question = await prismaClient.question.findUnique({
        where: { id: questionId },
      });

      return {
        id: questionId,
        name: question?.name || "",
        reactions: payload,
      };
    }
  }
}

export { ToggleReactionService };
