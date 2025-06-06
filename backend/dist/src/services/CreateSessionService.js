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
exports.CreateSessionService = void 0;
const socket_1 = require("./../socket");
const prisma_1 = __importDefault(require("../prisma"));
const avatars_1 = require("../../avatars/avatars");
class CreateSessionService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name }) {
            try {
                if (!name) {
                    throw new Error("[E100] Validation Error: Name is required");
                }
                let user;
                try {
                    user = yield prisma_1.default.user.findFirst({ where: { name } });
                    if (!user) {
                        const randomAvatar = avatars_1.avatars[Math.floor(Math.random() * avatars_1.avatars.length)];
                        user = yield prisma_1.default.user.create({
                            data: { name, avatar: randomAvatar },
                        });
                    }
                }
                catch (err) {
                    throw new Error("[E101] Error finding or creating user");
                }
                let allQuestions;
                try {
                    allQuestions = yield prisma_1.default.question.findMany({
                        where: { isTemplate: true },
                        take: 25,
                        include: { reactions: true },
                        orderBy: { createdAt: "asc" },
                    });
                    console.log(allQuestions);
                    if (allQuestions.length === 0) {
                        throw new Error("[E102] No questions available in DB");
                    }
                }
                catch (err) {
                    throw new Error("[E103] Error fetching questions");
                }
                let session;
                try {
                    session = yield prisma_1.default.session.create({
                        data: {
                            hostId: user.id,
                            users: {
                                create: {
                                    userId: user.id,
                                    role: "HOST",
                                },
                            },
                        },
                    });
                }
                catch (err) {
                    throw new Error("[E104] Error creating session");
                }
                try {
                    for (const question of allQuestions) {
                        const clonedQuestion = yield prisma_1.default.question.create({
                            data: {
                                name: question.name,
                                isTemplate: false,
                                reactions: {
                                    create: question.reactions.map(reaction => ({
                                        name: reaction.name,
                                        amount: 0,
                                        sessionId: session.id,
                                    })),
                                },
                            },
                        });
                        yield prisma_1.default.sessionQuestion.create({
                            data: {
                                sessionId: session.id,
                                questionId: clonedQuestion.id,
                            },
                        });
                    }
                }
                catch (err) {
                    const msg = "[E105] Error cloning questions and reactions";
                    console.error(msg, err);
                    throw new Error(msg);
                }
                try {
                    const firstClonedQuestion = yield prisma_1.default.sessionQuestion.findFirst({
                        where: { sessionId: session.id },
                        orderBy: { createdAt: "asc" },
                    });
                    if (firstClonedQuestion) {
                        yield prisma_1.default.session.update({
                            where: { id: session.id },
                            data: { currentQuestionId: firstClonedQuestion.questionId },
                        });
                    }
                }
                catch (err) {
                    const msg = "[E106] Error setting current question";
                    console.error(msg, err);
                    throw new Error(msg);
                }
                let fullSession;
                try {
                    fullSession = yield prisma_1.default.session.findUnique({
                        where: { id: session.id },
                        include: {
                            users: {
                                include: { user: true },
                            },
                            currentUser: true,
                            currentQuestion: {
                                include: { reactions: true },
                            },
                            questions: {
                                orderBy: { createdAt: "asc" },
                                include: {
                                    question: {
                                        include: { reactions: true },
                                    },
                                },
                            },
                        },
                    });
                    if (fullSession) {
                        const io = (0, socket_1.getIO)();
                        io.to(session.id).emit("sessionUpdated", fullSession);
                    }
                }
                catch (err) {
                    const msg = "[E107] Error fetching or emitting full session data";
                    console.error(msg, err);
                    throw new Error(msg);
                }
                return {
                    sessionLink: `/session/${session.id}`,
                };
            }
            catch (err) {
                const msg = "[E999] Unhandled error in CreateSessionService.execute";
                console.error(msg, err);
                throw new Error("Error to create room");
            }
        });
    }
}
exports.CreateSessionService = CreateSessionService;
