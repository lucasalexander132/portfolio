---
phase: quick-005
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/updates/UpdatesPageContent.tsx
  - src/components/updates/NowSection.tsx
autonomous: true

must_haves:
  truths:
    - "Page heading fades up first when navigating to /updates"
    - "NowSection fades up after heading with staggered delay"
    - "Recent Updates subheading and TagFilter fade up next"
    - "Entry stream animates in last (already has its own stagger)"
    - "Tag filtering still works correctly after animation changes"
  artifacts:
    - path: "src/components/updates/UpdatesPageContent.tsx"
      provides: "Orchestrated stagger container wrapping all page sections"
      contains: "staggerContainerVariants"
    - path: "src/components/updates/NowSection.tsx"
      provides: "NowSection unchanged or minimally touched"
  key_links:
    - from: "UpdatesPageContent.tsx"
      to: "motion variants"
      via: "m component with staggerContainerVariants + fadeUpVariants"
      pattern: "m\\.div.*variants"
---

<objective>
Add orchestrated entrance animation to the /updates page so all sections fade up in a staggered sequence when the page loads.

Purpose: The entry stream items already animate in via EntryStreamContainer, but the page heading, NowSection, subheading, and TagFilter appear instantly. Wrapping all sections in a stagger container creates a cohesive, polished entrance.

Output: Updated UpdatesPageContent.tsx with Motion stagger animation on all top-level sections.
</objective>

<execution_context>
@/Users/lucasalexander/.claude/get-shit-done/workflows/execute-plan.md
@/Users/lucasalexander/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/updates/UpdatesPageContent.tsx
@src/components/updates/EntryStreamContainer.tsx
@src/components/updates/NowSection.tsx
@src/components/updates/TagFilter.tsx
@src/lib/motion.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Wrap UpdatesPageContent sections in stagger animation</name>
  <files>src/components/updates/UpdatesPageContent.tsx</files>
  <action>
Import `m` from `motion/react` and import `staggerContainerVariants`, `fadeUpVariants` from `@/lib/motion`.

Convert the `<main>` element to `<m.main>` with:
- `variants={staggerContainerVariants}`
- `initial="hidden"`
- `animate="visible"`

Wrap each direct child section in an `<m.div variants={fadeUpVariants}>`:
1. The `<h1>` page title
2. The `<NowSection>` component
3. The flex container with "Recent Updates" heading + entry count
4. The `<TagFilter>` component
5. The entry stream block (the conditional with EntryStreamContainer / empty state)

This creates 5 stagger steps at 0.08s apart (using existing staggerChildren value), totaling ~0.4s for full reveal.

IMPORTANT: The `<EntryStreamContainer>` already has its own `initial="hidden" animate="visible"` with stagger. Since it will be a child of the page-level stagger, its own `initial`/`animate` will still work independently once the parent reveals it (opacity goes to 1). This is fine — the entry items will start their own stagger as the container becomes visible. No changes needed to EntryStreamContainer.

Keep all existing className, key props, and conditional logic exactly as-is. Only add Motion wrappers.
  </action>
  <verify>
Run `npx tsc --noEmit` to confirm no type errors. Visually verify in browser that:
1. All 5 sections fade up sequentially on page load
2. Tag filter buttons still work (click a tag, entries filter)
3. Switching tags still replays the entry stream animation (key prop still works)
  </verify>
  <done>All sections of the /updates page animate in with staggered fade-up on page load. Tag filtering remains functional.</done>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` passes with no errors
- Navigate to /updates — all content fades up in staggered sequence
- Click tag filters — entries filter correctly and re-animate
- No layout shift or flash of unstyled content during animation
</verification>

<success_criteria>
- Orchestrated entrance animation plays on /updates page load
- 5 distinct stagger steps: heading, NowSection, subheading row, TagFilter, entry stream
- Existing tag filter and entry stream animation behavior preserved
- No TypeScript errors
</success_criteria>

<output>
After completion, create `.planning/quick/005-add-animation-to-updates-page/005-SUMMARY.md`
</output>
