import { Router } from "express";
import { CreateUserController } from "./controllers/CreateUserController";
import { CreateQuestionController } from "./controllers/CreateQuestionController";
import { ListQuestionController } from "./controllers/ListQuestionController";
import { CreateSessionController } from "./controllers/CreateSessionController";
import { JoinSessionController } from "./controllers/JoinSessionController";
import { GetSessionController } from "./controllers/GetSessionController";
import { ToggleReactionController } from "./controllers/ToggleReactionController";
import { UpdateToNextQuestionController } from "./controllers/UpdateToNextQuestionController";
import { UpdateToNextUserController } from "./controllers/UpdateToNextUserController";
import { LeaveRoomController } from "./controllers/LeaveRoomController";
import { LeaveRoomBeaconController } from "./controllers/LeaveRoomBeaconController";

const router = Router();

router.post('/users', new CreateUserController().handle)
router.post('/questions', new CreateQuestionController().handle)
router.post('/session/:id/toggle', new ToggleReactionController().handle)
router.get('/questions', new ListQuestionController().handle)
router.post('/session', new CreateSessionController().handle)
router.post('/session/:id/leave', new LeaveRoomBeaconController().handle)
router.put('/session/:id/leave', new LeaveRoomController().handle)
router.get('/session/:id', new GetSessionController().handle)
router.put("/session/:id", new JoinSessionController().handle)
router.put("/session/:id/next-question", new UpdateToNextQuestionController().handle)
router.put("/session/:id/next-user", new UpdateToNextUserController().handle)

export { router };