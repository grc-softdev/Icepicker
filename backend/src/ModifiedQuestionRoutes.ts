import { Request, Response, Router } from "express";
import prismaClient from "./prisma";
import { ModifyQuestionController } from "./controllers/ModifyQuestionController";

import { GetSessionService } from "./services/GetSessionService";
import { getIO } from "./socket";

const router = Router();

const controller = new ModifyQuestionController();
router.post("/questions/modify", controller.handle.bind(controller));

router.patch("/questions/:id", async (req: Request, res: Response):Promise<any> => {
  const { name, sessionId } = req.body;
  const { id } = req.params;

  if (!name || !sessionId) {
    console.error("Missing name or sessionId:", { name, sessionId });
    return res
      .status(400)
      .json({ error: "Missing name or sessionId in request body" });
  }

  try {
    const updated = await prismaClient.question.update({
      where: { id },
      data: { name },
    });

    const updatedSession = await new GetSessionService().execute({ sessionId });
    const io = getIO()
    io.to(sessionId).emit("sessionUpdated", updatedSession);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update question" });
  }
});

export { router as modifiedQuestionRoutes };
