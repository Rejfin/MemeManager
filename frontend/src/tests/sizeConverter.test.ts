import { describe, expect, test } from 'vitest';
import { convertToKilobytes, convertToMegabytes, convertToGigabytes } from '../utils/sizeConverter';

describe('test unit converter class', () => {
  test('convert 2137 bytes to kilobytes', () => {
    expect(convertToKilobytes(2137).toFixed(2)).toBe('2.09');
  });

  test('convert -1 bytes to kilobytes', () => {
    expect(convertToKilobytes(-1)).toBe(0);
  });

  test('convert 837426592 bytes to MB', () => {
    expect(convertToMegabytes(837426592).toFixed(2)).toBe('798.63');
  });

  test('convert 1237834596 bytes to GB', () => {
    expect(convertToGigabytes(1237834596).toFixed(2)).toBe('1.15');
  });

  test('convert 27564212 bytes to GB', () => {
    expect(convertToGigabytes(27564212).toFixed(2)).toBe('0.03');
  });
});

export {};
