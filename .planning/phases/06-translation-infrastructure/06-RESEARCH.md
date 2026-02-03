# Phase 6: Translation Infrastructure - Research

**Researched:** 2026-02-03
**Domain:** Custom React Context i18n with TypeScript type safety
**Confidence:** HIGH

## Summary

Phase 6 establishes the technical foundation for instant language switching with type-safe translations. The approach uses a custom React Context solution (~50-70 lines of code) instead of i18n libraries, which is the right choice for this portfolio's specific requirements: instant client-side switching without page reload, no URL-based routing, and no persistence.

The critical technical challenge is achieving TypeScript compile-time safety for translation keys. TypeScript's `resolveJsonModule` infers loose `string` types from JSON imports, not literal types. The solution is to create a TypeScript declaration file (`.d.ts`) that types the translation structure, enabling autocomplete and compile-time errors for misspelled keys.

The implementation follows established React patterns: LocaleProvider wraps the app, exposes `locale` and `setLocale` via context, and provides a type-safe `t()` function for retrieving translations. Browser language detection runs once on mount using `navigator.language`.

**Primary recommendation:** Build a minimal custom i18n system with three files: `lib/i18n.tsx` (provider + hooks), `messages/en.json`, `messages/fr.json`, plus a `types/i18n.d.ts` for type safety.

## Standard Stack

The established approach for this domain (custom i18n with instant switching):

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| React Context | React 19.2 (existing) | Locale state management | Zero dependencies, instant re-renders, standard React pattern |
| JSON translation files | N/A | Translation storage | Simple key-value, version-controlled, type-inferrable |
| `navigator.language` | Browser API | Initial locale detection | Native, no library needed, works everywhere |
| TypeScript declaration file | TypeScript 5.x | Type-safe keys | Compile-time errors for missing/misspelled keys |

### Supporting
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| `as const` assertion | TypeScript 5.x | Literal type inference | If importing translations in TypeScript file |
| Type utility for nested keys | TypeScript 5.x | Dot-notation path types | For nested JSON structure (e.g., `hero.title`) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom Context | next-intl | next-intl requires `router.refresh()` for locale changes - breaks instant switching requirement |
| Custom Context | react-i18next | 22kb bundle, overkill for 2-language portfolio with ~60 strings |
| Custom Context | typesafe-i18n | Good library but adds dependency for what's ~50 lines of code |
| JSON files | TypeScript files with `as const` | Better type inference but less common pattern, harder to edit |

**Installation:**
```bash
# No packages needed - uses existing React 19.2 and TypeScript 5.x
# Just create the files:
mkdir -p messages
touch messages/en.json messages/fr.json
touch src/lib/i18n.tsx
touch src/types/i18n.d.ts
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   └── i18n.tsx            # LocaleProvider, useLocale, useTranslations hooks (~50-70 lines)
├── types/
│   └── i18n.d.ts           # Type declarations for translation keys
├── app/
│   └── layout.tsx          # Wraps children with LocaleProvider
└── components/
    └── ...                 # Components use useTranslations() hook

messages/
├── en.json                 # English translations (source of truth)
└── fr.json                 # French translations (must match en.json keys)
```

### Pattern 1: LocaleProvider with Type-Safe Translation Function

**What:** React Context provider that manages locale state and provides typed `t()` function
**When to use:** Always - this is the core pattern for the entire i18n system

**Example:**
```typescript
// src/lib/i18n.tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import en from '../../messages/en.json'
import fr from '../../messages/fr.json'
import type { TranslationKey } from '@/types/i18n'

type Locale = 'en' | 'fr'

const messages = { en, fr } as const

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  // Browser language detection on mount (client-side only)
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]
    if (browserLang === 'fr') {
      setLocale('fr')
    }
  }, [])

  // Type-safe translation function with nested key support
  const t = useCallback((key: TranslationKey): string => {
    const keys = key.split('.')
    let value: unknown = messages[locale]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        // Return key as fallback (visible in UI = obvious bug)
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return { locale: context.locale, setLocale: context.setLocale }
}

export function useTranslations() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useTranslations must be used within LocaleProvider')
  }
  return context.t
}
```

### Pattern 2: Type-Safe Translation Keys with Nested Paths

**What:** TypeScript utility type that generates union of all valid dot-notation paths
**When to use:** When using nested JSON structure (recommended for organization)

**Example:**
```typescript
// src/types/i18n.d.ts
import type en from '../../messages/en.json'

// Utility type: generates union of all nested paths
// e.g., "hero.title" | "hero.subtitle" | "nav.services" | ...
type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`
    }[keyof T & string]
  : never

// Export the union type of all valid translation keys
export type TranslationKey = NestedKeyOf<typeof en>

// Ensure fr.json matches en.json structure (optional but recommended)
export type Messages = typeof en
```

### Pattern 3: Translation JSON Structure (Nested with Namespaces)

**What:** Organize translations by component/section with nested structure
**When to use:** Always - provides organization and enables scoped types

**Example:**
```json
// messages/en.json
{
  "hero": {
    "title": "Been burned by developers before?",
    "subtitle": "I get it. You hired someone who promised..."
  },
  "nav": {
    "services": "Services",
    "projects": "Projects",
    "contact": "Contact"
  },
  "services": {
    "title": "What I Do",
    "development": {
      "title": "Custom Development",
      "description": "If you're tired of templates..."
    }
  },
  "contact": {
    "title": "Let's Talk",
    "name_label": "Name",
    "name_placeholder": "Your name",
    "submit": "Send It",
    "sending": "Sending...",
    "success": "Sent! I'll be in touch soon."
  },
  "cursor": {
    "thats_me": "That's me!",
    "what_ill_do": "What I'll Do",
    "what_ive_done": "What I've Done"
  }
}
```

### Anti-Patterns to Avoid

- **Flat keys without namespaces:** `"heroTitle"` instead of `"hero.title"` - loses organization, harder to maintain
- **Translating in data files:** Don't import `t()` in `projects.ts` - keep data locale-agnostic, translate in components
- **Using `router.refresh()`:** Never trigger navigation for language switch - breaks instant switching
- **Mixing client/server patterns:** This is purely client-side - don't add server actions or cookies for locale
- **Over-abstracting:** Don't build a "translation system" - build exactly what's needed for this portfolio

## Don't Hand-Roll

Problems that look simple but have edge cases:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Nested object path traversal | Custom recursive function | Established pattern (shown above) | Edge cases with arrays, undefined checks, type narrowing |
| Type-safe nested keys | Manual union type | `NestedKeyOf<T>` utility type | Recursive mapped types are tricky, use proven pattern |
| Language detection cascade | Complex detection logic | Simple `navigator.language.split('-')[0]` | Spec says browser only, no fallback cascade needed |

**Key insight:** This phase is infrastructure only. Keep it minimal. The complexity is in getting types right, not in features.

## Common Pitfalls

### Pitfall 1: JSON Import Types Are Loose

**What goes wrong:** TypeScript infers `string` for JSON values, not literal types. `t("hero.title")` won't error even if key doesn't exist.

**Why it happens:** `resolveJsonModule` was designed for data, not type inference. JSON has no `as const` equivalent.

**How to avoid:** Create a `.d.ts` file that imports the JSON and exports typed paths. The `NestedKeyOf` utility generates the union of all valid keys.

**Warning signs:** No autocomplete for translation keys, no compile error for typos.

### Pitfall 2: Missing Key Returns Key String (Silent Failure)

**What goes wrong:** Typo in translation key (`t("hero.tilte")`) shows "hero.tilte" in UI instead of translated text.

**Why it happens:** Fallback behavior returns the key when not found. In production, users see raw keys.

**How to avoid:**
1. TypeScript types catch at compile time (primary defense)
2. In development, add console.warn for missing keys
3. Establish convention: if you see dots in UI text, it's a bug

**Warning signs:** Text containing dots appearing in rendered UI.

### Pitfall 3: Hydration Mismatch on Initial Load

**What goes wrong:** Server renders with 'en' (default), client detects 'fr' from browser, React hydration mismatch warning.

**Why it happens:** `navigator.language` is only available client-side. Server has no browser context.

**How to avoid:**
1. Accept brief flash of English before French on first visit (acceptable for this use case)
2. Or use `suppressHydrationWarning` on the html element
3. Or render null/loading state until client-side locale is determined

**Warning signs:** React hydration error in console on French browser first visit.

### Pitfall 4: French Text Expansion Breaks Layout

**What goes wrong:** French text is 15-30% longer than English. Buttons overflow, cards break, text wraps unexpectedly.

**Why it happens:** Layouts designed for English word lengths. French has longer words and phrases.

**How to avoid:** This is a Phase 8 concern (content migration), but infrastructure should support it:
1. Use flexible layouts (Tailwind's `flex`, `grid`)
2. Avoid fixed widths on text containers
3. Test with French content early

**Warning signs:** Ellipsis, overflow, or broken layouts when viewing French.

### Pitfall 5: Context Provider Not at Root

**What goes wrong:** `useTranslations` throws "must be used within LocaleProvider" error in some components.

**Why it happens:** LocaleProvider must wrap all components that use translations. If added too deep in tree, some components are outside.

**How to avoid:** Add LocaleProvider in `app/layout.tsx` at the highest level, wrapping all other providers.

**Warning signs:** Error thrown when adding translations to new component.

## Code Examples

Verified patterns from React 19.2 and TypeScript 5.x:

### Layout Integration

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { LocaleProvider } from '@/lib/i18n'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { CursorProvider, CustomCursor } from '@/components/cursor'
// ... other imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={/* fonts */}>
      <body className="bg-base-950 text-text-primary">
        <LocaleProvider>
          <MotionProvider>
            <CursorProvider>
              <CustomCursor />
              {children}
            </CursorProvider>
          </MotionProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
```

Note: The `lang="en"` is hardcoded initially. Phase 7 (Language Switcher) will make this dynamic.

### Component Usage

```typescript
// Example: Navigation.tsx (Phase 7+ integration)
'use client'
import { useTranslations } from '@/lib/i18n'

export function Navigation() {
  const t = useTranslations()

  return (
    <nav>
      <a href="#services">{t('nav.services')}</a>
      <a href="#projects">{t('nav.projects')}</a>
      {/* Language switcher added in Phase 7 */}
    </nav>
  )
}
```

### Matching Translation Files

```json
// messages/en.json (source of truth)
{
  "nav": {
    "services": "Services",
    "projects": "Projects",
    "contact": "Contact"
  }
}

// messages/fr.json (must match structure exactly)
{
  "nav": {
    "services": "Services",
    "projects": "Projets",
    "contact": "Contact"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| i18n libraries for everything | Custom Context for client-only switching | 2024+ | Libraries overkill for simple use cases |
| Flat translation keys | Nested JSON with typed paths | TypeScript 4.1+ (template literals) | Better organization, type safety |
| Runtime key validation | Compile-time TypeScript checking | TypeScript 4.1+ | Errors caught before deployment |
| next.config.js i18n | Library or custom (App Router) | Next.js 13+ | Built-in i18n removed from App Router |

**Deprecated/outdated:**
- `next.config.js` `i18n` field: Removed in App Router, only works with Pages Router
- `next-i18next`: Built for Pages Router, incompatible with App Router
- `useRouter().locale`: Does not exist in App Router's `next/navigation`

## Open Questions

Things that couldn't be fully resolved for this phase:

1. **HTML lang attribute updates**
   - What we know: The `<html lang>` attribute should update when locale changes
   - What's unclear: Should this be in LocaleProvider (Phase 6) or LanguageSwitch (Phase 7)?
   - Recommendation: Add to Phase 7 when building the switcher, since Phase 6 has no UI for changing locale

2. **Initial flash of English content**
   - What we know: Server renders 'en', browser detection happens client-side, brief flash possible
   - What's unclear: Is this acceptable UX for this portfolio?
   - Recommendation: Accept it - portfolio loads fast, flash is minimal, alternative (loading state) is worse

## Sources

### Primary (HIGH confidence)
- React Context API - Standard React 19.2 pattern, used throughout existing codebase
- TypeScript `resolveJsonModule` - Enabled in existing tsconfig.json, verified working
- [TypeScript i18next documentation](https://www.i18next.com/overview/typescript) - Pattern for type-safe keys with declaration files
- [Making your translation keys type-safe in React](https://lingual.dev/blog/making-your-translation-keys-type-safe-in-react-typescript/) - NestedKeyOf utility type pattern

### Secondary (MEDIUM confidence)
- [Type-Safe i18n in Next.js Guide](https://medium.com/@sir.raminyavari/type-safe-i18n-in-next-js-a-complete-guide-6514fead4c3c) - Custom i18n approach validation
- [typesafe-i18n GitHub](https://github.com/codingcommons/typesafe-i18n) - Type utility patterns reference
- Prior project research: `.planning/research/STACK-I18N.md`, `ARCHITECTURE-I18N.md`, `PITFALLS.md` - Domain-specific decisions

### Tertiary (LOW confidence)
- Browser detection with `navigator.language` - Simple API, but verify cross-browser behavior in testing

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Uses existing React patterns and TypeScript, no new dependencies
- Architecture: HIGH - Follows established Context pattern used in CursorContext.tsx
- Pitfalls: HIGH - Well-documented in prior research, mostly type-related
- Type safety implementation: MEDIUM - NestedKeyOf pattern is proven but complex, needs careful implementation

**Research date:** 2026-02-03
**Valid until:** Indefinite (pure TypeScript/React patterns, no library versions to track)
