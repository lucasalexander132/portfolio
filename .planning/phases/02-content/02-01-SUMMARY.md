---
phase: 02-content
plan: 01
subsystem: ui-components
tags: [navigation, hero, utility, empathy-messaging]

dependency-graph:
  requires:
    - 01-foundation (design tokens, fonts, color palette)
  provides:
    - cn() utility for conditional class merging
    - Navigation component with scroll awareness
    - Hero section with empathy-first messaging
  affects:
    - 02-02 (Services section will use lucide-react icons)
    - All future components (cn() utility available)

tech-stack:
  added:
    - lucide-react@0.563.0 (icon library for services)
  patterns:
    - cn() utility (clsx + tailwind-merge) for conditional styling
    - Client component with useEffect for scroll detection
    - Server component for static presentational sections

key-files:
  created:
    - src/lib/utils.ts
    - src/components/layout/Navigation.tsx
    - src/components/sections/Hero.tsx
  modified:
    - package.json (lucide-react dependency)

metrics:
  duration: 1.5 min
  completed: 2026-02-02
---

# Phase 02 Plan 01: Foundation Components Summary

**One-liner:** cn() utility, scroll-aware navigation, and empathy-first hero section with golden hour atmosphere.

## What Was Built

### 1. Utility Function (`src/lib/utils.ts`)

Standard shadcn/ui pattern for conditional Tailwind class merging:

```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Used throughout components for clean conditional styling.

### 2. Navigation Component (`src/components/layout/Navigation.tsx`)

Client component with scroll-aware behavior:

- **Fixed position** header with z-50
- **Logo** ("Civix") on left in serif font, links to "/"
- **Nav links** on right: Services, Projects, Contact (anchor links)
- **Scroll detection** at 50px threshold
- **Visual states:**
  - Initial: transparent background, py-4
  - Scrolled: bg-base-900/95 with backdrop-blur and shadow, py-3
- **Transition:** 300ms for smooth state changes

### 3. Hero Section (`src/components/sections/Hero.tsx`)

Server component with empathy-first messaging:

- **Atmospheric background:**
  - Base gradient from-base-900 via-base-950 to-base-950
  - Golden hour warm glow positioned top-left with blur
- **Empathy-first headline:** "Been burned by developers before?"
- **Value proposition:** Validates concern, offers collaborative approach
- **Scroll hint:** Amber link with down arrow, subtle hover animation
- **Height:** 85vh to hint at content below

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Server component for Hero | No interactivity needed, pure presentation |
| Client component for Nav | Requires useState/useEffect for scroll detection |
| 50px scroll threshold | Enough scroll to indicate intent, not too sensitive |
| Arrow character over icon | Simple, no extra dependency, matches "minimal for now" |
| max-w-3xl for hero text | Optimal line length for readability |

## Deviations from Plan

None - plan executed exactly as written.

## Test Results

- TypeScript: No errors (`npx tsc --noEmit` passed)
- All files created at correct paths
- lucide-react installed successfully

## Next Phase Readiness

Ready for 02-02 (Services section):
- lucide-react available for service icons
- cn() utility ready for conditional styling
- Design tokens from Phase 1 working correctly
- Component patterns established (client vs server)
