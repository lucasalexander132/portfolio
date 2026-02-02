# Stack Research: Civix Solutions Portfolio

**Project:** Boutique frontend consultancy portfolio website
**Researched:** 2026-02-02
**Overall Confidence:** HIGH

---

## Core Stack (Already Decided)

The following are fixed decisions. Research confirms these are current and well-suited:

| Technology | Version | Status | Notes |
|------------|---------|--------|-------|
| Next.js | 16.1+ | Current (Dec 2025) | Turbopack default, proxy.ts replaces middleware |
| React | 19.2 | Current | Native form actions, useActionState |
| TypeScript | 5.x | Current | Standard for type safety |
| Tailwind CSS | 4.x | Current (Jan 2025) | CSS-first config, 5x faster builds |
| shadcn/ui | Latest | Current | Now supports Radix or Base UI, 5 visual styles |
| Motion | 12.x | Current | Formerly Framer Motion, MIT licensed |

**Sources:**
- [Next.js 16.1 Release](https://nextjs.org/blog/next-16-1) - December 2025
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4) - January 2025
- [Motion npm](https://www.npmjs.com/package/motion) - v12.26.2

---

## Typography

### Recommendation: Inter + Instrument Serif

**Confidence:** HIGH

| Role | Font | Why |
|------|------|-----|
| **Body/UI** | Inter | Variable font, designed for screens, excellent legibility at all sizes |
| **Headings** | Instrument Serif | Modern editorial feel, pairs well with geometric sans |

**Alternative Pairing:** DM Sans + Playfair Display
- DM Sans: Slightly rounded, friendly, excellent small-size readability
- Playfair Display: High-contrast serif for elegant headlines

### Implementation with next/font

```typescript
// app/fonts.ts
import { Inter, Instrument_Serif } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})
```

```css
/* tailwind.config.css or global CSS */
@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-serif), ui-serif, Georgia, serif;
}
```

### Why Variable Fonts

- **Performance:** Single file, multiple weights (fewer HTTP requests)
- **Flexibility:** Smooth weight transitions possible
- **Core Web Vitals:** `next/font` eliminates layout shift with `size-adjust`

**Sources:**
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- [Pangram Pangram Font Pairings 2025](https://pangrampangram.com/blogs/journal/best-font-pairings-2025)
- [Best Google Fonts 2025](https://www.tbhcreative.com/blog/new-google-fonts-typefaces-2025/)

---

## Animation

### Recommendation: Motion (v12.x)

**Confidence:** HIGH

Motion (formerly Framer Motion) is the correct choice for orchestrated page-load animations.

```bash
npm install motion
```

### Orchestration Pattern for Page Load

Use **variants** with `staggerChildren` and `delayChildren` for coordinated reveals:

```typescript
// Orchestrated page reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
}
```

```tsx
<motion.main
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <motion.h1 variants={itemVariants}>Welcome</motion.h1>
  <motion.p variants={itemVariants}>Intro text</motion.p>
  <motion.div variants={itemVariants}>CTA</motion.div>
</motion.main>
```

### Scroll-Triggered Reveals

Use `whileInView` with `viewport` for section reveals:

```tsx
<motion.section
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
>
  {/* Section content */}
</motion.section>
```

### Bundle Optimization

Use `LazyMotion` to reduce initial bundle from ~34KB to ~6KB:

```tsx
import { LazyMotion, domAnimation, m } from 'motion/react'

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div animate={{ opacity: 1 }} />
    </LazyMotion>
  )
}
```

**Sources:**
- [Motion Documentation](https://motion.dev/docs/react)
- [Motion Stagger](https://motion.dev/docs/stagger)
- [Motion Variants Tutorial](https://motion.dev/tutorials/react-variants)

---

## Forms (Contact Form)

### Recommendation: React Hook Form + Zod + Server Actions + Resend

**Confidence:** HIGH

This is the standard 2025 stack for Next.js forms with email delivery.

| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | 7.71.x | Form state management, minimal re-renders |
| zod | 4.3.x | Schema validation, TypeScript inference |
| @hookform/resolvers | Latest | Connects RHF to Zod |
| resend | Latest | Email API for transactional email |

```bash
npm install react-hook-form zod @hookform/resolvers resend
```

### Why This Stack Over Native React 19 Forms

React 19 introduced `useActionState` and `useFormStatus` for native form handling. However, **React Hook Form + Zod remains superior** for:

1. **Client-side validation UX:** Instant field-level feedback before submission
2. **Complex validation:** Cross-field validation, conditional rules
3. **Performance:** Uncontrolled components = fewer re-renders
4. **shadcn/ui integration:** Form components designed for RHF

For a contact form, native React 19 forms work fine. But RHF + Zod provides better UX for field validation.

### Implementation Pattern

```typescript
// lib/schemas/contact.ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>
```

```typescript
// app/actions/contact.ts
'use server'

import { Resend } from 'resend'
import { contactSchema } from '@/lib/schemas/contact'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return { error: 'Invalid form data' }
  }

  await resend.emails.send({
    from: 'contact@civix.dev',
    to: 'hello@civix.dev',
    subject: `New inquiry from ${parsed.data.name}`,
    text: parsed.data.message,
  })

  return { success: true }
}
```

### Why Resend

- **Developer-first:** Simple API, React Email for templates
- **Reliability:** Built for transactional email
- **Free tier:** 100 emails/day, sufficient for contact forms
- **Next.js integration:** First-class Server Action support

**Sources:**
- [React Hook Form npm](https://www.npmjs.com/package/react-hook-form) - v7.71.1
- [Zod v4 Release](https://www.infoq.com/news/2025/08/zod-v4-available/)
- [Resend + Next.js](https://resend.com/docs/send-with-nextjs)
- [RHF + Zod Guide 2026](https://dev.to/marufrahmanlive/react-hook-form-with-zod-complete-guide-for-2026-1em1)

---

## Complementary Tools

### Icons: Lucide React

**Confidence:** HIGH

shadcn/ui uses Lucide icons by default. Stick with it for consistency.

```bash
npm install lucide-react
```

### Class Merging: clsx + tailwind-merge

**Confidence:** HIGH

Already included with shadcn/ui. Essential for conditional Tailwind classes.

```bash
npm install clsx tailwind-merge
```

```typescript
// lib/utils.ts (shadcn default)
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### SEO & Metadata: Next.js Built-in

**Confidence:** HIGH

Use Next.js 16's built-in Metadata API. No additional library needed.

```typescript
// app/layout.tsx
export const metadata = {
  title: 'Civix Solutions | Frontend Development for Small Business',
  description: 'Boutique frontend consultancy...',
  openGraph: { ... },
}
```

### Analytics (Optional): Vercel Analytics or Plausible

**Confidence:** MEDIUM (depends on requirements)

- **Vercel Analytics:** Zero-config if deploying to Vercel
- **Plausible:** Privacy-focused, lightweight alternative

---

## NOT Recommended

### Avoid: Formik

**Why:** Heavier bundle, more re-renders, less active development compared to React Hook Form. RHF is the current standard.

### Avoid: Yup (for validation)

**Why:** Zod v4 is faster (14x string parsing), has better TypeScript inference, and is now the ecosystem standard with shadcn/ui.

### Avoid: GSAP (for this project)

**Why:** Overkill for portfolio animations. Motion provides sufficient orchestration with smaller bundle and simpler API. GSAP is better for complex scroll-driven narratives or timeline-heavy animations.

### Avoid: Anime.js

**Why:** Lower-level API, requires more code for same results. Motion's declarative approach is better for React component-based architecture.

### Avoid: @next/font (deprecated import)

**Why:** Use `next/font/google` or `next/font/local` directly. The `@next/font` package is deprecated.

### Avoid: CSS Modules (for this project)

**Why:** Tailwind CSS 4 provides all styling needs. CSS Modules add complexity without benefit for a component library (shadcn/ui) project.

### Avoid: styled-components / Emotion

**Why:** Runtime CSS-in-JS has performance overhead. Tailwind CSS 4 is zero-runtime and 5x faster builds.

### Avoid: EmailJS

**Why:** Client-side email sending exposes API keys. Server Actions + Resend is more secure and professional.

### Avoid: Nodemailer (directly)

**Why:** Requires SMTP configuration and maintenance. Resend abstracts this with better DX and reliability.

---

## Complete Installation Commands

```bash
# Core (already decided)
npx create-next-app@latest civix-portfolio --typescript --tailwind --app

# shadcn/ui initialization
npx shadcn@latest init

# Animation
npm install motion

# Forms
npm install react-hook-form zod @hookform/resolvers

# Email
npm install resend

# Icons (included with shadcn, but explicit)
npm install lucide-react

# Utilities (included with shadcn)
npm install clsx tailwind-merge
```

---

## Version Summary

| Package | Recommended Version | Verified Date |
|---------|---------------------|---------------|
| next | 16.1.x | 2026-02-02 |
| react | 19.2.x | 2026-02-02 |
| tailwindcss | 4.x | 2026-02-02 |
| motion | 12.26.x | 2026-02-02 |
| react-hook-form | 7.71.x | 2026-02-02 |
| zod | 4.3.x | 2026-02-02 |
| resend | latest | 2026-02-02 |
| lucide-react | latest | 2026-02-02 |

---

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| Core Stack | HIGH | Official releases verified, current versions |
| Typography | HIGH | next/font + variable fonts is documented best practice |
| Animation | HIGH | Motion is mature, well-documented, MIT licensed |
| Forms | HIGH | RHF + Zod + Resend is industry standard stack |
| Complementary | HIGH | All tools are shadcn/ui defaults or official Next.js |
| Anti-recommendations | HIGH | Based on bundle size, performance, ecosystem trends |
