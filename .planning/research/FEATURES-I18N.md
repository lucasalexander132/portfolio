# Features Research: i18n for Bilingual Portfolio

**Domain:** Bilingual (EN/FR) single-page portfolio site
**Researched:** 2026-02-03
**Overall confidence:** HIGH (well-established patterns)

## Executive Summary

For a bilingual EN/FR portfolio site targeting small business owners, i18n features fall into clear categories. Table stakes are the basics users expect from any bilingual site. Differentiators enhance UX but are not dealbreakers. Anti-features are common over-engineering traps that add complexity without value for a portfolio site.

The existing codebase has significant translatable content across Hero, Services, Projects, Contact Form, Footer, and Navigation components. Content is currently hardcoded in components, including hover bubble text and cursor tooltip text.

---

## Table Stakes

Must-have i18n features. Missing any of these makes the site feel incomplete or unprofessional for bilingual visitors.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Language switcher in navbar** | Users must be able to toggle languages manually. The spec requires FR on top, EN on bottom layout. | Low | Visible on all pages, persistent position |
| **All UI text translated** | Partial translation looks broken. Every label, button, heading, and form field must have both EN and FR versions. | Medium | ~50-60 unique strings based on component audit |
| **All content translated** | Project descriptions, service explanations, taglines. French readers expect equivalent depth. | Medium-High | Project data (4 projects x 5+ fields each), services (3 items), hero text |
| **Cursor/tooltip translations** | This site uses custom cursor text heavily (e.g., "That's me!", "What I've Done"). Untranslated tooltips break immersion. | Low | ~15-20 cursor text strings |
| **Browser language detection** | First-time visitors should see their preferred language automatically. Spec requirement. | Low | Check navigator.language on first visit, store preference |
| **Language preference persistence** | After switching, the choice should persist across visits. | Low | localStorage or cookie |
| **Form validation messages** | "Name is required", error states, success messages all need translation. | Low | Contact form has ~5-6 validation strings |
| **Date/number formatting** | If any dates appear (copyright year, etc.), format appropriately for locale. | Low | Currently just year in footer, but good practice |
| **HTML lang attribute** | Screen readers and SEO need correct `<html lang="en">` or `<html lang="fr">`. | Low | Update on language switch |

### Inventory of Content Requiring Translation

Based on component audit:

**Hero.tsx:**
- Headline: "Been burned by developers before?"
- Subtitle: "I get it. You hired someone who promised..."
- CTA: "See how I can help"
- Hover bubbles: "8 years in dev work", "Passionate and Empathetic", "Kind of hungry"
- Cursor text: "That's me!", "Cause I probably can"

**Services.tsx:**
- Section intro text
- 3 service titles + descriptions + cursor texts
- Footer text: "What more could you want?"

**Projects.tsx:**
- Section header + footer text
- "Coming Soon" badge
- 4 projects x (title, tagline, challenge, approach, result, cursor text)
- Hover bubbles for each project (3 per project = 12 strings)

**ContactForm.tsx:**
- Header: "Let's Talk."
- Labels: Name, Email, Message
- Placeholders: "Your name", "your@email.com", "Tell me about your project..."
- Submit button: "Send It", "Sending..."
- Success: "Sent! I'll be in touch soon."
- Error messages
- Cursor text: "Awe, really?", "Hell yeah!"

**Navigation.tsx:**
- Nav link labels: Services, Projects
- Cursor texts: "What I'll Do", "What I've Done", "Drop a Line"

**Footer.tsx:**
- Brand description
- Section headers: Navigation, Connect
- Link labels
- Copyright text
- "Available for new projects"

---

## Differentiators

Nice-to-have features that enhance UX but are not expected by typical users.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Instant client-side switching** | No page reload means smoother UX. Spec requirement, but also a premium feel. | Medium | Requires React context or state management for reactive updates |
| **Localized URL paths** | `/fr/` or `/en/` prefixes help SEO and allow direct linking to language version. | Medium | Optional for single-page site, but good for bookmarking |
| **Animated language transitions** | Subtle fade or morph when text changes language. Matches existing animation-heavy design. | Medium | Motion library already in use, could coordinate |
| **Language indicator persistence** | Show which language is active with visual indicator (bold, underline, icon). | Low | Good UX feedback |
| **Graceful text expansion handling** | French text is ~15-30% longer than English. Ensure layouts don't break. | Low-Medium | Test all components with French content |
| **Localized meta tags** | og:locale, twitter:card language hints for social sharing. | Low | Good for SEO/social |
| **Keyboard shortcut for switching** | Power user feature (e.g., Cmd+Shift+L). | Low | Nice touch, not expected |

---

## Anti-Features

Things to deliberately NOT build. Common i18n over-engineering for a portfolio site.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Server-side locale routing** | Over-complex for a single-page client-rendered portfolio. Adds build complexity, deployment considerations. | Client-side language switching with localStorage persistence is sufficient |
| **CMS-backed translations** | Portfolio content changes rarely. Translation files are simpler and version-controlled. | JSON translation files in repo |
| **Machine translation fallbacks** | Never show auto-translated content. Better to show nothing or original than broken French. | Require complete translations before launch |
| **Multiple locale variants** | FR-CA vs FR-FR, EN-US vs EN-GB. Overkill for portfolio. | Single FR and single EN variant |
| **RTL support infrastructure** | Not targeting Arabic/Hebrew markets. Adding infrastructure "just in case" wastes time. | Omit entirely |
| **Translation management UI** | No non-technical translators need access. Developer edits JSON files. | Direct file editing |
| **Pluralization system** | Portfolio content has minimal dynamic counts. "1 project" vs "2 projects" cases are rare/non-existent. | Hardcode the few plural cases if any |
| **Dynamic language loading** | Both languages are small enough to ship together. Code splitting adds latency to switch. | Bundle all translations |
| **Per-component translation loading** | Premature optimization. Total strings are ~100-150, not thousands. | Single translation file per language |
| **Separate builds per language** | Unnecessary for client-side switching. | Single build, runtime switching |

---

## Complexity Notes

### Simple (1-2 hours each)
- Language switcher UI component
- localStorage persistence
- Browser detection on first visit
- HTML lang attribute update
- Date/number formatting setup

### Medium (2-4 hours each)
- Translation file structure and loading
- React context for language state
- Extracting all hardcoded strings from components
- Converting components to use translation functions
- Testing all components with French content

### Complex (4-8 hours)
- French content writing/translation (requires human translator or careful AI-assisted review)
- Text expansion testing and layout adjustments
- Animation coordination if adding transition effects

### Estimated Total Effort

| Phase | Estimate |
|-------|----------|
| Infrastructure (context, utils, detection) | 2-3 hours |
| String extraction from components | 2-3 hours |
| Translation file creation (EN/FR) | 1-2 hours |
| Component integration | 3-4 hours |
| French content writing | 4-6 hours (external or careful review) |
| Testing and polish | 2-3 hours |
| **Total** | **14-21 hours** |

---

## Feature Dependencies

```
Browser Detection
      |
      v
Language State (Context)
      |
      +--> Language Switcher UI
      |
      +--> Translation Loading
              |
              v
      Component Integration
              |
              v
      French Content Writing
              |
              v
      Text Expansion Testing
```

**Key dependency:** Cannot integrate components until translation infrastructure exists. Cannot test properly until French content is written.

---

## MVP Recommendation

For MVP i18n launch, prioritize:

1. **Language context + switcher** - Core infrastructure
2. **All UI text translated** - Table stakes
3. **Browser detection** - Spec requirement
4. **Instant switching** - Spec requirement
5. **All content translated** - Table stakes

Defer to post-MVP:
- Animated transitions between languages (polish)
- Localized URL paths (optional for single-page)
- Meta tag localization (SEO refinement)
- Keyboard shortcuts (power user feature)

---

## Quebec Considerations

If targeting Quebec clients specifically, note that [Quebec's Charter of the French Language](https://mcmillan.ca/insights/social-media-and-websites-as-national-communication-platforms-in-canada-in-light-of-french-language-requirements/) requires:

- French content should be "as developed" as English content
- Language toggle should be "functional and well-marked"
- For commercial sites, French should be "at least as prominent" as English

For a portfolio site, the simplest compliance: **ensure parity between EN and FR content quality and completeness, with an obvious language switcher.**

---

## Sources

- [Next.js Internationalization Guide](https://nextjs.org/docs/pages/guides/internationalization)
- [next-intl Documentation](https://next-intl.dev/)
- [Shopify i18n Best Practices](https://shopify.engineering/internationalization-i18n-best-practices-front-end-developers)
- [Phrase Localization Pitfalls](https://phrase.com/blog/posts/10-common-mistakes-in-software-localization/)
- [Language Switcher UX Best Practices](https://usersnap.com/blog/design-language-switch/)
- [Weglot Multilingual UX Principles](https://www.weglot.com/blog/ux-principles-multilingual-design)
- [McMillan - French Language Requirements in Canada](https://mcmillan.ca/insights/social-media-and-websites-as-national-communication-platforms-in-canada-in-light-of-french-language-requirements/)
