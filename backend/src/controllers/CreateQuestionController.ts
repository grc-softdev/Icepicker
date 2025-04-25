import { Request, Response } from "express";
import { CreateQuestionService } from "../services/CreateQuestionService";

class CreateQuestionController {
  async handle(req: Request, res: Response):Promise<any> {
    const { name, sessionId } = req.body;

    const createQuestionService = new CreateQuestionService();
    const question = await createQuestionService.execute({
      name: name,
      sessionId: sessionId
    });
    return res.json(question);
  }
}

export { CreateQuestionController };
