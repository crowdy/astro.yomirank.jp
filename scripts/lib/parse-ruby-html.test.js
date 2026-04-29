import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseRubyHtml, rubyHtmlToBraceMarkup } from './parse-ruby-html.js';

describe('rubyHtmlToBraceMarkup (unit)', () => {
  it('converts <ruby>X<rt>Y</rt></ruby> to {X|Y}', () => {
    expect(rubyHtmlToBraceMarkup('<ruby>永久<rt>えいきゅう</rt></ruby>'))
      .toBe('{永久|えいきゅう}');
  });

  it('strips <rp> tags', () => {
    expect(rubyHtmlToBraceMarkup('<ruby>永久<rp>(</rp><rt>えいきゅう</rt><rp>)</rp></ruby>'))
      .toBe('{永久|えいきゅう}');
  });

  it('handles multiple ruby in sequence', () => {
    const input = '<ruby>永久<rt>えいきゅう</rt></ruby><ruby>凍土<rt>とうど</rt></ruby>';
    expect(rubyHtmlToBraceMarkup(input)).toBe('{永久|えいきゅう}{凍土|とうど}');
  });

  it('preserves surrounding plain text', () => {
    expect(rubyHtmlToBraceMarkup('これは<ruby>漢字<rt>かんじ</rt></ruby>です'))
      .toBe('これは{漢字|かんじ}です');
  });

  it('returns input unchanged when no ruby tags', () => {
    expect(rubyHtmlToBraceMarkup('plain text 2026')).toBe('plain text 2026');
  });
});

describe('parseRubyHtml (integration with fixture)', () => {
  const fixture = readFileSync(
    resolve(import.meta.dirname, '..', 'fixtures', 'sample-ruby.html'),
    'utf-8',
  );

  it('returns concatenated paragraphs separated by blank lines', () => {
    const r = parseRubyHtml(fixture);
    expect(typeof r).toBe('string');
    expect(r.length).toBeGreaterThan(100);
    expect(r).toContain('|');  // brace markup present
    expect(r).not.toContain('<ruby>');  // raw HTML not present
    expect(r).not.toContain('<rt>');
    expect(r).not.toContain('<rp>');
    // Paragraphs separated by \n\n
    const paras = r.split(/\n\s*\n/);
    expect(paras.length).toBeGreaterThanOrEqual(3);
  });
});
