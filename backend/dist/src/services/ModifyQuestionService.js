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
exports.ModifyQuestionService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const socket_1 = require("../socket");
const transformQuestions_1 = require("../utils/transformQuestions");
const GetSessionService_1 = require("./GetSessionService");
class ModifyQuestionService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ questionId, tone, sessionId }) {
            const question = yield prisma_1.default.question.findUnique({
                where: { id: questionId },
            });
            if (!question) {
                throw new Error("Question not found");
            }
            const updatedSession = yield new GetSessionService_1.GetSessionService().execute({ sessionId });
            const io = (0, socket_1.getIO)();
            io.to(sessionId).emit("sessionUpdated", updatedSession);
            const modified = yield (0, transformQuestions_1.transformQuestions)([{ name: question.name }], tone);
            return modified;
        });
    }
}
exports.ModifyQuestionService = ModifyQuestionService;
