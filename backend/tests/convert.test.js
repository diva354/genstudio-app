// backend/__tests__/convert.test.js

const convertToRoman = require('../convert');

describe('convertToRoman()', () => {
  test('converts known values correctly', () => {
    expect(convertToRoman(1)).toBe('I');
    expect(convertToRoman(8)).toBe('VIII');
    expect(convertToRoman(9)).toBe('IX');
    expect(convertToRoman(64)).toBe('LXIV');
    expect(convertToRoman(367)).toBe('CCCLXVII');
    expect(convertToRoman(2198)).toBe('MMCXCVIII');
    expect(convertToRoman(3999)).toBe('MMMCMXCIX');
  });

  test('throws error on zero or negative input', () => {
    expect(() => convertToRoman(0)).toThrow('Invalid Input number');
    expect(() => convertToRoman(-5)).toThrow('Invalid Input number');
  });

  test('throws error on out-of-range input (> 3999)', () => {
    expect(() => convertToRoman(6000)).toThrow('Invalid Input number');
  });

  test('throws error on non-numeric input', () => {
    expect(() => convertToRoman('')).toThrow('Invalid Input number');
    expect(() => convertToRoman(' ')).toThrow('Invalid Input number');
    expect(() => convertToRoman('xyz')).toThrow('Invalid Input number');
    expect(() => convertToRoman(null)).toThrow('Invalid Input number');
    expect(() => convertToRoman(undefined)).toThrow('Invalid Input number');
    expect(() => convertToRoman('7a%8')).toThrow('Invalid Input number');
  });
});
