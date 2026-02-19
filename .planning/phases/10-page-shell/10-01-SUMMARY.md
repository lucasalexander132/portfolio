---
phase: 10-page-shell
plan: 01
subsystem: data-layer
tags: [now-section, i18n, gray-matter, server-only]
requires: [09-content-infrastructure]
provides: [getNow-utility, updates-translation-keys]
affects: [10-02-page-shell]
tech-stack:
  added: []
  patterns: [frontmatter-data-file, sync-file-read]
key-files:
  created:
    - src/lib/now.ts
    - src/content/now.md
  modified:
    - messages/en.json
    - messages/fr.json
decisions: []
metrics:
  duration: "~1 min"
  completed: "2026-02-19"
---

# Phase 10 Plan 01: Data Layer Summary

getNow() utility with bilingual now.md frontmatter and updates page i18n keys in both locales.

## What Was Done

### Task 1: Create now.ts utility and now.md content file
- Created `src/content/now.md` with bilingual frontmatter: `focus_en`, `focus_fr`, `learning_en`, `learning_fr`, `updated`
- Created `src/lib/now.ts` exporting `NowEntry` interface and `getNow()` function
- Uses `server-only` import, synchronous `readFileSync`, and `gray-matter` -- matches `updates.ts` pattern
- Commit: `77059f4`

### Task 2: Add updates translation keys
- Added `updates` top-level key to both `messages/en.json` and `messages/fr.json`
- Keys: `pageTitle`, `now.focus`, `now.learning`, `now.lastUpdated`
- French strings use proper accented characters
- Commit: `10f4e4c`

## Deviations from Plan

None -- plan executed exactly as written.

## Verification

- `npx tsc --noEmit` passes with no errors after both tasks
- `getNow()` and `NowEntry` are exported from `src/lib/now.ts`
- `now.md` contains all 5 frontmatter fields
- Both locale files have matching `updates` key structure

## Next Phase Readiness

Plan 10-02 can now import `getNow()` from `@/lib/now` and use `t('updates.pageTitle')` etc. for page chrome. No blockers.
