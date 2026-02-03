# Phase 7: Language Switcher - Research

**Researched:** 2026-02-03
**Domain:** React Context language switching with accessible UI
**Confidence:** HIGH

## Summary

Phase 7 builds the user-facing language toggle on top of the Phase 6 LocaleProvider infrastructure. The existing `useLocale()` hook provides `locale` and `setLocale('en'|'fr')` - calling `setLocale` instantly re-renders all components using `useTranslations()` without page reload.

The UI requirement specifies FR stacked on top of EN in the navbar. This is a two-button vertical stack pattern, not a dropdown or toggle switch. The buttons should provide immediate effect (no "save" step needed), which aligns with the instant Context-based switching already implemented.

The main technical additions are: (1) a LanguageSwitcher component with accessible button group markup, (2) updating the `<html lang>` attribute when locale changes, and (3) translating the existing nav link labels. The Navigation component already imports motion and cursor utilities, so the switcher will follow established patterns.

**Primary recommendation:** Build a vertical button group component using native `<button>` elements with `aria-pressed` to indicate current selection. Add a `useEffect` in LocaleProvider to sync `document.documentElement.lang` with locale state.

## Standard Stack

The established approach for this domain (language switcher UI):

### Core
| Technology | Version | Purpose | Why Standard |
|------------|---------|---------|--------------|
| React `<button>` elements | React 19.2 (existing) | Language selection buttons | Native semantics, no ARIA role needed |
| `aria-pressed` attribute | WAI-ARIA 1.2 | Indicate currently selected language | Standard toggle button pattern |
| `useLocale()` hook | Existing (Phase 6) | Get/set current locale | Already implemented, instant re-render |
| `useTranslations()` hook | Existing (Phase 6) | Get translated nav labels | Already implemented, type-safe |
| `document.documentElement.lang` | Browser API | Update HTML lang attribute | Accessibility requirement for screen readers |

### Supporting
| Technology | Version | Purpose | When to Use |
|------------|---------|---------|-------------|
| Motion `m.button` | motion/react (existing) | Subtle press animation | Match existing navbar button feel |
| useCursor hook | Existing | Custom cursor on hover | Match existing navbar interactions |
| `lang` attribute on buttons | HTML | Help screen readers pronounce "FR"/"EN" | Accessibility enhancement |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Button group | Radio buttons (`role="radiogroup"`) | Radio pattern works but buttons are simpler for 2-option immediate-effect toggle |
| Button group | Toggle switch | Toggle implies on/off binary; language is a choice between equal options |
| Button group | Select dropdown | Overkill for 2 languages; hides options unnecessarily |
| `aria-pressed` | `aria-selected` | `aria-selected` requires listbox role; `aria-pressed` works on standalone buttons |

**Installation:**
```bash
# No packages needed - uses existing React, motion, and i18n infrastructure
# Component will be created in:
touch src/components/layout/LanguageSwitcher.tsx
```

## Architecture Patterns

### Recommended Component Structure
```
src/
├── lib/
│   └── i18n.tsx            # Add useEffect to sync html lang (1 line)
├── components/
│   └── layout/
│       ├── Navigation.tsx  # Import LanguageSwitcher, replace hardcoded labels
│       └── LanguageSwitcher.tsx  # NEW: vertical FR/EN button stack
└── app/
    └── layout.tsx          # Already wraps with LocaleProvider (no change)
```

### Pattern 1: Vertical Language Button Group

**What:** Two stacked buttons (FR on top, EN on bottom) where one is always "pressed"
**When to use:** Always for this feature - matches the requirement specification

**Example:**
```typescript
// src/components/layout/LanguageSwitcher.tsx
'use client'

import { useLocale } from '@/lib/i18n'
import { m } from 'motion/react'
import { springSnappy } from '@/lib/motion'
import { useCursor } from '@/components/cursor'

type Locale = 'en' | 'fr'

const languages: { code: Locale; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const { setCursorVariant, resetCursor } = useCursor()

  return (
    <div
      className="flex flex-col gap-0.5"
      role="group"
      aria-label="Language selection"
    >
      {languages.map(({ code, label }) => {
        const isActive = locale === code
        return (
          <m.button
            key={code}
            type="button"
            lang={code}
            aria-pressed={isActive}
            onClick={() => setLocale(code)}
            className={`
              px-2 py-1 text-xs font-medium rounded transition-colors
              ${isActive
                ? 'bg-amber-500 text-base-950'
                : 'text-text-secondary hover:text-amber-500'}
            `}
            whileTap={{ scale: 0.95 }}
            transition={springSnappy}
            onMouseEnter={() => setCursorVariant('link', undefined, true)}
            onMouseLeave={resetCursor}
          >
            {label}
          </m.button>
        )
      })}
    </div>
  )
}
```

### Pattern 2: Syncing HTML Lang Attribute

**What:** Update `<html lang="...">` when locale changes to ensure screen readers use correct language
**When to use:** Always - critical for accessibility

**Example:**
```typescript
// Addition to src/lib/i18n.tsx LocaleProvider
// Add this useEffect after the browser detection useEffect

useEffect(() => {
  document.documentElement.lang = locale
}, [locale])
```

### Pattern 3: Translated Navigation Labels

**What:** Replace hardcoded navLinks array with translation-driven labels
**When to use:** Always for nav items that need translation

**Example:**
```typescript
// In Navigation.tsx, replace static navLinks with dynamic translations

export function Navigation() {
  const t = useTranslations()
  // ... existing hooks

  // Build links using translation keys
  // Note: cursorText also uses translations
  const navItems = [
    { href: '#services', labelKey: 'nav.services' as const, cursorKey: 'cursor.what_ill_do' as const },
    { href: '#projects', labelKey: 'nav.projects' as const, cursorKey: 'cursor.what_ive_done' as const },
  ]

  return (
    // ... in JSX
    {navItems.map(({ href, labelKey, cursorKey }) => (
      <li key={href}>
        <m.a
          href={href}
          // ...
        >
          {t(labelKey)}
        </m.a>
      </li>
    ))}
  )
}
```

### Anti-Patterns to Avoid

- **Using `router.push()` or any navigation:** Language switching must be client-side only, no URL changes
- **Flags instead of text:** "FR"/"EN" text is clearer and avoids the flag-country-language confusion
- **Toggle switch pattern:** Implies on/off; language selection is a choice between equal options
- **Hiding the current language:** Both options should always be visible with current one highlighted
- **Forgetting `lang` attribute on buttons:** Screen readers may mispronounce "FR" without it
- **Complex state management:** Just call `setLocale()` - the Context handles everything

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Language state management | Custom useState/localStorage | `useLocale()` hook | Already built in Phase 6, handles re-renders |
| Translation function | Manual object lookup | `useTranslations()` / `t()` | Already built in Phase 6, type-safe |
| Button press animation | CSS animations | Motion `whileTap` | Already used elsewhere in nav, consistent feel |
| Focus ring styling | Custom focus styles | Tailwind `focus-visible:ring-*` | Built-in accessible focus styles |

**Key insight:** Phase 6 did the heavy lifting. This phase is purely UI - wire up existing hooks to new buttons.

## Common Pitfalls

### Pitfall 1: Forgetting to Update HTML Lang Attribute

**What goes wrong:** Screen readers continue using wrong language after switch, affecting pronunciation of all page content.

**Why it happens:** React's virtual DOM doesn't include `<html>` element. Must use DOM API directly.

**How to avoid:** Add `useEffect` in LocaleProvider that syncs `document.documentElement.lang = locale`

**Warning signs:** Screen reader pronounces French text with English pronunciation after language switch.

### Pitfall 2: Flash of Wrong Language on Initial Load

**What goes wrong:** Page renders in English, then flashes to French when browser detection runs client-side.

**Why it happens:** Server has no `navigator.language`. Default is English until useEffect runs.

**How to avoid:** Accept minimal flash (documented decision from Phase 6). Alternative is loading skeleton which is worse UX.

**Warning signs:** Users with French browser see brief English flash on every page load.

### Pitfall 3: NavLinks Array Becomes Stale

**What goes wrong:** Navigation shows English labels even after switching to French.

**Why it happens:** `navLinks` array is defined outside component, not reactive to locale changes.

**How to avoid:** Either define navItems inside component (reactive) or store only keys and call `t()` at render time.

**Warning signs:** Switching language updates Hero but not navigation.

### Pitfall 4: Missing Accessibility Attributes

**What goes wrong:** Screen reader users can't tell which language is currently selected.

**Why it happens:** Visual styling shows selection but ARIA state not set.

**How to avoid:** Use `aria-pressed="true"` on active language button. Add `role="group"` and `aria-label` on container.

**Warning signs:** VoiceOver announces "button, FR" without indicating it's the selected option.

### Pitfall 5: Cursor Text Not Translating

**What goes wrong:** Custom cursor shows English helper text even in French mode.

**Why it happens:** `cursorText` strings in navLinks are hardcoded English.

**How to avoid:** Store translation keys in navItems, call `t()` for cursorText at render time.

**Warning signs:** Switching to French shows "Ce que je ferai" in nav but cursor shows "What I'll Do".

## Code Examples

Verified patterns from existing codebase and accessibility guidelines:

### Complete LanguageSwitcher Component

```typescript
// src/components/layout/LanguageSwitcher.tsx
'use client'

import { useLocale } from '@/lib/i18n'
import { m } from 'motion/react'
import { springSnappy } from '@/lib/motion'
import { useCursor } from '@/components/cursor'

type Locale = 'en' | 'fr'

const languages: { code: Locale; label: string }[] = [
  { code: 'fr', label: 'FR' },  // FR on top per requirement
  { code: 'en', label: 'EN' },  // EN on bottom
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const { setCursorVariant, resetCursor } = useCursor()

  return (
    <div
      className="flex flex-col gap-0.5"
      role="group"
      aria-label="Language selection"
    >
      {languages.map(({ code, label }) => {
        const isActive = locale === code
        return (
          <m.button
            key={code}
            type="button"
            lang={code}  // Helps screen reader pronounce correctly
            aria-pressed={isActive}
            onClick={() => setLocale(code)}
            disabled={isActive}  // Optional: prevent clicking active language
            className={`
              px-2 py-1 text-xs font-medium rounded transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
              ${isActive
                ? 'bg-amber-500 text-base-950 cursor-default'
                : 'text-text-secondary hover:text-amber-500 cursor-pointer'}
            `}
            whileTap={isActive ? {} : { scale: 0.95 }}
            transition={springSnappy}
            onMouseEnter={() => !isActive && setCursorVariant('link', undefined, true)}
            onMouseLeave={resetCursor}
          >
            {label}
          </m.button>
        )
      })}
    </div>
  )
}
```

### Updated LocaleProvider with Lang Sync

```typescript
// src/lib/i18n.tsx - add this useEffect after browser detection useEffect

// Sync HTML lang attribute with current locale
useEffect(() => {
  document.documentElement.lang = locale
}, [locale])
```

### Integration in Navigation Component

```typescript
// src/components/layout/Navigation.tsx
// Key changes:

import { useTranslations } from '@/lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

// Inside component:
const t = useTranslations()

// Replace hardcoded navLinks with:
const navItems = [
  { href: '#services', labelKey: 'nav.services', cursorKey: 'cursor.what_ill_do' },
  { href: '#projects', labelKey: 'nav.projects', cursorKey: 'cursor.what_ive_done' },
] as const

// In JSX, between Contact button and nav container's closing tag:
{/* Language Switcher */}
<LanguageSwitcher />

// And in the nav items loop:
{t(labelKey)}  // Instead of {label}
setCursorVariant('text', t(cursorKey), true)  // Instead of cursorText
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Dropdown selects for language | Button groups for 2-language sites | 2023+ | Better discoverability, faster interaction |
| Country flags | Text labels (FR/EN) | Always recommended | Flags represent countries not languages |
| Page reload on switch | Client-side Context switch | React 16.8+ (hooks) | Instant feedback, no loading state |
| `aria-current` on links | `aria-pressed` on buttons | WAI-ARIA 1.2 | Buttons use pressed, links use current |

**Deprecated/outdated:**
- `next.config.js` i18n with locale in URL: Not needed for client-only switching
- `<select>` dropdowns for 2 languages: Hides options unnecessarily
- Toggle switch UI: Implies binary on/off, not equal choice

## Open Questions

Things that couldn't be fully resolved for this phase:

1. **Positioning within navbar**
   - What we know: Requirement says "visible in navbar" with FR/EN stacked
   - What's unclear: Exact position - left of logo? Right of contact button?
   - Recommendation: Place after contact button (rightmost) - common pattern for language switcher

2. **Exact styling to match navbar aesthetic**
   - What we know: Current buttons use amber-500, text-sm, border styling
   - What's unclear: Should language buttons have borders? Same size as nav links?
   - Recommendation: Smaller (text-xs), no borders, subtle appearance - language switcher should be secondary to main nav

3. **Screen reader announcement on switch**
   - What we know: Changing locale triggers re-render of all translated content
   - What's unclear: Should we announce "Language changed to French" via aria-live?
   - Recommendation: No announcement needed - user initiated action, visual feedback sufficient. aria-live would be redundant.

## Sources

### Primary (HIGH confidence)
- Phase 6 implementation: `src/lib/i18n.tsx`, `src/types/i18n.d.ts` - LocaleProvider API verified
- Phase 6 VERIFICATION.md - Confirmed useLocale/useTranslations work correctly
- [MDN aria-pressed](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed) - Standard toggle button attribute
- [Sling Academy: Set HTML lang attribute](https://www.slingacademy.com/article/javascript-set-html-lang-attribute-programmatically/) - document.documentElement.lang pattern

### Secondary (MEDIUM confidence)
- [Russ Max Design: Accessible Language Switcher](https://russmaxdesign.github.io/language-switcher/) - Radio group pattern reference
- [CodyHouse: Accessible Language Picker](https://codyhouse.co/blog/post/accessible-language-picker) - Progressive enhancement patterns
- [Terrill Thompson: Accessible Language Pickers](https://terrillthompson.com/759) - Screen reader testing results
- [Usersnap: Design Language Switch](https://usersnap.com/blog/design-language-switch/) - Text-based vs flag-based guidance
- [NN/g: Toggle Switch Guidelines](https://www.nngroup.com/articles/toggle-switch-guidelines/) - When not to use toggles

### Tertiary (LOW confidence)
- Current Navigation.tsx patterns - Established but could be refined

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Uses existing Phase 6 infrastructure, standard ARIA patterns
- Architecture: HIGH - Clear component structure, minimal additions
- Pitfalls: HIGH - Well-documented in accessibility literature
- UI design specifics: MEDIUM - Requirement is clear but exact styling is discretionary

**Research date:** 2026-02-03
**Valid until:** Indefinite (pure React/ARIA patterns, no library versions to track)
