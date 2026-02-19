import 'server-only'

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { cacheLife } from 'next/cache'

// ---------------------------------------------------------------------------
// Tag vocabulary
// ---------------------------------------------------------------------------

export const UPDATE_TAGS = [
  'project-launch',
  'design-thinking',
  'business',
  'community',
  'learning',
] as const

export type UpdateTag = (typeof UPDATE_TAGS)[number]

// ---------------------------------------------------------------------------
// Entry type
// ---------------------------------------------------------------------------

export interface UpdateEntry {
  slug: string       // derived from filename (strip .md)
  title: string
  date: string       // YYYY-MM format
  tag: UpdateTag
  summary: string
  body: string       // rendered HTML from markdown body
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateFrontmatter(
  data: Record<string, unknown>,
  filename: string,
): void {
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    throw new Error(`Missing or empty "title" in ${filename}`)
  }

  if (typeof data.date !== 'string' || !/^\d{4}-\d{2}$/.test(data.date)) {
    throw new Error(
      `Invalid "date" in ${filename}. Expected YYYY-MM format, got "${String(data.date)}"`,
    )
  }

  if (
    typeof data.tag !== 'string' ||
    !(UPDATE_TAGS as readonly string[]).includes(data.tag)
  ) {
    throw new Error(
      `Invalid tag '${String(data.tag)}' in ${filename}. Valid tags: ${UPDATE_TAGS.join(', ')}`,
    )
  }

  if (typeof data.summary !== 'string' || data.summary.trim() === '') {
    throw new Error(`Missing or empty "summary" in ${filename}`)
  }
}

// ---------------------------------------------------------------------------
// Parse a single markdown file into an UpdateEntry
// ---------------------------------------------------------------------------

export async function parseUpdate(
  filename: string,
  raw: string,
): Promise<UpdateEntry> {
  const { data, content } = matter(raw)

  validateFrontmatter(data as Record<string, unknown>, filename)

  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content)

  const slug = filename.replace(/\.md$/, '')

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    tag: data.tag as UpdateTag,
    summary: data.summary as string,
    body: String(result),
  }
}

// ---------------------------------------------------------------------------
// Get all updates, sorted newest-first, with build-time caching
// ---------------------------------------------------------------------------

export async function getUpdates(): Promise<UpdateEntry[]> {
  'use cache'
  cacheLife('days')

  const dir = join(process.cwd(), 'src', 'content', 'updates')
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'))

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(dir, file), 'utf-8')
      return parseUpdate(file, raw)
    }),
  )

  return entries.sort((a, b) => b.date.localeCompare(a.date))
}
