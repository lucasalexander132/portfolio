# Phase 8: Content Migration - Research

**Researched:** 2026-02-03
**Domain:** French content translation with emotional tone preservation
**Confidence:** HIGH

## Summary

Phase 8 migrates all site content from ASCII-only French placeholders to proper French with accents and emotional equivalence. The codebase has a working i18n infrastructure (LocaleProvider, useTranslations hook, JSON translation files) established in Phases 6-7. The challenge is not technical but content-focused: translating empathetic English messaging into emotionally equivalent French.

The site currently has two translation structures:
1. **JSON translation files** (`messages/en.json`, `messages/fr.json`) - Used for nav, contact form, footer, and cursor text via `t()` function
2. **Hardcoded strings in components and data files** - Hero, Services, Projects, and hover bubbles contain untranslated content directly in TypeScript

The migration strategy must address both: expand JSON files with new keys AND modify components to consume translations instead of hardcoded strings. For project data specifically, the recommended approach is locale-keyed content objects in the data file rather than moving all project text to JSON.

**Primary recommendation:** Expand translation JSON files for all UI strings, use locale-keyed objects for project/services data, and hire professional French translation for empathetic messaging (or create high-quality drafts for user review).

## Current Translation Infrastructure

### What's Already Working

| Element | Status | Location | Notes |
|---------|--------|----------|-------|
| LocaleProvider | WORKING | `src/lib/i18n.tsx` | Wraps app, provides `locale`, `setLocale`, `t()` |
| useTranslations hook | WORKING | `src/lib/i18n.tsx` | Returns typed `t()` function |
| useLocale hook | WORKING | `src/lib/i18n.tsx` | Returns `{ locale, setLocale }` |
| English translations | PARTIAL | `messages/en.json` | 27 keys, missing Hero/Services/Projects content |
| French translations | PARTIAL | `messages/fr.json` | 27 keys, ASCII-only placeholders |
| Type-safe keys | WORKING | `src/types/i18n.d.ts` | `TranslationKey` union type via `NestedKeyOf<T>` |
| HTML lang sync | WORKING | `src/lib/i18n.tsx` L39-41 | `document.documentElement.lang = locale` |
| Browser detection | WORKING | `src/lib/i18n.tsx` L31-36 | `navigator.language` check on mount |

### Current Translation File Structure

```json
// messages/en.json (27 keys)
{
  "nav": { "services", "projects", "contact" },
  "hero": { "title", "subtitle" },
  "services": { "title", "placeholder" },
  "projects": { "title", "placeholder" },
  "contact": { "title", "name_label", "name_placeholder", "email_label", "email_placeholder", "message_label", "message_placeholder", "submit", "sending", "success", "error" },
  "footer": { "copyright", "tagline" },
  "cursor": { "thats_me", "what_ill_do", "what_ive_done" }
}
```

## Content Requiring Translation

### Category 1: Hardcoded Strings in Components

These strings exist directly in TSX files and must be moved to translation files.

#### Hero.tsx (15 strings)
| String | Line | Context |
|--------|------|---------|
| `"Been burned by developers before?"` | L94 | Typewriter headline |
| `"I get it. You hired someone who promised the world and disappeared. Let's skip the sales pitch and talk about what you actually need."` | L104 | Typewriter subtitle |
| `"See how I can help"` | L126 | CTA link text |
| `"8 years in dev work"` | L11 | Hover bubble |
| `"Passionate and Empathetic"` | L12 | Hover bubble |
| `"Kind of hungry"` | L13 | Hover bubble |
| `"That's me!"` (cursor) | L20 | useCursorHover text |
| `"Cause I probably can"` (cursor) | L21 | useCursorHover text |

#### Services.tsx (18 strings)
| String | Line | Context |
|--------|------|---------|
| `"Custom Development"` | L13 | Service title |
| `"If you're tired of templates that don't fit..."` | L14-15 | Service description |
| `"Like this site"` (cursor) | L16 | Service cursor text |
| `"Ongoing Communication"` | L20 | Service title |
| `"If you've been ghosted before..."` | L21-22 | Service description |
| `"No ghosts here"` (cursor) | L23 | Service cursor text |
| `"Fast Iteration"` | L27 | Service title |
| `"If you're watching competitors move faster..."` | L28-29 | Service description |
| `"I'm addicted to work"` (cursor) | L30 | Service cursor text |
| `"Every project starts with a conversation..."` | L204-206 | Section header |
| `"What more could you want?"` | L155 | Section footer |
| `"Free snacks. But I'm working on it."` (cursor) | L148 | Footer cursor text |

#### Footer.tsx (8 strings)
| String | Line | Context |
|--------|------|---------|
| `"Civix Solutions"` | L63-64 | Brand name |
| `"Building digital experiences..."` | L66-67 | Brand tagline |
| `"Navigation"` | L73-74 | Section header |
| `"Services"`, `"Projects"` | L27 | Quick link labels |
| `"Connect"` | L106-107 | Section header |
| `"All rights reserved"` | L135 | Copyright |
| `"Available for new projects"` | L138 | Availability status |

#### Projects.tsx / ProjectDetail.tsx (25+ strings)
| String | Location | Context |
|--------|----------|---------|
| `"Coming Soon"` | Projects.tsx L125 | Badge text |
| `"Real projects, real results..."` | Projects.tsx L259-261 | Section header |
| `"More in the works..."` | Projects.tsx L287 | Section footer |
| `"Challenge"` | ProjectDetail.tsx L93-94 | Section label |
| `"Approach"` | ProjectDetail.tsx L193-194 | Section label |
| `"Result"` | ProjectDetail.tsx L232-233 | Section label |
| `"Built with"` | ProjectDetail.tsx L247-248 | Section label |
| `"Visit Project"` | ProjectDetail.tsx L269 | CTA text |
| `"View Source"` | ProjectDetail.tsx L285 | CTA text |
| Project hover bubbles | Both files | 12+ bubble texts per project |

### Category 2: Project Data (projects.ts)

4 projects with these translatable fields each:
- `tagline` (1 sentence)
- `challenge` (2-3 sentences)
- `approach` (2-3 sentences)
- `result` (2-3 sentences)
- `cursorText` (short phrase)

**Total: ~20 paragraphs of project content**

### Category 3: Already in JSON (Needs Accent Fix)

French translations exist but use ASCII-only characters:

| Key | Current (ASCII) | Needs |
|-----|-----------------|-------|
| `hero.title` | `"Avez-vous deja ete decu par un developpeur?"` | `"Avez-vous deja ete decu..."` -> proper accents |
| `hero.subtitle` | `"Je comprends. Vous avez engage..."` | Proper accents throughout |
| `services.title` | `"Ce que je fais"` | OK (no accents needed) |
| `projects.title` | `"Realisations"` | `"Realisations"` -> OK |
| `contact.*` | Various | Need accent fixes |
| `footer.tagline` | `"Developpement frontend sur mesure"` | `"Developpement"` -> proper accent |
| `cursor.*` | Various | Minor accent fixes |

## Architecture Patterns

### Pattern 1: Locale-Keyed Content Objects (Recommended for Data)

**What:** Store translations directly in data files using locale-keyed objects
**When to use:** For structured data like projects and services where content is tightly coupled to the data structure
**Why:** Keeps data cohesive, avoids massive JSON files, enables type-safe access

```typescript
// src/data/projects.ts
import type { Locale } from '@/lib/i18n'

interface LocalizedProject {
  id: string
  title: string // Title doesn't need translation (proper noun)
  thumbnail: string
  images: string[]
  status: 'live' | 'coming-soon'
  technologies: string[]
  // Locale-keyed content
  content: {
    [K in Locale]: {
      tagline: string
      challenge: string
      approach: string
      result: string
      cursorText?: string
    }
  }
}

export const projects: LocalizedProject[] = [
  {
    id: 'codex-grove',
    title: 'Codex Grove',
    // ... non-translated fields
    content: {
      en: {
        tagline: 'Knowledge management platform with AI-powered documentation assistant',
        challenge: 'Organizations struggle with scattered documentation...',
        approach: 'Building a unified platform combining Kanban...',
        result: 'Shipping with over 220K+ lines of TypeScript...',
        cursorText: 'Explore the knowledge platform',
      },
      fr: {
        tagline: 'Plateforme de gestion des connaissances avec assistant IA',
        challenge: 'Les organisations peinent avec une documentation dispersee...',
        approach: 'Construction d\'une plateforme unifiee combinant Kanban...',
        result: 'Livraison avec plus de 220K lignes de TypeScript...',
        cursorText: 'Explorez la plateforme',
      },
    },
  },
  // ... other projects
]
```

**Component usage:**
```typescript
// ProjectCard.tsx
import { useLocale } from '@/lib/i18n'

function ProjectCard({ project }) {
  const { locale } = useLocale()
  const content = project.content[locale]

  return (
    <div>
      <h3>{project.title}</h3>
      <p>{content.tagline}</p>
    </div>
  )
}
```

### Pattern 2: Expanded JSON Structure (Recommended for UI Strings)

**What:** Add all UI strings to translation JSON files
**When to use:** For static UI text not tied to data structures

```json
// messages/en.json (expanded)
{
  "nav": { ... },
  "hero": {
    "title": "Been burned by developers before?",
    "subtitle": "I get it. You hired someone who promised the world and disappeared. Let's skip the sales pitch and talk about what you actually need.",
    "cta": "See how I can help",
    "bubbles": {
      "experience": "8 years in dev work",
      "personality": "Passionate and Empathetic",
      "hungry": "Kind of hungry"
    },
    "cursor": {
      "photo": "That's me!",
      "help_link": "Cause I probably can"
    }
  },
  "services": {
    "header": "Every project starts with a conversation - no pressure, no commitment. Just two people figuring out if we're a good fit.",
    "footer": "What more could you want?",
    "footer_cursor": "Free snacks. But I'm working on it.",
    "development": {
      "title": "Custom Development",
      "description": "If you're tired of templates that don't fit, I build exactly what your business needs - no more, no less. Every line of code serves a purpose.",
      "cursor": "Like this site"
    },
    // ... other services
  },
  "projects": {
    "header": "Real projects, real results. Click any card to see the full story behind the build.",
    "footer": "More in the works. The best is yet to come.",
    "labels": {
      "coming_soon": "Coming Soon",
      "challenge": "Challenge",
      "approach": "Approach",
      "result": "Result",
      "built_with": "Built with",
      "visit_project": "Visit Project",
      "view_source": "View Source"
    }
  },
  // ... rest
}
```

### Pattern 3: Hover Bubbles as Locale-Keyed Data

**What:** Store hover bubble configurations with locale-keyed text
**When to use:** For project-specific interactive elements

```typescript
// src/data/projectBubbles.ts
import type { Locale } from '@/lib/i18n'

interface Bubble {
  position: string
  rotate: string
  bg: string
  text: { [K in Locale]: string }
}

export const projectBubbles: Record<string, Bubble[]> = {
  'codex-grove': [
    {
      position: 'top-2 -left-4 lg:-left-16',
      rotate: '-5deg',
      bg: 'bg-amber-300',
      text: {
        en: 'Simple Scheduling',
        fr: 'Planification simple',
      },
    },
    // ...
  ],
}
```

### Anti-Patterns to Avoid

- **Moving all content to JSON:** Creates a massive, hard-to-maintain translation file. Keep structured data (projects, services) in TS files with locale keys.
- **Inline translation calls in data:** Don't call `t()` in data files - components should access locale-keyed data.
- **Translating in useEffect:** Don't delay rendering for translations - use synchronous access to pre-loaded translations.
- **Separate component files per locale:** Don't create `HeroFr.tsx` / `HeroEn.tsx` - use one component with translations.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| French accent conversion | ASCII-to-accent mapping | Manual translation with proper accents | Automated conversion is error-prone |
| Emotional tone equivalence | Literal translation | Professional translation or careful adaptation | Literal translations lose emotional impact |
| Placeholder detection | Runtime scanning | Type-safe keys + visual testing | TypeScript catches missing keys |

**Key insight:** Content migration is a translation problem, not a technical problem. The infrastructure exists; the challenge is producing quality French content.

## Common Pitfalls

### Pitfall 1: Literal Translation Loses Empathy

**What goes wrong:** "Been burned by developers before?" becomes "Avez-vous ete brule par les developpeurs avant?" - grammatically correct but emotionally flat.

**Why it happens:** Automated translation or word-for-word translation doesn't capture idiomatic expressions or emotional register.

**How to avoid:**
- Use equivalent French idioms, not literal translations
- Test with native French speakers
- Focus on the emotion being conveyed, then find French expression that conveys it

**Better approach:**
- EN: "Been burned by developers before?"
- FR: "Vous en avez assez des developpeurs qui disparaissent?" (Have you had enough of developers who disappear?)
- Or: "Decu par des developpeurs dans le passe?" (Disappointed by developers in the past?)

### Pitfall 2: French Text Expansion Breaking Layout

**What goes wrong:** French text is 15-30% longer. "Services" -> "Services" (same), but "What I Do" -> "Ce que je fais" (longer).

**Why it happens:** UI designed with English word lengths in mind.

**How to avoid:**
1. Use flexible layouts (already done with Tailwind's flex/grid)
2. Test with French content before marking complete
3. Use `line-clamp` for preview text (already in place)
4. Consider shorter French alternatives where layout-critical

### Pitfall 3: Inconsistent Formality Level

**What goes wrong:** Mixing "tu" (informal) and "vous" (formal) forms creates jarring tone.

**Why it happens:** Different translators or translation passes use different registers.

**How to avoid:**
- Establish formality rule upfront: **Use "vous" (formal)** for professional credibility
- Review all French content for consistency
- The site uses "vous" in existing fr.json - maintain this

### Pitfall 4: Character Encoding Issues

**What goes wrong:** French accents display as garbled characters or question marks.

**Why it happens:** File encoding issues, missing UTF-8 declarations, or copy-paste from wrong sources.

**How to avoid:**
1. Ensure JSON files saved as UTF-8 (VS Code default)
2. Verify Next.js charset is UTF-8 (default in Next.js 16)
3. Don't copy from PDFs or Word docs (use plain text)
4. Test in browser, not just editor

**Warning signs:** Characters like `Ã©` instead of `e` (UTF-8 read as Latin-1)

### Pitfall 5: Missing Type Updates

**What goes wrong:** Add new translation keys but TypeScript doesn't catch missing French versions.

**Why it happens:** `TranslationKey` type is generated from en.json structure, but doesn't validate fr.json has same keys.

**How to avoid:**
1. Add new keys to both en.json and fr.json simultaneously
2. Use editor's JSON comparison feature
3. Consider runtime validation in dev mode

## Code Examples

### Example 1: Component Consuming Expanded Translations

```typescript
// src/components/sections/Hero.tsx
'use client'

import { useTranslations } from '@/lib/i18n'

export function Hero() {
  const t = useTranslations()

  const hoverBubbles = [
    { text: t('hero.bubbles.experience'), position: '...', bg: 'bg-amber-300' },
    { text: t('hero.bubbles.personality'), position: '...', bg: 'bg-lime-300' },
    { text: t('hero.bubbles.hungry'), position: '...', bg: 'bg-cyan-300' },
  ]

  return (
    <section>
      <h1>
        <Typewriter text={t('hero.title')} />
      </h1>
      <p>
        <Typewriter text={t('hero.subtitle')} />
      </p>
      <a href="#services">{t('hero.cta')}</a>
      {/* Bubbles render from array */}
    </section>
  )
}
```

### Example 2: Locale-Aware Data Access

```typescript
// src/components/sections/ProjectCard.tsx
'use client'

import { useLocale } from '@/lib/i18n'
import type { LocalizedProject } from '@/data/projects'

export function ProjectCard({ project }: { project: LocalizedProject }) {
  const { locale } = useLocale()
  const content = project.content[locale]

  return (
    <article>
      <h3>{project.title}</h3>
      <p>{content.tagline}</p>
    </article>
  )
}
```

### Example 3: Services Data with Locale Keys

```typescript
// src/data/services.ts
import type { Locale } from '@/lib/i18n'

interface Service {
  id: string
  number: string
  content: {
    [K in Locale]: {
      title: string
      description: string
      cursorText: string
    }
  }
}

export const services: Service[] = [
  {
    id: 'development',
    number: '01',
    content: {
      en: {
        title: 'Custom Development',
        description: "If you're tired of templates that don't fit...",
        cursorText: 'Like this site',
      },
      fr: {
        title: 'Developpement sur mesure',
        description: "Si vous en avez assez des templates qui ne conviennent pas...",
        cursorText: 'Comme ce site',
      },
    },
  },
  // ...
]
```

## Translation Guidelines

### Emotional Equivalence Map

Key phrases requiring emotional (not literal) translation:

| English | Emotion | French Equivalent (NOT literal) |
|---------|---------|--------------------------------|
| "Been burned by developers before?" | Validation of past pain | "Decu par des developpeurs dans le passe?" |
| "I get it." | Empathy, understanding | "Je comprends." (OK literal) |
| "promised the world" | Overpromising idiom | "promis monts et merveilles" (FR idiom) |
| "vanished when things got complicated" | Abandonment | "disparu quand les choses se compliquaient" |
| "another developer asking for your trust" | Self-awareness | "encore un developpeur qui vous demande de lui faire confiance" |
| "Let's skip the sales pitch" | Direct, no-BS | "Pas de baratin commercial" |
| "What you actually need" | Focus on them | "ce dont vous avez vraiment besoin" |
| "No ghosts here" | Play on "ghosting" | "Pas de disparition" or "Je reponds toujours" |

### Formality Standard

**Rule:** Use "vous" (formal) throughout
**Reason:** Professional services context, first impression, builds trust
**Consistency check:** Every "you" becomes "vous", every verb conjugates accordingly

### Accent Reference

Common French characters needed:
- e-acute: e (most common)
- e-grave: e
- e-circumflex: e
- a-grave: a
- c-cedilla: c
- u-circumflex: u
- i-circumflex: i
- o-circumflex: o

**Character codes for reference:**
- e = \\u00E9
- e = \\u00E8
- a = \\u00E0
- c = \\u00E7

JSON files support UTF-8 directly - no escape codes needed.

## Open Questions

Things that couldn't be fully resolved:

1. **Professional Translation vs. AI-Assisted**
   - What we know: AI translation (including Claude) can produce good drafts but may miss emotional nuance
   - What's unclear: Is the user's French proficiency sufficient to validate translations?
   - Recommendation: Produce best-effort translations, flag for human review before launch

2. **Project-Specific Technical Terms**
   - What we know: Terms like "Kanban", "FSRS", "OCR" are often kept in English in French tech writing
   - What's unclear: Which technical terms should be translated vs. kept as-is?
   - Recommendation: Keep widely-recognized English terms (Kanban, OCR, API), translate descriptive terms

3. **Brand Name "Civix Solutions"**
   - What we know: Brand name appears in footer
   - What's unclear: Should tagline be translated? ("Boutique frontend development")
   - Recommendation: Keep brand name, translate tagline ("Developpement frontend sur mesure" - already in fr.json)

## Content Inventory Summary

| Category | Count | Location | Migration Strategy |
|----------|-------|----------|-------------------|
| JSON keys needing accent fix | 15 | messages/fr.json | Direct edit |
| Hero hardcoded strings | 8 | Hero.tsx | Add to JSON, refactor component |
| Services hardcoded strings | 12 | Services.tsx | Create services data file with locale keys |
| Footer hardcoded strings | 8 | Footer.tsx | Add to JSON, refactor component |
| Projects UI strings | 10 | Projects.tsx, ProjectDetail.tsx | Add to JSON |
| Project data content | 20 paragraphs | projects.ts | Add locale-keyed content objects |
| Hover bubbles (Hero) | 3 | Hero.tsx | Add to JSON or localized constant |
| Hover bubbles (Projects) | 24 | Projects.tsx, ProjectDetail.tsx | Create locale-keyed bubble data |
| Cursor text | 15+ | Various | Add to JSON, update useCursorHover calls |

**Total estimated translatable strings:** ~90 unique strings

## Sources

### Primary (HIGH confidence)
- Codebase analysis: Direct reading of `messages/en.json`, `messages/fr.json`, all component files
- Phase 6 Research: `.planning/phases/06-translation-infrastructure/06-RESEARCH.md` - i18n architecture decisions
- Phase 7 Verification: `.planning/phases/07-language-switcher/07-VERIFICATION.md` - confirms working infrastructure

### Secondary (MEDIUM confidence)
- French translation best practices: General knowledge of FR/EN localization standards
- Text expansion ratios: Standard localization guidance (15-30% for French)

### Tertiary (LOW confidence)
- Emotional equivalence translations: Suggested translations should be validated by French speaker

## Metadata

**Confidence breakdown:**
- Current infrastructure: HIGH - Direct codebase analysis confirms working i18n system
- Content inventory: HIGH - Exhaustive file-by-file analysis completed
- Architecture patterns: HIGH - Standard React i18n patterns, aligned with Phase 6 decisions
- Translation quality guidance: MEDIUM - Best practices documented, actual translations need validation

**Research date:** 2026-02-03
**Valid until:** Indefinite for infrastructure, translations should be reviewed by native speaker
