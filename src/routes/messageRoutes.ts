import { Router } from 'express';
import { sendMessage, getChatHistory, deleteMostRecentMessage } from '../controllers/messageController';
import { authenticateToken } from '../middlewares/auth';
import { validate, validateUser } from '../middlewares/validate';
import { messageSchema } from '../validators/schemas';

const router: Router = Router();

// Send message route
router.post('/send', authenticateToken, validateUser, validate(messageSchema), sendMessage);

// Get chat history route
router.get('/history', authenticateToken, getChatHistory);

// Delete most recent message
router.delete('/recent', authenticateToken, deleteMostRecentMessage);

export default router;
