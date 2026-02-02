# Requirements: Civix Solutions Portfolio

**Defined:** 2026-02-02
**Core Value:** Visitors must feel at ease — like they've found someone who genuinely cares about solving their problem.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Custom typography system with serif headlines (Fraunces or similar) and refined sans body
- [x] **FOUND-02**: Color palette with deep slate/charcoal base and warm amber/gold accents as CSS variables
- [x] **FOUND-03**: Subtle grain texture overlay for atmospheric depth
- [x] **FOUND-04**: Soft layered shadows creating sense of physical space
- [x] **FOUND-05**: Mobile-first responsive design across all breakpoints
- [x] **FOUND-06**: Performance budget maintained (LCP < 2.5s)

### Hero Section

- [x] **HERO-01**: Empathy-first opening that acknowledges visitor's wariness ("Been burned before?")
- [x] **HERO-02**: Clear value proposition that follows empathy statement
- [x] **HERO-03**: Atmospheric visual treatment establishing "workshop at golden hour" mood
- [ ] **HERO-04**: Slow orchestrated fade-in animation (elements breathe in over 1-2 seconds, staggered)

### Services Section

- [x] **SERV-01**: Problem/solution pairs format ("If you're struggling with X, I can help with Y")
- [x] **SERV-02**: Outcome-focused descriptions (what they get, not what you do)
- [x] **SERV-03**: Scannable layout that doesn't require reading paragraphs

### Projects Section

- [ ] **PROJ-01**: Card-based layout with expandable detail views
- [ ] **PROJ-02**: Conversational case study format (Challenge → Approach → Result)
- [ ] **PROJ-03**: Quantified outcomes where available (specific numbers, not vague claims)
- [ ] **PROJ-04**: Templated component system for easy addition of new projects
- [ ] **PROJ-05**: TypeScript data structure for type-safe project content

### Contact Section

- [ ] **CONT-01**: Gentle invitation framing ("Tell me what's on your mind")
- [ ] **CONT-02**: Simple form fields (name, email, message)
- [ ] **CONT-03**: Form validation with helpful error states
- [ ] **CONT-04**: Server-side submission via Resend
- [ ] **CONT-05**: Success/error feedback states
- [ ] **CONT-06**: Response time expectation set ("I respond within 24 hours")

### Animation & Polish

- [ ] **ANIM-01**: Orchestrated page-load sequence with staggered reveals
- [ ] **ANIM-02**: Scroll-triggered animations for below-fold sections
- [ ] **ANIM-03**: Hover states on interactive elements
- [ ] **ANIM-04**: prefers-reduced-motion support
- [ ] **ANIM-05**: LazyMotion implementation for bundle optimization

### Accessibility & Performance

- [ ] **PERF-01**: Lighthouse performance score > 90
- [ ] **PERF-02**: Core Web Vitals passing (LCP, CLS, INP)
- [ ] **ACCS-01**: Keyboard navigation support
- [ ] **ACCS-02**: Screen reader compatibility
- [ ] **ACCS-03**: Sufficient color contrast ratios

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Expansion

- **V2-01**: Additional case studies as projects complete
- **V2-02**: Client testimonials (gather after initial engagements)
- **V2-03**: Process page with detailed methodology

### Enhancements

- **V2-04**: Refined micro-interactions beyond MVP
- **V2-05**: Blog/writing section (only if committed to maintaining)
- **V2-06**: Analytics integration (Vercel Analytics or Plausible)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Dark/light mode toggle | One deliberate mood; toggle dilutes intentionality |
| Chatbot/live chat | Feels corporate, sets unrealistic response expectations |
| Pricing calculator | Consultancy needs conversation, not packages |
| Newsletter signup | Visitors want help now, not content drip |
| Testimonial carousel | Auto-playing feels dated and untrustworthy |
| Skill bars/graphs | Amateurish; visitors don't care about percentages |
| Video background | Performance hit, accessibility issues |
| Multi-page navigation | Single-page focus respects visitor time |
| OAuth/login | Marketing site, not a product |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| FOUND-06 | Phase 1 | Complete |
| HERO-01 | Phase 2 | Complete |
| HERO-02 | Phase 2 | Complete |
| HERO-03 | Phase 2 | Complete |
| HERO-04 | Phase 4 | Pending |
| SERV-01 | Phase 2 | Complete |
| SERV-02 | Phase 2 | Complete |
| SERV-03 | Phase 2 | Complete |
| PROJ-01 | Phase 3 | Pending |
| PROJ-02 | Phase 3 | Pending |
| PROJ-03 | Phase 3 | Pending |
| PROJ-04 | Phase 3 | Pending |
| PROJ-05 | Phase 3 | Pending |
| CONT-01 | Phase 5 | Pending |
| CONT-02 | Phase 5 | Pending |
| CONT-03 | Phase 5 | Pending |
| CONT-04 | Phase 5 | Pending |
| CONT-05 | Phase 5 | Pending |
| CONT-06 | Phase 5 | Pending |
| ANIM-01 | Phase 4 | Pending |
| ANIM-02 | Phase 4 | Pending |
| ANIM-03 | Phase 4 | Pending |
| ANIM-04 | Phase 4 | Pending |
| ANIM-05 | Phase 4 | Pending |
| PERF-01 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |
| ACCS-01 | Phase 5 | Pending |
| ACCS-02 | Phase 5 | Pending |
| ACCS-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-02*
*Last updated: 2026-02-02 after initial definition*
