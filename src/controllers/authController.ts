import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/database';
import { config } from '../config/config';
import { User } from '../models/userModel';

interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

interface RegisterRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

export const login = (req: LoginRequest, res: Response): void => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user: User) => {
    if (err || !user) {
      res.sendStatus(403);
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        res.sendStatus(403);
        return;
      }

      const token = jwt.sign({ username: user.username }, config.secret);
      res.json({ token });
    });
  });
};

export const register = (req: Request, res: Response): void => {
  const { username, password } = req.body;

  // Check if the username already exists
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal server error');
    } else if (row) {
      res.status(400).send('Username already exists');
    } else {
      // Hash the password before storing it
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          res.status(500).send('Internal server error');
        } else {
          // Insert the user into the database with the hashed password
          db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) {
              console.error('Error creating user:', err);
              res.status(500).send('Internal server error');
            } else {
              res.sendStatus(201);
            }
          });
        }
      });
    }
  });
};
