---
phase: 12-tag-filtering
plan: 01
subsystem: ui
tags: [next.js, react, searchParams, useSearchParams, url-state, filtering]

# Dependency graph
requires:
  - phase: 11-entry-display
    provides: EntryStreamContainer, EntryListItem, TagChip, updates page shell
provides:
  - TagFilter client component for URL-based tag filtering
  - Client-side filtering of update entries by tag
  - Shared lib/tags.ts module for client-safe tag constants
  - i18n keys for filter UI (en/fr)
affects: [13-navigation-integration]

# Tech tracking
tech-stack:
  added: []
  patterns: [URL search params for client-side filtering, shared module extraction for server-only workaround]

key-files:
  created:
    - src/components/updates/TagFilter.tsx
    - src/lib/tags.ts
  modified:
    - src/app/updates/page.tsx
    - src/components/updates/UpdatesPageContent.tsx
    - src/components/updates/TagChip.tsx
    - src/lib/updates.ts
    - messages/en.json
    - messages/fr.json

key-decisions:
  - "Extracted UPDATE_TAGS/UpdateTag to shared lib/tags.ts to avoid server-only import in client components"
  - "Client-side filtering via useSearchParams instead of server-side searchParams to preserve static rendering"
  - "Suspense boundary at page.tsx level wrapping UpdatesPageContent for useSearchParams support"

patterns-established:
  - "Shared constants pattern: server-only modules re-export from client-safe modules"
  - "URL state pattern: useSearchParams for filterable views with shareable URLs"

# Metrics
duration: 3min
completed: 2026-02-19
---

# Phase 12 Plan 01: Tag Filtering Summary

**TagFilter component with URL-based ?tag param filtering, client-side entry filtering via useSearchParams, and animation replay on filter change**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-19T20:06:57Z
- **Completed:** 2026-02-19T20:10:23Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- TagFilter client component renders clickable tag pills with active/inactive styling
- Filtering stored in URL as ?tag=X for shareable, bookmarkable filtered views
- Animation replays when filter changes via React key prop on EntryStreamContainer
- Empty state shown when no entries match the active tag
- i18n support for filter labels in English and French

## Task Commits

Each task was committed atomically:

1. **Task 1: Create TagFilter component and add i18n keys** - `ab6719e` (feat)
2. **Task 2: Wire filtering into page.tsx and UpdatesPageContent** - `fdffccb` (feat)

## Files Created/Modified
- `src/components/updates/TagFilter.tsx` - Client component for tag URL param manipulation
- `src/lib/tags.ts` - Shared tag constants accessible from both server and client
- `src/lib/updates.ts` - Re-exports tag constants from shared module
- `src/app/updates/page.tsx` - Wraps UpdatesPageContent in Suspense for useSearchParams
- `src/components/updates/UpdatesPageContent.tsx` - Reads searchParams client-side, filters entries, renders TagFilter
- `src/components/updates/TagChip.tsx` - Updated import to use shared tags module
- `messages/en.json` - Added updates.filter.* keys
- `messages/fr.json` - Added updates.filter.* keys

## Decisions Made
- **Extracted tag constants to lib/tags.ts**: `updates.ts` has `import 'server-only'` which prevents client components from importing runtime values. Created `lib/tags.ts` without server-only restriction; `updates.ts` re-exports for backward compatibility.
- **Client-side filtering instead of server-side searchParams**: Using `await searchParams` in page.tsx made the page dynamic, breaking static prerendering. Moved filtering to client-side via `useSearchParams` in UpdatesPageContent, preserving the static build.
- **Suspense at page level**: Since UpdatesPageContent now uses `useSearchParams`, wrapped it in `<Suspense>` in page.tsx to satisfy Next.js App Router requirements.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Extracted tag constants to shared lib/tags.ts**
- **Found during:** Task 1 verification (build failed)
- **Issue:** TagFilter.tsx (client component) imported `UPDATE_TAGS` from `@/lib/updates` which has `import 'server-only'`, causing build failure
- **Fix:** Created `src/lib/tags.ts` with tag constants, updated `updates.ts` to re-export, updated TagFilter and TagChip to import from `@/lib/tags`
- **Files modified:** src/lib/tags.ts (created), src/lib/updates.ts, src/components/updates/TagFilter.tsx, src/components/updates/TagChip.tsx
- **Verification:** `npx tsc --noEmit` and `npx next build` both pass
- **Committed in:** fdffccb (Task 2 commit)

**2. [Rule 3 - Blocking] Moved filtering from server-side to client-side**
- **Found during:** Task 2 verification (build failed)
- **Issue:** Using `await searchParams` in page.tsx made the page dynamic, triggering "Uncached data outside Suspense" build error
- **Fix:** Kept page.tsx static by passing all entries; moved filtering to UpdatesPageContent client component via useSearchParams
- **Files modified:** src/app/updates/page.tsx, src/components/updates/UpdatesPageContent.tsx
- **Verification:** Build passes, page renders as static with 1d revalidation
- **Committed in:** fdffccb (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes necessary to resolve server-only and static rendering constraints. Filtering behavior identical to plan -- just executed client-side instead of server-side. No scope creep.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Tag filtering fully functional and build-verified
- Ready for Phase 13 (Navigation Integration)
- No blockers or concerns

---
*Phase: 12-tag-filtering*
*Completed: 2026-02-19*
