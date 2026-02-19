Use this skill when the user wants to create a new update entry / blog post for the portfolio site. Triggers: "new update", "new post", "write an update", "add an entry", "create a blog post".

# New Update Entry

You are helping create a new update entry for the Civix Solutions portfolio site. Updates are markdown files in `src/content/updates/` that get rendered at `/updates/[slug]`.

## Step 1: Gather Info

Ask the user for the following. Collect everything in one question if possible:

1. **Title** — what's the post called?
2. **Tag** — one of: `project-launch`, `design-thinking`, `business`, `community`, `learning`
3. **Summary** — one sentence that appears in the entry list and as the article subtitle (keep it under ~160 chars)
4. **Topic / what to write about** — a few sentences or bullet points describing the content. If the user wants to write it themselves, skip drafting.
5. **Link** (optional) — an external URL to feature at the bottom (e.g. a project, resource, or tool). If yes, get the URL and a short label.

## Step 2: Generate the File (English version -- French can be added after)

**Filename format:** `YYYY-MM-{slug}.md` where:
- `YYYY-MM` = current year and month (today is 2026-02)
- `slug` = title lowercased, spaces to hyphens, strip punctuation, max ~40 chars

Example: "Learning Rust" → `2026-02-learning-rust.md`

**Frontmatter:**
```
---
title: "{title}"
date: "YYYY-MM"
tag: "{tag}"
summary: "{summary}"
---
```

If a link was provided, add after summary:
```
link:
  url: "{url}"
  label: "{label}"
```

**File path:** `src/content/updates/{filename}`

## Step 3: Write the Content

If the user provided a topic/notes, draft the full article body. Follow the voice and structure of the existing entries — conversational but thoughtful, first-person, honest about process and tradeoffs.

### Supported Markdown Elements

All of these render with custom styles on the site:

- `## H2` and `### H3` headings (Fraunces serif)
- `> Blockquote` (amber left border)
- `- Unordered list` (amber bullet dots)
- `1. Ordered list` (amber numbers)
- ` ```language ` fenced code blocks (syntax highlighted via shiki)
- `` `inline code` `` (amber monospace pill)
- `---` horizontal rule (dark divider line)
- `![alt](path)` images (rounded, dark border) — use `/public/` paths

### Writing Style

- First person, direct. No corporate voice.
- Lead with a concrete observation or frustration, not a definition.
- Use section headings to break up the piece — aim for 2–4 H2s.
- Blockquotes work well for a key insight or closing thought.
- Code blocks only if genuinely useful — don't force them.
- End with something open: next steps, a question, what's coming.

### Length

- Short entries (150–400 words body) are totally valid — not everything needs to be long-form.
- Longer entries (600–1000 words) suit project launches or deep dives.

## Step 4: Create the File

Write the file using the Write tool. Confirm the path to the user.

## Step 5: Remind About Dev Server

After writing the file, tell the user:

> **Note:** The dev server caches content — restart it (`Ctrl+C` then `next dev`) to see the new entry appear.

## Step 6: French Translation

After creating the English entry, tell the user:

> **French version:** When you're happy with the English entry, I can generate the French companion file (`{slug}.fr.md`). Just say "generate French version" and I'll translate the entry. You can also do this later -- the site gracefully falls back to English when no French file exists.

If the user asks to generate the French version:

1. Read the English `.md` file that was just created
2. Create a companion `{slug}.fr.md` file in the same directory (`src/content/updates/`) with:
   - `title`: French translation of the English title
   - `date`: Same as English
   - `tag`: Same as English
   - `summary`: French translation of the English summary
   - `link`: Same as English (if present)
   - Body: Natural French translation of the full markdown body, preserving all heading structure, blockquotes, code blocks, horizontal rules, and links
3. Translate naturally, not word-for-word. Match the conversational first-person tone. Use formal "vous" for client-facing content.
4. Confirm the file was created and remind about dev server restart.

## Tag Reference

| Tag | Use for |
|-----|---------|
| `project-launch` | Shipping something, beta releases, new features |
| `design-thinking` | Design process, systems, UI/UX decisions |
| `business` | Client work, strategy, pricing, positioning |
| `community` | Events, workshops, teaching, collaborating |
| `learning` | New skills, technologies, books, experiments |
