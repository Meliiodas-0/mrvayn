# Lossless deployment media

MagViz v14's 112,657,760-byte original exceeds GitHub's single-blob limit.
Three binary parts store the original bytes, without encoding or compression.
`npm run build` first runs `scripts/prepare-media.mjs` to concatenate them into
the normal public MP4 path and verify its fixed SHA-256. No secrets or runtime
network downloads are required. Public playback remains a single fast-start MP4.

To repack this exact approved source locally: `node scripts/prepare-media.mjs --pack`.
Replacing the approved film requires deliberately updating the checksum and parts.
