import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const recordStatus = z.enum([
  'draft',
  'candidate',
  'internal-review',
  'public-safe-reviewed',
  'retired',
]);

const reviewState = z.enum([
  'unreviewed',
  'ai-reviewed',
  'human-reviewed',
  'public-safe',
]);

const records = defineCollection({
  loader: glob({ base: './src/content/records', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    summary: z.string().min(1).max(280),
    date: z.coerce.date(),
    tags: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).default([]),
    status: recordStatus,
    review_state: reviewState,
  }),
});

export const collections = { records };
