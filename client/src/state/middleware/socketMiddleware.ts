import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { setData, initSocket } from "..";

let socket: Socket | null = null;

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
  if (initSocket.match(action)) {
    if (!socket) {
      const sessionId = action.payload;

      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3333";

      socket = io(socketUrl, { transports: ["websocket"] });

      socket.emit("join-room", sessionId);
      socket.emit("sessionDeleted", sessionId);

      socket.on("sessionUpdated", (updatedData) => {
        store.dispatch(setData(updatedData));
      });
    }
  }

  return next(action);
};

export const getSocket = () => socket;
