import { Request, Response } from "express";
import { GetSessionService } from "../services/GetSessionService";

class GetSessionController {
  async handle(req: Request, res: Response):Promise<any> {
    try {
      const { id: sessionId } = req.params;

      const getSessionService = new GetSessionService();
      
      const session = await getSessionService.execute({ sessionId });

      return res.json(session);
    } catch (error) {

    const serviceError = error as {
      message: string
    }
      return res.status(400).json({ error: serviceError.message });
    }
  }
}

export { GetSessionController };