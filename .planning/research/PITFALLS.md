# Pitfalls Research: i18n for Existing Next.js App Router Site

**Project:** Civix Solutions Portfolio v1.1 Internationalization
**Context:** Adding English/French support to existing single-page portfolio
**Key Requirements:** Instant language switching, browser detection on first visit
**Tech Stack:** Next.js 16 (App Router), React 19.2, Turbopack
**Researched:** 2026-02-03
**Confidence:** MEDIUM-HIGH (multiple official sources, verified with next-intl docs)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken functionality, or fundamentally wrong architecture.

### Pitfall 1: Expecting Built-in Next.js i18n to Work with App Router

**What goes wrong:** Developers familiar with Pages Router try to use `next.config.js` i18n configuration (`locales`, `defaultLocale`, `domains`) and discover it does nothing in App Router.

**Why it happens:** Next.js App Router removed built-in internationalized routing. The locale/locales/defaultLocale/domainLocales config options have been removed entirely. Many tutorials and Stack Overflow answers reference the old approach.

**Warning signs:**
- Adding `i18n: { locales: ['en', 'fr'], defaultLocale: 'en' }` to next.config.js
- Expecting `useRouter().locale` to work (it won't)
- Looking for `getStaticProps` with `locale` param
- Trying to use `next/router` instead of `next/navigation`

**Prevention:**
- Use a dedicated library: next-intl, react-i18next with next-i18n-router, or paraglide-next
- Implement routing via middleware + `[locale]` dynamic segment
- Reference only App Router documentation (dated 2023 or later)
- Verify any tutorial is for App Router, not Pages Router

**Phase to address:** Initial setup phase - architecture decision

**Sources:**
- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/guides/migrating/app-router-migration)
- [next-intl App Router Setup](https://next-intl.dev/docs/getting-started/app-router)

---

### Pitfall 2: Static Rendering Conflicts with Locale Detection

**What goes wrong:** Using next-intl's `useTranslations()` in Server Components opts the entire route into dynamic rendering. This breaks static export, increases server load, and may cause unexpected behavior with caching.

**Why it happens:** next-intl reads the locale from request headers via middleware (`x-next-intl-locale`). Calling `headers()` anywhere in the render tree forces dynamic rendering. Next.js currently has no API to read route params at arbitrary points in Server Components.

**Warning signs:**
- Build warning: "Error: Usage of next-intl APIs in Server Components is currently only available for dynamic rendering"
- All pages become dynamic (`export const dynamic = 'force-dynamic'` everywhere)
- Build times suddenly much slower
- Page caching not working as expected

**Prevention:**
- Use `setRequestLocale()` (formerly `unstable_setRequestLocale`) in all layouts and pages
- Add `generateStaticParams` returning all locales
- Pass locale explicitly to `NextIntlClientProvider`
- Provide `locale`, `now`, and `timeZone` explicitly to avoid dynamic rendering from provider

```typescript
// In every layout and page:
import { setRequestLocale } from 'next-intl/server';

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ...
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}
```

**Phase to address:** Initial setup phase - must be configured from the start

**Sources:**
- [next-intl Static Rendering](https://next-intl.dev/docs/routing/setup)
- [GitHub Issue #521](https://github.com/amannn/next-intl/issues/521)

---

### Pitfall 3: Client-Side Switching That Loses State

**What goes wrong:** Language switching causes full page reload, resetting scroll position, form state, animation state, and any client-side context. For a single-page portfolio with animations, this breaks the experience entirely.

**Why it happens:** Default approach uses `<Link>` navigation to `/fr/...` which triggers route transition. Alternatively, cookie-based switching requires `router.refresh()` which also resets client state.

**Warning signs:**
- User clicks language switch, page scrolls to top
- Partially filled contact form gets cleared
- Animations restart from beginning
- Loading flash/blank screen during switch
- React state (open modals, expanded sections) resets

**Prevention:**
For instant switching WITHOUT reload:
1. Load all translations for all locales on initial page load
2. Use React context/state to track current locale
3. Switch locale by updating context, not navigation
4. Store preference in cookie/localStorage for persistence

```typescript
// Client-side locale context pattern
const [locale, setLocale] = useState(initialLocale);

const switchLocale = (newLocale: string) => {
  setLocale(newLocale);
  document.cookie = `NEXT_LOCALE=${newLocale}; path=/`;
  // NO router.push, NO router.refresh
};
```

**Tradeoff:** This means loading both EN and FR translations upfront. For a small portfolio, this is acceptable (~10-20KB extra). For large apps, this pattern doesn't scale.

**Phase to address:** Architecture decision - must be planned before implementation

**Sources:**
- [next-intl Issue #496 - Persisting state on locale change](https://github.com/amannn/next-intl/issues/496)
- [next-intl Discussion #1096 - Switch locale from client](https://github.com/amannn/next-intl/discussions/1096)

---

### Pitfall 4: Hydration Mismatches with Dates and Numbers

**What goes wrong:** Server renders date/number in one locale format, client hydrates with different format. React throws hydration mismatch error. Common with `Intl.DateTimeFormat` and `Intl.NumberFormat`.

**Why it happens:** Server timezone/locale may differ from client. Default number formatting applies locale-specific digit characters (e.g., Arabic digits). Time zones cause date rendering to differ.

**Warning signs:**
- React error: "Text content does not match server-rendered HTML"
- Dates showing differently on first load vs. after hydration
- Numbers formatted with unexpected digit characters
- Console warnings about hydration mismatches

**Prevention:**
- Always pass explicit `timeZone` to date formatting (not just locale)
- Use `suppressHydrationWarning={true}` for timestamp-only elements (use sparingly)
- Provide `now` and `timeZone` explicitly in `NextIntlClientProvider`
- For server components, use `getTranslations()` with explicit options

```typescript
// In i18n/request.ts
export default getRequestConfig(async ({ locale }) => ({
  locale,
  now: new Date(),
  timeZone: 'America/Toronto', // Explicit timezone
  messages: (await import(`../messages/${locale}.json`)).default
}));
```

**Phase to address:** Configuration phase - set up providers correctly

**Sources:**
- [next-intl Issue #467 - Date mismatch hydration error](https://github.com/amannn/next-intl/issues/467)
- [next-intl Issue #528 - Plural hydration error](https://github.com/amannn/next-intl/issues/528)

---

## Integration Pitfalls

Mistakes specific to adding i18n to an EXISTING site.

### Pitfall 5: Breaking Existing URL Structure

**What goes wrong:** Adding `[locale]` segment changes all URLs from `/` to `/en/` and `/#projects` to `/en/#projects`. This breaks existing bookmarks, search rankings, and any external links.

**Why it happens:** Standard i18n routing prepends locale to all paths. For an existing site, this is a breaking change.

**Warning signs:**
- Old URLs (shared on LinkedIn, bookmarked) now 404
- Google Search Console shows massive drop in indexed pages
- Analytics shows spike in 404 errors
- Hash links (`#contact`) stop working with locale prefix

**Prevention options:**

**Option A: Hide default locale (recommended for existing site)**
```typescript
// routing.ts
export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed' // Only show /fr/, not /en/
});
```

**Option B: Redirect old URLs**
- Set up redirects in middleware for old paths
- Submit URL change to Google Search Console
- Update any external links you control

**Option C: No locale in URL (cookie-only)**
```typescript
localePrefix: 'never' // No /en/ or /fr/ in URL
```
Note: This has SEO implications - search engines can't crawl both versions.

**Phase to address:** Architecture decision - before any implementation

**Sources:**
- [next-intl Locale Prefix Options](https://next-intl.dev/docs/routing/navigation)

---

### Pitfall 6: Forgetting to Wrap Entire App in [locale] Segment

**What goes wrong:** Only some pages are under `app/[locale]/`, causing routing chaos. Some pages work, others don't have locale context.

**Why it happens:** When adding i18n to existing site, easy to miss restructuring. Existing `app/page.tsx` should become `app/[locale]/page.tsx`.

**Warning signs:**
- "Unable to find next-intl locale" error on some pages
- Locale context undefined in some components
- Middleware running on some routes but not others

**Prevention:**
- Move ALL pages and layouts under `app/[locale]/`
- Root `app/layout.tsx` should only contain `html` and `body` with `{children}`
- Locale-aware layout goes in `app/[locale]/layout.tsx`
- Keep only technical files at root (`not-found.tsx`, `error.tsx`)

```
app/
  layout.tsx          // Minimal: <html><body>{children}</body></html>
  not-found.tsx       // Global 404
  [locale]/
    layout.tsx        // LocaleLayout with providers
    page.tsx          // Home page
    // ... all other pages
```

**Phase to address:** File structure migration - first step of implementation

**Sources:**
- [next-intl Discussion #446 - Unable to find locale](https://github.com/amannn/next-intl/discussions/446)

---

### Pitfall 7: Middleware Not Running on All Routes

**What goes wrong:** Some routes bypass middleware entirely, causing locale detection to fail. Routes with dots (`.`), API routes, and special Next.js paths need explicit handling.

**Why it happens:** Default middleware matcher excludes paths that look like static files. URLs with dots (e.g., `/about.html`, `/user.name`) are excluded. Third-party integrations (Vercel Analytics) use paths that shouldn't be localized.

**Warning signs:**
- Locale detection works on some pages but not others
- API routes getting locale prefix
- Analytics or other services breaking
- Routes with dots in them returning 404

**Prevention:**
```typescript
// middleware.ts
export const config = {
  matcher: [
    // Match all paths except:
    // - API routes (/api/...)
    // - Static files (/_next/static/...)
    // - Image optimization (/_next/image/...)
    // - Favicon
    // - Vercel internals
    '/((?!api|_next/static|_next/image|favicon.ico|_vercel).*)',
    // Explicitly include paths with dots if needed
    '/users/:path*'
  ]
};
```

**Phase to address:** Middleware configuration - early in setup

**Sources:**
- [next-intl Middleware Troubleshooting](https://next-intl.dev/docs/routing/middleware)

---

### Pitfall 8: View Transitions Conflicting with Locale Switch

**What goes wrong:** React 19.2 View Transitions animate page changes. Locale switching triggers transition animation even when staying on same content, creating jarring flash.

**Why it happens:** View Transitions API captures screenshots before/after state changes. If locale switch causes re-render (even without navigation), transition animates the text change.

**Warning signs:**
- Flash/animation when switching language
- "Flicker" effect as old text fades and new appears
- View transition animation playing on every language switch
- User perceives language switch as "slow" even though it's instant

**Prevention:**
- For instant client-side switching, bypass View Transitions entirely
- Use CSS to disable transitions during locale switch
- Or embrace it: style the transition to feel intentional

```typescript
const switchLocale = (newLocale: string) => {
  // Disable view transitions temporarily
  document.documentElement.classList.add('no-view-transition');
  setLocale(newLocale);
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-view-transition');
  });
};
```

```css
.no-view-transition *,
.no-view-transition *::view-transition-old(*),
.no-view-transition *::view-transition-new(*) {
  animation: none !important;
}
```

**Phase to address:** Implementation phase - when building language switcher

**Sources:**
- [React View Transitions](https://react.dev/reference/react/ViewTransition)
- [Motion Blog - React View Transitions](https://motion.dev/blog/reacts-experimental-view-transition-api)

---

## Translation Pitfalls

Common mistakes with translation file management and quality.

### Pitfall 9: Single Monolithic Translation File

**What goes wrong:** All translations in one file (`messages/en.json`) grows unwieldy. Hard to find keys, merge conflicts, loading more than needed.

**Why it happens:** Starting simple is good, but portfolios grow. Services, projects, testimonials each add content.

**Warning signs:**
- Translation file exceeds 300 lines
- Duplicate or near-duplicate keys
- Hard to find specific translation
- Loading full file even for small component

**Prevention:**
Organize by feature/section:
```
messages/
  en/
    common.json      // Shared: buttons, nav, footer
    hero.json        // Hero section
    services.json    // Services section
    projects.json    // Project case studies
    contact.json     // Contact form
  fr/
    common.json
    hero.json
    // ...
```

Merge at load time:
```typescript
const messages = {
  ...(await import(`../messages/${locale}/common.json`)).default,
  ...(await import(`../messages/${locale}/hero.json`)).default,
  // ...
};
```

**For small portfolio:** Single file is fine initially. Split when it becomes painful.

**Phase to address:** Translation file structure - before writing translations

**Sources:**
- [i18next Namespaces](https://www.i18next.com/principles/namespaces)
- [Split translations in next-intl](https://dev.to/hpouyanmehr/split-your-translations-in-next-intl-in-a-nice-way-4jof)

---

### Pitfall 10: Missing Translation Keys Silently Fail

**What goes wrong:** Typo in translation key shows the key itself (`hero.title`) instead of translated text. In production, visitors see raw keys. Developer doesn't notice during development.

**Why it happens:** Default behavior shows key as fallback. No error thrown. Easy to miss during manual testing.

**Warning signs:**
- Raw keys appearing on page (`common.submit_button`)
- No console warnings for missing keys
- Translations work in development but not production (different files)
- Adding new content without remembering to translate

**Prevention:**
1. Enable strict mode in development:
```typescript
// Only in development
if (process.env.NODE_ENV === 'development') {
  i18n.on('missingKey', (lngs, namespace, key) => {
    console.error(`Missing translation: ${namespace}:${key} for ${lngs}`);
  });
}
```

2. Use TypeScript for type-safe keys:
```typescript
// Generate types from translation files
type Messages = typeof import('../messages/en.json');
declare global {
  interface IntlMessages extends Messages {}
}
```

3. Add CI check for missing keys between locales

**Phase to address:** Development tooling - set up before writing translations

**Sources:**
- [Fixing Missing Translations in i18next](https://www.locize.com/blog/missing-translations/)
- [i18next Configuration Options](https://www.i18next.com/overview/configuration-options)

---

### Pitfall 11: Machine Translation Without Review

**What goes wrong:** Using Google Translate or similar for French translations produces grammatically correct but tonally wrong content. The empathetic "been burned before?" becomes cold and corporate in translation.

**Why it happens:** Machine translation is fast and cheap. For a portfolio emphasizing emotional connection with "weary, skeptical" visitors, tone matters enormously.

**Warning signs:**
- French text reads technically correct but feels "off"
- Idioms translated literally ("been burned" -> "avoir ete brule")
- Formal/informal tone inconsistent (tu vs. vous mixing)
- Cultural references that don't translate

**Prevention:**
- Machine translate first, then HUMAN REVIEW by native speaker
- Establish tone guide: Use "vous" (formal) or "tu" (informal)? The portfolio's warm-but-professional tone likely wants "vous"
- Test translated emotional hooks with French speakers
- Pay for professional translation of key emotional content (hero, empathy hooks)

**For this portfolio specifically:**
- "Been burned by agencies?" -> Review how to express this in French idiom
- "Workshop at golden hour" metaphor - does it resonate culturally?
- Small business terminology differs between cultures

**Phase to address:** Content translation - after initial implementation

**Sources:**
- [Phrase: Detecting User Locale](https://phrase.com/blog/posts/detecting-a-users-locale/)

---

### Pitfall 12: Inconsistent Translation Key Naming

**What goes wrong:** Keys are named inconsistently (`submitButton` vs `submit_button` vs `btnSubmit`). Hard to find, predict, or maintain.

**Why it happens:** No convention established upfront. Different developers (or same developer on different days) use different patterns.

**Warning signs:**
- Mixed naming conventions in same file
- Duplicate concepts with different keys
- Can't guess what a key should be named
- Refactoring requires renaming many keys

**Prevention:**
Establish convention BEFORE writing any translations:

```json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "projects": "Projects",
    "contact": "Contact"
  },
  "hero": {
    "title": "...",
    "subtitle": "...",
    "cta": "Get in Touch"
  },
  "common": {
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel"
    },
    "form": {
      "required": "Required",
      "email_invalid": "Please enter a valid email"
    }
  }
}
```

**Convention for this project:**
- snake_case for multi-word keys
- Nest by section/component
- Prefix actions with verb: `submit`, `cancel`, `view_more`
- Suffix types: `_title`, `_description`, `_label`, `_placeholder`

**Phase to address:** Before writing any translations

---

## SEO Pitfalls

Mistakes that hurt search visibility in both languages.

### Pitfall 13: Missing or Incorrect hreflang Tags

**What goes wrong:** Search engines don't understand EN and FR pages are translations. French visitors see English page in Google results. Duplicate content penalties possible.

**Why it happens:** hreflang tags must be manually implemented in App Router. Easy to forget or misconfigure.

**Warning signs:**
- Google Search Console shows "no return tag" errors
- French speakers see English version in French Google
- Both language versions competing for same keywords
- Lower rankings than expected for French content

**Prevention:**
Add hreflang tags in `generateMetadata`:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://civixsolutions.com';

  return {
    alternates: {
      canonical: locale === 'en' ? baseUrl : `${baseUrl}/fr`,
      languages: {
        'en': baseUrl,
        'fr': `${baseUrl}/fr`,
        'x-default': baseUrl  // Default for unsupported languages
      }
    }
  };
}
```

**Requirements:**
- Use absolute URLs (not relative)
- Include self-referencing link (EN page lists EN)
- Include x-default for fallback
- Every page must have both language alternates
- Bidirectional: EN links to FR, FR links to EN

**Phase to address:** SEO configuration - during implementation

**Sources:**
- [Next.js Multilingual SEO with hreflang](https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags)
- [Lingo.dev hreflang Guide](https://lingo.dev/en/nextjs-i18n/link-language-alternatives)

---

### Pitfall 14: Browser Detection Overriding User Choice

**What goes wrong:** User explicitly switches to French, but on next visit, browser detection switches them back to English because their browser is set to English.

**Why it happens:** Auto-detection runs on every visit if not properly configured. Cookie preference not checked first.

**Warning signs:**
- Users complain language keeps resetting
- Language switch doesn't "stick"
- Detection hierarchy not respecting explicit choices

**Prevention:**
Implement proper detection hierarchy:
1. Check for explicit user choice (cookie: `NEXT_LOCALE`)
2. Only if no cookie, check `Accept-Language` header
3. Only run detection on first visit

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  if (cookieLocale && locales.includes(cookieLocale)) {
    // User has explicit preference - respect it
    return NextResponse.next();
  }

  // Only detect on first visit (no cookie)
  const acceptLanguage = request.headers.get('Accept-Language');
  const detectedLocale = detectLocaleFromHeader(acceptLanguage);
  // ...
}
```

**Phase to address:** Middleware logic - during implementation

**Sources:**
- [i18n Locale Detection Best Practices](https://dev.to/lingodotdev/every-way-to-detect-a-users-locale-from-best-to-worst-369i)

---

### Pitfall 15: Google Crawler Getting Wrong Language

**What goes wrong:** Googlebot doesn't send Accept-Language header. Gets redirected to detected language (often English) and only indexes that version.

**Why it happens:** Crawlers have no language preference. Auto-redirect based on detection prevents them from seeing alternate versions.

**Warning signs:**
- Google only indexes English version
- French pages not appearing in Google Search Console
- Search results only show one language

**Prevention:**
- Ensure crawlers can access both versions without detection redirect
- Use hreflang tags (crawlers follow these)
- Don't redirect based solely on Accept-Language
- In `localePrefix: 'as-needed'` mode, both `/` and `/fr/` should be accessible

```typescript
// Let crawlers access without redirect
const isBot = /bot|crawl|spider|slurp/i.test(userAgent);
if (isBot) {
  // Don't auto-redirect bots - let them access requested URL
  return NextResponse.next();
}
```

**Phase to address:** Middleware logic and SEO - during implementation

**Sources:**
- [Nuxt i18n Browser Detection](https://i18n.nuxtjs.org/docs/guide/browser-language-detection)

---

## Prevention Strategies Summary

| Pitfall | Warning Sign | Prevention | Phase |
|---------|--------------|------------|-------|
| Pages Router config | `i18n` in next.config.js | Use next-intl or equivalent | Architecture |
| Static rendering | Dynamic rendering warning | `setRequestLocale()` + `generateStaticParams` | Setup |
| State loss on switch | Page scrolls to top on switch | Client-side context, not navigation | Architecture |
| Hydration mismatch | React hydration error | Explicit timezone, careful with dates | Configuration |
| URL structure break | Old URLs 404 | `localePrefix: 'as-needed'` | Architecture |
| Missing [locale] wrap | "Unable to find locale" | Restructure all pages under [locale] | File structure |
| Middleware matcher | Some routes not localized | Explicit matcher config | Middleware |
| View Transition conflict | Flash on language switch | Disable transitions during switch | Implementation |
| Monolithic translations | 300+ line JSON file | Split by section/feature | File structure |
| Missing keys silent | Raw keys on page | TypeScript types, dev warnings | Tooling |
| Machine translation | Tone feels off | Human review, especially emotional content | Translation |
| Inconsistent key names | Mixed conventions | Establish naming convention first | Before translation |
| Missing hreflang | Wrong language in Google | `generateMetadata` with alternates | SEO |
| Detection override | Language keeps resetting | Cookie-first hierarchy | Middleware |
| Crawler wrong language | Only one language indexed | Don't redirect bots, use hreflang | Middleware/SEO |

---

## Phase-Specific Checklist

### Phase 1: Architecture Decisions
- [ ] Library chosen (next-intl recommended)
- [ ] URL strategy decided (`localePrefix: 'as-needed'` for existing site)
- [ ] Client-side switching approach decided (context vs. navigation)
- [ ] Translation file structure decided

### Phase 2: Setup and Configuration
- [ ] `[locale]` segment structure created
- [ ] Middleware configured with correct matcher
- [ ] `setRequestLocale()` in all layouts/pages
- [ ] `generateStaticParams` returning all locales
- [ ] NextIntlClientProvider configured with explicit timezone
- [ ] TypeScript types for translation keys

### Phase 3: Translation Content
- [ ] Key naming convention documented
- [ ] English translations extracted from existing content
- [ ] French translations created (human reviewed)
- [ ] Emotional content (hero, empathy hooks) professionally translated
- [ ] Form labels and validation messages translated

### Phase 4: Language Switcher
- [ ] Switcher component built (FR on top, EN on bottom per requirements)
- [ ] Instant switch without page reload
- [ ] User preference stored in cookie
- [ ] View Transitions handled (no flash)
- [ ] Switcher accessible (keyboard, screen reader)

### Phase 5: Browser Detection
- [ ] Detection only on first visit (no cookie)
- [ ] Cookie takes precedence over detection
- [ ] Bots not redirected
- [ ] Fallback to English if detection fails

### Phase 6: SEO
- [ ] hreflang tags on all pages
- [ ] x-default set to English
- [ ] Canonical URLs correct
- [ ] Both languages accessible to crawlers
- [ ] sitemap.xml includes both language versions

### Pre-Launch
- [ ] Test switching multiple times (doesn't reset)
- [ ] Test as French speaker (browser set to French)
- [ ] Test with JavaScript disabled (graceful degradation)
- [ ] Verify no hydration errors in console
- [ ] Google Search Console preview both versions
- [ ] All external links still work (no URL structure breakage)

---

## Sources

### Official Documentation
- [Next.js Internationalization Guide](https://nextjs.org/docs/app/guides/internationalization)
- [next-intl App Router Setup](https://next-intl.dev/docs/getting-started/app-router)
- [next-intl Middleware Configuration](https://next-intl.dev/docs/routing/middleware)

### Technical Issues and Solutions
- [next-intl Static Rendering Issue #521](https://github.com/amannn/next-intl/issues/521)
- [next-intl State Persistence Issue #496](https://github.com/amannn/next-intl/issues/496)
- [next-intl Hydration Issue #467](https://github.com/amannn/next-intl/issues/467)
- [next-i18next Migration Issue #2221](https://github.com/i18next/next-i18next/issues/2221)

### Best Practices
- [Locale Detection Best Practices](https://dev.to/lingodotdev/every-way-to-detect-a-users-locale-from-best-to-worst-369i)
- [i18next Namespaces](https://www.i18next.com/principles/namespaces)
- [i18next Fallback Configuration](https://www.i18next.com/principles/fallback)
- [Fixing Missing Translations](https://www.locize.com/blog/missing-translations/)

### SEO
- [Next.js Multilingual SEO with hreflang](https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags)
- [Next.js Multilingual SEO Checklist](https://staarter.dev/blog/nextjs-multilingual-seo-checklist-2024)
- [Lingo.dev hreflang Guide](https://lingo.dev/en/nextjs-i18n/link-language-alternatives)

### Tutorials
- [next-intl Complete Guide 2025](https://www.buildwithmatija.com/blog/nextjs-internationalization-guide-next-intl-2025)
- [i18n in Next.js App Router](https://www.ali-dev.com/blog/implementing-internationalization-i18n-in-next-js-15-with-the-app-router)
