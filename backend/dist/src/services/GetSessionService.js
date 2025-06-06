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
exports.GetSessionService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const socket_1 = require("../socket");
class GetSessionService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sessionId }) {
            var _b, _c, _d, _e, _f;
            let session;
            try {
                session = yield prisma_1.default.session.findUnique({
                    where: { id: sessionId },
                    include: {
                        host: true,
                        currentUser: true,
                        currentQuestion: {
                            include: {
                                reactions: {
                                    include: {
                                        userReactions: {
                                            include: {
                                                user: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        users: {
                            include: {
                                user: true,
                            },
                        },
                        questions: {
                            include: {
                                question: {
                                    include: {
                                        reactions: {
                                            include: {
                                                userReactions: {
                                                    include: {
                                                        user: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!session) {
                    const msg = "[E201] Session not found";
                    console.error(msg, { sessionId });
                    throw new Error(msg);
                }
            }
            catch (err) {
                const msg = "[E202] Error fetching session";
                console.error(msg, err);
                throw new Error(msg);
            }
            try {
                const data = {
                    id: session.id,
                    hostId: session.hostId,
                    hostName: (_b = session.host) === null || _b === void 0 ? void 0 : _b.name,
                    currentUser: session.currentUser
                        ? {
                            id: session.currentUser.id,
                            name: session.currentUser.name,
                            avatar: session.currentUser.avatar,
                        }
                        : {
                            id: session.hostId,
                            name: (_c = session.host) === null || _c === void 0 ? void 0 : _c.name,
                            avatar: (_d = session.host) === null || _d === void 0 ? void 0 : _d.avatar,
                        },
                    currentQuestion: session.currentQuestion && {
                        id: (_e = session.currentQuestion) === null || _e === void 0 ? void 0 : _e.id,
                        name: (_f = session.currentQuestion) === null || _f === void 0 ? void 0 : _f.name,
                        reactions: session.currentQuestion.reactions.map((reaction) => ({
                            id: reaction.id,
                            name: reaction.name,
                            amount: reaction.amount,
                            questionId: reaction.questionId,
                            createdAt: reaction.createdAt,
                            users: reaction.userReactions
                                .filter((usr) => usr.user !== null)
                                .map((usr) => ({
                                id: usr.user.id,
                                name: usr.user.name,
                            })),
                        })),
                    },
                    users: session.users.map((sessionUser) => ({
                        id: sessionUser.user.id,
                        name: sessionUser.user.name,
                        avatar: sessionUser.user.avatar,
                        role: sessionUser.role,
                    })),
                    questions: session.questions.map((sessionQuestion) => ({
                        id: sessionQuestion.question.id,
                        name: sessionQuestion.question.name,
                        reactions: sessionQuestion.question.reactions.map((reaction) => ({
                            id: reaction.id,
                            name: reaction.name,
                            amount: reaction.amount,
                            questionId: reaction.questionId,
                            createdAt: reaction.createdAt,
                            users: reaction.userReactions.map((usr) => ({
                                id: usr.user.id,
                                name: usr.user.name,
                            })),
                        })),
                    })),
                    sessionLink: `http://localhost:3000/session/${sessionId}`,
                };
                try {
                    const io = (0, socket_1.getIO)();
                    io.to(sessionId).emit("sessionUpdated", data);
                }
                catch (emitErr) {
                    const msg = "[E203] Error emitting session update via WebSocket";
                    console.error(msg, emitErr);
                }
                return data;
            }
            catch (err) {
                const msg = "[E204] Error processing session data";
                console.error(msg, err);
                throw new Error(msg);
            }
        });
    }
}
exports.GetSessionService = GetSessionService;
