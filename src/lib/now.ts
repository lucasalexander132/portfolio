import 'server-only'

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

// ---------------------------------------------------------------------------
// Entry type
// ---------------------------------------------------------------------------

export interface NowEntry {
  focus_en: string
  focus_fr: string
  learning_en: string
  learning_fr: string
  updated: string
}

// ---------------------------------------------------------------------------
// Read the now section content from frontmatter
// ---------------------------------------------------------------------------

export function getNow(): NowEntry {
  const filePath = join(process.cwd(), 'src', 'content', 'now.md')
  const raw = readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)

  return {
    focus_en: data.focus_en as string,
    focus_fr: data.focus_fr as string,
    learning_en: data.learning_en as string,
    learning_fr: data.learning_fr as string,
    updated: data.updated as string,
  }
}
