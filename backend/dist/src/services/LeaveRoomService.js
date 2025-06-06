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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRoomService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const GetSessionService_1 = require("./GetSessionService");
const socket_1 = require("../socket");
class LeaveRoomService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sessionId, userId }) {
            const session = yield prisma_1.default.session.findUnique({
                where: { id: sessionId },
            });
            if (!session)
                throw new Error("Session not found.");
            const userInSession = yield prisma_1.default.sessionUser.findUnique({
                where: {
                    sessionId_userId: {
                        sessionId,
                        userId,
                    }
                }
            });
            if (!userInSession)
                throw new Error("User not found.");
            yield prisma_1.default.sessionUser.delete({
                where: {
                    sessionId_userId: {
                        sessionId,
                        userId,
                    },
                },
            });
            const remainingUsers = yield prisma_1.default.sessionUser.findMany({
                where: { sessionId },
                include: { user: true },
            });
            if (session.currentUserId === userId && remainingUsers.length > 0) {
                const newCurrentUser = remainingUsers[0];
                yield prisma_1.default.session.update({
                    where: { id: sessionId },
                    data: {
                        currentUserId: newCurrentUser.user.id,
                    },
                });
            }
            if (session.hostId === userId) {
                const newHost = remainingUsers[0];
                if (newHost) {
                    yield prisma_1.default.session.update({
                        where: { id: sessionId },
                        data: { hostId: newHost.user.id },
                    });
                }
                else {
                    yield prisma_1.default.sessionQuestion.deleteMany({
                        where: { sessionId },
                    });
                    yield prisma_1.default.session.delete({
                        where: { id: sessionId },
                    });
                    const io = (0, socket_1.getIO)();
                    io.to(sessionId).emit("sessionDeleted");
                    return { message: "deleted session" };
                }
            }
            const updatedSessionData = yield new GetSessionService_1.GetSessionService().execute({ sessionId });
            const io = (0, socket_1.getIO)();
            io.to(sessionId).emit("sessionUpdated", updatedSessionData);
            return { message: "User removed successfully" };
        });
    }
}
exports.LeaveRoomService = LeaveRoomService;
