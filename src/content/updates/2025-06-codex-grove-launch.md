---
title: "Codex Grove Launches in Beta"
date: "2025-06"
tag: "project-launch"
summary: "After months of development, Codex Grove enters public beta with AI-powered documentation and Kanban task management."
link:
  url: "https://codexgrove.io"
  label: "Codex Grove Beta"
---

Codex Grove started as a side project born out of frustration. I was juggling documentation across Notion, Google Docs, and scattered markdown files, and none of it talked to each other. The idea was simple: what if your docs could understand your codebase, and your task board could understand your docs?

That question turned into months of late nights and weekends — and eventually, a product I'm proud to share.

## The Problem With Fragmented Docs

Every developer knows the pain. Your README says one thing, your Confluence page says another, and the actual code tells a third story entirely. Documentation rots faster than the food in your fridge.

> The best documentation is the kind that writes itself — or at least, the kind that knows when it's wrong.

Codex Grove approaches this differently. Instead of treating docs as a separate artifact that lives alongside your code, it treats documentation as a living layer directly connected to your repository. Think of it like Git for your knowledge base — every doc knows which files it references, and alerts you when those files change.

### Core Features at Launch

I had to be ruthless about scope. Early prototypes had real-time collaboration, a plugin system, and an AI chat interface. I shipped with none of those. Here's what made the cut:

- AI-assisted documentation generation — point it at a module, get a draft in seconds
- Kanban task board linked directly to files and docs in your project
- Staleness detection that flags docs when referenced source files change
- Markdown-first editing with live preview and syntax highlighting

## Under the Hood

The tech stack is intentionally boring where it should be and interesting where it counts. Here's the quick rundown:

1. Next.js 16 with App Router for the frontend and API layer
2. PostgreSQL with Prisma ORM for structured data
3. Claude API for document generation and intelligent suggestions
4. TipTap editor with custom extensions for the writing experience

The AI integration was the trickiest piece. I needed the generated docs to sound like they were written by a human who actually understood the code — not a chatbot regurgitating JSDoc comments:

```typescript
async function generateDocs(modulePath: string) {
  const context = await parseModule(modulePath);
  const linked = await resolveImports(context);

  // The secret sauce: feed both code AND
  // existing docs for consistent voice
  const draft = await ai.generate({
    code: linked.source,
    existingDocs: linked.docs,
    tone: 'conversational',
  });
  return draft;
}
```

The `tone: 'conversational'` parameter is doing more heavy lifting than you'd think. Without it, the output reads like auto-generated API reference. With it, you get docs that actually explain why something exists, not just what it does.

## What the Dashboard Looks Like

Here's a screenshot of the main workspace view. The left panel is your doc tree, the center is the editor, and the right sidebar shows linked tasks and staleness alerts:

![The Codex Grove workspace with doc tree, editor, and task sidebar.](/civix-homepage-full.png)

---

## Lessons From Shipping Early

Going public with a beta still feels vulnerable. There are rough edges I can see from a mile away, and I know users will find ones I missed. But the feedback loop is already teaching me more than another month of solo development ever could.

If you want to try it out, run `npx codex-grove init` in any project.

### What's Next

The roadmap is shaped entirely by beta feedback. So far the top requests are real-time collaboration (it's coming, I promise), GitHub integration for automatic doc updates on PR merge, and a VS Code extension. Follow along on the project page or check the changelog.

> Scope discipline is hard, but shipping something real is better than perfecting something imaginary.
