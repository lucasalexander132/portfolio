# Phase 1: Foundation - Research

**Researched:** 2026-02-02
**Domain:** Design system infrastructure (typography, color, texture, shadows, responsive layout)
**Confidence:** HIGH

## Summary

Phase 1 establishes the visual foundation for the "workshop at golden hour" mood. This research covers the specific implementation patterns for typography pairing with next/font, Tailwind CSS 4 theming with CSS variables, grain texture overlays, layered shadow systems, and mobile-first responsive design with container queries.

The standard approach leverages Next.js 16's built-in font optimization with `next/font/google`, Tailwind CSS 4's `@theme` directive for design tokens as CSS variables, pure CSS/SVG grain texture techniques, and layered box-shadow systems for realistic depth. All techniques are verified as current and performant for the LCP < 2.5s requirement.

**Primary recommendation:** Use `next/font/google` for Fraunces (serif headlines) and a humanist sans-serif like Open Sans or Nunito Sans (body), define all colors/shadows/spacing through Tailwind CSS 4's `@theme` directive, implement grain via CSS/SVG filter (not image), and use mobile-first container queries for responsive behavior.

## Standard Stack

### Core (Locked by CLAUDE.md)

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Next.js | 16.1+ | Framework | Turbopack default, automatic font optimization |
| React | 19.2 | UI library | Server components for initial render perf |
| Tailwind CSS | 4.x | Styling | CSS-first config with `@theme` directive |
| TypeScript | 5.x | Type safety | Strict mode |

### Typography

| Font | Role | Why |
|------|------|-----|
| **Fraunces** | Headlines (serif) | Old Style soft-serif, variable font, elegant with personality, fits "workshop" craft feel |
| **Open Sans** or **Nunito Sans** | Body (humanist sans) | Warm, approachable, excellent readability, humanist characteristics complement serif |

**Alternative body fonts:** PT Sans (good small-size hinting), Onest (screens-optimized), DM Sans (geometric but readable)

### Supporting Libraries

| Library | Purpose | When to Use |
|---------|---------|-------------|
| None additional | Foundation phase uses built-in capabilities | All typography, theming, and responsive handled by Next.js + Tailwind |

**No additional installation needed for Phase 1** - all capabilities are built into Next.js 16 and Tailwind CSS 4.

## Architecture Patterns

### Recommended Project Structure (Foundation Files)

```
app/
├── layout.tsx           # Root layout with fonts, body classes
├── page.tsx             # Home page (shell for Phase 1)
├── globals.css          # Tailwind imports, @theme tokens, grain overlay
└── fonts.ts             # Font configuration (optional, can be in layout)

lib/
└── utils.ts             # cn() helper (from shadcn)
```

### Pattern 1: Font Configuration with next/font

**What:** Load fonts using next/font/google with CSS variable output for Tailwind integration.

**Why:** Zero layout shift, automatic optimization, self-hosted (no external requests), CSS variable enables Tailwind utility classes.

**Example:**
```typescript
// app/layout.tsx or app/fonts.ts
import { Fraunces, Open_Sans } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  // Optional: specify axes for variable font control
  axes: ['opsz', 'SOFT'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**Source:** [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)

### Pattern 2: Tailwind CSS 4 Theme with @theme Directive

**What:** Define all design tokens (colors, fonts, shadows, spacing) using `@theme` in CSS.

**Why:** Creates utility classes automatically, CSS variables accessible everywhere, single source of truth.

**Example:**
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Typography */
  --font-serif: var(--font-fraunces), ui-serif, Georgia, serif;
  --font-sans: var(--font-open-sans), ui-sans-serif, system-ui, sans-serif;

  /* Color Palette - Workshop at Golden Hour */
  --color-base-950: oklch(0.13 0.02 250);    /* Deep slate - darkest */
  --color-base-900: oklch(0.18 0.02 250);    /* Deep slate - primary bg */
  --color-base-800: oklch(0.24 0.02 250);    /* Slate - card bg */
  --color-base-700: oklch(0.32 0.015 250);   /* Muted slate - borders */

  --color-amber-500: oklch(0.75 0.15 75);    /* Golden honey - primary accent */
  --color-amber-400: oklch(0.82 0.12 75);    /* Light gold - hover states */
  --color-amber-300: oklch(0.88 0.08 75);    /* Pale gold - subtle highlights */

  --color-text-primary: oklch(0.92 0.02 80);   /* Warm off-white (cream tint) */
  --color-text-secondary: oklch(0.72 0.015 80); /* Muted cream */
  --color-text-muted: oklch(0.55 0.01 250);    /* Slate gray */

  /* Layered Shadows (cool-tinted for contrast) */
  --shadow-sm:
    0 1px 2px oklch(0.15 0.02 250 / 0.15),
    0 1px 1px oklch(0.15 0.02 250 / 0.1);
  --shadow-md:
    0 2px 4px oklch(0.15 0.02 250 / 0.12),
    0 4px 8px oklch(0.15 0.02 250 / 0.1),
    0 8px 16px oklch(0.15 0.02 250 / 0.08);
  --shadow-lg:
    0 4px 8px oklch(0.15 0.02 250 / 0.1),
    0 8px 16px oklch(0.15 0.02 250 / 0.08),
    0 16px 32px oklch(0.15 0.02 250 / 0.06),
    0 32px 64px oklch(0.15 0.02 250 / 0.04);
}
```

**Source:** [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme)

### Pattern 3: Grain Texture Overlay with CSS/SVG

**What:** Create visible grain texture using SVG turbulence filter, applied to background only.

**Why:** Zero HTTP requests, scales perfectly, performant, pure CSS approach.

**Example:**
```css
/* app/globals.css - Grain texture */

/* SVG data URI for noise filter */
.grain-overlay::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.08; /* Noticeable but not overwhelming */
  mix-blend-mode: overlay;
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .grain-overlay::before {
    /* Static grain is fine - no motion animation to reduce */
  }
}

/* Alternative: animated grain (subtle movement) */
.grain-animated::before {
  animation: grain-shift 0.5s steps(10) infinite;
}

@keyframes grain-shift {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-2%, -2%); }
  20% { transform: translate(2%, 2%); }
  /* ... more steps for natural feel */
}

@media (prefers-reduced-motion: reduce) {
  .grain-animated::before {
    animation: none;
  }
}
```

**Source:** [CSS Grainy Gradients - CSS-Tricks](https://css-tricks.com/grainy-gradients/)

### Pattern 4: Layered Shadows for Depth

**What:** Use multiple box-shadow layers with varying offsets and blur radii for realistic depth.

**Why:** Single shadows look flat; layered shadows create natural elevation perception.

**Example:**
```css
/* Defined in @theme, used as utilities */
.card-elevated {
  /* Uses --shadow-md from theme */
  box-shadow: var(--shadow-md);
}

/* Or define directly for custom needs */
.hero-element {
  box-shadow:
    0 1px 1px oklch(0.15 0.02 250 / 0.075),
    0 2px 2px oklch(0.15 0.02 250 / 0.075),
    0 4px 4px oklch(0.15 0.02 250 / 0.075),
    0 8px 8px oklch(0.15 0.02 250 / 0.075),
    0 16px 16px oklch(0.15 0.02 250 / 0.075);
}
```

**Key insight:** Use cool-tinted shadows (blue undertones in slate) to contrast with warm amber accents. Shadow color should relate to environment, not pure black.

**Source:** [Designing Beautiful Shadows in CSS - Josh W. Comeau](https://www.joshwcomeau.com/css/designing-shadows/)

### Pattern 5: Fluid Typography with CSS clamp()

**What:** Scale font sizes smoothly between viewport sizes using clamp().

**Why:** Eliminates jarring jumps at breakpoints, single line of CSS, maintains readability across devices.

**Example:**
```css
/* In @theme or @layer base */
@theme {
  /* Fluid type scale */
  --text-display: clamp(2.5rem, 5vw + 1rem, 4.5rem);  /* Hero headlines */
  --text-h1: clamp(2rem, 3vw + 1rem, 3rem);           /* Section headers */
  --text-h2: clamp(1.5rem, 2vw + 0.75rem, 2rem);      /* Subsections */
  --text-body: clamp(1rem, 1vw + 0.75rem, 1.125rem);  /* Body text */
  --text-small: clamp(0.875rem, 0.5vw + 0.75rem, 1rem); /* Captions */
}
```

**Accessibility note:** Maximum font size should be <= 2.5x minimum to ensure WCAG zoom compliance.

**Source:** [Modern Fluid Typography Using CSS Clamp - Smashing Magazine](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)

### Pattern 6: Container Queries for Component Responsiveness

**What:** Style elements based on container size, not viewport. Built into Tailwind CSS 4 core.

**Why:** Components respond to their context, enabling true component reusability across different layouts.

**Example:**
```html
<!-- Parent defines container -->
<div class="@container">
  <!-- Child responds to container size -->
  <div class="@sm:flex @sm:gap-4 @md:gap-8">
    <h2 class="@sm:text-xl @md:text-2xl">Title</h2>
    <p class="@sm:text-base">Content adapts to container</p>
  </div>
</div>
```

**Note:** Use `@max-sm`, `@max-md` for max-width container queries. Named containers available with `@container/{name}`.

**Source:** [Tailwind CSS v4.0 - Container Queries](https://tailwindcss.com/blog/tailwindcss-v4)

### Anti-Patterns to Avoid

- **Hardcoded colors:** Never use hex/rgb directly in components. Always use CSS variables from `@theme`.
- **Multiple font loading strategies:** Stick to `next/font` exclusively. Don't mix with `<link>` tags or `@import`.
- **Image-based grain:** Adds HTTP request, doesn't scale well. Use SVG/CSS approach.
- **Single box-shadow:** Results in flat, unrealistic depth. Layer multiple shadows.
- **Viewport-only responsive:** Use container queries for component-level responsiveness.
- **Pure black shadows:** Desaturates and looks muddy. Use colored shadows matching environment.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading | Custom `@font-face` with preload logic | `next/font/google` | Automatic optimization, zero layout shift, self-hosted |
| Color opacity variants | Manual rgba calculations | OKLCH with alpha in Tailwind | Native support, better perceptual uniformity |
| Responsive breakpoints | Custom media query mixins | Tailwind built-in + container queries | Consistent, documented, tested |
| Shadow elevation system | Custom shadow utility classes | `@theme` with `--shadow-*` variables | Single source of truth, auto-generates utilities |
| Grain texture images | PNG/WebP grain overlays | SVG feTurbulence filter | Zero requests, scales infinitely, performant |

**Key insight:** Next.js 16 and Tailwind CSS 4 have evolved to handle most foundation concerns natively. Custom solutions add maintenance burden without benefit.

## Common Pitfalls

### Pitfall 1: Font Variable Scope Issue in Tailwind CSS 4

**What goes wrong:** Font CSS variables from `next/font` aren't available to Tailwind's `@theme` because they're injected into the HTML element at runtime, after Tailwind processes CSS.

**Why it happens:** Tailwind CSS 4 resolves `@theme` variables at build time. next/font injects variables at runtime.

**How to avoid:** Use `@theme inline` for font references, or define font utilities directly:
```css
@theme inline {
  --font-serif: var(--font-fraunces), ui-serif, Georgia, serif;
  --font-sans: var(--font-open-sans), ui-sans-serif, system-ui, sans-serif;
}
```

**Source:** [Tailwind CSS Discussion #15923](https://github.com/tailwindlabs/tailwindcss/discussions/15923)

### Pitfall 2: Grain Overlay Blocking Interactions

**What goes wrong:** Grain overlay captures pointer events, making buttons and links unclickable.

**Why it happens:** Fixed/absolute positioned overlay sits above interactive elements.

**How to avoid:** Always set `pointer-events: none` on grain overlay element:
```css
.grain-overlay::before {
  pointer-events: none;
  /* ... rest of grain styles */
}
```

### Pitfall 3: Shadow Color Desaturation

**What goes wrong:** Shadows look muddy and lifeless on colored backgrounds.

**Why it happens:** Pure black with opacity desaturates the underlying color.

**How to avoid:** Match shadow hue to environment. For warm golden hour mood with slate base, use cool-tinted slate shadows:
```css
/* Good: colored shadow */
box-shadow: 0 4px 8px oklch(0.15 0.02 250 / 0.1);

/* Bad: pure black */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
```

### Pitfall 4: Fluid Typography Zoom Issues

**What goes wrong:** Text using viewport units (vw) doesn't scale when user zooms browser.

**Why it happens:** Viewport units are tied to viewport dimensions, not zoom level.

**How to avoid:** Always use clamp() with rem-based min/max values:
```css
/* Good: zoomable */
font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);

/* Bad: not zoomable at extremes */
font-size: 2vw;
```

### Pitfall 5: Font Display Flash

**What goes wrong:** Page renders with fallback font, then "flashes" when custom font loads.

**Why it happens:** `font-display: swap` shows fallback immediately.

**How to avoid:** `next/font` automatically calculates fallback metrics to minimize shift. Ensure you're using the `variable` option to enable this:
```typescript
const fraunces = Fraunces({
  variable: '--font-fraunces',  // Enables fallback adjustment
  display: 'swap',
})
```

### Pitfall 6: LCP Blocked by CSS

**What goes wrong:** Large CSS file blocks rendering, delaying LCP.

**Why it happens:** CSS is render-blocking by default.

**How to avoid:**
- Tailwind CSS 4 with PurgeCSS removes unused styles (up to 90% reduction)
- Keep `globals.css` focused on essentials
- Don't import large external CSS libraries
- Use Tailwind utilities in JSX, not custom CSS classes when possible

## Code Examples

### Complete globals.css Foundation

```css
/* app/globals.css */
@import "tailwindcss";

/* Theme tokens using @theme directive */
@theme {
  /* Typography - reference next/font variables */
  --font-serif: var(--font-fraunces), ui-serif, Georgia, serif;
  --font-sans: var(--font-open-sans), ui-sans-serif, system-ui, sans-serif;

  /* Fluid Type Scale */
  --text-display: clamp(2.5rem, 5vw + 1rem, 4.5rem);
  --text-h1: clamp(2rem, 3vw + 1rem, 3rem);
  --text-h2: clamp(1.5rem, 2vw + 0.75rem, 2rem);
  --text-h3: clamp(1.25rem, 1.5vw + 0.75rem, 1.5rem);
  --text-body: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
  --text-small: clamp(0.875rem, 0.25vw + 0.8rem, 0.9375rem);

  /* Color Palette: Workshop at Golden Hour (Dark Mode Only) */
  /* Base: Warm slate with blue undertones */
  --color-base-950: oklch(0.12 0.015 250);
  --color-base-900: oklch(0.16 0.015 250);
  --color-base-800: oklch(0.22 0.012 250);
  --color-base-700: oklch(0.30 0.010 250);
  --color-base-600: oklch(0.40 0.008 250);

  /* Accent: Golden honey amber */
  --color-amber-600: oklch(0.68 0.16 70);
  --color-amber-500: oklch(0.75 0.15 72);
  --color-amber-400: oklch(0.82 0.13 74);
  --color-amber-300: oklch(0.88 0.10 76);

  /* Text: Warm off-white (cream/gold tint) */
  --color-text-primary: oklch(0.93 0.015 85);
  --color-text-secondary: oklch(0.75 0.010 85);
  --color-text-muted: oklch(0.55 0.008 250);

  /* Layered Shadows: Cool-tinted for contrast */
  --shadow-color: oklch(0.10 0.02 250);

  --shadow-sm:
    0 1px 2px oklch(0.10 0.02 250 / 0.12),
    0 1px 1px oklch(0.10 0.02 250 / 0.08);

  --shadow-md:
    0 2px 4px oklch(0.10 0.02 250 / 0.10),
    0 4px 8px oklch(0.10 0.02 250 / 0.08),
    0 8px 16px oklch(0.10 0.02 250 / 0.06);

  --shadow-lg:
    0 4px 6px oklch(0.10 0.02 250 / 0.08),
    0 8px 15px oklch(0.10 0.02 250 / 0.06),
    0 16px 30px oklch(0.10 0.02 250 / 0.05),
    0 32px 60px oklch(0.10 0.02 250 / 0.04);

  /* Spacing (using Tailwind defaults, extend if needed) */
  --spacing-section: clamp(4rem, 8vw, 8rem);

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Container */
  --container-max: 72rem;  /* 1152px */
  --container-padding: clamp(1rem, 4vw, 2rem);
}

/* Base layer for global defaults */
@layer base {
  html {
    font-family: var(--font-sans);
    color: var(--color-text-primary);
    background-color: var(--color-base-950);
  }

  body {
    min-height: 100dvh;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* Typography defaults */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    line-height: 1.2;
    font-weight: 400;  /* Fraunces looks best at regular weight */
  }

  h1 { font-size: var(--text-h1); }
  h2 { font-size: var(--text-h2); }
  h3 { font-size: var(--text-h3); }

  p {
    font-size: var(--text-body);
    max-width: 65ch;  /* Optimal reading width */
  }
}

/* Grain texture overlay component */
@layer components {
  .grain-overlay {
    position: relative;
  }

  .grain-overlay::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    opacity: 0.06;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
}

/* Utility for text that "sinks into" the page */
@layer utilities {
  .text-sink {
    text-shadow: 0 1px 0 oklch(0.08 0.01 250 / 0.5);
  }
}
```

### Complete Root Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Fraunces, Open_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],  // Optical size for better rendering
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Civix Solutions | Frontend Development for Small Business',
  description: 'Boutique frontend consultancy building solutions for small businesses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${openSans.variable}`}
    >
      <body className="grain-overlay bg-base-950 text-text-primary">
        {children}
      </body>
    </html>
  )
}
```

### Minimal Test Page

```typescript
// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-8">
      <div className="max-w-2xl space-y-8">
        <h1 className="text-display font-serif text-text-primary">
          Workshop at Golden Hour
        </h1>
        <p className="text-body text-text-secondary">
          A well-organized space where interesting things get made.
          There is a sense of craft, of care, of someone who will
          work through the night while you rest.
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-base-950 rounded-md shadow-md">
          <span className="font-medium">Start a Conversation</span>
        </div>
      </div>
    </main>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js themes | `@theme` directive in CSS | Tailwind v4 (Jan 2025) | Config is now CSS-first, simpler mental model |
| @tailwindcss/container-queries plugin | Built-in container queries | Tailwind v4 (Jan 2025) | No plugin needed, `@container` works natively |
| Media queries only | Container queries + media queries | Tailwind v4 (Jan 2025) | Components respond to context, not just viewport |
| RGB/HSL colors | OKLCH colors | Tailwind v4 (Jan 2025) | Better perceptual uniformity, easier manipulation |
| Multiple shadow utilities | Custom --shadow-* in @theme | Tailwind v4 | Layered shadows as design tokens |
| External @font-face | next/font with variable output | Next.js 13+ | Zero layout shift, automatic optimization |

**Deprecated/outdated:**
- `@next/font` package - use `next/font/google` or `next/font/local` directly
- `tailwind.config.js` for theming - use `@theme` in CSS for Tailwind v4
- CSS rgb()/hsl() for Tailwind themes - OKLCH is the new default
- `@tailwindcss/container-queries` plugin - now built into core

## Open Questions

### 1. Grain Animation Decision

**What we know:** Static grain works universally. Animated grain adds subtle life but requires `prefers-reduced-motion` handling.

**What's unclear:** Does animated grain enhance the "workshop" mood enough to justify the complexity?

**Recommendation:** Start with static grain. Animation can be added later if static feels too flat. This aligns with CONTEXT.md marking grain animation as "Claude's Discretion."

### 2. Exact OKLCH Color Values

**What we know:** The palette should be warm slate base with cool undertones + golden honey amber accents + cream text.

**What's unclear:** Exact OKLCH values need visual tuning in browser.

**Recommendation:** Start with the values in code examples, then adjust based on visual testing. Key relationships matter more than absolute values: base should be dark enough for amber to "glow," text should feel warm but not yellow.

### 3. Font Weight Strategy

**What we know:** Fraunces is variable weight (100-900). CONTEXT.md lists weight contrast as "Claude's Discretion."

**What's unclear:** Whether bold headlines or regular weight creates better "workshop" mood.

**Recommendation:** Start with regular (400) weight for Fraunces - it has high contrast built in and looks elegant at regular weight. Use body font weight (400/500) to create hierarchy rather than heavy headline weights.

## Sources

### Primary (HIGH confidence)

- [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme) - Official documentation for @theme directive
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - Official next/font documentation
- [Tailwind CSS v4.0 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) - Container queries, OKLCH, @theme
- [Fraunces - Google Fonts](https://fonts.google.com/specimen/Fraunces) - Font details and variable axes

### Secondary (MEDIUM confidence)

- [Using Custom Fonts in Next.js + Tailwind CSS V4](https://medium.com/@divineosehotue/using-custom-fonts-in-next-js-tailwind-css-v4-a37057b18f7f) - Integration pattern
- [Modern Fluid Typography Using CSS Clamp](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/) - Fluid type implementation
- [Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/) - Layered shadow technique
- [CSS Grainy Gradients](https://css-tricks.com/grainy-gradients/) - SVG grain technique
- [Tailwind CSS Discussion #15923](https://github.com/tailwindlabs/tailwindcss/discussions/15923) - Font variable scope issue

### Tertiary (LOW confidence)

- [Top 10 Most Popular Humanist Sans-Serif Fonts](https://www.typewolf.com/top-10-humanist-sans-serif-fonts) - Font pairing guidance
- [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/) - Tool for generating clamp values

## Metadata

**Confidence breakdown:**
- Typography implementation: HIGH - Verified with official Next.js and Tailwind docs
- Tailwind CSS 4 theming: HIGH - Official documentation confirms @theme approach
- Grain texture: HIGH - CSS-Tricks technique is well-established
- Shadows: HIGH - Josh Comeau's technique is widely adopted
- Responsive/container queries: HIGH - Built into Tailwind v4 core
- Specific color values: MEDIUM - Palette relationship verified, exact values need visual tuning

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (stable technologies, 30-day validity)

---

## RESEARCH COMPLETE

**Phase:** 1 - Foundation
**Confidence:** HIGH

### Key Findings

1. **Typography:** Use `next/font/google` for Fraunces (serif) + Open Sans/Nunito Sans (humanist sans). CSS variables enable Tailwind integration. No external font loading strategies needed.

2. **Tailwind CSS 4 Theming:** The `@theme` directive replaces `tailwind.config.js` for design tokens. OKLCH colors are the new default. Container queries are built-in (no plugin).

3. **Grain Texture:** SVG feTurbulence filter via data URI is the performant, scalable approach. No image files needed. Always use `pointer-events: none`.

4. **Shadows:** Layer multiple box-shadows with increasing offset/blur for realistic depth. Use cool-tinted colors (not pure black) to avoid desaturation.

5. **Fluid Typography:** CSS `clamp()` handles responsive sizing in one line. Keep max <= 2.5x min for WCAG zoom compliance.

### File Created

`/Users/lucasalexander/portfolio/.planning/phases/01-foundation/01-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | Official docs verified, current versions |
| Typography | HIGH | next/font is documented, Fraunces on Google Fonts |
| Tailwind Theming | HIGH | @theme directive in official v4 docs |
| Grain/Shadows | HIGH | Established techniques with clear examples |
| Responsive | HIGH | Container queries built into Tailwind v4 core |

### Open Questions

- Grain animation (static vs subtle movement) - user discretion per CONTEXT.md
- Exact OKLCH color values - need visual tuning
- Font weight strategy - recommended starting point provided

### Ready for Planning

Research complete. Planner can now create PLAN.md files for Phase 1 tasks.
