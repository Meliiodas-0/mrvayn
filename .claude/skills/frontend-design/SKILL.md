---
name: frontend-design
description: Use when building or restyling any UI in this project — deciding palette, typography, layout, motion, and VFX, or reviewing visual quality. Enforces a distinctive, intentional (non-templated) aesthetic and a quality floor: responsive, reduced-motion, accessible. Read alongside docs/DESIGN_SYSTEM.md.
---

# Frontend Design (project method)

Act as the design lead at a studio known for giving every client an identity that can't be mistaken
for anyone else's. Make deliberate, opinionated choices specific to THIS brief — a AAA-caliber
game-dev portfolio in an NFS Unbound × Valorant direction. Take one real, justified aesthetic risk.
The project's tokens live in `docs/DESIGN_SYSTEM.md`; derive every color/type decision from there.

## Principles
- **Ground it in the subject.** The world of game UIs, VFX, and "game feel" is where distinctive
  choices come from. Build with MrVayn's real content (projects, shipped titles), not lorem.
- **The hero is a thesis.** Open with the most characteristic thing — here, a live, juicy, optional
  mini-game + a confident hero word. Avoid the template hero (big number + small label + gradient).
- **Typography carries personality.** Use the pairing in `DESIGN_SYSTEM.md` (Archivo Expanded/Black +
  Chakra Petch + Inter + JetBrains Mono). Make type a memorable part of the design, not a neutral
  delivery vehicle.
- **Structure is information.** Numbering, eyebrows, and dividers must encode something true. Use
  numbered markers (01 / 02) only where order is real (e.g. a timeline) — never as decoration.
- **Motion is deliberate.** One orchestrated moment (the boot sequence; scroll reveals) beats
  scattered effects. Too much animation reads as AI-generated. Respect reduced-motion.
- **Match complexity to vision.** This is a kinetic, maximal-leaning direction, so execute the VFX
  elaborately — but keep everything around the signature quiet and precise.

## Process: plan → critique → build → critique
Plan first (in your head / a scratch note): a compact token check (color, type, layout, signature)
against `DESIGN_SYSTEM.md`. Then critique it — if any part reads like a generic AI default
(cream + serif + terracotta; near-black + a single acid accent; broadsheet hairlines) rather than a
choice for THIS brief, revise it and say what changed and why. Only then write code, following the
plan exactly. Watch CSS specificity (type-based vs element-based selectors fighting over
padding/margins between sections).

## Restraint & self-critique
Spend boldness in one place: the kinetic VFX + the angular bevel are the signature; keep the rest
disciplined. Build to a quality floor without announcing it — responsive to mobile, visible keyboard
focus, reduced-motion respected. Take screenshots and critique as you build (a picture is worth 1000
tokens). Before "leaving the house," remove one accessory.

## Writing
Words are design material. Active voice; a control says what it does ("View work", "Play"). Keep
names consistent across a flow. Errors explain + fix in the interface's voice; empty states invite
action. Plain over clever; specific over vague.
