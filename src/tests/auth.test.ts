import request from 'supertest';
import app from '../app';

describe('Auth Endpoints', () => {
  const uniqueUsername = `testuser_${Date.now()}`;
  const uniqueUsername2 = `testuser2_${Date.now()}`;
  const uniqueUsername3 = `testuser3_${Date.now()}`;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: uniqueUsername, // Ensure a unique username
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(201);
  });

  it('should log in an existing user', async () => {
    // Register a new user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: uniqueUsername2, // Ensure a unique username
        password: 'testpassword'
      });

    expect(registerRes.statusCode).toEqual(201);

    // Log in the newly registered user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: uniqueUsername2,
        password: 'testpassword'
      });

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('token');
  });

  it('should not register a user with an existing username', async () => {
    // Register the user the first time
    const res1 = await request(app)
      .post('/api/auth/register')
      .send({
        username: uniqueUsername3,
        password: 'testpassword'
      });
    expect(res1.statusCode).toEqual(201);

    // Attempt to register the same user again
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({
        username: uniqueUsername3,
        password: 'testpassword'
      });
    expect(res2.statusCode).toEqual(400);
    expect(res2.text).toEqual('Username already exists');
  });
});
