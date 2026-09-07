# GAME SPEC — hero mini-game

Goal: a juicy, lightweight, **optional** game that shows web "game feel" and never blocks the
portfolio. **Default recommendation: OVERDRIVE.** Alternative: REFLEX RANGE.

## A. OVERDRIVE (recommended) — one-input neon runner/dash
Fantasy: a high-speed neon sprint through a stylized city — pure NFS Unbound kinetic energy with
Valorant HUD authority.

**Gameplay**
- Avatar auto-runs; **one input** (click / tap / Space) = dash/jump to dodge obstacles & collect XP shards.
- Difficulty ramps with distance (faster, denser obstacles).
- Score = distance + shards; combo for near-misses / shard streaks. Personal best saved (localStorage).
- Optional, **non-gating** hook: distance milestones fire a tiny toast ("ZONE CLEARED → see Projects")
  that scrolls to a section if tapped. Content is NEVER locked behind the game.

**States:** IDLE (attract auto-demo loop) → READY (press-start overlay) → PLAYING →
PAUSED (auto on blur / off-screen) → DEAD (defeat overlay: score, best, Retry).
All overlays use bevel panels + Chakra Petch.

**Controls:** click / tap / Space = dash; (optional hold-to-charge). Mobile: tap anywhere on the canvas.
Never capture keyboard/scroll unless the canvas is focused/hovered.

**Feel / VFX:** 3–4 parallax background layers; player trail particles; speed lines scaling with
velocity; impact burst + tiny screen shake on hit; combo/score popups (graffiti energy);
chromatic-aberration nudge on boost. Reduced-motion → "still" mode (no shake/parallax, minimal
particles, or a static attract image).

## B. REFLEX RANGE (alternative) — Valorant-style target/aim mini
- A contained panel; targets spawn at random positions with short lifetimes; click/tap to pop.
- 30s round; combo multiplier; live accuracy %; best score saved.
- Juicy: hitmarker, particle burst, score popups, miss feedback; bevel HUD.
- Simpler to build and even more non-intrusive (a panel, not a moving background). Pick this if the
  priority is maximum polish for minimum risk.

## C. Tech & architecture (both games)
- **Default:** HTML5 Canvas 2D in a **vanilla TypeScript module** (no engine). Upgrade path if VFX get
  heavy: **PixiJS** (GPU-accelerated 2D). Avoid full engines (Phaser) unless scope grows.
- Self-contained class with `init()` / `start()` / `pause()` / `resume()` / `destroy()`. Mounted by a
  thin React wrapper (or a web component) — game logic stays **framework-agnostic**.
- **Loop:** fixed-timestep update (accumulator) for deterministic physics; render with interpolation;
  `requestAnimationFrame`; clamp delta time.
- Entities + **object pooling** (particles, obstacles/targets). Input abstraction → a single action.
  A difficulty controller. An event emitter to the host (`onScore`, `onBest`, `onMilestone`) for the
  optional toasts.
- **Persistence:** localStorage for best score (feature-detect; guard for SSR/privacy modes).
- **Suggested files:** `src/game/Overdrive.ts` (engine), `src/game/entities/*`, `src/game/vfx/*`,
  `src/components/GameCanvas.tsx` (wrapper + HUD), `src/game/storage.ts`.

## D. Non-intrusive integration (hard requirements)
- **Lazy-load** the game module (dynamic import) so it never blocks first paint / LCP.
- **IntersectionObserver:** pause/teardown when the hero leaves the viewport; optionally show a
  minimized HUD pip with the best score; resume on return.
- Pause on `document.hidden` (`visibilitychange`).
- **Audio off by default;** SFX behind a toggle; never autoplay sound.
- "Play" expands to a focused mode with a clear "Exit to portfolio"; `Esc` exits.
- Never trap scroll or keyboard when inactive; always provide a visible skip/close.

## E. Performance budget
- 60fps desktop; cap particles; reduce density on mobile / low `navigator.hardwareConcurrency` /
  reduced-motion.
- Canvas + transforms only; no layout thrash; use an offscreen canvas where it helps.
- Keep game JS small; no heavy texture assets — prefer procedural/vector drawing; if sprites, one tiny
  spritesheet.

## F. Asset notes
- Ship with procedural placeholder art (shapes/gradients) MrVayn can later replace with custom
  sprites/art. **Flag the swap points** clearly in code.
