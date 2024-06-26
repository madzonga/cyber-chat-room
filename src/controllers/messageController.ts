import { Response } from 'express';
import db from '../database/database';
import { CustomRequest } from '../types/custom';
import { User } from '../models/userModel';

interface MessageRow {
  id: number;
  username: string;
}

export const sendMessage = (req: CustomRequest, res: Response): void => {
  if (!req.user) {
    res.sendStatus(403);
    return;
  }

  const { message } = req.body;
  const username = req.user.username;

  db.get('SELECT room FROM users WHERE username = ?', [username], (err, row: User) => {
    if (err || !row) {
      res.sendStatus(500);
      return;
    }

    const room = row.room;

    if (room) {
      db.run('INSERT INTO messages (username, room, message) VALUES (?, ?, ?)', [username, room, message], (err) => {
        if (err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    } else {
      res.status(400).send('User has not joined a room');
    }
  });
};

export const getChatHistory = (req: CustomRequest, res: Response): void => {
  const { room } = req.params;
  db.all('SELECT * FROM messages WHERE room = ?', [room], (err, rows) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.json(rows);
  });
};

// Delete a message by ID
export const deleteMessageById = (req: CustomRequest, res: Response): void => {
  const messageId = req.params.id;
  const username = req.user?.username;

  if (!username) {
    res.status(403).json({ error: 'User not authenticated' });
    return;
  }

  db.get<MessageRow>('SELECT id, username FROM messages WHERE id = ?', [messageId], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (!row) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (row.username !== username) {
      res.status(403).json({ error: 'You can only delete your own messages' });
      return;
    }

    db.run('DELETE FROM messages WHERE id = ?', [messageId], function (err) {
      if (err) {
        res.status(500).json({ error: 'Database error' });
        return;
      }

      res.status(200).json({ message: 'Message deleted successfully' });
    });
  });
};