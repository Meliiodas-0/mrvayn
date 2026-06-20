import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameStore } from '@/lib/gameStore';
import { useIsMobile } from '@/hooks/use-mobile';

interface SafeZone {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ShipData {
  uid: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  size: 'sm' | 'md' | 'lg';
  // Per-ship, stable drift parameters so animations never reshuffle when
  // other ships are destroyed/respawned.
  driftDur: number;
  driftDelay: number;
  d1x: number;
  d1y: number;
  d2x: number;
  d2y: number;
}

interface ShootableSpaceshipsProps {
  sectionId: string;
  count?: number;
  safeZones?: SafeZone[];
}

const colors = ['#ff8a1e', '#16e0c8', '#ff2d78', '#ffc24d', '#2bd4ff', '#c084fc'];
const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

// Minimum distance between ships (percentage of viewport diagonal-ish)
const MIN_SHIP_DISTANCE = 9;
// Boundary padding (percentage from edges) — keeps ships clear of navbar/footer.
const BOUNDARY = { top: 12, bottom: 8, left: 3, right: 3 };

// ---- unique id generator (monotonic — no Date.now() collisions) ----
let UID = 1;
const nextUid = () => UID++;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function inSafeZone(x: number, y: number, safeZones: SafeZone[], pad = 2): boolean {
  return safeZones.some(
    (sz) =>
      x >= sz.left - pad &&
      x <= sz.left + sz.width + pad &&
      y >= sz.top - pad &&
      y <= sz.top + sz.height + pad,
  );
}

function minDistanceTo(x: number, y: number, others: ShipData[]): number {
  let min = Infinity;
  for (const o of others) {
    const dx = x - o.x;
    const dy = y - o.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < min) min = d;
  }
  return min;
}

/**
 * Robust position generator.
 * Samples candidate points inside the playable frame (in bounds, outside the
 * content safe-zones) and returns the first that is comfortably clear of other
 * ships. If none is clear after sampling, it returns the BEST-SPACED valid
 * candidate found — which still respects bounds and safe-zones. This guarantees
 * a sensible spawn every single time, eliminating the old "stack at x=5/x=95"
 * fallback that caused inconsistent respawns.
 */
function generatePosition(safeZones: SafeZone[], others: ShipData[]): { x: number; y: number } {
  let best: { x: number; y: number } | null = null;
  let bestDist = -1;

  for (let i = 0; i < 120; i++) {
    const x = rand(BOUNDARY.left, 100 - BOUNDARY.right);
    const y = rand(BOUNDARY.top, 100 - BOUNDARY.bottom);

    if (inSafeZone(x, y, safeZones)) continue;

    const dist = others.length ? minDistanceTo(x, y, others) : Infinity;
    if (dist >= MIN_SHIP_DISTANCE) {
      return { x, y };
    }
    if (dist > bestDist) {
      bestDist = dist;
      best = { x, y };
    }
  }

  // Best valid candidate found, or a guaranteed in-frame corner as last resort.
  return best ?? { x: BOUNDARY.left + 1, y: BOUNDARY.top + 2 };
}

function makeShip(safeZones: SafeZone[], others: ShipData[]): ShipData {
  const { x, y } = generatePosition(safeZones, others);
  return {
    uid: nextUid(),
    x,
    y,
    color: pick(colors),
    rotation: rand(-28, 28),
    size: pick(sizes),
    driftDur: rand(7, 12),
    driftDelay: -rand(0, 6),
    d1x: rand(-10, 10),
    d1y: rand(-8, 8),
    d2x: rand(-10, 10),
    d2y: rand(-8, 8),
  };
}

function SpaceshipSVG({ color, size }: { color: string; size: 'sm' | 'md' | 'lg' }) {
  const dimensions = size === 'sm' ? 'w-9 h-12' : size === 'lg' ? 'w-14 h-[4.5rem]' : 'w-11 h-15';

  return (
    <svg
      viewBox="0 0 24 36"
      className={dimensions}
      style={{ filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 22px ${color}55)` }}
    >
      <ellipse cx="12" cy="16" rx="5" ry="10" fill="#13131f" stroke={color} strokeWidth="0.6" />
      <path d="M12 2 L7 12 L17 12 Z" fill="#23233e" stroke={color} strokeWidth="0.4" />
      <path d="M7 14 L1 22 L1 28 L7 24 Z" fill="#13131f" stroke={color} strokeWidth="0.4" />
      <path d="M17 14 L23 22 L23 28 L17 24 Z" fill="#13131f" stroke={color} strokeWidth="0.4" />
      <circle cx="1" cy="25" r="2" fill={color}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="23" cy="25" r="2" fill={color}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="12" cy="10" rx="2.5" ry="3.5" fill={color} opacity="0.75">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <rect x="9" y="24" width="2" height="4" rx="0.5" fill="#08080f" />
      <rect x="13" y="24" width="2" height="4" rx="0.5" fill="#08080f" />
      <ellipse cx="10" cy="29" rx="1.5" ry="2" fill={color}>
        <animate attributeName="ry" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="14" cy="29" rx="1.5" ry="2" fill={color}>
        <animate attributeName="ry" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      <path d="M10 31 L10 36" stroke={color} strokeWidth="2" opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.2s" repeatCount="indefinite" />
      </path>
      <path d="M14 31 L14 36" stroke={color} strokeWidth="2" opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function Explosion({ x, y, color, onDone }: { x: number; y: number; color: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 650);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: 30 }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-16 h-16 rounded-full border-4"
        style={{ borderColor: color, boxShadow: `0 0 30px ${color}, inset 0 0 20px ${color}` }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="absolute left-1/2 top-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, #fff 0%, ${color} 55%, transparent 75%)` }}
      />
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: Math.cos((i * Math.PI) / 5) * 55, y: Math.sin((i * Math.PI) / 5) * 55, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: i % 2 === 0 ? color : '#ffffff', boxShadow: `0 0 8px ${color}` }}
        />
      ))}
    </div>
  );
}

function ScorePopup({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 750);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 1, 0], y: -34, scale: 1 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="absolute pointer-events-none font-display font-bold text-sm sm:text-base text-primary"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: 31, textShadow: '0 0 12px hsl(var(--primary))' }}
    >
      +100
    </motion.div>
  );
}

export default function ShootableSpaceships({ sectionId, count = 4, safeZones = [] }: ShootableSpaceshipsProps) {
  // Slot-stable array: each index keeps its identity. A destroyed slot becomes
  // null, then is refilled in place — so no other ship's React key or drift
  // animation is ever disturbed.
  const [ships, setShips] = useState<(ShipData | null)[]>([]);
  const [explosions, setExplosions] = useState<Array<{ uid: number; x: number; y: number; color: string }>>([]);
  const [popups, setPopups] = useState<Array<{ uid: number; x: number; y: number }>>([]);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const isMobile = useIsMobile();

  // Fewer ships on phones — the playable margins are thinner there.
  const effectiveCount = isMobile ? Math.max(2, Math.round(count * 0.55)) : count;

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialise ships once per section (and when density changes).
  useEffect(() => {
    const initial: (ShipData | null)[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      initial.push(makeShip(safeZones, initial.filter(Boolean) as ShipData[]));
    }
    setShips(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCount, sectionId]);

  // Clear any pending respawn timers on unmount.
  useEffect(() => {
    const set = timers.current;
    return () => {
      set.forEach((t) => clearTimeout(t));
      set.clear();
    };
  }, []);

  const handleShoot = useCallback(
    (slot: number, ship: ShipData) => {
      gameStore.addKill();
      setExplosions((p) => [...p, { uid: ship.uid, x: ship.x, y: ship.y, color: ship.color }]);
      setPopups((p) => [...p, { uid: ship.uid, x: ship.x, y: ship.y }]);

      // Empty the slot.
      setShips((prev) => prev.map((s, i) => (i === slot ? null : s)));

      // Refill the SAME slot after a short, consistent delay.
      const t = setTimeout(() => {
        timers.current.delete(t);
        setShips((prev) => {
          if (prev[slot]) return prev; // already filled (defensive)
          const others = prev.filter(Boolean) as ShipData[];
          const next = prev.slice();
          next[slot] = makeShip(safeZones, others);
          return next;
        });
      }, 1500 + Math.random() * 700);
      timers.current.add(t);
    },
    [safeZones],
  );

  const removeExplosion = useCallback((uid: number) => {
    setExplosions((p) => p.filter((e) => e.uid !== uid));
  }, []);
  const removePopup = useCallback((uid: number) => {
    setPopups((p) => p.filter((e) => e.uid !== uid));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 5 }} aria-hidden>
      <style>{`
        @keyframes shipDrift {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px) rotate(var(--rot)); }
          25% { transform: translate(-50%, -50%) translate(var(--d1x), var(--d1y)) rotate(calc(var(--rot) + 2deg)); }
          50% { transform: translate(-50%, -50%) translate(var(--d2x), var(--d2y)) rotate(calc(var(--rot) - 2deg)); }
          75% { transform: translate(-50%, -50%) translate(calc(var(--d1x) * -0.5), calc(var(--d1y) * -0.5)) rotate(calc(var(--rot) + 1deg)); }
        }
        .ship-hit {
          animation: shipDrift var(--dur) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          animation-delay: var(--delay);
          will-change: transform;
        }
        .ship-hit.no-drift { animation: none; transform: translate(-50%, -50%) rotate(var(--rot)); }
        .ship-hit:hover { animation-play-state: paused; }
        .ship-hit .ship-inner { transition: transform 0.15s ease; }
        .ship-hit:hover .ship-inner { transform: scale(1.22); }
        .ship-hit:active .ship-inner { transform: scale(0.86); }
      `}</style>

      <AnimatePresence>
        {ships.map((ship, slot) =>
          ship ? (
            <motion.div
              key={ship.uid}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              onPointerDown={() => handleShoot(slot, ship)}
              className={`absolute cursor-crosshair pointer-events-auto ship-hit ${prefersReducedMotion ? 'no-drift' : ''}`}
              style={
                {
                  left: `${ship.x}%`,
                  top: `${ship.y}%`,
                  '--rot': `${ship.rotation}deg`,
                  '--dur': `${ship.driftDur}s`,
                  '--delay': `${ship.driftDelay}s`,
                  '--d1x': `${ship.d1x}px`,
                  '--d1y': `${ship.d1y}px`,
                  '--d2x': `${ship.d2x}px`,
                  '--d2y': `${ship.d2y}px`,
                } as React.CSSProperties
              }
            >
              {/* Padded hit-area for comfortable tapping on touch screens */}
              <div className="ship-inner p-3 -m-3">
                <SpaceshipSVG color={ship.color} size={ship.size} />
              </div>
            </motion.div>
          ) : null,
        )}
      </AnimatePresence>

      {explosions.map((exp) => (
        <Explosion key={exp.uid} x={exp.x} y={exp.y} color={exp.color} onDone={() => removeExplosion(exp.uid)} />
      ))}
      {popups.map((p) => (
        <ScorePopup key={p.uid} x={p.x} y={p.y} onDone={() => removePopup(p.uid)} />
      ))}
    </div>
  );
}
