import { Request, Response } from "express";
import { LeaveRoomService } from "../services/LeaveRoomService";

class LeaveRoomBeaconController {
  async handle(req: Request, res: Response):Promise<any> {
    const sessionId = req.params.id;
    const { userId } = req.body;
   
    const leaveRoomService = new LeaveRoomService();

    try {
      const leaveRoom= await leaveRoomService.execute({ sessionId, userId });
      return res.status(200).json(leaveRoom);
    } catch (error) {
      const serviceError = error as {
        message: string
      }
        return res.status(400).json({ error: serviceError.message });
      }
  }
}

export { LeaveRoomBeaconController }