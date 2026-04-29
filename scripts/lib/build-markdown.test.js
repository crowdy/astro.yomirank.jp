import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import { buildMarkdown } from './build-markdown.js';

const sampleInput = {
  title: 'テストタイトル',
  slug: '20260310-1601',
  date: new Date('2026-03-10T07:01:00.000Z'),
  theme: '科学',
  description: 'テスト説明',
  ogImage: 'https://m.example.com/img.jpg',
  news: { title: 'ニュース', url: 'https://news.example.com/x' },
  books: [{
    rank: 1,
    asin: 'B0FH4J9R6Q',
    title: '本',
    author: '著者',
    category: 'カテゴリ',
    image: 'https://m.example.com/book.jpg',
    rating: 5,
    point: 'おすすめ理由',
    affiliateUrl: 'https://www.amazon.co.jp/dp/B0FH4J9R6Q?tag=yomirank-22',
  }],
  bodyParagraphs: ['段落1', '段落2'],
  ruby: 'これは{漢字|かんじ}',
};

describe('buildMarkdown', () => {
  it('returns a string starting with --- frontmatter delimiter', () => {
    const md = buildMarkdown(sampleInput);
    expect(md).toMatch(/^---\n/);
  });

  it('contains parseable frontmatter with all required fields', () => {
    const md = buildMarkdown(sampleInput);
    const match = md.match(/^---\n([\s\S]*?)\n---\n/);
    expect(match).toBeTruthy();
    const fm = yaml.load(match[1]);
    expect(fm.title).toBe('テストタイトル');
    expect(fm.slug).toBe('20260310-1601');
    expect(fm.theme).toBe('科学');
    expect(fm.description).toBe('テスト説明');
    expect(fm.ogImage).toBe('https://m.example.com/img.jpg');
    expect(fm.news.title).toBe('ニュース');
    expect(fm.news.url).toBe('https://news.example.com/x');
    expect(fm.books).toHaveLength(1);
    expect(fm.books[0].asin).toBe('B0FH4J9R6Q');
    expect(fm.ruby).toBe('これは{漢字|かんじ}');
  });

  it('preserves date as ISO 8601 string', () => {
    const md = buildMarkdown(sampleInput);
    const match = md.match(/^---\n([\s\S]*?)\n---\n/);
    const fm = yaml.load(match[1]);
    const dateStr = fm.date instanceof Date ? fm.date.toISOString() : fm.date;
    expect(dateStr).toBe('2026-03-10T07:01:00.000Z');
  });

  it('writes body paragraphs separated by blank lines after frontmatter', () => {
    const md = buildMarkdown(sampleInput);
    const body = md.split(/\n---\n/)[1];
    expect(body.trim()).toBe('段落1\n\n段落2');
  });

  it('omits ogImage from frontmatter when undefined', () => {
    const noImg = { ...sampleInput, ogImage: undefined };
    const md = buildMarkdown(noImg);
    const match = md.match(/^---\n([\s\S]*?)\n---\n/);
    const fm = yaml.load(match[1]);
    expect(fm.ogImage).toBeUndefined();
  });

  it('writes empty ruby string when input ruby is empty', () => {
    const noRuby = { ...sampleInput, ruby: '' };
    const md = buildMarkdown(noRuby);
    const match = md.match(/^---\n([\s\S]*?)\n---\n/);
    const fm = yaml.load(match[1]);
    expect(fm.ruby).toBe('');
  });
});
