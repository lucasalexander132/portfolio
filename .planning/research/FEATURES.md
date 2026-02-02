# Features Research

**Domain:** Boutique frontend consultancy portfolio (single-page)
**Target Visitor:** Small business owners burned by agencies, arriving via referral, skeptical but hopeful
**Mood:** "Workshop at golden hour" - warm, technical, craft-focused
**Researched:** 2026-02-02
**Confidence:** HIGH (multiple corroborating sources)

---

## Table Stakes

Features visitors expect. Missing any of these and they leave or lose trust.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Mobile-responsive design** | 75% of consumers skip poorly designed sites; most browse on mobile | Medium | Must feel intentional on mobile, not just "not broken" |
| **Fast loading (LCP < 2.5s)** | Performance is table stakes in 2026; slow = unprofessional for a dev | Medium | Static site generation (Next.js/Astro) makes this achievable |
| **Clear value proposition above fold** | Visitors decide in <60 seconds; skeptical visitors even faster | Low | One sentence: pain point + outcome + credibility |
| **Contact method** | Visitors need a way to reach out; no contact = dead end | Low | Form preferred over email link (lower friction) |
| **Professional visual design** | 93% have security concerns with poorly designed sites | Medium | Clean, modern, but warm - not corporate sterile |
| **Working SSL/HTTPS** | Broken SSL screams negligence; browsers warn users | Low | Free with most hosts (Vercel, Netlify) |
| **Basic accessibility (WCAG 2.1 AA core)** | Legal exposure + right thing to do + demonstrates competence | Medium | Alt text, contrast, keyboard nav, semantic HTML |
| **Services overview** | Visitors need to know what you actually do | Low | Clear, scannable list - not buried in prose |
| **Some proof of work** | Without examples, claims are just claims | Medium | Even 2-3 projects beats zero |

### Why These Matter for THIS Audience

Small business owners burned by agencies are hypersensitive to red flags:
- Slow sites = "they can't even make their own site fast"
- Missing contact = "they don't actually want to talk to me"
- Unclear services = "vague like the last agency"
- No examples = "they might be new/unproven"

Trust is fragile. Table stakes aren't optional.

---

## Differentiators

Features that make this portfolio memorable and build trust with skeptical visitors.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Conversational case studies** | Stories resonate more than specs; shows you understand business context | Medium | "Challenge > Approach > Outcome" but in human voice |
| **Quantified results in case studies** | Proves impact, not just activity; counters agency vagueness | Low | "Reduced load time 3s to 0.8s" - specific numbers |
| **Warm, craft aesthetic** | 2026 trend: pushback against AI-polished sterility; feels human | Medium | Tactile textures, hand-drawn touches, organic shapes |
| **Real photography (not stock)** | Authentic visuals build trust; AI/stock feels impersonal | Low | Even imperfect real photos beat polished stock |
| **Transparent communication style** | Direct counter to agency opacity; builds intimacy | Low | Honest about what you do AND don't do |
| **Process transparency** | Shows how you work; reduces fear of unknown | Low | Brief "how we'll work together" section |
| **Personality/voice** | Memorable; referrals can say "the person who writes like X" | Low | Consistent tone throughout - warm but technical |
| **Single-page focus** | Respects visitor time; no hunting through menus | Low | Actually a differentiator vs. bloated agency sites |
| **Gentle contact form** | Lower pressure than "Get a Quote"; matches weary visitor mood | Low | "Tell me about your project" vs. aggressive CTA |
| **No jargon explanations** | Shows you understand non-technical clients | Low | Plain language, technical only when necessary |

### Differentiator Strategy for THIS Audience

The target visitor is **weary and skeptical**. Differentiators should:
1. **Reduce anxiety** (transparency, clear process, gentle CTAs)
2. **Feel human** (real photos, warm design, personality)
3. **Prove competence without bragging** (quantified results, not awards)
4. **Respect their time** (single page, scannable, no fluff)

The "workshop at golden hour" mood suggests:
- Warmth without casualness
- Craft without pretension
- Technical confidence without intimidation

---

## Anti-Features

Features to deliberately NOT build. Common in this space but wrong for this audience.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Chatbot/live chat** | Feels corporate; sets expectation of instant response; often annoying | Simple contact form with human response promise |
| **Aggressive CTAs** | "GET STARTED NOW" feels salesy; alienates weary visitors | Gentle invitations: "Let's talk about your project" |
| **Client logo parade** | Can feel like bragging; small businesses don't recognize enterprise logos | If used, keep minimal and relevant to target audience |
| **Pricing calculator** | Premature; projects need conversation; can attract price-shoppers | Offer to discuss scope in initial conversation |
| **Blog section** | Maintenance burden; often neglected; not why visitors come | Case studies serve the "demonstrate expertise" purpose |
| **Newsletter signup** | Portfolio visitors want help now, not content drip | Focus on direct contact instead |
| **Testimonial carousel** | Auto-playing elements feel dated; interrupts reading | Static testimonials integrated into case studies |
| **Skill bars/graphs** | Look amateurish; highlight weaknesses; visitors don't care about percentages | List skills plainly or demonstrate through case studies |
| **Services pricing page** | Fixed pricing doesn't fit consultancy model; invites comparison shopping | "Pricing depends on scope - let's discuss" |
| **Booking/scheduling widget** | Premature for first contact; adds friction | Simple form first; scheduling comes after initial conversation |
| **Social media links (unless active)** | Inactive social = red flag; better to omit than show 5 tweets from 2023 | Only link if genuinely active and professional |
| **Awards/badges section** | Can feel like overcompensation; skeptical visitors distrust self-promotion | Let work speak; mention credentials naturally in bio if relevant |
| **"About the company" corporate speak** | Creates distance; opposite of personal consultancy feel | Personal "about me" with real voice |
| **Multiple pages/complex navigation** | More places to get lost; reduces focus | Single page with smooth scroll sections |
| **Video background hero** | Performance hit; distracting; often feels dated now | Static hero with strong typography and warm color |
| **Complex animations everywhere** | Slow, distracting, accessibility issues, shows off vs. serves visitor | Subtle transitions only; motion serves clarity |

### Why Anti-Features Matter for THIS Audience

Visitors burned by agencies experienced:
- Overpromising and underdelivering
- Slick presentations masking poor execution
- Communication black holes
- Feeling like a number, not a partner

Every anti-feature above is something agencies do. Avoiding them signals: "I'm different."

---

## Feature Dependencies

What needs to be built before what.

```
Core Layout & Typography
    |
    +---> Hero Section (value prop, intro)
    |         |
    |         +---> Services Section
    |         |
    |         +---> Projects Section (case studies)
    |         |         |
    |         |         +---> Individual case study content
    |         |
    |         +---> Contact Section
    |                   |
    |                   +---> Form functionality (backend/service)
    |
    +---> Responsive behavior (parallel with sections)
    |
    +---> Performance optimization (after content exists)
    |
    +---> Accessibility audit (after visual design stable)
```

### Dependency Notes

1. **Typography & color first** - Everything else builds on this foundation
2. **Content before polish** - Case study content should exist before designing case study layouts
3. **Form backend can be late** - Static form UI first, hook up service later
4. **Performance tuning last** - Optimize after content/images are final
5. **Accessibility throughout** - Semantic HTML from start, audit at end

---

## MVP Feature Set Recommendation

For initial launch, prioritize:

### Must Have (Table Stakes)
1. Mobile-responsive single-page layout
2. Clear value proposition in hero
3. Services overview (scannable)
4. 2-3 case studies with quantified results
5. Contact form (working)
6. Fast loading (<2.5s LCP)
7. Basic accessibility (semantic HTML, alt text, contrast)

### Should Have (Key Differentiators)
1. Warm, craft-focused visual design
2. Conversational case study tone
3. Process transparency section
4. Gentle, low-pressure contact CTA

### Defer to Post-Launch
- Additional case studies (add as projects complete)
- Testimonials (gather after initial clients)
- Refined animations/micro-interactions
- Blog/articles (only if genuinely committed to maintaining)

---

## Sources

### Primary Sources (HIGH confidence)
- [Consultant Websites: 20+ Inspiring Examples (2026)](https://www.sitebuilderreport.com/inspiration/consulting-websites)
- [Best Consulting Websites: 17 Examples with Key Features](https://wpminds.com/best-consultant-websites/)
- [Why Trust Signals Are the Missing Link on Most Local Business Websites](https://www.bestversionmedia.com/why-trust-signals-are-the-missing-link-on-most-local-business-websites/)
- [B2B Website Trust Signals: Building Credibility That Converts](https://www.trajectorywebdesign.com/blog/b2b-website-trust-signals)
- [6 Key Trust Signals To Include on Your Consulting Business Website](https://www.webalive.com.au/trust-signals-include-consulting-business-website/)
- [Core Web Vitals Optimization Guide 2026](https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/)
- [2026 WCAG & ADA Website Compliance Requirements](https://www.accessibility.works/blog/wcag-ada-website-compliance-standards-requirements/)

### Design Trends (HIGH confidence)
- [Design Trends 2026: What's Next for Brands and Creators](https://www.designmantic.com/blog/design-forecast-2026/)
- [Web Design Trends to Expect in 2026 - Elementor](https://elementor.com/blog/web-design-trends-2026/)
- [8 Web Design Trends 2026 - VistaPrint](https://www.vistaprint.com/hub/web-design-trends)

### Portfolio Best Practices (MEDIUM confidence)
- [12 Things You Should Remove From Your Portfolio Website Immediately](https://mattolpinski.com/articles/fix-your-portfolio/)
- [8 Common Portfolio Mistakes (and How to Fix Them) - Creative Bloq](https://www.creativebloq.com/features/8-common-portfolio-mistakes-and-how-to-fix-them)
- [How to Write Portfolio Case Studies that Drive Sales](https://taylornguyen.ca/posts/website-case-studies)
- [Why Your Contact Page is the Most Important Part of Your Portfolio - Shopify](https://www.shopify.com/partners/blog/why-your-contact-page-is-the-most-important-part-of-your-portfolio-website)

### Trust Building (MEDIUM confidence)
- [I Don't Trust Digital Marketing Agencies! Why Small Businesses Are Bucking the Trend](https://www.buzzboard.ai/i-dont-trust-digital-marketing-agencies-why-small-businesses-are-bucking-the-trend/)
- [Building Trust With Clients as a Digital Agency](https://www.buzzboard.ai/building-trust-with-clients-consultative-selling-strategies-for-digital-agencies/)
- [7 Essential Strategies for Building Client Trust - AgencyAnalytics](https://agencyanalytics.com/blog/building-client-trust)
