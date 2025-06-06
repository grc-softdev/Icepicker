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
exports.modifiedQuestionRoutes = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("./prisma"));
const ModifyQuestionController_1 = require("./controllers/ModifyQuestionController");
const GetSessionService_1 = require("./services/GetSessionService");
const socket_1 = require("./socket");
const router = (0, express_1.Router)();
exports.modifiedQuestionRoutes = router;
const controller = new ModifyQuestionController_1.ModifyQuestionController();
router.post("/questions/modify", controller.handle.bind(controller));
router.patch("/questions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, sessionId } = req.body;
    const { id } = req.params;
    if (!name || !sessionId) {
        console.error("Missing name or sessionId:", { name, sessionId });
        return res
            .status(400)
            .json({ error: "Missing name or sessionId in request body" });
    }
    try {
        const updated = yield prisma_1.default.question.update({
            where: { id },
            data: { name },
        });
        const updatedSession = yield new GetSessionService_1.GetSessionService().execute({ sessionId });
        const io = (0, socket_1.getIO)();
        io.to(sessionId).emit("sessionUpdated", updatedSession);
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update question" });
    }
}));
