# CLAUDE.md — mrvayn.live portfolio rebuild

Auto-loaded every session. Kept lean on purpose — detailed specs live in `/docs`.

## What we're building
A from-scratch rebuild of **mrvayn.live**: a single-page game-developer portfolio for
**MrVayn — Founder & Game Developer** (Unreal Engine 5, Niagara VFX, multiplayer/netcode,
gameplay systems, shipped titles). It must read as AAA-caliber and authoritative.

**Signature idea: the portfolio _is_ a playable build.** A premium, tactical game-client UI
(Valorant-style authority) wrapped in expressive kinetic VFX (NFS Unbound energy), with a
lightweight, **optional, non-blocking** mini-game in the hero. Reading the site must NEVER
require playing.

## Read before building (and whenever relevant)
- `docs/BRIEF.md` — vision, audience, sections/IA, content inventory, build phases, open questions
- `docs/DESIGN_SYSTEM.md` — color/type/space tokens, components, VFX catalog, motion, a11y, voice
- `docs/GAME_SPEC.md` — the hero mini-game (OVERDRIVE) + alternative (REFLEX RANGE) + tech & integration
- `.claude/skills/frontend-design/` — design method (loads on demand). Run `/skills` to confirm it loaded.

## First steps (do not skip)
1. Inspect the existing repo (package.json, framework, build, deploy config) **and** the live site.
   Summarize the current stack and what content can be reused.
2. Resolve two open decisions with MrVayn before large work:
   (a) game = **OVERDRIVE** runner vs **REFLEX RANGE**;
   (b) stay on current framework vs move to **Next.js** for SEO (current site serves near-empty HTML to crawlers).
3. Propose a phased plan (use plan mode). After approval, build phase-by-phase, committing after each phase.

## Hard rules (non-negotiable)
- **Content-first.** Every section reachable by scroll + nav without playing. The game never traps
  scroll/focus, never autoplays loud audio, never blocks content. Audio off by default + toggle.
- **Performance.** Lazy-load the game; pause it when off-screen (IntersectionObserver) and when the
  tab is hidden; 60fps on desktop; graceful mobile (fewer particles / static fallback);
  animate transform & opacity only; LCP < 2.5s.
- **Accessibility.** Honor `prefers-reduced-motion` everywhere (no parallax/shake/auto-motion;
  instant reveals; game "still" mode). Visible keyboard focus. Semantic HTML, alt text, aria on
  controls, skip-to-content link. AA contrast for text.
- **Originality / IP.** Inspired by the genre's _visual language_, not a copy. Do NOT reproduce NFS
  or Riot/Valorant logos, marks, exact brand colors, proprietary fonts (Tungsten/DIN), or any
  characters/assets. Use only the tokens in `DESIGN_SYSTEM.md`.
- **Security.** Never hardcode secrets. A contact form (if any) posts to a vetted provider via an
  env var. Do not implement anything that needs MrVayn to paste passwords/keys into code.
  Ask before adding analytics or third-party scripts.
- **Code quality.** TypeScript, component-driven, centralized design tokens, content in a typed data
  file (e.g. `src/data/projects.ts`) so it's trivial to update. Keep the game a framework-agnostic
  module mounted by a thin wrapper.

## How to work
- Take screenshots and self-critique against `DESIGN_SYSTEM.md` as you build.
- Prefer procedural/vector VFX over heavy image assets.
- Use realistic placeholder content MrVayn can replace; **flag every spot** that needs his real content/media.
