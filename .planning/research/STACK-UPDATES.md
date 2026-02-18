# Stack Research: Live Updates Page (Markdown Content System)

**Project:** Civix Solutions Portfolio - /updates page
**Researched:** 2026-02-18
**Overall Confidence:** HIGH

---

## Executive Summary

For a developer-edited markdown updates page in Next.js 16 App Router, the simplest and most robust approach is **plain markdown with gray-matter + unified/remark/rehype**, processed directly in server components. This avoids the complexity of MDX (not needed -- no React components in content), the Turbopack incompatibility of Velite, and the overhead of content framework abstractions.

The recommended pattern: store `.md` files in `/content/updates/`, read them with `fs` in a server-side utility, parse frontmatter with `gray-matter`, convert markdown to HTML with the unified pipeline, and render with Tailwind Typography for styling. Tag filtering uses URL search params consumed by the server component page, giving shareable filtered URLs with zero client-side state management.

This approach adds only 6 dependencies (all battle-tested, ESM-compatible), requires no changes to `next.config.ts`, and works perfectly with Turbopack.

---

## Recommended Stack Additions

### Content Processing

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| `gray-matter` | 4.0.3 | Parse YAML frontmatter from .md files | Industry standard, used by Gatsby/Astro/Eleventy/Netlify. Zero config. TypeScript types included. |
| `unified` | 11.0.5 | Markdown processing pipeline orchestrator | Foundation of the remark/rehype ecosystem. ESM-native. |
| `remark-parse` | 11.0.0 | Parse markdown into AST | Standard markdown parser for unified pipeline. |
| `remark-rehype` | 11.1.2 | Transform markdown AST to HTML AST | Bridge between remark and rehype ecosystems. |
| `rehype-stringify` | 10.0.1 | Serialize HTML AST to string | Final step: AST to HTML string for rendering. |

### Content Styling

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| `@tailwindcss/typography` | 0.5.19 | `prose` classes for rendered markdown HTML | Already using Tailwind 4. Typography plugin provides beautiful defaults for headings, paragraphs, lists, links, code blocks with zero custom CSS. Recommended by Next.js official MDX guide. |

### Optional (Add Only If Needed Later)

| Library | Version | Purpose | When to Add |
|---------|---------|---------|-------------|
| `remark-gfm` | 4.0.1 | GitHub Flavored Markdown (tables, strikethrough, task lists) | If update entries need tables or task lists |
| `rehype-pretty-code` | 0.14.1 | Syntax-highlighted code blocks via Shiki | If update entries include code snippets |

---

## Decision 1: Plain Markdown, NOT MDX

**Recommendation:** Use plain `.md` files, not `.mdx`.
**Confidence:** HIGH

| Factor | Plain Markdown | MDX |
|--------|---------------|-----|
| Content complexity | Text, links, images, lists -- sufficient | Overkill for blog-style entries |
| React components in content | Not needed for updates | MDX's primary value proposition |
| Build tooling | Zero config changes to next.config.ts | Requires @next/mdx, mdx-components.tsx, pageExtensions config |
| Turbopack compatibility | Full (no bundler involvement) | Remark/rehype plugins with Turbopack require string-based plugin names and have serialization limitations for plugin options |
| Author experience | Standard markdown any developer knows | MDX syntax is unfamiliar to many |
| Dependencies | gray-matter + unified pipeline (5 small, stable packages) | @next/mdx + @mdx-js/loader + @mdx-js/react + @types/mdx (4 packages, bundler-integrated) |
| Processing model | Server-side at request/build time via fs -- fully in your control | Bundler-integrated, more complex failure modes |

**When MDX would be warranted:** If update entries needed to embed interactive React components (charts, demos, custom widgets) inside the content body. For text-based status updates, MDX adds complexity without benefit.

---

## Decision 2: Gray-Matter + Unified Pipeline, NOT Velite

**Recommendation:** Use gray-matter + unified directly, not Velite or other content frameworks.
**Confidence:** HIGH

| Factor | gray-matter + unified | Velite |
|--------|----------------------|-------|
| Turbopack | Works perfectly (no bundler integration needed) | **Broken** -- VeliteWebpackPlugin is incompatible with Turbopack. A workaround exists (programmatic API call in next.config) but it is fragile, requires process.argv inspection, and adds startup complexity. |
| Complexity | ~50 lines of utility code in one file | Full framework with Zod schemas, build step, output directory, velite.config.ts |
| Dependencies | 5 small, stable packages | 1 framework + transitive deps |
| Type safety | TypeScript interface for frontmatter shape (manual but trivial for ~5 fields) | Zod schema validation (more robust but unnecessary for this scale) |
| Learning curve | Standard Node.js fs + well-documented unified API | Velite-specific configuration, collection definitions, build pipeline |
| Maintenance | gray-matter has been stable at 4.0.3 for years; unified ecosystem is mature | Velite is at 0.3.1 (pre-1.0), actively evolving API |

**Velite's sweet spot:** Large content-heavy sites with multiple collections, cross-references, and complex validation needs (documentation sites, multi-author blogs). For a single "updates" collection with 5 frontmatter fields, it is over-engineered.

**Contentlayer:** Not considered -- the project is abandoned/unmaintained.

---

## Decision 3: URL Search Params for Tag Filtering (Server-Side)

**Recommendation:** Use URL `searchParams` in the server component page, not client-side `useState`.
**Confidence:** HIGH

**Approach:** `/updates?tag=launch` filters entries server-side before rendering.

| Factor | URL searchParams (server) | Client useState |
|--------|--------------------------|-----------------|
| Shareable URLs | Yes -- `/updates?tag=frontend` is linkable and bookmarkable | No -- filter state lost on page refresh |
| SEO | Filtered pages are crawlable | Not crawlable |
| SSR compatibility | Natural -- server component reads searchParams, filters, renders | Requires hydration, "use client" boundary |
| Implementation | page.tsx receives searchParams prop, filter array before rendering | Need "use client", useSearchParams hook, state management |
| JavaScript shipped | Zero JS for filtering logic | Client JS bundle for filter state + re-render |
| Next.js 16 pattern | Idiomatic -- searchParams is async prop (await it) | Works but unnecessarily client-heavy |

**Implementation pattern:**
```typescript
// app/updates/page.tsx (Server Component)
export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const allUpdates = await getUpdates()
  const filtered = tag
    ? allUpdates.filter(u => u.tags.includes(tag))
    : allUpdates
  // render filtered list
}
```

Tag filter UI uses simple `<Link href="/updates?tag=X">` elements -- no client component needed for basic tag chips. The active tag state is derived from the URL, not from React state.

If instant visual feedback is desired later (e.g., highlight active tag without full navigation), a thin client wrapper with `useSearchParams()` and `router.push()` with `scroll: false` can be added incrementally.

---

## Content File Structure

```
/content/
  updates/
    2026-02-18-civix-launches.md
    2026-02-15-new-project-rippl.md
    2026-02-10-stack-decisions.md
```

**Frontmatter schema:**
```yaml
---
title: "Civix Solutions Launches"
date: 2026-02-18
tags: [launch, announcement]
summary: "Brief description for the list view"
---

Markdown content here...
```

**TypeScript interface:**
```typescript
interface UpdateEntry {
  slug: string        // derived from filename
  title: string
  date: string        // ISO date string from frontmatter
  tags: string[]
  summary: string
  contentHtml: string // rendered HTML from markdown body
}
```

---

## How Filesystem Reading Works in Server Components

Next.js App Router server components can use Node.js `fs` directly. The utility function pattern:

1. `fs.readdirSync()` to list `/content/updates/*.md` files
2. `fs.readFileSync()` each file
3. `gray-matter()` to extract frontmatter data + markdown body
4. `unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(body)` to convert markdown body to HTML
5. Sort entries by date descending
6. Return typed `UpdateEntry[]` array

This runs at request time by default in Next.js 16. Since content only changes on deploy, the page is effectively static. Options for explicit caching:

- **`"use cache"` directive** on the utility function -- caches the result across requests
- **`generateStaticParams`** if individual `/updates/[slug]` detail pages are added later
- No caching needed initially -- filesystem reads are fast and content is static per deployment

---

## Next.js 16 Specific Considerations

| Consideration | Approach |
|---------------|----------|
| `searchParams` is async | `await searchParams` in page component -- standard Next.js 16 pattern already used in project |
| Turbopack default bundler | All chosen libraries work without bundler plugins -- no webpack config, no next.config changes |
| `"use cache"` directive | Can add to content-reading utility for build-time caching. Not required initially since content is static per deploy. |
| `next.config.ts` | **No changes needed.** No MDX plugin, no Velite plugin, no pageExtensions modification. |
| React Compiler | Already enabled (`reactCompiler: true`). All utility functions are pure, no compatibility issues expected. |
| ESM compatibility | unified ecosystem is ESM-only. Next.js 16 with `next.config.ts` handles ESM imports correctly. Verified: gray-matter supports both CJS and ESM. |

---

## Installation

```bash
# Content processing (5 packages)
npm install gray-matter unified remark-parse remark-rehype rehype-stringify

# Content styling (1 package)
npm install @tailwindcss/typography
```

**Total new dependencies:** 6
**Config file changes:** Zero

---

## What NOT to Add (and Why)

| Technology | Why Not |
|------------|---------|
| **Velite** | Turbopack incompatibility (VeliteWebpackPlugin broken). Pre-1.0 library (v0.3.1). Over-engineered for single collection. |
| **@next/mdx** | No React components in update content. Requires next.config changes, mdx-components.tsx file, pageExtensions config. Adds bundler complexity for zero benefit. |
| **next-mdx-remote** | Designed for remote/CMS-sourced content. Local filesystem files don't need serialization/deserialization. |
| **Contentlayer** | Abandoned project, no longer maintained. |
| **Any headless CMS** (Sanity, Strapi, Contentful) | Requirement is file-based, developer-edited, deploy-to-publish. CMS adds auth UI, API layer, hosting cost, and vendor dependency -- all unnecessary. |
| **Database** | Content is static markdown files deployed with code. No database warranted. |
| **next-mdx-remote-client** | Fork of next-mdx-remote. Same reasoning applies -- not needed for local files. |

---

## Integration with Existing Stack

| Existing Tech | Integration Point |
|---------------|-------------------|
| **Next.js 16 App Router** | Server component reads fs, processes markdown, renders HTML. Standard server component pattern. |
| **TypeScript strict** | Define `UpdateEntry` interface for type-safe frontmatter handling. gray-matter returns generic data; cast to typed interface. |
| **Tailwind CSS 4** | `@tailwindcss/typography` plugin provides `prose` classes for rendered HTML. Customize prose colors with CSS variables already in the project's theme system. |
| **shadcn/ui** | Tag filter chips can use existing Badge component. Update list items can use Card component if desired. No new shadcn components required. |
| **Motion library** | Staggered entry reveal on the updates list page, consistent with existing animation patterns (containerVariants + itemVariants pattern already used in project). |
| **i18n (EN/FR)** | Page chrome (headings, filter labels, "All" tag label) goes through existing React Context i18n system. Content files themselves are single-language (English). If bilingual content is needed later, filename convention (`*.en.md` / `*.fr.md`) can be added without architectural changes. |
| **Vercel deployment** | Markdown files are part of the codebase. `git push` triggers build, content is read at build/request time. No additional deployment config needed. |

---

## Confidence Assessment

| Area | Level | Rationale |
|------|-------|-----------|
| gray-matter | HIGH | Verified v4.0.3 via npm. Industry standard, used by major frameworks. Stable for years. |
| unified pipeline | HIGH | Verified versions via npm. Recommended by Next.js official docs for markdown-to-HTML. |
| @tailwindcss/typography | HIGH | Verified v0.5.19 via npm. Recommended by Next.js official MDX guide for prose styling. |
| Plain MD over MDX | HIGH | Next.js docs confirm MDX is for embedding React components. No components needed in update content. |
| gray-matter over Velite | HIGH | Velite Turbopack incompatibility confirmed via official Velite docs. Workaround exists but is fragile. |
| URL searchParams filtering | HIGH | Next.js official docs and patterns confirm searchParams prop in server components. Async searchParams verified for Next.js 16. |

---

## Sources

- [Next.js 16 MDX Guide](https://nextjs.org/docs/app/guides/mdx) -- official docs, verified current as of 2026-02-16. Confirms @next/mdx setup, frontmatter handling, remark/rehype plugin usage with Turbopack.
- [gray-matter GitHub](https://github.com/jonschlinkert/gray-matter) -- v4.0.3, stable, TypeScript types included.
- [Velite Next.js Integration](https://velite.js.org/guide/with-nextjs) -- confirms Turbopack incompatibility, documents programmatic API workaround.
- [Next.js useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params) -- official reference for URL search params in App Router.
- [Managing Search Param Filtering in Next.js App Router](https://aurorascharff.no/posts/managing-advanced-search-param-filtering-next-app-router/) -- community pattern guide for server-side filtering.
- [unified ecosystem](https://unifiedjs.com/) -- versions verified via `npm view` commands.
- npm version verification: gray-matter 4.0.3, unified 11.0.5, remark-parse 11.0.0, remark-rehype 11.1.2, rehype-stringify 10.0.1, @tailwindcss/typography 0.5.19, remark-gfm 4.0.1, rehype-pretty-code 0.14.1.
