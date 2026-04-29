import * as cheerio from 'cheerio';

export function parseArticleHtml(html) {
  const $ = cheerio.load(html);

  const title = $('meta[property="og:title"]').attr('content') ?? '';
  const description = $('meta[name="description"]').attr('content') ?? '';
  const dateStr = $('meta[property="article:published_time"]').attr('content');
  const date = dateStr ? new Date(dateStr) : null;
  const ogImage = $('meta[property="og:image"]').attr('content') ?? null;

  const newsAnchor = $('.news-source a').first();
  const news = {
    title: newsAnchor.text().trim(),
    url: newsAnchor.attr('href') ?? '',
  };

  const books = [];
  $('.book-list .book-item').each((_i, el) => {
    const $b = $(el);
    const affiliateUrl = $b.attr('href') ?? '';
    const asinMatch = affiliateUrl.match(/\/dp\/([A-Z0-9]+)/);
    const ratingText = $b.find('.book-rating').text().trim();
    const ratingMatch = ratingText.match(/([\d.]+)/);

    books.push({
      rank: Number($b.find('.book-rank').text().trim()) || 0,
      asin: asinMatch?.[1] ?? '',
      title: $b.find('.book-title').text().trim(),
      author: $b.find('.book-author').text().trim() || undefined,
      category: $b.find('.book-category').text().trim() || undefined,
      image: $b.find('.book-image img').attr('src') ?? '',
      rating: ratingMatch ? Number(ratingMatch[1]) : undefined,
      point: $b.find('.book-point').text().trim(),
      affiliateUrl,
    });
  });

  const bodyParagraphs = [];
  $('.article-content p').each((_i, el) => {
    const text = $(el).text().trim();
    if (text) bodyParagraphs.push(text);
  });

  return { title, description, date, ogImage, news, books, bodyParagraphs };
}
