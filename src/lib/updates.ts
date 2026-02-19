import 'server-only'

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypePrettyCode from 'rehype-pretty-code'
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
  link?: { url: string; label: string }
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

  if (data.link !== undefined) {
    const link = data.link as Record<string, unknown>
    if (
      typeof link !== 'object' ||
      link === null ||
      typeof link.url !== 'string' ||
      link.url.trim() === '' ||
      typeof link.label !== 'string' ||
      link.label.trim() === ''
    ) {
      throw new Error(
        `Invalid "link" in ${filename}. Expected { url: string, label: string }`,
      )
    }
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
    .use(rehypePrettyCode, { theme: 'github-dark-default', keepBackground: true })
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
    link: data.link
      ? { url: (data.link as Record<string, unknown>).url as string, label: (data.link as Record<string, unknown>).label as string }
      : undefined,
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

// ---------------------------------------------------------------------------
// Get a single update by slug
// ---------------------------------------------------------------------------

export async function getUpdateBySlug(slug: string): Promise<UpdateEntry | null> {
  'use cache'
  cacheLife('days')

  const dir = join(process.cwd(), 'src', 'content', 'updates')
  try {
    const raw = await readFile(join(dir, `${slug}.md`), 'utf-8')
    return parseUpdate(`${slug}.md`, raw)
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Get adjacent (prev/next) entries for navigation
// ---------------------------------------------------------------------------

export async function getAdjacentEntries(slug: string): Promise<{
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}> {
  const entries = await getUpdates()
  const index = entries.findIndex(e => e.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: index > 0 ? { slug: entries[index - 1].slug, title: entries[index - 1].title } : null,
    next: index < entries.length - 1 ? { slug: entries[index + 1].slug, title: entries[index + 1].title } : null,
  }
}
