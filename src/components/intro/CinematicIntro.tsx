import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroSpaceship from './IntroSpaceship';
import LaserBeam from './LaserBeam';
import Explosion from './Explosion';
import Starfield from './Starfield';

interface CinematicIntroProps {
  onComplete: () => void;
}

interface EnemyState {
  id: number;
  x: number;
  y: number;
  destroyed: boolean;
  entryDelay: number;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<'playing' | 'fading' | 'done'>('playing');
  const [heroPosition, setHeroPosition] = useState({ x: -150, y: 50 });
  const [enemies, setEnemies] = useState<EnemyState[]>([
    { id: 1, x: 110, y: 30, destroyed: false, entryDelay: 0.6 },
    { id: 2, x: 115, y: 55, destroyed: false, entryDelay: 1.2 },
    { id: 3, x: 120, y: 75, destroyed: false, entryDelay: 1.8 },
  ]);
  const [lasers, setLasers] = useState<Array<{ id: number; targetId: number; fired: boolean }>>([]);
  const [explosions, setExplosions] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip intro if reduced motion is preferred
  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
    }
  }, [prefersReducedMotion, onComplete]);

  // Main animation timeline
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Hero ship enters
    const heroEnter = setTimeout(() => {
      setHeroPosition({ x: 25, y: 50 });
    }, 300);

    // Fire lasers at enemies
    const fireLaser1 = setTimeout(() => {
      setLasers(prev => [...prev, { id: 1, targetId: 1, fired: true }]);
    }, 1000);

    const fireLaser2 = setTimeout(() => {
      setLasers(prev => [...prev, { id: 2, targetId: 2, fired: true }]);
    }, 1600);

    const fireLaser3 = setTimeout(() => {
      setLasers(prev => [...prev, { id: 3, targetId: 3, fired: true }]);
    }, 2200);

    // Destroy enemies with explosions
    const destroy1 = setTimeout(() => {
      const enemy = enemies.find(e => e.id === 1);
      if (enemy) {
        setExplosions(prev => [...prev, { id: 1, x: 75, y: 30 }]);
        setEnemies(prev => prev.map(e => e.id === 1 ? { ...e, destroyed: true } : e));
      }
    }, 1150);

    const destroy2 = setTimeout(() => {
      const enemy = enemies.find(e => e.id === 2);
      if (enemy) {
        setExplosions(prev => [...prev, { id: 2, x: 78, y: 55 }]);
        setEnemies(prev => prev.map(e => e.id === 2 ? { ...e, destroyed: true } : e));
      }
    }, 1750);

    const destroy3 = setTimeout(() => {
      const enemy = enemies.find(e => e.id === 3);
      if (enemy) {
        setExplosions(prev => [...prev, { id: 3, x: 80, y: 75 }]);
        setEnemies(prev => prev.map(e => e.id === 3 ? { ...e, destroyed: true } : e));
      }
    }, 2350);

    // Begin fade out
    const fadeTimer = setTimeout(() => setPhase('fading'), 3000);
    
    // Complete
    const doneTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(heroEnter);
      clearTimeout(fireLaser1);
      clearTimeout(fireLaser2);
      clearTimeout(fireLaser3);
      clearTimeout(destroy1);
      clearTimeout(destroy2);
      clearTimeout(destroy3);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, prefersReducedMotion]);

  const handleSkip = useCallback(() => {
    setPhase('done');
    onComplete();
  }, [onComplete]);

  if (phase === 'done' || prefersReducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fading' ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-background cursor-pointer"
      onClick={handleSkip}
    >
      {/* Starfield background */}
      <Starfield speed={1.5} />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80 pointer-events-none" />
      
      {/* Hero ship */}
      <motion.div
        initial={{ x: '-150%', y: '-50%' }}
        animate={{ 
          x: `${heroPosition.x}vw`,
          y: `${heroPosition.y}vh`,
        }}
        transition={{ 
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="absolute"
        style={{ 
          left: 0, 
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <IntroSpaceship variant="hero" size="lg" />
      </motion.div>

      {/* Enemy ships */}
      <AnimatePresence>
        {enemies.map((enemy) => !enemy.destroyed && (
          <motion.div
            key={enemy.id}
            initial={{ x: '110vw', opacity: 0 }}
            animate={{ 
              x: `${enemy.x - 35}vw`,
              opacity: 1,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 0.8,
              delay: enemy.entryDelay,
              ease: 'easeOut',
            }}
            className="absolute"
            style={{ 
              top: `${enemy.y}%`,
              transform: 'translateY(-50%)',
            }}
          >
            <IntroSpaceship variant="enemy" size="md" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Laser beams */}
      {lasers.map((laser) => {
        const enemy = enemies.find(e => e.id === laser.targetId);
        if (!enemy || !laser.fired) return null;
        
        const heroX = window.innerWidth * 0.25 + 70;
        const heroY = window.innerHeight * 0.5;
        const enemyX = window.innerWidth * (enemy.x - 35) / 100;
        const enemyY = window.innerHeight * enemy.y / 100;
        
        return (
          <LaserBeam
            key={laser.id}
            startX={heroX}
            startY={heroY}
            endX={enemyX}
            endY={enemyY}
            color="hsl(var(--primary))"
            duration={0.15}
          />
        );
      })}

      {/* Explosions */}
      <AnimatePresence>
        {explosions.map((explosion) => (
          <Explosion
            key={explosion.id}
            x={window.innerWidth * explosion.x / 100}
            y={window.innerHeight * explosion.y / 100}
            size={100}
          />
        ))}
      </AnimatePresence>

      {/* Skip hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-sm"
      >
        Click anywhere to skip
      </motion.div>

      {/* Title overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
      >
        <h2 className="text-2xl md:text-4xl font-display font-bold text-gradient">
          MrVayn
        </h2>
        <p className="text-muted-foreground mt-2">Game Developer</p>
      </motion.div>
    </motion.div>
  );
}
