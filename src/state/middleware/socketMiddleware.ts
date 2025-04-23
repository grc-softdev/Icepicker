import { Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { setData } from "..";


let socket: Socket | null = null;

export const socketMiddleware: Middleware = store => next => action => {
  if (action.type === "session/initSocket") {
    if (!socket) {
      const sessionId = action.payload;

      socket = io("http://localhost:3333", { transports: ["websocket"] });

      socket.emit("join-room", sessionId);

      socket.on("session-data", (data) => {

        console.log('session-data-event')

        store.dispatch(setData(data)); 
        // store.dispatch(setSessionId(data.sessionId)); 
        // store.dispatch(setCurrentUser(data.currentUser)); 
      });

      socket.on("sessionUpdated", (updatedData) => {
        console.log('sessionUpdated-event')

        store.dispatch(setData(updatedData));
      });
    }
  }

  return next(action);
};

export const getSocket = () => socket;