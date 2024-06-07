import { Response } from 'express';
import db from '../database/database';
import { CustomRequest } from '../types/custom';

interface MessageRow {
  id: number;
}

export const sendMessage = (req: CustomRequest, res: Response): void => {
  if (!req.user) {
    res.sendStatus(403);
    return;
  }

  const { message } = req.body;
  const username = req.user.username;

  db.run("INSERT INTO messages (username, message) VALUES (?, ?)", [username, message], (err) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(201);
  });
};

export const getChatHistory = (req: CustomRequest, res: Response): void => {
  db.all("SELECT username, message, timestamp FROM messages ORDER BY timestamp DESC", (err, rows) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.json(rows);
  });
};

// Delete the most recent message
export const deleteMostRecentMessage = (req: CustomRequest, res: Response): void => {
  db.get<MessageRow>('SELECT id FROM messages ORDER BY timestamp DESC LIMIT 1', [], (err, row) => {
    if (err || !row) {
      res.status(500).send('Internal server error');
      return;
    }

    db.run('DELETE FROM messages WHERE id = ?', [row.id], function (err) {
      if (err) {
        res.status(500).send('Internal server error');
      } else {
        res.sendStatus(204); // No Content
      }
    });
  });
};