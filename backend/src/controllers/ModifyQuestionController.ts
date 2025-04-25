import { Request, Response } from "express";
import { ModifyQuestionService } from "../services/ModifyQuestionService";

class ModifyQuestionController {
  async handle(req: Request, res: Response):Promise<any> {
    const { questionId, tone, sessionId } = req.body;

    const modifyQuestionService = new ModifyQuestionService();
    const modifiedQuestion = await modifyQuestionService.execute({
      questionId,
      tone,
      sessionId,
    });
   
    if (!modifiedQuestion) {
      return res.status(400).json({ error: "Question not found." });
    }

    return res.json({ modified: modifiedQuestion });
  }
}

export { ModifyQuestionController };
