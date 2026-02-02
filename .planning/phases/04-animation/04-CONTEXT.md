# Phase 4: Animation - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Motion that enhances the portfolio narrative without distracting — orchestrated page load, scroll animations, hover states, and reduced-motion support. All animation uses Motion library (Framer Motion). Focus is on "smooth & measured" character that matches the workshop-at-golden-hour mood.

</domain>

<decisions>
## Implementation Decisions

### Page Load Choreography
- Nav is visible immediately (stable anchor)
- Hero photo (`me.png`) is already visible when page loads
- Headline uses typewriter effect at medium pace (~70ms/char)
- Cursor blinks during typing, then blinks a few times and fades after completion
- Subtext + CTA appear together (simultaneous fade-up) after headline completes

### Scroll Reveal Behavior
- Trigger when section is ~25% visible (not immediate entry)
- Effect: fade-up (y + opacity) — elements rise and fade in
- Children within sections stagger (~0.08s between items)
- Animate once only — stay visible after initial reveal

### Interactive Feedback
- **Project cards**: Lift + shadow on hover (y: -4px, deeper shadow) — spring transition with very subtle overshoot
- **Service cards**: No hover state — static, not interactive
- **Buttons**: Scale down slightly on press (0.95-0.98) — snappy feedback
- **Nav links**: Underline slides in on hover

### Project Detail Section (Major Change)
- **No modal** — inline expansion replaces modal overlay
- Section opens beneath project cards with cream background (matching footer)
- Projects section animates bottom border-radius to 2xl when detail opens
- Following section animates top border-radius to 2xl
- **Open sequence**: Height expands first, then content wipes in from right-to-left
- **Switching projects**: Cross-fade content, section stays open
- **Gallery**: Horizontal draggable carousel with momentum, images bleed outside cream content frame

### Motion Personality
- Character: Smooth & measured — calm confidence, no frantic energy
- Overshoot: Very subtle (1-2px) on interactive elements — barely perceptible aliveness
- Duration: Standard (250-350ms) for UI transitions
- Easing: Proper ease-out for enters, ease-in for exits, never linear

### Claude's Discretion
- Exact spring stiffness/damping values (within "subtle overshoot" constraint)
- Precise stagger delays (within ~0.08s guideline)
- Scroll reveal travel distance (within "fade-up" approach)
- Carousel momentum physics
- Typewriter cursor styling

</decisions>

<specifics>
## Specific Ideas

- Hero image `me.png` should be added to hero section
- Project detail section is a complete UX redesign from modal to inline expansion
- Gallery carousel extends beyond the cream frame — content bleeds to edges
- Typewriter gives "watching someone craft" feel — not rushed, not slow

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-animation*
*Context gathered: 2026-02-02*
