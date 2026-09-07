# mrvayn.live design system (v4, light glass)

The shipped truth. Tokens are declared once in `app/globals.css` (`:root`) and mapped to
Tailwind classes in `tailwind.config.ts`. Superseded specs (the dark OVERDRIVE system, the
original brief, the hero mini-game spec) are in `docs/archive/` and describe nothing that
ships.

## Direction
One instrument panel on paper. Off-white page, greyish glass panes on a real ground, one
red (fills and signals), ink type. Two resident figures carry the identity: ROG, the ink
reaper fixed far right and scrubbed calmly by scroll, and the stickman cursor game with its
boot cinematic. Everything else is quiet chrome that measures something.

## Colour
| Token (class) | Value | Role |
| --- | --- | --- |
| `--void` (`void`) | 240 242 246 | page |
| `--bg-1` (`bg1`) | 231 234 240 | alternating sections |
| `--carbon` (`carbon`) | 236 239 245 | card base, dialog ground |
| `--bg-3` (`bg3`) | 244 246 250 | raised / hover |
| `--steel` (`steel`) | 205 210 220 | structural hairline; `steel/50` for dividers |
| `--line-2` (`line2`) | 182 189 202 | hover borders, ghost button |
| `--bone` (`bone`) | 11 14 20 | headings, ink |
| `--mist` (`mist`) | 62 70 82 | body |
| `--volt` (`volt`) | 88 96 110 | meta layer (5.6:1 on the page, AA at 11px) |
| `--surge` (`surge`) | 200 12 38 | text and border red (AA on page, bg-1 and glass) |
| `--ion` (`ion`) | 232 17 45 | solid fills only; `--ion-hover` 255 33 64 |

Derived: `--red-dim` = ion at 0.1 (spotlight, hero wash), `--ink-dim` = bone at 0.1 (glass
shadow). Never hand-type a near-token colour in TSX; use the class or `rgb(var(--x) / a)`.

## Surfaces
- `.glass`: slate gradient (bg-1 0.62 to steel 0.4), 18px blur, white rim, inner light
  edge, soft ink shadow. Phones: 8px blur and a 0.9 / 0.82 gradient so nothing reads
  through the text. Used by `Panel`, the hero pill and readout.
- `.glass-solid`: the reading surface (project dialog), carbon at 0.97, no blur.
- Sections (`SectionShell`) sit on `void` or `bg-1` at 0.86 so ROG ghosts through
  uniformly; the ticker and footer use the same 0.86 ground.
- Ambient `.blob` colour fields (static) sit under `main` so the glass has colour to refract.

## Type
- Display: Space Grotesk 500/600, `-0.02em`, for h1, h2, h3, tiles, stats, wordmark.
- Body: Inter, 16px / 1.7.
- Meta: JetBrains Mono, uppercase, ONE tracking owned by `.font-mono` (0.08em, 0.06em
  under 640px). Sizes: `text-meta-xs` 11px, `text-xs` 12px, `text-meta` 13px. No
  `tracking-*` utilities on mono elements.

## Shape and spacing
- Radius: 4px (`rounded`) for buttons, chips, small chrome; 8px (`rounded-lg`) for glass
  containers; `rounded-full` only for the identity pill and status dots.
- The one content column is `.mv-col` = `min(1440px, 100% - clamp(32px, 6vw, 128px))`;
  nav row, sections, ticker and footer all sit on it.
- Section padding: 60px on phones, `clamp(96px, 12vh, 180px)` from 640px.
- z ladder (`tailwind.config.ts`): fx 0 (ROG), content 10, hud 40 (phone menu), nav 50,
  chrome 60 (progress bar, skip link), overlay 90 (dialog), cursor 95 (stickman), boot 100.

## Components
- `BevelButton`: the one button. `primary` = ion fill, white, ion-hover + 1px lift, ink
  focus ring; `ghost` = line-2 hairline on a light pane (near-solid on phones).
- `Tag`: the one chip (`size`, `tone`, `as`). Red text only for released builds.
- `Panel`: glass card, optional red left edge, optional hover lift; carries `data-solid`
  so the stickman enemies stay off it.
- `SectionShell`: rules top and bottom, "NN / LABEL" from `src/data/sections.ts` on the
  top rule (`labelsBelow` when the section above is the red Showreel band).

## Motion contract
- Reveals: `Reveal` renders `[data-sfx]`, `ScrollFx` adds `.sfx-in` via
  IntersectionObserver, CSS animates TOWARD the visible base state. Stagger comes from
  co-arrival. If JS never runs nothing is hidden. Never framer-motion, never `gsap.from`
  on opacity.
- Scroll depth (`fx/ScrollDepth.tsx`): GSAP ScrollTrigger, transforms only, desktop only,
  synced to Lenis (`fx/SmoothScroll.tsx`, desktop only, `anchors: true`).
- Boot handoff: the inline script in `layout.tsx` sets `html[data-boot]` before first
  paint (`skip` for returning or reduced-motion visitors, `play` otherwise); the boot sets
  `done` when it lifts and the hero entrance replays once.
- ROG (`ScrollSamurai.tsx`): fixed, far right (hugs the 1440 column above 1920), uniform
  opacity (0.7 desktop, 0.25 phone), calm eased scrub, frames lazy-loaded around the
  scrub position, ink treatment baked into the frames by `scripts/rog_pipeline.py`.
- Stickman (`StickCursor.tsx`): head on the hotspot, red reticle over targets, enemies
  avoid `[data-solid]` at feet and head, freeze under an open dialog.
- Reduced motion: every keyframe is gated; marquees stop and become hand-scrolled rows.

## Content
All copy lives in `src/data/*.ts` (profile, projects, impact, skills, experience,
socials, showreel, sections). Numbers are real and consistent (4+ years in UE5, 20-person
studio, 3 products shipped). Identity order: UE5 + software developer first, Roblox last.
No em dashes anywhere.

## Verification
1. `npx tsc --noEmit`.
2. Headless captures at 375x812 @2x, 1920x950 and 2560x1300 (the capture script lives
   outside the repo in the working scratch folder; it skips the boot via
   `sessionStorage.booted`, screenshots every `section[id]`, the open dialog and the phone
   menu, and reports console errors and horizontal overflow).
3. Gate: zero console errors, no overflow, no label collisions, ROG complete and far right,
   dialog top reachable at 1080p.

## Handoff
Ships: everything above. Intentionally not built: a hero mini-game (the cursor game and
ROG replaced it), a contact form (mailto), testimonials (none supplied), a CV download
(`profile.resumeHref` stays null until the PDF exists in `public/`), a GitHub channel
(the owner has not supplied a public handle).
