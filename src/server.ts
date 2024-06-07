import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import db from './database/database';

const PORT = process.env.PORT || 4000;

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming chat messages
  socket.on('chatMessage', (msg) => {
    const { username, message } = msg;
    db.run('INSERT INTO messages (username, message) VALUES (?, ?)', [username, message], function (err) {
      if (err) {
        console.error('Database insert error:', err);
        return;
      }

      // Broadcast message to all connected clients
      io.emit('chatMessage', { id: this.lastID, username, message, timestamp: new Date() });
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
