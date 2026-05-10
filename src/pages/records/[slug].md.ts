import type { APIContext, GetStaticPaths } from 'astro';
import { getPublicRecords, type RecordEntry } from '@/lib/records';
import { serializeRecordMarkdown } from '@/lib/markdown';

export const getStaticPaths: GetStaticPaths = async () => {
  const records = await getPublicRecords();
  return records.map((record) => ({ params: { slug: record.data.slug }, props: { record } }));
};

export function GET({ props }: APIContext) {
  const record = props.record as RecordEntry;

  return new Response(serializeRecordMarkdown(record), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

