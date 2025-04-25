import { getIO } from './../socket';
import prismaClient from "../prisma";
import { avatars } from "../../avatars/avatars";

class CreateSessionService {
  async execute({ name }: { name: string }) {
    try {
      if (!name) {
        const msg = "[E100] Validation Error: Name is required";
        console.error(msg);
        throw new Error(msg);
      }

      let user;
      try {
        user = await prismaClient.user.findFirst({ where: { name } });
        if (!user) {
          const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
          user = await prismaClient.user.create({
            data: { name, avatar: randomAvatar },
          });
        }
      } catch (err) {
        const msg = "[E101] Error finding or creating user";
        console.error(msg, err);
        throw new Error(msg);
      }

      let allQuestions;
      try {
        allQuestions = await prismaClient.question.findMany({
          take: 20,
          include: { reactions: true },
          orderBy: { createdAt: "asc" },
        });

        if (allQuestions.length === 0) {
          const msg = "[E102] No questions available in DB";
          console.error(msg);
          throw new Error(msg);
        }
      } catch (err) {
        const msg = "[E103] Error fetching questions";
        console.error(msg, err);
        throw new Error(msg);
      }

      let session;
      try {
        session = await prismaClient.session.create({
          data: {
            hostId: user.id,
            users: {
              create: {
                userId: user.id,
                role: "HOST",
              },
            },
          },
        });
      } catch (err) {
        const msg = "[E104] Error creating session";
        console.error(msg, err);
        throw new Error(msg);
      }

      try {
        for (const question of allQuestions) {
          const clonedQuestion = await prismaClient.question.create({
            data: { name: question.name },
          });

          await prismaClient.sessionQuestion.create({
            data: {
              sessionId: session.id,
              questionId: clonedQuestion.id,
            },
          });

          const clonedReactions = question.reactions.map((reaction) => ({
            name: reaction.name,
            amount: 0,
            questionId: clonedQuestion.id,
            sessionId: session.id,
          }));

          await prismaClient.reaction.createMany({
            data: clonedReactions,
          });
        }
      } catch (err) {
        const msg = "[E105] Error cloning questions and reactions";
        console.error(msg, err);
        throw new Error(msg);
      }

      try {
        const firstClonedQuestion = await prismaClient.sessionQuestion.findFirst({
          where: { sessionId: session.id },
          orderBy: { createdAt: "asc" },
        });

        if (firstClonedQuestion) {
          await prismaClient.session.update({
            where: { id: session.id },
            data: { currentQuestionId: firstClonedQuestion.questionId },
          });
        }
      } catch (err) {
        const msg = "[E106] Error setting current question";
        console.error(msg, err);
        throw new Error(msg);
      }

      let fullSession;
      try {
        fullSession = await prismaClient.session.findUnique({
          where: { id: session.id },
          include: {
            users: {
              include: { user: true },
            },
            currentUser: true,
            currentQuestion: {
              include: { reactions: true },
            },
            questions: {
              orderBy: { createdAt: "asc" },
              include: {
                question: {
                  include: { reactions: true },
                },
              },
            },
          },
        });

        if (fullSession) {
          const io = getIO();
          io.to(session.id).emit("sessionUpdated", fullSession);
        }
      } catch (err) {
        const msg = "[E107] Error fetching or emitting full session data";
        console.error(msg, err);
        throw new Error(msg);
      }

      return {
        sessionLink: `/session/${session.id}`,
      };

    } catch (err) {
      const msg = "[E999] Unhandled error in CreateSessionService.execute";
      console.error(msg, err);
      throw new Error("Error to create room");
    }
  }
}

export { CreateSessionService };