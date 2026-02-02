---
phase: 04-animation
plan: 04
subsystem: ui
tags: [motion, drag, carousel, inline-expansion, animatepresence]

# Dependency graph
requires:
  - phase: 04-01
    provides: Motion provider and spring transitions
  - phase: 04-03
    provides: Section scroll reveal and interactive states
  - phase: 03-02
    provides: ProjectModal with case study content structure
provides:
  - Inline project detail expansion (replaces modal)
  - DraggableGallery carousel with momentum physics
  - Height animation choreography (expand then wipe)
  - Cross-fade content switching
affects: [05-polish, accessibility]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - AnimatePresence mode="wait" for height transitions
    - Drag gesture with momentum physics
    - Content wipe animation with delay choreography
    - Selected state visual indicator on cards

key-files:
  created:
    - src/components/sections/DraggableGallery.tsx
    - src/components/sections/ProjectDetail.tsx
  modified:
    - src/components/sections/Projects.tsx
    - src/components/sections/ProjectCard.tsx
    - src/app/page.tsx

key-decisions:
  - "Inline expansion over modal - keeps user in context"
  - "Height-first animation choreography - height expands, then content wipes in from right"
  - "dragMomentum with bounceStiffness: 300, bounceDamping: 30 for natural feel"
  - "rounded-b-[28px] on detail to match parent container corners"

patterns-established:
  - "AnimatePresence mode='wait' with height: 0/auto for inline expansions"
  - "Drag gesture pattern: drag='x', dragElastic: 0.1, dragMomentum: true"
  - "Choreographed enter: parent height first, child content with delay"

# Metrics
duration: 4min
completed: 2026-02-02
---

# Phase 4 Plan 4: Inline Project Expansion Summary

**Inline project detail with draggable gallery carousel replaces modal - height animates first, then content wipes in from right with momentum-based drag navigation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-02T20:01:00Z
- **Completed:** 2026-02-02T20:05:01Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Replaced modal with inline expansion - users stay in context
- DraggableGallery with horizontal drag, momentum physics, and bleed effect
- Choreographed animation: height expands (0.35s), then content wipes from right (0.2s delay)
- Cross-fade when switching projects (AnimatePresence mode="wait" with key)
- Selected project card shows amber ring indicator

## Task Commits

Each task was committed atomically:

1. **Task 1: Create DraggableGallery carousel component** - `55ab22a` (feat)
2. **Task 2: Create ProjectDetail inline expansion component** - `4f167a3` (feat)
3. **Task 3: Wire inline expansion into Projects section and page** - `85f7dd4` (feat)

## Files Created/Modified

- `src/components/sections/DraggableGallery.tsx` - Horizontal drag carousel with momentum
- `src/components/sections/ProjectDetail.tsx` - Inline detail with cream background and two-column layout
- `src/components/sections/Projects.tsx` - AnimatePresence wrapper, removed modal, added inline expansion
- `src/components/sections/ProjectCard.tsx` - Added isSelected prop for visual indicator
- `src/app/page.tsx` - Minor layout adjustment for overflow handling

## Decisions Made

1. **Inline expansion over modal** - Major UX improvement keeping users in scrolling context
2. **Height-then-content choreography** - Height animates first (0.35s ease), content wipes in from right with 0.2s delay
3. **Momentum physics** - bounceStiffness: 300, bounceDamping: 30 for natural drag feel
4. **Gallery bleed effect** - Negative margins (-mx-4 sm:-mx-8) let images extend past content frame
5. **Drag hint** - "Drag to explore" indicator fades after first interaction
6. **Selected card ring** - amber-400 ring shows which project is expanded

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added isSelected prop to ProjectCard**
- **Found during:** Task 3 (wiring inline expansion)
- **Issue:** Projects.tsx passed isSelected prop but ProjectCard didn't accept it
- **Fix:** Added optional isSelected prop to ProjectCard interface, applied ring styling when selected
- **Files modified:** src/components/sections/ProjectCard.tsx
- **Verification:** TypeScript compiles, selected state visually indicated
- **Committed in:** 85f7dd4 (Task 3 commit)

**2. [Rule 3 - Blocking] Added rounded-b-[28px] to ProjectDetail**
- **Found during:** Task 3 (page layout integration)
- **Issue:** Detail section inside dark card container would have square corners at bottom, not matching parent's rounded corners
- **Fix:** Added rounded-b-[28px] class to ProjectDetail root div to match parent container
- **Files modified:** src/components/sections/ProjectDetail.tsx
- **Verification:** Visual corners match, no dark showing behind cream
- **Committed in:** 85f7dd4 (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes necessary for visual polish and TypeScript compliance. No scope creep.

## Issues Encountered

None - plan executed smoothly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Inline expansion complete and functional
- DraggableGallery ready for any project with multiple images
- ProjectModal.tsx remains in codebase but unused (can be deleted in polish phase)
- Ready for 04-05 or next animation tasks

---
*Phase: 04-animation*
*Completed: 2026-02-02*
