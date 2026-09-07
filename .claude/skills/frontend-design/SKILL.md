# Frontend Design (project method)

Act as the design lead for a portfolio that must read as top-tier and unmistakable. The
shipped system is documented in `docs/DESIGN_SYSTEM.md`; derive every colour, type and
spacing decision from it. Take one justified aesthetic risk per change, never ten.

## The direction
Light paper (off-white page), greyish glass containers, ink text, ONE red signal. Two
signatures carry the identity: ROG, the ink wraith scrubbed by scroll on the right, and the
stickman cursor game with its boot cinematic. Everything else is a quiet instrument panel:
mono meta labels on hairline rules, Space Grotesk display type, Inter body.

## Principles
- **Ground it in the subject.** Game feel, engine work, shipped products. Build with
  MrVayn's real content (`src/data/*.ts`), never lorem, never invented numbers.
- **The hero is a thesis.** Identity pill, wordmark with its red slab, one paragraph, two
  actions, three facts. No cycling titles, no trust strips, no second logo.
- **Typography carries personality.** Space Grotesk 600 tight for display, Inter for body,
  JetBrains Mono for ALL meta at one tracking (owned by `.font-mono` in globals.css).
- **Structure is information.** Section numbers come from `src/data/sections.ts` and mean
  DOM order; list numbers only where order is real (the Journey).
- **Motion is deliberate.** One orchestrated moment (boot handoff into the hero), IO
  reveals that stagger by co-arrival, transform-only scroll depth. Markup ships visible.
- **Restraint.** Red is for fills and signals; glass is for containers; hairlines are
  steel. Before "leaving the house", remove one accessory.

## Process
Plan (token check against `docs/DESIGN_SYSTEM.md`), critique (does any part read as a
generic template?), build, then capture phone / 1080p / 2K and critique the captures.
Watch CSS layer order: `.glass` is an unlayered rule and beats Tailwind border/shadow
utilities on the same element.

## Writing
Active voice; a control says what it does ("View work", "Email me"). Plain over clever.
No em dashes.
