# Phase 10: Page Shell - Context

**Gathered:** 2026-02-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the `/updates` route as a server component: page heading, "now" section (hero intro), entry stream container, SEO metadata, and i18n chrome. Entry card styling is Phase 11. Tag filtering UI is Phase 12. Navigation links are Phase 13.

</domain>

<decisions>
## Implementation Decisions

### "Now" section
- Acts as the page intro / hero — first thing visitors see before the entry stream
- Communicates two things: current project focus + what I'm currently learning
- Sourced from a dedicated `src/content/now.md` file (same pipeline as updates entries)
- Frontmatter fields: `focus_en`, `focus_fr`, `learning_en`, `learning_fr`, `updated` (date)
- Bilingual frontmatter so both locales serve correct content immediately

### Page layout
- Narrow reading column (~700–800px max-width) — optimized for reading, not homepage width
- Brief page heading above the now section (e.g., "Updates" / "Mises à jour")
- Reuses existing Nav component — Phase 13 adds the Updates nav link
- Entry stream area: Claude's discretion on minimum viable placeholder for Phase 11

### i18n
- Page heading translated (EN: "Updates" / FR: "Mises à jour")
- Now section labels translated ("Current focus", "Learning", "Last updated")
- Now section content bilingual via `focus_en`/`focus_fr`, `learning_en`/`learning_fr` frontmatter
- No English-only notice for the entry stream — skip it entirely
- No auto-translation of entries in this phase (deferred)

### SEO metadata
- `<title>`: Claude decides (something like "Updates | Civix Solutions" vs more conversational)
- Meta description: dynamic — generated from `now.md` focus content so it stays fresh
- Basic Open Graph: `og:title` + `og:description` (no image required)
- Locale-aware: French title and description served for FR locale

### Claude's Discretion
- Entry stream placeholder approach (empty container, bare data render, or similar)
- Exact `<title>` wording in both languages
- Visual styling of the now section hero area (consistent with site aesthetic)
- Exact now section layout (fields order, typography hierarchy)

</decisions>

<specifics>
## Specific Ideas

- The "now" section is a page intro / hero — it sets the scene before visitors see the update stream
- Bilingual frontmatter means `now.md` is the single source of truth for both languages

</specifics>

<deferred>
## Deferred Ideas

- **Auto-translation of update entries** — user wants entries translated into French automatically; this requires a translation service integration or bilingual entry authoring workflow; its own phase after the core updates feature is live

</deferred>

---

*Phase: 10-page-shell*
*Context gathered: 2026-02-19*
