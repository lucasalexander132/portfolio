# Roadmap: Civix Solutions Portfolio

## Milestones

- 🚧 **v1.0 MVP** - Phases 1-5 (in progress)
- ✅ **v1.1 Internationalization** - Phases 6-8 (complete)
- 📋 **v1.2 Live Updates** - Phases 9-13 (planned)

## Overview

This roadmap delivers a single-page portfolio for Civix Solutions that makes weary, skeptical visitors feel understood before impressed. v1.0 builds from visual foundation through content, case studies, animation, and contact experience. v1.1 adds French language support with instant client-side switching. v1.2 adds a live updates page at `/updates` -- a chronological activity stream that serves as a living resume, showing potential clients that Lucas is actively building, learning, and shipping.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

### v1.0 MVP

- [x] **Phase 1: Foundation** - Design system and visual infrastructure
- [x] **Phase 2: Content** - Hero and services with empathy-first messaging
- [x] **Phase 3: Projects** - Data-driven case studies with templated components
- [ ] **Phase 4: Animation** - Orchestrated motion and polish
- [ ] **Phase 5: Contact & Polish** - Form integration and final accessibility/performance audit

### v1.1 Internationalization

- [x] **Phase 6: Translation Infrastructure** - LocaleProvider, translation files, and type safety
- [x] **Phase 7: Language Switcher** - Toggle UI and navigation integration
- [x] **Phase 8: Content Migration** - French translations for all sections

### v1.2 Live Updates

- [ ] **Phase 9: Content Infrastructure** - Markdown pipeline, TypeScript types, and tag vocabulary
- [ ] **Phase 10: Page Shell** - Route, i18n chrome, SEO metadata, and "now" section
- [ ] **Phase 11: Entry Display** - UpdateCard component, Motion animation, and link field
- [ ] **Phase 12: Tag Filtering** - URL search param filter with TagFilter component
- [ ] **Phase 13: Navigation Integration** - Nav link, Footer link, and contact CTA

## Phase Details

### Phase 1: Foundation
**Goal**: Visitors experience the "workshop at golden hour" mood through typography, color, and visual texture
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. Custom serif headlines and refined sans body text render correctly across browsers
  2. Color palette with warm amber accents against deep slate base is applied via CSS variables
  3. Subtle grain texture overlay is visible, creating atmospheric depth
  4. Soft shadows create sense of layered physical space
  5. Layout responds correctly from mobile (320px) through desktop (1440px+)
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Bootstrap Next.js 16 project with design system (typography, colors, grain, shadows)
- [x] 01-02-PLAN.md — Verify responsive behavior and performance baseline

### Phase 2: Content
**Goal**: Visitors read empathy-first messaging that acknowledges their wariness and clearly states value
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, SERV-01, SERV-02, SERV-03
**Success Criteria** (what must be TRUE):
  1. Hero opens with empathy statement that acknowledges visitor skepticism ("Been burned before?")
  2. Value proposition is visible above fold without scrolling
  3. Hero section conveys "workshop at golden hour" atmospheric mood
  4. Services section presents problem/solution pairs in scannable format
  5. Service descriptions focus on outcomes visitor receives, not technical capabilities
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Utilities, navigation, and hero with empathy-first messaging
- [x] 02-02-PLAN.md — Services section and page composition with visual verification

### Phase 3: Projects
**Goal**: Visitors see credible proof of work through conversational case studies with quantified results
**Depends on**: Phase 2
**Requirements**: PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05
**Success Criteria** (what must be TRUE):
  1. Project cards display in responsive layout with expandable detail views
  2. Case studies follow Challenge > Approach > Result narrative structure
  3. At least one case study includes quantified outcome (specific number, not vague claim)
  4. Adding a new project requires only data file changes (no component modification)
  5. TypeScript enforces project data structure at compile time
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — Install shadcn/ui Dialog, create TypeScript types and sample project data
- [x] 03-02-PLAN.md — Build project cards, modal with gallery, and integrate into page

### Phase 4: Animation
**Goal**: Motion enhances the narrative without distracting, respecting user preferences
**Depends on**: Phase 3
**Requirements**: HERO-04, ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05
**Success Criteria** (what must be TRUE):
  1. Page load reveals content with orchestrated stagger (elements breathe in over 1-2 seconds)
  2. Below-fold sections animate into view on scroll
  3. Interactive elements respond to hover with subtle state changes
  4. Users with prefers-reduced-motion see no or minimal animation
  5. Motion bundle is optimized via LazyMotion (under 10KB added)
**Plans**: 5 plans

Plans:
- [ ] 04-01-PLAN.md — Install Motion library, create MotionProvider and shared variants
- [ ] 04-02-PLAN.md — Hero typewriter effect and orchestrated page load sequence
- [ ] 04-03-PLAN.md — Scroll reveals for sections and interactive hover/tap states
- [ ] 04-04-PLAN.md — Inline project detail expansion with draggable gallery carousel
- [ ] 04-05-PLAN.md — Visual verification checkpoint for all animations

### Phase 5: Contact & Polish
**Goal**: Visitors can reach out with low friction, and site meets performance/accessibility standards
**Depends on**: Phase 4
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, PERF-01, PERF-02, ACCS-01, ACCS-02, ACCS-03
**Success Criteria** (what must be TRUE):
  1. Contact section uses gentle, inviting language ("Tell me what's on your mind")
  2. Form submits successfully and sends email via Resend
  3. Form shows clear validation errors and success/error states
  4. Response time expectation is visible ("I respond within 24 hours")
  5. Lighthouse performance score exceeds 90
  6. Core Web Vitals pass (LCP < 2.5s, good CLS and INP)
  7. Site is fully navigable via keyboard
  8. Screen readers can access all content meaningfully
**Plans**: TBD

Plans:
- [ ] 05-01: TBD (to be defined during phase planning)

### Phase 6: Translation Infrastructure
**Goal**: Site has the technical foundation for instant language switching with type-safe translations
**Depends on**: Phase 5
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04
**Success Criteria** (what must be TRUE):
  1. LocaleProvider wraps app and exposes current locale + setLocale via React Context
  2. Translation JSON files exist for English and French with matching key structure
  3. Site detects browser language on initial load and sets appropriate locale
  4. TypeScript compilation fails if a translation key is misspelled or missing
**Plans**: 2 plans

Plans:
- [x] 06-01-PLAN.md — TypeScript type definitions and translation JSON files (en.json, fr.json)
- [x] 06-02-PLAN.md — LocaleProvider with type-safe t() function and layout integration

### Phase 7: Language Switcher
**Goal**: Visitors can switch between English and French instantly from the navigation
**Depends on**: Phase 6
**Requirements**: I18N-05, I18N-06, I18N-11
**Success Criteria** (what must be TRUE):
  1. Language toggle is visible in navbar with FR stacked on top, EN on bottom
  2. Clicking a language option switches all visible text immediately (no page reload)
  3. Navigation labels (if any) display in the selected language
**Plans**: 1 plan

Plans:
- [x] 07-01-PLAN.md — LanguageSwitcher component and translated navigation labels

### Phase 8: Content Migration
**Goal**: All site content is available in French with the same empathetic tone
**Depends on**: Phase 7
**Requirements**: I18N-07, I18N-08, I18N-09, I18N-10, I18N-12, I18N-13
**Success Criteria** (what must be TRUE):
  1. Hero section displays French empathy statement and value proposition when FR selected
  2. Services section problem/solution pairs render in French
  3. Project case studies (challenge, approach, result) and tech tags available in French
  4. Contact form labels, placeholders, and validation messages display in French
  5. Footer content displays in French
  6. Custom cursor hover text displays in French
**Plans**: 4 plans

Plans:
- [x] 08-01-PLAN.md — Expand translation files with Hero keys and refactor Hero.tsx
- [x] 08-02-PLAN.md — Create services data file and refactor Services.tsx
- [x] 08-03-PLAN.md — Add locale-keyed content to projects and refactor Projects/ProjectDetail
- [x] 08-04-PLAN.md — Footer translations and visual verification checkpoint

### Phase 9: Content Infrastructure
**Goal**: A typed, validated markdown pipeline exists that reads update entries and enforces the content schema at build time
**Depends on**: Phase 8
**Requirements**: UPD-01, UPD-02, UPD-03, UPD-04
**Success Criteria** (what must be TRUE):
  1. Markdown files in `src/content/updates/` are parsed into typed `UpdateEntry` objects with frontmatter and rendered HTML body
  2. TypeScript compilation fails if an entry uses an invalid tag or is missing required frontmatter fields
  3. `getUpdates()` returns entries sorted newest-first and uses the `"use cache"` directive for build-time caching
  4. At least 4 seed entries exist covering different tags to validate the pipeline end-to-end
**Plans**: 2 plans

Plans:
- [x] 09-01-PLAN.md — Install deps and create typed markdown parsing pipeline with getUpdates()
- [ ] 09-02-PLAN.md — Create 4 seed entries and verify end-to-end with build

### Phase 10: Page Shell
**Goal**: Visitors can navigate to `/updates` and see a complete page with localized chrome, SEO metadata, and a "now" section showing current focus
**Depends on**: Phase 9
**Requirements**: UPD-05, UPD-07, UPD-08, UPD-12
**Success Criteria** (what must be TRUE):
  1. `/updates` route renders as a server component displaying the entry stream from `getUpdates()`
  2. Page headings, filter labels, and French-language notice switch correctly between EN and FR locales
  3. Page has proper `<title>` and `<meta description>` for SEO (verifiable in page source)
  4. An evergreen "now" section at the top shows current focus and can be updated with a single frontmatter or data change
**Plans**: TBD

Plans:
- [ ] 10-01: TBD (to be defined during phase planning)

### Phase 11: Entry Display
**Goal**: Each update entry renders as a polished card with staggered animation, and entries with links surface them clearly
**Depends on**: Phase 10
**Requirements**: UPD-09, UPD-10, UPD-11
**Success Criteria** (what must be TRUE):
  1. UpdateCard displays title, formatted date (month + year), tag chip, and rendered markdown body
  2. Entry list animates in with staggered Motion on page load, consistent with existing `containerVariants`/`itemVariants` patterns
  3. Entries with an optional `link` field display a subtle external link that opens in a new tab
**Plans**: TBD

Plans:
- [ ] 11-01: TBD (to be defined during phase planning)

### Phase 12: Tag Filtering
**Goal**: Visitors can filter the update stream by tag using shareable URLs
**Depends on**: Phase 11
**Requirements**: UPD-06
**Success Criteria** (what must be TRUE):
  1. Clicking a tag chip filters the stream to show only entries with that tag; clicking again clears the filter
  2. The active filter is stored in the URL as `?tag=X`, making filtered views shareable and bookmarkable
  3. TagFilter component wraps `useSearchParams()` in a `<Suspense>` boundary (no hydration errors)
**Plans**: TBD

Plans:
- [ ] 12-01: TBD (to be defined during phase planning)

### Phase 13: Navigation Integration
**Goal**: Visitors can reach `/updates` from the main site navigation and return to the homepage, with a persistent contact CTA on the updates page
**Depends on**: Phase 12
**Requirements**: UPD-13, UPD-14, UPD-15
**Success Criteria** (what must be TRUE):
  1. "Updates" link appears in the Nav component; on the homepage it scrolls or navigates normally, on `/updates` nav links route back to `/#services`, `/#projects`
  2. "Updates" link appears in the Footer quick links section
  3. A persistent contact CTA on the `/updates` page links back to the contact form on the homepage
  4. Existing homepage scroll-to-anchor behavior is unchanged after Navigation.tsx modifications
**Plans**: TBD

Plans:
- [ ] 13-01: TBD (to be defined during phase planning)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8 > 9 > 10 > 11 > 12 > 13

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-02-02 |
| 2. Content | v1.0 | 2/2 | Complete | 2026-02-02 |
| 3. Projects | v1.0 | 2/2 | Complete | 2026-02-02 |
| 4. Animation | v1.0 | 0/5 | Ready | - |
| 5. Contact & Polish | v1.0 | 0/? | Not started | - |
| 6. Translation Infrastructure | v1.1 | 2/2 | Complete | 2026-02-03 |
| 7. Language Switcher | v1.1 | 1/1 | Complete | 2026-02-03 |
| 8. Content Migration | v1.1 | 4/4 | Complete | 2026-02-03 |
| 9. Content Infrastructure | v1.2 | 1/2 | In progress | - |
| 10. Page Shell | v1.2 | 0/? | Not started | - |
| 11. Entry Display | v1.2 | 0/? | Not started | - |
| 12. Tag Filtering | v1.2 | 0/? | Not started | - |
| 13. Navigation Integration | v1.2 | 0/? | Not started | - |

---
*Roadmap created: 2026-02-02*
*Last updated: 2026-02-19 -- Phase 9 planned (2 plans in 2 waves)*
