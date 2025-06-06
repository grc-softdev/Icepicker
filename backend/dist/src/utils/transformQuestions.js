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
exports.transformQuestions = transformQuestions;
const openai_1 = require("openai");
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
function transformQuestions(questions, tone) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const prompt = `Rephrase question more ${tone}: "${questions[0].name}". Return only modified question.`;
        try {
            const chatCompletion = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are an assistant that rephrases questions for group activities.`,
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            });
            console.log("OpenAI response:", chatCompletion);
            const result = ((_b = (_a = chatCompletion.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.trim()) || "";
            return result;
        }
        catch (error) {
            console.error("Call error", error);
            throw error;
        }
    });
}
