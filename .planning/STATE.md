# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-03)

**Core value:** Visitors must feel at ease — like they've found someone who genuinely cares about solving their problem.
**Current focus:** Milestone v1.1 - Internationalization (COMPLETE)

## Current Position

Phase: 8 - Content Migration (4 of 4 plans complete)
Plan: 4 of 4
Status: Phase complete - Milestone v1.1 complete
Last activity: 2026-02-03 — Completed 08-04-PLAN.md

Progress: [██████████████] 89% (17/19 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 17
- Average duration: 3.5 min
- Total execution time: 60.2 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 16 min | 8 min |
| 02-content | 2 | 5.5 min | 2.75 min |
| 03-projects | 2 | 10.7 min | 5.35 min |
| 04-animation | 4 | 9 min | 2.25 min |
| 06-translation-infrastructure | 2 | 2 min | 1 min |
| 07-language-switcher | 1 | 1 min | 1 min |
| 08-content-migration | 4 | 16 min | 4 min |

**Recent Trend:**
- Last 5 plans: 07-01 (1 min), 08-01 (2 min), 08-02 (3 min), 08-03 (6 min), 08-04 (5 min)
- Trend: Moderate (content migration required checkpoint feedback)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- **Fraunces + Open Sans pairing** - Serif headlines (craft feel) + humanist sans body (warm, approachable)
- **OKLCH colors** - Better perceptual uniformity, Tailwind CSS 4 default
- **Dark mode only** - Single deliberate "golden hour" mood
- **Static grain** - Animated grain deferred, static works well
- **Card-level grain texture** - Applied to individual cards rather than global overlay to prevent click-blocking
- **Paper texture JPG** - Real texture image instead of SVG noise for more natural grain
- **Client component for Nav** - Requires useState/useEffect for scroll detection
- **50px scroll threshold** - Enough scroll to indicate intent, not too sensitive
- **Discriminated union for projects** - LiveProject | ComingSoonProject with type guards for status-based rendering
- **Button component added** - Required shadcn/ui dependency for Dialog component
- **Modal size sm:max-w-6xl** - Wider modal for better gallery display on desktop
- **Gallery aspect-[21/9]** - Cinematic ratio for project screenshots
- **domMax features** - Full motion capability for advanced animations
- **reducedMotion: user** - Automatic OS preference respect for accessibility
- **Spring transitions** - springSubtle (400/30) and springSnappy (500/25) for physical feel
- **Typewriter cursor fade** - Cursor blinks during typing, then fades after 2s post-completion
- **Client component for Hero** - Needed for useState orchestration between animation phases
- **Services cards static** - Static content, not interactive (no hover state)
- **Scroll reveal at 25%** - useInView with once:true and amount:0.25 for scroll reveals
- **Inline expansion over modal** - Keeps user in scroll context, better UX
- **Height-then-content choreography** - Height animates first, content wipes in from right with delay
- **Drag momentum physics** - bounceStiffness: 300, bounceDamping: 30 for natural gallery drag
- **Nav position animation** - animate={{ bottom, top }} for repositioning from bottom to top when form opens
- **ContactForm as centered modal** - Cream background, slide-up from bottom (y: 100%), springSubtle, ~33% width desktop
- **Resend SDK** - Email delivery via Resend API, simple integration, generous free tier

### v1.1 Decisions

- **Custom React Context over i18n libraries** - Instant switching without page reload; ~50 lines vs heavy dependency
- **JSON translation files in /messages/** - Simple, type-safe, appropriate for ~60 strings
- **Browser language detection** - navigator.language on initial load, no persistence
- **ASCII-only French text initially** - Avoid encoding issues; proper accents added in Phase 8
- **LocaleProvider as outermost provider** - All components can access translations
- **Translation key fallback** - Returns key string if missing (visible bug indicator)
- **FR on top, EN on bottom** - Language button stacking per I18N-05 requirement
- **Rightmost navbar position** - Common UX pattern for language switcher placement
- **Translation key 'as const' pattern** - Type-safe translation key references
- **hoverBubbles inside component** - Translation hook only available in component body
- **Formal vous in French** - Professional tone for client-facing portfolio
- **Emotional equivalence translations** - Not literal; preserves tone and intent
- **Locale-keyed content pattern** - service.content[locale] for component-specific data
- **Export Locale type from i18n.tsx** - Enables data files to use Locale type in interfaces
- **ProjectLocale type in project.ts** - Avoids circular import between project.ts and i18n.tsx
- **Locale-keyed project content** - project.content[locale] pattern for translatable project data
- **Technical terms kept English in FR** - Kanban, OCR, FSRS, TypeScript as industry-standard terms
- **Contact form cursor translations** - Added contact.cursor.close and contact.cursor.submit for hover states
- **Emotional French equivalents for contact** - "Oh, vraiment ?" and "C'est parti !" for cursor hover text

### Pending Todos

- Delete unused ProjectCard.tsx and ProjectModal.tsx in polish phase (marked as deprecated)

### Blockers/Concerns

None.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 001 | Slide-in contact form from nav bar | 2026-02-03 | 807445e | [001-slide-in-contact-form-from-nav-bar](./quick/001-slide-in-contact-form-from-nav-bar/) |
| 002 | Contact form styling refinements | 2026-02-03 | f1a5eba | [002-contact-form-styling-refinements](./quick/002-contact-form-styling-refinements/) |
| 003 | Implement Resend for email form | 2026-02-03 | f328e2a | [003-implement-resend-for-email-form](./quick/003-implement-resend-for-email-form/) |

## Session Continuity

Last session: 2026-02-03
Stopped at: Completed 08-04-PLAN.md — Footer and ContactForm localization (Milestone v1.1 complete)
Resume file: None
