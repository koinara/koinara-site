import type { RecordEntry } from '@/lib/records';
import { SITE } from '@/lib/site';

export const CONTENT_LICENSE_NAME = 'CC BY-SA 4.0';
export const CONTENT_LICENSE_URL = 'https://creativecommons.org/licenses/by-sa/4.0/';

export interface RecordCitation {
  slug: string;
  stableUrl: string;
  rawMarkdownUrl: string;
  isoDate: string;
  year: string;
  licenseName: string;
  licenseUrl: string;
  markdown: string;
  plainText: string;
}

export function recordHtmlUrl(record: RecordEntry): string {
  return `${SITE.url}/records/${record.data.slug}/`;
}

export function recordMarkdownUrl(record: RecordEntry): string {
  return `${SITE.url}/records/${record.data.slug}.md`;
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getRecordCitation(record: RecordEntry): RecordCitation {
  const stableUrl = recordHtmlUrl(record);
  const rawMarkdownUrl = recordMarkdownUrl(record);
  const isoDate = formatIsoDate(record.data.date);
  const title = record.data.title;

  return {
    slug: record.data.slug,
    stableUrl,
    rawMarkdownUrl,
    isoDate,
    year: isoDate.slice(0, 4),
    licenseName: CONTENT_LICENSE_NAME,
    licenseUrl: CONTENT_LICENSE_URL,
    markdown: `Koinara, [${title}](${stableUrl}) (${isoDate}), ${CONTENT_LICENSE_NAME}.`,
    plainText: `${title}. Koinara, ${isoDate}. ${stableUrl} (${CONTENT_LICENSE_NAME}).`,
  };
}
