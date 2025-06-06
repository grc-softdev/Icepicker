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
exports.UpdateToNextUserService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const socket_1 = require("../socket");
const GetSessionService_1 = require("./GetSessionService");
class UpdateToNextUserService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sessionId }) {
            const session = yield prisma_1.default.session.findUnique({
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
            if (!session)
                throw new Error("Error, session not found");
            const currentUser = session.users.findIndex((usr) => usr.userId === session.currentUserId);
            const nextIndex = currentUser + 1 >= session.users.length ? 0 : currentUser + 1;
            const nextUser = session.users[nextIndex];
            yield prisma_1.default.session.update({
                where: { id: sessionId },
                data: { currentUserId: nextUser.user.id },
                include: {
                    currentUser: true,
                },
            });
            const updatedSession = yield new GetSessionService_1.GetSessionService().execute({
                sessionId,
            });
            const io = (0, socket_1.getIO)();
            io.to(sessionId).emit("sessionUpdated", updatedSession);
            return updatedSession;
        });
    }
}
exports.UpdateToNextUserService = UpdateToNextUserService;
