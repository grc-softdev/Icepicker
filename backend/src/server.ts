require('dotenv').config();

import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import { router } from "./routes";
import cors from "cors";
import path from "path";
import { modifiedQuestionRoutes } from "./ModifiedQuestionRoutes";
import http from "http";
import { initSocket } from "./socket";
import { ErrorRequestHandler } from "express";
import OpenAI from "openai";


const app = express();
app.use(express.json());

app.use(cors({
  origin: [
  'https://18.229.125.23.nip.io',
  'https://main.d9pxq75h0yt4e.amplifyapp.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(router);
app.use(modifiedQuestionRoutes);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages
  });

  const reply = completion.choices?.[0]?.message;
  res.json(reply);
});


app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
}) as ErrorRequestHandler);

const server = http.createServer(app);
initSocket(server);
const PORT = Number(process.env.PORT) || 3333;
server.listen(PORT,"0.0.0.0", () => console.log(`Server running on port ${PORT}`));
export default app;