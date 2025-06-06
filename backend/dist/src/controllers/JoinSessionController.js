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
exports.JoinSessionController = void 0;
const JoinSessionService_1 = require("../services/JoinSessionService");
class JoinSessionController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: sessionId } = req.params;
            const { name } = req.body;
            if (!sessionId || !name) {
                return res.status(400).json({ error: "Session ID and name are required" });
            }
            try {
                const joinSessionService = new JoinSessionService_1.JoinSessionService();
                const result = yield joinSessionService.execute({ sessionId, name });
                return res.status(200).json(result);
            }
            catch (error) {
                const serviceError = error;
                return res.status(400).json({ error: serviceError.message });
            }
        });
    }
}
exports.JoinSessionController = JoinSessionController;
