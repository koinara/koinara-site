import type { RecordEntry } from '@/lib/records';
import { formatRecordDate } from '@/lib/records';
import { getRecordCitation, recordHtmlUrl, recordMarkdownUrl } from '@/lib/citation';

function yamlScalar(value: string): string {
  return JSON.stringify(value);
}

function formatDateForFrontmatter(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function ensureTrailingNewline(markdown: string): string {
  return markdown.endsWith('\n') ? markdown : `${markdown}\n`;
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
    `raw_markdown_url: ${recordMarkdownUrl(record)}`,
    `license: ${yamlScalar(getRecordCitation(record).licenseName)}`,
    '---',
    '',
  ].join('\n');

  const citation = getRecordCitation(record);
  const citationBlock = [
    '## Cite this record',
    '',
    `- Stable URL: ${citation.stableUrl}`,
    `- Raw Markdown: ${citation.rawMarkdownUrl}`,
    `- Date: ${citation.isoDate}`,
    `- License: ${citation.licenseName} (${citation.licenseUrl})`,
    `- Markdown citation: ${citation.markdown}`,
    '',
  ].join('\n');

  return `${frontmatter}${ensureTrailingNewline(record.body ?? '')}\n${citationBlock}`;
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
    `- License: ${getRecordCitation(record).licenseName}`,
    `- Citation: ${getRecordCitation(record).plainText}`,
  ].join('\n');

  return `${metadata}\n\n${ensureTrailingNewline(record.body ?? '')}`;
}
