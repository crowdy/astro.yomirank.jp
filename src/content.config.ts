import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const bookSchema = z.object({
  rank: z.number().int(),
  asin: z.string(),
  title: z.string(),
  author: z.string().optional().default(''),
  category: z.string().optional().default(''),
  image: z.string(),
  rating: z.number().optional(),
  point: z.string(),
  affiliateUrl: z.url(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    theme: z.enum(['総合','経済','国内','国際','IT','文化','スポーツ','科学']),
    description: z.string(),
    ogImage: z.url().optional(),
    news: z.object({
      title: z.string(),
      url: z.string(),
    }),
    books: z.array(bookSchema).default([]),
    ruby: z.string().optional().default(''),
  }),
});

export const collections = { blog };
