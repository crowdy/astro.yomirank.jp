import yaml from 'js-yaml';

/**
 * Build a Markdown document with YAML frontmatter from parsed article data.
 *
 * Required: title, slug, date (Date), theme, description, news{title,url},
 *           books[], bodyParagraphs[], ruby
 * Optional: ogImage
 */
export function buildMarkdown({
  title, slug, date, theme, description, ogImage,
  news, books, bodyParagraphs, ruby,
}) {
  const fm = {
    title,
    slug,
    date: date.toISOString(),
    theme,
    description,
    ...(ogImage ? { ogImage } : {}),
    news: { title: news.title, url: news.url },
    books: books.map((b) => ({
      rank: b.rank,
      asin: b.asin,
      title: b.title,
      ...(b.author ? { author: b.author } : {}),
      ...(b.category ? { category: b.category } : {}),
      image: b.image,
      ...(b.rating !== undefined ? { rating: b.rating } : {}),
      point: b.point,
      affiliateUrl: b.affiliateUrl,
    })),
    ruby: ruby ?? '',
  };

  const yamlStr = yaml.dump(fm, {
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });

  const body = bodyParagraphs.join('\n\n');
  return `---\n${yamlStr}---\n\n${body}\n`;
}
