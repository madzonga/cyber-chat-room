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

export const register = (req: RegisterRequest, res: Response): void => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(201);
  });
};
