import { getIO } from './../socket';
import prismaClient from "../prisma";
import { avatars } from "../../avatars/avatars";

class CreateSessionService {
  async execute({ name }: { name: string }) {
    try {
      if (!name) {
        throw new Error("[E100] Validation Error: Name is required");
      }

      // Buscar ou criar usuário
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
        throw new Error("[E101] Error finding or creating user");
      }

      // Buscar todas as questões template
      let allQuestions;
      try {
        allQuestions = await prismaClient.question.findMany({
          where: { isTemplate: true },
          take: 25,
          include: { reactions: true },
          orderBy: { createdAt: "asc" },
        });
        console.log(allQuestions)
        if (allQuestions.length === 0) {
          throw new Error("[E102] No questions available in DB");
        }
      } catch (err) {
        throw new Error("[E103] Error fetching questions");
      }

      // Criar a sessão
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
        throw new Error("[E104] Error creating session");
      }
      
      // Clonar questões e reações
      try {
        for (const question of allQuestions) {
          console.log(question)
          console.log("question", question.name, "reactions", question.reactions);
          const clonedQuestion = await prismaClient.question.create({
            data: {
              name: question.name,
              isTemplate: false,
              reactions: {
                create: question.reactions.map(reaction => ({
                  name: reaction.name,
                  amount: 0,
                  sessionId: session.id,
                })),
              },
            },
          });


          // Relacionar a pergunta à sessão
          await prismaClient.sessionQuestion.create({
            data: {
              sessionId: session.id,
              questionId: clonedQuestion.id,
            },
          });
        }
      } catch (err) {
        const msg = "[E105] Error cloning questions and reactions";
        console.error(msg, err);
        throw new Error(msg);
      }

      // Definir a primeira pergunta como a atual
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

      // Buscar a sessão completa para emitir via socket
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