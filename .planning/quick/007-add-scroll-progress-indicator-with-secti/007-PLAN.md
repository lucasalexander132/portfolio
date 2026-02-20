---
phase: quick-007
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/updates/ScrollProgressIndicator.tsx
  - src/components/updates/EntryArticle.tsx
autonomous: true

must_haves:
  truths:
    - "Right-side vertical indicator appears on update entry pages showing all heading sections"
    - "Each section marker bar width corresponds to heading level (h2 = longest, h3 = shorter)"
    - "Current section is visually highlighted as user scrolls through the article"
    - "Indicator does not appear on mobile (too narrow) or when article has no headings"
  artifacts:
    - path: "src/components/updates/ScrollProgressIndicator.tsx"
      provides: "Client component that extracts headings from prose-updates and tracks scroll"
    - path: "src/components/updates/EntryArticle.tsx"
      provides: "Updated to include ScrollProgressIndicator alongside article"
  key_links:
    - from: "ScrollProgressIndicator.tsx"
      to: ".prose-updates h2, h3"
      via: "DOM query on mount + MutationObserver or body dependency"
      pattern: "querySelectorAll.*prose-updates.*h[23]"
    - from: "ScrollProgressIndicator.tsx"
      to: "updates layout scroll container"
      via: "scroll event on .updates-root overflow-y-auto div (NOT window)"
      pattern: "closest.*overflow|scrollTop"
---

<objective>
Add a right-side vertical scroll progress indicator to update entry pages that shows section markers corresponding to headings in the article. Each marker's width reflects the heading level (h2 = longest bar, h3 = medium). The currently visible section is highlighted with amber accent.

Purpose: Gives readers a visual map of the article structure and their current position within it.
Output: A new ScrollProgressIndicator component rendered alongside the article content.
</objective>

<execution_context>
@/Users/lucasalexander/.claude/get-shit-done/workflows/execute-plan.md
@/Users/lucasalexander/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/updates/EntryArticle.tsx
@src/app/updates/layout.tsx
@src/app/globals.css
@src/lib/motion.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create ScrollProgressIndicator component</name>
  <files>src/components/updates/ScrollProgressIndicator.tsx</files>
  <action>
Create a 'use client' component `ScrollProgressIndicator` that:

1. **Heading extraction:** On mount (and when `body` prop changes), query all `h2` and `h3` elements inside the `.prose-updates` container. For each heading, store its `id` (or generate one from textContent if missing), `textContent`, `level` (2 or 3), and DOM element ref.

2. **Scroll tracking:** The scroll container is NOT `window`. It is the `div.h-full.overflow-y-auto` inside `.updates-root` in the updates layout. Find it via `document.querySelector('.updates-root > .overflow-y-auto')` or by traversing up from the component. Attach a scroll event listener to this container. On scroll, determine which heading is currently "active" by finding the heading whose offsetTop (relative to the scroll container) is closest to but not past the current scrollTop + some offset (e.g., 100px from top).

3. **Rendering:** Position the indicator as `fixed` on the right side of the viewport, vertically centered. Render a vertical column of horizontal bars:
   - Each bar represents one heading (h2 or h3)
   - h2 bars: `w-6` (24px wide)
   - h3 bars: `w-3` (12px wide)
   - Inactive bars: `bg-base-700` with `opacity-40`
   - Active bar: `bg-amber-500` with `opacity-100`
   - Each bar height: `h-[3px]` with `gap-2` between them
   - Bars are right-aligned (so h3 bars appear indented from right edge)
   - Smooth transition on opacity/color: `transition-all duration-300`

4. **Click behavior:** Clicking a bar scrolls the scroll container to that heading smoothly.

5. **Visibility:** Hide on screens narrower than `lg` breakpoint (use `hidden lg:flex` classes). Also return `null` if no headings found.

6. **Add IDs to headings:** Since the markdown HTML may not have IDs on headings, add a useEffect that assigns `id` attributes to each h2/h3 in `.prose-updates` based on slugified textContent (lowercase, spaces to hyphens, strip special chars). This is needed for smooth scroll targeting. Run this effect BEFORE the heading extraction effect.

Props: `body: string` (the HTML body content, used as dependency to re-extract headings when content changes, e.g., locale switch).

Do NOT use Motion/framer-motion for this -- plain CSS transitions are sufficient and avoid bundle overhead for a simple indicator.
  </action>
  <verify>
TypeScript compiles without errors: `npx tsc --noEmit --pretty 2>&1 | tail -20`
Component file exists and exports default function.
  </verify>
  <done>ScrollProgressIndicator component exists, compiles, extracts headings from DOM, tracks scroll position on the correct container, and renders right-side indicator bars.</done>
</task>

<task type="auto">
  <name>Task 2: Integrate ScrollProgressIndicator into EntryArticle</name>
  <files>src/components/updates/EntryArticle.tsx</files>
  <action>
In EntryArticle.tsx:

1. Import `ScrollProgressIndicator` from `./ScrollProgressIndicator`.

2. Add `<ScrollProgressIndicator body={body} />` inside the component, AFTER the `<main>` tag (as a sibling, not inside main). The indicator positions itself fixed, so DOM placement just needs to be within the client component tree.

3. To keep the indicator as a sibling of main, wrap the return in a fragment `<>...</>`:
   ```
   return (
     <>
       <main className="max-w-3xl mx-auto px-6 py-12">
         {/* existing content */}
       </main>
       <ScrollProgressIndicator body={body} />
     </>
   )
   ```

No other changes to EntryArticle -- the component is self-contained.
  </action>
  <verify>
TypeScript compiles: `npx tsc --noEmit --pretty 2>&1 | tail -20`
Build succeeds: `npx next build 2>&1 | tail -20`
  </verify>
  <done>EntryArticle renders the ScrollProgressIndicator. On an update entry page with h2/h3 headings, the right-side indicator appears on desktop showing section bars with the active section highlighted in amber.</done>
</task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes with no errors
2. `npx next build` completes successfully
3. On a desktop viewport, visiting an update entry page with multiple h2/h3 headings shows vertical bar indicators on the right side
4. Scrolling through the article updates the active (amber) bar
5. Clicking a bar scrolls to that section
6. On mobile viewport, the indicator is hidden
</verification>

<success_criteria>
- ScrollProgressIndicator component renders on update entry pages
- Bars correctly reflect heading hierarchy (h2 wider than h3)
- Active section tracking works with the updates layout scroll container (not window)
- Indicator hidden on mobile, visible on lg+ screens
- No TypeScript errors, build passes
</success_criteria>

<output>
After completion, create `.planning/quick/007-add-scroll-progress-indicator-with-secti/007-SUMMARY.md`
</output>
