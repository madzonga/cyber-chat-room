const io = require('socket.io-client');

// Connect to the WebSocket server
const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected to the server');
  // Send a test message
  socket.emit('chatMessage', { username: 'testuser', message: 'Hello, world!' });
  socket.emit('chatMessage', { username: 'testuser', message: 'This is just a test!!' });
  socket.emit('chatMessage', { username: 'testuser', message: 'another one' });
});

socket.on('chatMessage', (msg) => {
  console.log('Received message:', msg);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});
