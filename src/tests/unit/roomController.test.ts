import { Response } from 'express';
import { joinRoom } from '../../controllers/roomControllers';
import db from '../../database/database';
import { CustomRequest } from '../../types/custom';



jest.mock('../../database/database');

describe('Room Controllers', () => {
  let req: CustomRequest;
  let res: Response;

  beforeEach(() => {
    req = { user: { username: 'testuser' }, body: {} } as CustomRequest;
    res = {
      sendStatus: jest.fn()
    } as unknown as Response;
  });

  describe('joinRoom', () => {
    it('should join a room', () => {
      req.body.room = 'testroom';

      // Mock implementation of db.run to simulate successful room joining
      (db.run as jest.Mock).mockImplementationOnce((query, params, callback) => callback(null));

      joinRoom(req, res);

      expect(db.run).toHaveBeenCalledWith(
        'UPDATE users SET room = ? WHERE username = ?',
        ['testroom', 'testuser'],
        expect.any(Function)
      );
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should handle errors when joining a room', () => {
      req.body.room = 'testroom';

      // Mock implementation of db.run to simulate an error when joining the room
      (db.run as jest.Mock).mockImplementationOnce((query, params, callback) => callback(new Error('Database error')));

      joinRoom(req, res);

      expect(db.run).toHaveBeenCalledWith(
        'UPDATE users SET room = ? WHERE username = ?',
        ['testroom', 'testuser'],
        expect.any(Function)
      );
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });

    it('should handle unauthorized access', () => {
      req.user = undefined;

      joinRoom(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(403);
    });
  });
});
