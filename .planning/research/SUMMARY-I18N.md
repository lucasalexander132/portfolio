# Project Research Summary

**Project:** Civix Solutions Portfolio v1.1
**Domain:** Internationalization (EN/FR)
**Researched:** 2026-02-03
**Confidence:** HIGH

## Executive Summary

For a single-page portfolio with instant client-side language switching (no page reload), the optimal approach is a custom React Context solution with zero i18n library dependencies. The heavyweight libraries (next-intl, react-i18next) are designed for multi-page apps with SEO requirements and localized URLs - fundamentally different use cases that introduce unnecessary complexity for this project.

The portfolio requires approximately 50-60 unique strings across Hero, Services, Projects, Contact Form, Footer, and Navigation components, plus cursor hover text translations. With "instant switching without page reload" as an explicit requirement, the solution is straightforward: React Context manages locale state (~50 lines of code), JSON translation files store content, and browser language detection runs once on first visit. This delivers exactly what's needed with zero bundle cost and full control.

The critical risk is over-engineering. The most common pitfall in i18n projects is adopting server-side routing patterns for client-side requirements. For this portfolio, avoid next-intl's `[locale]` routing structure, skip middleware entirely, and resist the temptation to "future-proof" for features you don't need. The translation layer should be invisible infrastructure, not a framework.

## Key Findings

### Recommended Stack

Skip i18n libraries entirely. Use a lightweight custom React Context solution with JSON translation files.

**Core technologies:**
- React Context + useState: Locale state management - Zero dependencies, instant switching, ~50 lines of code
- JSON translation files: Translation storage - Simple key-value pairs, no library needed
- navigator.language API: First-visit detection - Native browser API, no library required

**Why this approach:**
1. Instant switching - React state change re-renders immediately, no network request or router navigation
2. Zero bundle cost - No i18n library to ship to client
3. Full control - No fighting library assumptions about routing or persistence
4. Matches requirements - "No persistence needed" + "instant switching" = pure client state is perfect fit

**What to avoid:**
- next-intl (v4.8.2): Designed for URL-based routing (`/en/about`, `/fr/about`), requires `router.refresh()` for locale changes even in "without routing" mode, adds ~7kb for unused features
- react-i18next (22kb bundle): Framework-agnostic, not optimized for Next.js App Router, overkill for 2-language portfolio
- i18next-browser-languagedetector: Unnecessary package for what's literally 3 lines of `navigator.language` code

### Expected Features

**Must have (table stakes):**
- Language switcher in navbar - Users must be able to toggle languages manually, spec requires FR on top, EN on bottom
- All UI text translated - Every label, button, heading, form field needs both EN/FR versions (~50-60 strings)
- All content translated - Project descriptions, service explanations, taglines require equivalent depth
- Cursor/tooltip translations - Site uses custom cursor text heavily ("That's me!", "What I've Done"), untranslated tooltips break immersion (~15-20 strings)
- Browser language detection - First-time visitors should see their preferred language automatically
- Form validation messages - Contact form validation states, success messages (~5-6 strings)
- HTML lang attribute - Screen readers and SEO need correct `<html lang="en">` or `<html lang="fr">`

**Should have (competitive):**
- Instant client-side switching - No page reload means smoother UX, spec requirement and premium feel
- Animated language transitions - Subtle fade/morph when text changes, matches existing animation-heavy design
- Language indicator persistence - Show which language is active with visual indicator (bold, underline, icon)
- Graceful text expansion handling - French text is ~15-30% longer than English, ensure layouts don't break

**Defer (v2+):**
- Localized URL paths (`/fr/`) - Optional for single-page site, but good for bookmarking
- Localized meta tags - og:locale, twitter:card language hints for social sharing
- Keyboard shortcut for switching - Power user feature (e.g., Cmd+Shift+L)

**Anti-features (deliberately avoid):**
- Server-side locale routing - Over-complex for client-rendered portfolio
- CMS-backed translations - Portfolio content changes rarely, JSON files are simpler
- Machine translation fallbacks - Never show auto-translated content, better to show nothing
- Multiple locale variants (FR-CA vs FR-FR, EN-US vs EN-GB) - Overkill for portfolio
- Translation management UI - No non-technical translators need access
- Pluralization system - Portfolio content has minimal dynamic counts
- Dynamic language loading - Both languages are small enough (~10-20KB) to ship together

### Architecture Approach

Client-side locale switching with React Context pattern. LocaleProvider wraps the app at layout level, maintaining locale state and providing translation function. Components use `useTranslations()` hook to access translated strings.

**Implementation structure:**
```
/messages/
  en.json          # {"hero.title": "Welcome", ...}
  fr.json          # {"hero.title": "Bienvenue", ...}

/lib/
  i18n.tsx         # LocaleProvider + useTranslations hook (~50 lines)

/components/
  language-switch.tsx  # Toggle button in navbar
```

**Major components:**
1. LocaleProvider - Manages locale state (en/fr), provides `setLocale()` function and `t()` translation function, handles browser detection on mount
2. Translation files - Flat JSON structure with namespaced keys (e.g., "hero.title", "nav.services"), type-safe via `keyof typeof messages`
3. Language switch component - Simple toggle button using `setLocale()`, positioned in navbar per spec

**Integration with existing architecture:**
- Existing page.tsx is already a Client Component, simplifying integration
- MotionProvider and CursorProvider remain unchanged, locale switching happens above them in tree
- Components already use 'use client', can directly consume `useTranslations()` hook
- Translation strings passed to cursor hooks as needed for hover text

**Data flow:**
Browser detection (first visit) → Set initial locale → LocaleProvider context → All components via useTranslations() → User clicks toggle → Context updates → Instant re-render with new language

### Critical Pitfalls

1. **Using next-intl for client-only switching** - next-intl requires `router.refresh()` even without routing, causing state loss and page reload. The library is designed for URL-based locales, not pure client state. Prevention: Use custom Context solution for instant switching requirement.

2. **Breaking existing URL structure** - Adding `[locale]` routing changes all URLs from `/` to `/en/` and `/#projects` to `/en/#projects`, breaking bookmarks and search rankings. Prevention: Keep single-page structure, no locale in URL. If URL patterns are needed later, use `localePrefix: 'as-needed'` to hide default locale.

3. **State loss on language switch** - Language switching that triggers navigation causes full page reload, resetting scroll position, form state, animation state. For animation-heavy portfolio, this breaks experience. Prevention: Use React state, not router navigation. No `router.push()`, no `router.refresh()`.

4. **Missing translation keys silently fail** - Typo in translation key shows raw key ("hero.title") instead of text. Easy to miss during development. Prevention: Use TypeScript for type-safe keys via `keyof typeof messages`, enable strict mode warnings in development.

5. **Machine translation without review** - Google Translate produces technically correct but tonally wrong French. For portfolio emphasizing emotional connection with "weary, skeptical" visitors, tone matters. Prevention: Machine translate first, then human review by native speaker. Establish tone guide (vous vs tu), pay for professional translation of key emotional content (hero, empathy hooks).

## Implications for Roadmap

Based on research, this milestone should be implemented in 3 tight phases with clear boundaries:

### Phase 1: Translation Infrastructure
**Rationale:** Foundation must exist before any component work. Zero visual changes, purely internal.
**Delivers:** Working i18n system with browser detection, can be tested independently
**Duration:** 2-3 hours
**Includes:**
- Create LocaleProvider component (~50 lines of code)
- Create translation file structure (`messages/en.json`, `messages/fr.json`)
- Wrap app layout with LocaleProvider
- Implement browser language detection on first mount
- Extract all existing English strings to en.json
- Type safety via TypeScript inference from JSON

**Avoids pitfalls:**
- Establishes naming convention upfront (flat keys with namespace prefixes like "hero.title")
- TypeScript types prevent missing key issues from day one
- No library dependencies means no version conflicts or breaking changes

### Phase 2: Language Switcher + Navigation
**Rationale:** Visible proof of concept that instant switching works. Small scope for testing pattern.
**Delivers:** Working language toggle in navbar, navigation labels switch instantly
**Duration:** 1-2 hours
**Includes:**
- Create LanguageSwitch component (FR on top, EN on bottom per spec)
- Add to Navigation component
- Extract Navigation labels to translations
- Test instant switching without reload
- Verify browser detection works

**Addresses features:**
- Language switcher in navbar (table stakes)
- Instant client-side switching (differentiator)
- Language indicator persistence (show active language)

**Avoids pitfalls:**
- Early validation that context pattern works without state loss
- Proves no router.refresh() needed
- Tests View Transitions compatibility (existing React 19.2 feature)

### Phase 3: Content Migration
**Rationale:** Mechanical work, can be parallelized by section. Depends on infrastructure being solid.
**Delivers:** Complete i18n coverage, French content, production-ready
**Duration:** 10-15 hours (including French translation/review)
**Includes:**
- Hero section (headline, subtext, Typewriter component)
- Services section (intro, 3 service titles + descriptions)
- Projects section (4 projects x titles/taglines/challenges/approaches/results)
- Contact form (labels, placeholders, validation messages)
- Footer (all text content)
- Cursor hover text (~15-20 strings)
- French content writing/professional review
- Text expansion testing (French is 15-30% longer)
- Visual QA in both languages

**Addresses features:**
- All UI text translated (table stakes)
- All content translated (table stakes)
- Cursor/tooltip translations (table stakes)
- Graceful text expansion handling (differentiator)

**Avoids pitfalls:**
- Human review of French prevents machine translation tone issues
- Testing with full French content catches layout breakage early
- Consistent key naming established in Phase 1 prevents confusion

### Phase Ordering Rationale

- Infrastructure first enables independent testing and validates approach risk-free
- Language switcher next provides visible proof and uncovers integration issues early
- Content migration last because it's mechanical work once pattern is proven
- Each phase is independently verifiable without next phase
- Natural parallelization opportunity: English string extraction can happen while building infrastructure
- French translation (longest/most expensive task) deferred until pattern validated

### Research Flags

**Phases with standard patterns (skip research-phase):**
- Phase 1: Infrastructure - Custom React Context is basic pattern, no research needed
- Phase 2: Language Switcher - Simple UI component, straightforward
- Phase 3: Content Migration - Mechanical extraction work, no technical unknowns

**No phases need `/gsd:research-phase` during planning.** This research covered all technical decisions. Only human judgment needed is French translation quality (non-technical).

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Custom Context approach is standard React pattern, verified via multiple implementations. Rejection of next-intl based on official docs confirming refresh requirement. |
| Features | HIGH | Component audit completed, all translatable content identified. Feature list based on i18n best practices and Quebec regulations. Estimated ~50-60 UI strings + ~20 cursor strings + project content. |
| Architecture | HIGH | Integration points identified, existing codebase is already Client Components so no Server/Client boundary issues. Pattern matches Next.js 16 App Router paradigms. |
| Pitfalls | HIGH | Sourced from official next-intl docs, GitHub issues, and i18n best practices. State loss pitfall is most critical and well-documented. Machine translation quality risk is domain knowledge. |

**Overall confidence:** HIGH

### Gaps to Address

- **French content quality** - English strings identified, but French translation requires human review. Machine translation acceptable for mechanical content (form labels), but emotional content (hero, empathy hooks) needs native speaker or professional translation. Recommend budgeting for professional translation of ~500 words (hero section, key emotional hooks).

- **Text expansion testing** - French text typically 15-30% longer. While research flags this, actual breakage won't be visible until French content exists. Recommend testing all layouts with French content during Phase 3, paying special attention to fixed-width components (buttons, navbar items, cards).

- **Quebec regulatory compliance** - If targeting Quebec clients specifically, French content should be "as developed" as English per Charter of the French Language. This is content parity, not technical issue. Recommend treating English and French as co-equal, not translation relationship.

## Sources

### Primary (HIGH confidence)
- [next-intl official docs](https://next-intl.dev/docs/getting-started/app-router) - Confirmed refresh requirement for locale switching, documented "without i18n routing" mode
- [next-intl GitHub Issue #1096](https://github.com/amannn/next-intl/discussions/1096) - Community confirms client-side switching limitation
- [Medium: i18n without libraries](https://medium.com/@wjdwoeotmd/implementing-internationalization-in-next-js-without-external-libraries-6b51304722b8) - Custom Context pattern validation
- [Next.js i18n Guide](https://nextjs.org/docs/pages/guides/internationalization) - Confirmed Pages Router i18n removed from App Router
- [Shopify i18n Best Practices](https://shopify.engineering/internationalization-i18n-best-practices-front-end-developers) - Feature expectations, anti-patterns

### Secondary (MEDIUM confidence)
- [i18n library comparison 2025](https://medium.com/better-dev-nextjs-react/the-best-i18n-libraries-for-next-js-app-router-in-2025-21cb5ab2219a) - next-intl vs react-i18next bundle size analysis
- [Browser language detection guide](https://dev.to/lingodotdev/every-way-to-detect-a-users-locale-from-best-to-worst-369i) - navigator.language best practices
- [Phrase Localization Pitfalls](https://phrase.com/blog/posts/10-common-mistakes-in-software-localization/) - Machine translation risks
- [Language Switcher UX Best Practices](https://usersnap.com/blog/design-language-switch/) - Switcher UI patterns

### Tertiary (LOW confidence)
- [McMillan - French Language Requirements in Canada](https://mcmillan.ca/insights/social-media-and-websites-as-national-communication-platforms-in-canada-in-light-of-french-language-requirements/) - Quebec regulations, legal analysis not technical

---
*Research completed: 2026-02-03*
*Ready for roadmap: YES*
