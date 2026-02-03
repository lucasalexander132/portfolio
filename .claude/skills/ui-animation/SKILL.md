---
name: ui-animation
description: Professional UI animation and motion design using Framer Motion. Use when creating animations, transitions, micro-interactions, or motion systems for React applications. Covers timing, easing, spring physics, gestures, scroll animations, and the craft elements that distinguish award-winning motion from generic animation. Triggers on requests for animated components, page transitions, interactive elements, or motion design systems.
---

# Professional UI Animation with Framer Motion

Animation should feel intentional, serve a purpose, and express personality. Every motion must earn its place by improving UX, guiding attention, or communicating meaning.

## Motion Design Principles

### Timing

| Type | Duration | Use Case |
|------|----------|----------|
| Micro-interactions | 100-200ms | Buttons, toggles, hover states |
| Standard UI | 200-300ms | Modals, menus, state changes |
| Page transitions | 300-400ms | Route changes, major shifts |
| Complex sequences | 400-600ms | Multi-element choreography |

**Rules**: Under 100ms won't register. Over 500ms feels sluggish. Desktop should be ~2x faster than mobile.

### Easing

Never use linear for UI elements—it feels robotic.

```typescript
const easings = {
  // Entering elements (decelerate: fast start, gentle stop)
  enter: [0.0, 0.0, 0.2, 1],
  // Exiting elements (accelerate: gentle start, fast exit)
  exit: [0.4, 0.0, 1, 1],
  // On-screen movement
  standard: [0.4, 0.0, 0.2, 1],
  // Playful overshoot
  overshoot: [0.68, -0.6, 0.32, 1.6],
  // Snappy, satisfying
  snap: [0.65, 0, 0.35, 1],
};
```

**Golden rule**: Entering → ease-out. Exiting → ease-in. Moving → ease-in-out.

### Spring Physics

Use springs for interactive elements; they naturally incorporate velocity and feel more alive.

```typescript
const springs = {
  // Snappy button feedback
  snappy: { type: "spring", stiffness: 400, damping: 17 },
  // Smooth modal transitions
  smooth: { type: "spring", stiffness: 260, damping: 20 },
  // Bouncy, playful
  bouncy: { type: "spring", stiffness: 300, damping: 10 },
  // Gentle, subtle
  gentle: { type: "spring", stiffness: 100, damping: 15 },
};
```

**Parameters**: Higher stiffness = snappier. Higher damping = less bounce. Higher mass = slower, heavier.

## The Craft: What Makes Animation Premium

### The Polish Formula

**Anticipation + Follow-Through + Secondary Motion = Premium Feel**

1. **Anticipation**: Wind-up before movement (button scales down before up)
2. **Overshoot**: Motion exceeds target, then settles back
3. **Secondary motion**: Supporting movements (shadow scales with card lift, ripples on press)

### Common Mistakes

❌ Same duration for all animations
❌ Linear easing anywhere
❌ Animation for decoration, not function
❌ Too many simultaneous movements (limit to 3)
❌ Blocking user goals with animation
❌ Missing anticipation/follow-through

### What Award-Winning Studios Do

- Purpose-driven motion (never decoration alone)
- Cohesive timing/easing across entire system
- 60fps non-negotiable—stuttering destroys quality
- Sound integration reinforcing motion
- Motion as narrative guiding user journey

## Implementation Patterns

### Variants System

```tsx
// Reusable fade-up pattern
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

// Container with staggered children
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};
```

### Exit Animations

```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="exit"
    />
  )}
</AnimatePresence>
```

Modes: `"sync"` (simultaneous), `"wait"` (sequential), `"popLayout"` (FLIP during exit).

### Gestures

```tsx
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, boxShadow: "0px 5px 10px rgba(0,0,0,0.2)" },
  tap: { scale: 0.95 }
};

<motion.button
  variants={buttonVariants}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
/>
```

### Scroll Animations

```tsx
// Viewport detection
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
/>

// Scroll progress
const { scrollYProgress } = useScroll();
<motion.div style={{ scaleX: scrollYProgress, transformOrigin: "left" }} />
```

### Layout Animations

```tsx
// Auto-animate size/position changes
<motion.div layout />

// Shared element transitions (same layoutId morphs between states)
<motion.div layoutId="underline" />
```

## Production Components

### Modal

```tsx
const modalVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### Staggered List

```tsx
function StaggeredList({ items }) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={fadeInUp}>
          {item.content}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Interactive Card

```tsx
const cardVariants = {
  rest: { scale: 1, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  hover: { 
    scale: 1.02, y: -4,
    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
    transition: { type: "spring", stiffness: 400, damping: 17 }
  },
  tap: { scale: 0.98 }
};

<motion.div
  variants={cardVariants}
  initial="rest"
  whileHover="hover"
  whileTap="tap"
/>
```

### Toast Notifications

```tsx
const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 20 }
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
};

<AnimatePresence mode="popLayout">
  {toasts.map((toast) => (
    <motion.div
      key={toast.id}
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    />
  ))}
</AnimatePresence>
```

### Page Transition

```tsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { 
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.0, 0.0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, y: -10,
    transition: { duration: 0.2, ease: [0.4, 0.0, 1, 1] }
  }
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

## Performance

**GPU-accelerated (always use)**: `transform` (x, y, scale, rotate), `opacity`, `filter`

**Avoid animating**: `width`, `height`, `top`, `left`, `margin`, `padding` — use transforms instead.

```tsx
// ✅ GPU accelerated
<motion.div animate={{ x: 100, scale: 1.2, opacity: 0.5 }} />

// ❌ Triggers layout recalculations
<motion.div animate={{ width: 200, left: 100 }} />
```

Use `useMotionValue` for values that change frequently to avoid React re-renders.

## Accessibility

```tsx
import { useReducedMotion } from "framer-motion";

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
  
  return <motion.div variants={variants} />;
}
```

## Quick Checklist

- [ ] Duration 200-500ms for most interactions?
- [ ] Proper easing (never linear)?
- [ ] Anticipation and follow-through where appropriate?
- [ ] Every animation serves a purpose?
- [ ] Consistent timing across similar elements?
- [ ] Respects `prefers-reduced-motion`?
- [ ] 60fps, no stuttering?