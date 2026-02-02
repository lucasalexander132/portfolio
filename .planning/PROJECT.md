# Civix Solutions Portfolio

## What This Is

A single-page portfolio for Civix Solutions, a frontend development consultancy that builds boutique solutions for small businesses. The site serves as a point of rest for business owners who've been burned by agencies — they arrive weary and skeptical, referred by someone they trust, hoping for help. The portfolio should make them feel understood before it tries to impress them.

## Core Value

Visitors must feel at ease — like they've found someone who genuinely cares about solving their problem, not selling them something. The digital equivalent of walking into a well-organized workshop at golden hour and realizing you can finally stop worrying.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero/introduction that establishes warmth and competence without selling
- [ ] Services section explaining what Civix Solutions actually does
- [ ] Project case studies as conversational narratives ("they came to me with X, we talked, here's what happened")
- [ ] Project template system — easily extensible for new work
- [ ] Contact form for starting a conversation
- [ ] Orchestrated page load with staggered reveals
- [ ] Atmospheric depth through layered visual treatment
- [ ] Cultured typography: serif headlines, sans-serif body
- [ ] Cool-with-warmth palette: slate/navy base, warm gold accents
- [ ] Responsive design that maintains the mood across devices

### Out of Scope

- Blog/writing section — not a thought leadership play, this is about the work
- Pricing page — conversations determine scope, not packages
- Client portal/login — this is a marketing site, not a product
- Dark/light mode toggle — one deliberate mood, not user preference
- Animations for animation's sake — movement serves the narrative or doesn't exist

## Context

**The visitor journey:** They were referred by someone they trust. They've been burned before — probably by an agency that overpromised and underdelivered, or by a freelancer who disappeared. They arrive skeptical but hopeful. They want to believe help exists. By the time they reach the contact form, they should feel lighter — not because of promises made, but because they felt understood.

**The workshop metaphor:** The site evokes finding someone at day's end, still at work in a well-organized space where interesting things get made. There's a sense of craft, of care, of someone who will work through the night while you rest. A new day is coming.

**Current projects for case studies:**
1. Employee management SaaS for small businesses (flagship, in progress)
2. Collection of small applications bridging workflow gaps with data augmentation (secondary, ongoing)

More projects will be added as the portfolio grows — the system must accommodate this.

## Constraints

- **Tech stack**: Next.js 16 (App Router, Turbopack), React 19.2, TypeScript strict, Tailwind CSS 4, shadcn/ui, Motion for complex animation — see CLAUDE.md
- **Typography**: No Inter, Roboto, or Arial — distinctive typefaces only (serif headlines, refined sans body)
- **Color system**: CSS variables, dominant colors with sharp accents, not evenly distributed palettes
- **Hosting**: Vercel
- **Single page**: One scrolling experience with sections, not multi-page navigation

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single page over multi-page | The story is one continuous narrative; breaking it up fragments the emotional arc | — Pending |
| Conversational case studies | Matches "we'll figure it out together" positioning; feels human, not corporate | — Pending |
| No dark/light toggle | One deliberate mood crafted for the experience; toggle dilutes intentionality | — Pending |
| Contact form over booking link | Lower barrier; they're not ready to commit to a call, they want to talk first | — Pending |
| Templated project system | Portfolio will grow; system must scale without redesign | — Pending |

---
*Last updated: 2025-02-02 after initialization*
