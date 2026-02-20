---
title: "One Hour, Five Thousand Books"
date: "2026-02"
tag: "case-study"
summary: "My girlfriend's bookstore needed to classify 5,000+ books by origin for a government certification. I built a tool so she didn't have to do it by hand."
link:
  url: "https://maisondesfeuilles.ca/"
  label: "La Maison Des Feuilles"
---

La Maison Des Feuilles just moved. New space, fresh start — and a mountain of logistics that comes with it. My girlfriend owns the bookstore, and alongside the move she was working toward l'agrément, a certification that lets independent bookstores sell to schools and universities in Québec. One of the requirements, though, is that at least a third of your inventory has to be Québécois books.

She had scanned over 5,000 books. She needed to know which ones counted.

## The Problem

The certification process doesn't hand you a magic spreadsheet. The plan was to go through each ISBN one by one, look up the publisher via Memento (the reference tool used across the Québec book trade), identify whether the publisher was Québécois or foreign, and triage from there. She knows the publishing landscape (I mean she's steeped in it), so the classification itself wasn't the hard part. The sheer volume was.

A week of manual lookups, minimum.

## The Solution

I convinced her to let me take a crack at it. She exported her inventory, I spun up a small Flask app that scraped the publisher data for each ISBN and matched it against a list of Québécois publishers. That damn thing had so many tabs. Claude helped me bootstrap the publisher list, and she finished it since she knew the edge cases, the imprints, the ones that had Quebec in the title that showed up as foreign (lol). That back-and-forth was the best part. I learned a bit more about her world, she learned a bit more about mine.

The interface was minimal: a table of ISBNs with a checkbox and a scrape all button. Each row would be enriched with data one at a time, title, category, publisher, and whether it was foreign or Québécois, plus a little link to the data source to double check. You could click a publisher to add it or remove it from the Québécois publisher white list and it would update every row with that specific publisher. Once she'd gone through the list, the app would re-classify all 5,000 entries accordingly and export the result. No per-book clicking. Just publisher-level decisions, which is exactly how she already thought about it.

It wasn't a pretty program. Again, like twenty different tabs and buttons for sorting and filtering and scraping and all that. But it worked, and it evolved — she'd say "can we also show the Québécois book count?" and literally 10 seconds later it did.

## The Result

33% Québécois. Just over the threshold.

She still has work ahead - l'agrément checks each section of the store independently, not just the overall ratio — but now she has the data. Plus it helped with updating her inventory to implement into SLIM. She can triage with the domain knowledge she already has instead of drowning in lookup work. What would have taken a week took an afternoon, most of which was just us talking through how her business actually works.

## What I Took Away

There's something different about building tools this way. Not a product, not a platform, it's kind of just a little afternoon craft time tool for one person who deeply understands the domain. The back-and-forth made it better: every time she told me something I didn't know about how bookstores work, the app got a little smarter.

I keep thinking about how malleable development has become. One-off programs that solve a single problem are easy now. You can work creatively with the person who holds the domain knowledge, iterate side by side, and the thing that comes out is more of a living organism. If you need to update a behavior mid-session, you do. It's less precious in a way, but more interactive.

> The application is in the editing. Always has been. It's just faster now.
