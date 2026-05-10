import { getCollection, type CollectionEntry } from 'astro:content';
import publicRecords from '../generated/public-records.json';

export type RecordEntry = CollectionEntry<'records'>;

const publicSlugSet = new Set<string>(publicRecords.public_slugs);

export function isPublicRecord(record: RecordEntry): boolean {
  return record.data.status === 'public-safe-reviewed' && publicSlugSet.has(record.data.slug);
}

export async function getPublicRecords(): Promise<RecordEntry[]> {
  const records = await getCollection('records');
  return records
    .filter(isPublicRecord)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getAllTags(records: RecordEntry[]): string[] {
  return [...new Set(records.flatMap((record) => record.data.tags))].sort((a, b) => a.localeCompare(b));
}

export function formatRecordDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}
