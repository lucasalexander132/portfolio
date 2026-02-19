---
phase: quick-006
plan: 01
subsystem: i18n-content
tags: [i18n, french, markdown, updates, locale]
dependency-graph:
  requires: [06-translation-infrastructure, 08-content-migration, 11-entry-display]
  provides: [french-update-entries, locale-aware-entry-rendering]
  affects: [future-update-entries]
tech-stack:
  added: []
  patterns: [companion-file-pattern, locale-aware-rendering]
file-tracking:
  key-files:
    created:
      - src/content/updates/2026-02-design-to-code-gap.fr.md
      - src/content/updates/2026-02-one-hour-five-thousand-books.fr.md
    modified:
      - src/lib/updates.ts
      - src/components/updates/EntryListItem.tsx
      - src/components/updates/EntryArticle.tsx
      - .claude/skills/new-update/SKILL.md
decisions:
  - id: companion-file-convention
    description: "French translations use {slug}.fr.md companion files alongside English {slug}.md"
  - id: graceful-fallback
    description: "Missing .fr.md files fall back to English content silently"
  - id: MONTHS_FR-array
    description: "Static MONTHS_FR array for French date formatting (same pattern as English MONTHS)"
metrics:
  duration: "3 min"
  completed: "2026-02-19"
---

# Quick Task 006: Add French Translations to Update Entries Summary

French companion file pattern for bilingual update entries with locale-aware rendering in list and article views.

## What Was Done

### Task 1: Extend UpdateEntry type and loader (1eea1d7)
- Added optional `title_fr`, `summary_fr`, `body_fr` fields to `UpdateEntry` interface
- `parseUpdate()` now loads companion `.fr.md` files when they exist (try/catch for graceful fallback)
- Extracted `UPDATES_DIR` module-level constant and `markdownPipeline()` helper
- `.fr.md` files filtered from `getUpdates()` directory listing so they don't appear as standalone entries

### Task 2: French companion files and locale-aware components (0316266)
- Created full French translations for both update entries:
  - `2026-02-design-to-code-gap.fr.md` -- natural translation preserving conversational voice, Claude's Notes section, and Luke's Notes section
  - `2026-02-one-hour-five-thousand-books.fr.md` -- natural translation keeping French-origin terms (l'agrement, La Maison Des Feuilles, etc.) as-is
- `EntryListItem.tsx`: uses `useLocale()` for locale-aware title, summary, and date formatting (MONTHS_FR array)
- `EntryArticle.tsx`: uses `useLocale()` for locale-aware title, summary, body, date, back link text, and visit link text

### Task 3: Update new-update skill (9de3b83)
- Added Step 6 (French Translation) with clear instructions for generating companion files
- Updated Step 2 heading to note English-only initial creation
- Skill now prompts user to optionally generate French version after English entry is finalized

## Deviations from Plan

None -- plan executed exactly as written.

## Verification

- `npx tsc --noEmit` passes with no errors
- Both `.fr.md` companion files exist with valid frontmatter
- `.fr.md` files are excluded from `getUpdates()` results
- EntryListItem and EntryArticle both use `useLocale()` for content selection
- Graceful English fallback when no `.fr.md` exists (try/catch in parseUpdate)
- SKILL.md has Step 6 for French translation generation
