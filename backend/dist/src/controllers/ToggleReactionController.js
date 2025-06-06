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
exports.ToggleReactionController = void 0;
const ToggleReactionService_1 = require("../services/ToggleReactionService");
class ToggleReactionController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, questionId, reactionName, sessionId } = req.body;
            const toggleReaction = new ToggleReactionService_1.ToggleReactionService();
            try {
                const reactions = yield toggleReaction.execute({
                    userId,
                    questionId,
                    reactionName,
                    sessionId,
                });
                return res.json({ reactions });
            }
            catch (error) {
                const serviceError = error;
                return res.status(400).json({ error: serviceError.message });
            }
        });
    }
}
exports.ToggleReactionController = ToggleReactionController;
