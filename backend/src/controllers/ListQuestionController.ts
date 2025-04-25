import { Request, Response } from "express";
import { ListQuestionService } from "../services/ListQuestionService";


class ListQuestionController {
    async handle(req: Request, res: Response):Promise<any> {
        const { sessionId } = req.body
        
        const listQuestionService = new ListQuestionService()

        const questions = await listQuestionService.execute({ sessionId })

        return res.json(questions)
    }
}

export { ListQuestionController }