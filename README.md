# cyber-chat-room

This project implements a simple chat room server using Node.js and SQLite. The server provides functionality for user authentication, joining chat rooms, sending messages, and retrieving chat history. It does this using RESTful apis and Web Sockets. All messages are stored in chat rooms represented by the `messages` table in the SQLite database.

## Setup

1. `git clone git@github.com:madzonga/cyber-chat-room.git`
2. `cd cyber-chat-room`
3. `git checkout main`
4. **Install Dependencies**: `npm install`

## Running the Server

1. **Start Server**: `npm run start`
2. **Test Endpoints**: Use Postman or similar tool to test the API endpoints.

## Features

1. **User Authentication**: Users can register and log in using a username and password. Credentials are verified against a SQLite database.
2. **Chat Rooms**: Users can join a chat room to send and receive messages. 
3. **Persistent Storage**: Messages are stored in a SQLite database to ensure they persist across server restarts.
4. **Message Sending and Receiving**: Users can send and receive messages in real-time.
5. **RESTful Endpoints**: RESTful endpoints are provided for user management, sending messages, retrieving chat history, joining rooms, and deleting messages by ID.
6. **WebSocket Integration**: WebSocket support allows for real-time communication between clients, enhancing the chat experience.

## Server Scalability with AWS Elastic Load Balancer (ELB)

AWS Elastic Load Balancer (ELB) provides automatic traffic distribution across multiple targets, ensuring high availability and fault tolerance for our chat room. ELB dynamically scales resources to handle varying traffic loads and seamlessly redirects traffic from unhealthy instances.

### Benefits:

- **High Availability**: Distributes traffic across multiple targets to minimize downtime risks.
- **Scalability**: Automatically scales resources based on traffic demands.
- **Fault Tolerance**: Monitors target health and redirects traffic from unhealthy instances.
- **Security**: Supports SSL termination and integrates with AWS Certificate Manager for secure connections.

### Implementation Steps:

1. **Create ELB**: Configure load balancer type, listeners, and target groups.
2. **Configure Target Groups**: Define health checks and routing rules for application targets.
3. **Set Up Auto Scaling**: Create scaling policies based on metrics like Active Connections and Message Throughput.
4. **Associate Auto Scaling Group**: Link Auto Scaling group with the load balancer.
5. **Monitor and Adjust**: Continuously monitor application performance and adjust scaling policies as needed.

AWS ELB offers a scalable solution for managing incoming traffic, ensuring optimal performance and reliability for our chat room.

## Database Schema

- `users`: Stores user information (id, username, email, password, room).
- `messages`: Stores messages sent in the chat rooms (id, username, message, room, timestamp).

## Endpoints

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: User login.
- **POST /api/messages/send**: Send a message to a chat room (requires authentication).
- **GET /api/messages/history/:room**: Retrieve chat history for a specific room (requires authentication).
- **DELETE /api/messages/delete/:id**: Delete a message by ID (requires authentication).
- **POST /api/rooms/join**: Join a specific chat room (requires authentication).

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

### Postman Requests
The collection includes:
- **Register User**: Registers a new user.
- **Login User**: Logs in a user and returns a JWT token.
- **Send Message**: Sends a message to a specific chat room. Requires authentication.
- **Get Chat History**: Retrieves the chat history for a specific room. Requires authentication.
- **Delete Message by ID**: Deletes a message by its ID. Requires authentication.
- **Join Room**: Joins a specific chat room. Requires authentication.

## Additional Setup

- **Node Version**: Node.js version 20.x is recommended.
- Ensure that you have Node.js installed on your system before running the server. You may need to set up environment variables for database configurations if necessary.

Feel free to reach out if you encounter any issues or have any questions!
