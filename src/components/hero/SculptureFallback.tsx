import { DESKTOP_LETTERS, LETTERFORMS, PHONE_LETTERS, strokePath } from "./letterforms";

export function SculptureFallback() {
  return (
    <div className="sculpture-fallback" aria-hidden="true">
      {[false, true].map(phone => (
        <svg key={String(phone)} className={phone ? "sculpture-svg-phone" : "sculpture-svg-desktop"} viewBox={phone ? "-4.4 -6.15 8.8 12.3" : "-6.55 -4.25 13.1 8.5"} fill="none">
          <defs>
            <linearGradient id={`lacquer-${phone}`} x1="-1.5" y1="-1.6" x2="1.4" y2="1.6" gradientUnits="userSpaceOnUse">
              <stop stopColor="#131519" /><stop offset=".25" stopColor="#484D55" /><stop offset=".38" stopColor="#202328" /><stop offset=".62" stopColor="#0C0E12" /><stop offset=".87" stopColor="#3B4047" /><stop offset="1" stopColor="#101216" />
            </linearGradient>
          </defs>
          <g transform="scale(1 -1)">
            {LETTERFORMS.map((glyph, index) => {
              const [x, y, angle] = (phone ? PHONE_LETTERS : DESKTOP_LETTERS)[index];
              return <g key={glyph.letter} transform={`translate(${x} ${y}) rotate(${angle * 180 / Math.PI})`} strokeLinecap="round" strokeLinejoin="round">
                {glyph.strokes.map((stroke, part) => <path key={part} d={strokePath(stroke)} stroke={`url(#lacquer-${phone})`} strokeWidth=".76" />)}
              </g>;
            })}
          </g>
        </svg>
      ))}
    </div>
  );
}
