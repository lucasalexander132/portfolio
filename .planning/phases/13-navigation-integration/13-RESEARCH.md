# Phase 13: Navigation Integration - Research

**Researched:** 2026-02-19
**Domain:** Next.js App Router navigation, anchor scrolling, route-aware components
**Confidence:** HIGH

## Summary

This phase modifies two existing components (Navigation.tsx, Footer.tsx) and adds a contact CTA to the updates page. The core challenge is making the nav bar route-aware: on the homepage it scroll-to-anchors, on `/updates` it navigates back to `/#services`, `/#projects` via full route navigation.

The codebase currently renders Navigation only on the homepage (`src/app/page.tsx`). The updates pages (`/updates`, `/updates/[slug]`) have no Navigation or Footer. This means the Navigation component must either be lifted to a shared layout or explicitly added to the updates page layout.

**Primary recommendation:** Use `usePathname()` from `next/navigation` to detect whether the user is on the homepage or an updates route, and switch between `scrollIntoView` (homepage) and Next.js `Link` / `router.push` navigation (updates pages). Add an updates layout that includes Navigation and Footer.

## Standard Stack

### Core (already in project)
| Library | Purpose | Why Standard |
|---------|---------|--------------|
| `next/navigation` | `usePathname()`, `useRouter()` | Built-in App Router hooks for route detection |
| `next/link` | `Link` component | Prefetched client-side navigation with hash support |
| `motion/react` | `m` component, animations | Already used in Navigation.tsx and Footer.tsx |
| `@/lib/i18n` | `useTranslations()` | Project i18n system |
| `lucide-react` | Icons | Already used for Mail icon in nav |

### No New Dependencies Needed

This phase uses only existing project dependencies. No new packages required.

## Architecture Patterns

### Pattern 1: Route-Aware Navigation with usePathname

**What:** Navigation component detects current route and switches behavior between anchor-scroll (homepage) and route navigation (other pages).

**When to use:** When a shared nav must behave differently based on route context.

**Implementation approach:**

```typescript
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// Inside Navigation component:
const pathname = usePathname()
const isHome = pathname === '/'

// For nav items like #services, #projects:
// - On homepage: scrollIntoView (current behavior)
// - On /updates: navigate to /#services via Link or router.push
```

Key detail: Next.js `Link` with `href="/#services"` will navigate to the homepage AND scroll to the anchor. This is the correct approach for cross-page anchor links.

### Pattern 2: Updates Layout with Shared Chrome

**What:** Create `src/app/updates/layout.tsx` that wraps all updates routes with Navigation and Footer.

**Why:** Currently Navigation is only in `src/app/page.tsx`. Updates pages need it too. A layout is the correct App Router pattern for shared UI across a route segment.

```typescript
// src/app/updates/layout.tsx
export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      {/* Contact CTA goes here or in UpdatesPageContent */}
      <Footer />
    </>
  )
}
```

**Critical consideration:** The homepage uses `fixed inset-0 p-3` framed-card layout in `page.tsx`. The updates layout must NOT replicate this -- updates pages get a clean canvas (documented in CLAUDE.md). The updates layout should be a standard scrollable page with Navigation floating on top.

### Pattern 3: Contact CTA Component

**What:** A persistent contact call-to-action on `/updates` that links back to the homepage contact form.

**Options for triggering contact form:**
1. Navigate to `/#contact` -- but contact is a modal, not a section
2. Navigate to `/` and dispatch `openContactForm` custom event
3. Use `Link href="/"` with an onClick that sets a URL param or sessionStorage flag, then homepage reads it

**Recommended approach:** The contact form is a modal triggered by `window.dispatchEvent(new CustomEvent('openContactForm'))`. From `/updates`, the simplest approach is to navigate to `/` and then trigger the event. However, the event needs to fire after navigation completes.

Better approach: Add a `?contact=true` search param. The Navigation component (on homepage) can read this param and auto-open the form. This is cleaner than timing events post-navigation.

Alternatively, the CTA can simply link to `/` with a visual "Get in touch" message, and the user clicks the contact button on the homepage. This is simpler and avoids cross-page event coordination.

**Simplest reliable approach:** The CTA links to `/?contact=open`. On the homepage, Navigation reads `searchParams` and auto-opens the form if `contact=open` is present. This is URL-driven, works with direct links, and requires minimal coordination.

### Pattern 4: Logo Behavior on Updates Pages

**What:** The "C." logo in the nav currently scrolls to `#hero`. On non-homepage routes, it should navigate to `/`.

```typescript
// Logo link:
// isHome ? scrollToHero : Link href="/"
```

### Recommended Project Structure (changes only)

```
src/
  app/
    updates/
      layout.tsx          # NEW - adds Navigation + Footer to updates routes
      page.tsx             # EXISTING - no changes needed
      [slug]/page.tsx      # EXISTING - no changes needed
  components/
    layout/
      Navigation.tsx       # MODIFIED - route-aware nav behavior
      Footer.tsx           # MODIFIED - add "Updates" quick link, route-aware
    updates/
      ContactCTA.tsx       # NEW - persistent contact CTA component
```

### Anti-Patterns to Avoid
- **Duplicating Navigation in each page:** Use a layout, not copy-paste
- **Using `window.location` for navigation:** Use Next.js `Link` or `useRouter()` to preserve client-side navigation and View Transitions
- **Conditionally rendering different nav components:** One Navigation component with route-aware behavior, not `<HomeNav>` vs `<UpdatesNav>`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Route detection | Custom URL parsing | `usePathname()` from `next/navigation` | Handles all edge cases, SSR-safe |
| Cross-page navigation with hash | Manual `window.location` manipulation | Next.js `Link href="/#section"` | Preserves SPA behavior, prefetching, View Transitions |
| Layout sharing | Manually importing Nav/Footer in each page | App Router `layout.tsx` | Automatic, persists across navigations, no re-mount |

## Common Pitfalls

### Pitfall 1: Breaking Homepage Scroll Behavior
**What goes wrong:** Adding `usePathname()` or `Link` imports causes the homepage anchor scrolling to break because `handleClick` logic changes.
**Why it happens:** Refactoring the click handler to support both modes introduces regressions.
**How to avoid:** Keep the existing `handleClick` with `scrollIntoView` as the homepage path. Only add the route-navigation path as an alternative when `!isHome`. Test both paths independently.
**Warning signs:** Clicking "Services" on homepage causes full page navigation instead of smooth scroll.

### Pitfall 2: Navigation Component Becoming Client-Heavy
**What goes wrong:** Navigation already is `'use client'`. Adding `usePathname()` is fine since it's already client. No pitfall here -- just confirming.

### Pitfall 3: Contact Form Event Timing on Cross-Page Navigation
**What goes wrong:** Dispatching `openContactForm` event from `/updates` before the homepage Navigation component has mounted means the event is lost.
**Why it happens:** Navigation hasn't mounted yet when the event fires.
**How to avoid:** Use URL search params (`?contact=open`) instead of custom events for cross-page contact form triggering. Navigation reads the param on mount and auto-opens.
**Warning signs:** Contact CTA navigates to homepage but form doesn't open.

### Pitfall 4: Fixed Nav Positioning on Updates Pages
**What goes wrong:** Navigation uses `fixed left-1/2 -translate-x-1/2 z-[60]` with `bottom: 40` positioning. On the homepage this works because content is in a `fixed inset-0` container. On updates pages (standard scrollable layout), the fixed nav may overlap content or behave differently.
**Why it happens:** Different page layout paradigms (framed card vs standard scroll).
**How to avoid:** Test the fixed positioning on updates pages. It should work fine since `fixed` is relative to the viewport, but verify scroll behavior and z-index stacking.
**Warning signs:** Nav covers content at bottom of updates page, or appears behind other elements.

### Pitfall 5: Footer Anchor Links on Updates Pages
**What goes wrong:** Footer has the same `handleNavClick` with `scrollIntoView` for `#services` and `#projects`. On updates pages, these elements don't exist, so nothing happens.
**Why it happens:** Footer uses the same anchor-scroll logic as Navigation.
**How to avoid:** Footer needs the same route-aware treatment as Navigation -- use `Link href="/#services"` when not on homepage.

### Pitfall 6: i18n Keys Must Exist Before Use
**What goes wrong:** TypeScript rejects `t('nav.updates')` if the key doesn't exist in `en.json`.
**Why it happens:** `TranslationKey` type is derived from the JSON structure.
**How to avoid:** Add all new translation keys to BOTH `en.json` and `fr.json` before referencing them in components.

## Code Examples

### Route-Aware Navigation Click Handler
```typescript
// In Navigation.tsx
import { usePathname, useRouter } from 'next/navigation'

const pathname = usePathname()
const router = useRouter()
const isHome = pathname === '/'

const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault()
  if (isHome) {
    // Existing behavior: smooth scroll
    const targetId = href.replace('#', '')
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } else {
    // Navigate to homepage with anchor
    router.push(`/${href}`)
  }
}
```

### Nav Items Array with Updates Link
```typescript
const navItems = [
  { href: '#services', labelKey: 'nav.services' as const, cursorKey: 'cursor.what_ill_do' as const },
  { href: '#projects', labelKey: 'nav.projects' as const, cursorKey: 'cursor.what_ive_done' as const },
  { href: '/updates', labelKey: 'nav.updates' as const, cursorKey: 'cursor.latest_updates' as const },
] as const
```

Note: The "Updates" link is a route link, not an anchor. It needs different handling -- always use `Link` or `router.push`, never `scrollIntoView`.

### Updates Layout
```typescript
// src/app/updates/layout.tsx
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-900">
      <Navigation />
      {children}
      <Footer />
    </div>
  )
}
```

This is a Server Component layout that just composes client components. No `'use client'` needed at the layout level.

### Contact CTA Component
```typescript
// src/components/updates/ContactCTA.tsx
'use client'

import Link from 'next/link'
import { useTranslations } from '@/lib/i18n'

export default function ContactCTA() {
  const t = useTranslations()

  return (
    <section className="my-16 py-12 border-t border-base-800/50 text-center">
      <h2 className="font-serif text-2xl text-text-primary mb-4">
        {t('updates.cta.title')}
      </h2>
      <p className="text-text-muted mb-6">
        {t('updates.cta.description')}
      </p>
      <Link
        href="/?contact=open"
        className="inline-block px-6 py-3 bg-amber-500 text-base-950 rounded-lg font-medium hover:bg-amber-400 transition-colors"
      >
        {t('updates.cta.button')}
      </Link>
    </section>
  )
}
```

### Auto-Open Contact Form from URL Param
```typescript
// In Navigation.tsx, add to existing useEffect or new one:
import { useSearchParams } from 'next/navigation'

const searchParams = useSearchParams()

useEffect(() => {
  if (searchParams.get('contact') === 'open') {
    setIsFormOpen(true)
    // Clean up the URL param
    const url = new URL(window.location.href)
    url.searchParams.delete('contact')
    window.history.replaceState({}, '', url.toString())
  }
}, [searchParams])
```

### New i18n Keys Needed
```json
// In en.json, add:
{
  "nav": {
    "updates": "Updates"
  },
  "cursor": {
    "latest_updates": "What's New"
  },
  "updates": {
    "cta": {
      "title": "Have a project in mind?",
      "description": "Let's talk about how I can help.",
      "button": "Get in Touch"
    }
  },
  "footer": {
    "cursor": {
      "updates": "What's New"
    }
  }
}
```

```json
// In fr.json, add:
{
  "nav": {
    "updates": "Mises a jour"
  },
  "cursor": {
    "latest_updates": "Quoi de neuf"
  },
  "updates": {
    "cta": {
      "title": "Un projet en tete ?",
      "description": "Parlons de comment je peux vous aider.",
      "button": "Prendre contact"
    }
  },
  "footer": {
    "cursor": {
      "updates": "Quoi de neuf"
    }
  }
}
```

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `useRouter()` from `next/router` | `useRouter()` from `next/navigation` | App Router uses different import path |
| Middleware for route detection | `usePathname()` client-side | Simpler, no server overhead |
| Custom scroll restoration | Browser-native with Next.js | Next.js handles scroll restoration automatically |

## Open Questions

1. **Nav item differentiation for route links vs anchor links**
   - What we know: Current navItems are all anchor links (`#services`, `#projects`). Adding `/updates` introduces a route link.
   - What's unclear: Should the "Updates" link look visually different from anchor links? Should it have a different style (e.g., no border, different color)?
   - Recommendation: Keep same visual style for consistency. Differentiate behavior in code only via `href.startsWith('#')` check.

2. **Contact CTA placement**
   - What we know: UPD-15 says "persistent contact CTA on `/updates` page"
   - What's unclear: Does "persistent" mean sticky/fixed, or just always-visible in the page flow? Should it appear on `/updates/[slug]` detail pages too?
   - Recommendation: Place it in the updates layout (appears on both list and detail pages) as a standard in-flow section above the Footer. "Persistent" likely means "always present on updates pages" not "sticky/fixed."

3. **Mobile nav considerations**
   - What we know: Current nav is a fixed bottom bar. Adding a third link ("Updates") increases width.
   - What's unclear: Will three nav links + logo + contact icon + language switcher fit on mobile?
   - Recommendation: Test on small screens. May need to abbreviate or adjust spacing.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/components/layout/Navigation.tsx`, `Footer.tsx`, `src/app/page.tsx`, `src/app/updates/page.tsx`
- Next.js App Router: `usePathname()`, `useRouter()`, `Link` with hash -- well-established patterns
- Project CLAUDE.md and MEMORY.md for architecture constraints

### Secondary (MEDIUM confidence)
- Next.js `Link` with hash anchor (`href="/#section"`) behavior -- standard documented behavior, works with client-side navigation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all existing project dependencies, no new libraries
- Architecture: HIGH - straightforward App Router patterns (layout, usePathname, Link)
- Pitfalls: HIGH - identified from direct codebase analysis of current implementation
- Contact CTA cross-page: MEDIUM - URL param approach is clean but "persistent" requirement is ambiguous

**Research date:** 2026-02-19
**Valid until:** 2026-03-19 (stable patterns, no fast-moving dependencies)
