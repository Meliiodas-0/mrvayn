import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Spaceship {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  size: 'sm' | 'md' | 'lg';
}

interface ShootableSpaceshipsProps {
  sectionId: string;
  count?: number;
  safeZones?: Array<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>;
}

const colors = ['#ff0080', '#00ffff', '#ffff00', '#00ff88', '#ff6600', '#a855f7', '#ff3366', '#00aaff'];
const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

// Ship size in percentage for collision detection
const SHIP_SIZE = { sm: 3, md: 4, lg: 5 };
// Minimum distance between ships (percentage)
const MIN_SHIP_DISTANCE = 8;
// Boundary padding (percentage from edges)
const BOUNDARY_PADDING = { top: 12, bottom: 8, left: 3, right: 3 };

// Check if position collides with other ships
function checkShipCollision(x: number, y: number, existingShips: Spaceship[], excludeId?: number): boolean {
  return existingShips.some(ship => {
    if (ship.id === excludeId) return false;
    const dx = Math.abs(x - ship.x);
    const dy = Math.abs(y - ship.y);
    return Math.sqrt(dx * dx + dy * dy) < MIN_SHIP_DISTANCE;
  });
}

// Check if position is within boundaries (away from header/footer/edges)
function isWithinBoundaries(x: number, y: number): boolean {
  return (
    x >= BOUNDARY_PADDING.left &&
    x <= 100 - BOUNDARY_PADDING.right &&
    y >= BOUNDARY_PADDING.top &&
    y <= 100 - BOUNDARY_PADDING.bottom
  );
}

// Generate position with collision avoidance
function generatePosition(
  safeZones: ShootableSpaceshipsProps['safeZones'] = [],
  index: number,
  total: number,
  existingShips: Spaceship[] = []
): { x: number; y: number } {
  const spawnZones = [
    // Left side zones
    { minX: 3, maxX: 12, minY: 15, maxY: 35 },
    { minX: 3, maxX: 12, minY: 40, maxY: 60 },
    { minX: 3, maxX: 12, minY: 65, maxY: 88 },
    // Right side zones
    { minX: 88, maxX: 97, minY: 15, maxY: 35 },
    { minX: 88, maxX: 97, minY: 40, maxY: 60 },
    { minX: 88, maxX: 97, minY: 65, maxY: 88 },
    // Top zones (below header)
    { minX: 15, maxX: 35, minY: 13, maxY: 22 },
    { minX: 65, maxX: 85, minY: 13, maxY: 22 },
    // Bottom zones (above footer)
    { minX: 15, maxX: 35, minY: 78, maxY: 88 },
    { minX: 65, maxX: 85, minY: 78, maxY: 88 },
    // Mid-screen zones
    { minX: 35, maxX: 50, minY: 13, maxY: 20 },
    { minX: 50, maxX: 65, minY: 80, maxY: 88 },
  ];

  const maxAttempts = 50;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const zoneIndex = (index + attempts) % spawnZones.length;
    const zone = spawnZones[zoneIndex];
    
    const x = zone.minX + Math.random() * (zone.maxX - zone.minX);
    const y = zone.minY + Math.random() * (zone.maxY - zone.minY);

    // Check all conditions
    const inSafeZone = safeZones.some(sz =>
      x >= sz.left && x <= sz.left + sz.width &&
      y >= sz.top && y <= sz.top + sz.height
    );
    
    const collidesWithShip = checkShipCollision(x, y, existingShips);
    const withinBounds = isWithinBoundaries(x, y);

    if (!inSafeZone && !collidesWithShip && withinBounds) {
      return { x, y };
    }
    
    attempts++;
  }

  // Fallback: find any valid edge position
  const fallbackZones = [
    { x: 5, y: 25 + (index * 15) % 50 },
    { x: 95, y: 30 + (index * 15) % 50 },
  ];
  return fallbackZones[index % fallbackZones.length];
}

function SpaceshipSVG({ color, size }: { color: string; size: 'sm' | 'md' | 'lg' }) {
  const dimensions = size === 'sm' ? 'w-8 h-10' : size === 'lg' ? 'w-14 h-18' : 'w-10 h-14';

  return (
    <svg
      viewBox="0 0 24 36"
      className={dimensions}
      style={{ filter: `drop-shadow(0 0 12px ${color})` }}
    >
      <ellipse cx="12" cy="16" rx="5" ry="10" fill="#1a1a2e" stroke={color} strokeWidth="0.5" />
      <path d="M12 2 L7 12 L17 12 Z" fill="#2a2a4e" stroke={color} strokeWidth="0.3" />
      <path d="M7 14 L1 22 L1 28 L7 24 Z" fill="#1a1a2e" stroke={color} strokeWidth="0.3" />
      <path d="M17 14 L23 22 L23 28 L17 24 Z" fill="#1a1a2e" stroke={color} strokeWidth="0.3" />
      <circle cx="1" cy="25" r="2" fill={color}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="23" cy="25" r="2" fill={color}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="12" cy="10" rx="2.5" ry="3.5" fill={color} opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <rect x="9" y="24" width="2" height="4" rx="0.5" fill="#0a0a1e" />
      <rect x="13" y="24" width="2" height="4" rx="0.5" fill="#0a0a1e" />
      <ellipse cx="10" cy="29" rx="1.5" ry="2" fill={color}>
        <animate attributeName="ry" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="14" cy="29" rx="1.5" ry="2" fill={color}>
        <animate attributeName="ry" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" repeatCount="indefinite" />
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

function Explosion({ x, y, color, onComplete }: { x: number; y: number; color: string; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 100
      }}
    >
      <div
        className="w-16 h-16 rounded-full border-4"
        style={{
          borderColor: color,
          boxShadow: `0 0 30px ${color}, inset 0 0 20px ${color}`
        }}
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: Math.cos(i * Math.PI / 4) * 50,
            y: Math.sin(i * Math.PI / 4) * 50,
            opacity: 0
          }}
          transition={{ duration: 0.5 }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? color : '#ffffff',
            boxShadow: `0 0 8px ${color}`,
            left: '50%',
            top: '50%',
          }}
        />
      ))}
    </motion.div>
  );
}

export default function ShootableSpaceships({ sectionId, count = 4, safeZones = [] }: ShootableSpaceshipsProps) {
  const [ships, setShips] = useState<Spaceship[]>([]);
  const [explosions, setExplosions] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const shipsRef = useRef<Spaceship[]>([]);

  // Keep ref in sync for collision detection during respawn
  useEffect(() => {
    shipsRef.current = ships;
  }, [ships]);

  // Initialize ships with collision avoidance
  useEffect(() => {
    const initialShips: Spaceship[] = [];
    
    for (let i = 0; i < count; i++) {
      const pos = generatePosition(safeZones, i, count, initialShips);
      initialShips.push({
        id: Date.now() + i,
        x: pos.x,
        y: pos.y,
        color: colors[i % colors.length],
        rotation: -30 + Math.random() * 60,
        size: sizes[i % sizes.length],
      });
    }
    
    setShips(initialShips);
  }, [count, sectionId]);

  const handleShoot = useCallback((ship: Spaceship) => {
    setExplosions(prev => [...prev, { id: ship.id, x: ship.x, y: ship.y, color: ship.color }]);
    setShips(prev => prev.filter(s => s.id !== ship.id));

    // Respawn with collision check
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * 12);
      const pos = generatePosition(safeZones, newIndex, count, shipsRef.current);
      const newShip: Spaceship = {
        id: Date.now(),
        x: pos.x,
        y: pos.y,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: -30 + Math.random() * 60,
        size: sizes[Math.floor(Math.random() * sizes.length)],
      };
      setShips(prev => [...prev, newShip]);
    }, 2000 + Math.random() * 1000);
  }, [safeZones, count]);

  const removeExplosion = useCallback((id: number) => {
    setExplosions(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 5 }}>
      <style>{`
        @keyframes smoothDrift {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px) rotate(var(--rot)); }
          25% { transform: translate(-50%, -50%) translate(8px, -6px) rotate(calc(var(--rot) + 2deg)); }
          50% { transform: translate(-50%, -50%) translate(-6px, 8px) rotate(calc(var(--rot) - 2deg)); }
          75% { transform: translate(-50%, -50%) translate(4px, 4px) rotate(calc(var(--rot) + 1deg)); }
        }
        .spaceship-smooth {
          animation: smoothDrift var(--duration) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          will-change: transform;
        }
        .spaceship-smooth:hover {
          animation-play-state: paused;
          transform: translate(-50%, -50%) scale(1.25) !important;
        }
        .spaceship-smooth:active {
          transform: translate(-50%, -50%) scale(0.9) !important;
        }
      `}</style>
      <AnimatePresence>
        {ships.map((ship, index) => (
          <motion.div
            key={ship.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleShoot(ship)}
            className="absolute cursor-crosshair pointer-events-auto spaceship-smooth"
            style={{
              left: `${ship.x}%`,
              top: `${ship.y}%`,
              '--rot': `${ship.rotation}deg`,
              '--duration': `${6 + index * 1.5}s`,
              animationDelay: `${index * -1.2}s`,
            } as React.CSSProperties}
          >
            <SpaceshipSVG color={ship.color} size={ship.size} />
          </motion.div>
        ))}
      </AnimatePresence>

      {explosions.map((exp) => (
        <Explosion
          key={exp.id}
          x={exp.x}
          y={exp.y}
          color={exp.color}
          onComplete={() => removeExplosion(exp.id)}
        />
      ))}
    </div>
  );
}
