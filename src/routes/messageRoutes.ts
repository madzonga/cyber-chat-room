import { Router } from 'express';
import { sendMessage, getChatHistory, deleteMostRecentMessage } from '../controllers/messageController';
import { authenticateToken } from '../middlewares/auth';

const router: Router = Router();

// Send message route
router.post('/send', authenticateToken, sendMessage);

// Get chat history route
router.get('/history', authenticateToken, getChatHistory);

// Delete most recent message
router.delete('/recent', authenticateToken, deleteMostRecentMessage);

export default router;
