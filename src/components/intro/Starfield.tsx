import { useMemo } from 'react';

interface StarfieldProps {
  speed?: number;
}

export default function Starfield({ speed = 1 }: StarfieldProps) {
  const stars = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      duration: (3 + Math.random() * 4) / speed,
    })),
  [speed]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes starScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100vw); }
        }
        .star {
          animation: starScroll var(--duration) linear infinite;
          will-change: transform;
        }
      `}</style>
      
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${star.x + 100}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            '--duration': `${star.duration}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,${star.opacity})`,
          } as React.CSSProperties}
        />
      ))}
      
      {/* Nebula/space dust effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, hsl(var(--primary) / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, hsl(var(--accent) / 0.1) 0%, transparent 40%)',
        }}
      />
    </div>
  );
}
