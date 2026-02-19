# Phase 10: Page Shell - Research

**Researched:** 2026-02-19
**Domain:** Next.js App Router page shell (routing, metadata, i18n chrome, markdown "now" section)
**Confidence:** HIGH

## Summary

This phase creates the `/updates` route as the first inner page in the portfolio. The core challenge is composing a server component page that uses the existing client-side i18n system (React context) while providing proper SEO metadata. The solution is a thin server component page that exports `generateMetadata` for SEO (reading `now.md` server-side) and renders client components for all translated UI chrome.

The content pipeline (gray-matter + unified) built in Phase 9 is directly reusable for parsing `now.md`. The "now" section uses a bilingual frontmatter approach where both EN/FR content lives in a single file, selected at render time by the client based on locale.

**Primary recommendation:** Create `src/app/updates/page.tsx` as a server component that exports `generateMetadata` (reading `now.md` for dynamic description) and renders a client component `UpdatesPageContent` that handles all i18n-dependent UI. Parse `now.md` with the existing gray-matter pipeline. Add translation keys to `messages/en.json` and `messages/fr.json`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16.1.6 | Page routing, `generateMetadata`, server components | Already in use, provides SEO metadata API |
| gray-matter | 4.0.3 | Parse `now.md` frontmatter | Already installed from Phase 9 |
| React context (i18n) | N/A | Client-side locale switching | Already built in `src/lib/i18n.tsx` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| server-only | 0.0.1 | Guard server-only now.md parsing function | Already installed |
| Tailwind CSS 4 | ^4 | Page styling with CSS variables | Already configured |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Client component for i18n chrome | Server-side i18n (next-intl, etc.) | Would require rearchitecting the entire i18n system; not worth it for one page |
| `generateMetadata` with static EN | Dynamic locale-aware metadata via cookies/headers | The locale is client-state (no URL segment, no cookie); metadata will be EN-only at SSR, which is fine for SEO crawlers |
| Bilingual frontmatter in `now.md` | Separate `now.en.md` / `now.fr.md` | Single file is simpler and matches user decision |

**Installation:**
```bash
# No new packages needed. Everything is already installed.
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── updates/
│       └── page.tsx              # Server component: generateMetadata + renders client shell
├── components/
│   └── features/
│       └── updates/
│           ├── UpdatesPageContent.tsx  # Client component: i18n chrome, now section, entry stream placeholder
│           └── NowSection.tsx          # Client component: renders now data with locale awareness
├── content/
│   ├── now.md                    # Bilingual frontmatter for "now" section
│   └── updates/                  # Existing entry files
├── lib/
│   ├── updates.ts                # Existing getUpdates() pipeline
│   └── now.ts                    # getNow() — server function to parse now.md
└── messages/
    ├── en.json                   # Add updates.* keys
    └── fr.json                   # Add updates.* keys
```

### Pattern 1: Server Component Page with Client Component Shell
**What:** The page file (`page.tsx`) is a server component that fetches data and exports metadata, then passes data as props to a `'use client'` component that handles all interactive/i18n UI.
**When to use:** When you need server-side data fetching + metadata but the UI depends on client-side state (like locale context).
**Example:**
```typescript
// src/app/updates/page.tsx (SERVER component)
import type { Metadata } from 'next'
import { getNow } from '@/lib/now'
import { getUpdates } from '@/lib/updates'
import { UpdatesPageContent } from '@/components/features/updates/UpdatesPageContent'

export async function generateMetadata(): Promise<Metadata> {
  const now = await getNow()
  return {
    title: 'Updates | Civix Solutions',
    description: now.focus_en, // Always EN for SEO crawlers
    openGraph: {
      title: 'Updates | Civix Solutions',
      description: now.focus_en,
    },
  }
}

export default async function UpdatesPage() {
  const now = await getNow()
  const entries = await getUpdates()
  return <UpdatesPageContent now={now} entries={entries} />
}
```

### Pattern 2: Bilingual Frontmatter with Locale Selection
**What:** A single markdown file contains both EN and FR content in frontmatter fields suffixed with `_en`/`_fr`. The client component selects the correct field based on current locale.
**When to use:** When content is author-controlled, bilingual, and needs to be a single source of truth.
**Example:**
```typescript
// src/lib/now.ts
import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { cacheLife } from 'next/cache'

export interface NowData {
  focus_en: string
  focus_fr: string
  learning_en: string
  learning_fr: string
  updated: string  // YYYY-MM-DD or YYYY-MM
}

export async function getNow(): Promise<NowData> {
  'use cache'
  cacheLife('days')

  const raw = await readFile(
    join(process.cwd(), 'src', 'content', 'now.md'),
    'utf-8',
  )
  const { data } = matter(raw)
  // Validate required fields
  // Return typed NowData
  return data as NowData
}
```

```typescript
// In NowSection.tsx (client component)
const { locale } = useLocale()
const focus = locale === 'fr' ? now.focus_fr : now.focus_en
const learning = locale === 'fr' ? now.learning_fr : now.learning_en
```

### Pattern 3: Translation Key Extension
**What:** Add new keys to the existing `messages/en.json` and `messages/fr.json` files. The `TranslationKey` type auto-generates from the `en.json` structure.
**When to use:** For any new static UI text.
**Example:**
```json
// messages/en.json (additions)
{
  "updates": {
    "title": "Updates",
    "now_focus_label": "Current focus",
    "now_learning_label": "Learning",
    "now_updated_label": "Last updated"
  }
}
```
```json
// messages/fr.json (additions)
{
  "updates": {
    "title": "Mises \u00e0 jour",
    "now_focus_label": "Focus actuel",
    "now_learning_label": "En apprentissage",
    "now_updated_label": "Derni\u00e8re mise \u00e0 jour"
  }
}
```

### Anti-Patterns to Avoid
- **Making the entire page a client component:** Loses `generateMetadata` SEO capability. The page file itself must remain a server component.
- **Trying to read locale in `generateMetadata`:** The locale is purely client-side state (React context). There is no URL segment, cookie, or header carrying it. Accept that metadata is EN-only for crawlers.
- **Parsing `now.md` inside the client component:** File system access (`fs`) is server-only. Parse on the server, pass as props.
- **Creating a new layout.tsx for `/updates`:** Not needed. The root layout already provides `LocaleProvider`, `MotionProvider`, and `CursorProvider`. A nested layout would only be needed if the page required a different layout structure.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Frontmatter parsing | Custom YAML parser | `gray-matter` | Already installed, handles edge cases |
| SEO metadata | Manual `<head>` tags | `generateMetadata` / `Metadata` export | Next.js handles deduplication, merging with layout metadata, streaming |
| Translation key types | Manual union type | Existing `NestedKeyOf` utility type in `src/types/i18n.d.ts` | Auto-generates from `en.json` structure |
| Reading column width | Custom container component | Tailwind `max-w-3xl` (768px) or custom `max-w-[750px]` | Simple utility class achieves the 700-800px target |

**Key insight:** Nearly everything needed is already built. The page shell is an assembly task, not a building-from-scratch task.

## Common Pitfalls

### Pitfall 1: Metadata Not Appearing Because Page Is Client Component
**What goes wrong:** Exporting `metadata` or `generateMetadata` from a `'use client'` file silently fails -- Next.js ignores metadata exports from client components.
**Why it happens:** The page file accidentally gets `'use client'` at the top, or the metadata is exported from a barrel file that re-exports client components.
**How to avoid:** Keep `page.tsx` as a server component (no `'use client'` directive). Move all interactive UI into a separate client component imported by the page.
**Warning signs:** View page source shows no `<title>` or `<meta description>` specific to the updates page.

### Pitfall 2: Hydration Mismatch from Locale-Dependent Content
**What goes wrong:** Server renders EN content, client hydrates with FR (if browser is French), causing React hydration warnings.
**Why it happens:** The `LocaleProvider` starts with `'en'` default and switches to FR in `useEffect` after mount. Any content that differs between locales will flash.
**How to avoid:** This is already handled by the existing i18n pattern (all locale-dependent content is in client components behind `useEffect`). The server always renders EN. This is acceptable and consistent with the existing site behavior.
**Warning signs:** Console hydration warnings mentioning text content mismatch.

### Pitfall 3: `now.md` Not Found at Build Time
**What goes wrong:** Build fails because `src/content/now.md` doesn't exist when `generateMetadata` runs.
**Why it happens:** The file was never created, or the path is wrong.
**How to avoid:** Create `now.md` as part of this phase. Add a try/catch with a sensible fallback in `getNow()`.
**Warning signs:** Build error: `ENOENT: no such file or directory`.

### Pitfall 4: `now.md` Frontmatter Fields Missing or Misnamed
**What goes wrong:** Runtime error or empty content rendered because frontmatter field names don't match what the code expects.
**Why it happens:** Typo in field names, or confusion between `focus_en` vs `focusEn` naming.
**How to avoid:** Use validation in `getNow()` similar to the `validateFrontmatter` pattern in `src/lib/updates.ts`. Document the exact field names in `now.md` itself.
**Warning signs:** Empty strings or error messages where focus/learning content should be.

### Pitfall 5: Homepage Layout Styles Leaking Into Updates Page
**What goes wrong:** The updates page inherits the homepage's `fixed inset-0` layout and round-cornered card container, making it look broken.
**Why it happens:** The homepage (`src/app/page.tsx`) uses a unique "framed card" layout with `fixed inset-0 p-3`. This is page-specific, not in a shared layout.
**How to avoid:** The updates page simply doesn't use those classes. Since the homepage layout is in `page.tsx` (not `layout.tsx`), it won't leak. The root `layout.tsx` only provides body + providers.
**Warning signs:** Updates page appears squished into a card with rounded corners.

## Code Examples

### Complete `now.md` Template
```markdown
---
focus_en: "Building a bilingual updates feed for my portfolio — server components, i18n, and a content pipeline that makes publishing effortless."
focus_fr: "Construction d'un fil de mises a jour bilingue pour mon portfolio — composants serveur, i18n, et un pipeline de contenu qui rend la publication sans effort."
learning_en: "Deep-diving into Rust for CLI tooling and exploring the edges of React Server Components."
learning_fr: "Plongee approfondie dans Rust pour les outils CLI et exploration des limites des React Server Components."
updated: "2026-02"
---
```
Note: The body of `now.md` is not rendered (only frontmatter is used). The body can contain notes or be empty.

### `generateMetadata` with Dynamic Description from `now.md`
```typescript
// Source: Next.js 16 Metadata API (verified from node_modules types)
import type { Metadata } from 'next'
import { getNow } from '@/lib/now'

export async function generateMetadata(): Promise<Metadata> {
  const now = await getNow()
  const description = `Currently focused on: ${now.focus_en}`

  return {
    title: 'Updates | Civix Solutions',
    description,
    openGraph: {
      title: 'Updates | Civix Solutions',
      description,
      type: 'website',
    },
  }
}
```

### NowSection Client Component Skeleton
```typescript
'use client'

import { useLocale, useTranslations } from '@/lib/i18n'
import type { NowData } from '@/lib/now'

interface NowSectionProps {
  now: NowData
}

export function NowSection({ now }: NowSectionProps) {
  const { locale } = useLocale()
  const t = useTranslations()

  const focus = locale === 'fr' ? now.focus_fr : now.focus_en
  const learning = locale === 'fr' ? now.learning_fr : now.learning_en

  return (
    <section className="mb-12">
      <div className="space-y-6">
        <div>
          <h2 className="text-small font-sans font-semibold text-amber-500 uppercase tracking-wider mb-2">
            {t('updates.now_focus_label')}
          </h2>
          <p className="text-body text-text-primary leading-relaxed">
            {focus}
          </p>
        </div>

        <div>
          <h2 className="text-small font-sans font-semibold text-amber-500 uppercase tracking-wider mb-2">
            {t('updates.now_learning_label')}
          </h2>
          <p className="text-body text-text-primary leading-relaxed">
            {learning}
          </p>
        </div>

        <p className="text-small text-text-muted">
          {t('updates.now_updated_label')}: {now.updated}
        </p>
      </div>
    </section>
  )
}
```

### Entry Stream Placeholder (Discretion Area)
```typescript
// Minimal placeholder that renders actual data in a bare list
// Phase 11 replaces this with styled entry cards
{entries.map((entry) => (
  <article key={entry.slug} className="py-4 border-b border-base-800/30">
    <h3 className="font-serif text-h3 text-text-primary">{entry.title}</h3>
    <p className="text-small text-text-muted mt-1">{entry.date}</p>
    <p className="text-body text-text-secondary mt-2">{entry.summary}</p>
  </article>
))}
```

**Recommendation for entry stream placeholder:** Render a bare but functional list of entries (title + date + summary). This verifies the data pipeline works end-to-end and gives Phase 11 something concrete to style. An empty container would be less useful for verification.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `export const metadata` (static) | `generateMetadata` (async, dynamic) | Next.js 13.2+ | Enables reading `now.md` at build/request time for fresh descriptions |
| `unstable_cacheLife` | `cacheLife` (stable) | Next.js 15/16 | No `unstable_` prefix needed |
| `getStaticProps` / `getServerSideProps` | Server component + `"use cache"` | Next.js 13+ App Router | Data fetching is just `await` in server components |
| `next/head` for metadata | `generateMetadata` export | Next.js 13+ | Automatic dedup, streaming, template support |

**Deprecated/outdated:**
- `next/head`: Replaced by `Metadata` API in App Router
- `getStaticProps`/`getServerSideProps`: Replaced by server components
- `unstable_cacheLife`: Now stable as `cacheLife` (already used correctly in `src/lib/updates.ts`)

## Open Questions

1. **Navigation component reuse on the updates page**
   - What we know: The existing `Navigation` component is a floating bottom nav with `#services` and `#projects` anchor links. It uses `fixed` positioning and scroll-to-section behavior.
   - What's unclear: On the `/updates` page, those anchor links will be broken (no `#services` or `#projects` sections). Phase 13 adds the Updates nav link.
   - Recommendation: Include the `Navigation` component as-is for visual consistency (the decision says "reuses existing Nav component"). The broken anchor links are acceptable for now since Phase 13 will address navigation. The nav still provides the logo (scroll to top), contact button, and language switcher.

2. **Page layout structure vs homepage**
   - What we know: The homepage uses a unique "framed card" layout (`fixed inset-0 p-3`, rounded corners, scroll container). The updates page should NOT use this.
   - What's unclear: Whether the updates page should have its own visual container/chrome or just be a simple scrollable page.
   - Recommendation: Use a simple full-page scroll layout with a narrow content column (`max-w-3xl` centered, `px-6 py-12`). This aligns with the "narrow reading column" decision and avoids inheriting the homepage's complex layout. Include Navigation and Footer for continuity.

## Sources

### Primary (HIGH confidence)
- **Codebase inspection** - Read all existing files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/i18n.tsx`, `src/lib/updates.ts`, `messages/en.json`, `messages/fr.json`, `src/types/i18n.d.ts`, `next.config.ts`, `package.json`
- **Next.js 16 Metadata types** - Read `node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts` for `generateMetadata` signature and `Metadata` interface
- **Phase 9 Research** - `.planning/phases/09-content-infrastructure/09-RESEARCH.md` for gray-matter + unified pipeline patterns
- **Phase 10 Context** - `.planning/phases/10-page-shell/10-CONTEXT.md` for locked decisions

### Secondary (MEDIUM confidence)
- **Next.js App Router patterns** - Based on verified types in `node_modules` and existing working patterns in the codebase (e.g., `"use cache"` in `src/lib/updates.ts`)

### Tertiary (LOW confidence)
- None. All findings verified against codebase or type definitions.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and in use
- Architecture: HIGH - Pattern verified against existing codebase (client/server split, i18n context, metadata types)
- Pitfalls: HIGH - Identified from direct codebase analysis (layout leak, hydration, metadata export rules)

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (stable; no fast-moving dependencies)
