"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const GetSessionService_1 = require("./services/GetSessionService");
const server_1 = require("./server");
let io;
const frontendURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://main.d9pxq75h0yt4e.amplifyapp.com';
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: [
                server_1.OWN_ORIGIN,
                frontendURL
            ],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("join-room", (sessionId) => {
            socket.join(sessionId);
            console.log(`User joined session ${sessionId}`);
        });
        const emitSessionUpdated = (sessionId, updatedSessionData) => {
            io.to(sessionId).emit("sessionUpdated", updatedSessionData);
        };
        socket.on("new-user", (sessionId, newUser) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const updatedSessionData = yield new GetSessionService_1.GetSessionService().execute({
                    sessionId,
                });
                emitSessionUpdated(sessionId, updatedSessionData);
            }
            catch (error) {
                console.error("Update data failed:", error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
exports.getIO = getIO;
