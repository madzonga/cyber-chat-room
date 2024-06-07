# cyber-chat-room

This project implements a simple chat room server using Node.js and SQLite. The server provides functionality for user authentication, sending messages, and retrieving chat history. All messages are stored in a single chat room represented by the `messages` table in the SQLite database.

## Features

1. **User Authentication**: Users can register and log in using a username and password. Credentials are verified against a SQLite database.
2. **Single Chat Room**: All users send messages to and retrieve messages from a single chat room.
3. **Persistent Storage**: Messages are stored in a SQLite database to ensure they persist across server restarts.
4. **Message Sending and Receiving**: Users can send and receive messages in real-time.
5. **RESTful Endpoints**: RESTful endpoints are provided for sending messages and retrieving chat history.

## Database Schema

- `users`: Stores user information (id, username, email, password).
- `messages`: Stores messages sent in the chat room (id, username, message, timestamp).

## Endpoints

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: User login.
- **POST /api/messages/send**: Send a message to the chat room (requires authentication).
- **GET /api/messages/history**: Retrieve chat history (requires authentication).

## Running the Server

1. **Install Dependencies**: `npm install`
2. **Start Server**: `npm run start`
3. **Test Endpoints**: Use Postman or similar tool to test the API endpoints.

## User Registration

To register a new user, send a POST request to the `/api/auth/register` endpoint with the following JSON body:

```json
{
  "username": "example_user",
  "password": "password123"
}
