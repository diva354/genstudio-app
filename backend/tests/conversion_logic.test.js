// backend/__tests__/convert.test.js

const convertToRoman = require('../convert');

describe('convertToRoman()', () => {
  it('converts 1 to I', () => {
    expect(convertToRoman(1)).toBe('I');
  });

  it('converts 4 to IV', () => {
    expect(convertToRoman(4)).toBe('IV');
  });

  it('converts 9 to IX', () => {
    expect(convertToRoman(9)).toBe('IX');
  });

  it('converts 44 to XLIV', () => {
    expect(convertToRoman(44)).toBe('XLIV');
  });

  it('converts 3999 to MMMCMXCIX', () => {
    expect(convertToRoman(3999)).toBe('MMMCMXCIX');
  });

  it('throws or returns undefined for invalid input', () => {
    expect(() => convertToRoman(0)).toThrow();
    expect(() => convertToRoman(-5)).toThrow();
    expect(() => convertToRoman(4000)).toThrow();
    expect(() => convertToRoman('abc')).toThrow();
  });
});
