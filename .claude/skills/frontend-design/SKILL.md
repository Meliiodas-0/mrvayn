# Frontend Design (project method)

Read `docs/DESIGN_SYSTEM.md` completely before changing the visual system. Version 6.8
follows the owner's explicit choice of Maxime Veilleux's sculptural hero concept:
original MRVAYN geometry in black lacquer, followed by the existing portfolio content.
This supersedes the text-only v6.4 restriction. No copied reference assets or source.
The blue Sevarog arch, game background, static silver V, Code / Play slogan and cobalt
hero field remain rejected. Project imagery belongs in Work, not behind the hero.

The owner rejected repeated glass panels, badge rows, and identical project layouts.
Do not reintroduce that instrument-panel template. Use the real projects to determine
the composition: cricket screening room, offset game spreads, and a wide MagViz product
presentation. Smaller experiments are compact, older work is expandable.

The stickman cinematic and cursor/enemy game are explicitly protected. Never edit their
source or change the root colours and font variables they read. Page colours belong in
`.portfolio-theme`. Sevarog is retained in source but no longer rendered.

Use real content from `src/data`. No invented numbers, claims or em dashes. A control
says what it does. Avoid decorative numbering, labels, glow, glass and repeated pills.

Motion should answer an action. Preserve the cinematic. The owner explicitly wants
Maxime's scroll concept: viewport-pinned letters that separate and rotate around
the incoming content. See `docs/HERO_SCROLL_DIRECTION.md`. A pointer-only treatment
does not satisfy this brief. Keep the sequence reversible and driven by scroll,
with width-scaled, cropped letter holds on phone and native scrolling. The owner
found the former phone-only upward exit too flat; `docs/MOBILE_DIRECTION.md`
supersedes that part of the original scroll plan.
Use an independent phone composition, not a cropped desktop canvas. No idle loops,
fake terminal, marketing slogan or additional cursor. Keep a visible SVG fallback.
Keep visible server-rendered content everywhere. No autoplay marquees, section-title
drift or repeated staggered entrances. Honour reduced motion and native phone scrolling.

Build, then inspect phone / 1080p / 2K captures. Check native playback, menu and dialog
focus, frame visibility, contrast, long text and narrow-phone overflow. Remove an
unnecessary accessory before handing off. Verify both protected file hashes.
