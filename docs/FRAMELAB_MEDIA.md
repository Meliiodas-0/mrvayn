# Frame Lab showcase

Published media lives in `public/projects/frame-lab/v1/`. The project data connects
the portfolio preview to the full film at `/work/frame-lab#full-tour`. The Drive
folder remains available separately as **View project files**.

## Capture and edit

Recorded on 29 September 2026 from the existing Unreal Engine 5.6 packaged Windows
application. The assessment project and submission package were not rebuilt.
Window capture excludes the desktop, window border and pointer.

The full film contains four continuous twenty-second takes: Arun, Mira, Dev and
the optional T inspection view. Editorial joins are at 00:20, 00:40 and 01:00.
Camera handoffs within each take retain their runtime timing. A caption strip
explains the system without covering the runtime interface. The film is silent.
Character bases and walking animation are credited to Quaternius CC0.

## Delivery

| File | Format | Duration | Bytes |
| --- | --- | --- | --- |
| `showcase-1080p.mp4` | H.264, 1920x1080, 30 fps | 1:20 | 19,687,986 |
| `preview-12s.mp4` | H.264, 1280x720, 30 fps | 0:12 | 1,486,016 |
| `poster.webp` | WebP, 1280x720 | Still | 79,164 |
| `showcase-captions.vtt` | English timed explanations | 12 cues | 1,147 |

Both films use YUV 4:2:0 and fast-start metadata before the media payload. The
existing on-demand player mounts a video only after Play, uses native controls
and inline mobile playback, and pauses when hidden or outside the viewport.
Versioned paths use the site's existing public media cache policy. No external
iframe or video-player dependency was added.

## Verification

- Decoded all 2,400 film frames without errors; no black or frozen interval of
  0.7 seconds or longer was detected.
- Reviewed frames from all four takes, the caption strip and credit text.
- Checked 320, 375, 1920 and 2560 pixel page widths for overflow and console errors.
- Confirmed no MP4 request before Play, 80-second playback, seeking, all 12 caption
  cues, HTTP 206 byte ranges and MP4 content types.
- Confirmed the homepage dialog plays the 12-second preview, links to the full
  film, closes with Escape and restores keyboard focus on desktop and mobile.
- Type checking, lint, production build and existing hero checks passed.

These checks cover the media delivery. They are not a new full assessment audit.
