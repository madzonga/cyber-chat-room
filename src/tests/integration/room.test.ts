import request from 'supertest';
import app from '../../app';

let token: string;

beforeAll(async () => {
  const uniqueUsername = `testuser_${Date.now()}`;
  await request(app).post('/api/auth/register').send({
    username: uniqueUsername,
    password: 'testpassword',
  });

  const res = await request(app).post('/api/auth/login').send({
    username: uniqueUsername,
    password: 'testpassword',
  });
  token = res.body.token;
});

describe('Room Endpoints', () => {
  it('should join a room', async () => {
    const res = await request(app)
      .post('/api/rooms/join')
      .set('Authorization', `Bearer ${token}`)
      .send({
        room: 'testroom',
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should handle unauthorized access', async () => {
    const res = await request(app).post('/api/rooms/join');
    expect(res.statusCode).toEqual(403);
  });
});
