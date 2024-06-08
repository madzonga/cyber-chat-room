import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../models/userModel';
import { CustomRequest } from '../types/custom';

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.sendStatus(403);
    return;
  }

  jwt.verify(token, config.secret, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.user = { username: (user as User).username }; 

    next();
  });
};
