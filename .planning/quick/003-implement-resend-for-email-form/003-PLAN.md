---
phase: quick
plan: 003
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - src/app/api/contact/route.ts
  - src/components/layout/ContactForm.tsx
  - .env.local
autonomous: true
user_setup:
  - service: resend
    why: "Email delivery for contact form"
    env_vars:
      - name: RESEND_API_KEY
        source: "Resend Dashboard -> API Keys -> Create API Key"
      - name: CONTACT_EMAIL
        source: "Your email address to receive contact form submissions"
    dashboard_config:
      - task: "Verify domain (optional) or use onboarding@resend.dev for testing"
        location: "Resend Dashboard -> Domains"

must_haves:
  truths:
    - "Form submission sends email via Resend API"
    - "User sees loading state while sending"
    - "User sees success message after sending"
    - "User sees error message if sending fails"
  artifacts:
    - path: "src/app/api/contact/route.ts"
      provides: "POST endpoint for contact form"
      exports: ["POST"]
    - path: "src/components/layout/ContactForm.tsx"
      provides: "Updated form with API integration"
      contains: "fetch.*api/contact"
  key_links:
    - from: "src/components/layout/ContactForm.tsx"
      to: "/api/contact"
      via: "fetch POST on form submit"
      pattern: "fetch.*api/contact"
    - from: "src/app/api/contact/route.ts"
      to: "resend.emails.send"
      via: "Resend SDK"
      pattern: "resend\\.emails\\.send"
---

<objective>
Implement Resend email delivery for the contact form so form submissions are sent to your inbox.

Purpose: Currently the form just logs to console. This connects it to real email delivery.
Output: Working email flow - user submits form, you receive email.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/layout/ContactForm.tsx
@package.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install Resend and create API route</name>
  <files>package.json, src/app/api/contact/route.ts</files>
  <action>
1. Install Resend SDK: `npm install resend`

2. Create `src/app/api/contact/route.ts` with:
   - Import Resend from 'resend'
   - Initialize with `process.env.RESEND_API_KEY`
   - POST handler that:
     - Parses JSON body (name, email, message)
     - Validates required fields (return 400 if missing)
     - Calls `resend.emails.send()` with:
       - from: 'Contact Form <onboarding@resend.dev>' (or verified domain later)
       - to: process.env.CONTACT_EMAIL
       - subject: `Portfolio Contact: ${name}`
       - html: formatted email with name, email (as reply-to), message
       - replyTo: the sender's email
     - Returns 200 on success, 500 on error with message
   - Use Next.js App Router route handler pattern (export async function POST)

3. Create `.env.local` with placeholder comments for:
   - RESEND_API_KEY=your_api_key_here
   - CONTACT_EMAIL=your_email@example.com
  </action>
  <verify>Check file exists: `ls src/app/api/contact/route.ts` and `grep "resend" package.json`</verify>
  <done>API route exists with Resend integration, resend package in dependencies</done>
</task>

<task type="auto">
  <name>Task 2: Update ContactForm with API call and states</name>
  <files>src/components/layout/ContactForm.tsx</files>
  <action>
Update ContactForm.tsx:

1. Add state for submission status:
   - `isSubmitting: boolean` (loading state)
   - `submitStatus: 'idle' | 'success' | 'error'`
   - `errorMessage: string` (for error display)

2. Update handleSubmit:
   - Replace console.log with fetch POST to '/api/contact'
   - Set isSubmitting true before fetch, false after
   - On success (200): set submitStatus to 'success', clear form, close modal after 2s delay
   - On error: set submitStatus to 'error', parse error message from response

3. Update submit button:
   - Disable when isSubmitting
   - Show "Sending..." text when isSubmitting
   - Keep neo-brutal styling, just change text and add disabled state

4. Add status feedback:
   - Success: Brief "Sent!" message below button (green text, can auto-dismiss)
   - Error: Red text below button showing error message
   - Use existing neo-brutal aesthetic (font-mono, bold colors)

Keep all existing shake animations, cursor interactions, and styling intact.
  </action>
  <verify>TypeScript compiles: `npx tsc --noEmit src/components/layout/ContactForm.tsx 2>&1 | head -20`</verify>
  <done>Form shows loading/success/error states and calls API endpoint</done>
</task>

</tasks>

<verification>
- `npm run build` completes without errors
- API route file exists at correct path
- ContactForm includes fetch to /api/contact
- Form has loading, success, and error UI states
</verification>

<success_criteria>
- Resend SDK installed in package.json
- API route handles POST with validation and Resend call
- ContactForm shows loading spinner/text during submission
- Success state shows confirmation before closing
- Error state displays message to user
- All existing animations and styling preserved
</success_criteria>

<output>
After completion, create `.planning/quick/003-implement-resend-for-email-form/003-SUMMARY.md`
</output>
