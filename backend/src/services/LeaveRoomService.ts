
import prismaClient from "../prisma";
import { GetSessionService } from "./GetSessionService";
import { getIO } from "../socket";

type LeaveRoomInput = {
  sessionId: string;
  userId: string;
};

class LeaveRoomService {
  async execute({ sessionId, userId }: LeaveRoomInput) {
    const session = await prismaClient.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new Error("Session not found.");


    const userInSession = await prismaClient.sessionUser.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        }
      }
    })

    if(!userInSession) throw new Error ("User not found.")

    await prismaClient.sessionUser.delete({
      where: {
        sessionId_userId: {
          sessionId,
          userId,
        },
      },
    });

    const remainingUsers = await prismaClient.sessionUser.findMany({
      where: { sessionId },
      include: { user: true },
    });

    if (session.currentUserId === userId && remainingUsers.length > 0) {
      const newCurrentUser = remainingUsers[0];
      await prismaClient.session.update({
        where: { id: sessionId },
        data: {
          currentUserId: newCurrentUser.user.id,
        },
      });
    }

    if (session.hostId === userId) {
      const newHost = remainingUsers[0];

      if (newHost) {
        await prismaClient.session.update({
          where: { id: sessionId },
          data: { hostId: newHost.user.id },
        });
      } else {
          await prismaClient.sessionQuestion.deleteMany({
            where: { sessionId },
          });

        await prismaClient.session.delete({
          where: { id: sessionId },
        });
        const io = getIO()
        io.to(sessionId).emit("sessionDeleted");
        return { message: "deleted session" };
      }
    }

    const updatedSessionData = await new GetSessionService().execute({ sessionId });
    const io = getIO()
    io.to(sessionId).emit("sessionUpdated", updatedSessionData);

    return { message: "User removed successfully" };

  }
}

export { LeaveRoomService };