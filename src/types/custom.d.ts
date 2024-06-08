// src/types/express.ts
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: { username: string };
}
