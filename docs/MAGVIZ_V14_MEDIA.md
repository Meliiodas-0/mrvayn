# MagViz current media integration

Source: archviz-template/deliverables/portfolio, current v14 full film and
approved v13 continuous short. Copied unchanged into public/projects/magviz/v14.
No re-encoding, trimming, frame-rate changes or audio processing.

- Preview: 40.000s, 1280x720, 30 fps, silent H.264.
- Full: 119.200s, 1920x1080, 30 fps, H.264 + AAC stereo.
- Matching continuous-film VTT captions; all twelve cues through 1:59.200.
- Current clean exterior poster from master20260924/frame.0150.jpg.

Verified exact SHA-256 files against the supplied revisions, moov before mdat,
HTTP 206 range delivery, video/caption MIME types, labels and on-demand markup
with scripts/check-magviz.mjs. Both complete files decode without errors.
Production build/types/lint passed. Browser playback advanced for both files,
reporting 40s/720p and 119.2s/1080p with the correct VTT track and no media error.

The full film is 112,657,760 bytes. Preserve quality for deployment: choose
suitable media storage before pushing, since ordinary GitHub blobs have a
100 MiB limit. No upload, commit or deployment performed. Prior versions remain.
