const request = require('supertest');
const app = require('../app');

describe('BookCycle backend', () => {
  it('returns health status from the API', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
