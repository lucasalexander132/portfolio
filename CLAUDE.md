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