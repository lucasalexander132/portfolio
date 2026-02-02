# Phase 2: Content - Research

**Researched:** 2026-02-02
**Domain:** Hero section, services section, floating navigation, empathy-first copywriting
**Confidence:** HIGH

## Summary

Phase 2 builds the hero and services sections with empathy-first messaging. This research covers hero layout patterns, floating navigation implementation, service card layouts, icon integration, scroll indicators, and copywriting frameworks for small business audiences who have been burned before.

The standard approach uses semantic HTML sections with Tailwind CSS 4 utilities already established in Phase 1, a client component for the scroll-aware navigation, Lucide React for simple service icons, and the PAS (Problem-Agitate-Solution) copywriting framework adapted for empathy-first messaging.

**Primary recommendation:** Build hero as a server component with atmospheric gradient background, services as a three-column card grid (stacking on mobile), and extract the navigation into a client component that uses useState/useEffect to detect scroll position and change from transparent to solid background.

## Standard Stack

### Core (From Phase 1)

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Next.js | 16.1.6 | Framework | Already installed |
| React | 19.2 | UI library | Server components for static sections |
| Tailwind CSS | 4.x | Styling | Design tokens from Phase 1 |
| TypeScript | 5.x | Type safety | Strict mode |

### New for Phase 2

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lucide-react | ^0.562 | Service icons | Lightweight, tree-shakable, 1000+ consistent icons, excellent React integration |

### Not Needed Yet

| Library | Reason to Defer |
|---------|-----------------|
| shadcn/ui | Phase 2 uses custom sections, not reusable form components |
| Motion (Framer Motion) | Animation deferred to Phase 4 per CONTEXT.md |
| react-intersection-observer | Simple scroll detection doesn't need the abstraction |

**Installation:**
```bash
npm install lucide-react
```

## Architecture Patterns

### Recommended Project Structure (Phase 2 Files)

```
src/
├── app/
│   ├── page.tsx              # Main page composing sections
│   └── globals.css           # Design tokens (from Phase 1)
├── components/
│   ├── layout/
│   │   └── Navigation.tsx    # Client component (scroll-aware)
│   └── sections/
│       ├── Hero.tsx          # Server component
│       └── Services.tsx      # Server component
```

### Pattern 1: Scroll-Aware Navigation

**What:** Navigation bar that starts transparent over the hero, becomes solid with shadow on scroll.

**When to use:** Hero sections with atmospheric backgrounds where nav needs to be visible but not dominate.

**Why client component:** Requires window.scrollY access and useState for scroll state.

**Example:**
```typescript
// src/components/layout/Navigation.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-base-900/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      )}
    >
      {/* Nav content */}
    </nav>
  )
}
```

**Source:** [DEV Community - Change navbar style on scroll](https://dev.to/bilalmohib/how-to-change-navbar-style-on-scroll-in-react-jsnext-js-582n)

### Pattern 2: Hero Section Layout

**What:** Full-height atmospheric hero with left-aligned text and breathing room.

**When to use:** Landing pages establishing mood before content.

**Example:**
```typescript
// src/components/sections/Hero.tsx
export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center">
      {/* Atmospheric gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-900 via-base-950 to-base-950" />

      {/* Optional: warm accent glow */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-amber-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-container-padding">
        <h1 className="text-display font-serif text-text-primary mb-6">
          {/* Empathy-first headline */}
        </h1>
        <p className="text-h3 text-text-secondary max-w-2xl mb-8">
          {/* Value proposition */}
        </p>
        <a href="#services" className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-2">
          See my work <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  )
}
```

**Key decisions from CONTEXT.md:**
- Height: 80-90vh (hint of content below)
- Text layout: Left-aligned with breathing room on right
- Hero CTA: Subtle text link, not a button
- No identity in hero (logo in nav only)

### Pattern 3: Services Three-Column Card Grid

**What:** Three service cards in a row on desktop, stacked on mobile.

**When to use:** Presenting a limited set of offerings in scannable format.

**Example:**
```typescript
// src/components/sections/Services.tsx
import { Code, Palette, Users } from "lucide-react"

const services = [
  {
    icon: Code,
    title: "Custom Development",
    problem: "You need more than a template",
    solution: "I build exactly what your business needs"
  },
  // ... two more
]

export function Services() {
  return (
    <section id="services" className="py-section">
      <div className="max-w-6xl mx-auto px-container-padding">
        <h2 className="text-h1 font-serif text-text-primary mb-12">
          How I Can Help
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="card-grain p-8 bg-base-800 rounded-xl shadow-elevation-sm"
            >
              <service.icon
                className="text-amber-500 mb-4"
                size={32}
                strokeWidth={1.5}
              />
              <h3 className="text-h3 font-serif text-text-primary mb-3">
                {service.title}
              </h3>
              <p className="text-body text-text-secondary">
                {service.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Source:** [MDN Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout), [Ishadeed Section Layout](https://ishadeed.com/article/modern-css-section-layout/)

### Pattern 4: Lucide Icon Integration

**What:** Import icons as named exports, customize with size/color/strokeWidth props.

**When to use:** Any place needing simple, consistent iconography.

**Example:**
```typescript
import { Code, Palette, Users, ArrowDown } from "lucide-react"

// Basic usage - inherits currentColor
<Code size={24} />

// Custom styling
<Palette
  size={32}
  className="text-amber-500"
  strokeWidth={1.5}
/>

// In Tailwind context - size via className
<Users className="w-8 h-8 text-amber-400" />
```

**Props available:**
- `size` (number, default 24) - icon dimensions
- `color` (string, default "currentColor") - stroke color
- `strokeWidth` (number, default 2) - line thickness
- `absoluteStrokeWidth` (boolean) - prevents stroke scaling with size

**Source:** [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react)

### Anti-Patterns to Avoid

- **Cramming the hero:** One primary message, one primary action. Decision fatigue kills conversion.
- **Vague headlines:** "We Build Solutions" says nothing. Be specific about the problem you solve.
- **Feature lists in services:** Nobody cares about "React, TypeScript, AWS". They care what they get.
- **Scroll events without cleanup:** Always return the removeEventListener in useEffect.
- **Animated scroll indicator on first load:** Per CONTEXT.md, animation deferred to Phase 4.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service icons | Custom SVGs | lucide-react | Consistent stroke width, tree-shaking, typed |
| Scroll detection | Complex intersection observer | Simple scrollY check | Only need "scrolled past threshold" |
| Card hover states | Complex animation system | Tailwind transitions | transition-all duration-300 is sufficient |
| Navigation links | Custom scroll-to | Native anchor links | html { scroll-behavior: smooth } handles it |

**Key insight:** Phase 2 is about content and structure, not animation. Keep interactions minimal (hover states only) and defer orchestrated animation to Phase 4.

## Common Pitfalls

### Pitfall 1: Window Not Defined in Server Components

**What goes wrong:** Using window.scrollY or addEventListener in a server component causes hydration errors.

**Why it happens:** Server components run on the server where window doesn't exist.

**How to avoid:** Extract scroll-aware code into client components with "use client" directive.

**Warning signs:** Error message "window is not defined" or hydration mismatch warnings.

### Pitfall 2: Self-Focused Copy

**What goes wrong:** Headlines like "We've helped 100+ clients" or "Award-winning development".

**Why it happens:** Natural instinct to lead with credentials.

**How to avoid:** Use "you-first" language. Start with their problem, not your achievements.

**Example:**
- Bad: "Expert React Development Services"
- Good: "Been burned by developers who disappeared?"

**Source:** [Empathy in Marketing Copy](https://sarahklongerbo.com/blog/empathy-in-marketing-copy/)

### Pitfall 3: Hero Too Tall (No Content Hint)

**What goes wrong:** Visitors don't know to scroll; they think hero is the whole page.

**Why it happens:** 100vh hero with no visual indication of content below.

**How to avoid:** Use 80-90vh and include a scroll hint ("See my work ↓").

**Warning signs:** High bounce rate, low scroll depth.

### Pitfall 4: z-index Stacking Issues

**What goes wrong:** Navigation gets hidden behind hero elements or doesn't appear above content.

**Why it happens:** Multiple positioned elements without clear z-index hierarchy.

**How to avoid:** Establish clear z-index scale:
- Navigation: z-50
- Hero overlay elements: z-10
- Grain texture: z-[9999] with pointer-events-none (established in Phase 1)

### Pitfall 5: Forgetting Mobile Reflow

**What goes wrong:** Three-column service cards become tiny and unreadable on mobile.

**Why it happens:** Using fixed widths or not testing mobile breakpoints.

**How to avoid:** Use `grid md:grid-cols-3` so cards stack single-column on mobile.

**Source:** [CONTEXT.md decision: "Mobile behavior: Reflow — adapt layout specifically for mobile"]

## Code Examples

### Complete Navigation Component

```typescript
// src/components/layout/Navigation.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    // Check initial state
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-base-900/95 backdrop-blur-sm shadow-elevation-sm py-3"
          : "bg-transparent py-4"
      )}
    >
      <nav className="max-w-6xl mx-auto px-[var(--container-padding)] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-h3 text-text-primary hover:text-amber-400 transition-colors"
        >
          Civix
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
```

### Empathy-First Hero Section

```typescript
// src/components/sections/Hero.tsx
export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-20">
      {/* Atmospheric background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-900 via-base-950 to-base-950" />

      {/* Warm glow accent (golden hour feel) */}
      <div
        className="absolute top-1/4 -left-1/4 w-3/4 h-1/2 rounded-full blur-[120px] opacity-30"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.12 72 / 0.4), transparent)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-[var(--container-padding)]">
        <div className="max-w-3xl">
          {/* Empathy-first headline */}
          <h1 className="text-display font-serif text-text-primary mb-6 leading-tight">
            Been burned by developers before?
          </h1>

          {/* Value proposition */}
          <p className="text-h3 font-sans text-text-secondary mb-8 leading-relaxed">
            I get it. You hired someone who promised the world and disappeared.
            Let's skip the sales pitch and talk about what you actually need.
          </p>

          {/* Subtle scroll CTA */}
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span>See how I can help</span>
            <span
              aria-hidden="true"
              className="group-hover:translate-y-0.5 transition-transform"
            >
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
```

### Services Section with Icons

```typescript
// src/components/sections/Services.tsx
import { Code, MessageSquare, Zap } from "lucide-react"

const services = [
  {
    icon: Code,
    title: "Custom Development",
    description: "If you're tired of templates that don't fit, I build exactly what your business needs — no more, no less."
  },
  {
    icon: MessageSquare,
    title: "Ongoing Communication",
    description: "If you've been ghosted before, you'll appreciate weekly updates and responses within hours, not days."
  },
  {
    icon: Zap,
    title: "Fast Iteration",
    description: "If you're watching competitors move faster, I help you ship improvements in days instead of months."
  },
]

export function Services() {
  return (
    <section id="services" className="py-[var(--spacing-section)]">
      <div className="max-w-6xl mx-auto px-[var(--container-padding)]">
        {/* Section header */}
        <h2 className="text-h1 font-serif text-text-primary mb-4">
          How I Can Help
        </h2>
        <p className="text-body text-text-secondary max-w-2xl mb-12">
          Every project starts with a conversation — no pressure, no commitment.
          Just two people figuring out if we're a good fit.
        </p>

        {/* Service cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="card-grain p-8 bg-base-800 rounded-xl shadow-elevation-sm"
            >
              <service.icon
                className="text-amber-500 mb-6"
                size={32}
                strokeWidth={1.5}
              />
              <h3 className="text-h3 font-serif text-text-primary mb-3">
                {service.title}
              </h3>
              <p className="text-body text-text-secondary leading-relaxed">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Copywriting Framework

### Empathy-First PAS (Problem-Agitate-Solution)

The CONTEXT.md establishes the visitor persona: small business owner who has been burned by developers before, skeptical but hopeful, referred by someone they trust.

**Standard PAS:**
1. Problem: State their pain
2. Agitate: Twist the knife
3. Solution: Present relief

**Empathy-First Adaptation:**
1. **Acknowledge:** "Been burned before?" (I see you)
2. **Validate:** "I get it. You hired someone who..." (I understand)
3. **Reassure:** "Let's skip the sales pitch..." (I'm different)

### Copy Guidelines (from CONTEXT.md)

| Principle | Example |
|-----------|---------|
| Clarity over cleverness | "I build websites" not "I craft digital experiences" |
| Benefits over features | "You'll know what's happening" not "Weekly Slack updates" |
| Specificity over vagueness | "Response within hours" not "Fast communication" |
| "You" before "I" | "You'll get..." not "I provide..." |

### Headline Options for Hero

Based on CONTEXT.md decisions (thoughtful partner voice, warm professional personality):

1. **Direct acknowledgment:** "Been burned by developers before?"
2. **Question format:** "Tired of promises that never ship?"
3. **Outcome focused:** "Finally, a developer who actually communicates."
4. **Relief focused:** "Skip the sales pitch. Let's just talk."

**Recommended:** Option 1 or 4 — directly acknowledges the pain point, sets conversational tone.

### Service Description Formula

"If you're [struggling with X / tired of Y], [I help you / you'll get] [specific outcome]."

Examples:
- "If you're tired of templates that don't fit, I build exactly what your business needs."
- "If you've been ghosted before, you'll appreciate weekly updates and responses within hours."

**Source:** [PAS Framework](https://empathyfirstmedia.com/pas-framework-copywriting/), [Empathy in Copywriting](https://www.bigstarcopywriting.com/blog/copywriting-tips/empathy-in-copywriting-how-to-show-it/)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Feature-focused headlines | Empathy-first messaging | 2024-2026 trend | Higher engagement, lower bounce |
| Heavy hero imagery | Atmospheric gradients | 2025-2026 | Faster load, mood preservation |
| Complex intersection observers | Simple scrollY threshold | Always valid | Simpler code, same result |
| Icon fonts (FontAwesome) | Tree-shakable SVG (Lucide) | 2023+ | Smaller bundles, better a11y |
| CSS-in-JS for components | Tailwind utilities | 2024+ | Faster, no runtime cost |

**Current trends (2026):**
- Bold typography dominates hero sections
- Vibrant gradients create depth without heavy images
- Mobile-first vertical layouts (though we're desktop-first in Phase 1)
- "You-first" copy replacing self-promotional language

**Source:** [Hero Section Design 2026](https://www.perfectafternoon.com/2025/hero-section-design/), [Copywriting Trends 2026](https://www.megankachigan.com/2026-copywriting-trends/)

## Open Questions

### 1. Exact Service Offerings

**What we know:** Three services, card layout, icon + title + description format.

**What's unclear:** What three services should be listed? CONTEXT.md says "Claude's Discretion."

**Recommendation:** Based on PROJECT.md context (frontend consultancy, small business focus):
1. Custom Development (Code icon)
2. Ongoing Communication (MessageSquare icon)
3. Fast Iteration/Quick Wins (Zap icon)

### 2. Navigation Mobile Behavior

**What we know:** Floating nav with anchor links (Services, Projects, Contact).

**What's unclear:** Mobile menu treatment (hamburger vs. always visible).

**Recommendation:** Defer mobile menu complexity to Phase 4. For Phase 2, keep links visible but smaller on mobile — portfolio has few enough links to fit.

### 3. Section Divider Style

**What we know:** CONTEXT.md mentions "subtle divider — gradient fade, line, or soft spacing."

**What's unclear:** Which specific treatment.

**Recommendation:** Start with generous spacing (var(--spacing-section)) and subtle gradient fade from base-950 to base-900. Can be refined visually.

## Sources

### Primary (HIGH confidence)

- [Lucide React Documentation](https://lucide.dev/guide/packages/lucide-react) - Icon library API
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/background-image) - Gradient utilities
- [MDN CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout) - Three-column pattern

### Secondary (MEDIUM confidence)

- [DEV Community - Navbar on scroll](https://dev.to/bilalmohib/how-to-change-navbar-style-on-scroll-in-react-jsnext-js-582n) - Scroll detection pattern
- [Sarah Klongerbo - Empathy in Marketing Copy](https://sarahklongerbo.com/blog/empathy-in-marketing-copy/) - Copywriting approach
- [Empathy First Media - PAS Framework](https://empathyfirstmedia.com/pas-framework-copywriting/) - Copywriting structure
- [Ishadeed - Modern CSS Section Layout](https://ishadeed.com/article/modern-css-section-layout/) - Grid patterns

### Tertiary (LOW confidence)

- [Perfect Afternoon - Hero Section Design 2026](https://www.perfectafternoon.com/2025/hero-section-design/) - Design trends (general guidance)
- [Hypercolor](https://hypercolor.dev/) - Gradient inspiration (reference only)

## Metadata

**Confidence breakdown:**
- Navigation scroll pattern: HIGH - Well-documented React pattern
- Hero layout: HIGH - Standard CSS Grid/Flex, validated in Phase 1
- Services grid: HIGH - Tailwind grid utilities documented
- Lucide integration: HIGH - Official documentation verified
- Copywriting framework: MEDIUM - Principles sound but final copy needs user validation
- Exact visual treatments: MEDIUM - Based on CONTEXT.md guidance, needs visual tuning

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (stable patterns, 30-day validity)
