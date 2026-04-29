import { describe, it, expect } from 'vitest';
import { renderRuby } from './render-ruby';

describe('renderRuby', () => {
  it('converts {漢字|かな} to <ruby>漢字<rt>かな</rt></ruby>', () => {
    expect(renderRuby('{永久|えいきゅう}')).toBe('<ruby>永久<rt>えいきゅう</rt></ruby>');
  });

  it('preserves plain text around markup', () => {
    expect(renderRuby('これは{漢字|かんじ}です')).toBe('これは<ruby>漢字<rt>かんじ</rt></ruby>です');
  });

  it('handles multiple markups in one line', () => {
    expect(renderRuby('{永久|えいきゅう}{凍土|とうど}'))
      .toBe('<ruby>永久<rt>えいきゅう</rt></ruby><ruby>凍土<rt>とうど</rt></ruby>');
  });

  it('escapes HTML special chars in plain text but not in ruby contents', () => {
    expect(renderRuby('a < b'))
      .toBe('a &lt; b');
  });

  it('returns input unchanged when no markup present', () => {
    expect(renderRuby('plain text')).toBe('plain text');
  });
});
