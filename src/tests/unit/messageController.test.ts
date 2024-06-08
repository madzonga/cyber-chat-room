import { Response } from 'express';
import { CustomRequest } from '../../types/custom';
import { sendMessage, getChatHistory, deleteMessageById } from '../../controllers/messageController';
import db from '../../database/database';

jest.mock('../../database/database');

describe('Message Controller', () => {
  let req: CustomRequest;
  let res: Response;

  beforeEach(() => {
    req = { user: { username: 'testuser' }, body: {} } as CustomRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
      json: jest.fn()
    } as unknown as Response;
  });

  describe('sendMessage', () => {
    it('should send a message', () => {
      req.body.message = 'Hello, world!';

      (db.run as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null));

      sendMessage(req, res);

      expect(db.run).toHaveBeenCalledWith(
        "INSERT INTO messages (username, message) VALUES (?, ?)",
        ['testuser', 'Hello, world!'],
        expect.any(Function)
      );
      expect(res.sendStatus).toHaveBeenCalledWith(201);
    });

    it('should handle errors when sending a message', () => {
      req.body.message = 'Hello, world!';

      (db.run as jest.Mock).mockImplementationOnce((query, params, callback) => callback(new Error('Database error')));

      sendMessage(req, res);

      expect(db.run).toHaveBeenCalledWith(
        "INSERT INTO messages (username, message) VALUES (?, ?)",
        ['testuser', 'Hello, world!'],
        expect.any(Function)
      );
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('getChatHistory', () => {
    it('should get chat history', () => {
      const mockRows = [
        { username: 'user1', message: 'Message 1', timestamp: '2022-01-01 12:00:00' },
        { username: 'user2', message: 'Message 2', timestamp: '2022-01-01 12:10:00' }
      ];

      (db.all as jest.Mock).mockImplementationOnce((query, callback) => callback(null, mockRows));

      getChatHistory(req, res);

      expect(db.all).toHaveBeenCalledWith(
        "SELECT username, message, timestamp FROM messages ORDER BY timestamp DESC",
        expect.any(Function)
      );
      expect(res.json).toHaveBeenCalledWith(mockRows);
    });

    it('should handle errors when getting chat history', () => {
      (db.all as jest.Mock).mockImplementationOnce((query, callback) => callback(new Error('Database error')));

      getChatHistory(req, res);

      expect(db.all).toHaveBeenCalledWith(
        "SELECT username, message, timestamp FROM messages ORDER BY timestamp DESC",
        expect.any(Function)
      );
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteMessageById', () => {
    it('should delete a message by ID', () => {
      const messageId = "1";

      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null, { id: messageId, username: 'testuser' }));
      (db.run as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null));

      req.params = { id: messageId };

      deleteMessageById(req, res);

      expect(db.get).toHaveBeenCalledWith(
        'SELECT id, username FROM messages WHERE id = ?',
        [messageId],
        expect.any(Function)
      );
      expect(db.run).toHaveBeenCalledWith('DELETE FROM messages WHERE id = ?', [messageId], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Message deleted successfully' });
    });

    it('should handle errors when deleting a message', () => {
      const messageId = "1";

      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(new Error('Database error')));

      req.params = { id: messageId };

      deleteMessageById(req, res);

      expect(db.get).toHaveBeenCalledWith(
        'SELECT id, username FROM messages WHERE id = ?',
        [messageId],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });

    it('should return 404 if message not found', () => {
      const messageId = "1";

      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null, null));

      req.params = { id: messageId };

      deleteMessageById(req, res);

      expect(db.get).toHaveBeenCalledWith(
        'SELECT id, username FROM messages WHERE id = ?',
        [messageId],
        expect.any(Function) 
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Message not found' });
    });

    it('should return 403 if user is not authenticated', () => {
      const messageId = "1";
      req.user = undefined;

      req.params = { id: messageId };

      deleteMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not authenticated' });
    });

    it('should return 403 if user is not the owner of the message', () => {
      const messageId = "1";

      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null, { id: messageId, username: 'otheruser' }));

      req.params = { id: messageId };

      deleteMessageById(req, res);

      expect(db.get).toHaveBeenCalledWith(
        'SELECT id, username FROM messages WHERE id = ?',
        [messageId],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'You can only delete your own messages' });
    });
  });
});