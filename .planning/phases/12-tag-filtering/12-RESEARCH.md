# Phase 12: Tag Filtering - Research

**Researched:** 2026-02-19
**Domain:** Next.js App Router URL search params filtering, React 19 Suspense
**Confidence:** HIGH

## Summary

Phase 12 adds tag-based filtering to the `/updates` page using URL search params (`?tag=X`). The implementation is well-constrained: the tag vocabulary already exists (`UPDATE_TAGS` in `src/lib/updates.ts`), the `TagChip` component exists, and the updates page already fetches all entries server-side. The core work is: (1) read `searchParams` on the server page, (2) filter entries, (3) build a `TagFilter` client component that toggles URL params, and (4) wrap it in `<Suspense>` to avoid hydration errors.

This is a standard Next.js App Router pattern with no exotic requirements. The existing architecture (server page + client `UpdatesPageContent`) needs minor restructuring: filtering should happen server-side (in the page component) before passing entries to the client, and a new `TagFilter` client component handles the interactive URL manipulation.

**Primary recommendation:** Filter server-side in `page.tsx` using the async `searchParams` prop; build a thin `TagFilter` client component that uses `useSearchParams()` + `useRouter()` for navigation; wrap in `<Suspense>`.

## Standard Stack

### Core (already installed)
| Library | Purpose | Why Standard |
|---------|---------|--------------|
| Next.js 16 App Router | `searchParams` prop (async), `useSearchParams()` | Built-in URL param handling |
| React 19.2 | `<Suspense>` boundary | Required for `useSearchParams()` in App Router |
| next/navigation | `useSearchParams()`, `useRouter()`, `usePathname()` | Standard client-side URL manipulation |

### No additional libraries needed
This phase requires zero new dependencies. Everything is built into Next.js and React.

## Architecture Patterns

### Pattern 1: Server-Side Filtering via Async searchParams

The `/updates/page.tsx` server component receives `searchParams` as an async prop. Filter entries before passing to client components.

```typescript
// src/app/updates/page.tsx
interface PageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function UpdatesPage({ searchParams }: PageProps) {
  const { tag } = await searchParams
  const allEntries = await getUpdates()

  // Validate tag against known vocabulary
  const activeTag = tag && UPDATE_TAGS.includes(tag as UpdateTag)
    ? (tag as UpdateTag)
    : null

  const entries = activeTag
    ? allEntries.filter(e => e.tag === activeTag)
    : allEntries

  return <UpdatesPageContent now={getNow()} entries={entries} activeTag={activeTag} />
}
```

**Why server-side:** Entries are already fetched server-side with `'use cache'`. Filtering a small array in the server component is trivial and means the client receives only the entries it needs. The requirement says "server-rendered" explicitly (UPD-06).

### Pattern 2: TagFilter Client Component with useSearchParams

```typescript
// src/components/updates/TagFilter.tsx
'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { UPDATE_TAGS, type UpdateTag } from '@/lib/updates'

export default function TagFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeTag = searchParams.get('tag')

  function handleTagClick(tag: UpdateTag) {
    const params = new URLSearchParams(searchParams.toString())
    if (activeTag === tag) {
      params.delete('tag')  // Toggle off
    } else {
      params.set('tag', tag)  // Toggle on
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div role="group" aria-label="Filter by tag">
      {UPDATE_TAGS.map(tag => (
        <button key={tag} onClick={() => handleTagClick(tag)}
          aria-pressed={activeTag === tag}>
          {/* Reuse TagChip styling or extend it */}
        </button>
      ))}
    </div>
  )
}
```

### Pattern 3: Suspense Boundary (MANDATORY)

`useSearchParams()` in App Router MUST be wrapped in `<Suspense>`. Without it, the entire page tree up to the nearest Suspense boundary will opt into client-side rendering, causing hydration errors in production.

```typescript
// In UpdatesPageContent or directly in the page layout
import { Suspense } from 'react'
import TagFilter from './TagFilter'

<Suspense fallback={<TagFilterSkeleton />}>
  <TagFilter />
</Suspense>
```

The Suspense fallback should be a static skeleton matching the TagFilter dimensions to prevent layout shift.

### Pattern 4: Active Tag Styling

The existing `TAG_STYLES` map in `TagChip.tsx` has outlined (border) styles for most tags and filled style for `project-launch`. The active/selected state should be visually distinct -- invert the pattern: filled background when active, outlined when inactive.

### Recommended File Changes

```
src/
├── app/updates/page.tsx           # MODIFY: add searchParams, filter, pass activeTag
├── components/updates/
│   ├── UpdatesPageContent.tsx     # MODIFY: accept activeTag prop, render TagFilter
│   ├── TagFilter.tsx              # NEW: client component for tag URL manipulation
│   ├── TagChip.tsx                # MODIFY: add interactive variant (button vs span)
│   └── EntryStreamContainer.tsx   # NO CHANGE (receives pre-filtered entries)
└── lib/updates.ts                 # NO CHANGE (tags + types already defined)
```

### Anti-Patterns to Avoid

- **Client-side filtering with useState:** Do NOT store active tag in React state. The requirement explicitly says URL search params for shareability. Client state would break bookmarking/sharing.
- **Calling getUpdates() with a tag parameter:** Don't modify the cached `getUpdates()` function. It fetches all entries once (cached). Filter after fetch -- the dataset is tiny (4 entries currently, unlikely to exceed 50-100 ever).
- **Direct window.location manipulation:** Use Next.js `useRouter().push()` which integrates with the App Router's soft navigation and preserves client-side state.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL param reading (server) | Manual URL parsing | `searchParams` prop (async) | Built into App Router page components |
| URL param reading (client) | `window.location.search` | `useSearchParams()` from `next/navigation` | Reactive, SSR-safe, integrates with router |
| URL param writing | `window.history.pushState` | `router.push()` from `next/navigation` | Soft navigation, no full page reload |
| Tag validation | Manual string checking | Check against `UPDATE_TAGS` const array | Already defined, type-safe |

## Common Pitfalls

### Pitfall 1: Missing Suspense Boundary
**What goes wrong:** `useSearchParams()` without `<Suspense>` causes the nearest parent Suspense boundary (or the root) to fall back during SSR, potentially showing a blank page flash or hydration mismatch.
**Why it happens:** App Router static rendering doesn't know search params at build time.
**How to avoid:** Always wrap components using `useSearchParams()` in an explicit `<Suspense>` with a meaningful fallback.
**Warning signs:** Console warning about missing Suspense boundary; full-page flash on navigation.

### Pitfall 2: Forgetting to await searchParams
**What goes wrong:** In Next.js 16, `searchParams` is a Promise. Accessing `.tag` without `await` returns undefined.
**Why it happens:** Changed from sync to async in Next.js 15+.
**How to avoid:** Always `const { tag } = await searchParams` in server components.
**Warning signs:** Tag filter appears to never activate even with `?tag=X` in URL.

### Pitfall 3: Invalid Tag in URL
**What goes wrong:** User manually types `?tag=invalid` -- if not validated, no entries match and the page shows empty with no explanation.
**How to avoid:** Validate against `UPDATE_TAGS` array. If invalid, treat as no filter (show all entries). Optionally show a subtle "unknown tag" indicator.

### Pitfall 4: Animation Replay on Filter Change
**What goes wrong:** `EntryStreamContainer` uses stagger animations with `initial="hidden"`. When entries change due to filtering, animations may not replay (Motion caches animation state by component identity).
**Why it happens:** The `m.div` container persists across re-renders.
**How to avoid:** Add a `key` prop to `EntryStreamContainer` or `m.div` that changes with `activeTag`, forcing React to remount and replay animations: `<EntryStreamContainer key={activeTag ?? 'all'} entries={entries} />`.

### Pitfall 5: TagChip in EntryListItem Becoming Clickable Conflict
**What goes wrong:** TagChip appears inside EntryListItem (which is wrapped in a Link to the detail page). Making TagChip a filter button creates nested interactive elements (button inside link).
**How to avoid:** The TagFilter component is SEPARATE from the TagChip in EntryListItem. The TagFilter bar at the top of the page has its own clickable tag buttons. The TagChip inside each entry card remains a non-interactive display element.

## Code Examples

### Server Page with searchParams (Next.js 16 pattern)
```typescript
// Verified pattern: async searchParams in Next.js 16 App Router
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const tag = typeof params.tag === 'string' ? params.tag : undefined
  // ... use tag
}
```

### useSearchParams + router.push (toggle pattern)
```typescript
'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

function toggleParam(key: string, value: string) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const params = new URLSearchParams(searchParams.toString())
  if (params.get(key) === value) {
    params.delete(key)
  } else {
    params.set(key, value)
  }
  const qs = params.toString()
  router.push(qs ? `${pathname}?${qs}` : pathname)
}
```

### Suspense Wrapper
```typescript
import { Suspense } from 'react'

// Skeleton should match TagFilter dimensions
function TagFilterSkeleton() {
  return (
    <div className="flex gap-2 mb-6" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-7 w-20 rounded-full bg-base-800 animate-pulse" />
      ))}
    </div>
  )
}

// Usage in parent
<Suspense fallback={<TagFilterSkeleton />}>
  <TagFilter />
</Suspense>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `searchParams` sync prop | `searchParams` async prop (Promise) | Next.js 15 | Must `await` in server components |
| Custom Suspense optional | `useSearchParams()` requires Suspense | Next.js 13.4+ | Mandatory `<Suspense>` wrapper |
| `router.push('/path?q=x')` | Same, but with `useSearchParams()` for reading | Stable | Standard pattern |

## Open Questions

1. **Empty state UX when filtering**
   - What we know: With only 4 entries and 4 different tags, filtering will always show exactly 0 or 1 entries
   - What's unclear: Should there be an "empty state" message when a tag has no entries? How should it look?
   - Recommendation: Add a simple "No entries with this tag" message. As more entries are added, this becomes less of an issue.

2. **TagFilter placement**
   - What we know: It goes above the entry stream, below the NowSection
   - What's unclear: Exact spacing, alignment, whether it should have a label ("Filter by:")
   - Recommendation: Place between NowSection and EntryStreamContainer with consistent spacing. A subtle "Filter by" label or just showing the tag buttons is both acceptable.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/lib/updates.ts`, `src/app/updates/page.tsx`, all components in `src/components/updates/`
- Next.js App Router searchParams pattern: verified from project's existing use of async params (`await props.params` pattern already established in codebase)
- React 19 Suspense: stable API, well-documented requirement for `useSearchParams()`

### Secondary (MEDIUM confidence)
- Motion animation replay behavior with key prop: based on standard React reconciliation + Motion library behavior

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - zero new dependencies, all built-in Next.js/React
- Architecture: HIGH - standard App Router searchParams pattern, codebase already follows this style
- Pitfalls: HIGH - well-known Next.js App Router gotchas, verified against codebase specifics
- Code examples: HIGH - patterns derived from existing codebase conventions

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (stable patterns, no fast-moving dependencies)
