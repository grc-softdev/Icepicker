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
exports.JoinSessionService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const avatars_1 = require("../../avatars/avatars");
const GetSessionService_1 = require("./GetSessionService");
const socket_1 = require("../socket");
class JoinSessionService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sessionId, name }) {
            if (!sessionId || !name) {
                throw new Error("Session ID and name are required");
            }
            const session = yield prisma_1.default.session.findUnique({
                where: { id: sessionId },
            });
            if (!session) {
                throw new Error("Session not found");
            }
            let user = yield prisma_1.default.user.findFirst({
                where: { name },
            });
            const usedAvatars = yield prisma_1.default.user.findMany({
                where: { sessions: { some: { sessionId } } },
                select: { avatar: true },
            });
            const usedAvatarList = usedAvatars.map(u => u.avatar);
            const availableAvatars = avatars_1.avatars.filter(a => !usedAvatarList.includes(a));
            if (availableAvatars.length === 0) {
                throw new Error("Todos os avatares já foram utilizados");
            }
            if (!user) {
                const randomAvatar = availableAvatars[Math.floor(Math.random() * avatars_1.avatars.length)];
                user = yield prisma_1.default.user.create({
                    data: { name, avatar: randomAvatar },
                });
            }
            const alreadyJoined = yield prisma_1.default.sessionUser.findUnique({
                where: {
                    sessionId_userId: {
                        sessionId,
                        userId: user.id,
                    },
                },
            });
            if (!alreadyJoined) {
                yield prisma_1.default.sessionUser.create({
                    data: {
                        sessionId,
                        userId: user.id,
                        role: "GUEST",
                    },
                });
            }
            const updatedSession = yield new GetSessionService_1.GetSessionService().execute({ sessionId });
            const io = (0, socket_1.getIO)();
            io.to(sessionId).emit("sessionUpdated", updatedSession);
            return {
                sessionId: session.id,
                role: "GUEST",
                userName: user.name,
                sessionLink: `http://localhost:3000/session/${sessionId}`,
            };
        });
    }
}
exports.JoinSessionService = JoinSessionService;
