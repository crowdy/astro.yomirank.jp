import { describe, it, expect } from 'vitest';
import { detectTheme } from './detect-theme.js';

describe('detectTheme', () => {
  const atJst = (yyyy, mm, dd, h, mi = 0) =>
    new Date(`${yyyy}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}T${String(h).padStart(2,'0')}:${String(mi).padStart(2,'0')}:00+09:00`);

  it.each([
    [7, '総合'],
    [8, '経済'],
    [9, '国内'],
    [10, '国際'],
    [13, 'IT'],
    [14, '文化'],
    [15, 'スポーツ'],
    [16, '科学'],
  ])('hour %i (JST) → %s', (hour, expected) => {
    expect(detectTheme(atJst(2026, 3, 10, hour, 5))).toBe(expected);
  });

  it('returns 総合 for unmapped hours (5, 11, 17, 22)', () => {
    expect(detectTheme(atJst(2026, 3, 10, 5))).toBe('総合');
    expect(detectTheme(atJst(2026, 3, 10, 11))).toBe('総合');
    expect(detectTheme(atJst(2026, 3, 10, 17))).toBe('総合');
    expect(detectTheme(atJst(2026, 3, 10, 22))).toBe('総合');
  });
});
