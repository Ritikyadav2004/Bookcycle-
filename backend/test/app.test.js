const request = require('supertest');
const app = require('../app');

describe('BookCycle backend', () => {
  it('returns health status from the API', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('returns 404 error with a consistent response format for unknown routes', async () => {
    const response = await request(app).get('/api/non-existent-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Can't find /api/non-existent-route on this server!",
      errors: []
    });
  });
});
