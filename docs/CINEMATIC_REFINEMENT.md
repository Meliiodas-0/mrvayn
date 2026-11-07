# Local cinematic refinement, 7 November 2026

The owner rejected the published cutscene's aesthetics. This pass changes the
opening only. The owner approved publication on 7 November 2026 after local review.
Cursor enemies are untouched.

## Direction

Keep the landing, two attackers, six opponents and flip. Treat it as a quiet
ink-like action vignette, with readable silhouettes rather than stacked effects.

Existing palette: ground #07080B, figure #EFF2F6, opponents #ADB6C2,
quiet controls #828D9C, restrained scarf/slash #FF6676. Root tokens stay unchanged.
Space Grotesk carries the brand title; Inter carries the subtitle and Skip control.
The scene is centered with a shallow grounded stage. Portrait screens move that
stage upward and bring the six opponents inward. No added frame or HUD.

- Thin blades and defined hilts replace blurred swords.
- The hero has a small red scarf. Back limbs and deeper opponents are quieter.
- Shared entry timing preserves spacing between approaching opponents.
- The free arm relaxes downward between guards. Guard changes carry the sword
  hand over the head, with measured blade clearance rather than crossing the face.
- The two attacks now use forward-kinematic shoulder/elbow/forearm tracks rather
  than pulling hand targets between poses. Shape-preserving cubic tracks retain
  movement through breakdown poses, with short intentional contact holds.
- Pelvis/chest lead, forearm action and blade follow-through have separate timing.
  The blade trail samples the actual tip path. Forearm angles are unwrapped so the
  left-strike recovery cannot accidentally take a full turn.
- The flip rotates around a torso-centred pivot on a parabolic flight path.
  Rotation accelerates in the tuck, then slows as the body opens for touchdown.
- Finisher effects are concentrated at the flip contact, 5.08 seconds: an actual
  blade-tip arc, two ground shockwave rings, 24 seeded sparks, six contact bursts
  and a low-opacity local light bloom. Takeoff and landing have short dust wisps.
- Crowd knockback starts on that contact, not before the hero begins the flip.
- A deterministic 280 ms camera impulse accompanies the hit, with a smaller
  200 ms landing response. CSS-pixel limits prevent excessive shake at 4K;
  phones use 55% strength. Only the canvas scene moves, not controls or page UI.
  Reduced-motion users still skip the entire opening. No full-screen flash.
- A Motion-driven title reveal and overlay fade replace the old title effects.
- Timing now runs at authored speed, about 8.7 seconds. Anticipation and recovery
  hold longer while the two contacts and tucked rotation remain quick.
- Elbow flexion is interpolated relative to the upper arm, preserving a consistent
  bend direction through shoulder-led attacks and removing the backwards snap.
- A single measured guard turn replaces repeated empty weapon flourishes.
- The second strike now sinks into a bent-knee stance and sweeps a horizontal
  half-turn into the rear attacker. Blade foreshortening maintains the side-on
  camera plane and floor clearance; its trail follows the same projected tip.
- Two close opponents feint in sequence. The hero recoils to either side with a
  raised free-hand guard, then regains balance before compressing for takeoff.
- All six opponents retain independently phased breathing, weight shifts and
  guard tracking after arrival. Secondary feints are staggered and smaller than
  the close pair's attacks. Weapon tips follow their changing wrist/guard pose.
- A smooth scarf curve carries a travelling wind wave. Its tail responds to neck
  displacement and remains in world space during the flip instead of rotating
  as a rigid angular appendage.
- Sword handles extend behind a forward guard, with a small visible closed grip
  at the solved wrist. Every figure's legs end at their stick endpoints, no toes.
- The crowd enters in two stages, closes around the hero and holds before takeoff.
  Two foreground opponents establish depth. Walking blends into a planted stance
  instead of resetting the feet when the approach ends.
- DialKit's development-only Cinematic group tunes speed, stroke, opponent opacity,
  impact strength, crowd distance and screen-shake strength.
- The hero sculpture defers WebGL initialization until the final title hold,
  avoiding shader setup competing with the fight. It draws its first frame behind
  the cinematic before the overlay fades. Its fallback remains available.
- Canvas raster work is capped at five million pixels. No external media added.

## Checks

TypeScript and ESLint pass. The pose suite checks 1,585 samples for fixed bone
lengths, foot/hand contact, reachable targets, face/blade clearance and transition
continuity, consistent elbow bend and continuous close-crowd trajectories.
Additional checks cover active settled enemy guards, reachable sword hands and
continuous scarf motion with an attached neck anchor.
Framing covers narrow phone, portrait/landscape, tablet, laptop,
1080p, 2K, ultrawide and 4K. Deterministic 30/60/120/144 Hz sampling remains tested.
Browser review includes frozen landing/combat/flip/title frames, continuous playback,
automatic handoff and Skip. No recorded console errors.

Preview: `http://localhost:4550/?cine=play`. Click Replay opening to watch again.

## Publication verification, 7 November 2026

- Production build, TypeScript, ESLint, cinematic and hero-scroll suites pass.
- Cursor/parkour collision and behaviour, ArchViz, MagViz and SEO checks pass.
  The MagViz test loader was updated to stub the newer ArchViz data import.
- Cinematic framing checks now cover 16 portrait, landscape, square and ultrawide
  dimensions, from 320x568 through 5120x1440, plus 30/60/120/144 Hz sampling.
- Rendered production checks in Chromium cover 320x568, 390x844, 844x390,
  768x1024, 1920x1080, 2560x1440, 3440x1440 and 3840x2160. No root horizontal
  overflow; Skip remains 44px high and within the viewport. Safe-area insets apply
  to Skip for notched devices. Canvas pixel allocation stays within five million.
- Production playback hands off to WebGL after the cinematic; the development
  replay link is absent. No browser console errors during the verification run.
- Phone menu opens, focuses its links and closes on navigation. Project footage
  remains unmounted before explicit Play. Existing SVG/WebGL fallback is retained.
- Browser execution was available only in Chromium. Actual Safari, Firefox and
  physical-device coverage is not claimed, nor a universal frame-rate guarantee.
- No new dependencies, remote effects assets, shaders or video downloads added.
  The four unrelated local Palm close-up files are excluded from the release.

## Hero handoff correction

The flat SVG was visible while WebGL initialized after the cinematic. The hero
container also changed from an inset stage to a fixed viewport at readiness.
The opening now signals preparation at 6.65 seconds during the quiet title hold.
The pending renderer uses the final viewport dimensions before its first draw.
JavaScript-enabled loading hides the temporary SVG; failure or context loss shows
the SVG immediately. Without JavaScript the SVG remains visible. A 12-second
watchdog also restores it if application chunks never finish loading.

Production playback review at desktop and 390x844 showed pending to WebGL while
the cinematic was still playing, about 1.4 seconds before handoff. Stage dimensions
remained unchanged and SVG stayed hidden. No browser console errors were recorded.

## Closing title ash dissolve

The closing MRVAYN title is rasterized once from its real loaded font and sampled
into glyph-covered fragments. A seeded left-to-right erosion front removes those
exact pieces from the intact mask; detached flakes curl upward, shrink and fade.
It is not an unrelated particle layer over a fading text rectangle. The subtitle
settles out separately, and the already-prepared 3D hero appears behind the ash.

The exit runs from 7.12 to 8.65 seconds; the overlay finishes at 8.7 seconds. Masks
are rebuilt only on resize/font readiness, glyph sampling is bounded by a 4,500-cell
grid, and there is no per-frame image readback, new dependency or downloaded media.
The whole cinematic remains skipped for reduced-motion users. Ash determinism,
erosion order, finite transforms and complete particle expiry are tested.
