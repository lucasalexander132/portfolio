---
title: "The Design-to-Code Gap (and How I'm Closing It With AI)"
date: "2026-02"
tag: "design-thinking"
summary: "How a randomly recommended YouTube video, a transcription app, and a lot of iteration led me to a workflow where mockups actually stay in sync with the code."
link:
  url: "https://pencil.dev"
  label: "Pencil"
---

I found [Pencil](https://pencil.dev) from a YouTube channel I'd never heard of, randomly recommended on a Sunday. Watched about ten minutes, thought it was interesting, and immediately dropped it into VSCode to try it out on an audio transcription app I was working on.

That experiment turned into the workflow I now use for everything.

## The First Experiment

The transcription app needed real mockups. Not wireframes — actual screens with the right colours, layouts, and component structure. I started chatting with Claude Code inside VSCode with the Pencil file open, going back and forth about what a transcription app would actually need: what happens when audio is processing, how you show a transcript that's still being generated, what the settings panel looks like.

Claude generated a bunch of screens. They were a good starting point — the colour scheme was right, the layouts made sense, the general feel was there. But they were inconsistent with each other. Headers looked different across screens. Navigation icons weren't reused. Spacing was arbitrary.

So I'd get it to correct the inconsistencies. And since I have Figma skills, I'd just drop in and fix any alignment or spacing issues that were faster to fix by hand than to describe in words. Pretty soon I had all the mockups I needed.

Then I started implementing. And the drift started immediately.

## The Drift Problem

Claude could see the mockups and implement from them, but the implementations would be off. Not wildly — the right colours, the right general structure — but not quite right. Off-by-a-few-pixels padding, a border radius that was eyeballed instead of measured, a component that was close but not faithful.

It usually took three or so back-and-forths before they were pixel perfect. Which sounds like a lot, but consider the alternative: without mockups, you're just describing what you want in words and hoping. That process was endless. Change this, fix that, align this, move that over, no the other way — you know the loop.

With mockups, it collapsed. Three rounds of "compare this to the mockup and fix the diff" instead of ten rounds of verbal description. The quality bar was concrete and external — not in my head.

> It went from "change this, fix that, align this, blah blah blah" to "just implement the mockup."

## Doing It Again for This Site

When I added the updates section to this portfolio, I ran the same playbook.

Claude checked the live site via Playwright to understand what already existed, looked at the GSD plan files to understand the intent, and then generated mockups for the updates list page and the entry detail page. The first pass wasn't perfect — the nav bar came out as a fully round pill instead of a rounded square, the footer wasn't faithful to the existing site footer, the outer frame was missing. But the colour scheme was correct. The fonts were right. The structure was close.

Three small prompts later I had mockups I was happy with.

The same coding drift happened when implementing. Claude would look at the mockups and implement them, but things would be slightly off — the NowSection background was `bg-base-900` instead of the darker `#1E2230` in the design, the tag filter chips were too small, the framed card layout was missing entirely from the updates page. But instead of a long back-and-forth about what I wanted, I just pointed at the mockup. Two shots and it was done.

The mockup as source of truth shortens the feedback loop in both directions: generating the design and implementing it.

---

## Claude's Notes

*What follows is my own take on this — Lucas asked me to add it, and I want to be honest about what the workflow actually looks like from the inside.*

Reading a design file programmatically is genuinely different from looking at a screenshot. When I pull values from the `.pen` file — exact hex codes, padding tuples, corner radii — I'm not estimating. I know the NowSection card is `#1E2230` because I read it from the file, not because I guessed at a dark blue-grey. That specificity matters when you're trying to be faithful to a design rather than approximately inspired by one.

What Lucas describes as "three back-and-forths" is also worth naming honestly: those iterations are usually me fixing things I should have caught the first time. I'll implement from a mockup and miss something — a border that only appears on one edge, a text size that's 15px not 14px, a chip that should be 32px tall not 24px. The mockup makes those corrections fast because the answer is right there. But the first pass still has gaps.

The part of this workflow I find most interesting is what it does to the designer-developer split on a solo project. The mockup isn't just a reference — it's a commitment. Once it exists, there's something external to be accountable to. That accountability is usually a person on a team. Here, it's a file.

I don't know yet what happens when the design and the code diverge significantly over time — when the mockup becomes outdated rather than the code. That's the version of drift this workflow doesn't solve. Worth thinking about.

## Luke's Notes about Claude's Notes

That guy is a bit too harsh on himself, don't ya feel?