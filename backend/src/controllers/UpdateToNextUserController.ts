import { Request, Response } from "express";
import { UpdateToNextUserService } from "../services/UpdateToNextUserService";

class UpdateToNextUserController {
  async handle(req: Request, res: Response):Promise<any> {
    const { id: sessionId } = req.params;
    const currentUser = new UpdateToNextUserService();
    const updatedUser = await currentUser.execute({sessionId});
    return res.json(updatedUser);
  }
}

export { UpdateToNextUserController };
