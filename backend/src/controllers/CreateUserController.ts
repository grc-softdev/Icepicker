import { Request, Response } from "express";
import { CreateUSerService } from "../services/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response):Promise<any> {
    const { name } = req.body;
    const createUserService = new CreateUSerService();
    const user = await createUserService.execute({ name });
    return res.json(user);
  }
}

export { CreateUserController };
