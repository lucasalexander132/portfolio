---
phase: 06-translation-infrastructure
plan: 02
subsystem: i18n
tags: [react, context, hooks, i18n, browser-detection]

# Dependency graph
requires: [06-01]
provides:
  - LocaleProvider context component
  - useLocale hook for reading/setting language
  - useTranslations hook for type-safe t() function
  - Browser language detection on initial load
affects: [06-03, 07, 08]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - React Context for global state (following CursorContext pattern)
    - Browser navigator.language detection for locale preference
    - Dot-notation key traversal for nested translation lookup

key-files:
  created:
    - src/lib/i18n.tsx
  modified:
    - src/app/layout.tsx

key-decisions:
  - "LocaleProvider as outermost provider - all components can access translations"
  - "Fallback to key string if translation missing - visible bug indicator"
  - "Browser detection runs on mount only - no localStorage persistence yet"

patterns-established:
  - "useTranslations() returns t() function, useLocale() returns {locale, setLocale}"
  - "Context hooks throw descriptive errors when used outside provider"

# Metrics
duration: 1min
completed: 2026-02-03
---

# Phase 6 Plan 02: LocaleProvider and Hooks Summary

**React Context-based i18n with LocaleProvider, useLocale, useTranslations hooks and browser language detection**

## Performance

- **Duration:** 1 min (70 seconds)
- **Started:** 2026-02-03T22:19:37Z
- **Completed:** 2026-02-03T22:20:46Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created LocaleProvider component with locale state and translation function
- useLocale() returns current locale and setLocale function for language switching
- useTranslations() returns type-safe t() function with TranslationKey enforcement
- Browser language detection on mount (French if navigator.language starts with 'fr')
- Integrated LocaleProvider as outermost provider in app layout
- Provider nesting order: LocaleProvider > MotionProvider > CursorProvider

## Files Created/Modified

- `src/lib/i18n.tsx` - LocaleProvider, useLocale, useTranslations exports (79 lines)
- `src/app/layout.tsx` - Added LocaleProvider import and wrapped all content

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create LocaleProvider with type-safe translation function | f7b0fd6 | src/lib/i18n.tsx |
| 2 | Integrate LocaleProvider into app layout | 3cd8916 | src/app/layout.tsx |

## Key Implementation Details

**Translation Function (t):**
- Splits dot-notation key (e.g., "hero.title") into path segments
- Traverses nested messages object to find value
- Returns key string as fallback if path not found (visible debugging)
- useCallback with locale dependency ensures fresh function on language change

**Browser Detection:**
- Runs once on mount via useEffect with empty dependency array
- Checks navigator.language.split('-')[0] for base language code
- Sets locale to 'fr' if browser language is French
- English remains default for all other languages

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Phase 06-03 (Translation Integration) can now:
- Import useTranslations() hook from '@/lib/i18n'
- Call t('nav.services') etc. with full TypeScript autocomplete
- Use useLocale() to read current language or trigger language change

Phase 07 (Language Switcher) will:
- Use useLocale() to render language toggle
- Need to update html lang attribute dynamically
