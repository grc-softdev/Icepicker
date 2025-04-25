// server.ts
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import { router } from "./routes";
import cors from "cors";
import path from "path";
import { modifiedQuestionRoutes } from "./ModifiedQuestionRoutes";
import http from "http";
import { initSocket } from "./socket";
import { ErrorRequestHandler } from "express";

const app = express();

app.use(express.json());
app.use(cors(({
  origin: "*",
  //"https://icepicker.vercel.app", // ou "*", se for para testes
  credentials: true,
})));
app.use(router);
app.use(modifiedQuestionRoutes);

// //url ex: localhost:3333/files.nomes-imagem.png
// app.use("/files", express.static(path.resolve(__dirname, "..", "avatars")));

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
initSocket(server); // ✨ separa o Socket.IO em um componente
const PORT = Number(process.env.PORT) || 3333;
server.listen(PORT,"0.0.0.0", () => console.log(`Server running on port ${PORT}`));
export default app;