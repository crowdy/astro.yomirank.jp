import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArticleHtml } from './parse-article-html.js';

const fixture = readFileSync(
  resolve(import.meta.dirname, '..', 'fixtures', 'sample-normal.html'),
  'utf-8',
);

describe('parseArticleHtml', () => {
  it('extracts title from og:title', () => {
    const r = parseArticleHtml(fixture);
    expect(r.title).toBe('永久凍土が守った奇跡：チーターのミイラが語る古代の記憶');
  });

  it('extracts description from meta description', () => {
    const r = parseArticleHtml(fixture);
    expect(r.description).toMatch(/2026年、科学界を驚かせる/);
  });

  it('extracts date as ISO string parseable to Date', () => {
    const r = parseArticleHtml(fixture);
    expect(r.date).toBeInstanceOf(Date);
    expect(r.date.toISOString()).toBe('2026-03-10T07:01:00.000Z');
  });

  it('extracts ogImage URL', () => {
    const r = parseArticleHtml(fixture);
    expect(r.ogImage).toBe('https://m.media-amazon.com/images/I/81OmAas48hL._SY425_.jpg');
  });

  it('extracts news source', () => {
    const r = parseArticleHtml(fixture);
    expect(r.news.title).toBe('チーターのミイラ 驚きの保存状態');
    expect(r.news.url).toBe('https://news.yahoo.co.jp/pickup/6572599?source=rss');
  });

  it('extracts books array with all fields', () => {
    const r = parseArticleHtml(fixture);
    expect(r.books).toHaveLength(2);
    const b1 = r.books[0];
    expect(b1.rank).toBe(1);
    expect(b1.asin).toBe('B0FH4J9R6Q');
    expect(b1.title).toBe('絶滅動物物語（３） (ビッグコミックススペシャル)');
    expect(b1.author).toBe('うすくらふみ');
    expect(b1.category).toBe('青年マンガ');
    expect(b1.image).toBe('https://m.media-amazon.com/images/I/81OmAas48hL._SY425_.jpg');
    expect(b1.rating).toBe(5);
    expect(b1.point).toBe('古代動物のミイラ研究の方法論と成果を紹介');
    expect(b1.affiliateUrl).toContain('tag=yomirank-22');
  });

  it('extracts body paragraphs as array', () => {
    const r = parseArticleHtml(fixture);
    expect(r.bodyParagraphs.length).toBeGreaterThanOrEqual(5);
    expect(r.bodyParagraphs[0]).toMatch(/2026年、科学界を驚かせる/);
  });
});
