---
phase: 08-content-migration
plan: 01
subsystem: i18n
tags: [translations, french, utf-8, accents, hero]

# Dependency graph
requires:
  - phase: 06-translation-infrastructure
    provides: i18n context and useTranslations hook
  - phase: 07-language-switcher
    provides: language toggle UI
provides:
  - Hero section with full i18n support
  - French translations with proper UTF-8 accents
  - Contact form translations with proper accents
affects: [08-02, 08-03, future hero modifications]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Translation keys inside component scope for hook access"
    - "Emotional equivalence in French translations"

key-files:
  created: []
  modified:
    - messages/en.json
    - messages/fr.json
    - src/components/sections/Hero.tsx

key-decisions:
  - "hoverBubbles array moved inside component for t() access"
  - "French uses formal 'vous' throughout"
  - "Emotional equivalence over literal translation"

patterns-established:
  - "Translation key pattern: section.element.variant (e.g., hero.bubbles.experience)"
  - "French accent encoding: UTF-8 with proper accents (not ASCII approximations)"

# Metrics
duration: 2min
completed: 2026-02-03
---

# Phase 08 Plan 01: Hero Section Translations Summary

**Hero section i18n with French translations using proper UTF-8 accents, emotional equivalence for empathetic messaging**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-03T23:26:51Z
- **Completed:** 2026-02-03T23:28:31Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Expanded translation files with hero.cta, hero.bubbles.*, hero.cursor.* keys
- Fixed French accents throughout (hero.*, contact.*, services.*, projects.*, footer.*)
- Refactored Hero.tsx to consume translations via useTranslations hook
- French translations use emotional equivalence (not literal translation)

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand translation files with Hero keys and fix French accents** - `5641e0e` (feat)
2. **Task 2: Refactor Hero.tsx to use translations** - `2541a61` (feat)

## Files Created/Modified
- `messages/en.json` - Added hero.cta, hero.bubbles.*, hero.cursor.* keys
- `messages/fr.json` - Full French translations with proper UTF-8 accents
- `src/components/sections/Hero.tsx` - Uses useTranslations hook for all user-facing strings

## Decisions Made
- Moved hoverBubbles array inside component body (required for t() hook access)
- Used formal "vous" throughout French translations
- Translated with emotional equivalence: "Been burned" -> "Decu" (disappointed), "sales pitch" -> "baratin commercial"
- Fixed I18N-10: contact.success/error now use proper accents (bientot -> bientot, reessayer -> reessayer)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Hero section fully localized
- Translation key patterns established for remaining sections
- French accents now properly encoded throughout

---
*Phase: 08-content-migration*
*Completed: 2026-02-03*
