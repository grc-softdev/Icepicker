import { Request, Response } from "express";
import { CreateSessionService } from "../services/CreateSessionService";

class CreateSessionController {
  async handle(req: Request, res: Response):Promise<any> {
    const { name } = req.body;
    const createSessionService = new CreateSessionService();

    try {
      const session = await createSessionService.execute({ name });
      return res.json(session);
    } catch (error) {
      const serviceError = error as {
        message: string
      }
        return res.status(400).json({ error: serviceError.message });
      }
  }
}

export { CreateSessionController };
