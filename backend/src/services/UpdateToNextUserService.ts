import prismaClient from "../prisma";
import { getIO } from "../socket";
import { GetSessionService } from "./GetSessionService";

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

    const updatedSession = await new GetSessionService().execute({
      sessionId,
    });
    const io = getIO()



    io.to(sessionId).emit("sessionUpdated", updatedSession);

    return updatedSession;
  }
}

export { UpdateToNextUserService };
