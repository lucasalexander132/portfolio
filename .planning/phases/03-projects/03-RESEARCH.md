# Phase 3: Projects - Research

**Researched:** 2026-02-02
**Domain:** Project showcase, card grid layout, modal/dialog galleries, TypeScript data structures
**Confidence:** HIGH

## Summary

Phase 3 creates a project showcase section with card-based layout and expandable modal detail views featuring image galleries. This research covers the shadcn/ui Dialog component (built on Radix UI primitives), image gallery patterns within modals, TypeScript-safe data structures for project content, responsive grid layouts using Tailwind CSS 4, and integration with the existing codebase patterns established in Phases 1-2.

The standard approach leverages shadcn/ui Dialog for accessible modals with automatic focus trapping and scroll lock, Next.js Image component for optimized responsive screenshots, and a TypeScript data file using `as const satisfies` pattern for compile-time type safety. The existing codebase patterns (card-grain, shadow-elevation-*, color tokens) should be extended to maintain visual consistency.

**Primary recommendation:** Use shadcn/ui Dialog component for the modal implementation (handles accessibility, focus trap, scroll lock automatically), a simple prev/next navigation for gallery within the modal (not a complex carousel), Next.js Image with explicit `sizes` prop for responsive screenshots, and a single `projects.ts` data file with a discriminated union type for "live" vs "coming-soon" project states.

## Standard Stack

### Core (From Phase 1-2)

| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Next.js | 16.1.6 | Framework | Already installed |
| React | 19.2 | UI library | Mix of server and client components |
| Tailwind CSS | 4.x | Styling | Design tokens from Phase 1 |
| TypeScript | 5.x | Type safety | Strict mode |
| lucide-react | ^0.563 | Icons | Already installed |

### New for Phase 3

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @radix-ui/react-dialog | ^1.1.x | Dialog primitive | Shadcn/ui dependency, handles a11y automatically |
| shadcn/ui dialog | latest | Modal component | Pre-styled, accessible, built on Radix |

### Not Needed

| Library | Reason to Skip |
|---------|----------------|
| react-images / lightGallery | Overkill for simple prev/next gallery |
| embla-carousel / shadcn carousel | Modal gallery doesn't need swipe physics |
| body-scroll-lock | Radix Dialog handles scroll lock automatically |
| react-focus-lock | Radix Dialog handles focus trap automatically |

**Installation:**
```bash
npx shadcn@latest add dialog
```

This installs the Dialog component and its Radix dependency.

## Architecture Patterns

### Recommended Project Structure (Phase 3 Files)

```
src/
├── app/
│   └── page.tsx                    # Add <Projects /> section
├── components/
│   ├── ui/
│   │   └── dialog.tsx              # shadcn/ui Dialog (auto-generated)
│   └── sections/
│       └── Projects.tsx            # Main projects section
├── data/
│   └── projects.ts                 # TypeScript project data
└── types/
    └── project.ts                  # Project type definitions
```

### Pattern 1: TypeScript Project Data Structure

**What:** Type-safe project data with discriminated union for live vs coming-soon states.

**Why:** Compile-time validation ensures all required fields are present. Different CTAs for live vs coming-soon projects.

**Example:**
```typescript
// src/types/project.ts
export type ProjectStatus = 'live' | 'coming-soon'

interface BaseProject {
  id: string
  title: string
  tagline: string
  thumbnail: string  // Path to card thumbnail
  images: string[]   // Paths to gallery images
  challenge: string
  approach: string
  result: string
  technologies: string[]
}

interface LiveProject extends BaseProject {
  status: 'live'
  url: string  // Required for live projects
  githubUrl?: string
}

interface ComingSoonProject extends BaseProject {
  status: 'coming-soon'
  githubUrl?: string  // Optional GitHub link
  url?: never  // Explicitly disallow live URL
}

export type Project = LiveProject | ComingSoonProject

// Type guard for narrowing
export function isLiveProject(project: Project): project is LiveProject {
  return project.status === 'live'
}
```

```typescript
// src/data/projects.ts
import type { Project } from '@/types/project'

export const projects = [
  {
    id: 'project-alpha',
    title: 'Project Alpha',
    tagline: 'Transformed a manual process into automated workflow',
    thumbnail: '/projects/alpha/thumbnail.jpg',
    images: [
      '/projects/alpha/screenshot-1.jpg',
      '/projects/alpha/screenshot-2.jpg',
      '/projects/alpha/screenshot-3.jpg',
    ],
    status: 'live',
    url: 'https://project-alpha.com',
    githubUrl: 'https://github.com/user/project-alpha',
    challenge: 'The client was spending 10 hours weekly on manual data entry...',
    approach: 'Built a custom dashboard with automated data sync...',
    result: 'Reduced weekly admin time by 85%, saving 8.5 hours per week.',
    technologies: ['Next.js', 'TypeScript', 'Supabase'],
  },
  {
    id: 'project-beta',
    title: 'Project Beta',
    tagline: 'A modern scheduling system for small teams',
    thumbnail: '/projects/beta/thumbnail.jpg',
    images: ['/projects/beta/screenshot-1.jpg'],
    status: 'coming-soon',
    githubUrl: 'https://github.com/user/project-beta',
    challenge: 'Small businesses struggle with off-the-shelf scheduling tools...',
    approach: 'Designing a focused, opinionated scheduling interface...',
    result: 'Currently in development - targeting 50% faster booking flow.',
    technologies: ['React', 'TypeScript', 'Tailwind'],
  },
] as const satisfies readonly Project[]

export type ProjectId = (typeof projects)[number]['id']
```

**Source:** [TypeScript satisfies operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)

### Pattern 2: shadcn/ui Dialog for Project Modal

**What:** Accessible modal using shadcn/ui Dialog with custom content for gallery and case study.

**Why:** Radix primitives handle focus trap, scroll lock, Escape key, ARIA automatically. shadcn provides styled components.

**Example:**
```typescript
// Component structure (client component required for state)
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useState } from 'react'
import type { Project } from '@/types/project'
import { isLiveProject } from '@/types/project'

interface ProjectModalProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-h2 font-serif">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {project.tagline}
          </DialogDescription>
        </DialogHeader>

        {/* Image gallery */}
        <div className="relative aspect-video bg-base-800 rounded-lg overflow-hidden">
          {/* Current image */}
          <Image
            src={project.images[activeImage]}
            alt={`${project.title} screenshot ${activeImage + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />

          {/* Navigation arrows (if multiple images) */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage(prev =>
                  prev === 0 ? project.images.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 -translate-y-1/2 ..."
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => setActiveImage(prev =>
                  prev === project.images.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-4 top-1/2 -translate-y-1/2 ..."
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </>
          )}

          {/* Image indicators */}
          {project.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i === activeImage ? 'bg-amber-400' : 'bg-white/50'
                  )}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Case study narrative */}
        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-h3 font-serif text-amber-400 mb-2">Challenge</h3>
            <p className="text-text-secondary">{project.challenge}</p>
          </div>
          <div>
            <h3 className="text-h3 font-serif text-amber-400 mb-2">Approach</h3>
            <p className="text-text-secondary">{project.approach}</p>
          </div>
          <div>
            <h3 className="text-h3 font-serif text-amber-400 mb-2">Result</h3>
            <p className="text-text-secondary">{project.result}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4 mt-8">
          {isLiveProject(project) ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-base-950 rounded-md font-medium hover:bg-amber-400 transition-colors"
            >
              Visit Project <ExternalLink size={16} />
            </a>
          ) : project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-base-700 text-text-primary rounded-md font-medium hover:bg-base-600 transition-colors"
            >
              View on GitHub <Github size={16} />
            </a>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Key Dialog features (from Radix):**
- `open` / `onOpenChange` for controlled state
- `onEscapeKeyDown` - Escape closes by default
- `onPointerDownOutside` - Click outside closes by default
- `onOpenAutoFocus` - Focus first focusable element
- `onCloseAutoFocus` - Return focus to trigger
- Automatic scroll lock on body
- Automatic focus trap within modal
- ARIA attributes managed automatically

**Source:** [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog), [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)

### Pattern 3: Responsive Project Card Grid

**What:** 2-column grid on tablet, 3-column on desktop, single column on mobile.

**Why:** Matches the Services section pattern, provides good card sizes for screenshots.

**Example:**
```typescript
// Grid container
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  {/* Live projects first, then coming-soon */}
  {[...projects]
    .sort((a, b) => {
      if (a.status === 'live' && b.status === 'coming-soon') return -1
      if (a.status === 'coming-soon' && b.status === 'live') return 1
      return 0
    })
    .map((project) => (
      <ProjectCard key={project.id} project={project} />
    ))
  }
</div>

// Individual card
function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="card-grain bg-base-800 rounded-xl shadow-elevation-sm
                 overflow-hidden cursor-pointer group
                 hover:-translate-y-1 hover:shadow-elevation-md transition-all duration-300"
      onClick={() => openModal(project)}
    >
      {/* Thumbnail with aspect ratio */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Coming soon badge */}
        {project.status === 'coming-soon' && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-base-900/90 text-amber-400 text-small rounded-full">
            Coming Soon
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-6">
        <h3 className="text-h3 font-serif text-text-primary mb-2">
          {project.title}
        </h3>
        <p className="text-body text-text-secondary line-clamp-2">
          {project.tagline}
        </p>
      </div>
    </article>
  )
}
```

**Grid breakpoints:**
- Default (mobile): 1 column
- `sm` (640px+): 2 columns
- `lg` (1024px+): 3 columns

This matches the existing Services section pattern (`grid gap-8 md:grid-cols-3`).

### Pattern 4: Next.js Image Optimization

**What:** Use Next.js Image component with explicit `sizes` prop for responsive optimization.

**Why:** Generates multiple srcset sizes, serves WebP/AVIF, lazy loads by default.

**Example:**
```typescript
// Card thumbnail (responsive based on grid)
<Image
  src={project.thumbnail}
  alt={project.title}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// Modal gallery image (large, up to 896px)
<Image
  src={project.images[activeImage]}
  alt={`${project.title} screenshot ${activeImage + 1}`}
  fill
  className="object-cover"
  sizes="(max-width: 896px) 100vw, 896px"
/>
```

**Next.js 16 specific:**
- `preload={true}` replaces deprecated `priority` for LCP images
- `qualities` config required in next.config.js (already default 75)

**Source:** [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)

### Pattern 5: Coming Soon Badge

**What:** Overlay badge on card thumbnail for coming-soon projects.

**Why:** Clear visual distinction without hiding the project entirely.

**Example:**
```typescript
{project.status === 'coming-soon' && (
  <div className="absolute top-3 right-3 px-3 py-1 bg-base-900/90 backdrop-blur-sm text-amber-400 text-small font-medium rounded-full border border-base-700">
    Coming Soon
  </div>
)}
```

Alternative ribbon style:
```typescript
{project.status === 'coming-soon' && (
  <div className="absolute top-0 right-0 overflow-hidden w-24 h-24">
    <div className="absolute top-3 right-[-35px] rotate-45 bg-amber-500 text-base-950 text-small font-medium py-1 w-32 text-center shadow-sm">
      Coming Soon
    </div>
  </div>
)}
```

**Recommendation:** Use the badge approach - cleaner, more modern, easier to implement.

### Anti-Patterns to Avoid

- **Image paths as strings without type checking:** Define allowed paths in type or use a validation pattern.
- **Carousel for simple gallery:** Embla/swipe physics is overkill when prev/next buttons suffice.
- **Custom focus trap:** Radix handles this. Don't duplicate with react-focus-lock.
- **Custom scroll lock:** Radix handles this. Don't add body-scroll-lock.
- **Fetching projects from API:** Static data file is simpler for a portfolio. No loading states needed.
- **Inline project data in components:** Keep data separate for easy updates.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal accessibility | Custom focus trap + scroll lock + ARIA | shadcn/ui Dialog (Radix) | Battle-tested, handles edge cases |
| Keyboard navigation | Custom key handlers | Radix Dialog built-in | Escape, Tab, focus return handled |
| Image gallery carousel | Complex swipe/physics system | Simple useState + prev/next | Portfolio doesn't need swipe |
| Type-safe data | Manual validation at runtime | TypeScript `satisfies` | Compile-time guarantees |
| Responsive images | Manual srcset generation | Next.js Image `sizes` prop | Automatic optimization |

**Key insight:** The modal is the complex part of this phase. Use shadcn/ui Dialog to handle the accessibility burden, and keep the gallery navigation simple with state.

## Common Pitfalls

### Pitfall 1: Dialog Scroll Lock + Fixed Navigation Conflict

**What goes wrong:** When Dialog opens, body scroll is locked but fixed navigation jumps due to scrollbar disappearing.

**Why it happens:** Radix removes body scrollbar, causing layout shift.

**How to avoid:** Radix Dialog's `preventScroll` already handles scrollbar compensation. If issues persist, add:
```css
body[data-scroll-locked] {
  padding-right: var(--removed-body-scroll-bar-size) !important;
}
```

**Warning signs:** Navigation shifts right when modal opens.

### Pitfall 2: Image Aspect Ratio Issues in Grid

**What goes wrong:** Cards have different heights because screenshots have different aspect ratios.

**Why it happens:** `fill` mode without constrained container allows natural sizing.

**How to avoid:** Wrap Image in a container with fixed aspect ratio:
```typescript
<div className="relative aspect-video">
  <Image src={...} fill className="object-cover" />
</div>
```

`aspect-video` (16:9) works well for screenshots. Use `object-cover` to handle slight variations.

### Pitfall 3: Missing `sizes` Prop Causes Large Downloads

**What goes wrong:** Full-resolution images downloaded even on mobile.

**Why it happens:** Without `sizes`, Next.js assumes 100vw and serves larger images than needed.

**How to avoid:** Always provide `sizes` prop based on actual rendered size:
```typescript
// Card in 3-column grid
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

**Warning signs:** Network tab shows large image files on mobile.

### Pitfall 4: Click on Scrollbar Closes Modal

**What goes wrong:** User scrolling long modal content accidentally closes it by clicking scrollbar.

**Why it happens:** Scrollbar click registers as "outside" the modal content.

**How to avoid:** Add `onPointerDownOutside` handler to prevent closing on scrollbar:
```typescript
<DialogContent
  onPointerDownOutside={(e) => {
    // Prevent close if clicking on scrollbar area
    const target = e.target as HTMLElement
    if (target.closest('[data-radix-scroll-area-viewport]')) {
      e.preventDefault()
    }
  }}
>
```

Or simply ensure modal content doesn't need scrolling (paginate long content).

### Pitfall 5: State Not Reset When Switching Projects

**What goes wrong:** Opening a different project shows the previous project's active image index.

**Why it happens:** Local state persists between modal opens.

**How to avoid:** Reset state when project changes or modal closes:
```typescript
useEffect(() => {
  setActiveImage(0)
}, [project.id])
```

Or key the modal content:
```typescript
<DialogContent key={project.id}>
```

### Pitfall 6: Hardcoded Aspect Ratios Don't Match Actual Screenshots

**What goes wrong:** `object-cover` crops important parts of screenshots.

**Why it happens:** Screenshots taken at various aspect ratios.

**How to avoid:**
1. Standardize screenshot dimensions (e.g., all 16:9)
2. Use `object-contain` with background color for varied ratios
3. Define aspect ratio in project data if truly variable

**Recommendation:** Standardize to 16:9 for consistency.

## Code Examples

### Complete Project Card Component

```typescript
// src/components/sections/ProjectCard.tsx
'use client'

import Image from 'next/image'
import type { Project } from '@/types/project'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <article
      className={cn(
        'card-grain bg-base-800 rounded-xl shadow-elevation-sm overflow-hidden',
        'cursor-pointer group',
        'hover:-translate-y-1 hover:shadow-elevation-md',
        'transition-all duration-300'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={`${project.title} preview`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Coming soon badge */}
        {project.status === 'coming-soon' && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-base-900/90 backdrop-blur-sm text-amber-400 text-small font-medium rounded-full border border-base-700">
            Coming Soon
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-h3 font-serif text-text-primary mb-2 group-hover:text-amber-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-body text-text-secondary line-clamp-2">
          {project.tagline}
        </p>
      </div>
    </article>
  )
}
```

### Complete Projects Section

```typescript
// src/components/sections/Projects.tsx
'use client'

import { useState } from 'react'
import { projects } from '@/data/projects'
import type { Project } from '@/types/project'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Sort: live projects first, then coming-soon
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.status === 'live' && b.status === 'coming-soon') return -1
    if (a.status === 'coming-soon' && b.status === 'live') return 1
    return 0
  })

  return (
    <section id="projects" className="py-[var(--spacing-section)]">
      <div className="mx-auto max-w-6xl px-[var(--container-padding)]">
        {/* Section header */}
        <h2 className="text-h1 font-serif text-text-primary mb-4">
          Recent Work
        </h2>
        <p className="text-body text-text-secondary max-w-2xl mb-12">
          Real projects, real results. Click any project to see the full story.
        </p>

        {/* Project grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={(open) => {
            if (!open) setSelectedProject(null)
          }}
        />
      )}
    </section>
  )
}
```

### shadcn/ui Dialog Customization

After running `npx shadcn@latest add dialog`, customize the generated component:

```typescript
// src/components/ui/dialog.tsx (modifications to generated file)

// Add custom max-width variant for project modals
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: 'default' | 'lg' | 'xl'
  }
>(({ className, children, size = 'default', ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Base styles
        'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%]',
        'gap-4 border border-base-700 bg-base-900 p-6 shadow-lg duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        'sm:rounded-lg',
        // Size variants
        size === 'default' && 'max-w-lg',
        size === 'lg' && 'max-w-2xl',
        size === 'xl' && 'max-w-4xl max-h-[90vh] overflow-y-auto',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-base-900 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-base-800 data-[state=open]:text-text-muted">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom modal with body-scroll-lock | Radix Dialog with built-in scroll lock | 2024+ | Less code, better a11y |
| react-images / PhotoSwipe galleries | Simple state-based prev/next | Always valid | Simpler for portfolios |
| Manual srcset generation | Next.js Image `sizes` prop | Next.js 13+ | Automatic optimization |
| Runtime type validation | TypeScript `satisfies` | TS 4.9+ (2022) | Compile-time safety |
| Separate modal component library | shadcn/ui Dialog | 2023+ | Customizable, tree-shakable |

**Deprecated/outdated:**
- `next/image` `priority` prop - use `preload={true}` in Next.js 16
- Carousel libraries for simple galleries - overkill for prev/next navigation
- CSS-only modals - accessibility issues with focus and screen readers

## Open Questions

### 1. Screenshot Standardization

**What we know:** Screenshots go in `/public/projects/{id}/` folder. Thumbnails and gallery images needed.

**What's unclear:** Exact dimensions and naming conventions.

**Recommendation:**
- Thumbnail: 800x450 (16:9) as `thumbnail.jpg`
- Gallery images: 1600x900 (16:9) as `screenshot-1.jpg`, `screenshot-2.jpg`, etc.
- All JPG for photos, PNG only if transparency needed

### 2. Number of Projects to Display

**What we know:** Need at least one project with quantified outcome per requirements.

**What's unclear:** How many total projects to show initially.

**Recommendation:** 3-6 projects is typical for a portfolio. Start with placeholder data structure for 4 projects (2 live, 2 coming-soon) that can be populated with real content.

### 3. Gallery Image Preloading

**What we know:** Next.js lazy loads images by default. First gallery image visible immediately.

**What's unclear:** Whether to preload next/prev images for smoother navigation.

**Recommendation:** For 3-5 gallery images per project, preloading adds minimal value. Keep default lazy loading. If UX testing shows delays, consider preloading adjacent images.

## Sources

### Primary (HIGH confidence)

- [Radix Dialog Documentation](https://www.radix-ui.com/primitives/docs/components/dialog) - Complete API reference
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog) - Installation and customization
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) - Official documentation
- [TypeScript satisfies operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html) - Official documentation

### Secondary (MEDIUM confidence)

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design) - Grid breakpoints
- [Tailwind CSS Container Queries](https://tailwindcss.com/blog/tailwindcss-v4) - Built-in support in v4

### Tertiary (LOW confidence)

- WebSearch findings on modal best practices - general patterns, validated against official docs

## Metadata

**Confidence breakdown:**
- Dialog/modal implementation: HIGH - Official Radix/shadcn documentation
- TypeScript data patterns: HIGH - Official TypeScript documentation
- Next.js Image: HIGH - Official Next.js documentation
- Grid layout: HIGH - Standard Tailwind utilities used in existing codebase
- Gallery navigation: MEDIUM - Simple pattern, no official guidance needed
- Coming soon badge styling: MEDIUM - Standard approach, final styling needs visual tuning

**Research date:** 2026-02-02
**Valid until:** 2026-03-02 (stable technologies, 30-day validity)

---

## RESEARCH COMPLETE

**Phase:** 3 - Projects
**Confidence:** HIGH

### Key Findings

1. **Modal Implementation:** Use shadcn/ui Dialog (built on Radix) for accessible modals. Handles focus trap, scroll lock, keyboard navigation, and ARIA automatically. No additional libraries needed.

2. **Image Gallery:** Simple prev/next navigation with useState is sufficient for portfolio galleries. Complex carousel libraries (Embla, Swiper) are overkill.

3. **TypeScript Data Structure:** Use discriminated union type (`LiveProject | ComingSoonProject`) with `as const satisfies` pattern for compile-time validation. Keep data in separate file from components.

4. **Responsive Grid:** Use `grid sm:grid-cols-2 lg:grid-cols-3` matching Services section pattern. Fixed aspect ratio (`aspect-video`) ensures consistent card heights.

5. **Next.js Image:** Always provide `sizes` prop based on actual rendered size to avoid downloading oversized images. Use `fill` mode with `object-cover` in aspect-ratio containers.

### File Created

`/Users/lucasalexander/portfolio/.planning/phases/03-projects/03-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | shadcn/ui + Radix is industry standard |
| Modal Implementation | HIGH | Official Radix documentation |
| TypeScript Patterns | HIGH | Official TypeScript documentation |
| Grid Layout | HIGH | Matches existing codebase patterns |
| Image Optimization | HIGH | Official Next.js documentation |

### Open Questions

- Screenshot dimensions and naming conventions - recommendations provided
- Number of projects to display - recommendation: 3-6
- Gallery image preloading - recommendation: use default lazy loading

### Ready for Planning

Research complete. Planner can now create PLAN.md files for Phase 3 tasks.
