jest.mock('../convert', () => jest.fn());

const convertNumberToRoman = require('../convert');
const request = require('supertest');
const app = require('../index'); // Full app, real Express setup

describe('GET /romannumeral with mocked convertToRoman()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns mocked value', async () => {
    convertNumberToRoman.mockReturnValue('MOCKED');
    const res = await request(app).get('/romannumeral?query=20');
    expect(res.statusCode).toBe(200);
    expect(res.body.output).toBe('MOCKED');
  });

  it('returns mocked value', async () => {
    convertNumberToRoman.mockReturnValue(null);
    const res = await request(app).get('/romannumeral?query=20');
    expect(res.statusCode).toBe(200);
    expect(res.body.output).toBe(null);
  });

  it('handles internal error from mock', async () => {
    convertNumberToRoman.mockImplementation(() => {
      throw new Error('Mocked crash');
    });
    const res = await request(app).get('/romannumeral?query=10');
    expect(res.statusCode).toBe(500);
    expect(res.body.errorMessage).toMatch(/internal server error/i);
  });
});
