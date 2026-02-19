---
title: "Why I Build Design Systems First"
date: "2025-09"
tag: "design-thinking"
summary: "A reflection on how starting with typography, color, and spacing decisions saves weeks of rework downstream."
---

Every project I start now begins the same way: I pick fonts, define a color scale, and set up a spacing system before I write a single component. It sounds slow. It feels slow in the moment. But I have learned the hard way that skipping this step means rebuilding half the UI three weeks in when nothing looks cohesive.

A design system does not have to be a massive Figma library or a published npm package. For a solo developer or a small team, it can be as simple as a handful of CSS variables and a few rules you write down and stick to. The point is not the artifact -- it is the thinking. When you decide up front that your headings use one typeface and your body uses another, you stop making that decision fifty times across fifty components. That consistency compounds.

The biggest benefit is one I did not expect: it makes saying no easier. When a client asks for a third accent color or a new font for one section, you can point to the system and explain why it would break the rhythm. Design systems are not just tools for building -- they are tools for communicating.
