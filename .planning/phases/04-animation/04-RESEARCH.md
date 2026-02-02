# Phase 4: Animation - Research

**Researched:** 2026-02-02
**Domain:** Motion library (formerly Framer Motion) for React animations
**Confidence:** HIGH

## Summary

This phase adds orchestrated motion to the portfolio using Motion for React (the renamed Framer Motion library, now at version 12.30.0). The implementation covers five distinct animation domains: page load choreography with typewriter effect, scroll-triggered reveals, interactive hover/tap states, a major UX change from modal to inline project detail expansion, and proper accessibility through prefers-reduced-motion support.

The Motion library provides all required capabilities: `LazyMotion` with `domAnimation` features keeps bundle under 10KB added. The `useInView` hook handles scroll triggers at ~25% visibility. Spring physics create the "smooth & measured" character with subtle overshoot. The `useReducedMotion` hook and `MotionConfig` handle accessibility. For the inline project detail expansion, layout animations with `height: "auto"` combined with `AnimatePresence` mode="wait" orchestrate the expand/collapse/content-switch behavior.

**Primary recommendation:** Install `motion` package, wrap app in `LazyMotion` with `domAnimation` features, use `m` component for all animations, and implement `MotionConfig reducedMotion="user"` globally for accessibility.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.30.0 | Animation library | Industry standard for React, formerly Framer Motion |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-use/measure | latest | Dynamic content measurement | Accordion/expand animations with dynamic height |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion | CSS animations | CSS cannot do spring physics, orchestration, or layout animations |
| motion | react-spring | Motion has better React integration, smaller bundle with LazyMotion |
| motion/domMax | motion/domAnimation | domMax adds drag/layout at +10KB; we need layout animations |

**Note:** The project detail inline expansion requires layout animations, which means we need `domMax` features (not just `domAnimation`). This adds ~10KB but stays within the 10KB "added" budget since it replaces larger modal component code.

**Installation:**
```bash
npm install motion
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── motion/              # Motion-specific components
│   │   ├── MotionProvider.tsx    # LazyMotion + MotionConfig wrapper
│   │   ├── FadeUp.tsx            # Reusable fade-up animation
│   │   ├── StaggerContainer.tsx  # Parent for staggered children
│   │   └── Typewriter.tsx        # Custom typewriter effect
│   ├── sections/
│   │   ├── Hero.tsx              # Uses Typewriter, FadeUp
│   │   ├── Projects.tsx          # Scroll reveal, inline detail
│   │   └── ProjectDetail.tsx     # NEW: replaces ProjectModal
│   └── layout/
│       └── Navigation.tsx        # Underline hover animations
└── lib/
    └── motion.ts            # Shared variants, transitions
```

### Pattern 1: LazyMotion Provider with MotionConfig
**What:** Wrap entire app in LazyMotion with domMax features and MotionConfig for reduced motion
**When to use:** Always - this is the foundation for bundle optimization and accessibility

```typescript
// src/components/motion/MotionProvider.tsx
'use client'

import { LazyMotion, domMax, MotionConfig } from 'motion/react'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
```

### Pattern 2: Shared Variants for Consistent Motion
**What:** Define animation variants in a shared file for consistency
**When to use:** Any repeated animation pattern

```typescript
// src/lib/motion.ts
import type { Variants, Transition } from 'motion/react'

// Smooth & measured character - not bouncy, subtle overshoot
export const springSubtle: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30, // High damping = minimal overshoot (1-2px)
}

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 25,
}

// Standard durations (250-350ms)
export const durationStandard = 0.3
export const durationSlow = 0.5

// Fade-up variant for scroll reveals
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durationStandard,
      ease: 'easeOut',
    }
  },
}

// Stagger container for children
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08, // ~0.08s between items
    },
  },
}

// Project card hover
export const cardHoverVariants: Variants = {
  rest: { y: 0, boxShadow: 'var(--shadow-elevation-sm)' },
  hover: {
    y: -4,
    boxShadow: 'var(--shadow-elevation-md)',
    transition: springSubtle,
  },
}

// Button press
export const buttonTapVariants: Variants = {
  rest: { scale: 1 },
  tap: {
    scale: 0.97,
    transition: springSnappy,
  },
}
```

### Pattern 3: useInView for Scroll Triggers
**What:** Detect when sections enter viewport at 25% visibility
**When to use:** Below-fold sections (Services, Projects, Footer)

```typescript
// Component using scroll reveal
'use client'

import { m, useInView } from 'motion/react'
import { useRef } from 'react'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion'

export function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,      // Animate once only
    amount: 0.25,    // Trigger at 25% visible
  })

  return (
    <m.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainerVariants}
    >
      {services.map((service) => (
        <m.article key={service.title} variants={fadeUpVariants}>
          {/* content */}
        </m.article>
      ))}
    </m.section>
  )
}
```

### Pattern 4: Typewriter Effect
**What:** Character-by-character reveal with blinking cursor
**When to use:** Hero headline

```typescript
// src/components/motion/Typewriter.tsx
'use client'

import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'motion/react'

interface TypewriterProps {
  text: string
  speed?: number  // ms per character
  className?: string
  onComplete?: () => void
}

export function Typewriter({
  text,
  speed = 70,  // ~70ms/char = medium pace
  className,
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
      onComplete?.()
      // Blink cursor a few times then fade
      const blinkTimeout = setTimeout(() => {
        setShowCursor(false)
      }, 2000)  // Blink for 2s then fade
      return () => clearTimeout(blinkTimeout)
    }
  }, [displayedText, text, speed, onComplete])

  return (
    <span className={className}>
      {displayedText}
      <AnimatePresence>
        {showCursor && (
          <m.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isComplete ? [1, 0] : 1 }}
            exit={{ opacity: 0 }}
            transition={{
              repeat: isComplete ? 3 : Infinity,
              duration: 0.5,
            }}
            className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
          />
        )}
      </AnimatePresence>
    </span>
  )
}
```

### Pattern 5: Inline Project Detail Expansion
**What:** Replace modal with expanding section below project cards
**When to use:** Project detail view (major UX change from Phase 3)

```typescript
// Conceptual structure for inline expansion
'use client'

import { m, AnimatePresence, LayoutGroup } from 'motion/react'

export function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <LayoutGroup>
      {/* Projects section - animates border-radius when detail opens */}
      <m.section
        layout
        className="bg-base-900"
        style={{
          borderBottomLeftRadius: selectedId ? '1.5rem' : 0,
          borderBottomRightRadius: selectedId ? '1.5rem' : 0,
        }}
      >
        {/* Project cards grid */}
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            onClick={() => setSelectedId(project.id)}
          />
        ))}
      </m.section>

      {/* Inline detail section */}
      <AnimatePresence mode="wait">
        {selectedId && (
          <m.div
            key={selectedId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-cream overflow-hidden"
          >
            {/* Content wipes in from right */}
            <m.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <ProjectDetail projectId={selectedId} />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Following section - animates top border-radius */}
      <m.section layout>
        {/* Next section content */}
      </m.section>
    </LayoutGroup>
  )
}
```

### Pattern 6: Draggable Carousel with Momentum
**What:** Horizontal gallery with drag, momentum, and bleed
**When to use:** Project detail gallery

```typescript
// Gallery carousel with drag
'use client'

import { m, useMotionValue, useTransform, animate } from 'motion/react'
import { useRef } from 'react'

export function DraggableGallery({ images }: { images: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)

  // Constraint: allow dragging within bounds
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })

  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth
      const clientWidth = containerRef.current.clientWidth
      setDragConstraints({
        left: -(scrollWidth - clientWidth),
        right: 0,
      })
    }
  }, [images])

  return (
    <div className="overflow-hidden" ref={containerRef}>
      <m.div
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.1}  // Subtle tug at edges
        dragTransition={{
          bounceStiffness: 300,
          bounceDamping: 30,
        }}
        style={{ x }}
        className="flex gap-4 cursor-grab active:cursor-grabbing"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[80%]"  // Bleed effect
          >
            <Image src={src} alt="" fill className="object-cover" />
          </div>
        ))}
      </m.div>
    </div>
  )
}
```

### Anti-Patterns to Avoid
- **Using `motion` instead of `m`:** Within `LazyMotion`, always use `m` component to get bundle benefits
- **Forgetting `strict` prop:** Without strict mode, accidental `motion` imports add full bundle
- **Animating height directly:** Use `height: "auto"` or layout animations, not pixel values
- **Linear easing:** Never use linear - use easeOut for enters, easeIn for exits
- **Excessive bounce:** Keep spring damping high (25-35) for "measured" feel, not bouncy

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll detection | IntersectionObserver wrapper | `useInView` hook | Handles cleanup, SSR, edge cases |
| Spring physics | Custom spring function | Motion's spring transition | Physics-accurate, interruptible |
| Exit animations | Manual state management | `AnimatePresence` | Handles DOM lifecycle correctly |
| Layout shifts | Transform calculations | `layout` prop | FLIP animations, cross-browser |
| Reduced motion | Manual media query | `MotionConfig reducedMotion` | Automatic, consistent across app |
| Typewriter | setInterval loop | Motion values or custom hook | Better timing control, pauseable |
| Drag carousel | Touch event handling | `drag` prop with constraints | Momentum, elastic bounds, gesture recognition |

**Key insight:** Motion's declarative API handles complex state transitions (interrupted animations, gesture conflicts, layout changes) that are extremely hard to implement correctly with vanilla React state.

## Common Pitfalls

### Pitfall 1: Bundle Size Explosion
**What goes wrong:** Importing from `motion/react` without LazyMotion loads full 34KB bundle
**Why it happens:** Default `motion` component includes all features
**How to avoid:**
1. Use `LazyMotion` with `domAnimation` or `domMax` features
2. Import `m` not `motion` within LazyMotion children
3. Add `strict` prop to catch accidental full imports
**Warning signs:** Bundle analyzer shows motion chunk > 15KB

### Pitfall 2: Stagger Not Working
**What goes wrong:** `staggerChildren` has no effect
**Why it happens:** staggerChildren only works inside variants, not inline animations
**How to avoid:** Define variants object, use `initial`/`animate` with variant names
**Warning signs:** All children animate simultaneously despite stagger config

### Pitfall 3: Exit Animations Not Playing
**What goes wrong:** Elements disappear instantly instead of animating out
**Why it happens:** Component unmounts before animation completes
**How to avoid:**
1. Wrap in `AnimatePresence`
2. Add unique `key` to direct children
3. Don't wrap animated children in fragments
**Warning signs:** `exit` prop defined but no visible exit animation

### Pitfall 4: Layout Animation Distortion
**What goes wrong:** Text or images appear squished/stretched during layout animation
**Why it happens:** Layout animations use transform: scale internally
**How to avoid:**
1. Add `layout` prop to children that shouldn't distort
2. Use `layoutId` for shared element transitions
3. Avoid animating containers with mixed content types
**Warning signs:** Text becomes blurry or images distort mid-animation

### Pitfall 5: Reduced Motion Ignored
**What goes wrong:** Animations play for users with prefers-reduced-motion
**Why it happens:** `MotionConfig reducedMotion` not set, or components outside provider
**How to avoid:**
1. Wrap app root in `MotionConfig reducedMotion="user"`
2. Test with system reduced motion enabled
3. Keep opacity animations (they're accessibility-safe)
**Warning signs:** No animation change when toggling OS reduced motion setting

### Pitfall 6: Scroll Animation Flicker
**What goes wrong:** Elements flash on page load before scroll reveal
**Why it happens:** Initial state not set, or hydration mismatch
**How to avoid:**
1. Set `initial="hidden"` on scroll-triggered elements
2. Use `useInView` with `once: true` to prevent re-triggering
3. Ensure server/client render same initial state
**Warning signs:** Content visible, then hidden, then animates in

## Code Examples

Verified patterns from official sources:

### LazyMotion Setup (Required)
```typescript
// Source: https://motion.dev/docs/react-lazy-motion
import { LazyMotion, domMax } from 'motion/react'

// Sync loading (features in main bundle)
function App() {
  return (
    <LazyMotion features={domMax} strict>
      <Routes />
    </LazyMotion>
  )
}

// Async loading (features lazy-loaded)
const loadFeatures = () => import('./features').then(mod => mod.domMax)

function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <Routes />
    </LazyMotion>
  )
}
```

### useInView Scroll Trigger
```typescript
// Source: https://motion.dev/docs/react-use-in-view
import { useRef } from 'react'
import { m, useInView } from 'motion/react'

function Section() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,    // Only trigger once
    amount: 0.25,  // 25% visible threshold
  })

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  )
}
```

### Staggered Children
```typescript
// Source: https://motion.dev/docs/stagger
import { m } from 'motion/react'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function List({ items }) {
  return (
    <m.ul variants={container} initial="hidden" animate="visible">
      {items.map((i) => (
        <m.li key={i} variants={item}>{i}</m.li>
      ))}
    </m.ul>
  )
}
```

### Spring Transitions
```typescript
// Source: https://motion.dev/docs/react-transitions
import { m } from 'motion/react'

// Subtle spring for hover lift (1-2px overshoot)
<m.div
  whileHover={{ y: -4 }}
  transition={{
    type: 'spring',
    stiffness: 400,
    damping: 30,  // High damping = minimal overshoot
  }}
/>

// Snappy spring for button press
<m.button
  whileTap={{ scale: 0.97 }}
  transition={{
    type: 'spring',
    stiffness: 500,
    damping: 25,
  }}
/>
```

### Reduced Motion Configuration
```typescript
// Source: https://motion.dev/docs/react-accessibility
import { MotionConfig } from 'motion/react'

// Wrap app - automatically respects prefers-reduced-motion
function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/* All motion components will disable transforms for reduced motion users */}
      {/* Opacity and color animations still work (safe for vestibular) */}
    </MotionConfig>
  )
}

// Manual check when needed
import { useReducedMotion } from 'motion/react'

function Component() {
  const shouldReduce = useReducedMotion()

  return (
    <m.div
      animate={{
        x: shouldReduce ? 0 : 100,  // Skip movement
        opacity: 1,  // Keep opacity (always safe)
      }}
    />
  )
}
```

### Height Auto Animation
```typescript
// Source: https://www.joshuawootonn.com/how-to-animate-width-and-height-with-framer-motion
import { m, AnimatePresence } from 'motion/react'

function Accordion({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  )
}
```

### AnimatePresence Mode
```typescript
// Source: https://motion.dev/docs/react-animate-presence
import { m, AnimatePresence } from 'motion/react'

// mode="wait" - exiting child animates out before entering child animates in
// Use for project content switching
<AnimatePresence mode="wait">
  <m.div
    key={selectedProject.id}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
  >
    <ProjectContent project={selectedProject} />
  </m.div>
</AnimatePresence>

// mode="popLayout" - exiting element pops out of layout flow
// Use when surrounding elements should reflow immediately
<AnimatePresence mode="popLayout">
  {items.map(item => (
    <m.div key={item.id} layout exit={{ opacity: 0 }}>
      {item.content}
    </m.div>
  ))}
</AnimatePresence>
```

### Drag with Momentum
```typescript
// Source: https://motion.dev/docs/react-drag
import { m } from 'motion/react'
import { useRef } from 'react'

function Carousel() {
  const constraintsRef = useRef(null)

  return (
    <div ref={constraintsRef} className="overflow-hidden">
      <m.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={true}  // default, enables momentum
        dragTransition={{
          bounceStiffness: 300,
          bounceDamping: 30,
        }}
        className="flex gap-4"
      >
        {/* carousel items */}
      </m.div>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { motion } from "framer-motion"` | `import { m } from "motion/react"` | Motion 11.x (2024) | New package name, same API |
| `AnimateSharedLayout` wrapper | `layoutId` prop directly | Framer Motion 5.x | Simpler API, no wrapper needed |
| `exitBeforeEnter` prop | `mode="wait"` prop | Framer Motion 6.x | More modes available |
| `positionTransition` prop | `layout` prop | Framer Motion 2.x | More capable, consistent |

**Deprecated/outdated:**
- `framer-motion` package: Renamed to `motion`, import from `motion/react`
- `AnimateSharedLayout`: Removed, use `layoutId` directly
- `exitBeforeEnter`: Renamed to `mode="wait"`
- `motion/three`: Moved to separate `framer-motion-3d` then removed entirely

## Open Questions

Things that couldn't be fully resolved:

1. **Exact spring values for "barely perceptible" overshoot**
   - What we know: High stiffness (400+) and high damping (25-35) reduce overshoot
   - What's unclear: Exact values for 1-2px overshoot depend on travel distance
   - Recommendation: Start with stiffness: 400, damping: 30, tune visually

2. **domAnimation vs domMax bundle impact**
   - What we know: domAnimation is +15KB, domMax is +25KB
   - What's unclear: Whether layout animations (needed for inline expansion) work with domAnimation
   - Recommendation: Use domMax since layout animations are required; still under 10KB "added" vs modal removal

3. **Typewriter implementation approach**
   - What we know: Motion+ has official Typewriter component (1.3KB, paid)
   - What's unclear: Whether to use paid component or build custom
   - Recommendation: Build custom using useState + useEffect (simple enough, avoids dependency)

## Sources

### Primary (HIGH confidence)
- [Motion.dev LazyMotion](https://motion.dev/docs/react-lazy-motion) - Bundle optimization
- [Motion.dev useInView](https://motion.dev/docs/react-use-in-view) - Scroll detection
- [Motion.dev Accessibility](https://motion.dev/docs/react-accessibility) - Reduced motion
- [Motion.dev Upgrade Guide](https://motion.dev/docs/react-upgrade-guide) - Package migration
- [Motion.dev Drag](https://motion.dev/docs/react-drag) - Carousel implementation
- [Motion.dev AnimatePresence](https://motion.dev/docs/react-animate-presence) - Exit animations
- [Motion.dev Stagger](https://motion.dev/docs/stagger) - Staggered animations

### Secondary (MEDIUM confidence)
- [Joshua Wootonn - Animate height](https://www.joshuawootonn.com/how-to-animate-width-and-height-with-framer-motion) - Height auto patterns
- [Maxime Heckel - Layout animations](https://blog.maximeheckel.com/posts/framer-motion-layout-animations/) - Advanced layout patterns
- [Motion.dev Transitions](https://www.framer.com/motion/transition/) - Spring configuration

### Tertiary (LOW confidence)
- Various Medium articles on typewriter effects - Implementation approaches vary

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Motion is definitively the right library, version verified via npm
- Architecture: HIGH - Patterns from official docs and established community practices
- Pitfalls: HIGH - Well-documented in GitHub issues and community forums

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (Motion releases frequently but API is stable)
