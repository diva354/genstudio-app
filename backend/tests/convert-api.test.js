const request = require('supertest');
const app = require('../index'); // Full app with middleware, metrics, etc.

describe('GET /romannumeral – Real App Integration', () => {
  test('returns 200 and correct conversion for valid input', async () => {
    const res = await request(app).get('/romannumeral?query=25');
    expect(res.statusCode).toBe(200);
    expect(res.body.output).toBe('XXV');
  });

  test('returns 400 for non-numeric input', async () => {
    const res = await request(app).get('/romannumeral?query=abc');
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 for missing query', async () => {
    const res = await request(app).get('/romannumeral');
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 for out-of-range input', async () => {
    const res = await request(app).get('/romannumeral?query=5000');
    expect(res.statusCode).toBe(400);
  });

  test('returns 400 for simulated crash (query=9999)', async () => {
    const res = await request(app).get('/romannumeral?query=9999');
    expect(res.statusCode).toBe(400);
  });
});
