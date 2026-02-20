---
phase: quick-007
plan: 01
subsystem: ui
tags: [scroll-indicator, headings, intersection, updates]

requires:
  - phase: 11-entry-display
    provides: EntryArticle component with prose-updates container
provides:
  - ScrollProgressIndicator component for article section navigation
affects: []

tech-stack:
  added: []
  patterns:
    - "DOM heading extraction with slugified IDs for scroll targeting"
    - "Scroll tracking on layout scroll container (not window)"

key-files:
  created:
    - src/components/updates/ScrollProgressIndicator.tsx
  modified:
    - src/components/updates/EntryArticle.tsx

key-decisions:
  - "Plain CSS transitions over Motion library for simple indicator bars"
  - "Fixed positioning with right-6 alignment for non-intrusive presence"
  - "Slugified heading text for ID generation (no external dependency)"

patterns-established:
  - "Scroll container reference via .updates-root > .overflow-y-auto selector"

duration: 1min
completed: 2026-02-20
---

# Quick 007: Scroll Progress Indicator Summary

**Right-side vertical scroll progress indicator with heading-level-aware bar widths and amber active section highlighting**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-20T02:35:51Z
- **Completed:** 2026-02-20T02:37:02Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- ScrollProgressIndicator extracts h2/h3 headings from prose-updates and renders right-aligned bars
- Bar width reflects heading level (h2 = 24px, h3 = 12px), active section in amber
- Click-to-scroll on any bar smoothly navigates to that section
- Hidden on mobile (lg+ breakpoint), returns null when no headings present

## Task Commits

1. **Task 1: Create ScrollProgressIndicator component** - `cb5a128` (feat)
2. **Task 2: Integrate into EntryArticle** - `12e27f2` (feat)

## Files Created/Modified
- `src/components/updates/ScrollProgressIndicator.tsx` - Client component: heading extraction, scroll tracking, indicator rendering
- `src/components/updates/EntryArticle.tsx` - Added ScrollProgressIndicator as sibling of main

## Decisions Made
- Used plain CSS transitions instead of Motion library -- sufficient for simple opacity/color changes, avoids bundle overhead
- Fixed position right-6 with top-1/2 centering -- stays visible without interfering with article content
- Slugify-based ID assignment on headings -- ensures scroll targets work even if markdown lacks explicit IDs

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None -- no external service configuration required.

## Next Phase Readiness
- Scroll indicator is self-contained and works on all update entry pages
- No blockers or concerns

---
*Phase: quick-007*
*Completed: 2026-02-20*
