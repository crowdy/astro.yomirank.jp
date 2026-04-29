#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, basename, relative } from 'node:path';
import fg from 'fast-glob';
import { parseArticleHtml } from './lib/parse-article-html.js';
import { parseRubyHtml } from './lib/parse-ruby-html.js';
import { detectTheme } from './lib/detect-theme.js';
import { buildMarkdown } from './lib/build-markdown.js';

function parseArgs(argv) {
  const args = { source: null, output: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--source') args.source = argv[++i];
    else if (argv[i] === '--output') args.output = argv[++i];
  }
  if (!args.source || !args.output) {
    console.error('Usage: node migrate-html-to-md.js --source <DIR> --output <DIR>');
    process.exit(2);
  }
  return args;
}

async function migrateOne({ sourceFile, sourceRoot, outputRoot }) {
  const html = await readFile(sourceFile, 'utf-8');
  const parsed = parseArticleHtml(html);
  if (!parsed.date) throw new Error('no date found in og meta');
  if (!parsed.title) throw new Error('no title found');

  const slug = basename(sourceFile, '.html');
  const theme = detectTheme(parsed.date);

  const dir = dirname(sourceFile);
  const rubyFile = resolve(dir, 'ruby', `${slug}.html`);
  let ruby = '';
  if (existsSync(rubyFile)) {
    const rubyHtml = await readFile(rubyFile, 'utf-8');
    ruby = parseRubyHtml(rubyHtml);
  }

  const md = buildMarkdown({
    title: parsed.title,
    slug,
    date: parsed.date,
    theme,
    description: parsed.description,
    ogImage: parsed.ogImage,
    news: parsed.news,
    books: parsed.books,
    bodyParagraphs: parsed.bodyParagraphs,
    ruby,
  });

  const rel = relative(sourceRoot, sourceFile).replace(/\.html$/, '.md');
  const outPath = resolve(outputRoot, rel);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, md, 'utf-8');
  return outPath;
}

async function main() {
  const { source, output } = parseArgs(process.argv);
  const sourceRoot = resolve(source);
  const outputRoot = resolve(output);

  const files = await fg('**/*.html', {
    cwd: sourceRoot,
    absolute: true,
    ignore: ['**/ruby/**'],
  });

  console.log(`Found ${files.length} articles to migrate.`);
  const errors = [];
  let ok = 0;

  for (const f of files) {
    try {
      await migrateOne({ sourceFile: f, sourceRoot, outputRoot });
      ok += 1;
      if (ok % 100 === 0) console.log(`Progress: ${ok}/${files.length}`);
    } catch (e) {
      errors.push({ file: relative(sourceRoot, f), error: e.message });
    }
  }

  console.log(`\nMigration complete: ${ok}/${files.length} succeeded, ${errors.length} failed.`);
  if (errors.length > 0) {
    const errPath = resolve(import.meta.dirname, 'migration-errors.json');
    await writeFile(errPath, JSON.stringify(errors, null, 2), 'utf-8');
    console.log(`Errors written to: ${errPath}`);
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
