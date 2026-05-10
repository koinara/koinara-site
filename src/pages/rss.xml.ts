import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublicRecords } from '@/lib/records';
import { SITE } from '@/lib/site';

export async function GET(context: APIContext) {
  const records = await getPublicRecords();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: records.map((record) => ({
      title: record.data.title,
      description: record.data.summary,
      pubDate: record.data.date,
      link: `/records/${record.data.slug}/`,
      categories: record.data.tags,
    })),
  });
}
