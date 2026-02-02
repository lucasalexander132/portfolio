# Phase 3: Projects - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Display credible proof of work through case studies with quantified results. Projects shown in responsive card grid with expandable modal views. Supports both live projects and "coming soon" projects under development. Adding new projects requires only data file changes.

</domain>

<decisions>
## Implementation Decisions

### Card presentation
- Grid layout (2-3 columns responsive)
- Each card shows: screenshot, project title, one-line tagline
- Screenshots in device frames or clean crops
- Hover: subtle lift with shadow (tactile, minimal)

### Expandable detail view
- Modal/lightbox opens on card click
- Gallery focus: multiple screenshots/visuals with supporting text
- Prominent "Visit project" button for live projects
- Modal close behavior: Claude's discretion (standard accessible patterns)

### Project states
- Two states: "live" and "coming soon"
- Coming soon: normal card appearance with "Coming Soon" badge/ribbon overlay
- Coming soon projects are clickable — show whatever info exists in modal
- Coming soon positioned after all live projects in grid
- Coming soon CTA: "View on GitHub" button when repo link available, instead of "Visit project"

### Claude's Discretion
- Modal close behavior (X button, backdrop click, Escape key)
- Gallery navigation within modal
- Exact badge/ribbon styling for coming soon
- Spacing and responsive breakpoints

</decisions>

<specifics>
## Specific Ideas

- Screenshots can be obtained for live projects
- GitHub links available for projects still in development
- Gallery-focused modal rather than heavy narrative text

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-projects*
*Context gathered: 2026-02-02*
