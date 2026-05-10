import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const RECORDS_DIR = path.join(process.cwd(), 'src/content/records');
const GENERATED_PATH = path.join(process.cwd(), 'src/generated/public-records.json');

const internalPatterns: Array<{ label: string; pattern: RegExp }> = [
  { label: 'absolute home/server path', pattern: /\/(root|var\/norn-workspace|home\/[^\s/]+)\b/i },
  { label: 'secret-like token', pattern: /\b(token|secret|password|api[_-]?key)\s*[:=]/i },
  { label: 'internal actor or system name', pattern: /\b(Freya|Norn|Yggdrasil|Mimir|Bifrost|CoreNext|Skuld|Hild)\b/i },
  { label: 'private GitHub owner namespace', pattern: /\bShinichi-Toue\b/i },
];

interface RecordFile {
  filePath: string;
  relativePath: string;
  body: string;
  frontmatter: Record<string, unknown>;
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectMarkdownFiles(fullPath);
      if (/\.(md|mdx)$/.test(entry.name)) return [fullPath];
      return [];
    }),
  );
  return files.flat();
}

function parseFrontmatter(raw: string, filePath: string): RecordFile {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`${filePath}: missing YAML frontmatter`);
  const frontmatterRaw = match[1];
  const body = raw.slice(match[0].length);
  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterRaw.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyValue) continue;
    const [, key, rawValue] = keyValue;

    if (rawValue === '') {
      const values: string[] = [];
      while (index + 1 < lines.length && /^\s+-\s+/.test(lines[index + 1])) {
        index += 1;
        values.push(lines[index].replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''));
      }
      frontmatter[key] = values;
    } else {
      frontmatter[key] = rawValue.trim().replace(/^["']|["']$/g, '');
    }
  }

  return {
    filePath,
    relativePath: path.relative(process.cwd(), filePath),
    body,
    frontmatter,
  };
}

function requireString(record: RecordFile, key: string): string {
  const value = record.frontmatter[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${record.relativePath}: frontmatter.${key} must be a non-empty string`);
  }
  return value;
}

const files = await collectMarkdownFiles(RECORDS_DIR);
const records = await Promise.all(
  files.map(async (filePath) => parseFrontmatter(await readFile(filePath, 'utf8'), filePath)),
);

const publicSlugs: string[] = [];
const errors: string[] = [];

for (const record of records) {
  const slug = requireString(record, 'slug');
  const status = requireString(record, 'status');

  if (status !== 'public-safe-reviewed') continue;

  const reviewState = requireString(record, 'review_state');
  if (!['public-safe', 'human-reviewed', 'ai-reviewed'].includes(reviewState)) {
    errors.push(`${record.relativePath}: public-safe-reviewed record has weak review_state=${reviewState}`);
  }

  const searchableText = `${JSON.stringify(record.frontmatter)}\n${record.body}`;
  for (const { label, pattern } of internalPatterns) {
    if (pattern.test(searchableText)) {
      errors.push(`${record.relativePath}: public-safe record matched ${label} (${pattern})`);
    }
  }

  publicSlugs.push(slug);
}

const duplicateSlugs = publicSlugs.filter((slug, index) => publicSlugs.indexOf(slug) !== index);
for (const slug of duplicateSlugs) {
  errors.push(`duplicate public slug: ${slug}`);
}

if (errors.length > 0) {
  console.error('Public content lint failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

await mkdir(path.dirname(GENERATED_PATH), { recursive: true });
await writeFile(
  GENERATED_PATH,
  `${JSON.stringify({ generated_at: new Date().toISOString(), public_slugs: publicSlugs.sort() }, null, 2)}\n`,
);

console.log(`Public content lint passed: ${publicSlugs.length}/${records.length} records included in build.`);
