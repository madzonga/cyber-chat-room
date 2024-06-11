import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { joinRoom } from '../controllers/roomControllers';
import { joinRoomSchema } from '../validators/schemas';
import { validate } from '../middlewares/validate';

const router: Router = Router();

// Join a room
router.post('/join', authenticateToken, validate(joinRoomSchema), joinRoom);

export default router;
