# mrvayn.live design system (v5, obsidian signal)

The shipped truth. Tokens are declared once in `app/globals.css` (`:root`) and mapped to
Tailwind classes in `tailwind.config.ts`. Superseded specs (the dark OVERDRIVE system, the
original brief, the hero mini-game spec) are in `docs/archive/` and describe nothing that
ships.

## Direction
One cinematic instrument panel on an obsidian ground. Graphite panes, vivid work media,
one red signal, and cold white type. Two resident figures carry the identity: ROG, the pale
wraith fixed far right and scrubbed calmly by scroll, and the stickman cursor game with its
boot cinematic. Everything else is restrained chrome that measures something.

## Colour
| Token (class) | Value | Role |
| --- | --- | --- |
| `--void` (`void`) | 7 8 11 | page |
| `--bg-1` (`bg1`) | 11 13 17 | alternating sections |
| `--carbon` (`carbon`) | 16 19 24 | card base, dialog ground |
| `--bg-3` (`bg3`) | 22 26 33 | raised / hover |
| `--steel` (`steel`) | 45 51 61 | structural hairline |
| `--line-2` (`line2`) | 75 84 98 | hover borders, ghost button |
| `--bone` (`bone`) | 239 242 246 | headings, cold white |
| `--mist` (`mist`) | 173 182 194 | body |
| `--volt` (`volt`) | 130 141 156 | meta layer |
| `--surge` (`surge`) | 255 102 118 | accessible text and border red |
| `--ion` (`ion`) | 237 27 58 | solid fills only; `--ion-hover` 255 51 82 |

Derived: `--red-dim` = ion at 0.14 (spotlight, hero wash), `--ink-dim` = black at 0.4
(glass shadow). Never hand-type a near-token colour in TSX; use the class or
`rgb(var(--x) / a)`.

## Surfaces
- `.glass`: graphite gradient (bg-3 0.78 to carbon 0.7), 16px blur, steel rim, soft black
  shadow. Phones: 8px blur and an almost opaque gradient so nothing reads through text.
  Used by `Panel`, the hero pill and readout.
- `.glass-solid`: the reading surface (project dialog), carbon at 0.985, no blur.
- Sections (`SectionShell`) sit on `void` or `bg-1` at 0.9 so ROG ghosts through
  uniformly; the footer uses a 0.94 ground.
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
- Section padding: 68px on phones, `clamp(88px, 10vh, 140px)` from 640px.
- z ladder (`tailwind.config.ts`): fx 0 (ROG), content 10, hud 40 (phone menu), nav 50,
  chrome 60 (progress bar, skip link), overlay 90 (dialog), cursor 95 (stickman), boot 100.

## Components
- `BevelButton`: the one button. `primary` = ion fill, white, ion-hover + 1px lift;
  `ghost` = line-2 hairline on a graphite pane. Both retain a visible focus ring.
- `Tag`: the one chip, with a red accent for released builds.
- `Panel`: glass card, optional red left edge, optional hover lift; carries `data-solid`
  so the stickman enemies stay off it.
- `SectionShell`: rules top and bottom, "NN / LABEL" from `src/data/sections.ts` on the
  top rule, with consistent spacing after the dark Showreel band.
- `ProjectSpotlight`: the newest showcase leads the work section, with a native-ratio
  preview, a concise overview and three facts.
- `SelectedProject`: Antarya, SAO-X and MagViz use full-width alternating 7/5 desktop
  layouts. Phones always read title, media, caption, contribution, facts, actions.
- `ClipPreview`: one player shared by all local project clips and detail dialogs.
  Media loads only on an explicit Play, never crops the gameplay/HUD, pauses offscreen
  or on a hidden tab, and allows only one preview to play at a time. Opening a case
  study pauses the card player. Reduced-motion visitors also opt in to playback.
- `ProjectTile`: current smaller builds show local thumbnails, a short summary and
  a visible case-study affordance; archived prototypes remain compact.
- `ProjectDetail`: full project/video links sit immediately below media. Focus is
  trapped, the background is inert, and Close has a 44px target on both breakpoints.

## Motion contract
- Reveals: `Reveal` renders `[data-sfx]`, `ScrollFx` adds `.sfx-in` via
  IntersectionObserver, CSS animates toward the visible base state. Stagger comes from
  co-arrival. If JS never runs nothing is hidden. DialKit tunes reveal distance and timing
  during local development. Motion drives only the additive scroll-progress signal.
- Scroll depth (`fx/ScrollDepth.tsx`): GSAP ScrollTrigger, transforms only, desktop only,
  synced to Lenis (`fx/SmoothScroll.tsx`, desktop only, `anchors: true`).
- Boot handoff: the inline script in `layout.tsx` sets `html[data-boot]` before first
  paint (`skip` for returning or reduced-motion visitors, `play` otherwise); the boot sets
  `done` when it lifts and the hero entrance replays once.
- ROG (`ScrollSamurai.tsx`): fixed, far right (hugs the 1440 column above 1920), uniform
  faint opacity (0.34 desktop, 0.14 phone), calm eased scrub, frames lazy-loaded around
  the scrub position, inverted to a pale screen-blended ghost for the dark ground.
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
