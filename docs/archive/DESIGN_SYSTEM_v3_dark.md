# DESIGN SYSTEM — "OVERDRIVE" (NFS Unbound × Valorant fusion)

Read the `frontend-design` skill first. **Spend boldness in one place:** the signature is the
**kinetic VFX layer + the angular "bevel" structure**. Everything else stays quiet and disciplined.

## 0. Identity in one line
Dark tactical authority (Valorant) + expressive neon motion (NFS Unbound). Premium, confident,
kinetic — never busy.

## 1. Color tokens (expose as CSS variables + Tailwind theme)
**Base (near-black, cool):**
- `--void`   `#07090F` — page background (near MrVayn's current `#070a12`)
- `--carbon` `#0E1320` — panel base
- `--steel`  `#1A2233` — raised panels, borders, dividers
- `--mist`   `#8A94A7` — muted text, captions, metadata
- `--bone`   `#EAF0FF` — primary text (slightly cool white)

**Accent system (the kinetic clash — use sparingly):**
- `--surge`  `#FF2D6B` — **signature accent**: hot magenta-red. Primary CTAs, active states,
  hit/score color, key glows. This is the "authoritative" hit.
- `--volt`   `#19E0FF` — electric cyan: reserved almost entirely for the game/VFX and rare hovers
  (the speed/energy color).
- `--ion`    `#B26BFF` — violet: only inside VFX gradients, never as flat UI.

**Rules**
- UI structure = `void/carbon/steel` + `bone` text + `--surge` as the single flat accent.
- `--volt` / `--ion` appear only in motion/VFX (gradients, particles, the game). Don't scatter cyan
  across static UI.
- Signature gradient (VFX only): `surge → ion → volt` (magenta → violet → cyan).
- Contrast: `bone` on `void/carbon` passes AA. Never set long body copy in an accent; reserve
  accents for large text, labels, icons, lines.
- This is deliberately **not** Valorant's `#FF4655` — `--surge` is MrVayn's own.

## 2. Typography (all open-source; self-host via Fontsource or Google Fonts; preconnect)
- **Display / headlines:** **Archivo** at Expanded/Black widths (700–900), UPPERCASE for big
  statements. Wide + heavy = tactical confidence. (Heavier alt for the single hero word: **Anton**.)
- **HUD / labels / nav / stats** (the personality face): **Chakra Petch** — squared, techy, uppercase,
  letter-spaced. Use for eyebrows, nav, tags, the game HUD, section labels.
- **Body:** **Inter** (or **Geist Sans**) — neutral, legible, comfortable.
- **Mono** (tech tags, build version, code): **JetBrains Mono**.

**Type scale (fluid `clamp`):** hero `clamp(3rem, 8vw, 7rem)` · section title `clamp(2rem, 4vw, 3.25rem)`
· eyebrow `0.8rem` uppercase tracked `+0.18em` · body `1–1.125rem` · caption `0.8rem`.
Tight leading on display (~0.95), comfortable on body (~1.6).

**Avoid:** Orbitron and other sci-fi clichés; Inter-for-everything (the templated look).

## 3. Layout & the signature "bevel"
- Grid-driven, asymmetric, generous negative space around dense info blocks.
- **Signature structural motif = the bevel cut**: a consistent clipped corner on panels/buttons/cards
  via `clip-path`, plus a 2px accent edge on ONE side (HUD-frame feel). Example:

  ```css
  .bevel {
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px,
                       100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  ```
  (pair with a left or top `--surge` border accent)

- Diagonal/skewed section dividers for motion (NFS). Thin "scanline" hairlines and corner brackets as
  HUD accents (sparingly).
- Border-radius mostly 0–2px (sharp). The bevel does the shaping, not rounding.

## 4. Components (build these primitives)
- **Panel** — bevel + `carbon` bg + `steel` border + optional `--surge` edge.
- **BevelButton** — primary: `--surge` fill + `bone` text; ghost: `bone` outline.
  Hover = corner-bracket highlight + accent fill sweep + subtle 1–2px jitter.
- **Eyebrow / SectionLabel** — Chakra Petch, uppercase, tracked, with a small index/tick
  (index ONLY where order is real).
- **Tag / Chip** — mono, small, `steel` bg, `--surge` text for emphasis.
- **HudFrame** — corner brackets + a thin scanline, around the hero/game and featured media.
- **StatBlock** — big number/word + small Chakra Petch label, for specialties.
- **ProjectTile + ProjectDetail** — an agent-select → agent-detail pattern.

## 5. Motion (deliberate, orchestrated — not scattered)
- **Boot/load sequence** (once): brief scanline sweep + HUD elements clip/snap in + hero word
  assembles. ~1s, skippable; reduced-motion → instant.
- **Scroll reveals:** panels clip-in / slide with a slight skew, staggered (Framer Motion or
  IntersectionObserver).
- **Hover micro-interactions:** corner brackets light up, accent fill sweep, tiny jitter; cards lift
  with a light streak.
- **Ambient:** faint hero particles/scanlines; the game canvas.
- Animate `transform` / `opacity` only — never layout properties.
- `prefers-reduced-motion`: disable parallax/shake/auto-motion/jitter; replace reveals with instant
  fades; the game offers a "still" mode.

## 6. VFX catalog (show game-dev VFX on the web — sparingly, performant)
- Speed lines / motion streaks (canvas or CSS) scaling with velocity/boost & on hover.
- Particle bursts on clicks/hits/CTA presses (canvas, pooled).
- Neon gradient glows (`surge → ion → volt`) behind the hero word / featured items (blurred, low opacity).
- Subtle glitch + scanline overlay; a chromatic-aberration nudge on emphasis moments only.
- Screen shake: **game only**, tiny.
- Fine grain/noise texture for depth (very low opacity).

**Budget:** cap particle counts; `requestAnimationFrame` with delta time; pause off-screen + when the
tab is hidden; reduce density on mobile / low `navigator.hardwareConcurrency` / reduced-motion.

## 7. Accessibility & quality floor
- Responsive to mobile (game adapts: tap input, fewer particles, or auto-demo on tiny screens).
- Visible keyboard focus ring — style it as a `--surge` corner-bracket.
- Semantic HTML, alt text, aria-labels on controls, skip-to-content.
- AA contrast for text; never rely on color alone.
- Honor reduced-motion everywhere; provide sound + motion toggles.

## 8. Voice & copy (the interface is signposting)
- Confident, plain, active voice. Labels say what happens: "View work", "Play", "Email me"
  (not "Submit").
- Operator/build flavor lives in eyebrows/section names ("OPERATOR FILE", "LOADOUT", "ARSENAL",
  "COMMS") — but functional labels stay clear.
- Errors explain + fix, in the interface voice; empty states invite action; plain over clever.

## 9. IP & originality (must follow)
Inspired by the genre's **visual language**, not a copy. Do not use NFS or Riot/Valorant logos, marks,
exact brand colors, proprietary fonts (Tungsten/DIN), or any characters/assets. Everything derives from
the tokens above.
