# BRIEF — mrvayn.live portfolio rebuild

## 1. Who & why
MrVayn is a **Founder & Game Developer**. Craft: Unreal Engine 5, Niagara VFX, multiplayer/netcode,
gameplay systems, with shipped titles. The portfolio's job is to convince studios, collaborators, and
clients in ~60 seconds that he operates at a high, "authoritative" tier — and to **show, not just tell**,
his sense for game feel and VFX.

- **Primary audience:** studio recruiters/leads, potential collaborators & contract clients.
- **Secondary:** peers, community.
- **Single job of the page:** get the right viewer to (a) believe he's elite and (b) reach out / view his work.

## 2. The big idea — "the portfolio is a playable build"
A premium, tactical game-client experience:
- **Authority & structure** from a Valorant-style UI language: sharp angular panels with clipped
  corners, confident wide/heavy type, disciplined grids, a single strong accent.
- **Energy & motion** from an NFS Unbound kinetic VFX layer: speed lines, particle bursts, neon
  gradient glows, subtle glitch/scanlines, screen shake (game only).
- A lightweight, **optional** mini-game in the hero that demonstrates web "game feel." It must never
  block reading. A recruiter sees juice/VFX the moment they land — that itself is proof of craft.

## 3. Information architecture (single page + detail panels)
**Persistent:** top nav (Valorant-style bar) with section links + "Play" + a sound toggle (muted by
default) + reduced-motion auto-respect; a skip-to-content link; a minimal footer with a
`BUILD v2.0 // © 2026 MrVayn` easter-egg.

**Sections:**
1. **Hero / "Press Start"** — name, role, one-line thesis, the playable game canvas, primary CTAs
   (View Work, Play). Animated VFX background + a short boot-in sequence.
2. **About / "Operator File"** — concise bio (founder + dev), framed as a dossier. Specialty stat
   blocks (UE5, Niagara VFX, Multiplayer, Gameplay Systems...).
3. **Work / "Loadout"** (centerpiece) — project tiles styled like an agent/weapon select. Each tile:
   media (trailer/gif/thumb), title, role, tech tags, links (trailer, repo, playable build, case
   study). Selecting a tile opens a detail panel: **Problem → Approach → Result** + media + tech.
   Shipped titles featured prominently.
4. **Skills / "Arsenal"** — grouped tech: Engines, Languages, Systems (replication / GAS), VFX
   (Niagara), Tools (Perforce / Git). An arsenal grid, **not** progress bars.
5. **Experience / Timeline** (optional, only if content exists) — founder + roles + shipped-title
   timeline. Numbered markers are fine here (a real sequence).
6. **Contact / "Comms"** — email, GitHub, X, LinkedIn, YouTube/ArtStation; a clear CTA
   ("Open to studio collaborations / contract"). Optional form via a vetted provider.

## 4. Content inventory — MrVayn to provide (Claude Code: flag a placeholder for each)
- Bio in two forms: a 1-line thesis + an ~80-word "about".
- Projects — for each: title, role, year, 2–4 sentence summary, tech list, links
  (live / build / repo / trailer), 1–3 media assets.
- Shipped-titles list.
- Specialty/skill lists per group.
- Socials + contact email.
- Brand assets if any: logo/avatar, project thumbnails/trailers, resume/CV.

## 5. Success criteria (definition of done)
- Cohesive, **non-templated** NFS × Valorant identity; reads as AAA / authoritative.
- Content fully usable without playing; reduced-motion + keyboard + mobile all polished.
- Performance: LCP < 2.5s, game lazy-loaded, 60fps desktop, graceful mobile.
- **SEO fixed:** real static/server-rendered HTML + correct meta/OG (the current SPA serves
  near-empty HTML to crawlers).
- Projects updatable via a typed data file.
- The mini-game is fun for ~30–60s, juicy, and never in the way.

## 6. Build phases (commit after each)
0. **Recon** — inspect repo + live site + content; confirm stack; resolve open questions; set up tokens.
1. **Design system** — Tailwind config + fonts + CSS vars + base components
   (Panel, BevelButton, Eyebrow, Tag, HudFrame, StatBlock) + boot sequence.
2. **Layout & sections** — all sections + nav + footer with placeholder content + scroll-reveal motion.
3. **Game** — build the chosen game as an isolated module; integrate non-intrusively;
   HUD / states / localStorage; reduced-motion / low-power handling.
4. **Content** — wire real content; project detail panels; media optimization.
5. **Polish & QA** — responsive, a11y, Lighthouse (perf / SEO / a11y), reduced-motion,
   cross-browser, SFX toggle; screenshot self-critique vs `DESIGN_SYSTEM.md`.

## 7. Open decisions (resolve with MrVayn first)
- **Game:** OVERDRIVE (one-input neon runner — max "wow" + game-feel showcase) vs REFLEX RANGE
  (Valorant target/aim mini — lower risk, max polish-per-effort). **Default recommendation: OVERDRIVE.**
- **Framework:** keep the current SPA vs move to Next.js (App Router) for SEO/OG.
  **Recommended for a public portfolio: Next.js.**
- **"Operator/build" framing:** keep the flavor or dial it down.
