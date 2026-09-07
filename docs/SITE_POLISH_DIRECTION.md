# Whole-site polish, v6.7

## Brief and observed problems

Keep the owner's MRVAYN scroll sculpture and all existing portfolio content. Keep
BootSequence, StickCursor, their root palette and font tokens byte-for-byte intact.
Local preview only, no commit or deployment in this pass.

Actual desktop and 375px phone scrolling exposed bright letter highlights behind
small text, hard background slabs hiding the sculpture, a stale Work navigation
indicator, an incomplete page-end exit, and cramped two-column phone workshop copy.

## Tokens, type and layout plan

- Retain the near-black ground, pale foreground and restrained cobalt links.
- Raise only the page-scoped metadata colour to #96A0AF. Root tokens stay unchanged.
- Barlow remains the display voice; Inter handles readable body text. Phone body
  copy becomes 15px, secondary descriptions 13px, captions at least 12px.
- Keep the six sculpted letters as the single expressive device. Fade them to an
  18% reading-layer strength as work arrives, retaining the reversible choreography.
- Replace opaque alternate bands with transparent sections and quiet inset rules.
- Retain the asymmetric desktop project spread; reduce excess project gaps.
- Phone workshop becomes a single editorial list: thumbnail beside title/role,
  readable summary below, no tiny half-width paragraphs or card chrome.
- Close with a complete letter exit before the flat footer wordmark.

## Compact layout sketch

    MRV / AYN sculpture, identity + View work
    Full-width cricket film + two-column notes
    Asymmetric selected work + wide MagViz spread
    Workshop index (phone: thumbnail | title, summary below)
    About / impact / captures / skills / journey on one dark ground
    Contact + clear footer wordmark

## Interaction and verification

Use cached section positions for navigation. Native scrolling on phones and when
reduced motion is enabled, including preference changes. Stop background smooth
scrolling and media while the menu or dialog is open. Keep visible keyboard focus,
safe-area spacing and 44px controls. Add deterministic timeline and navigation tests.
Review the completed production build by scrolling every section and testing the
menu, dialog, captures, preview, deep links, return-to-top, and narrow layouts.

This follows the selected reference's scroll concept without importing its source
or assets. The design/motion skills guide the restrained composition; the interface
guidelines guide keyboard, reading and responsive corrections.
