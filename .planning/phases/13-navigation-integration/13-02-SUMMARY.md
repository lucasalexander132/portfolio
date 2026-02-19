---
phase: 13-navigation-integration
plan: 02
status: complete
subsystem: navigation
tags: [navigation, routing, usePathname, footer, i18n]
requires: [13-01]
provides: [route-aware-navigation, updates-nav-link, updates-footer-link]
affects: []
tech-stack:
  added: []
  patterns: [route-aware-link-rendering, isHome-conditional-navigation]
key-files:
  created: []
  modified: [src/components/layout/Navigation.tsx, src/components/layout/Footer.tsx]
metrics:
  duration: 2 min
  completed: 2026-02-19
---

# Plan 13-02: Route-Aware Navigation -- Summary

Route-aware Navigation.tsx and Footer.tsx with Updates link, using usePathname() to conditionally smooth-scroll on homepage or navigate via Next.js Link elsewhere.

## What Was Built

Made both Navigation.tsx and Footer.tsx route-aware using `usePathname()`. On the homepage, hash links (#services, #projects) smooth-scroll as before. On other pages (like /updates), hash links navigate to `/#services` and `/#projects` via Next.js Link. Added "Updates" as a third nav item in both components. The logo now navigates to `/` when not on the homepage instead of trying to scroll to #hero.

## Deliverables

| Artifact | Status | Notes |
|----------|--------|-------|
| src/components/layout/Navigation.tsx | Modified | usePathname route detection, Updates link, conditional logo |
| src/components/layout/Footer.tsx | Modified | usePathname route detection, Updates quick link |

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Make Navigation route-aware and add Updates link | 03cc638 | Navigation.tsx |
| Add Updates link and route-awareness to Footer | 02ede2f | Footer.tsx |

## Decisions Made

- Used conditional rendering (isHashLink && isHome) rather than a wrapper component to keep the diff minimal and readable
- For off-homepage hash links, prepend `/` to create `/#section` URLs that Next.js Link handles natively
- Logo uses `<Link href="/">` off homepage vs `<a href="#hero" onClick={scroll}>` on homepage -- cleanest separation

## Deviations from Plan

None -- plan executed exactly as written.

## Issues Encountered

None.
