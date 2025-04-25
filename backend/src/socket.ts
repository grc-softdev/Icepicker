import { Server } from "socket.io";
import http from "http";

import { GetSessionService } from "./services/GetSessionService";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join-room", (sessionId: string) => {
      socket.join(sessionId);
      console.log(`User joined session ${sessionId}`);
    });

    const emitSessionUpdated = (sessionId: string, updatedSessionData: any) => {
      io.to(sessionId).emit("sessionUpdated", updatedSessionData);
    };

    socket.on("new-user", async (sessionId: string, newUser: any) => {
      try {
        const updatedSessionData = await new GetSessionService().execute({
          sessionId,
        });

        emitSessionUpdated(sessionId, updatedSessionData);
      } catch (error) {
        console.error("Update data failed:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};