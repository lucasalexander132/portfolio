# Architecture Research: i18n Integration

**Project:** Portfolio i18n (English/French)
**Researched:** 2026-02-03
**Confidence:** HIGH (verified with official next-intl documentation)

## Executive Summary

For a single-page portfolio with instant client-side language switching (no URL change, no page reload), the recommended architecture is **next-intl without i18n routing**, using a cookie-based locale with React context for instant switching.

Two viable approaches exist:
1. **next-intl without routing** (recommended) - Cookie-based locale, server action to persist, client-side state for instant UI update
2. **Pure react-i18next** - Simpler but loses Server Component benefits, requires hydrating all translations to client

The key architectural insight: **Decouple the persistent locale (cookie) from the visual locale (context state)**. The cookie ensures the correct locale on page load, while React context enables instant switching without round-trips.

---

## Integration Approach

### Recommended: Hybrid Cookie + Context Pattern

Since the portfolio is a single-page app without route changes, we avoid next-intl's URL-based routing entirely. Instead:

1. **Cookie** stores the user's preferred locale (persists across sessions)
2. **React Context** holds the active locale (enables instant switching)
3. **Server Action** syncs the cookie when locale changes
4. **NextIntlClientProvider** receives locale from context, re-renders translations

```
User clicks language toggle
        |
        v
LocaleContext.setLocale('fr')  <-- Instant UI update
        |
        v
Server Action sets cookie       <-- Async, for persistence
        |
        v
Next page load reads cookie     <-- Correct locale on refresh
```

### Why Not URL-Based Routing?

URL-based routing (`/en/...`, `/fr/...`) is the standard next-intl approach, but it's unsuitable here because:

- **Single-page portfolio**: No route navigation means URL locale prefixes add complexity without benefit
- **Instant switching requirement**: URL changes trigger navigation, causing state loss and animation interruption
- **SEO consideration**: For a portfolio, having a single URL structure is acceptable (primary audience is direct visitors, not search engines seeking French content)

### Why Not Pure react-i18next?

While react-i18next with `i18n.changeLanguage()` provides instant switching out of the box, it:

- Requires shipping all translations to the client (bundle size)
- Loses Server Component benefits (the portfolio uses mostly server components)
- Requires more setup to work well with Next.js 16 App Router

---

## Component Structure Changes

### Current Architecture

```
RootLayout (Server)
  |
  +-- MotionProvider (Client - 'use client')
      |
      +-- CursorProvider (Client - 'use client')
          |
          +-- Page (Client - 'use client')
              |
              +-- Navigation (Client)
              +-- Hero (Client)
              +-- Services (Client)
              +-- Projects (Client)
              +-- Footer (Client)
```

**Observation:** The page.tsx is already a Client Component. This simplifies i18n integration since translations can flow through context.

### Proposed Architecture

```
RootLayout (Server)
  |
  +-- NextIntlClientProvider (messages from server)
      |
      +-- LocaleProvider (Client - new, manages locale state)
          |
          +-- MotionProvider (Client)
              |
              +-- CursorProvider (Client)
                  |
                  +-- Page (Client)
                      |
                      +-- LanguageToggle (Client - new)
                      +-- Navigation (Client - uses useTranslations)
                      +-- Hero (Client - uses useTranslations)
                      +-- Services (Client - uses useTranslations)
                      +-- Projects (Client - uses useTranslations)
                      +-- Footer (Client - uses useTranslations)
```

### New Components Needed

| Component | Type | Purpose |
|-----------|------|---------|
| `LocaleProvider` | Client | Manages locale state, provides `setLocale()` |
| `LanguageToggle` | Client | UI for switching EN/FR |

### Component Modifications Needed

| Component | Changes |
|-----------|---------|
| `layout.tsx` | Wrap with NextIntlClientProvider, add LocaleProvider |
| `Navigation.tsx` | Add LanguageToggle, use `useTranslations()` for labels |
| `Hero.tsx` | Use `useTranslations()` for headline, subtext |
| `Services.tsx` | Use `useTranslations()` for service titles/descriptions |
| `Projects.tsx` | Use `useTranslations()` for UI labels |
| `Footer.tsx` | Use `useTranslations()` for footer text |
| `ContactForm.tsx` | Use `useTranslations()` for form labels |
| `data/projects.ts` | Convert to translation keys or localized data structure |

---

## Data Flow

### Translation File Structure

```
/messages
  +-- en.json
  +-- fr.json
```

**Message structure** (namespace-based):

```json
{
  "Navigation": {
    "services": "Services",
    "projects": "Projects",
    "contact": "Contact"
  },
  "Hero": {
    "headline": "Been burned by developers before?",
    "subtext": "I get it. You hired someone who promised..."
  },
  "Services": {
    "intro": "Every project starts with a conversation...",
    "development": {
      "title": "Custom Development",
      "description": "If you're tired of templates..."
    }
  }
}
```

### Data Flow Diagram

```
                    Server Side                          Client Side
                    -----------                          -----------

messages/en.json --+
                   +--> i18n/request.ts --> getMessages() --> NextIntlClientProvider
messages/fr.json --+        |                                      |
                            |                                      v
                     reads cookie              LocaleProvider (locale state)
                     for initial                       |
                     locale                            v
                                               useTranslations('Hero')
                                                       |
                                                       v
                                               t('headline') --> "Been burned..."
```

### Instant Switching Flow

```
1. User clicks "FR" toggle

2. LocaleProvider.setLocale('fr')
   - Updates context state immediately
   - UI re-renders with French translations

3. Server Action: setLocaleCookie('fr')
   - Runs async, doesn't block UI
   - Sets cookie for next page load

4. NextIntlClientProvider re-renders
   - Receives new locale from context
   - All useTranslations() calls return French
```

### Key Implementation: LocaleProvider

```typescript
// src/providers/LocaleProvider.tsx
'use client'

import { createContext, useContext, useState, useTransition } from 'react'
import { setLocaleCookie } from '@/actions/locale'

type Locale = 'en' | 'fr'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  isPending: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  children,
  initialLocale
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [isPending, startTransition] = useTransition()

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale) // Instant UI update
    startTransition(async () => {
      await setLocaleCookie(newLocale) // Async persistence
    })
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, isPending }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used within LocaleProvider')
  return context
}
```

### Server Action for Cookie Persistence

```typescript
// src/actions/locale.ts
'use server'

import { cookies } from 'next/headers'

export async function setLocaleCookie(locale: string) {
  const store = await cookies()
  store.set('locale', locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })
}
```

---

## Critical Implementation Detail: NextIntlClientProvider with Dynamic Locale

The standard next-intl setup reads locale once on the server. For instant client-side switching, we need to make NextIntlClientProvider reactive to locale changes.

### Option A: Key-Based Remount (Simpler, Recommended)

```typescript
// src/app/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { cookies } from 'next/headers'

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value || 'en'
  const messages = await getMessages({ locale })

  // Note: Both EN and FR messages loaded for instant switching
  const allMessages = {
    en: (await import('../../messages/en.json')).default,
    fr: (await import('../../messages/fr.json')).default,
  }

  return (
    <html lang={locale}>
      <body>
        <LocaleProvider initialLocale={locale}>
          <LocaleAwareIntlProvider allMessages={allMessages}>
            {children}
          </LocaleAwareIntlProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
```

```typescript
// src/providers/LocaleAwareIntlProvider.tsx
'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useLocale } from './LocaleProvider'

export function LocaleAwareIntlProvider({
  children,
  allMessages,
}: {
  children: React.ReactNode
  allMessages: Record<string, Record<string, unknown>>
}) {
  const { locale } = useLocale()

  return (
    <NextIntlClientProvider
      key={locale}  // Forces remount on locale change
      locale={locale}
      messages={allMessages[locale]}
    >
      {children}
    </NextIntlClientProvider>
  )
}
```

**Trade-off:** The `key={locale}` causes a full remount of the provider subtree. For a single-page portfolio, this is acceptable since:
- Component state resets (minor issue for a portfolio)
- Animations will replay (actually desirable - fresh entrance)
- All translations update atomically

### Option B: Custom Message Switching (More Complex)

For apps where remount is unacceptable, you'd need to implement custom message switching logic. This is overkill for a portfolio.

---

## Build Order

Based on the existing architecture and dependencies, implement in this order:

### Phase 1: Foundation (No Visual Changes)

1. **Install next-intl**
   ```bash
   npm install next-intl
   ```

2. **Create translation files**
   - `/messages/en.json` - Extract existing English strings
   - `/messages/fr.json` - Add French translations

3. **Configure next-intl plugin**
   - Update `next.config.ts`
   - Create `src/i18n/request.ts`

4. **Create LocaleProvider**
   - `src/providers/LocaleProvider.tsx`
   - `src/actions/locale.ts` (server action)

5. **Update RootLayout**
   - Add NextIntlClientProvider
   - Add LocaleProvider
   - Read initial locale from cookie

**Verification:** App still works, no visual changes yet.

### Phase 2: Navigation Integration

6. **Create LanguageToggle component**
   - Simple EN/FR toggle button
   - Uses `useLocale()` hook

7. **Add toggle to Navigation**
   - Position in navbar
   - Test instant switching works

8. **Extract Navigation strings**
   - Replace hardcoded labels with `t()` calls

**Verification:** Language toggle visible, Navigation labels switch instantly.

### Phase 3: Content Migration

9. **Hero section**
   - Extract headline, subtext to translations
   - Handle Typewriter component with translated strings

10. **Services section**
    - Extract service data to translations
    - Consider keeping structure in code, text in messages

11. **Footer section**
    - Extract all text content

12. **ContactForm**
    - Extract form labels and placeholders

**Verification:** All static content switches between EN/FR.

### Phase 4: Dynamic Content

13. **Projects data**
    - Option A: Keep in code with locale-aware getter
    - Option B: Move to translation files
    - Recommended: Hybrid - structure in code, localized text in messages

14. **Cursor hover text**
    - Update cursor context to use translations
    - Extract all hover text strings

15. **Browser language detection**
    - On first visit, detect `navigator.language`
    - Set appropriate locale if no cookie exists

**Verification:** Complete i18n coverage, browser detection works.

---

## Integration Points with Existing Code

### MotionProvider Compatibility

The MotionProvider wraps children without modification. Locale switching happens above it in the tree, so animations will continue working. The key consideration is that Motion components using `AnimatePresence` should handle key changes gracefully when locale switches.

**With key-based remount:** Animations replay from initial state - this is fine for a portfolio.

### CursorProvider Integration

Cursor hover text (e.g., "What I'll Do", "See Code") needs translation. Two options:

**Option A: Pass translated strings to cursor hooks** (Recommended)
```typescript
const t = useTranslations('Cursor')
const cursorProps = useCursorHover('text', t('services'))
```

**Option B: Translate in CursorContext**
```typescript
// CursorContext receives translations via prop
```

Recommended: **Option A** - keeps translation logic in components, cursor system stays generic.

### Typewriter Component

The Typewriter in Hero.tsx types out text character by character. When locale switches:

**With key-based remount:** Typewriter automatically restarts with new text - this is the desired behavior.

```tsx
// No special handling needed if using key={locale} on provider
<Typewriter
  text={t('Hero.headline')}
  speed={70}
/>
```

If NOT using key-based remount, you'd need:
```tsx
const { locale } = useLocale()
<Typewriter
  key={locale} // Forces remount on locale change
  text={t('Hero.headline')}
  speed={70}
/>
```

### Data Files (projects.ts)

Current structure uses hardcoded English strings. Recommended approach:

**Hybrid: Structure in Code, Text in Messages**
```typescript
// projects.ts - structure only
export const projects = [
  {
    id: 'codex-grove',
    technologies: ['Next.js', 'TypeScript', ...],
    thumbnail: '/images/codex-grove-logo.png',
    images: [...],
    status: 'coming-soon',
  }
]

// Component usage
const t = useTranslations('Projects')
const project = projects[0]
const title = t(`${project.id}.title`)  // 'Projects.codex-grove.title'
```

```json
// messages/en.json
{
  "Projects": {
    "codex-grove": {
      "title": "Codex Grove",
      "tagline": "Knowledge management platform with AI-powered documentation assistant",
      "challenge": "Organizations struggle with scattered documentation...",
      "approach": "Building a unified platform...",
      "result": "Shipping with over 220K+ lines..."
    }
  }
}
```

---

## Server vs Client Component Considerations

### Current State

Most components are Client Components (`'use client'`). This is intentional for the portfolio's rich interactivity (Motion animations, cursor effects, state management).

### Translation Strategy

Since components are already client-side, use `useTranslations()` hook throughout:

```typescript
'use client'
import { useTranslations } from 'next-intl'

export function Hero() {
  const t = useTranslations('Hero')
  return <h1>{t('headline')}</h1>
}
```

### Message Bundle Size

All messages are sent to the client (via NextIntlClientProvider). For EN/FR with portfolio content, this is approximately 2-5KB gzipped - acceptable for a single-page portfolio.

**Important:** Both locale message sets are loaded on the server and passed to the client for instant switching capability.

---

## Technical Constraints

### Next.js 16 Specifics

- `proxy.ts` replaces `middleware.ts` (but not needed for cookie-only approach)
- Async params: Not relevant for single-page app
- React Compiler enabled in this project: Ensure translation hooks work with compiler (next-intl is compatible)

### Cookie Considerations

- HttpOnly: Not needed (client reads via Server Component)
- Secure: Enable in production
- SameSite: Lax (default, fine for this use case)
- Max-Age: 1 year recommended

### SSR and First Paint

1. Server reads locale cookie
2. Server renders with correct locale
3. Client hydrates with same locale
4. No flash of wrong language (if cookie exists)

For first-time visitors (no cookie):
1. Server uses default locale (English)
2. Client detects browser language
3. If French preferred, updates locale
4. Brief flash acceptable, or implement loading state

---

## Anti-Patterns to Avoid

### 1. URL-Based Routing for Single Page

**Don't:** Use `/[locale]/page.tsx` structure
**Why:** Adds complexity, breaks instant switching, unnecessary for single page

### 2. Translating in Data Files

**Don't:** Import `t()` in `projects.ts`
**Why:** Data files should be locale-agnostic; translation happens in components

### 3. Blocking UI on Cookie Update

**Don't:** `await setLocaleCookie()` before updating UI state
**Why:** Adds latency; cookie is for persistence, not real-time state

### 4. Full Page Reload on Switch

**Don't:** Use `router.refresh()` or `window.location.reload()`
**Why:** Defeats instant switching purpose, loses animation state

### 5. Separate Server/Client Translation Approaches

**Don't:** Use `getTranslations()` in some places and `useTranslations()` in others
**Why:** Since all content-rendering components are Client Components, stick with `useTranslations()` consistently

---

## Confidence Assessment

| Aspect | Confidence | Rationale |
|--------|------------|-----------|
| next-intl without routing | HIGH | Documented approach, verified in official docs |
| Cookie + Context hybrid | MEDIUM | Combines documented patterns, not explicitly shown in docs |
| Instant switching via key remount | HIGH | Standard React pattern, documented behavior |
| Motion compatibility | HIGH | Key-based remount means clean animation restarts |
| Build order | HIGH | Based on clear dependencies in codebase |
| React Compiler compatibility | MEDIUM | next-intl claims compatibility, not explicitly tested |

---

## Sources

- [next-intl: App Router without i18n routing](https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing)
- [next-intl: Server & Client Components](https://next-intl.dev/docs/environments/server-client-components)
- [next-intl: Request Configuration](https://next-intl.dev/docs/usage/configuration)
- [next-intl: Navigation APIs](https://next-intl.dev/docs/routing/navigation)
- [Next.js: Cookies API](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [next-intl GitHub: Persisting state on locale change](https://github.com/amannn/next-intl/issues/496)
- [next-intl GitHub: Support passing locale by state/cookie](https://github.com/amannn/next-intl/discussions/542)
- [HackerNoon: i18n in Next.js without Route-Based Localization](https://hackernoon.com/implementing-i18n-in-nextjs-a-guide-to-non-route-based-localization)
- [Medium: Best i18n Libraries for Next.js App Router 2025](https://medium.com/better-dev-nextjs-react/the-best-i18n-libraries-for-next-js-app-router-in-2025-21cb5ab2219a)
