# Portfolio Project

## Tech Stack
- Next.js 16 with App Router (Turbopack default bundler)
- React 19.2 with View Transitions
- TypeScript strict mode
- Tailwind CSS 4 with CSS variables for theming (not hardcoded colors)
- shadcn/ui components — use the MCP server to verify props, don't hallucinate
- Server components by default, client components only when needed

## Next.js 16 Specifics
- All params and searchParams are async — always `await props.params`
- Use `"use cache"` directive for explicit caching (opt-in, not automatic)
- Use stable `cacheLife` and `cacheTag` APIs (no unstable_ prefix)
- Use `updateTag()` in Server Actions for read-your-writes semantics
- proxy.ts for request interception (replaces middleware.ts, Node.js only)
- React Compiler available but not enabled by default — skip for now

## Structure
/app/                  # App Router pages and layouts
/components/ui/        # Base shadcn components
/components/layout/    # Header, footer, containers
/components/features/  # Project cards, contact form, etc.

## i18n System
- Hooks live in `src/lib/i18n.ts` — import from `@/lib/i18n`
- `useLocale()` returns `{ locale, setLocale }` — use for locale detection
- `useTranslations()` returns the `t` function directly — use for translated strings
- Do NOT use `useLanguage` — it does not exist
- Translation files: `messages/en.json` and `messages/fr.json` at project root
- `TranslationKey` type is derived from `typeof en` — new keys must be added to `en.json` before calling `t()` in components or TypeScript will reject them

## CSS Variables
- Tailwind 4 theme tokens are `--color-*` prefixed: `--color-text-primary`, `--color-text-muted`, `--color-base-800`, `--color-base-700`, `--color-amber-500`, etc.
- Do NOT use shorthand tokens like `--bg`, `--surface`, `--border`, `--accent`, `--text-primary` — they do not exist
- Always read `src/app/globals.css` to confirm actual token names before writing component styles
- Use Tailwind utility classes where possible: `text-text-primary`, `bg-base-800`, `border-base-700`

## Key File Locations
- `UpdateEntry` type: `src/lib/updates.ts` (NOT `src/types/updates.ts`)
- Framed-card layout (`fixed inset-0 p-3 bg-text-primary`, dark inner card `bg-base-900 rounded-[28px]`): used by homepage (`src/app/page.tsx`) AND the updates section (`src/app/updates/layout.tsx`). New standalone pages outside these routes get a clean canvas.
- Static assets (images, etc.) must live in `public/` to be served by Next.js — root-level image files will 404
- `UPDATE_TAGS` / `UpdateTag`: `src/lib/tags.ts` — extracted from `updates.ts` because `updates.ts` has `import 'server-only'`. Client components must import tag constants from `@/lib/tags`, not `@/lib/updates`

## Design Constraints
- No Inter, Roboto, or Arial — distinctive typography only
- Dominant colors with sharp accents, not evenly distributed palettes
- CSS variables for all theme colors
- Container queries over traditional breakpoints where appropriate
- Use React 19.2 View Transitions for page navigation animations
- Animation: orchestrated page loads with staggered reveals (animation-delay)
- For complex animation, use Motion library (formerly Framer Motion)

## Verification
- Use Playwright MCP to screenshot and verify visual output
- Run the dev server and check your work before marking complete
- Turbopack is default — no config needed, just `next dev`

Don't ever run the dev server, let the user do that themselves