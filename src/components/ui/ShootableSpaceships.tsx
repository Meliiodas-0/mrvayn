import { useState, useEffect, useCallback, useMemo } from 'react';
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
  // Define safe zones where spaceships should NOT appear (as percentages)
  safeZones?: Array<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>;
}

const colors = ['#ff0080', '#00ffff', '#ffff00', '#00ff88', '#ff6600', '#a855f7', '#ff3366', '#00aaff'];
const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

// Generate position with better distribution - some areas sparse, some clustered
function generatePosition(safeZones: ShootableSpaceshipsProps['safeZones'] = [], index: number, total: number): { x: number; y: number } {
  // Distribute across 8 zones around the periphery
  const zoneIndex = index % 8;
  
  // Define spawn zones with varied density
  const spawnZones = [
    { minX: 0, maxX: 10, minY: 10, maxY: 35 },    // Left upper
    { minX: 90, maxX: 100, minY: 10, maxY: 35 },  // Right upper
    { minX: 0, maxX: 10, minY: 65, maxY: 90 },    // Left lower
    { minX: 90, maxX: 100, minY: 65, maxY: 90 },  // Right lower
    { minX: 0, maxX: 8, minY: 40, maxY: 60 },     // Left middle
    { minX: 92, maxX: 100, minY: 40, maxY: 60 },  // Right middle
    { minX: 15, maxX: 35, minY: 5, maxY: 15 },    // Top left area
    { minX: 65, maxX: 85, minY: 85, maxY: 95 },   // Bottom right area
  ];
  
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    // Pick zone based on index for even distribution
    const zone = spawnZones[zoneIndex];
    const x = zone.minX + Math.random() * (zone.maxX - zone.minX);
    const y = zone.minY + Math.random() * (zone.maxY - zone.minY);
    
    // Check if position is in any safe zone
    const inSafeZone = safeZones.some(sz => 
      x >= sz.left && x <= sz.left + sz.width &&
      y >= sz.top && y <= sz.top + sz.height
    );
    
    if (!inSafeZone) {
      return { x, y };
    }
    attempts++;
  }
  
  // Fallback to far edges
  const edge = zoneIndex % 2 === 0 ? 3 : 97;
  return { x: edge, y: 20 + (zoneIndex * 10) };
}

function SpaceshipSVG({ color, size }: { color: string; size: 'sm' | 'md' | 'lg' }) {
  const dimensions = size === 'sm' ? 'w-8 h-10' : size === 'lg' ? 'w-14 h-18' : 'w-10 h-14';
  
  return (
    <svg 
      viewBox="0 0 24 36" 
      className={dimensions}
      style={{ filter: `drop-shadow(0 0 12px ${color})` }}
    >
      {/* Main fuselage */}
      <ellipse cx="12" cy="16" rx="5" ry="10" fill="#1a1a2e" stroke={color} strokeWidth="0.5" />
      
      {/* Nose cone */}
      <path d="M12 2 L7 12 L17 12 Z" fill="#2a2a4e" stroke={color} strokeWidth="0.3" />
      
      {/* Wings */}
      <path d="M7 14 L1 22 L1 28 L7 24 Z" fill="#1a1a2e" stroke={color} strokeWidth="0.3" />
      <path d="M17 14 L23 22 L23 28 L17 24 Z" fill="#1a1a2e" stroke={color} strokeWidth="0.3" />
      
      {/* Wing tip lights */}
      <circle cx="1" cy="25" r="2" fill={color}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="23" cy="25" r="2" fill={color}>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
      
      {/* Cockpit */}
      <ellipse cx="12" cy="10" rx="2.5" ry="3.5" fill={color} opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" repeatCount="indefinite" />
      </ellipse>
      
      {/* Engine housings */}
      <rect x="9" y="24" width="2" height="4" rx="0.5" fill="#0a0a1e" />
      <rect x="13" y="24" width="2" height="4" rx="0.5" fill="#0a0a1e" />
      
      {/* Engine glow */}
      <ellipse cx="10" cy="29" rx="1.5" ry="2" fill={color}>
        <animate attributeName="ry" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="14" cy="29" rx="1.5" ry="2" fill={color}>
        <animate attributeName="ry" values="2;3;2" dur="0.3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" repeatCount="indefinite" />
      </ellipse>
      
      {/* Engine trails */}
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
      {/* Explosion ring */}
      <div 
        className="w-16 h-16 rounded-full border-4"
        style={{ 
          borderColor: color,
          boxShadow: `0 0 30px ${color}, inset 0 0 20px ${color}`
        }}
      />
      {/* Particles */}
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

  // Initialize ships with better distribution
  useEffect(() => {
    const initialShips: Spaceship[] = Array.from({ length: count }, (_, i) => {
      const pos = generatePosition(safeZones, i, count);
      return {
        id: Date.now() + i,
        x: pos.x,
        y: pos.y,
        color: colors[i % colors.length],
        rotation: -30 + Math.random() * 60,
        size: sizes[i % sizes.length],
      };
    });
    setShips(initialShips);
  }, [count, sectionId]);

  const handleShoot = useCallback((ship: Spaceship) => {
    // Add explosion
    setExplosions(prev => [...prev, { id: ship.id, x: ship.x, y: ship.y, color: ship.color }]);
    
    // Remove ship
    setShips(prev => prev.filter(s => s.id !== ship.id));
    
    // Respawn after delay with new position in a different zone
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * 8);
      const pos = generatePosition(safeZones, newIndex, count);
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
      {/* CSS animations for ship movement */}
      <style>{`
        @keyframes shipFloat0 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-15px); }
        }
        @keyframes shipFloat1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(5deg); }
          50% { transform: translate(-50%, -50%) translateY(-20px) rotate(-5deg); }
        }
        @keyframes shipFloat2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(-3deg); }
          50% { transform: translate(-50%, -50%) translateY(-12px) rotate(3deg); }
        }
        @keyframes shipDrift0 {
          0% { margin-left: 0; margin-top: 0; }
          25% { margin-left: 20px; margin-top: -10px; }
          50% { margin-left: 10px; margin-top: 15px; }
          75% { margin-left: -15px; margin-top: 5px; }
          100% { margin-left: 0; margin-top: 0; }
        }
        @keyframes shipDrift1 {
          0% { margin-left: 0; margin-top: 0; }
          25% { margin-left: -15px; margin-top: 20px; }
          50% { margin-left: 25px; margin-top: 10px; }
          75% { margin-left: 5px; margin-top: -15px; }
          100% { margin-left: 0; margin-top: 0; }
        }
      `}</style>
      <AnimatePresence>
        {ships.map((ship, index) => (
          <motion.div
            key={ship.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            onClick={() => handleShoot(ship)}
            className="absolute cursor-crosshair pointer-events-auto hover:scale-125 transition-transform duration-200"
            style={{ 
              left: `${ship.x}%`, 
              top: `${ship.y}%`,
              transform: `translate(-50%, -50%) rotate(${ship.rotation}deg)`,
              animation: `
                shipFloat${index % 3} ${3 + (index % 2)}s ease-in-out infinite,
                shipDrift${index % 2} ${8 + index * 2}s linear infinite
              `,
            }}
            whileHover={{ scale: 1.3, rotate: ship.rotation + 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <SpaceshipSVG color={ship.color} size={ship.size} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Explosions */}
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
