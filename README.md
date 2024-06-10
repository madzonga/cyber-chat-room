# cyber-chat-room

This project implements a simple chat room server using Node.js and SQLite. The server provides functionality for user authentication, sending messages, and retrieving chat history. All messages are stored in a single chat room represented by the `messages` table in the SQLite database.

## Features

1. **User Authentication**: Users can register and log in using a username and password. Credentials are verified against a SQLite database.
2. **Single Chat Room**: All users send messages to and retrieve messages from a single chat room.
3. **Persistent Storage**: Messages are stored in a SQLite database to ensure they persist across server restarts.
4. **Message Sending and Receiving**: Users can send and receive messages in real-time.
5. **RESTful Endpoints**: RESTful endpoints are provided for sending messages, retrieving chat history, and deleting messages by ID.
5. **WebSocket Integration**: WebSocket support allows for real-time communication between clients, enhancing the chat experience.

## Database Schema

- `users`: Stores user information (id, username, email, password).
- `messages`: Stores messages sent in the chat room (id, username, message, timestamp).

## Endpoints

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: User login.
- **POST /api/messages/send**: Send a message to the chat room (requires authentication).
- **GET /api/messages/history**: Retrieve chat history (requires authentication).
- **DELETE /api/messages/delete/:id**: Delete a message by ID (requires authentication).

## Running the Server

1. **Install Dependencies**: `npm install`
2. **Start Server**: `npm run start`
3. **Test Endpoints**: Use Postman or similar tool to test the API endpoints.

## WebSocket Feature

To test the WebSocket feature, make sure to check out to the `websocket` branch and follow the steps below:

1. **Install Dependencies**: `npm install`
2. **Start Server**: `npm run start`
3. **Connect WebSocket Client**: Use a WebSocket client such as Postman or a WebSocket library to connect to the WebSocket server.

The provided `test-client.js` script demonstrates how to connect to the WebSocket server and send and receive messages. 

- It uses the `socket.io-client` library to establish a connection to the server.
- Upon successful connection, it emits test messages to the server using the `chatMessage` event.
- It also listens for incoming messages from the server and logs them to the console.

This script is useful for testing the WebSocket functionality and understanding how messages are exchanged between the client and server in real-time.

## Available Scripts

- **npm start**: Start the server.
- **npm run build**: Build the TypeScript files.
- **npm run dev**: Start the server in development mode with nodemon.
- **npm test**: Run unit tests using Jest.
- **npm run test:integration**: Run integration tests in a test environment using Jest.

## Postman Collection

The `Chatroom API.postman_collection.json` file contains a collection of requests that can be imported into Postman for testing the API endpoints on PORT 4000.

## Additional Setup

- **Node Version**: Node.js version 20.x is recommended.
- Ensure that you have Node.js installed on your system before running the server. You may need to set up environment variables for database configurations if necessary.

Feel free to reach out if you encounter any issues or have any questions!
