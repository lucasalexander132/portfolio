---
phase: 09-content-infrastructure
plan: 01
subsystem: content
tags: [gray-matter, unified, remark, rehype, markdown, typescript, caching]

# Dependency graph
requires:
  - phase: 08-content-migration
    provides: existing Next.js 16 project with TypeScript strict mode
provides:
  - UpdateEntry type and UpdateTag union for typed markdown entries
  - getUpdates() async function with build-time caching
  - parseUpdate() for individual entry parsing
  - Validated frontmatter extraction with descriptive error messages
affects: [09-02-seed-content, 10-page-shell, 11-entry-display, 12-tag-filtering]

# Tech tracking
tech-stack:
  added: [gray-matter, unified, remark-parse, remark-rehype, rehype-stringify, server-only]
  patterns: [server-only markdown pipeline, const-array-derived union types, "use cache" with cacheLife]

key-files:
  created: [src/lib/updates.ts]
  modified: [next.config.ts, package.json]

key-decisions:
  - "Tag validation uses UPDATE_TAGS const array with includes() check -- no type casting"
  - "Slug derived from full filename (strip .md only) -- no date prefix stripping"
  - "Promise.all for parallel file reading -- all entries parsed concurrently"

patterns-established:
  - "server-only import guard: prevents accidental client-side import of fs-dependent modules"
  - "const-array-to-union pattern: UPDATE_TAGS as const with typeof derivation for compile-time tag safety"
  - "use cache + cacheLife('days'): build-time caching for content that changes infrequently"

# Metrics
duration: 1min
completed: 2026-02-19
---

# Phase 9 Plan 01: Content Infrastructure Summary

**Typed markdown pipeline with gray-matter frontmatter extraction, unified remark/rehype HTML rendering, and build-time caching via "use cache" directive**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-19T14:55:36Z
- **Completed:** 2026-02-19T14:56:42Z
- **Tasks:** 1
- **Files modified:** 4

## Accomplishments
- Built typed markdown content pipeline in src/lib/updates.ts with full frontmatter validation
- Established UpdateTag union type derived from const array for compile-time tag enforcement
- Configured "use cache" directive support with cacheComponents: true in next.config.ts
- Installed 6 dependencies: gray-matter, unified, remark-parse, remark-rehype, rehype-stringify, server-only

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and create typed markdown pipeline** - `7f06f2c` (feat)

## Files Created/Modified
- `src/lib/updates.ts` - Typed markdown pipeline with UpdateEntry, UpdateTag, getUpdates(), parseUpdate(), validateFrontmatter()
- `next.config.ts` - Added cacheComponents: true for "use cache" directive support
- `package.json` - Added 6 new dependencies for markdown processing
- `package-lock.json` - Lockfile updated with new dependency tree

## Decisions Made
- Tag validation uses `(UPDATE_TAGS as readonly string[]).includes()` for type-safe narrowing without casting
- Slug is derived from the full filename minus `.md` extension (no date prefix stripping)
- All file reads are parallel via `Promise.all` for performance
- `server-only` import prevents accidental client-side usage of the fs-dependent module

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Pipeline is ready to process markdown files; Plan 09-02 will create seed content in `src/content/updates/`
- No blockers

---
*Phase: 09-content-infrastructure*
*Completed: 2026-02-19*
