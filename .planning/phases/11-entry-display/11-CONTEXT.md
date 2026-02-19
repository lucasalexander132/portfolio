# Phase 11: Entry Display - Context

**Gathered:** 2026-02-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the full entry display layer for `/updates`: the list items in the entry stream, the `/updates/[slug]` detail page, and the transition between them. Tag filtering is Phase 12. Navigation integration is Phase 13.

</domain>

<decisions>
## Implementation Decisions

### Entry list item design
- Flat list items separated by thin dividers (#2D3140), NOT card boxes
- Per-entry structure (top to bottom): meta row (date + bullet dot + colored tag chip), Fraunces 20px title, muted body excerpt
- Padding: 28px top and bottom per entry
- Excerpt: use the `summary` field from entry frontmatter directly as the muted excerpt text
  - **Decision revised (planning):** Original decision said "first N characters auto-truncated from the markdown body -- no separate summary frontmatter field needed." Revised because Phase 9 established `summary` as a required field in the `UpdateEntry` type, `validateFrontmatter()` enforces it, and all 4 content files already have it. Using the existing `summary` field is simpler and avoids HTML tag stripping from the rendered body.

### Entry hover state
- The entire clickable area runs from divider to divider (full-width)
- Hover: lifts off page with drop shadow, fills with cream background, inverts text colors to match cream surface, shows pointer cursor
- Always navigates to `/updates/[slug]` on click -- the `link` field does NOT override the destination

### Tag chip colors (from design file)
- `project-launch`: solid amber fill (#D4A843), dark text (#161921), no stroke
- `learning`: transparent fill, amber stroke and text (#D4A843)
- `community`: transparent fill, green stroke and text (#6B9E78)
- `design-thinking`: transparent fill, purple stroke and text (#8B7CC8)
- `business`: use outline style -- Claude to pick a reasonable accent color consistent with the palette

### Detail page
- In scope for Phase 11 -- full `/updates/[slug]` route required
- Layout: Back row -> Article header -> Divider -> Article body -> Divider -> Post navigation
- Article header: meta row (date + dot + filled tag chip) / Fraunces 40px title / muted subtitle/lead text (Open Sans 17px)
- Post navigation: hide the unavailable direction entirely -- never show disabled states

### Markdown body rendering (detail page)
Rich rendering required, all styled to match the design:
- Paragraphs: Open Sans 16px, #C4B89A, line-height 1.75
- H2: Fraunces 28px bold, #EDE5D4
- H3: Fraunces 22px semibold, #EDE5D4
- Blockquotes: amber left border (3px, #D4A843), italic gray text, no background
- Unordered lists: amber dot bullets (#D4A843)
- Ordered lists: amber numbered labels
- Code blocks: dark background (#0D0F14), language bar header with language label + **working Copy button** (copies to clipboard), IBM Plex Mono 13px, amber-tinted syntax for keywords/returns, green for strings
- Inline code: dark background (#1A1D26), amber text, rounded, IBM Plex Mono
- Images: placeholder frame with icon + caption below, italic gray caption text
- Horizontal rules: thin #2D3140 line

### Link field (on detail page)
- Rendered as a standalone amber link row inside the article body
- Format: external-link icon + "Visit [title] ->" amber text, opens in new tab

### Animation
- Entry list: staggered Motion on page load, consistent with existing `containerVariants`/`itemVariants` patterns
- List -> detail navigation: React 19 View Transition API (smooth crossfade or shared-element transition)

### Claude's Discretion
- Exact truncation length for body excerpt on list items
- Precise drop shadow values for hover state
- Code block syntax highlight color assignments beyond amber/green
- Exact tag color for `business` tag chip

</decisions>

<specifics>
## Specific Ideas

- Design reference: `portfolio-updates.pen` in project root -- shows both the list view and detail page in detail. All measurements, colors, and typography drawn from there.
- Entry list items should feel like a reading list, not a card grid -- the divider-separated flat layout is intentional
- The hover lift effect on entries is the primary interactive cue; it should feel snappy, not floaty

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 11-entry-display*
*Context gathered: 2026-02-19*
