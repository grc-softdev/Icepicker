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
exports.LeaveRoomBeaconController = void 0;
const LeaveRoomService_1 = require("../services/LeaveRoomService");
class LeaveRoomBeaconController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionId = req.params.id;
            const { userId } = req.body;
            const leaveRoomService = new LeaveRoomService_1.LeaveRoomService();
            try {
                const leaveRoom = yield leaveRoomService.execute({ sessionId, userId });
                return res.status(200).json(leaveRoom);
            }
            catch (error) {
                const serviceError = error;
                return res.status(400).json({ error: serviceError.message });
            }
        });
    }
}
exports.LeaveRoomBeaconController = LeaveRoomBeaconController;
