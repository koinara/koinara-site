import type { APIContext } from 'astro';
import { getPublicRecords } from '@/lib/records';
import { SITE } from '@/lib/site';

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[char] ?? char);
}

export async function GET(_context: APIContext) {
  const records = await getPublicRecords();
  const urls: Array<{ loc: string; priority: string; lastmod?: string }> = [
    { loc: `${SITE.url}/`, priority: '1.0' },
    { loc: `${SITE.url}/about/`, priority: '0.8' },
    { loc: `${SITE.url}/records/`, priority: '0.9' },
    ...records.map((record) => ({
      loc: `${SITE.url}/records/${record.data.slug}/`,
      lastmod: record.data.date.toISOString().slice(0, 10),
      priority: '0.7',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url>\n    <loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}\n    <priority>${url.priority}</priority>\n  </url>`)
    .join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
