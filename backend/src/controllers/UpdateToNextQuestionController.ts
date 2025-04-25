import { Request, Response } from "express";
import { UpdateToNextQuestionService } from "../services/UpdateToNextQuestionService";

class UpdateToNextQuestionController {
  async handle(req: Request, res: Response):Promise<any> {
    const { id: sessionId } = req.params;

    const currentQuestion = new UpdateToNextQuestionService();
    const updatedQuestion = await currentQuestion.execute(sessionId);
    return res.json(updatedQuestion);
  }
}

export { UpdateToNextQuestionController };
