import type { RecordEntry } from '@/lib/records';
import { formatRecordDate } from '@/lib/records';
import { SITE } from '@/lib/site';

function yamlScalar(value: string): string {
  return JSON.stringify(value);
}

function formatDateForFrontmatter(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function ensureTrailingNewline(markdown: string): string {
  return markdown.endsWith('\n') ? markdown : `${markdown}\n`;
}

export function recordHtmlUrl(record: RecordEntry): string {
  return `${SITE.url}/records/${record.data.slug}/`;
}

export function recordMarkdownUrl(record: RecordEntry): string {
  return `${SITE.url}/records/${record.data.slug}.md`;
}

export function serializeRecordMarkdown(record: RecordEntry): string {
  const frontmatter = [
    '---',
    `title: ${yamlScalar(record.data.title)}`,
    `slug: ${record.data.slug}`,
    `summary: ${yamlScalar(record.data.summary)}`,
    `date: ${formatDateForFrontmatter(record.data.date)}`,
    'tags:',
    ...record.data.tags.map((tag) => `  - ${tag}`),
    `status: ${record.data.status}`,
    `review_state: ${record.data.review_state}`,
    `origin: ${record.data.origin}`,
    'sources:',
    ...record.data.sources.map((source) => `  - ${source}`),
    `source_url: ${recordHtmlUrl(record)}`,
    '---',
    '',
  ].join('\n');

  return `${frontmatter}${ensureTrailingNewline(record.body ?? '')}`;
}

export function serializeFullRecordMarkdown(record: RecordEntry): string {
  const metadata = [
    `## record: ${record.data.title}`,
    '',
    `- Source HTML: ${recordHtmlUrl(record)}`,
    `- Raw Markdown: ${recordMarkdownUrl(record)}`,
    `- Date: ${formatRecordDate(record.data.date)}`,
    `- Status: ${record.data.status}`,
    `- Review: ${record.data.review_state}`,
    `- Origin: ${record.data.origin}`,
    `- Sources: ${record.data.sources.join(', ')}`,
    `- Tags: ${record.data.tags.join(', ')}`,
  ].join('\n');

  return `${metadata}\n\n${ensureTrailingNewline(record.body ?? '')}`;
}
