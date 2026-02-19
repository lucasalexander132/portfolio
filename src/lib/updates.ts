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
// Tag vocabulary (re-exported from shared module for client compatibility)
// ---------------------------------------------------------------------------

import { UPDATE_TAGS, type UpdateTag } from './tags'
export { UPDATE_TAGS, type UpdateTag } from './tags'

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
  title_fr?: string
  summary_fr?: string
  body_fr?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const UPDATES_DIR = join(process.cwd(), 'src', 'content', 'updates')

// ---------------------------------------------------------------------------
// Markdown processing pipeline
// ---------------------------------------------------------------------------

function markdownPipeline() {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, { theme: 'github-dark-default', keepBackground: true })
    .use(rehypeStringify)
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

  const result = await markdownPipeline().process(content)

  const slug = filename.replace(/\.md$/, '')

  const entry: UpdateEntry = {
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

  // Load optional French companion file
  const frFilename = filename.replace(/\.md$/, '.fr.md')
  const frPath = join(UPDATES_DIR, frFilename)
  try {
    const frRaw = await readFile(frPath, 'utf-8')
    const { data: frData, content: frContent } = matter(frRaw)
    const frResult = await markdownPipeline().process(frContent)
    entry.title_fr = frData.title as string
    entry.summary_fr = frData.summary as string
    entry.body_fr = String(frResult)
  } catch {
    // No French companion file — graceful fallback
  }

  return entry
}

// ---------------------------------------------------------------------------
// Get all updates, sorted newest-first, with build-time caching
// ---------------------------------------------------------------------------

export async function getUpdates(): Promise<UpdateEntry[]> {
  'use cache'
  cacheLife('days')

  const files = (await readdir(UPDATES_DIR)).filter(
    (f) => f.endsWith('.md') && !f.endsWith('.fr.md'),
  )

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(UPDATES_DIR, file), 'utf-8')
      return parseUpdate(file, raw)
    }),
  )

  return entries.sort((a, b) => b.slug.localeCompare(a.slug))
}

// ---------------------------------------------------------------------------
// Get a single update by slug
// ---------------------------------------------------------------------------

export async function getUpdateBySlug(slug: string): Promise<UpdateEntry | null> {
  'use cache'
  cacheLife('days')

  try {
    const raw = await readFile(join(UPDATES_DIR, `${slug}.md`), 'utf-8')
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
