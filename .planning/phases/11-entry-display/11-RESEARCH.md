# Phase 11: Entry Display - Research

**Researched:** 2026-02-19
**Domain:** Markdown rendering, Motion animation, View Transitions, component architecture
**Confidence:** HIGH

## Summary

Phase 11 builds the entry display layer for `/updates`: list items in the entry stream, the `/updates/[slug]` detail page, and transitions between them. The codebase already has a working markdown pipeline (unified + remark-parse + remark-rehype + rehype-stringify) in `src/lib/updates.ts`, a Motion animation system with shared variants in `src/lib/motion.ts`, and a Phase 10 page shell with placeholder components. The main work involves: (1) replacing the stub `EntryStreamContainer` with styled list items and hover states, (2) creating the `[slug]` detail route with rich HTML styling, (3) adding syntax highlighting for code blocks, and (4) wiring up View Transitions for list-to-detail navigation.

Key gaps: no syntax highlighting library is installed, no `getUpdateBySlug()` function exists, IBM Plex Mono font is not loaded, the `link` field is not in the `UpdateEntry` type, and View Transitions have never been used in the codebase. None of these are blockers -- they are straightforward additions.

**Primary recommendation:** Extend the existing unified pipeline with rehype-pretty-code (backed by shiki) for syntax highlighting. Add IBM Plex Mono via `next/font/google`. Create a `getUpdateBySlug()` utility. Style the rendered HTML with a scoped prose CSS class rather than hand-wrapping every element.

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `unified` | 11.0.5 | Markdown processing pipeline | Already in `src/lib/updates.ts` |
| `remark-parse` | 11.0.0 | Parse markdown to AST | Already used |
| `remark-rehype` | 11.1.2 | Convert remark AST to rehype AST | Already used |
| `rehype-stringify` | 10.0.1 | Serialize rehype AST to HTML | Already used |
| `gray-matter` | 4.0.3 | Frontmatter parsing | Already used |
| `motion` | 12.30.0 | Animation (Motion v12, formerly Framer Motion) | Already installed, `m` component pattern used throughout |
| `lucide-react` | 0.563.0 | Icons | Already used for `ArrowUpRight`, `ExternalLink`, etc. |
| `next` | 16.1.6 | Framework | React 19.2 View Transitions supported |

### To Install
| Library | Purpose | Why |
|---------|---------|-----|
| `rehype-pretty-code` | Syntax highlighting in rendered HTML | Shiki-backed, works server-side with unified pipeline, produces pre-styled HTML |
| `shiki` | Syntax highlighting engine | Peer dependency of rehype-pretty-code |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `rehype-pretty-code` | `rehype-highlight` (hljs) | rehype-highlight is lighter but theme control is CSS-based, harder to match exact design colors. rehype-pretty-code with shiki gives fine-grained token-level styling via CSS variables. |
| `rehype-pretty-code` | Manual `<code>` CSS styling only | Would not get token-level syntax colors (amber for keywords, green for strings as specified in design). |

**Installation:**
```bash
npm install rehype-pretty-code shiki
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  lib/
    updates.ts              # Add getUpdateBySlug(), add link field to UpdateEntry
  app/
    updates/
      page.tsx             # Existing (Phase 10)
      [slug]/
        page.tsx           # NEW: Detail page (server component)
  components/
    updates/
      UpdatesPageContent.tsx   # Existing (Phase 10) - modify
      EntryStreamContainer.tsx # Existing stub - replace entirely
      EntryListItem.tsx        # NEW: Single entry in the stream
      TagChip.tsx              # NEW: Colored tag chip component
      EntryArticle.tsx         # NEW: Detail page article body + styling
      PostNavigation.tsx       # NEW: Prev/Next navigation
  app/
    globals.css              # Add .prose-updates styles for article body
```

### Pattern 1: Server-Side HTML Rendering + Client Display
**What:** Markdown is rendered to HTML on the server via `getUpdates()`/`getUpdateBySlug()`. Client components receive pre-rendered HTML string and render it. Styling is via scoped CSS classes.
**When to use:** This is the existing pattern -- `body: string` in `UpdateEntry` is already rendered HTML.
**Note:** The content is self-authored markdown files committed to the repository, not user-submitted content. The HTML is generated server-side from trusted source files.

### Pattern 2: Motion Stagger Animation (Existing Pattern)
**What:** Parent container uses `staggerContainerVariants`, children use `fadeUpVariants`. Both defined in `src/lib/motion.ts`.
**When to use:** Entry list items on page load.
**Example (from existing codebase):**
```typescript
// src/lib/motion.ts - EXISTING
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

// Usage in components (e.g., Footer.tsx, Services.tsx):
<m.div variants={staggerContainerVariants} initial="hidden" whileInView="visible">
  {items.map(item => (
    <m.div key={item.id} variants={fadeUpVariants}>...</m.div>
  ))}
</m.div>
```

### Pattern 3: Motion Provider Setup
**What:** The app uses `LazyMotion` with `domMax` features and `MotionConfig reducedMotion="user"`, wrapping the entire app in `src/app/layout.tsx`. Components use `m` (not `motion`) for tree-shakeable imports.
**Key detail:** Always use `m.div`, `m.article`, etc. -- never `motion.div`. The `m` import comes from `motion/react`.

### Pattern 4: View Transitions (React 19 + Next.js 16)
**What:** React 19.2 supports the View Transition API. Next.js 16 integrates it via `<Link>` with `viewTransition` prop or the `useViewTransition` hook.
**Status in codebase:** Not yet used anywhere. This will be the first implementation.
**Important:** `next/link` is not used anywhere in the current codebase (all navigation is anchor tags with scroll handlers on the homepage). The `/updates` pages will be the first to use `<Link>` from `next/link`.
**Approach:**
```typescript
import Link from 'next/link'

// In entry list items:
<Link href={`/updates/${entry.slug}`} viewTransition>
  {/* entry content */}
</Link>

// For back navigation on detail page:
<Link href="/updates" viewTransition>
  Back to Updates
</Link>
```

### Anti-Patterns to Avoid
- **Don't use `motion.div`:** The codebase uses `m.div` everywhere (tree-shakeable with `LazyMotion`). Using `motion.div` would bypass the lazy loading.
- **Don't parse markdown on the client:** The pipeline is server-only (enforced by `import 'server-only'` in `updates.ts`). Keep all markdown rendering server-side.
- **Don't use `@tailwindcss/typography` prose classes:** The design has very specific styling (exact colors, fonts, sizes). A custom `.prose-updates` class gives precise control.
- **Don't create a separate `summary` frontmatter field:** The CONTEXT.md specifies excerpts should be auto-truncated from the markdown body. However, the current `UpdateEntry` type already has a `summary` field that IS populated from frontmatter. Decision: use the existing `summary` field for list display (it's already there and validated). The "first N characters auto-truncated" approach from CONTEXT conflicts with what's built -- the `summary` field is required in `validateFrontmatter()`. Recommendation: use the existing `summary` field as-is rather than adding a second truncation mechanism.

## Key Codebase Facts

### UpdateEntry Type (src/lib/updates.ts)
```typescript
export interface UpdateEntry {
  slug: string       // derived from filename (strip .md)
  title: string
  date: string       // YYYY-MM format
  tag: UpdateTag
  summary: string    // from frontmatter - validated as required
  body: string       // rendered HTML from markdown body
}
```

**Gaps to fill:**
1. **No `link` field** -- Needs adding to the type, frontmatter parsing (optional field), and validation
2. **No `getUpdateBySlug()` function** -- Only `getUpdates()` exists (returns all). Need a function for the detail page.
3. **No prev/next helpers** -- Need to determine adjacent entries for post navigation

### Tag Vocabulary (src/lib/updates.ts)
```typescript
export const UPDATE_TAGS = [
  'project-launch',
  'design-thinking',
  'business',
  'community',
  'learning',
] as const
```
**Note:** The phase_context mentions `user-research` as a tag but it is NOT in `UPDATE_TAGS`. The actual CONTEXT.md file and the code agree on 5 tags. The tag chip color map should cover exactly these 5 tags.

### Fonts Available
| Font | CSS Variable | Loaded In | Usage |
|------|-------------|-----------|-------|
| Fraunces | `--font-fraunces` / `font-serif` | `src/app/layout.tsx` | Headings, serif text |
| Open Sans | `--font-open-sans` / `font-sans` | `src/app/layout.tsx` | Body text, sans-serif |
| Architects Daughter | `--font-sketch` | `src/app/layout.tsx` | Sketch/handwritten style |
| **IBM Plex Mono** | **NOT LOADED** | -- | **Needed for code blocks** |

**Action required:** Add `IBM_Plex_Mono` from `next/font/google` to `layout.tsx` with variable `--font-mono`.

### CSS Color Tokens (src/app/globals.css)
```
--color-base-950: oklch(0.18 0.015 250)   // darkest background
--color-base-900: oklch(0.22 0.015 250)   // card background
--color-base-800: oklch(0.30 0.012 250)   // borders, lighter bg
--color-base-700: oklch(0.40 0.010 250)   // subtle borders
--color-base-600: oklch(0.52 0.008 250)   // muted elements

--color-amber-600: oklch(0.68 0.16 70)
--color-amber-500: oklch(0.75 0.15 72)    // primary accent
--color-amber-400: oklch(0.82 0.13 74)
--color-amber-300: oklch(0.88 0.10 76)

--color-text-primary: oklch(0.92 0.022 80)   // cream white
--color-text-secondary: oklch(0.75 0.016 80)
--color-text-muted: oklch(0.58 0.010 250)
```

### Design Color Mapping
| Design Spec | CSS Token / Value |
|-------------|-------------------|
| Divider #2D3140 | Close to `--color-base-800` (oklch 0.30). Use `border-base-800` or a custom color |
| Cream background (hover) | `--color-text-primary` (oklch 0.92 0.022 80) -- this IS the cream |
| #C4B89A (paragraph text) | Close to `--color-text-secondary` (oklch 0.75 0.016 80) |
| #EDE5D4 (headings) | Close to `--color-text-primary` |
| #D4A843 (amber accent) | Close to `--color-amber-500` |
| #161921 (dark text on amber) | Close to `--color-base-950` |
| #0D0F14 (code block bg) | Darker than `--color-base-950`. Needs custom value |
| #1A1D26 (inline code bg) | Close to `--color-base-950` |
| Tag green #6B9E78 | Not in palette -- needs custom CSS |
| Tag purple #8B7CC8 | Not in palette -- needs custom CSS |

### Existing Page Shell Components (Phase 10)
- **`src/app/updates/page.tsx`** -- Server component, calls `getNow()` + `getUpdates()`, passes to `UpdatesPageContent`
- **`src/components/updates/UpdatesPageContent.tsx`** -- Client component, renders h1 + NowSection + EntryStreamContainer
- **`src/components/updates/EntryStreamContainer.tsx`** -- Stub. Just maps entries with title text. **Replace entirely.**
- **`src/components/updates/NowSection.tsx`** -- Complete. Uses amber accents, base-900 bg, base-800 border.

### Sample Markdown Content
4 files in `src/content/updates/`:
- `2025-06-codex-grove-launch.md` -- tag: project-launch, has link potential
- `2025-09-design-system-thinking.md` -- tag: design-thinking
- `2025-11-community-workshop.md` -- tag: community
- `2026-01-learning-rust.md` -- tag: learning

**Frontmatter structure (all 4 files):**
```yaml
title: "Codex Grove Launches in Beta"
date: "2025-06"
tag: "project-launch"
summary: "After months of development..."
```
**No `link` field in any file yet.** Will need to add to at least one for testing.

### Shadow Utilities (globals.css)
```css
.shadow-elevation-sm  { /* subtle white glow */ }
.shadow-elevation-md  { /* medium white glow */ }
.shadow-elevation-lg  { /* large white glow */ }
```
Also theme shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg` (dark tinted). The hover lift effect should use one of these or a custom shadow.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom regex-based highlighter | `rehype-pretty-code` + `shiki` | Hundreds of language grammars, theme support, edge cases in tokenization |
| Markdown to HTML | Custom parser | `unified` pipeline (already set up) | Battle-tested, extensible, handles edge cases |
| Copy-to-clipboard | Manual `document.execCommand` | `navigator.clipboard.writeText()` | Modern API, supported in all target browsers, Promise-based |
| Text truncation for excerpts | Character slicing with word boundary logic | Use the existing `summary` field from frontmatter | Already validated and populated; avoids stripping markdown syntax mid-token |
| Tag chip color mapping | Inline ternary chains | Lookup object keyed by `UpdateTag` | Type-safe, single source of truth, easy to extend |

**Key insight:** The existing `summary` field in frontmatter provides curated excerpts. Auto-truncating the raw markdown body would require stripping markdown syntax, handling word boundaries, and dealing with code blocks. The `summary` field is already required by `validateFrontmatter()` and populated in all 4 content files.

## Common Pitfalls

### Pitfall 1: Motion `m` vs `motion` Import
**What goes wrong:** Using `motion.div` instead of `m.div` bypasses the `LazyMotion` setup and increases bundle size.
**Why it happens:** Claude's training data and Motion docs both default to `motion.div`.
**How to avoid:** Always import `m` from `motion/react`. The project enforces this via `LazyMotion` in `MotionProvider`.
**Warning signs:** TypeScript won't error -- it's a bundle size issue only.

### Pitfall 2: View Transitions Browser Support
**What goes wrong:** View Transitions are not supported in all browsers (Firefox has partial support as of early 2026).
**Why it happens:** The API is relatively new.
**How to avoid:** View Transitions are progressive enhancement -- they gracefully degrade to instant navigation. The Next.js `<Link viewTransition>` prop handles this automatically.
**Warning signs:** None needed -- fallback is standard navigation.

### Pitfall 3: Hydration Mismatch with Date Formatting
**What goes wrong:** Server and client render different date strings.
**Why it happens:** `toLocaleDateString()` can produce different output on server vs client.
**How to avoid:** The dates are YYYY-MM strings. Format them deterministically (e.g., static month name lookup) rather than using `toLocaleDateString()`. The `NowSection` already uses `toLocaleDateString` but passes a fixed locale -- follow the same pattern or use a static formatter.
**Warning signs:** React hydration warnings in console.

### Pitfall 4: Shiki Bundle Size
**What goes wrong:** Shiki bundles all language grammars, inflating the server bundle.
**Why it happens:** Default shiki import includes everything.
**How to avoid:** Since this runs server-side only, bundle size impact is on build time, not client. However, you can configure `rehype-pretty-code` to load only needed languages. For a portfolio with occasional code snippets, the default is fine.
**Warning signs:** Slow build times (unlikely with 4 markdown files).

### Pitfall 5: Async Params in Next.js 16
**What goes wrong:** Accessing `params.slug` without `await`.
**Why it happens:** Next.js 16 made all params async.
**How to avoid:** Always `const { slug } = await params` in page components.
**Warning signs:** TypeScript error if properly typed.

### Pitfall 6: Hover Color Inversion Complexity
**What goes wrong:** Trying to animate color changes with Motion instead of CSS transitions.
**Why it happens:** Motion is used for y-translation and shadow, so it seems natural to animate colors too.
**How to avoid:** Use Tailwind's `group-hover:` utilities for text color changes (e.g., `group-hover:text-base-900`). CSS transitions are smoother and simpler for color changes. Use Motion only for the y-lift and shadow effects.
**Warning signs:** Janky color transitions, flash of wrong color.

## Code Examples

### Tag Chip Color Map
```typescript
// Typed lookup for tag chip styling
const TAG_STYLES: Record<UpdateTag, { bg: string; text: string; border: string }> = {
  'project-launch': {
    bg: 'bg-[#D4A843]',
    text: 'text-[#161921]',
    border: 'border-transparent',
  },
  'design-thinking': {
    bg: 'bg-transparent',
    text: 'text-[#8B7CC8]',
    border: 'border-[#8B7CC8]',
  },
  'business': {
    bg: 'bg-transparent',
    text: 'text-[#5B8FA1]', // teal-blue accent - complements palette
    border: 'border-[#5B8FA1]',
  },
  'community': {
    bg: 'bg-transparent',
    text: 'text-[#6B9E78]',
    border: 'border-[#6B9E78]',
  },
  'learning': {
    bg: 'bg-transparent',
    text: 'text-[#D4A843]',
    border: 'border-[#D4A843]',
  },
}
```

### getUpdateBySlug Pattern
```typescript
export async function getUpdateBySlug(slug: string): Promise<UpdateEntry | null> {
  'use cache'
  cacheLife('days')

  const dir = join(process.cwd(), 'src', 'content', 'updates')
  const filename = `${slug}.md`

  try {
    const raw = await readFile(join(dir, filename), 'utf-8')
    return parseUpdate(filename, raw)
  } catch {
    return null
  }
}
```

### Adjacent Entry Navigation
```typescript
export async function getAdjacentEntries(slug: string): Promise<{
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}> {
  const entries = await getUpdates() // already sorted newest-first
  const index = entries.findIndex(e => e.slug === slug)

  return {
    prev: index > 0 ? { slug: entries[index - 1].slug, title: entries[index - 1].title } : null,
    next: index < entries.length - 1 ? { slug: entries[index + 1].slug, title: entries[index + 1].title } : null,
  }
}
```

### Detail Page Route (src/app/updates/[slug]/page.tsx)
```typescript
import { notFound } from 'next/navigation'
import { getUpdateBySlug, getUpdates, getAdjacentEntries } from '@/lib/updates'

export async function generateStaticParams() {
  const entries = await getUpdates()
  return entries.map(e => ({ slug: e.slug }))
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = await getUpdateBySlug(slug)
  if (!entry) notFound()

  const adjacent = await getAdjacentEntries(slug)

  return <EntryArticle entry={entry} adjacent={adjacent} />
}
```

### rehype-pretty-code Integration
```typescript
import rehypePrettyCode from 'rehype-pretty-code'

const result = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypePrettyCode, {
    theme: {
      dark: 'github-dark',  // or define a custom theme
    },
    keepBackground: true,
  })
  .use(rehypeStringify)
  .process(content)
```

### Hover Lift Effect (Entry List Item)
```typescript
<m.article
  className="group relative py-7 border-b border-[#2D3140] cursor-pointer"
  whileHover={{
    y: -2,
    backgroundColor: 'oklch(0.92 0.022 80)', // cream
    boxShadow: '0 8px 24px oklch(0.08 0.015 250 / 0.15)',
    transition: { duration: 0.15 },
  }}
>
  {/* On hover, text colors invert via group-hover: classes */}
  <p className="text-text-muted group-hover:text-base-800 transition-colors">
    ...
  </p>
</m.article>
```

### IBM Plex Mono Font Addition
```typescript
// In src/app/layout.tsx
import { IBM_Plex_Mono } from 'next/font/google'

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// Add to className:
className={`${fraunces.variable} ${openSans.variable} ${architectsDaughter.variable} ${ibmPlexMono.variable}`}
```

```css
/* In globals.css @theme block */
--font-mono: var(--font-ibm-plex-mono), ui-monospace, monospace;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (v12) | 2024 | Import path is `motion/react`, not `framer-motion` |
| `motion.div` | `m.div` with `LazyMotion` | Already adopted | Smaller bundles, tree-shaking |
| `middleware.ts` | `proxy.ts` in Next.js 16 | Next 16 | Not relevant to this phase |
| Sync params | Async params (`await params`) | Next 15+ | Must await in page components |

## Open Questions

1. **rehype-pretty-code compatibility with unified v11**
   - What we know: rehype-pretty-code works with the rehype ecosystem. The project uses unified 11, remark-parse 11, remark-rehype 11, rehype-stringify 10.
   - What's unclear: Exact version compatibility. Need to verify during install.
   - Recommendation: Install and test. If incompatible, fall back to `rehype-highlight` or plain CSS styling for code blocks.

2. **View Transition exact API in Next.js 16.1.6**
   - What we know: React 19 supports View Transitions. Next.js 16 has a `viewTransition` prop on `<Link>`.
   - What's unclear: Whether `viewTransition` is stable or experimental in 16.1.6 specifically.
   - Recommendation: Implement with `<Link viewTransition>`. If it's not available, fall back to standard `<Link>` -- the transition is progressive enhancement.

3. **summary vs auto-truncation conflict**
   - What we know: CONTEXT.md says "first N characters auto-truncated from the markdown body -- no separate summary frontmatter field needed." But `UpdateEntry` already has a required `summary` field populated from frontmatter.
   - What's unclear: Whether to remove the summary field or keep it.
   - Recommendation: Keep the existing `summary` field. It's already validated, all content files have it, and it provides better quality excerpts than auto-truncation. The planner should note this deviation from the CONTEXT.md spec.

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `src/lib/updates.ts`, `src/lib/motion.ts`, `src/app/layout.tsx`, `src/app/globals.css`
- Codebase inspection: `src/components/updates/*.tsx`, `src/components/sections/Services.tsx`, `src/components/sections/Hero.tsx`
- Codebase inspection: `src/content/updates/*.md` (all 4 files)
- `package.json` -- exact versions of all installed dependencies

### Secondary (MEDIUM confidence)
- Motion v12 API (`motion/react`, `m` component, `LazyMotion`) -- verified from codebase usage patterns
- Next.js 16 async params -- verified from CLAUDE.md project instructions
- `rehype-pretty-code` as unified-compatible syntax highlighter -- well-established in ecosystem

### Tertiary (LOW confidence)
- `<Link viewTransition>` prop availability in Next.js 16.1.6 -- based on training knowledge, needs runtime verification
- `rehype-pretty-code` compatibility with unified v11 pipeline -- likely fine but untested

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all core libraries verified from package.json and codebase
- Architecture: HIGH -- patterns extracted directly from existing components
- Pitfalls: HIGH -- common issues identified from codebase conventions
- Syntax highlighting: MEDIUM -- library recommendation based on ecosystem knowledge, untested in this pipeline
- View Transitions: MEDIUM -- API exists in React 19/Next 16 but not yet used in codebase

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (stable domain, minimal churn expected)
