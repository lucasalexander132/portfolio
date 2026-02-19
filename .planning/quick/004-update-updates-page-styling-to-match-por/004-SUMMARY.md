---
phase: quick-004
plan: 01
subsystem: updates-page
tags: [styling, layout, framed-card, tailwind]
requires: [phase-13]
provides: [updates-page-visual-parity]
affects: []
tech-stack:
  added: []
  patterns: [framed-card-layout-reuse]
key-files:
  created: []
  modified:
    - src/app/updates/layout.tsx
    - src/components/updates/UpdatesPageContent.tsx
    - src/components/updates/NowSection.tsx
    - src/components/updates/TagFilter.tsx
    - src/components/updates/TagChip.tsx
    - src/components/updates/EntryListItem.tsx
    - messages/en.json
    - messages/fr.json
decisions:
  - id: q004-d1
    description: "Removed per-tag TAG_STYLES color system in favor of uniform amber"
    rationale: "Design spec calls for all tags to be solid amber -- simplifies TagChip and TagFilter"
metrics:
  duration: "1.4 min"
  completed: "2026-02-19"
---

# Quick Task 004: Update Updates Page Styling Summary

**One-liner:** Framed card layout with amber NOW pill badge, uniform amber tag chips, and content reorder matching homepage design spec.

## What Was Done

### Task 1: Framed card layout + content reorder + translations
- Replaced `min-h-screen bg-base-900` layout with homepage's `fixed inset-0 p-3` framed card pattern
- Added "CIVIX SOLUTIONS" brand bar centered in sandy cream frame
- Navigation inside dark rounded card, Footer in cream scroll area
- Reordered UpdatesPageContent: heading (48px) -> NowSection -> "Recent Updates" sub-header with entry count -> TagFilter -> EntryStream
- Added `updates.stream.title` and `updates.stream.entries` translation keys in en.json and fr.json

### Task 2: Restyle NowSection, TagFilter, TagChip, EntryListItem
- NowSection: darker `bg-[#1E2230]` card with amber NOW pill badge (`bg-amber-500`), date moved to header row right side, hydration-safe MONTHS array replacing `toLocaleDateString`
- TagFilter: chips enlarged to `h-8 px-4 rounded-full text-sm`, solid amber (`bg-[#D4A843]`) active state, uniform `border-[#3D424D]` inactive state
- TagChip: removed `TAG_STYLES` per-tag color record entirely, all chips now solid amber `bg-[#D4A843] text-[#161921]`
- EntryListItem: summary text bumped from `text-sm` (14px) to `text-[15px]`

## Deviations from Plan

None -- plan executed exactly as written.

## Commits

| Hash | Message |
|------|---------|
| dcf3fcc | feat(quick-004): framed card layout + content reorder + translations |
| b1bd44e | feat(quick-004): restyle NowSection, TagFilter, TagChip, EntryListItem |

## Verification

- TypeScript: `npx tsc --noEmit` passes with zero errors
- No remaining references to removed `TAG_STYLES` export
- All 8 files updated per design spec
