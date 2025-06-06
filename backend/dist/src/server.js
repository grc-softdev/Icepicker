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
exports.OWN_ORIGIN = void 0;
require('dotenv').config();
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const ModifiedQuestionRoutes_1 = require("./ModifiedQuestionRoutes");
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket");
const openai_1 = __importDefault(require("openai"));
exports.OWN_ORIGIN = 'https://54.207.241.165.nip.io';
const app = (0, express_1.default)();
app.use(express_1.default.json());
const frontendURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://main.d9pxq75h0yt4e.amplifyapp.com';
console.log({ frontendURL }, process.env.NODE_ENV);
app.use((0, cors_1.default)({
    origin: [
        exports.OWN_ORIGIN,
        frontendURL
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
}));
app.use(routes_1.router);
app.use(ModifiedQuestionRoutes_1.modifiedQuestionRoutes);
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { messages } = req.body;
    const completion = yield openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages
    });
    const reply = (_b = (_a = completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message;
    res.json(reply);
}));
app.use(((err, req, res, next) => {
    if (err instanceof Error) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: "error",
            message: "Internal server error.",
        });
    }
}));
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
const PORT = Number(process.env.PORT) || 3333;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
exports.default = app;
