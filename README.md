# MrVayn | Game Developer Portfolio

A cinematic, game-inspired portfolio showcasing my journey, experience, and projects — built for both desktop and mobile.

## Highlights

- **Cinematic intro** — a short spaceship dogfight that disintegrates into the title (skippable, respects `prefers-reduced-motion`).
- **Interactive mini-game** — click/tap the drifting enemy ships in any section to shoot them down. A unified score HUD tracks your hits and best run.
- **Scroll-reactive 3D background** — a Three.js starfield, nebula, energy particles and grid that shift colour and parallax as you scroll, with subtle pointer-driven depth on desktop.
- **AAA film treatment** — vignette, film grain, scanlines and a top scroll-progress beam.
- **Responsive & precise** — tuned layouts and touch-friendly targets from 375px phones up to wide desktops.

## Project Structure

- `src/components/hero` — hero section.
- `src/components/sections` — About, Journey, Projects, Collaborations, Contact.
- `src/components/intro` — the cinematic intro sequence.
- `src/components/3d` — scroll-reactive background scene and section dividers.
- `src/components/ui` — design-system components, the shootable ships, score HUD and cinematic overlay.
- `src/lib` — shared utilities and the mini-game score store.
- `src/pages` — page composition.
- `public` — static assets.

## Tech Stack

- **React + Vite + TypeScript** — app foundation.
- **TailwindCSS** — styling and design tokens.
- **Framer Motion** — animation and scroll interactions.
- **Three.js / @react-three/fiber** — the 3D background.

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## License

All rights reserved. © 2026 MrVayn
