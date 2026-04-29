import * as cheerio from 'cheerio';

/**
 * Convert HTML ruby markup back to brace markup.
 * <ruby>漢字<rt>かな</rt></ruby> → {漢字|かな}
 * <rp> tags are stripped.
 */
export function rubyHtmlToBraceMarkup(html) {
  // Strip <rp>...</rp> first (purely presentational)
  const noRp = html.replace(/<rp\b[^>]*>.*?<\/rp>/gs, '');
  // Replace ruby blocks
  return noRp.replace(
    /<ruby\b[^>]*>(.*?)<rt\b[^>]*>(.*?)<\/rt>(.*?)<\/ruby>/gs,
    (_m, before, kana, after) => {
      const kanji = before + after;
      return `{${kanji}|${kana}}`;
    },
  );
}

/**
 * Parse ruby variant HTML and return body text with brace ruby markup.
 * Returns paragraphs joined by blank lines.
 */
export function parseRubyHtml(html) {
  const $ = cheerio.load(html);

  const paragraphs = [];
  $('.article-content p').each((_i, el) => {
    const innerHtml = $(el).html() ?? '';
    const converted = rubyHtmlToBraceMarkup(innerHtml).trim();
    if (converted) paragraphs.push(converted);
  });

  return paragraphs.join('\n\n');
}
