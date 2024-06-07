import request from 'supertest';
import app from '../app';

let token: string;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'testuser',
      password: 'testpassword'
    });
  token = res.body.token;
});

describe('Message Endpoints', () => {
  it('should send a message', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Hello, world!'
      });
      expect(res.statusCode).toEqual(201);
  });

  it('should get messages', async () => {
    const res = await request(app)
      .get('/api/messages/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete the most recent message', async () => {
    // Send a message first
    await request(app)
      .post('/api/messages/send')
      .set('Authorization', `Bearer ${token}`)
      .send({
        message: 'Message to delete'
      });

    // Delete the most recent message
    const res = await request(app)
      .delete('/api/messages/recent')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(204);
  });
});