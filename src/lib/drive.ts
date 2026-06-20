// Helpers to surface media from existing project links without downloading
// anything: Google Drive files expose a public thumbnail + an inline preview.

function driveFileId(url: string): string | null {
  const m = url.match(/\/file\/d\/([^/]+)/) || url.match(/[?&]id=([^&]+)/);
  return m ? m[1] : null;
}

/** A still image for a Drive *file* (works when shared "anyone with link"). */
export function driveThumb(url: string, w = 1000): string | null {
  const id = driveFileId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${w}` : null;
}

/** An inline player/preview iframe src for a Drive *file*. */
export function driveEmbed(url: string): string | null {
  const id = driveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

/** Best still image for a project's first link (explicit media wins). */
export function projectThumb(media: string | undefined, links: { href: string }[]): string | null {
  if (media) return media;
  const first = links[0]?.href;
  return first ? driveThumb(first) : null;
}
