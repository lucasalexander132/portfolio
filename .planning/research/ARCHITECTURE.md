# Architecture Research

**Domain:** Single-page portfolio site with orchestrated animations
**Stack:** Next.js 16 App Router, React 19.2, TypeScript, Tailwind CSS 4, shadcn/ui, Motion
**Researched:** 2026-02-02
**Confidence:** HIGH (verified with official docs and recent community patterns)

---

## Page Structure

### Single Page with Sections Architecture

For a single-page portfolio site, the App Router still provides value through its rendering model even without multi-route navigation. The recommended structure:

```
app/
  layout.tsx          # Root layout (html, body, fonts, global providers)
  page.tsx            # Single page orchestrating all sections
  globals.css         # Tailwind imports, custom @theme tokens
```

**Key insight:** Next.js preserves SPA-like behavior within a single page. Scroll position, state, and DOM are maintained. The App Router's strength here is Server Component support for initial render performance, not routing.

### Section Organization

Each major section becomes a self-contained component:

```
components/
  sections/
    HeroSection.tsx       # Intro/landing with orchestrated entrance
    ServicesSection.tsx   # Services/capabilities grid
    ProjectsSection.tsx   # Case studies showcase
    ContactSection.tsx    # Contact form with server action
```

**Why sections as components, not routes:**
- Single scroll context for smooth navigation
- Shared animation orchestration context
- Simpler mental model for single-page site
- Still get Server/Client component benefits

---

## Component Hierarchy

### Layer 1: App Shell (Server)

```tsx
// app/layout.tsx - Server Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={fontClasses}>
        {children}
      </body>
    </html>
  )
}
```

**Responsibility:** HTML structure, fonts, metadata

### Layer 2: Page Orchestrator (Client)

```tsx
// app/page.tsx - imports client orchestrator
import { PageOrchestrator } from '@/components/PageOrchestrator'
import { projects } from '@/data/projects'

export default function HomePage() {
  return <PageOrchestrator projects={projects} />
}
```

**Responsibility:** Pass static data to client orchestrator

### Layer 3: Animation Orchestrator (Client)

```tsx
// components/PageOrchestrator.tsx
'use client'

export function PageOrchestrator({ projects }) {
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <HeroSection />
      <ServicesSection />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </motion.main>
  )
}
```

**Responsibility:**
- Top-level animation orchestration
- Page load sequence coordination
- Variant propagation to children

### Layer 4: Sections (Client)

Each section is a client component that:
1. Receives variants from parent via propagation
2. Defines its own child variants for internal elements
3. Uses `whileInView` for scroll-triggered reveals

```tsx
// components/sections/HeroSection.tsx
'use client'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function HeroSection() {
  return (
    <motion.section variants={sectionVariants}>
      <motion.h1 variants={itemVariants}>...</motion.h1>
      <motion.p variants={itemVariants}>...</motion.p>
    </motion.section>
  )
}
```

### Layer 5: UI Primitives (shadcn/ui)

```
components/
  ui/
    button.tsx        # shadcn button
    card.tsx          # shadcn card (for project cards)
    input.tsx         # shadcn input
    textarea.tsx      # shadcn textarea
    form.tsx          # shadcn form components
```

**Responsibility:** Consistent styling, accessibility, composability

### Complete Hierarchy Diagram

```
RootLayout (Server)
  |
  +-- HomePage (Server - passes data)
        |
        +-- PageOrchestrator (Client - animation root)
              |
              +-- HeroSection (Client)
              |     +-- motion.h1, motion.p (animated elements)
              |
              +-- ServicesSection (Client)
              |     +-- ServiceCard[] (animated cards)
              |
              +-- ProjectsSection (Client)
              |     +-- ProjectCard[] (templated, animated)
              |
              +-- ContactSection (Client)
                    +-- ContactForm (form with server action)
```

---

## Animation Architecture

### Page Load Orchestration Pattern

The key to orchestrated page load is **variant propagation** with **staggered timing**.

#### Step 1: Define Page-Level Variants

```tsx
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",    // Page fades in first
      staggerChildren: 0.15,     // Then sections stagger in
      delayChildren: 0.3         // After initial delay
    }
  }
}
```

#### Step 2: Sections Inherit and Define Children

```tsx
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.08  // Internal elements stagger
    }
  }
}
```

#### Step 3: Elements Use Item Variants

```tsx
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}
```

**Critical:** Child components must NOT have their own `animate` prop if they want to inherit parent's variant propagation. Only the top-level orchestrator defines `animate="visible"`.

### Scroll-Based Section Reveals

For sections below the fold, use `whileInView` instead of inherited variants:

```tsx
export function ServicesSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      {/* Children inherit and stagger */}
    </motion.section>
  )
}
```

**Configuration options:**
- `viewport.once: true` - Animate only on first view (recommended)
- `viewport.margin: "-100px"` - Trigger 100px before entering viewport
- `viewport.amount: 0.3` - Trigger when 30% visible

### Alternative: react-intersection-observer + Motion

For more control over viewport detection:

```tsx
import { useInView } from 'react-intersection-observer'

export function ProjectsSection({ projects }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={sectionVariants}
    >
      {/* Content */}
    </motion.section>
  )
}
```

**When to use which:**
- `whileInView`: Simpler, sufficient for most cases
- `react-intersection-observer`: When you need the `inView` boolean for conditional logic beyond animation

### Animation Sequence Timeline

```
T=0ms     Page load, orchestrator mounts
T=0ms     Page container: hidden -> visible (fade)
T=300ms   Hero section starts (delayChildren)
T=300ms   Hero H1 animates
T=380ms   Hero subtitle animates
T=450ms   Services section starts (staggerChildren)
...
T=scroll  Below-fold sections trigger on viewport entry
```

---

## Data Layer

### Project Case Studies Data Structure

For templated, extensible case studies, use TypeScript types with a data file:

```tsx
// types/project.ts
export interface Project {
  id: string
  slug: string
  title: string
  client: string
  category: 'web' | 'mobile' | 'branding' | 'consulting'
  description: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  thumbnail: string
  images: string[]
  featured: boolean
  order: number
}
```

```tsx
// data/projects.ts
import { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: '1',
    slug: 'project-alpha',
    title: 'Project Alpha',
    client: 'Client Name',
    category: 'web',
    description: 'Brief description...',
    challenge: 'The challenge was...',
    solution: 'We solved this by...',
    results: ['50% faster load times', '2x conversion'],
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
    thumbnail: '/projects/alpha/thumb.jpg',
    images: ['/projects/alpha/1.jpg', '/projects/alpha/2.jpg'],
    featured: true,
    order: 1
  },
  // More projects...
]

export function getFeaturedProjects(): Project[] {
  return projects
    .filter(p => p.featured)
    .sort((a, b) => a.order - b.order)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug)
}
```

**Why TypeScript data file over MDX for this use case:**
- Single-page site doesn't need individual project routes
- Stronger typing for template consistency
- Simpler mental model
- No MDX compilation overhead
- Easy to add new projects (just add to array)

### Data Flow Diagram

```
data/projects.ts (static, typed)
        |
        v
app/page.tsx (Server Component reads data)
        |
        v
PageOrchestrator (receives projects as prop)
        |
        v
ProjectsSection (receives projects as prop)
        |
        v
ProjectCard[] (maps over projects, renders each)
```

### Contact Form Data Flow

```
ContactForm (Client Component)
        |
        | FormData via action
        v
actions/contact.ts (Server Action)
        |
        | Validates with Zod
        | Sends email (Resend/other)
        |
        v
Returns { success: boolean, error?: string }
        |
        v
ContactForm updates UI state
```

```tsx
// actions/contact.ts
'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short')
})

export async function submitContact(formData: FormData) {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  }

  const result = contactSchema.safeParse(raw)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors
    }
  }

  // Send email via Resend, SendGrid, etc.
  try {
    // await sendEmail(result.data)
    return { success: true }
  } catch (e) {
    return { success: false, error: 'Failed to send message' }
  }
}
```

---

## Component Boundaries

### Server vs Client Boundary

| Component | Boundary | Reason |
|-----------|----------|--------|
| RootLayout | Server | Static HTML structure |
| page.tsx | Server | Data fetching, SEO |
| PageOrchestrator | Client | Animation state |
| All Sections | Client | Animation, interactivity |
| UI Primitives | Client | Event handlers |
| Server Actions | Server | Form processing |

**Rule of thumb:** Animation = Client. Static content could be Server, but since all sections animate, they're all Client Components.

### Communication Patterns

**Parent to Child (Props):**
- PageOrchestrator -> Sections: variant propagation, data
- Sections -> Cards: individual item data

**Child to Parent (Callbacks):**
- Not needed for this architecture
- Contact form uses server action, not parent callback

**Server to Client:**
- app/page.tsx passes pre-fetched data to PageOrchestrator

**Client to Server:**
- ContactForm invokes submitContact server action

---

## Templated Project Cards

### ProjectCard Component Pattern

```tsx
// components/ProjectCard.tsx
'use client'

import { Project } from '@/types/project'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'motion/react'

interface ProjectCardProps {
  project: Project
  index: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div variants={cardVariants}>
      <Card className="group overflow-hidden">
        <div className="relative aspect-video">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="object-cover transition-transform group-hover:scale-105"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center h-full">
              <span className="text-white font-medium">View Project</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">{project.client}</p>
          <h3 className="font-semibold mt-1">{project.title}</h3>
          <p className="text-sm mt-2 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {project.technologies.slice(0, 3).map(tech => (
              <span
                key={tech}
                className="text-xs px-2 py-0.5 bg-muted rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

**Template extensibility:** Adding a new project requires only adding an entry to `data/projects.ts`. The component handles rendering consistently.

### Project Detail Modal (Optional Enhancement)

If project details should expand without page navigation:

```tsx
// components/ProjectModal.tsx
'use client'

import { Project } from '@/types/project'
import { AnimatePresence, motion } from 'motion/react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <Dialog open={!!project} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {/* Full case study content */}
              <h2>{project.title}</h2>
              <section>
                <h3>Challenge</h3>
                <p>{project.challenge}</p>
              </section>
              <section>
                <h3>Solution</h3>
                <p>{project.solution}</p>
              </section>
              <section>
                <h3>Results</h3>
                <ul>
                  {project.results.map((result, i) => (
                    <li key={i}>{result}</li>
                  ))}
                </ul>
              </section>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
```

---

## Build Order

### Phase Dependencies

```
1. Foundation (no dependencies)
   - TypeScript types
   - Tailwind configuration
   - shadcn/ui setup

2. Data Layer (depends on types)
   - Project type definition
   - projects.ts data file
   - Contact form schema

3. UI Primitives (depends on Tailwind/shadcn)
   - Button, Card, Input, Textarea, Form
   - Custom variants/styling

4. Animation System (depends on UI primitives)
   - Variant definitions
   - PageOrchestrator shell

5. Static Sections (depends on animation system)
   - HeroSection
   - ServicesSection

6. Data-Driven Sections (depends on data layer + animation)
   - ProjectCard template
   - ProjectsSection

7. Interactive Features (depends on sections)
   - ContactForm + server action
   - Project modal (if implementing)

8. Polish (depends on all above)
   - Fine-tune animation timing
   - Atmospheric effects
   - Responsive adjustments
```

### Recommended Build Sequence

| Order | What | Why First |
|-------|------|-----------|
| 1 | TypeScript types + data file | Defines contract for all components |
| 2 | Tailwind theme + shadcn setup | Foundation for all styling |
| 3 | Root layout + page shell | Establishes app structure |
| 4 | PageOrchestrator (empty) | Animation context for sections |
| 5 | HeroSection (static) | Most visible, validates animation pattern |
| 6 | Animation refinement | Tune timing before more sections |
| 7 | ServicesSection | Second section, reinforces pattern |
| 8 | ProjectCard template | Reusable pattern for projects |
| 9 | ProjectsSection | Combines cards with scroll-trigger |
| 10 | Contact server action | Backend before form |
| 11 | ContactSection + form | Complete form with validation |
| 12 | Polish pass | Timing, effects, responsive |

### Critical Path

```
Types -> Data -> ProjectCard -> ProjectsSection
                      |
Types -> Server Action -> ContactForm -> ContactSection
                      |
shadcn setup -> UI primitives -> All sections
                      |
Tailwind theme -> PageOrchestrator -> Section animations
```

---

## File Structure Recommendation

```
portfolio/
├── app/
│   ├── layout.tsx           # Root layout (Server)
│   ├── page.tsx             # Home page (Server, imports orchestrator)
│   ├── globals.css          # Tailwind + custom theme
│   └── actions/
│       └── contact.ts       # Contact form server action
├── components/
│   ├── PageOrchestrator.tsx # Animation orchestrator (Client)
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ContactSection.tsx
│   ├── ProjectCard.tsx      # Templated project card
│   ├── ContactForm.tsx      # Form component
│   └── ui/                  # shadcn components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── ...
├── data/
│   └── projects.ts          # Static project data
├── types/
│   └── project.ts           # Project type definition
├── lib/
│   ├── utils.ts             # cn() and utilities
│   └── animations.ts        # Shared variant definitions
└── public/
    └── projects/            # Project images
        ├── alpha/
        └── beta/
```

---

## Anti-Patterns to Avoid

### 1. Mixing Animate Props with Variant Propagation

**Wrong:**
```tsx
<motion.div animate="visible" variants={parentVariants}>
  <motion.div animate="visible" variants={childVariants}> {/* Breaks propagation */}
```

**Right:**
```tsx
<motion.div initial="hidden" animate="visible" variants={parentVariants}>
  <motion.div variants={childVariants}> {/* Inherits from parent */}
```

### 2. Server Components with Animation

**Wrong:**
```tsx
// This won't work - motion needs client
export default function HeroSection() {
  return <motion.div>...</motion.div>
}
```

**Right:**
```tsx
'use client'
export function HeroSection() {
  return <motion.div>...</motion.div>
}
```

### 3. Over-animating

**Wrong:** Every element animates independently with complex transitions

**Right:** Orchestrated, purposeful animations with clear hierarchy

### 4. Data in Client Components

**Wrong:**
```tsx
'use client'
export function ProjectsSection() {
  const projects = await fetch(...) // Can't await in client
}
```

**Right:**
```tsx
// page.tsx (server)
const projects = getProjects()
return <ProjectsSection projects={projects} />
```

---

## Sources

**Next.js App Router Architecture:**
- [Next.js App Router Advanced Patterns 2026](https://medium.com/@beenakumawat002/next-js-app-router-advanced-patterns-for-2026-server-actions-ppr-streaming-edge-first-b76b1b3dcac7)
- [Next.js Architecture in 2026](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router)
- [Modular Architecture for Next.js 16](https://dev.to/ramacan/modular-architecture-example-for-nextjs-16-1nln)

**Motion Animation Patterns:**
- [Motion Official Documentation](https://motion.dev/docs/react-animation)
- [Motion Stagger Documentation](https://motion.dev/docs/stagger)
- [Advanced Framer Motion Patterns](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/)
- [Variants Animation Propagation](https://framerbook.com/animation/example-animations/27-variants-animation-propagation/)

**Scroll-Based Animations:**
- [react-intersection-observer NPM](https://www.npmjs.com/package/react-intersection-observer)
- [React Intersection Observer with Next.js](https://medium.com/@franciscomoretti/react-intersection-observer-with-tailwind-and-next-js-ad68aa847b21)
- [Motion inView Documentation](https://motion.dev/docs/inview)

**Server Actions & Forms:**
- [Next.js Forms Guide](https://nextjs.org/docs/app/guides/forms)
- [Forms with Server Actions and Zod](https://www.freecodecamp.org/news/handling-forms-nextjs-server-actions-zod/)
- [Robin Wieruch Next.js Forms Guide](https://www.robinwieruch.de/next-forms/)

**shadcn/ui Patterns:**
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [shadcn/ui Ecosystem 2025](https://www.devkit.best/blog/mdx/shadcn-ui-ecosystem-complete-guide-2025)

**Tailwind CSS 4:**
- [Tailwind CSS 4 Best Practices](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [Tailwind CSS v4 Ultimate Guide](https://walidezzat.hashnode.dev/tailwind-css-v4-complete-guide)
