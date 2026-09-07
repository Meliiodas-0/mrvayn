# Hero verification, v6.6, 8 September 2026

## Current scroll revision

The reference was manually scrolled through its opening, bio, projects and later
sections on desktop, then at 375x812. Observations and the chosen adaptation are
recorded in `HERO_SCROLL_DIRECTION.md`.

- Replaced the scrolling-away banner with a viewport-pinned decorative scene.
- Each glyph has a reversible scroll path for translation, enlargement and 3D
  rotation. The initial fan-out leads with translation before enlargement, so
  the letters separate outward instead of crossing through one another.
- Existing content remains in ordinary document flow, above the decorative canvas.
  No blank scroll runway, content pinning, new background game or wheel interception.
- Desktop letter holds follow Work, About, Impact, Showreel, Skills and Journey.
  Existing opaque alternate sections still cover the decorative layer. Contact
  sends the letters outward. Phone paths move upward and clear the text viewport.
- Native scrolling, section links, and browser-restored scroll positions work.
  A direct reload below the hero does not eagerly load the decorative renderer;
  returning home loads it and begins at the correct scroll position.
- Reduced-motion source keeps the non-pinned still hero and disables pose response.
  Browser reduced-motion emulation and physical touch-device tests were not run.
- Dev DialKit now exposes scroll span, turn, stiffness and damping alongside the
  existing pointer controls. No new package or media was added in this revision.

### Checks completed

- `node scripts/test-hero-scroll.mjs` passed: 1,452 sampled poses are finite and
  reversible, chapter boundaries are continuous, phone letters clear the viewport.
- TypeScript, ESLint and production build passed. First Load JS remains 215 kB.
- `git diff --check` passed with the repository's CRLF normalization enabled.
- Production console had no new errors/warnings after 18:56:55 UTC on 7 September
  (8 September locally). The existing Open Graph edge-runtime build notice remains.
- Desktop opening was scrubbed down in increments, held with Work in front, then
  reversed back to the fully assembled wordmark. At scrollY 918 in a 1920x950
  viewport, the canvas top remained 0 while Work moved to y=32.
- 375x812 phone opening, mid-scroll upward exit and clear Work state inspected.
  320x740 opening has no horizontal overflow and retains all six glyphs and caption.
- 2560x1300 mid-scroll state has no overflow. The 2075x1060 drawing buffer remains
  below the 2.2-million-pixel cap. Temporary viewport overrides were reset afterward.
- The later Skills state shows the large Y at the left, with the reading content
  above the canvas. Contact anchor lands below navigation without overflow.
- Cricket project dialog opens correctly above the scene and closes with Escape.
- BootSequence and StickCursor SHA256 values still match the protected originals
  listed below. Neither file nor their root colour tokens was changed.
- No commit, push or deployment. Local production server remains on port 4550.

## Previous v6.5 verification, 7 September 2026

Scope: original sculptural MRVAYN hero, isolated CSS, hero editorial copy, motion
tuning, Three.js dependency and design notes. Existing Work onwards is unchanged
by this turn. The broader local portfolio redesign remains uncommitted.

## Build and browser

- TypeScript and ESLint passed, with no warnings.
- Production build passed. Its standard edge-runtime notice concerns the existing
  dynamic Open Graph route, not the hero.
- Local preview runs the production build on port 4550.
- No browser errors or warnings on the production reload after 17:57:15 UTC.
- Initial development PMREM sampling warning was fixed by lowering its blur sigma.
- First Load JS: 215 kB. Separately lazy-loaded hero chunks total 152,609 gzip bytes.
- No external model, texture, image, video or font assets are needed by the hero.
- HTTP 200; the server response contains the MRVAYN h1, SVG fallback and Work.
- git diff --check passed (only repository LF/CRLF normalization notices).

## Responsive checks

| Viewport | Result |
| --- | --- |
| 320 x 740 | Three rows, no overflow, 740px hero, 48px Work link. |
| 375 x 812 | Complete phone composition and caption fit; no clipping. |
| 768 x 1024 | Two-row tablet composition, no text overlap or overflow. |
| 1366 x 768 | Laptop composition fits between navigation and caption. |
| 1920 x 950 | Two-row sculpture reviewed at rest and after pointer movement. |
| 2560 x 1300 | No overflow; 2239x982 drawing buffer stays below 2.2M pixels. |

The browser's visible desktop scrollbar accounts for the 15px difference between
viewport width and document content width in these captures. These are browser
viewport checks, not physical-device performance measurements.

## Interaction and fallback

- Desktop pointer movement changes geometry orientation and studio reflections.
- Native Work link lands at #work with its section 68px below the phone viewport top.
- Phone menu opened with the Work link focused; Escape closed it. Navigation home
  returned to the hero.
- Hero Work link is 48px high and has an explicit visible keyboard focus outline.
- Touch handling is passive with pan-y and no pointer capture or orientation prompt.
  Actual touch hardware was not available for this check.
- Motion's reduced-motion hook holds geometry and reflections still. Scoped CSS
  removes transition animation. Reduced-motion emulation was not performed.
- Intersection and document visibility gates stop offscreen/hidden rendering. The
  scene renders on changes, not an idle loop. Geometry, environment and renderer
  resources are released on unmount.
- Server SVG is hidden only after the WebGL draw. Import failures keep it visible;
  context loss restores it. These failure branches were source-reviewed, not forced
  in the browser. The server fallback markup was confirmed by HTTP inspection.
- The cricket preview played to its 20.95-second end with native controls,
  readyState 4 and no video error. Its supplied full-film Drive link remains in Work.

## Dependencies

Three.js 0.185.1 and its matching available type package were added. Production npm
audit reports three existing high-severity dependency entries: Next 14.2.35, its
nested PostCSS 8.4.31, and nanoid 3.3.13. All three versions match HEAD. Three.js is
not an advisory entry. A framework/security upgrade is separate from this visual
preview; no automatic major-version audit fix was applied.

## Protected features and delivery

Both protected source files retain their original SHA256 hashes:

- BootSequence.tsx: 2F77266738613702E3B1A71157D6E29CF74F4B918DCCB7C142F596A311E745DE
- StickCursor.tsx: 24A56EC1EA227225C6FA8CC4FA8F5E911DFFF7E54CFD9AEE5CF187D1033D3F45

Root colour tokens match HEAD. themeColors.ts has no diff. Space Grotesk and
JetBrains Mono definitions are unchanged. The cursor enemies remain visible and
functional alongside the new hero. The cinematic was not rewritten.

No commit, push or deployment was made.
HEAD remains 38ef88963f8ca6f43bf337c00908cf301924e073.
