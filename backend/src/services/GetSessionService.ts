import prismaClient from "../prisma";
import { getIO } from "../socket";

class GetSessionService {
  async execute({ sessionId }: { sessionId: string }) {
    let session;
    try {
      session = await prismaClient.session.findUnique({
        where: { id: sessionId },
        include: {
          host: true,
          currentUser: true,
          currentQuestion: {
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
          users: {
            include: {
              user: true,
            },
          },
          questions: {
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

      if (!session) {
        const msg = "[E201] Session not found";
        console.error(msg, { sessionId });
        throw new Error(msg);
      }
    } catch (err) {
      const msg = "[E202] Error fetching session";
      console.error(msg, err);
      throw new Error(msg);
    }

    try {
      const data = {
        id: session.id,
        hostId: session.hostId,
        hostName: session.host?.name,
        currentUser: session.currentUser
          ? {
              id: session.currentUser.id,
              name: session.currentUser.name,
              avatar: session.currentUser.avatar,
            }
          : {
              id: session.hostId,
              name: session.host?.name,
              avatar: session.host?.avatar,
            },
        currentQuestion: session.currentQuestion && {
          id: session.currentQuestion?.id,
          name: session.currentQuestion?.name,
          reactions: session.currentQuestion.reactions.map((reaction) => ({
            id: reaction.id,
            name: reaction.name,
            amount: reaction.amount,
            questionId: reaction.questionId,
            createdAt: reaction.createdAt,
            users: reaction.userReactions
              .filter((usr) => usr.user !== null)
              .map((usr) => ({
                id: usr.user.id,
                name: usr.user.name,
              })),
          })),
        },
        users: session.users.map((sessionUser) => ({
          id: sessionUser.user.id,
          name: sessionUser.user.name,
          avatar: sessionUser.user.avatar,
          role: sessionUser.role,
        })),
        questions: session.questions.map((sessionQuestion) => ({
          id: sessionQuestion.question.id,
          name: sessionQuestion.question.name,
          reactions: sessionQuestion.question.reactions.map((reaction) => ({
            id: reaction.id,
            name: reaction.name,
            amount: reaction.amount,
            questionId: reaction.questionId,
            createdAt: reaction.createdAt,
            users: reaction.userReactions.map((usr) => ({
              id: usr.user.id,
              name: usr.user.name,
            })),
          })),
        })),
        sessionLink: `http://localhost:3000/session/${sessionId}`,
      };

      try {
        const io = getIO();
        io.to(sessionId).emit("sessionUpdated", data);
      } catch (emitErr) {
        const msg = "[E203] Error emitting session update via WebSocket";
        console.error(msg, emitErr);
      
      }

      return data;
    } catch (err) {
      const msg = "[E204] Error processing session data";
      console.error(msg, err);
      throw new Error(msg);
    }
  }
}

export { GetSessionService };