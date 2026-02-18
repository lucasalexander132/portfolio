# Architecture: /updates Page Integration

**Project:** Civix Solutions Portfolio - Live Updates Page
**Researched:** 2026-02-18
**Confidence:** HIGH (based on direct codebase analysis + Next.js 16 App Router patterns)

---

## Executive Summary

The existing portfolio is a single-page client-rendered app (`src/app/page.tsx` is `'use client'`) wrapped in a root layout that provides `LocaleProvider`, `MotionProvider`, and `CursorProvider` at the `<body>` level. Adding an `/updates` route is architecturally clean because any new route automatically inherits all providers -- zero layout changes needed.

The key architectural decisions are:

1. **Server/client boundary:** Markdown reading and parsing happens in a server-only utility. The page component is a server component. Only the tag filter and animated list are client components.
2. **Tag filtering via URL search params** (`?tag=engineering`) for shareable, bookmarkable, back-button-friendly filtering. With a small update count, all entries are passed to the client and filtered there for instant UX.
3. **Navigation adaptation:** The current Navigation component is tightly coupled to single-page scroll anchors. It needs route-aware behavior via `usePathname()`. This is the single most impactful change to existing code.
4. **Markdown stored in `src/content/updates/`** -- inside `src/` for path alias access, outside `app/` because they are data not routes.

---

## Current Architecture Map

```
src/
  app/
    layout.tsx          -- Root: fonts, LocaleProvider, MotionProvider, CursorProvider
    page.tsx            -- 'use client', single-page: Hero, Services, Projects, Footer
    globals.css         -- Tailwind 4 @theme, color tokens, grain textures
    api/contact/route.ts
  components/
    layout/
      Navigation.tsx    -- 'use client', fixed bottom nav, scroll-to-anchor, contact form
      Footer.tsx        -- 'use client', scroll-to-anchor links
      ContactForm.tsx
      LanguageSwitcher.tsx
    sections/           -- Hero, Services, Projects, ProjectCard, ProjectModal, etc.
    cursor/             -- CursorContext, CustomCursor
    motion/             -- MotionProvider, Typewriter
    ui/                 -- shadcn: button, dialog, input, textarea, label
  lib/
    i18n.tsx            -- LocaleProvider (React Context), useLocale(), useTranslations()
    motion.ts           -- Spring configs, animation variants
    utils.ts            -- cn() utility
  types/
    project.ts          -- Project discriminated union
    i18n.d.ts           -- TranslationKey type from en.json structure
  data/
    projects.ts         -- Static project data array
messages/
  en.json               -- English UI strings (flat dot-notation keys)
  fr.json               -- French UI strings
```

### Root Layout Provider Chain (Why No Layout Changes Are Needed)

```tsx
// src/app/layout.tsx -- ALL routes inherit these providers
<html className={fontVariables}>
  <body className="bg-base-950 text-text-primary">
    <LocaleProvider>        // i18n context (client component)
      <MotionProvider>      // motion/react LazyMotion (client component)
        <CursorProvider>    // custom cursor state (client component)
          <CustomCursor />
          {children}        // <-- /updates renders here automatically
        </CursorProvider>
      </MotionProvider>
    </LocaleProvider>
  </body>
</html>
```

The `/updates` page gets i18n (`useTranslations()`), motion (`m` components, `LazyMotion`), cursor (`useCursor()`), fonts (CSS variables), and the full Tailwind theme with zero additional wiring.

---

## New File Structure

```
NEW FILES:
  src/
    app/
      updates/
        page.tsx                        -- Server component: reads markdown, passes to client
    components/
      updates/
        UpdatesList.tsx                 -- Client component: animated list + client-side filter
        UpdateCard.tsx                  -- Presentational: single update entry card
        TagFilter.tsx                   -- Client component: tag buttons using searchParams
    lib/
      updates.ts                        -- Server-only: read/parse markdown, sort, type
    types/
      update.ts                         -- UpdateEntry frontmatter + parsed entry types
    content/
      updates/
        2026-02-18-first-update.md      -- Markdown files with YAML frontmatter

MODIFIED FILES:
  src/
    components/layout/
      Navigation.tsx                    -- Route-aware nav (usePathname conditional)
      Footer.tsx                        -- Add Updates link
  messages/
    en.json                             -- Add "updates" and "nav.updates" keys
    fr.json                             -- Add matching French keys
```

---

## Detailed Component Architecture

### 1. TypeScript Types (`src/types/update.ts`)

```typescript
export type UpdateTag =
  | 'engineering'
  | 'design'
  | 'project'
  | 'announcement'
  | 'personal'

export type UpdateType = 'note' | 'article' | 'changelog'

export interface UpdateFrontmatter {
  title: string
  date: string              // ISO: "2026-02-18"
  tags: UpdateTag[]
  type: UpdateType
  summary: string           // 1-2 sentences for card display
  published: boolean        // false = draft, excluded from list
}

export interface UpdateEntry extends UpdateFrontmatter {
  slug: string              // Derived from filename: "first-update"
  content: string           // Rendered HTML from markdown body
}
```

### 2. Markdown Content (`src/content/updates/*.md`)

```markdown
---
title: "Shipped new portfolio updates page"
date: "2026-02-18"
tags: ["engineering", "project"]
type: "note"
summary: "Added a live updates section to share what I'm working on."
published: true
---

Content body in markdown here...
```

**Filename convention:** `YYYY-MM-DD-slug-text.md`. The slug is derived by stripping the date prefix and `.md` extension.

**Why `src/content/updates/` not elsewhere:**
- Inside `src/` so the `@/content/updates/` path alias works
- Not in `public/` because files are read server-side, not served directly
- Not in `app/` because they are data, not routes
- Separate from `data/` which contains TypeScript modules

### 3. Server-Only Markdown Utility (`src/lib/updates.ts`)

```typescript
// src/lib/updates.ts
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
// unified pipeline for markdown -> HTML
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'
import type { UpdateEntry, UpdateFrontmatter } from '@/types/update'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/updates')

export async function getAllUpdates(): Promise<UpdateEntry[]> {
  const files = await fs.readdir(CONTENT_DIR)
  const mdFiles = files.filter(f => f.endsWith('.md'))

  const entries = await Promise.all(mdFiles.map(parseUpdateFile))

  return entries
    .filter(e => e.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getAllTags(): Promise<string[]> {
  const entries = await getAllUpdates()
  const tags = new Set(entries.flatMap(e => e.tags))
  return Array.from(tags).sort()
}

async function parseUpdateFile(filename: string): Promise<UpdateEntry> {
  const filePath = path.join(CONTENT_DIR, filename)
  const raw = await fs.readFile(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const frontmatter = data as UpdateFrontmatter

  const html = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(content)

  const slug = filename
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/\.md$/, '')

  return {
    ...frontmatter,
    slug,
    content: String(html),
  }
}
```

**Key decisions:**
- `node:fs/promises` is only available in server components/server-only modules
- `gray-matter` parses YAML frontmatter
- `unified` + `remark` + `rehype` converts markdown to sanitized HTML
- All processing is server-side; zero impact on client bundle

### 4. Page Component (`src/app/updates/page.tsx`)

```typescript
// Server component -- reads markdown, passes data to client components
"use cache"
import { cacheLife } from 'next/cache'
import { getAllUpdates, getAllTags } from '@/lib/updates'
import { UpdatesList } from '@/components/updates/UpdatesList'

export default async function UpdatesPage(
  props: { searchParams: Promise<{ tag?: string }> }
) {
  cacheLife("hours")

  const { tag } = await props.searchParams   // Next.js 16: async searchParams
  const entries = await getAllUpdates()
  const allTags = await getAllTags()

  return (
    <UpdatesList
      entries={entries}
      allTags={allTags}
      activeTag={tag}
    />
  )
}
```

**Next.js 16 specifics addressed:**
- `searchParams` is a `Promise` -- must `await` it
- `"use cache"` directive for opt-in caching (not automatic in Next.js 16)
- `cacheLife("hours")` for periodic revalidation

### 5. Client Components (`src/components/updates/`)

**UpdatesList.tsx** -- Receives all entries, filters client-side, renders animated list.

**TagFilter.tsx** -- Renders tag buttons. Uses `useRouter().push()` to update `?tag=X` search param. Wrapped in `<Suspense>` because `useSearchParams()` requires it in Next.js App Router.

**UpdateCard.tsx** -- Presentational card for a single update. Uses existing design system tokens (`bg-base-900`, `text-text-primary`, `font-serif`, etc.).

### Data Flow Diagram

```
src/content/updates/*.md  (filesystem)
         |
         v
src/lib/updates.ts  (server-only: fs.readFile + gray-matter + unified)
         |
         v
src/app/updates/page.tsx  (server component, "use cache")
  - await props.searchParams for active tag
  - getAllUpdates() returns UpdateEntry[]
  - getAllTags() returns string[]
         |
         v
<UpdatesList entries={...} allTags={...} activeTag={...} />  (client)
  |                    |
  v                    v
<TagFilter />       <UpdateCard /> x N
  (reads/writes        (presentational)
   ?tag= param)
```

---

## Integration Points With Existing Code

### Navigation.tsx -- MODIFIED (Most Impactful Change)

**Current behavior:** Fixed bottom nav with scroll-to-anchor links (`#services`, `#projects`). All navigation uses `e.preventDefault()` + `element.scrollIntoView()`.

**Problem:** On `/updates`, anchor targets (`#services`, `#projects`) do not exist.

**Recommended approach: Route-aware conditional rendering.**

```
Use usePathname() to detect current route:

On "/" (homepage):
  - Render current scroll-anchor nav items (unchanged behavior)
  - Optionally add "Updates" as a <Link> to /updates

On "/updates":
  - Render route links: [Home → /] [Updates → /updates] [Contact → opens form]
  - Use Next.js <Link> for actual navigation
  - Contact button stays the same (opens ContactForm overlay)
```

**Why this approach over alternatives:**
- **Option A (chosen): Conditional rendering via `usePathname()`** -- Homepage experience untouched, updates page gets appropriate nav. Small code change.
- Option B: Always show route-based nav -- Bigger visual change to the carefully crafted homepage.
- Option C: Separate Navigation component per route -- Duplicates code, harder to maintain.

**Implementation notes:**
- Import `usePathname` from `next/navigation`
- Import `Link` from `next/link`
- The `navItems` array becomes conditional based on pathname
- Contact button and LanguageSwitcher remain unchanged on both routes

### Footer.tsx -- MODIFIED (Minor)

Add "Updates" to the `quickLinks` array. The current `handleNavClick` already checks `href.startsWith('#')` and only does smooth scroll for anchor links. A `/updates` href will fall through to default behavior. However, since Footer is a client component, use `<Link>` from `next/link` for client-side navigation to avoid a full page reload.

**Change scope:** Add one entry to the `quickLinks` array, add a conditional render for `<Link>` vs `<a>` based on whether href starts with `#`.

### messages/en.json and messages/fr.json -- MODIFIED (Additive)

Add keys:

```json
{
  "nav": {
    "updates": "Updates"
  },
  "updates": {
    "title": "Updates",
    "subtitle": "What's happening at Civix Solutions",
    "filter_all": "All",
    "no_results": "No updates found for this filter.",
    "read_more": "Read more"
  }
}
```

The `TranslationKey` type in `src/types/i18n.d.ts` auto-generates from `en.json` via the `NestedKeyOf` utility type. Adding keys to `en.json` automatically makes them available to `t()` with full compile-time type safety. Just ensure `fr.json` gets matching keys.

### Files That Need NO Changes

| File | Why No Change |
|------|---------------|
| `src/app/layout.tsx` | Providers already wrap all routes |
| `src/app/page.tsx` | Homepage stays as-is |
| `src/lib/i18n.tsx` | Context works across all routes |
| `src/components/cursor/*` | Works automatically via root layout |
| `src/components/motion/*` | Works automatically via root layout |
| `src/app/globals.css` | Existing theme tokens cover updates page needs |
| `src/types/i18n.d.ts` | Auto-generates from en.json, no manual change |

---

## Tag Filtering: Recommended Approach

**Use URL search params for state, but filter client-side for speed.**

Rationale for URL params (not component state):
1. **Shareable URLs:** `/updates?tag=engineering` can be bookmarked
2. **Back button works:** Browser history tracks filter changes
3. **SSR-friendly:** Server can read params for initial render

Rationale for client-side filtering (not server-side):
1. **Update count will be small** (under 100 for a long time)
2. **Instant filter response** -- no server round-trip
3. **Simpler architecture** -- pass all entries once, filter in JS
4. **Switch to server-side later** if list grows large

**Pattern:**
- Server component passes ALL entries to `<UpdatesList>`
- `TagFilter` component uses `useSearchParams()` to read active tag and `useRouter().push()` to update it
- `UpdatesList` filters entries client-side based on active tag
- `<Suspense>` boundary wraps `TagFilter` (required by `useSearchParams()`)

---

## Static Generation vs Dynamic Rendering

**Use `"use cache"` with `cacheLife("hours")`.**

- Markdown files change infrequently (only when you publish an update)
- Reading filesystem on every request is wasteful
- Portfolio deploys on content changes anyway, so `cacheLife("max")` is also viable
- `"use cache"` is the Next.js 16 way (replaces the old `revalidate` export)

**Future: Individual update pages.** If you later add `/updates/[slug]` detail pages, use `generateStaticParams()` to pre-render each at build time:

```typescript
// src/app/updates/[slug]/page.tsx (future)
export async function generateStaticParams() {
  const entries = await getAllUpdates()
  return entries.map(e => ({ slug: e.slug }))
}
```

This is out of scope for the initial milestone but the architecture supports it cleanly.

---

## Markdown Processing: Library Recommendations

**`gray-matter` for frontmatter + `unified`/`remark`/`rehype` for body.**

| Library | Purpose | Why |
|---------|---------|-----|
| `gray-matter` | Parse YAML frontmatter | Stable, widely used, zero-config |
| `unified` | Processing pipeline | Extensible, composable |
| `remark-parse` | Parse markdown to AST | Part of unified ecosystem |
| `remark-rehype` | Convert markdown AST to HTML AST | Bridge between remark and rehype |
| `rehype-sanitize` | Sanitize HTML output | Security (habit, even for own content) |
| `rehype-stringify` | Serialize HTML AST to string | Final output step |

```bash
npm install gray-matter unified remark-parse remark-rehype rehype-stringify rehype-sanitize
```

All server-side only. Zero client bundle impact.

**Why NOT `next-mdx-remote` or MDX:**
- MDX lets you embed React components in markdown. Overkill for text-based updates.
- Adds complexity (serialization, component mapping, client-side hydration).
- Start simple. Add MDX later only if you need interactive elements inside posts.

---

## Component Boundaries Summary

| Component | Server/Client | Responsibility | Depends On |
|-----------|--------------|----------------|------------|
| `app/updates/page.tsx` | Server | Read markdown, pass data down | `lib/updates.ts` |
| `lib/updates.ts` | Server-only | Filesystem read, parse, sort | `content/updates/*.md`, `gray-matter`, `unified` |
| `UpdatesList` | Client | Animated list, client-side filtering | Receives `entries` prop, uses `useTranslations()` |
| `UpdateCard` | Client | Single update card presentation | Uses design system tokens, `useTranslations()` |
| `TagFilter` | Client | Tag buttons, URL param updates | `useSearchParams()`, `useRouter()` |
| `Navigation` | Client | Route-aware nav (modified) | `usePathname()`, `<Link>` (new imports) |
| `Footer` | Client | Add Updates link (modified) | `<Link>` (new import) |

---

## Suggested Build Order

Each phase builds on the previous. Phases are ordered to minimize risk and provide early visual feedback.

### Phase 1: Data Foundation (no visible changes)

1. Create `src/types/update.ts` -- TypeScript types
2. Create `src/content/updates/` directory with 2-3 sample `.md` files
3. Install `gray-matter` + `unified` ecosystem packages
4. Create `src/lib/updates.ts` -- server-only markdown reader

### Phase 2: Page Shell + i18n Keys

5. Add i18n keys to `messages/en.json` and `messages/fr.json`
6. Create `src/app/updates/page.tsx` -- server component with `"use cache"`
7. Verify: page renders raw data at `/updates`

### Phase 3: UI Components

8. Create `src/components/updates/UpdateCard.tsx` -- styled card
9. Create `src/components/updates/TagFilter.tsx` -- tag filter with searchParams
10. Create `src/components/updates/UpdatesList.tsx` -- list layout combining card + filter

### Phase 4: Navigation Integration (modifies existing code)

11. Modify `Navigation.tsx` -- route-aware behavior using `usePathname()`
12. Modify `Footer.tsx` -- add Updates link

### Phase 5: Polish

13. Add entry animations (Motion library, staggered card reveals)
14. Responsive design pass
15. Visual consistency check (grain texture, typography, spacing)

**Critical path:** Phase 1 must complete before Phase 2. Phase 2 before Phase 3. Phase 4 can run in parallel with Phase 3. Phase 5 depends on all prior phases.

---

## Anti-Patterns to Avoid

### Do NOT Create a Nested Layout for /updates

```
BAD:  src/app/updates/layout.tsx that re-wraps providers
GOOD: Let root layout handle everything; updates/page.tsx is just a page
```

A nested layout is only needed if `/updates` has a genuinely different shell (sidebar, different nav structure). It does not.

### Do NOT Make the Page Component a Client Component

```
BAD:  'use client' on page.tsx, useEffect to load markdown
GOOD: Server component reads filesystem, passes data as props to client children
```

### Do NOT Duplicate the i18n System for Content

```
BAD:  Separate markdown files per locale (en/first-update.md, fr/first-update.md)
GOOD: English-only markdown content; only UI chrome (title, labels) goes through t()
```

Update content stays English. Bilingual UI strings (page title, filter labels, "Read more") go through the existing `t()` function.

### Do NOT Use Dynamic Imports for Markdown

```
BAD:  import(`@/content/updates/${slug}.md`)
GOOD: fs.readFile() in a server-only module
```

Dynamic imports of non-JS files are fragile with bundlers. Use Node.js `fs` in server-only code.

---

## Breaking Changes / Migration Risks

| Change | Risk | Mitigation |
|--------|------|------------|
| Navigation behavior on homepage | LOW | `usePathname()` conditional; homepage nav stays identical |
| New npm dependencies | LOW | Server-only; no client bundle impact |
| i18n key additions | NONE | Additive; existing keys untouched |
| Root layout | NONE | No changes needed |
| CSS/theme | NONE | Existing tokens sufficient |

---

## Sources

- **Direct codebase analysis:** All files listed in architecture map were read and analyzed
- **Next.js 16 App Router:** Async `params`/`searchParams`, `"use cache"` directive, `cacheLife()` API -- HIGH confidence from official docs
- **gray-matter, unified ecosystem:** Stable Node.js libraries with years of production use -- HIGH confidence
- **URL search params pattern for filtering:** Standard Next.js App Router pattern documented in official guides -- HIGH confidence
