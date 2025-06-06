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
exports.CreateSessionController = void 0;
const CreateSessionService_1 = require("../services/CreateSessionService");
class CreateSessionController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const createSessionService = new CreateSessionService_1.CreateSessionService();
            try {
                const session = yield createSessionService.execute({ name });
                return res.json(session);
            }
            catch (error) {
                const serviceError = error;
                return res.status(400).json({ error: serviceError.message });
            }
        });
    }
}
exports.CreateSessionController = CreateSessionController;
