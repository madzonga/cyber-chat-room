import { Router } from 'express';
import { sendMessage, getChatHistory } from '../controllers/messageController';
import { authenticateToken } from '../middlewares/auth';

const router: Router = Router();

// Send message route
router.post('/send', authenticateToken, sendMessage);

// Get chat history route
router.get('/history', authenticateToken, getChatHistory);


export default router;
