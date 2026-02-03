# Stack Research: i18n Additions

**Milestone:** Internationalization (English/French)
**Focus:** Instant client-side switching without page reload
**Researched:** 2026-02-03
**Confidence:** HIGH

---

## Executive Summary

For a single-page portfolio with instant client-side language switching (no reload), **skip the i18n libraries entirely**. Use a lightweight custom React Context solution with ~50 lines of code. This avoids the complexity of next-intl's server-side configuration while delivering exactly what you need.

The heavyweight libraries (next-intl, react-i18next) are designed for multi-page apps with SEO requirements and localized URLs. A single-page portfolio with instant switching is a fundamentally different use case.

---

## Recommended Stack Additions

### Primary Approach: Custom React Context (No Library)

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| React Context + useState | React 19.2 (existing) | Locale state management | Zero dependencies, instant switching, ~50 lines |
| JSON translation files | N/A | Translation storage | Simple key-value pairs |
| `navigator.language` | Browser API | First-visit detection | Native browser API, no library needed |

**Why this approach:**

1. **Instant switching** - React state change re-renders immediately, no network request or router navigation
2. **Zero bundle cost** - No i18n library to ship
3. **Full control** - No fighting library assumptions about routing
4. **Matches requirements** - "No persistence needed" + "instant switching" = pure client state

---

## Implementation Architecture

```
/messages/
  en.json          # {"hero.title": "Welcome", ...}
  fr.json          # {"hero.title": "Bienvenue", ...}

/lib/
  i18n.tsx         # LocaleProvider + useTranslations hook (~50 lines)

/components/
  language-switch.tsx  # Toggle button
```

---

## Core Implementation (~50 lines)

```typescript
// lib/i18n.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from '@/messages/en.json'
import fr from '@/messages/fr.json'

type Locale = 'en' | 'fr'
type Messages = typeof en

const messages: Record<Locale, Messages> = { en, fr }

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: keyof Messages) => string
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  // Browser language detection on first render (client-side only)
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]
    if (browserLang === 'fr') setLocale('fr')
  }, [])

  const t = (key: keyof Messages) => messages[locale][key] ?? key

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useTranslations must be used within LocaleProvider')
  return context
}
```

---

## Browser Detection Strategy

| Priority | Source | Notes |
|----------|--------|-------|
| 1 | `navigator.language` | Check on mount, split to get primary language code |
| 2 | Fall back to 'en' | Default for unsupported languages |

No cookie/localStorage needed per requirements ("No persistence needed").

---

## Integration with Existing Stack

### Layout Integration

```typescript
// app/layout.tsx
import { LocaleProvider } from '@/lib/i18n'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
```

### Component Usage

```typescript
// Any client component
'use client'
import { useTranslations } from '@/lib/i18n'

export function Hero() {
  const { t } = useTranslations()
  return <h1>{t('hero.title')}</h1>
}
```

### Language Switch Component

```typescript
// components/language-switch.tsx
'use client'
import { useTranslations } from '@/lib/i18n'

export function LanguageSwitch() {
  const { locale, setLocale } = useTranslations()

  return (
    <button onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}>
      {locale === 'en' ? 'FR' : 'EN'}
    </button>
  )
}
```

### With React 19.2 View Transitions (Optional Enhancement)

```typescript
const { locale, setLocale } = useTranslations()

const handleSwitch = () => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      setLocale(locale === 'en' ? 'fr' : 'en')
    })
  } else {
    setLocale(locale === 'en' ? 'fr' : 'en')
  }
}
```

---

## Translation File Structure

### Recommended: Flat keys with namespace prefixes

```json
// messages/en.json
{
  "hero.title": "Building Government Technology",
  "hero.subtitle": "Innovative solutions for public sector challenges",
  "nav.home": "Home",
  "nav.services": "Services",
  "nav.contact": "Contact",
  "services.title": "Our Services",
  "contact.title": "Get in Touch",
  "contact.submit": "Send Message"
}
```

**Why flat keys:**
- TypeScript autocomplete works directly with `keyof typeof messages`
- No nested access errors at runtime
- Easy to scan and maintain
- Natural namespacing via dot notation

### Type Safety

```typescript
// Type is automatically inferred from en.json
type TranslationKey = keyof typeof import('@/messages/en.json')

// Usage in hook provides autocomplete
const t = (key: TranslationKey) => messages[locale][key]
```

---

## What NOT to Use (And Why)

### next-intl (v4.8.2)

**Stats:** 931k weekly downloads, 3,700+ GitHub stars

**Why avoid for this project:**
- Designed for apps needing localized URLs (`/en/about`, `/fr/about`)
- "Without i18n routing" mode still requires `router.refresh()` for locale changes
- Adds ~7kb to bundle for features you won't use
- Requires `proxy.ts` configuration in Next.js 16
- Server-side translation rendering adds complexity

**When to use instead:** Multi-page apps, SEO requirements, hreflang tags, localized URLs

**Source:** [next-intl docs](https://next-intl.dev/docs/getting-started/app-router) - Client-side switching confirmed to require refresh. [GitHub discussion #1096](https://github.com/amannn/next-intl/discussions/1096) confirms limitation.

### react-i18next (v22kb bundle)

**Why avoid:**
- Framework-agnostic, not optimized for Next.js App Router
- 22kb total bundle (i18next + react-i18next)
- Complex configuration with plugins
- Overkill for 2-language portfolio

**When to use instead:** Multi-framework projects, complex translation management systems

**Source:** [i18n library comparison 2025](https://medium.com/better-dev-nextjs-react/the-best-i18n-libraries-for-next-js-app-router-in-2025-21cb5ab2219a)

### next-i18next

**Why avoid:**
- Built for Pages Router, explicitly incompatible with App Router
- Maintainers recommend react-i18next for App Router instead

**Source:** [i18nexus tutorial](https://i18nexus.com/tutorials/nextjs/react-i18next)

### i18next-browser-languagedetector

**Why avoid:**
- Standalone package for complex detection cascades
- You only need `navigator.language` - 3 lines of code
- Unnecessary dependency

---

## Alternative: Upgrade Path to next-intl

If requirements change to include:
- Localized URLs (`/en/about`, `/fr/about`)
- Server-side rendering of translations for SEO
- hreflang tags for search engines
- More than 2 languages

Then upgrade to next-intl:

```bash
npm install next-intl
```

| Technology | Version | Purpose |
|------------|---------|---------|
| next-intl | ^4.8.2 | Full i18n framework |

**Migration path:** Extract translation JSON files, wrap with NextIntlClientProvider, add [locale] route segment.

**Note:** Even with next-intl, "instant" switching still requires `router.refresh()`. The library is designed for URL-based locale, not pure client state.

---

## Compatibility Notes

### Next.js 16 App Router

- **No proxy.ts needed** - Pure client-side, no server involvement
- **No routing changes** - Single page stays single page
- **Works with Server Components** - Wrap LocaleProvider at layout level
- **Compatible with Turbopack** - No special configuration

### React 19.2

- **Standard Context API** - No changes needed
- **View Transitions** - Optional enhancement for smooth language switch
- **Concurrent features** - Context updates batch naturally

### Existing shadcn/ui Components

- Components need `'use client'` directive to use `useTranslations()`
- Or pass translated strings as props from parent client component

### Motion Animations

- Translation changes trigger re-render
- Wrap in `AnimatePresence` if exit animations desired on language switch

---

## Installation Commands

**None required.** The solution uses only existing dependencies:

- React 19.2 (Context API, useState, useEffect)
- TypeScript (type inference from JSON imports)

**Files to create:**

```bash
# Translation files
touch messages/en.json messages/fr.json

# i18n provider
touch lib/i18n.tsx

# Language switch component
touch components/language-switch.tsx
```

---

## Confidence Assessment

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| Skip next-intl | HIGH | Requirements explicitly state "instant switching without reload" - next-intl requires refresh per official docs |
| Custom Context approach | HIGH | Standard React pattern, zero dependencies, matches exact requirements |
| navigator.language detection | HIGH | Native API, well-supported, sufficient for 2-language support |
| Flat translation keys | HIGH | Better TypeScript support, common pattern |
| No persistence | HIGH | Explicit requirement - "No persistence needed" |

---

## Sources

- [next-intl official docs](https://next-intl.dev/docs/getting-started/app-router) - Confirmed refresh requirement for locale switching
- [next-intl 4.0 release](https://next-intl.dev/blog/next-intl-4-0) - Latest version (March 2025), features documented
- [GitHub discussion #1096](https://github.com/amannn/next-intl/discussions/1096) - Community confirms client-side switching limitation
- [Medium: i18n without libraries](https://medium.com/@wjdwoeotmd/implementing-internationalization-in-next-js-without-external-libraries-6b51304722b8) - Custom Context pattern validation
- [i18n library comparison 2025](https://medium.com/better-dev-nextjs-react/the-best-i18n-libraries-for-next-js-app-router-in-2025-21cb5ab2219a) - next-intl vs react-i18next analysis
- [Browser language detection guide](https://dev.to/lingodotdev/every-way-to-detect-a-users-locale-from-best-to-worst-369i) - navigator.language best practices
- npm registry: `npm view next-intl version` = 4.8.2 (verified 2026-02-03)
