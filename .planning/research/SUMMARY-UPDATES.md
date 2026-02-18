# Research Summary: Milestone v1.2 — Live Updates Page

**Project:** Civix Solutions Portfolio — /updates page (live resume / developer activity stream)
**Domain:** Developer activity stream integrated into a consulting portfolio
**Researched:** 2026-02-18
**Confidence:** HIGH

---

## Executive Summary

Adding a /updates page to the Civix Solutions portfolio is architecturally clean and technically low-risk. The existing root layout already provides all required providers (i18n, Motion, custom cursor) to any new route, so the /updates page inherits the full design system with zero layout wiring. The recommended implementation uses plain `.md` files in `src/content/updates/`, parsed server-side via `gray-matter` + `unified`/`remark`/`rehype`, with tag filtering implemented via URL search params for shareable filtered views — six well-established packages, no config file changes, no Turbopack complications.

The most important architectural decision is the server/client boundary: markdown reading and parsing happens in a server-only utility (`src/lib/updates.ts`), the page is a server component with `"use cache"`, and only the tag filter and animated list are client components. This keeps zero markdown processing overhead in the client bundle. The one meaningful change to existing code is Navigation.tsx, which must become route-aware via `usePathname()` to handle the transition from scroll-to-anchor links (homepage) to route links (/updates).

The top risk for this feature is not technical — it is content strategy. A consulting portfolio's updates page that goes stale reads as abandonment to skeptical small business owners. Every design decision should be made with this risk in mind: avoid prominent timestamps, launch with 4-6 solid entries, require a "would a potential client care about this?" test for every entry, and include a persistent contact CTA on the updates page so it does not become a conversion dead end.

---

## Key Findings

### Recommended Stack

Plain markdown processed at the server is the right call for this project. MDX is unnecessary because update entries will never embed interactive React components. Velite is ruled out due to confirmed Turbopack incompatibility (VeliteWebpackPlugin is broken with Turbopack; the workaround is fragile). Contentlayer is abandoned. A headless CMS would introduce auth, API surface, and vendor dependency for content authored by one developer.

The `gray-matter` + `unified` pipeline approach adds 6 dependencies (all ESM-compatible, all verified stable), requires zero changes to `next.config.ts`, and slots naturally into Next.js 16 App Router server components via `node:fs`. `@tailwindcss/typography` provides `prose` class styling for rendered HTML with zero custom CSS, and integrates with the existing CSS variable theme system.

**Core technologies (new additions):**
- `gray-matter` 4.0.3: Parse YAML frontmatter — industry standard, stable for years, TypeScript types included
- `unified` 11.0.5: Markdown processing pipeline orchestrator — ESM-native, foundation of the remark/rehype ecosystem
- `remark-parse` 11.0.0: Parse markdown to AST — standard unified parser
- `remark-rehype` 11.1.2: Convert markdown AST to HTML AST — bridge between remark and rehype
- `rehype-sanitize` (add): Sanitize HTML output — security habit, even for own content
- `rehype-stringify` 10.0.1: Serialize HTML AST to string — final pipeline step
- `@tailwindcss/typography` 0.5.19: `prose` classes for rendered markdown HTML — integrates with existing Tailwind 4 CSS variable theme

**Optional (defer unless needed):**
- `remark-gfm` 4.0.1: GitHub Flavored Markdown (tables, task lists) — only if entries need these elements
- `rehype-pretty-code` 0.14.1: Syntax-highlighted code blocks — only if entries include code snippets

**What NOT to add:**
- `@next/mdx` / MDX: No React components in update content; adds bundler complexity for zero benefit
- `velite`: Turbopack incompatibility confirmed; pre-1.0 API; over-engineered for single collection
- Any CMS (Sanity, Contentful, etc.): File-based, deploy-to-publish is the requirement
- `contentlayer`: Abandoned project

### Expected Features

**Must have (table stakes):**
- Chronological entry stream (newest-first) — the fundamental pattern for activity streams
- Entry date display using month + year format only (avoids timezone bugs and abandonment anxiety)
- Entry tags with a fixed vocabulary of 5-7 terms, enforced via TypeScript enum at the type level
- Tag filter chip row with URL search params (`?tag=X`) for shareable filtered views
- Responsive layout — single-column stream wraps naturally on all screen sizes
- Navigation integration — "Updates" link in the existing nav via `<Link>` for route navigation
- Bilingual UI chrome — page title, filter labels, and empty states go through the existing `t()` i18n system; entry *content* is English-only
- Persistent contact CTA on the updates page — this page must not be a conversion dead end

**Should have (differentiators):**
- Voice-forward entry format with a "what + why + so-what" structure — demonstrates thinking to potential clients, not just activity
- Entry type visual distinction — different visual treatment (icon, accent color) per tag category aids scanning
- "Last updated" freshness badge — shows the page is alive without displaying granular timestamps on entries
- URL-persisted filter state — already covered by table stakes; worth calling out as differentiating vs. simple client state
- Page intro section — 2-3 sentences explaining the format, especially for non-technical visitors who do not know the /now page pattern
- Link to related portfolio project from within applicable entries — bridges the stream to the main portfolio

**Defer to post-launch:**
- RSS/JSON feed (`/updates/feed.xml` Route Handler) — technically low-cost but not client-facing; build after 6+ entries exist
- Filter transition animations (Motion `AnimatePresence`) — polish, not substance
- Year/month dividers — only needed once there are 20+ entries
- Individual `/updates/[slug]` detail pages — architecture supports `generateStaticParams()` cleanly; not needed at launch

**Anti-features (deliberately excluded):**
- CMS or admin panel: Author in the code editor, deploy on push
- Comments or reactions: Moderation burden, wrong format for a professional signal page
- Infinite scroll: Footer has value; this is finite, intentional content
- Full-text search: Tag filter is sufficient; Cmd+F handles edge cases
- Multi-language entry content: Doubles authoring work for minimal benefit; French notice for EN-only content instead
- Real-time updates / WebSocket: Updates happen days apart, not seconds; static rendering is correct

### Architecture Approach

The /updates route integrates cleanly into the existing App Router structure. The root layout already provides all providers (`LocaleProvider`, `MotionProvider`, `CursorProvider`) to every route via `{children}`, so no new layout file is needed. All markdown reading and parsing happens in `src/lib/updates.ts` (server-only), the page component is a server component with `"use cache"` and `cacheLife("hours")`, and client components are scoped to what genuinely requires browser interaction: the tag filter and animated list.

Tag filtering uses a hybrid approach: URL search params store the active filter (shareable, bookmarkable, back-button-friendly), and the filtering itself happens client-side in `UpdatesList` for instant response with the expected small entry count. The `TagFilter` component wraps `useSearchParams()` in a `<Suspense>` boundary as required by Next.js App Router. The most impactful change to existing code is Navigation.tsx gaining route-aware behavior via `usePathname()`.

**Major components:**
1. `src/lib/updates.ts` (server-only) — reads `src/content/updates/*.md` via `node:fs`, parses with gray-matter + unified, sorts by date, returns typed `UpdateEntry[]`
2. `src/app/updates/page.tsx` (server component) — `"use cache"`, awaits async `searchParams`, calls `getAllUpdates()` and `getAllTags()`, passes data to client components
3. `src/components/updates/UpdatesList.tsx` (client) — receives all entries and active tag, filters client-side, renders animated list via Motion stagger
4. `src/components/updates/TagFilter.tsx` (client) — renders tag chip buttons, updates `?tag=` URL param via `useRouter().push()`, wrapped in `<Suspense>`
5. `src/components/updates/UpdateCard.tsx` (client/presentational) — single entry card using existing design system tokens
6. `src/components/layout/Navigation.tsx` (client, modified) — gains `usePathname()` conditional to render route links on /updates vs. scroll-anchor links on homepage

**Data flow:**
```
src/content/updates/*.md
  -> src/lib/updates.ts (server: fs + gray-matter + unified)
  -> src/app/updates/page.tsx (server component, "use cache")
  -> <UpdatesList> (client: client-side tag filter + Motion animations)
     -> <TagFilter> (client: reads/writes ?tag= URL param)
     -> <UpdateCard> x N (presentational)
```

**Files that need no changes:** `layout.tsx`, `page.tsx` (homepage), `lib/i18n.tsx`, cursor components, motion components, `globals.css`, `types/i18n.d.ts`

### Critical Pitfalls

1. **The Abandoned Blog Signal** — Do not display granular timestamps ("3 months ago") on entries. Show month + year at most. Launch with 4-6 strong entries. Add an evergreen "What I'm currently working on" section that can be updated with a single-line edit. If a realistic posting commitment cannot be made, do not build this page.

2. **Writing for Developers Instead of Clients** — Every entry must pass the "would a small business owner running a bakery understand and care about this?" test. Frame technical work in terms of client value. Create a content rubric before writing the first entry. Entries with code snippets or jargon belong on a personal blog, not this page.

3. **Fragmenting the CTA Flow** — The updates page must include a persistent, contextual contact CTA ("Like what you see? Let's talk about your project"). The page should feel like an extension of the portfolio, sharing the same visual frame and navigation, not a separate blog with a different shell. Evaluate whether /updates belongs in primary navigation or as a secondary footer/about link.

4. **Bilingual Chrome Around English-Only Content** — Display a single French-language notice at the top of the updates page when the locale is FR: "Ces articles sont disponibles en anglais uniquement." Do not render French UI navigation around English body content with no acknowledgment. That is the worst option.

5. **Tag Taxonomy Sprawl** — Define a maximum of 5-7 tags before writing the first entry. Enforce them via a TypeScript union type so that any invalid tag is a compile-time error. Suggested vocabulary: `project-launch`, `design-thinking`, `business`, `community`, `learning`. Do not build the tag filter UI until there are 10+ entries.

6. **Timestamp and Timezone Display Bugs** — Never construct a JavaScript `Date` object from a `YYYY-MM-DD` frontmatter string and display it with `toLocaleDateString()`. Format dates on the server only, pass the formatted string to the client, and display only month + year to sidestep both timezone offset bugs and React hydration mismatches.

---

## Implications for Roadmap

Based on combined research, a five-phase build order is recommended. Each phase builds on the previous and is ordered to minimize risk, surface architectural decisions early, and provide working visible output at each stage.

### Phase 1: Content Foundation

**Rationale:** All subsequent phases depend on having typed content infrastructure. Schema decisions made here (tag vocabulary, frontmatter shape) are hard to change retroactively without touching every `.md` file. Pitfalls 5, 6, and 7 (taxonomy sprawl, schema drift, date bugs) must all be addressed at this phase before any content is written.

**Delivers:** TypeScript types for `UpdateEntry` and `UpdateTag`, fixed tag vocabulary enforced as a union type, `src/content/updates/` directory with 4-6 initial markdown files, installed dependencies (`gray-matter` + `unified` ecosystem + `@tailwindcss/typography`), server-only `src/lib/updates.ts` utility

**Addresses:** Table stakes (entry stream, tag metadata), frontmatter schema, content strategy decisions (date format, tag vocabulary, content rubric)

**Avoids:** Tag taxonomy sprawl (Pitfall 5), frontmatter schema drift (Pitfall 6), timestamp timezone bugs (Pitfall 7), markdown edge cases (Pitfall 10)

**Research flag:** No additional research needed — patterns are well-documented and stack is verified

### Phase 2: Page Shell and i18n

**Rationale:** Establishing the page route and i18n keys before building UI components ensures the bilingual handling decision is made explicitly (Pitfall 4) and that the French-language notice for English-only content is designed into the layout from the start. The contact CTA placement (Pitfall 3) must also be addressed at this phase during layout design.

**Delivers:** `src/app/updates/page.tsx` (server component with `"use cache"`), i18n keys added to `messages/en.json` and `messages/fr.json`, page intro section (bilingual), French-language notice for EN-only content, persistent contact CTA placement, page shell rendering raw entry data at `/updates`

**Addresses:** Bilingual UI chrome (table stakes), page intro section (differentiator), contact CTA (Pitfall 3), bilingual content mismatch (Pitfall 4)

**Avoids:** CTA dead end (Pitfall 3), bilingual chrome around English-only content (Pitfall 4)

**Research flag:** No additional research needed — Next.js 16 async `searchParams` and `"use cache"` patterns are verified

### Phase 3: UI Components

**Rationale:** With types, data layer, and page shell established, UI components can be built with full type safety and real content. The tag filter's Suspense boundary requirement is handled here. This phase is self-contained and does not touch existing code.

**Delivers:** `UpdateCard.tsx` (styled presentational card using existing design tokens), `TagFilter.tsx` (tag chip buttons with `useSearchParams()` + `useRouter().push()`, wrapped in `<Suspense>`), `UpdatesList.tsx` (client-side filter + Motion stagger animations), `@tailwindcss/typography` prose styling for rendered HTML

**Addresses:** Tag filter with URL params (table stakes), responsive layout (table stakes), entry type visual distinction (differentiator), "last updated" freshness badge (differentiator)

**Avoids:** Writing for developers instead of clients — visual design of tags/cards should keep client-value framing front and center (Pitfall 2)

**Research flag:** No additional research needed — Motion stagger animation pattern already exists in the codebase (`containerVariants` + `itemVariants`)

### Phase 4: Navigation Integration

**Rationale:** Navigation.tsx is the highest-risk change because it modifies existing code that affects the homepage. Doing this after the /updates page itself works reduces the chance that navigation refactoring blocks the core feature. Route-aware behavior via `usePathname()` is a targeted, reversible change.

**Delivers:** Modified `Navigation.tsx` with `usePathname()` conditional (homepage: scroll-anchor links unchanged; /updates: route links), modified `Footer.tsx` with "Updates" link via `<Link>`, visual consistency check across both routes

**Addresses:** Navigation from main site and back navigation (table stakes)

**Avoids:** Breaking existing homepage scroll behavior, which is carefully tuned

**Research flag:** No additional research needed — `usePathname()` is standard Next.js App Router

### Phase 5: Polish and Content Strategy Hardening

**Rationale:** Polish depends on real content existing and navigation working. This phase is also the moment to verify the content rubric is working in practice (Pitfalls 1, 2, 8) and that the page reads correctly to a non-technical audience.

**Delivers:** Responsive design pass, grain texture and visual consistency with main portfolio, Motion stagger tuning, "last updated" freshness signal, content rubric validation on initial entries, quality bar check ("would a client feel good reading this?")

**Addresses:** Voice-forward entry format (differentiator), entry quality as first impression (Pitfall 8), abandoned blog signal prevention (Pitfall 1)

**Defers:** RSS feed (`/updates/feed.xml`) — build post-launch once 6+ entries exist; year dividers — only needed at 20+ entries

**Research flag:** No additional research needed for polish phase

### Phase Ordering Rationale

- Phase 1 before Phase 2: TypeScript types and the data utility must exist before the page component can use them. Tag vocabulary must be decided before content is authored.
- Phase 2 before Phase 3: i18n keys must exist before components call `t()`. The contact CTA placement decision (Phase 2) shapes the component layout (Phase 3).
- Phase 3 before Phase 4: The /updates page must render correctly before modifying the shared navigation that serves the homepage.
- Phase 4 before Phase 5: Cannot polish navigation behavior that has not been implemented yet.
- The architecture research suggests Phase 4 could begin in parallel with Phase 3, since they touch different files. However, sequential ordering is recommended for a solo implementation to reduce context-switching and catch integration issues early.

### Research Flags

Phases needing no additional research (standard, well-documented patterns):
- **Phase 1:** `gray-matter` + `unified` are the Next.js-recommended markdown stack; npm versions verified
- **Phase 2:** Next.js 16 async `searchParams`, `"use cache"` directive, and `cacheLife()` APIs verified against official docs
- **Phase 3:** `useSearchParams()` + `<Suspense>` requirement is documented; Motion stagger pattern exists in codebase
- **Phase 4:** `usePathname()` is standard Next.js App Router; `<Link>` for client-side navigation is table stakes
- **Phase 5:** No new patterns; all prior phases inform this

No phase requires a `/gsd:research-phase` call. Research confidence is high across all dimensions.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified via npm. Next.js 16 patterns verified against official docs. Velite incompatibility confirmed in Velite's own documentation. |
| Features | HIGH | /now page and developer activity stream are established patterns with clear prior art. Table stakes are well-understood. Anti-features list is grounded in consulting website research. |
| Architecture | HIGH | Based on direct codebase analysis (all files read). Next.js 16 App Router server/client boundary patterns are well-documented. No speculative architecture decisions. |
| Pitfalls | MEDIUM-HIGH | Technical pitfalls (timezone bugs, schema drift, tag sprawl) are HIGH confidence. Content strategy pitfalls (abandonment, wrong audience, CTA fragmentation) are MEDIUM-HIGH — grounded in consulting website research and first-principles reasoning about the target audience, but harder to objectively verify. |

**Overall confidence:** HIGH

### Gaps to Address

- **Content rubric:** A formal one-page content rubric (audience test, quality bar checklist, topic guidance) should be authored before writing the first entry. This is not a technical gap but it is the highest-risk gap. Address during Phase 1 planning.
- **Tag vocabulary finalization:** The architecture research uses tags like `engineering`, `design`, `project`, `announcement`, `personal`. The pitfalls research recommends `project-launch`, `design-thinking`, `business`, `community`, `learning`. These two sets reflect different framings (developer-centric vs. client-value-centric). The client-value-centric set from the pitfalls research is recommended. Decide and lock in the vocabulary as part of Phase 1.
- **Navigation placement:** Whether "Updates" belongs in the primary floating nav bar vs. the footer vs. a hero section link is a design decision not fully resolved by research. The pitfalls file raises this explicitly (Pitfall 3). Recommend treating as a Phase 4 design question with low technical stakes but meaningful UX stakes.
- **Contact CTA copy:** The exact text and placement of the persistent contact CTA on the /updates page is unresolved. Should not be generic; must feel contextual to the stream. Resolve during Phase 2.

---

## Sources

### Primary (HIGH confidence)
- Official Next.js 16 docs — async `searchParams`, `"use cache"` directive, `cacheLife()`, MDX guide, `useSearchParams()` reference
- Velite documentation — confirmed Turbopack incompatibility of `VeliteWebpackPlugin`
- gray-matter GitHub (v4.0.3) — TypeScript types, stability verified
- unified ecosystem (unifiedjs.com) — ESM compatibility, version verification via npm
- Derek Sivers — How and Why to Make a /Now Page (authoritative origin of the pattern)
- IndieWeb /now page documentation — community consensus on pattern
- Keep a Changelog — entry format conventions
- Direct codebase analysis — `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/layout/Navigation.tsx`, `src/lib/i18n.tsx`, `package.json`, `messages/en.json` (all files read directly)
- Google — Managing Multi-Regional and Multilingual Sites (multilingual SEO guidance)

### Secondary (MEDIUM confidence)
- Aurora Scharff — Managing Advanced Search Param Filtering in Next.js App Router (community pattern guide)
- Smashing Magazine — Designing Filters That Work (filter UX patterns)
- LogRocket — Pagination vs. Infinite Scroll UX (reading experience patterns)
- Weglot — UX Principles in Multilingual Design (bilingual UX patterns)
- Consulting website analysis sources (Consulting Success, Crowdspring, Protofuse) — consulting-specific content strategy
- Dovetail — Four Taxonomy Best Practices (tag management)
- nownownow.com — /now page pattern context

### Tertiary (MEDIUM confidence, supporting context)
- RSS relevance research (kenmorico.com) — RSS still matters for developer audience
- Filter UI design best practices (insaim.design) — chip/toggle patterns
- Brilliant Author — Blogging for Consultants: Pros and Cons — consulting-specific blogging advice

---

*Research completed: 2026-02-18*
*Ready for roadmap: yes*
