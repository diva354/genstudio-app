// backend/__tests__/roman.test.js

const request = require('supertest');
const express = require('express');
const convertToRoman = require('../convert');

// Simulated mini Express app for testing
const app = express();
app.get('/romannumeral', (req, res) => {
  const query = req.query.query;
  if (!query || isNaN(query)) return res.status(400).json({ errorMessage: 'Invalid input', statusCode: 400 });
  const num = parseInt(query, 10);
  if (num < 1 || num > 3999) return res.status(400).json({ errorMessage: 'Out of range', statusCode: 400 });
  res.json({ input: query, output: convertToRoman(num) });
});


describe('Roman Numeral API', () => {
  it('converts 5 to V', async () => {
    const res = await request(app).get('/romannumeral?query=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.output).toBe('V');
  });

  it('returns 400 on invalid input', async () => {
    const res = await request(app).get('/romannumeral?query=abc');
    expect(res.statusCode).toBe(400);
    expect(res.body.errorMessage).toMatch(/Invalid input/);
  });

  it('returns 400 on out-of-range input', async () => {
    const res = await request(app).get('/romannumeral?query=4000');
    expect(res.statusCode).toBe(400);
    expect(res.body.errorMessage).toMatch(/Out of range/);
  });
});
