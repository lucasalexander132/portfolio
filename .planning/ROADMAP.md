# Roadmap: Civix Solutions Portfolio

## Milestones

- 🚧 **v1.0 MVP** - Phases 1-5 (in progress)
- 📋 **v1.1 Internationalization** - Phases 6-8 (planned)

## Overview

This roadmap delivers a single-page portfolio for Civix Solutions that makes weary, skeptical visitors feel understood before impressed. v1.0 builds from visual foundation through content, case studies, animation, and contact experience. v1.1 adds French language support with instant client-side switching, enabling bilingual visitors to experience the same empathetic messaging in their preferred language.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4, 5, 6, 7, 8): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions if needed (marked with INSERTED)

### v1.0 MVP

- [x] **Phase 1: Foundation** - Design system and visual infrastructure
- [x] **Phase 2: Content** - Hero and services with empathy-first messaging
- [x] **Phase 3: Projects** - Data-driven case studies with templated components
- [ ] **Phase 4: Animation** - Orchestrated motion and polish
- [ ] **Phase 5: Contact & Polish** - Form integration and final accessibility/performance audit

### v1.1 Internationalization

- [ ] **Phase 6: Translation Infrastructure** - LocaleProvider, translation files, and type safety
- [ ] **Phase 7: Language Switcher** - Toggle UI and navigation integration
- [ ] **Phase 8: Content Migration** - French translations for all sections

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
**Plans**: TBD

Plans:
- [ ] 06-01: TBD (to be defined during phase planning)

### Phase 7: Language Switcher
**Goal**: Visitors can switch between English and French instantly from the navigation
**Depends on**: Phase 6
**Requirements**: I18N-05, I18N-06, I18N-11
**Success Criteria** (what must be TRUE):
  1. Language toggle is visible in navbar with FR stacked on top, EN on bottom
  2. Clicking a language option switches all visible text immediately (no page reload)
  3. Navigation labels (if any) display in the selected language
**Plans**: TBD

Plans:
- [ ] 07-01: TBD (to be defined during phase planning)

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
**Plans**: TBD

Plans:
- [ ] 08-01: TBD (to be defined during phase planning)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation | v1.0 | 2/2 | Complete | 2026-02-02 |
| 2. Content | v1.0 | 2/2 | Complete | 2026-02-02 |
| 3. Projects | v1.0 | 2/2 | Complete | 2026-02-02 |
| 4. Animation | v1.0 | 0/5 | Ready | - |
| 5. Contact & Polish | v1.0 | 0/? | Not started | - |
| 6. Translation Infrastructure | v1.1 | 0/? | Not started | - |
| 7. Language Switcher | v1.1 | 0/? | Not started | - |
| 8. Content Migration | v1.1 | 0/? | Not started | - |

---
*Roadmap created: 2026-02-02*
*Last updated: 2026-02-03 — v1.1 Internationalization phases added*
