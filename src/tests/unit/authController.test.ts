import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../database/database';
import { User } from '../../models/userModel';
import { login, register } from '../../controllers/authController';

jest.mock('../../database/database');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Authentication Controller', () => {
  let req: any;
  let res: Response;

  beforeEach(() => {
    req = { body: {} } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
      json: jest.fn(),
      send: jest.fn()
    } as unknown as Response;
  });

  describe('login', () => {
    it('should login successfully', () => {
      req.body = { username: 'testuser', password: 'testpassword' };
      const user: User = { username: 'testuser', password: 'hashedpassword' };
    
      // Mocking the database query to return the user
      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null, user));
    
      // Mocking bcrypt.compare to return true
      (bcrypt.compare as jest.Mock).mockImplementationOnce((password, hashedPassword, callback) => callback(null, true));
    
      // Mocking jwt.sign to return a token
      (jwt.sign as jest.Mock).mockReturnValueOnce('mockedtoken');
    
      login(req, res);
    
      expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = ?',
        ['testuser'],
        expect.any(Function)
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'testpassword',
        'hashedpassword',
        expect.any(Function)
      );
      expect(res.json).toHaveBeenCalledWith({ token: 'mockedtoken' });
    });    

    it('should handle login errors', () => {
      req.body = { username: 'testuser', password: 'testpassword' };

      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(new Error('Database error')));

      login(req, res);

      expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = ?',
        ['testuser'],
        expect.any(Function)
      );
      expect(res.sendStatus).toHaveBeenCalledWith(403);
    });

    it('should handle incorrect password', () => {
      req.body = { username: 'testuser', password: 'testpassword' };
      const user: User = { username: 'testuser', password: 'hashedpassword' };

      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null, user));
      (bcrypt.compare as jest.Mock).mockImplementationOnce((password, hashedPassword, callback) => callback(null, false));

      login(req, res);

      expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = ?',
        ['testuser'],
        expect.any(Function)
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'testpassword',
        'hashedpassword',
        expect.any(Function)
      );
      expect(res.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('register', () => {
    it('should register successfully', () => {
      req.body = { username: 'testuser', password: 'testpassword' };

      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null, null));
      (bcrypt.hash as jest.Mock).mockImplementationOnce((password, saltOrRounds, callback) => callback(null, 'hashedpassword'));
      (db.run as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null));

      register(req, res);

      expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = ?',
        ['testuser'],
        expect.any(Function)
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(
        'testpassword',
        10,
        expect.any(Function)
      );
      expect(db.run).toHaveBeenCalledWith(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['testuser', 'hashedpassword'],
        expect.any(Function)
      );
      expect(res.sendStatus).toHaveBeenCalledWith(201);
    });

    it('should handle registration errors', () => {
      req.body = { username: 'testuser', password: 'testpassword' };
  
      // Mocking the database query to return an error
      (db.get as jest.Mock).mockImplementationOnce((query, params, callback) => callback(new Error('Database error')));
  
      register(req, res);
  
      expect(db.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = ?',
        ['testuser'],
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Internal server error');
    });
  });
});