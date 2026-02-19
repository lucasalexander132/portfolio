---
phase: quick-004
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/updates/layout.tsx
  - src/components/updates/UpdatesPageContent.tsx
  - src/components/updates/NowSection.tsx
  - src/components/updates/TagFilter.tsx
  - src/components/updates/TagChip.tsx
  - src/components/updates/EntryListItem.tsx
  - messages/en.json
  - messages/fr.json
autonomous: true

must_haves:
  truths:
    - "Updates page has sandy cream outer frame with dark inner card matching homepage layout"
    - "Brand bar 'C I V I X  S O L U T I O N S' visible at top of frame"
    - "Content order is: heading -> NowSection -> 'Recent Updates' sub-header with entry count -> TagFilter -> EntryStream"
    - "NowSection has darker card bg, amber NOW pill badge, and 'Updated February 2026' date using MONTHS array"
    - "TagFilter chips are rounded-full h-8 with solid amber active state and uniform inactive style"
    - "All TagChips are solid amber with dark text (no per-tag colors)"
  artifacts:
    - path: "src/app/updates/layout.tsx"
      provides: "Framed card layout matching homepage"
      contains: "fixed inset-0"
    - path: "src/components/updates/NowSection.tsx"
      provides: "Redesigned Now section with amber pill badge"
      contains: "bg-[#1E2230]"
    - path: "src/components/updates/TagChip.tsx"
      provides: "Uniform amber tag chips"
  key_links:
    - from: "src/app/updates/layout.tsx"
      to: "homepage page.tsx"
      via: "identical framed card pattern"
      pattern: "fixed inset-0 p-3"
---

<objective>
Restyle the Updates page to match the portfolio-updates.pen design exactly. This means adopting the homepage's framed-card layout, reordering content sections, restyling NowSection with an amber pill badge, making TagFilter chips larger with uniform inactive styling, and converting all TagChips to solid amber.

Purpose: Visual consistency between homepage and updates page per the design spec.
Output: Updated styling across 6 component files + 2 translation files.
</objective>

<execution_context>
@/Users/lucasalexander/.claude/get-shit-done/workflows/execute-plan.md
@/Users/lucasalexander/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/page.tsx (homepage framed card pattern to replicate)
@src/app/updates/layout.tsx
@src/components/updates/UpdatesPageContent.tsx
@src/components/updates/NowSection.tsx
@src/components/updates/TagFilter.tsx
@src/components/updates/TagChip.tsx
@src/components/updates/EntryListItem.tsx
@messages/en.json
@messages/fr.json
@src/app/globals.css (verify CSS variable names before using)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Framed card layout + content reorder + translations</name>
  <files>
    src/app/updates/layout.tsx
    src/components/updates/UpdatesPageContent.tsx
    messages/en.json
    messages/fr.json
  </files>
  <action>
**layout.tsx** - Replace the plain `min-h-screen bg-base-900` with the homepage's framed card pattern:

```tsx
<div className="fixed inset-0 p-3 sm:p-4 md:p-6 bg-text-primary">
  {/* Top brand mark - centered in frame */}
  <div className="absolute top-0 left-0 right-0 h-3 sm:h-4 md:h-6 flex items-center justify-center z-50">
    <span className="text-[8px] tracking-[0.1em] text-base-900 font-sans font-semibold">
      C I V I X &nbsp; S O L U T I O N S
    </span>
  </div>

  <div className="h-full rounded-[28px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-text-primary overscroll-none">
    <div className="bg-base-900 rounded-[28px]">
      <Navigation />
      {children}
    </div>
    <Footer />
  </div>
</div>
```

Remove `pt-16 pb-32` wrapper div - the Navigation is fixed-positioned so no padding offset needed, and Footer goes outside the dark card (in the cream scroll area, same as homepage).

**UpdatesPageContent.tsx** - Make these changes:
1. Change `<main>` classes: replace `max-w-3xl mx-auto px-6 py-12` with `max-w-[720px] mx-auto px-6 pt-[60px] pb-[80px]`
2. Change heading: replace `text-h1` with `text-[48px] font-bold` (fixed 48px, Fraunces weight 700)
3. Reorder content: heading -> NowSection -> "Recent Updates" sub-header -> TagFilter -> EntryStream
4. Add the "Recent Updates" sub-header between NowSection and TagFilter:
```tsx
<div className="flex items-baseline justify-between mb-4">
  <h2 className="font-serif text-[24px] text-text-primary">
    {t('updates.stream.title')}
  </h2>
  <span className="text-sm text-text-muted">
    {filteredEntries.length} {t('updates.stream.entries')}
  </span>
</div>
```
5. Keep the `mb-8` on h1, keep `<TagFilter />` right before EntryStream

**messages/en.json** - Add inside `"updates"` object:
```json
"stream": {
  "title": "Recent Updates",
  "entries": "entries"
}
```

**messages/fr.json** - Add inside `"updates"` object:
```json
"stream": {
  "title": "Mises \u00e0 jour r\u00e9centes",
  "entries": "entr\u00e9es"
}
```
  </action>
  <verify>
Run `npx tsc --noEmit` - no type errors. Visually: page should show sandy cream frame with dark inner card, brand bar at top, content in correct order with "Recent Updates (N entries)" sub-header.
  </verify>
  <done>
Updates page has framed card layout matching homepage. Content order is heading -> NowSection -> "Recent Updates" sub-header with entry count -> TagFilter -> EntryStream. Translation keys exist in both languages.
  </done>
</task>

<task type="auto">
  <name>Task 2: Restyle NowSection, TagFilter, TagChip, EntryListItem</name>
  <files>
    src/components/updates/NowSection.tsx
    src/components/updates/TagFilter.tsx
    src/components/updates/TagChip.tsx
    src/components/updates/EntryListItem.tsx
  </files>
  <action>
**NowSection.tsx** - Full restyle:
1. Change section classes: `bg-[#1E2230] border border-[#2D3140] rounded-2xl p-8 mb-12`
2. Replace the two separate "FOCUS" / "LEARNING" amber text labels with a single header row:
   - Left side: amber "NOW" pill badge: `<span className="inline-flex items-center h-7 px-3.5 rounded-[14px] bg-amber-500 text-[#161921] text-xs font-bold uppercase tracking-wider">NOW</span>`
   - Right side: `<span className="text-sm text-text-muted">Updated {formattedDate}</span>`
   - Row: `<div className="flex items-center justify-between mb-4">`
3. Fix hydration issue: Replace `toLocaleDateString` with MONTHS array pattern (same as EntryListItem.tsx):
   ```tsx
   const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
   // For French:
   const MONTHS_FR = ['janvier','f\u00e9vrier','mars','avril','mai','juin','juillet','ao\u00fbt','septembre','octobre','novembre','d\u00e9cembre']

   const months = locale === 'fr' ? MONTHS_FR : MONTHS
   const [year, month] = now.updated.split('-')
   const formattedDate = `${months[parseInt(month, 10) - 1]} ${year}`
   ```
4. Below the header row, show focus and learning as before but in a `space-y-3` div. Keep the amber labels `text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1` for "FOCUS" and "LEARNING".
5. Remove the date line at the bottom (it's now in the header row).

**TagFilter.tsx** - Restyle chips:
1. Remove `import { TAG_STYLES } from './TagChip'` - no longer needed for per-tag colors
2. All chips: `h-8 px-4 rounded-full text-sm font-medium` (height 32px, cornerRadius 16, horizontal padding 16px)
3. Active "All" chip: `bg-[#D4A843] text-[#161921] border-transparent`
4. Active tag chip (when pressed): same `bg-[#D4A843] text-[#161921] border-transparent`
5. All inactive chips (both "All" and tags): `bg-transparent text-text-muted border border-[#3D424D]`
6. Keep `hover:opacity-80 transition-opacity` on all chips
7. Remove the `TAG_STYLES` lookup entirely - all chips use same active/inactive styles

**TagChip.tsx** - Simplify to uniform amber:
1. Remove the `TAG_STYLES` export and the per-tag color record entirely
2. All tags render as solid amber: `bg-[#D4A843] text-[#161921] border-transparent`
3. Sizing: `h-6 px-2.5 rounded-[12px] text-xs font-medium` (height 24px, cornerRadius 12, padding [0,10])
4. Keep the `formatLabel` function and `TagChipProps` interface
5. Keep the `className` prop for external overrides

**EntryListItem.tsx** - Minor text size tweak:
1. Change summary text from `text-sm` (14px) to `text-[15px]` on the `<p>` that renders `entry.summary`
  </action>
  <verify>
Run `npx tsc --noEmit` - no type errors. NowSection should show darker card with amber "NOW" pill and date on right. TagFilter chips should be larger, uniform inactive style, solid amber active. All TagChips in entry items should be solid amber. Summary text slightly larger.
  </verify>
  <done>
NowSection has `bg-[#1E2230]` card with amber NOW pill badge and MONTHS-array date. TagFilter uses uniform chip styling with solid amber active state. All TagChips are solid amber `bg-[#D4A843]` with dark text. EntryListItem summary is 15px.
  </done>
</task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes with zero errors
2. Updates page (`/updates`) shows sandy cream outer frame with "CIVIX SOLUTIONS" brand bar at top
3. Dark inner card contains Navigation + content with proper rounded corners
4. Content order: heading (48px) -> NowSection -> "Recent Updates (N entries)" -> TagFilter -> entries
5. NowSection: darker card bg, amber NOW pill, date on right, no hydration mismatch
6. TagFilter: larger chips, solid amber active, uniform gray-border inactive
7. TagChips in entries: all solid amber, no per-tag colors
8. Footer appears in cream area below the dark card
</verification>

<success_criteria>
- Updates page layout matches homepage framed-card pattern exactly
- All 6 component files and 2 translation files updated per design spec
- No TypeScript errors, no hydration issues
- Visual parity with portfolio-updates.pen design
</success_criteria>

<output>
After completion, create `.planning/quick/004-update-updates-page-styling-to-match-por/004-SUMMARY.md`
</output>
