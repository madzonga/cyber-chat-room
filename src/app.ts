import express from 'express';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import roomRoutes from './routes/roomRoutes';
import { authenticateToken } from './middlewares/auth';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);
app.use('/api/rooms', authenticateToken, roomRoutes);

export default app;
