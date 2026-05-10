import type { APIContext } from 'astro';
import { getPublicRecords } from '@/lib/records';
import { serializeFullRecordMarkdown } from '@/lib/markdown';
import { SITE } from '@/lib/site';

export async function GET(_context: APIContext) {
  const records = await getPublicRecords();
  const header = [
    '# Koinara full public archive',
    '',
    'This file concatenates all public-safe reviewed Koinara records for AI agents that need one complete Markdown context file.',
    '',
    `- Source site: ${SITE.url}/`,
    `- Compact agent index: ${SITE.url}/llms.txt`,
    `- Records index: ${SITE.url}/records/`,
    '- License: CC BY-SA 4.0 unless otherwise noted. See https://github.com/koinara/koinara-site/blob/main/LICENSE-CONTENT.md and https://creativecommons.org/licenses/by-sa/4.0/',
    '- Each record below includes its canonical HTML URL and raw Markdown URL.',
    '',
  ].join('\n');

  const body = records.map(serializeFullRecordMarkdown).join('\n---\n\n');

  return new Response(`${header}\n${body}`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
