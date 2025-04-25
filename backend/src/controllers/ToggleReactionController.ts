import { Request, Response } from "express";
import { ToggleReactionService } from "../services/ToggleReactionService";

class ToggleReactionController {
  async handle(req: Request, res: Response):Promise<any> {
    const { userId, questionId, reactionName, sessionId } = req.body;
    const toggleReaction = new ToggleReactionService();

    try {
      const reactions = await toggleReaction.execute({
        userId,
        questionId,
        reactionName,
        sessionId,
      });

      return res.json({ reactions });
    } catch (error) {
      const serviceError = error as {
        message: string
      }
        return res.status(400).json({ error: serviceError.message });
    }
  }
}

export { ToggleReactionController };
