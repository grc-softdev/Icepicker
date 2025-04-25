import { Request, Response } from "express";
import { JoinSessionService } from "../services/JoinSessionService";

class JoinSessionController {
  async handle(req: Request, res: Response):Promise<any> {
    const { id: sessionId } = req.params; 
    const { name } = req.body; 

    if (!sessionId || !name) {
      return res.status(400).json({ error: "Session ID and name are required" });
    }

    try {
      const joinSessionService = new JoinSessionService();
      const result = await joinSessionService.execute({ sessionId, name });

      return res.status(200).json(result);
    } catch (error) {
     
      const serviceError = error as {
        message: string
      }
        return res.status(400).json({ error: serviceError.message });
    }
  }
}

export { JoinSessionController };
