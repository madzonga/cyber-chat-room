import { Request } from 'express';
import { User } from '../models/userModel';

export interface CustomRequest extends Request {
  user?: User;
}
    