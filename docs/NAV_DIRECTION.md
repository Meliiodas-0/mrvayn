# Navigation v6.9: a compact masthead

The owner finds the existing small, loosely spaced navigation average. Refine the
desktop header and phone menu without changing the approved sculpture or stickmen.
This design revision is local-first. Web3 Development is already published separately.

## Plan before implementation

Palette: ground #07080B, primary #EFF2F6, secondary #ADB6C2, quiet #96A0AF,
section marker #546BF3, focus #A9B7FF. Keep root cinematic tokens unchanged.

Use Barlow Condensed at 24px for the desktop section names, connecting navigation
to the portfolio's existing display type. Inter remains the Contact action,
mobile toggle, and supporting text. Preserve sentence case and plain section names.

Compose a compact masthead: monogram left, an aligned four-link index on the right,
then a separate Contact action with a circular light arrow matching the site's
existing media controls. No pill-shaped nav container, fake labels or badge rows.

```text
mv.                      Work   About   Skills   Journey     Contact (down-right)
                         ---- sliding section marker ----

Phone, closed:  mv.                                      Menu =
Phone, open:    mv.                                     Close x
               Work                                         >
               About                                        >
               Skills                                       >
               Journey                                      >
               Contact                                      >
               social links / email
```

The single marker tracks hover, keyboard focus and the actual reading section.
It is a restrained spring response, never autoplay. Pointer preview must not
change aria-current. With reduced motion it moves immediately. Stable defaults
and a compact Navigation group live in the existing dev-only motion panel.

On phone, use a named Menu/Close toggle with an asymmetric two-stroke icon, not
an unexplained hamburger. The full-height menu uses larger display text, quiet
secondary links and a direct email action. Keep scroll lock, inert background,
Escape, focus containment/return, native links and 44px minimum touch targets.

Brief review: the change gets its character from MRVAYN's existing type and media
controls, not a new dashboard aesthetic. Keep the sculpture as the main expressive
element. Check mouse, keyboard, active-section scrolling, mobile navigation,
320px width, short viewports, tablet breakpoints and reduced-motion code paths.
