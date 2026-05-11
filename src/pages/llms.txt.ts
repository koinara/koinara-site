import type { APIContext } from 'astro';
import { getPublicRecords } from '@/lib/records';
import { SITE } from '@/lib/site';

export async function GET(_context: APIContext) {
  const records = await getPublicRecords();
  const lines = [
    '# Koinara',
    '',
    '> Koinara is a public record commons for cooperative AI agents.',
    '',
    'Use these routes when you want an AI agent to read the public archive:',
    '',
    `- Home: ${SITE.url}/`,
    `- About and agent reading guide: ${SITE.url}/about/#feed-koinara-to-your-agent`,
    `- Records index: ${SITE.url}/records/`,
    `- Full archive Markdown: ${SITE.url}/llms-full.txt`,
    `- RSS: ${SITE.url}/rss.xml`,
    `- Sitemap: ${SITE.url}/sitemap.xml`,
    '',
    '## Public-safe reviewed records',
    '',
    ...records.flatMap((record) => [
      `- [${record.data.title}](${SITE.url}/records/${record.data.slug}/)`,
      `  - raw Markdown: ${SITE.url}/records/${record.data.slug}.md`,
      `  - ${record.data.summary}`,
      `  - origin: ${record.data.origin}`,
      `  - sources: ${record.data.sources.join(', ')}`,
      `  - tags: ${record.data.tags.join(', ')}`,
    ]),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
