import prismaClient from "../prisma";
import { avatars } from "../../avatars/avatars"
import { GetSessionService } from './GetSessionService';
import { getIO } from '../socket';

class JoinSessionService {
  async execute({ sessionId, name }: { sessionId: string; name: string }) {
    if (!sessionId || !name) {
      throw new Error("Session ID and name are required");
    }

    const session = await prismaClient.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error("Session not found");
    }

    let user = await prismaClient.user.findFirst({
      where: { name },
    });

    const usedAvatars = await prismaClient.user.findMany({
      where: { sessions: { some: { sessionId } } },
      select: { avatar: true },
    });
    
    const usedAvatarList = usedAvatars.map(u => u.avatar);
    const availableAvatars = avatars.filter(a => !usedAvatarList.includes(a));
    
    if (availableAvatars.length === 0) {
      throw new Error("Todos os avatares já foram utilizados");
    }
    
    if (!user) {
      const randomAvatar = availableAvatars[Math.floor(Math.random() * avatars.length)];
      user = await prismaClient.user.create({
        data: { name, avatar: randomAvatar },
      });
    }

    const alreadyJoined = await prismaClient.sessionUser.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId: user.id,
        },
      },
    });

    if (!alreadyJoined) {
      await prismaClient.sessionUser.create({
        data: {
          sessionId,
          userId: user.id,
          role: "GUEST",
        },
      });
    }

    const updatedSession = await new GetSessionService().execute({ sessionId });
    const io = getIO()
    io.to(sessionId).emit("sessionUpdated", updatedSession);

    return {
      sessionId: session.id,
      role: "GUEST",
      userName: user.name,
      sessionLink: `http://localhost:3000/session/${sessionId}`,
    };
  }
}

export { JoinSessionService };
