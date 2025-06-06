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
exports.ToggleReactionService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const GetSessionService_1 = require("./GetSessionService");
const socket_1 = require("../socket");
class ToggleReactionService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, questionId, reactionName, sessionId, }) {
            const name = reactionName;
            const reaction = yield prisma_1.default.reaction.findFirst({
                where: {
                    questionId,
                    name,
                    sessionId,
                },
                include: {
                    userReactions: true,
                },
            });
            if (!reaction) {
                throw new Error("Reaction not found");
            }
            const userReaction = yield prisma_1.default.userReaction.findUnique({
                where: {
                    userId_reactionId: {
                        userId,
                        reactionId: reaction.id,
                    },
                },
            });
            if (userReaction) {
                yield prisma_1.default.userReaction.delete({
                    where: {
                        userId_reactionId: {
                            userId,
                            reactionId: reaction.id,
                        },
                    },
                });
                yield prisma_1.default.reaction.update({
                    where: { id: reaction.id },
                    data: { amount: { decrement: 1 } },
                });
                const allReactions = yield prisma_1.default.reaction.findMany({
                    where: { questionId, sessionId },
                    include: {
                        userReactions: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });
                const payload = allReactions.map((reaction) => ({
                    id: reaction.id,
                    name: reaction.name,
                    amount: reaction.amount,
                    questionId: reaction.questionId,
                    users: reaction.userReactions.map((userReaction) => ({
                        name: userReaction.user.name,
                        id: userReaction.user.id,
                    })),
                }));
                const updatedSession = yield new GetSessionService_1.GetSessionService().execute({
                    sessionId,
                });
                const io = (0, socket_1.getIO)();
                io.to(sessionId).emit("sessionUpdated", updatedSession);
                const question = yield prisma_1.default.question.findUnique({
                    where: { id: questionId },
                });
                return {
                    id: questionId,
                    name: (question === null || question === void 0 ? void 0 : question.name) || "",
                    reactions: payload,
                };
            }
            else {
                yield prisma_1.default.userReaction.create({
                    data: {
                        userId,
                        reactionId: reaction.id,
                    },
                });
                yield prisma_1.default.reaction.update({
                    where: { id: reaction.id },
                    data: { amount: { increment: 1 } },
                });
                const updated = yield prisma_1.default.reaction.findUnique({
                    where: { id: reaction.id },
                    include: {
                        userReactions: {
                            include: { user: true },
                        },
                    },
                });
                const allReactions = yield prisma_1.default.reaction.findMany({
                    where: { questionId },
                    include: {
                        userReactions: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });
                const payload = allReactions.map((reaction) => ({
                    id: reaction.id,
                    name: reaction.name,
                    amount: reaction.amount,
                    questionId: reaction.questionId,
                    users: reaction.userReactions.map((userReaction) => ({
                        name: userReaction.user.name,
                        id: userReaction.user.id,
                    })),
                }));
                const updatedSession = yield new GetSessionService_1.GetSessionService().execute({
                    sessionId,
                });
                const io = (0, socket_1.getIO)();
                io.to(sessionId).emit("sessionUpdated", updatedSession);
                const question = yield prisma_1.default.question.findUnique({
                    where: { id: questionId },
                });
                return {
                    id: questionId,
                    name: (question === null || question === void 0 ? void 0 : question.name) || "",
                    reactions: payload,
                };
            }
        });
    }
}
exports.ToggleReactionService = ToggleReactionService;
