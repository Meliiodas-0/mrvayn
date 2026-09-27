# Score UI direction

Palette: existing ground #07080B, divider #2D333D, ivory #EFF2F6,
secondary #ADB6C2, quiet #828D9C. No new page theme.
Type: existing Inter labels, Barlow Condensed numbers with tabular figures.
Layout: left-aligned masthead instrument, not a floating game overlay.

```text
mv.    pointer | Score   Personal best                 navigation
                 041          041
```

Review: an outlined glowing pill would compete with the sculpture. Use a single
functional divider, stronger number hierarchy and no ambient animation instead.
Keep the accessible 44px toggle, phone exclusion and score storage behaviour.
Check desktop widths 1920, 2560, 3072, 3840 plus laptop and phone regressions.
Container changes are not part of this request's sizing question; report actual
fluid/capped behaviour and distinguish CSS pixels from physical display pixels.

## Verification

- Production build passed, including TypeScript and lint checks.
- Measured 1920x1080, 2560x1440, 3072x1728 and 3840x2160 CSS viewports:
  1440px main container, no document horizontal overflow or masthead overlap.
- Compact desktop 1024x768: no horizontal overflow or masthead overlap.
- Phone 390x844: no horizontal overflow; scoreboard absent as intended.
- Visually inspected desktop hero, 4K work section and phone work section.
- Main body copy stays 15px; this is a responsive capped layout, not a UI that
  enlarges proportionally with physical display resolution. Browser zoom and
  operating-system scaling determine the effective CSS viewport.
- Restored normal preview viewport. Scoring, persistence and actors unchanged.
