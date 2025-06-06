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
exports.ModifyQuestionController = void 0;
const ModifyQuestionService_1 = require("../services/ModifyQuestionService");
class ModifyQuestionController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questionId, tone, sessionId } = req.body;
            const modifyQuestionService = new ModifyQuestionService_1.ModifyQuestionService();
            const modifiedQuestion = yield modifyQuestionService.execute({
                questionId,
                tone,
                sessionId,
            });
            if (!modifiedQuestion) {
                return res.status(400).json({ error: "Question not found." });
            }
            return res.json({ modified: modifiedQuestion });
        });
    }
}
exports.ModifyQuestionController = ModifyQuestionController;
