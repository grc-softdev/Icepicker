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
exports.LeaveRoomController = void 0;
const LeaveRoomService_1 = require("../services/LeaveRoomService");
class LeaveRoomController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = req.params.id;
            const { userId } = req.body;
            try {
                const service = new LeaveRoomService_1.LeaveRoomService();
                const result = yield service.execute({ sessionId, userId });
                return res.status(200).json(result);
            }
            catch (error) {
                return res.status(500).json({ error: "Erro ao sair da sala" });
            }
        });
    }
}
exports.LeaveRoomController = LeaveRoomController;
