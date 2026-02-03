---
phase: quick
plan: 001
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/layout/Navigation.tsx
  - src/components/layout/ContactForm.tsx
autonomous: true

must_haves:
  truths:
    - "Clicking contact button opens form panel"
    - "Nav slides up to top of viewport when form opens"
    - "Form slides in from underneath nav"
    - "User can close form with X button"
    - "User can submit form (logs to console for now)"
  artifacts:
    - path: "src/components/layout/ContactForm.tsx"
      provides: "Slide-in contact form component"
    - path: "src/components/layout/Navigation.tsx"
      provides: "Updated nav with form state and position animation"
  key_links:
    - from: "Navigation.tsx"
      to: "ContactForm.tsx"
      via: "isFormOpen state prop"
---

<objective>
Create a slide-in contact form that appears when clicking the nav's contact button (email icon).

Purpose: Allow visitors to reach out without navigating away from current content.
Output: Working contact form with smooth animations using Motion library.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/components/layout/Navigation.tsx
@src/lib/motion.ts

Key patterns established:
- Motion library (m component, springSnappy/springSubtle transitions)
- Custom cursor integration (setCursorVariant, resetCursor)
- Dark mode design with amber accent colors
- Nav currently fixed at bottom-10, centered
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add shadcn/ui input, textarea, and label components</name>
  <files>src/components/ui/input.tsx, src/components/ui/textarea.tsx, src/components/ui/label.tsx</files>
  <action>
Run npx shadcn@latest add input textarea label to install form components.

These are needed for the contact form fields (name, email, message).
  </action>
  <verify>Files exist in src/components/ui/ directory</verify>
  <done>Input, Textarea, and Label components available for import</done>
</task>

<task type="auto">
  <name>Task 2: Create ContactForm component with slide-in animation</name>
  <files>src/components/layout/ContactForm.tsx</files>
  <action>
Create a new ContactForm component that:

1. Accepts props: isOpen (boolean), onClose (function)

2. Structure:
   - Container positioned fixed, full width, below the nav
   - When isOpen: slides down from y: -100% to y: 0
   - Contains form with fields: Name (input), Email (input), Message (textarea)
   - Submit button (amber bg, matches nav style)
   - Close button (X icon) in top-right corner

3. Animation using Motion:
   - Use AnimatePresence for mount/unmount
   - m.div with initial={{ y: '-100%', opacity: 0 }}
   - animate={{ y: 0, opacity: 1 }}
   - exit={{ y: '-100%', opacity: 0 }}
   - Use springSnappy transition from @/lib/motion

4. Styling:
   - bg-base-900/95 backdrop-blur-md (matches nav style)
   - border-b border-base-700/30
   - Container max-w-md mx-auto for centered form
   - Proper padding (py-8 px-6)
   - Form fields with dark theme styling

5. Form behavior:
   - onSubmit: preventDefault, log form data to console, call onClose
   - Close button: calls onClose
   - Integrate with custom cursor on interactive elements

Import: m, AnimatePresence from 'motion/react', springSnappy from '@/lib/motion', useCursor from cursor context, X icon from lucide-react, Button from ui/button, Input, Textarea, Label from ui components.
  </action>
  <verify>Component file exists with proper exports</verify>
  <done>ContactForm component renders form with slide animation</done>
</task>

<task type="auto">
  <name>Task 3: Update Navigation with form state and position animation</name>
  <files>src/components/layout/Navigation.tsx</files>
  <action>
Update Navigation component to:

1. Add state: const [isFormOpen, setIsFormOpen] = useState(false)

2. Wrap entire nav in m.nav with animated position:
   - When isFormOpen is false: bottom: 40px (current bottom-10)
   - When isFormOpen is true: top: 0, bottom: 'auto'
   - Use springSnappy transition
   - Keep fixed positioning and z-50

3. Update contact button onClick:
   - Instead of scrolling to #contact, toggle: setIsFormOpen(true)
   - Keep the whileTap animation and cursor integration

4. Render ContactForm component:
   - Import ContactForm from './ContactForm'
   - Render below the nav: <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
   - Position it correctly (fixed, top offset by nav height ~60px)

5. Add close on Escape key:
   - useEffect to listen for Escape key when isFormOpen is true
   - Cleanup listener on unmount

The nav should smoothly animate from bottom to top when form opens, and the form slides in underneath it.
  </action>
  <verify>npm run build passes without errors</verify>
  <done>Clicking contact icon opens form, nav animates to top, form slides in, can close with X or Escape</done>
</task>

</tasks>

<verification>
- Build passes: `npm run build`
- Nav displays at bottom of viewport by default
- Clicking email icon: nav animates to top, form slides in below
- Form has name, email, message fields
- Submit logs data and closes form
- X button closes form
- Escape key closes form
- Nav animates back to bottom when form closes
</verification>

<success_criteria>
- Contact form slides in smoothly when contact button clicked
- Nav animates from bottom to top of viewport
- Form can be closed via X button, Escape, or after submit
- All animations use established spring transitions
- Custom cursor integration maintained
</success_criteria>

<output>
After completion, create `.planning/quick/001-slide-in-contact-form-from-nav-bar/001-SUMMARY.md`
</output>
