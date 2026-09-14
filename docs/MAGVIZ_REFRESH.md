# MagViz media refresh, 15 September 2026

## Design direction

Preserve the existing selected-work spread, project order and role attribution.
Use the clean exterior capture as the shared 16:9 poster. No text baked into the
image and no new visual theme from the film's presentation frame.

- Palette retained: void #07080B, primary #EFF2F6, body #ADB6C2, metadata #96A0AF,
  ion #546BF3 and pale blue #A9B7FF.
- Type retained: Barlow Condensed project headings, Inter reading text.
- Layout: left-aligned text, whole-building framing, native click-to-play media.

```text
Homepage: [20s preview + caption] [MagViz + summary + project/tour links]
Detail:   [title + summary] [1:52 full tour] [case study + capabilities]
Gallery:  [same clean poster] -> full tour
```

Review: this is an update to one real product, not a new landing page. Retain the
portfolio's design and show the current unit-selection journey rather than the
superseded floor-isolation capture. Do not alter the hero or cursor enemies.

## Media

Verified revision: ocean-product-v9-shoreline-flow. Public assets are limited to
the supplied 20s preview, 111.7s full tour, descriptive VTT and optimized current
exterior poster. All use versioned paths under /projects/magviz/v9/.

There is no verified new external upload. The full-film action therefore uses
the existing local case-study page and an on-demand player. No soundtrack or
full-film request starts until the visitor presses play. Local integration does
not publish or upload these files to an external service.

Only public-facing project facts are used. No private handoff, dashboard
configuration, logs, credentials or raw capture directories are included.

## Verification

- Production build, TypeScript and integrated lint checks passed.
- Both supplied MP4 hashes match. FFmpeg decoded both complete films without
  errors: 20.000s silent 720p preview and 111.700s 1080p full film with AAC audio.
- Poster optimized to 1600x900 WebP, 183,620 bytes, with no crop or visual edits.
- Descriptive captions retain all 12 supplied cue timings. Punctuation follows
  the portfolio's existing copy convention.
- `node scripts/check-magviz.mjs` passed: exact media, HTTP 206 byte ranges,
  video/VTT MIME types, tour links, shared poster and unchanged other projects.
- `node scripts/check-seo.mjs` passed for nine indexable pages and 18 local
  images. MagViz's current metadata and structured-data image use the update.
- Desktop card and detail panel inspected. The 20s preview reached its end
  without a playback error. The full-tour action opens the new local page.
- Phone checks at 390x844 and 320x568: no horizontal overflow, whole-building
  16:9 framing, native inline controls. Full-tour playback and keyboard seeking
  verified at 390x844, with sound enabled only after Play and offscreen pause.
- No video element exists before Play. The full film is not preloaded in the
  server markup. Descriptive caption track and its served VTT verified.
- Inquiry from the detail dialog closes it, clears inert state and reaches the
  existing contact section. No message or form was submitted.
- No browser warnings/errors in the full-tour check. Responsive browser testing
  is not a test on a physical phone.
- Cinematic and cursor-enemy source hashes are unchanged. No commit, push,
  external media upload or deployment was performed.

The approved videos are ready for direct site hosting when publication is
requested. No replacement YouTube or Drive URL is needed for this implementation.
