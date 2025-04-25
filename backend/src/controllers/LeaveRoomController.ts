import { Request, Response } from "express";
import { LeaveRoomService } from "../services/LeaveRoomService";


class LeaveRoomController {
  async handle(req: Request, res: Response):Promise<any> {
    const sessionId = req.params.id;
    const { userId } = req.body;

    try {
      const service = new LeaveRoomService();
      const result = await service.execute({ sessionId, userId });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao sair da sala" });
    }
  }
}

export { LeaveRoomController }
