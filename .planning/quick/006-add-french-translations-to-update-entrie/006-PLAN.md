---
phase: quick-006
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/updates.ts
  - src/components/updates/UpdatesPageContent.tsx
  - src/components/updates/EntryListItem.tsx
  - src/components/updates/EntryArticle.tsx
  - src/content/updates/2026-02-design-to-code-gap.fr.md
  - src/content/updates/2026-02-one-hour-five-thousand-books.fr.md
  - .claude/skills/new-update/SKILL.md
autonomous: true

must_haves:
  truths:
    - "When locale is French, update entries display French title, summary, and body"
    - "When locale is English, entries display exactly as they do now (no regression)"
    - "French .fr.md files that are missing gracefully fall back to English content"
    - "The new-update skill prompts user to generate French version after editing English"
  artifacts:
    - path: "src/content/updates/2026-02-design-to-code-gap.fr.md"
      provides: "French translation of design-to-code-gap entry"
    - path: "src/content/updates/2026-02-one-hour-five-thousand-books.fr.md"
      provides: "French translation of one-hour-five-thousand-books entry"
    - path: "src/lib/updates.ts"
      provides: "UpdateEntry with optional fr fields, parseUpdate loads companion .fr.md"
    - path: ".claude/skills/new-update/SKILL.md"
      provides: "Updated skill with Step 5 for French translation prompt"
  key_links:
    - from: "src/lib/updates.ts"
      to: "src/content/updates/*.fr.md"
      via: "readFile companion file in parseUpdate"
      pattern: "\\.fr\\.md"
    - from: "src/components/updates/EntryListItem.tsx"
      to: "useLocale"
      via: "locale-aware field selection"
      pattern: "locale.*===.*fr"
    - from: "src/components/updates/EntryArticle.tsx"
      to: "useLocale"
      via: "locale-aware field selection"
      pattern: "locale.*===.*fr"
---

<objective>
Add French translations to update entries so that when users toggle to French, they see
translated titles, summaries, and body content for each blog post. Update the new-update
skill to prompt for French translation after the English entry is finalized.

Purpose: Complete the bilingual experience -- the i18n system already translates UI chrome
but update entries remain English-only.

Output: French .fr.md companion files for each entry, updated UpdateEntry type with optional
French fields, locale-aware rendering in all entry components, and updated skill.
</objective>

<execution_context>
@/Users/lucasalexander/.claude/get-shit-done/workflows/execute-plan.md
@/Users/lucasalexander/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/lib/updates.ts
@src/lib/i18n.tsx
@src/lib/now.ts
@src/components/updates/UpdatesPageContent.tsx
@src/components/updates/EntryListItem.tsx
@src/components/updates/EntryArticle.tsx
@src/components/updates/EntryStreamContainer.tsx
@src/content/updates/2026-02-design-to-code-gap.md
@src/content/updates/2026-02-one-hour-five-thousand-books.md
@.claude/skills/new-update/SKILL.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Extend UpdateEntry type and loader to support French companion files</name>
  <files>src/lib/updates.ts</files>
  <action>
  Architecture: Each English entry `{slug}.md` can have an optional French companion
  `{slug}.fr.md` with the same frontmatter structure (title, date, tag, summary, optional link)
  plus French body markdown. The server loads both and merges them into one UpdateEntry.

  1. Add optional French fields to `UpdateEntry` interface:
     - `title_fr?: string`
     - `summary_fr?: string`
     - `body_fr?: string`
     (Do NOT add `link_fr` -- links are language-neutral URLs.)

  2. In `parseUpdate()`, after parsing the English file, attempt to read the companion
     `.fr.md` file. Use a try/catch -- if the file doesn't exist, leave the `_fr` fields
     undefined (graceful fallback). The companion file path is derived by replacing `.md`
     with `.fr.md` in the filename.

     Specifically: after computing the English entry, do:
     ```
     const frFilename = filename.replace(/\.md$/, '.fr.md')
     const frPath = join(process.cwd(), 'src', 'content', 'updates', frFilename)
     try {
       const frRaw = await readFile(frPath, 'utf-8')
       const { data: frData, content: frContent } = matter(frRaw)
       const frResult = await unified()...process(frContent)  // same pipeline
       entry.title_fr = frData.title as string
       entry.summary_fr = frData.summary as string
       entry.body_fr = String(frResult)
     } catch { /* no French file -- that's fine */ }
     ```

  3. Update `parseUpdate` signature: it currently takes `(filename, raw)`. Change it to also
     accept the directory path so it can find the companion file. Or more simply, pass the
     full directory path as a module-level constant and use it inside parseUpdate. The `dir`
     constant `join(process.cwd(), 'src', 'content', 'updates')` is already computed in
     `getUpdates` -- extract it to a module-level `const UPDATES_DIR`.

  4. In `getUpdates()`, filter out `.fr.md` files from the directory listing so they don't
     appear as separate entries. Update the filter: `files.filter(f => f.endsWith('.md') && !f.endsWith('.fr.md'))`.

  5. In `getUpdateBySlug()`, the companion loading happens automatically via `parseUpdate`.

  IMPORTANT: Do NOT change the `slug` derivation. Slugs remain based on the English filename.
  The `.fr.md` files are never accessed as standalone entries.
  </action>
  <verify>
  Run `npx tsc --noEmit` -- no type errors. Manually verify that `getUpdates()` would
  return entries with the new optional fields by checking the code logic.
  </verify>
  <done>
  UpdateEntry has optional `title_fr`, `summary_fr`, `body_fr` fields. parseUpdate loads
  companion `.fr.md` files when they exist. `.fr.md` files are excluded from the main
  entry listing. TypeScript compiles cleanly.
  </done>
</task>

<task type="auto">
  <name>Task 2: Create French companion files and update components for locale-aware rendering</name>
  <files>
    src/content/updates/2026-02-design-to-code-gap.fr.md
    src/content/updates/2026-02-one-hour-five-thousand-books.fr.md
    src/components/updates/EntryListItem.tsx
    src/components/updates/EntryArticle.tsx
  </files>
  <action>
  **Part A: Create French companion markdown files**

  Create `src/content/updates/2026-02-design-to-code-gap.fr.md` with:
  - Same frontmatter structure as the English version but with French translations
  - `title`, `summary` in French; `date`, `tag` identical to English; `link` identical
  - Full French translation of the body markdown, preserving all heading structure, blockquotes,
    code blocks, and horizontal rules. Translate naturally -- not word-for-word. Match the
    conversational, first-person tone. The "Claude's Notes" and "Luke's Notes about Claude's
    Notes" sections should also be translated, keeping the same voice.

  Create `src/content/updates/2026-02-one-hour-five-thousand-books.fr.md` with:
  - Same approach. This entry is about a Quebec bookstore so some terms are already French
    (l'agrement, La Maison Des Feuilles, etc.) -- keep those as-is. Translate the English
    narrative around them naturally.

  **Part B: Update EntryListItem for locale-aware display**

  In `EntryListItem.tsx`:
  1. Import `useLocale` from `@/lib/i18n`
  2. Get `{ locale }` from `useLocale()`
  3. Create locale-aware display values:
     ```
     const title = locale === 'fr' && entry.title_fr ? entry.title_fr : entry.title
     const summary = locale === 'fr' && entry.summary_fr ? entry.summary_fr : entry.summary
     ```
  4. Replace `entry.title` with `title` and `entry.summary` with `summary` in the JSX
  5. Also make the date formatting locale-aware: add a `MONTHS_FR` array
     (`janvier`, `fevrier`, `mars`, `avril`, `mai`, `juin`, `juillet`, `aout`,
     `septembre`, `octobre`, `novembre`, `decembre`) and select based on locale.
     Pass locale to `formatDate` or create a second formatter.

  **Part C: Update EntryArticle for locale-aware display**

  In `EntryArticle.tsx`:
  1. Import `useLocale` from `@/lib/i18n`
  2. Get `{ locale }` from `useLocale()`
  3. Create locale-aware values for title, summary, and body:
     ```
     const title = locale === 'fr' && entry.title_fr ? entry.title_fr : entry.title
     const summary = locale === 'fr' && entry.summary_fr ? entry.summary_fr : entry.summary
     const body = locale === 'fr' && entry.body_fr ? entry.body_fr : entry.body
     ```
  4. Replace `entry.title`, `entry.summary`, `entry.body` with the locale-aware versions
  5. Add the same `MONTHS_FR` array and locale-aware date formatting as in EntryListItem
  6. Make the "All updates" back link and "Visit {label}" text locale-aware:
     - Back link: `locale === 'fr' ? 'Toutes les mises a jour' : 'All updates'`
     - Visit link: `locale === 'fr' ? 'Visiter' : 'Visit'`

  IMPORTANT: Both components are already `'use client'` so `useLocale()` works directly.
  The `UpdateEntry` type import from `@/lib/updates` is type-only so it's fine in client code.
  </action>
  <verify>
  Run `npx tsc --noEmit` -- no type errors. Verify both `.fr.md` files exist and have
  valid frontmatter (title, date, tag, summary fields present).
  </verify>
  <done>
  Two French companion files exist with natural translations. EntryListItem and EntryArticle
  both read locale from context and display French content when `locale === 'fr'`, falling
  back to English when French fields are undefined. Date formatting is locale-aware.
  </done>
</task>

<task type="auto">
  <name>Task 3: Update new-update skill to prompt for French translation</name>
  <files>.claude/skills/new-update/SKILL.md</files>
  <action>
  Update the skill file to add a new step after the current Step 5 (Remind About Dev Server).

  Renumber the existing "Step 5: Remind About Dev Server" to "Step 5" and add a new
  "Step 6: French Translation" after it.

  **Step 6: French Translation**

  After the dev server reminder, tell the user:

  > **French version:** When you're happy with the English entry, I can generate the French
  > companion file (`{slug}.fr.md`). Just say "generate French version" and I'll translate
  > the entry. You can also do this later -- the site gracefully falls back to English when
  > no French file exists.

  If the user asks to generate the French version:
  1. Read the English `.md` file that was just created
  2. Create a companion `{slug}.fr.md` file in the same directory with:
     - `title`: French translation of the English title
     - `date`: Same as English
     - `tag`: Same as English
     - `summary`: French translation of the English summary
     - `link`: Same as English (if present)
     - Body: Natural French translation of the full markdown body, preserving all heading
       structure, blockquotes, code blocks, horizontal rules, and links
  3. Translate naturally, not word-for-word. Match the conversational first-person tone.
  4. Confirm the file was created and remind about dev server restart.

  Also update the intro text at the top of Step 2 to mention that only the English version
  is created initially: add "(English version -- French can be added after)" to the
  section description.
  </action>
  <verify>
  Read the updated SKILL.md and confirm Step 6 exists with clear instructions for generating
  the French companion file. Confirm the file format matches the `.fr.md` convention
  (same frontmatter keys, translated values, translated body).
  </verify>
  <done>
  The new-update skill generates English-only entries by default, then prompts the user to
  optionally generate the French companion file. Instructions are clear enough for Claude
  to execute the translation without ambiguity.
  </done>
</task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes with no errors
2. Both `.fr.md` companion files exist in `src/content/updates/`
3. `.fr.md` files are NOT returned as standalone entries by `getUpdates()`
4. EntryListItem and EntryArticle use `useLocale()` to select content
5. When no `.fr.md` exists for an entry, English content displays (graceful fallback)
6. SKILL.md has the French translation step
</verification>

<success_criteria>
- Toggling to French shows translated titles, summaries, and body content for both entries
- Toggling to English shows original content unchanged (no regression)
- New entries created via the skill start English-only with a prompt for French
- TypeScript compiles with no errors
</success_criteria>

<output>
After completion, create `.planning/quick/006-add-french-translations-to-update-entrie/006-SUMMARY.md`
</output>
