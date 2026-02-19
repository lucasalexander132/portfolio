# Phase 9: Content Infrastructure - Research

**Researched:** 2026-02-19
**Domain:** Markdown content pipeline (gray-matter + unified) with Next.js 16 caching
**Confidence:** HIGH

## Summary

This phase builds a typed markdown content pipeline that reads `.md` files from `src/content/updates/`, parses frontmatter with gray-matter, renders body HTML with unified/remark/rehype, and returns typed `UpdateEntry` objects. The `"use cache"` directive provides build-time caching.

The standard approach is well-established: gray-matter extracts frontmatter, unified's remark/rehype pipeline converts markdown to HTML, and TypeScript strict mode enforces the content schema at compile time. The key architectural insight is that gray-matter handles frontmatter separately from unified -- gray-matter strips and parses frontmatter YAML, then unified processes only the markdown body. This avoids needing remark-frontmatter/remark-parse-frontmatter plugins entirely.

**Primary recommendation:** Use gray-matter 4.0.3 for frontmatter extraction + unified 11 pipeline (remark-parse + remark-rehype + rehype-stringify) for body HTML. Keep all parsing server-only. Use a Zod-like manual validation function (no extra dependency) to enforce the schema at parse time, and TypeScript union types for the tag vocabulary.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gray-matter | 4.0.3 | Parse YAML frontmatter from .md files | Battle-tested, used by Gatsby/Astro/Vitepress/etc. Built-in TypeScript types. |
| unified | 11.0.5 | Pipeline orchestrator for content transformation | The standard for composable content processing. ESM-native. |
| remark-parse | 11.0.0 | Parse markdown string into mdast syntax tree | Official unified markdown parser |
| remark-rehype | 11.1.2 | Bridge mdast (markdown) to hast (HTML) syntax tree | Official bridge between remark and rehype ecosystems |
| rehype-stringify | 10.0.1 | Serialize hast (HTML) tree to HTML string | Official HTML serializer |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rehype-sanitize | 6.0.0 | Sanitize HTML output against XSS | If markdown files could contain untrusted content. Since content is author-controlled, this is optional but defense-in-depth. |
| server-only | 0.0.1 | Prevent accidental client import | Import at top of content utility to guarantee zero markdown processing in client bundle |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| gray-matter + unified | MDX (@next/mdx) | MDX allows React in content -- overkill for plain markdown, adds client JS, Turbopack plugin config complexity |
| gray-matter + unified | Velite | Velite has known Turbopack incompatibility (per STATE.md research) |
| gray-matter + unified | Contentlayer | Abandoned/unmaintained as of 2024 |
| Manual validation | Zod | Adds a dependency for ~20 lines of validation code; not worth it for a 5-field schema |

**Installation:**
```bash
npm install gray-matter unified remark-parse remark-rehype rehype-stringify server-only
```

Note: gray-matter ships its own `.d.ts`. unified ecosystem packages are fully typed. No `@types/*` packages needed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── content/
│   └── updates/           # Markdown files (one per entry)
│       ├── 2025-06-codex-grove-launch.md
│       ├── 2025-09-design-system-thinking.md
│       ├── 2025-11-community-workshop.md
│       └── 2026-01-learning-rust.md
├── lib/
│   └── updates.ts         # getUpdates(), parseUpdate(), types, validation
└── types/
    └── updates.ts         # UpdateEntry interface, UpdateTag union type (optional: co-locate in lib/updates.ts)
```

### Pattern 1: Gray-Matter + Unified Two-Step Parse
**What:** Separate frontmatter extraction from body rendering. gray-matter strips frontmatter, unified processes only the markdown body.
**When to use:** Always -- this is simpler and more reliable than using remark-frontmatter plugins.
**Example:**
```typescript
// Source: gray-matter README + unified README
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

async function parseMarkdownFile(raw: string) {
  // Step 1: gray-matter extracts frontmatter + body
  const { data, content } = matter(raw)

  // Step 2: unified renders body markdown to HTML
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content)

  return {
    frontmatter: data,         // { title: '...', date: '...', ... }
    body: String(result.value) // '<p>Rendered HTML...</p>'
  }
}
```

### Pattern 2: TypeScript Union Type for Tag Vocabulary
**What:** Define tags as a string literal union so invalid tags cause compile errors.
**When to use:** Always -- this is the requirement (UPD-03).
**Example:**
```typescript
// Fixed vocabulary (max 5-7 tags per STATE.md decision)
export const UPDATE_TAGS = [
  'project-launch',
  'design-thinking',
  'business',
  'community',
  'learning',
] as const

export type UpdateTag = (typeof UPDATE_TAGS)[number]

// Type guard for runtime validation
function isValidTag(tag: string): tag is UpdateTag {
  return (UPDATE_TAGS as readonly string[]).includes(tag)
}
```

### Pattern 3: Frontmatter Validation at Parse Time
**What:** Validate frontmatter fields immediately after gray-matter parses them, throwing descriptive errors.
**When to use:** Always -- this enforces the schema at build time (UPD-02).
**Example:**
```typescript
interface RawFrontmatter {
  title: string
  date: string    // "YYYY-MM" format (month+year only per STATE.md)
  tag: string
  summary: string
}

function validateFrontmatter(data: Record<string, unknown>, filePath: string): RawFrontmatter {
  const errors: string[] = []

  if (typeof data.title !== 'string' || !data.title) {
    errors.push('missing or invalid "title"')
  }
  if (typeof data.date !== 'string' || !/^\d{4}-\d{2}$/.test(data.date)) {
    errors.push('missing or invalid "date" (expected YYYY-MM)')
  }
  if (typeof data.tag !== 'string' || !isValidTag(data.tag)) {
    errors.push(`invalid "tag": "${data.tag}" (valid: ${UPDATE_TAGS.join(', ')})`)
  }
  if (typeof data.summary !== 'string' || !data.summary) {
    errors.push('missing or invalid "summary"')
  }

  if (errors.length > 0) {
    throw new Error(`Invalid frontmatter in ${filePath}: ${errors.join('; ')}`)
  }

  return data as unknown as RawFrontmatter
}
```

### Pattern 4: "use cache" for Build-Time Caching
**What:** Apply the `"use cache"` directive to the `getUpdates()` function so results are cached at build time.
**When to use:** Required by UPD-04.
**Critical prerequisite:** Must enable `cacheComponents: true` in `next.config.ts`.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/directives/use-cache
import { cacheLife } from 'next/cache'

export async function getUpdates(): Promise<UpdateEntry[]> {
  'use cache'
  cacheLife('days')  // Content updated infrequently

  const files = await fs.readdir(UPDATES_DIR)
  const entries = await Promise.all(
    files.filter(f => f.endsWith('.md')).map(parseUpdateFile)
  )

  // Sort newest-first by date string (YYYY-MM sorts lexicographically)
  return entries.sort((a, b) => b.date.localeCompare(a.date))
}
```

### Pattern 5: File-Based Content with fs/promises
**What:** Read .md files from the filesystem using Node.js `fs/promises` in server-only code.
**When to use:** Always for file-based content in Next.js server components.
**Example:**
```typescript
import 'server-only'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const UPDATES_DIR = join(process.cwd(), 'src', 'content', 'updates')

async function parseUpdateFile(filename: string): Promise<UpdateEntry> {
  const filePath = join(UPDATES_DIR, filename)
  const raw = await readFile(filePath, 'utf-8')
  // ... parse with gray-matter + unified
}
```

### Anti-Patterns to Avoid
- **Importing markdown utilities in client components:** This ships gray-matter + unified to the browser. Use `server-only` import to enforce.
- **Using `processSync` in async contexts:** `unified().process()` is async and returns a Promise. `processSync` blocks the event loop. Use `await process()`.
- **Storing dates as Date objects:** Per STATE.md, use `YYYY-MM` strings only. Date objects cause timezone bugs and hydration mismatches.
- **Parsing frontmatter with remark-frontmatter plugin:** Unnecessary complexity when gray-matter already handles it before unified sees the content.
- **Using `fs.readdirSync` / `fs.readFileSync`:** Blocks the event loop. Use `fs/promises` for async operations.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML frontmatter parsing | Custom regex/split on `---` | gray-matter | Handles edge cases (multi-line values, escaping, empty frontmatter, BOM) |
| Markdown to HTML | Custom regex replacements | unified + remark-parse + remark-rehype + rehype-stringify | Markdown spec is deceptively complex (nested lists, reference links, autolinks, etc.) |
| HTML sanitization | Manual string escaping | rehype-sanitize (if needed) | XSS prevention has too many edge cases |
| Content caching | Custom Map/LRU cache | `"use cache"` directive | Framework-integrated, handles invalidation, works with ISR |

**Key insight:** Markdown parsing looks trivial ("just split on `---` and replace `**` with `<strong>`") but the CommonMark spec has hundreds of edge cases. gray-matter + unified handle all of them.

## Common Pitfalls

### Pitfall 1: Forgetting `cacheComponents: true` in next.config.ts
**What goes wrong:** `"use cache"` directive silently does nothing or throws a build error.
**Why it happens:** `"use cache"` is a Cache Components feature that must be explicitly opted into in Next.js 16.
**How to avoid:** Add `cacheComponents: true` to `next.config.ts` as the very first step.
**Warning signs:** Build warnings about unrecognized directive, or content re-parsing on every request.

### Pitfall 2: gray-matter `data` typed as `{ [key: string]: any }`
**What goes wrong:** No type safety on frontmatter fields -- `any` types propagate through the codebase.
**Why it happens:** gray-matter's `data` property is typed as `{ [key: string]: any }` by default.
**How to avoid:** Validate immediately after parsing and cast to a known interface. Never pass `data` directly without validation.
**Warning signs:** `any` types appearing in UpdateEntry consumers.

### Pitfall 3: `process.cwd()` path resolution in production
**What goes wrong:** File paths work in dev but break in production builds.
**Why it happens:** `process.cwd()` returns the project root in dev but may differ in production depending on deployment.
**How to avoid:** Use `process.cwd()` (standard for Next.js) and verify the content directory is included in the build output. For static content read at build time with `"use cache"`, this is handled by the caching layer.
**Warning signs:** "ENOENT: no such file or directory" errors in production.

### Pitfall 4: ESM Import Issues with unified Ecosystem
**What goes wrong:** Build errors like "Cannot require() ES Module" or "ERR_REQUIRE_ESM".
**Why it happens:** unified v11+ and all remark/rehype plugins are ESM-only. If tsconfig or bundler tries to use CommonJS require, it fails.
**How to avoid:** The project already uses `"module": "esnext"` in tsconfig.json and Next.js 16 handles ESM natively. This should not be an issue, but be aware.
**Warning signs:** Build errors mentioning ESM/CJS incompatibility.

### Pitfall 5: Date Sorting with String Comparison
**What goes wrong:** Entries sort incorrectly if date format is inconsistent.
**Why it happens:** `"YYYY-MM"` string comparison works correctly for lexicographic sort ONLY if format is consistent (zero-padded months).
**How to avoid:** Validate date format strictly in frontmatter validation (`/^\d{4}-\d{2}$/`). The regex ensures zero-padded months.
**Warning signs:** January entries (01) appearing after September (09) entries would indicate non-padded months.

## Code Examples

### Complete UpdateEntry Interface
```typescript
// Source: Project conventions (types/project.ts pattern) + STATE.md decisions

export const UPDATE_TAGS = [
  'project-launch',
  'design-thinking',
  'business',
  'community',
  'learning',
] as const

export type UpdateTag = (typeof UPDATE_TAGS)[number]

export interface UpdateEntry {
  /** URL-friendly identifier derived from filename */
  slug: string
  /** Display title */
  title: string
  /** Month+year only, format: "YYYY-MM" */
  date: string
  /** Single tag from fixed vocabulary */
  tag: UpdateTag
  /** Short summary for card display */
  summary: string
  /** Rendered HTML body from markdown */
  body: string
}
```

### Complete getUpdates() Implementation Pattern
```typescript
// Source: Next.js 16 "use cache" docs + gray-matter + unified
import 'server-only'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { cacheLife } from 'next/cache'

const UPDATES_DIR = join(process.cwd(), 'src', 'content', 'updates')

export async function getUpdates(): Promise<UpdateEntry[]> {
  'use cache'
  cacheLife('days')

  const filenames = await readdir(UPDATES_DIR)
  const mdFiles = filenames.filter(f => f.endsWith('.md'))

  const entries = await Promise.all(mdFiles.map(async (filename) => {
    const slug = filename.replace(/\.md$/, '')
    const raw = await readFile(join(UPDATES_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)

    // Validate frontmatter (throws on invalid)
    const frontmatter = validateFrontmatter(data, filename)

    // Render markdown body to HTML
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(content)

    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      tag: frontmatter.tag as UpdateTag,
      summary: frontmatter.summary,
      body: String(result),
    }
  }))

  // Sort newest-first (YYYY-MM string comparison works for this)
  return entries.sort((a, b) => b.date.localeCompare(a.date))
}
```

### Sample Markdown Entry
```markdown
---
title: "Codex Grove Launches in Beta"
date: "2025-06"
tag: "project-launch"
summary: "After months of development, Codex Grove enters public beta with AI-powered documentation and Kanban task management."
---

The journey from concept to beta has been an exercise in scope discipline. What started as a simple document organizer evolved into a full knowledge management platform.

Building the AI assistant required balancing response quality with latency. The hybrid search approach -- combining semantic embeddings with keyword matching -- gave us the best of both worlds.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| contentlayer | gray-matter + unified (or Velite/Fumadocs) | 2024 (contentlayer abandoned) | Must use alternatives; gray-matter+unified is the most stable |
| `unstable_cache` | `"use cache"` directive | Next.js 16 (stable) | No more unstable_ prefix; directive-based instead of wrapper function |
| `getStaticProps` | Server components + `"use cache"` | Next.js 13+ (App Router) | File reading happens directly in server component/utility code |
| unified v10 (CJS) | unified v11 (ESM-only) | 2023 | Must use ESM imports; no more require() |

**Deprecated/outdated:**
- `contentlayer`: Unmaintained since 2024, do not use
- `next/legacy/image`: Replaced by `next/image`
- `unstable_cache()`: Replaced by `"use cache"` directive in Next.js 16
- `getStaticProps` / `getServerSideProps`: Replaced by server components in App Router

## Open Questions

1. **rehype-sanitize: needed or not?**
   - What we know: Content files are author-controlled (committed to repo), not user-generated
   - What's unclear: Whether defense-in-depth sanitization is worth the extra dependency
   - Recommendation: Skip for now. Add later if content sources expand beyond repo-committed files.

2. **Locale support for updates?**
   - What we know: The project has i18n (en/fr). Update entries are plain markdown without locale variants.
   - What's unclear: Whether updates should eventually be bilingual
   - Recommendation: Phase scope says single-language. If needed later, use `src/content/updates/en/` and `src/content/updates/fr/` directories. Keep the interface locale-agnostic for now.

3. **Slug derivation: filename vs frontmatter?**
   - What we know: Some systems use a `slug` frontmatter field, others derive from filename
   - What's unclear: Which approach the project prefers
   - Recommendation: Derive from filename (simpler, no duplication). Filename `2025-06-codex-grove-launch.md` becomes slug `2025-06-codex-grove-launch`. No slug field needed in frontmatter.

## Sources

### Primary (HIGH confidence)
- [Next.js 16 "use cache" directive documentation](https://nextjs.org/docs/app/api-reference/directives/use-cache) - Full API, requirements, code examples (v16.1.6, updated 2026-02-16)
- [Next.js 16 cacheLife documentation](https://nextjs.org/docs/app/api-reference/functions/cacheLife) - Preset profiles, custom profiles, configuration (v16.1.6, updated 2026-02-16)
- [gray-matter GitHub README](https://github.com/jonschlinkert/gray-matter) - API, TypeScript types, v4.0.3
- [unified GitHub README](https://github.com/unifiedjs/unified) - Pipeline API, v11.0.5
- npm registry version checks (gray-matter 4.0.3, unified 11.0.5, remark-parse 11.0.0, remark-rehype 11.1.2, rehype-stringify 10.0.1)

### Secondary (MEDIUM confidence)
- [Ondrej Sevcik: Building Perfect Markdown Processor](https://ondrejsevcik.com/blog/building-perfect-markdown-processor-for-my-blog) - Real-world unified pipeline patterns and plugin selection
- Existing project codebase patterns (`types/project.ts`, `data/projects.ts`) - Conventions for types, validation, const assertions

### Tertiary (LOW confidence)
- None. All findings verified with primary or secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via npm registry, official docs, and GitHub READMEs
- Architecture: HIGH - Patterns derived from official Next.js 16 docs and existing project conventions
- Pitfalls: HIGH - Based on official documentation constraints (cacheComponents requirement) and known ESM/TypeScript patterns

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (30 days -- stable libraries, stable Next.js 16 APIs)
