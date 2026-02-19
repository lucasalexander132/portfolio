# Requirements: Civix Solutions Portfolio v1.2

**Defined:** 2026-02-18
**Core Value:** Visitors must feel at ease -- like they've found someone who genuinely cares about solving their problem.
**Milestone Focus:** Live Updates page -- a chronological activity stream that serves as a living resume

## v1.2 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Infrastructure

- [x] **UPD-01**: Content system exists -- gray-matter + unified pipeline reads `.md` files from `/content/updates/` and returns typed entries
- [x] **UPD-02**: `UpdateEntry` TypeScript interface defines all frontmatter fields; schema is enforced at build time (no `any` types)
- [x] **UPD-03**: Tag vocabulary is a fixed TypeScript union type (max 5-7 tags); invalid tags cause a build error
- [x] **UPD-04**: `getUpdates()` utility uses `"use cache"` directive for build-time caching

### Page

- [ ] **UPD-05**: `/updates` route exists as an App Router server component that reads and renders the entry stream
- [ ] **UPD-06**: Tag filter uses URL search params (`?tag=X`); filtered views are shareable and server-rendered (no client state)
- [ ] **UPD-07**: Page UI chrome (headings, filter labels, CTAs, French notice) follows site locale (EN/FR); entry content remains English with a brief French notice when locale is FR
- [ ] **UPD-08**: `/updates` route has page metadata (title, description) for SEO

### Entry Display

- [ ] **UPD-09**: `UpdateCard` component displays title, date (month + year only), tag chip, body text
- [ ] **UPD-10**: Entry list uses staggered Motion animation on page load, consistent with existing animation patterns
- [ ] **UPD-11**: Entries support an optional `link` field (url + label); displayed as a subtle external link on the card
- [ ] **UPD-12**: Evergreen "now" section at top of page shows Lucas's current focus; editable with a single-line frontmatter change or data update

### Navigation

- [ ] **UPD-13**: "Updates" link appears in Nav component; uses `usePathname()` to distinguish route navigation from anchor scrolling; on `/updates`, nav links route back to `/#services`, `/#projects`
- [ ] **UPD-14**: "Updates" link added to Footer quick links
- [ ] **UPD-15**: Persistent contact CTA on `/updates` page links back to the contact form

## Future Requirements

Deferred to later milestones.

### Enhancements

- **V2-UPD-01**: RSS feed at `/updates/feed.xml` for developer community subscribers
- **V2-UPD-02**: Individual entry detail pages at `/updates/[slug]` for deeper SEO surface
- **V2-UPD-03**: Animated filter transitions (AnimatePresence) for instant visual feedback
- **V2-UPD-04**: "Latest updates" teaser section on main homepage linking to `/updates`
- **V2-UPD-05**: Year grouping dividers when entry count exceeds 20

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| CMS or admin panel | One-person stream; edit files + deploy is sufficient and lower maintenance |
| MDX support | Entry content is plain prose; React component embedding not needed |
| Comments or reactions | Social features require moderation infrastructure; not core value |
| Full-text search | Tag filter covers discovery; Cmd+F handles the rest |
| Entry images/media | Increases authoring friction; link field covers visual references |
| French entry content | Doubles authoring work; EN-only with a FR notice is honest and clear |
| Relative timestamps ("3 days ago") | Causes staleness signal and timezone bugs; month+year is sufficient |
| Infinite scroll | Page will stay small enough for all-on-one-page for years |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| UPD-01 | Phase 9 | Complete |
| UPD-02 | Phase 9 | Complete |
| UPD-03 | Phase 9 | Complete |
| UPD-04 | Phase 9 | Complete |
| UPD-05 | Phase 10 | Pending |
| UPD-06 | Phase 12 | Pending |
| UPD-07 | Phase 10 | Pending |
| UPD-08 | Phase 10 | Pending |
| UPD-09 | Phase 11 | Pending |
| UPD-10 | Phase 11 | Pending |
| UPD-11 | Phase 11 | Pending |
| UPD-12 | Phase 10 | Pending |
| UPD-13 | Phase 13 | Pending |
| UPD-14 | Phase 13 | Pending |
| UPD-15 | Phase 13 | Pending |

**Coverage:**
- v1.2 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-02-18*
*Last updated: 2026-02-19 -- Phase 9 requirements marked Complete (UPD-01 through UPD-04)*
