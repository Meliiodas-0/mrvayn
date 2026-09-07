# Whole-site verification, v6.7

8 September 2026. Local preview: http://localhost:4550/#hero.
No commit, push or deployment. HEAD remains
`38ef88963f8ca6f43bf337c00908cf301924e073`.

## Actual browser review

Scrolled every section from the hero to the footer before and after the changes:
desktop at 1440x1000 and phone layout at 375x812. This was an incremental wheel
scroll review with screenshots, not just anchor jumps or a static hero inspection.
Also checked narrow 320x740, tablet 820x1180, and 2560x1440 layouts.

- Hero reverses and reassembles when returning to the top.
- Reading layer settles at 0.18 opacity. No more hard opaque section cutoffs.
- At the desktop document end, canvas opacity is 0 and Contact is active.
- Work remains active throughout the long project section. About, Skills, Journey
  and Contact update correctly; opening the archive recalculates section positions.
- Work anchor lands at 76px desktop and 68px phone. Tablet Skills lands at 76.19px.
- No horizontal document overflow at 320, 375, 820, 1440 or 2560 widths.
- No missing internal anchor targets or broken loaded image elements.
- 2K canvas is 1971x1115, within the 2.2-million-pixel work cap.
- Phone project body is 15px and captions 12px. Workshop entries are a full-width
  list with thumbnail, title and role, followed by a readable description.
- Phone width changes disable Lenis. Menu opens with Work focused, locks scrolling,
  marks the page inert, closes on navigation and restores normal scrolling.
- Menu reverse Tab wraps from Work to Close menu, then to Email me. Escape closes.
- Cricket preview plays with native controls: measured 6.86s into a 20.95s video,
  unpaused and without a media error. Opening its case study pauses that video.
- Desktop case study sits above the page, receives Close focus, closes with Escape,
  clears inert/scroll lock and restores focus to View project without moving it.
- Mobile case study scrolls independently; its close control stays at y=12px after
  690px of dialog scrolling. Escape closes and page scrolling resumes.
- Capture Next advances the track 454px on desktop and enables Previous. Previous
  returns it. Archive disclosure opens all seven entries and closes again.
- Browser warning/error log is empty after the production interaction review.

## Automated checks

- `node scripts/test-hero-scroll.mjs`: 1,452 finite, continuous, reversible poses;
  phone exit; reading fade; reachable page-end exit across viewport heights;
  long-section/reverse/page-end navigation.
- Worst-case settled metadata contrast is 4.68:1, even assuming a fully white
  letter reflection composited at the 0.18 reading opacity. This is a targeted
  contrast check, not a claim of complete WCAG certification.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed, no warnings or errors.
- `npm run build`: passed. Route / is 128kB, first load 216kB. The pre-existing
  edge-runtime notice concerns the dynamic Open Graph route.
- `git -c core.safecrlf=false diff --check`: passed.
- Protected root tokens match HEAD. Original cinematic font definitions remain.
- BootSequence SHA256:
  `2F77266738613702E3B1A71157D6E29CF74F4B918DCCB7C142F596A311E745DE`.
- StickCursor SHA256:
  `24A56EC1EA227225C6FA8CC4FA8F5E911DFFF7E54CFD9AEE5CF187D1033D3F45`.

## Scope and limits

The browser review uses responsive desktop viewports, not a physical iPhone or
Android device. Native touch, Safari, forced WebGL context loss and OS reduced-motion
preference changes were not exercised on real devices. Their code paths and CSS were
reviewed; the reduced-motion smooth-scroll specificity was corrected. No third-party
link contents, profile claims or numerical project claims were re-audited in this
visual pass. Existing dependency audit findings remain documented in HERO_VERIFICATION.

The final small CSS pass aligns the wide-screen hero caption with the 1440px content
column and fixes reduced-motion selector specificity. The production preview is rebuilt
after these adjustments. On the rebuilt 2560px preview, both navigation and hero
caption start at x=552.5px. Both existing local tabs were refreshed, viewport overrides
were reset, and the final warning/error log remained empty.

Design and motion skills guided the single expressive sculpture and continuous
reading surface. Interface corrections follow the
[Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)
for focus, reduced motion, readable controls and responsive overflow.
