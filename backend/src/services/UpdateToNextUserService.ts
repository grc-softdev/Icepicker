import prismaClient from "../prisma";
import { getIO } from "../socket";

class UpdateToNextUserService {
  async execute({ sessionId }: { sessionId: string }) {
    const session = await prismaClient.session.findUnique({
      where: { id: sessionId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        currentUser: true,
      },
    });

    if (!session) throw new Error("Error, session not found");

    const currentUser = session.users.findIndex(
      (usr) => usr.userId === session.currentUserId
    );

    const nextIndex =
      currentUser + 1 >= session.users.length ? 0 : currentUser + 1;

    const nextUser = session.users[nextIndex];

    await prismaClient.session.update({
      where: { id: sessionId },
      data: { currentUserId: nextUser.user.id },
      include: {
        currentUser: true,
      },
    });

    const fullUpdatedSession = await prismaClient.session.findUnique({
      where: { id: sessionId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        currentUser: true,
        currentQuestion: {
          include: {
            reactions: true,
          },
        },
        questions: {
          orderBy: { createdAt: "asc" },
          include: {
            question: {
              include: {
                reactions: true,
              },
            },
          },
        },
      },
    });
    const io = getIO()
    io.to(sessionId).emit("sessionUpdated", fullUpdatedSession);

    return fullUpdatedSession;
  }
}

export { UpdateToNextUserService };
