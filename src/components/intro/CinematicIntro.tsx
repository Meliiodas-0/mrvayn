import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

// Generate particles for disintegration effect
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 0.8,
    duration: Math.random() * 1.2 + 0.8,
    opacity: Math.random() * 0.5 + 0.5,
  }));
};

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<'playing' | 'disintegrating' | 'fading' | 'done'>('playing');
  const fadeTimerRef = useRef<number | null>(null);
  const disintegrateTimerRef = useRef<number | null>(null);
  const doneTimerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const DISINTEGRATE_DURATION_MS = 1500;
  const FADE_DURATION_MS = 800;

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Generate particles once
  const titleParticles = useMemo(() => generateParticles(80), []);
  const subtitleParticles = useMemo(() => generateParticles(50), []);

  // Skip intro if reduced motion is preferred
  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
    }
  }, [prefersReducedMotion, onComplete]);

  // Timeline: play -> disintegrate -> fade -> done
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Start disintegration at 6.5s (after title appears and glows)
    disintegrateTimerRef.current = window.setTimeout(() => {
      setPhase('disintegrating');
    }, 6500);

    // Start fade after disintegration
    fadeTimerRef.current = window.setTimeout(() => {
      setPhase('fading');
    }, 6500 + DISINTEGRATE_DURATION_MS);

    // Complete after fade
    doneTimerRef.current = window.setTimeout(() => {
      setPhase('done');
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 6500 + DISINTEGRATE_DURATION_MS + FADE_DURATION_MS);

    return () => {
      if (disintegrateTimerRef.current) window.clearTimeout(disintegrateTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
    };
  }, [onComplete, prefersReducedMotion]);

  const handleSkip = useCallback(() => {
    if (disintegrateTimerRef.current) window.clearTimeout(disintegrateTimerRef.current);
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);

    // Quick disintegrate -> fade -> done sequence
    setPhase('disintegrating');
    
    fadeTimerRef.current = window.setTimeout(() => {
      setPhase('fading');
    }, 600);

    doneTimerRef.current = window.setTimeout(() => {
      setPhase('done');
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 600 + 400);
  }, [onComplete]);

  if (phase === 'done' || prefersReducedMotion) return null;

  const isDisintegrating = phase === 'disintegrating' || phase === 'fading';

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'fading' ? 0 : 1 }}
      transition={{ duration: FADE_DURATION_MS / 1000, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 bg-background cursor-pointer overflow-hidden"
      onClick={handleSkip}
    >
      {/* CSS Animations */}
      <style>{`
        @keyframes starScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes heroFlyIn {
          0% { 
            transform: translate(-200px, -50%);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% { 
            transform: translate(20vw, -50%);
            opacity: 1;
          }
        }
        
        @keyframes enemyFlyIn {
          0% { 
            transform: translate(100vw, -50%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% { 
            transform: translate(0, -50%);
            opacity: 1;
          }
        }
        
        @keyframes enemyExplode {
          0% { 
            opacity: 1;
            transform: translate(0, -50%) scale(1);
          }
          100% { 
            opacity: 0;
            transform: translate(0, -50%) scale(0);
          }
        }
        
        @keyframes laserBeamFire {
          0% { 
            transform: scaleX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% { 
            transform: scaleX(1);
            opacity: 0;
          }
        }
        
        @keyframes explosionFlash {
          0% { 
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.8;
          }
          100% { 
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        @keyframes explosionRing {
          0% { 
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 0.8;
          }
          100% { 
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
        
        @keyframes titleGlitchIn {
          0% { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
            filter: blur(10px);
          }
          20% { 
            opacity: 1;
            transform: translate(-48%, -50%) scale(1.02);
            filter: blur(0);
          }
          25% { 
            opacity: 0.8;
            transform: translate(-52%, -50%) scale(0.98);
          }
          30% { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes subtitleSlideUp {
          0% { 
            opacity: 0;
            transform: translateY(30px);
          }
          100% { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glowPulse {
          0%, 100% { 
            text-shadow: 0 0 20px hsl(var(--primary) / 0.5), 0 0 40px hsl(var(--primary) / 0.3);
          }
          50% { 
            text-shadow: 0 0 40px hsl(var(--primary) / 0.8), 0 0 80px hsl(var(--primary) / 0.5), 0 0 120px hsl(var(--primary) / 0.3);
          }
        }

        @keyframes particleDisintegrate {
          0% {
            opacity: var(--particle-opacity, 1);
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--particle-x, 50px), var(--particle-y, -50px)) scale(0);
          }
        }

        @keyframes textDissolve {
          0% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 0;
            filter: blur(4px);
          }
        }
        
        .hero-ship {
          animation: heroFlyIn 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          will-change: transform, opacity;
        }
        
        .enemy-1 {
          animation: enemyFlyIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards,
                     enemyExplode 0.2s ease-out 2s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .enemy-2 {
          animation: enemyFlyIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.8s forwards,
                     enemyExplode 0.2s ease-out 3s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .enemy-3 {
          animation: enemyFlyIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.8s forwards,
                     enemyExplode 0.2s ease-out 4s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .laser-wrapper {
          position: absolute;
          transform-origin: left center;
        }
        
        .laser-beam {
          width: 100%;
          height: 100%;
          transform-origin: left center;
          will-change: transform, opacity;
        }
        
        .laser-1 .laser-beam {
          animation: laserBeamFire 0.25s ease-out 1.8s forwards;
          opacity: 0;
        }
        
        .laser-2 .laser-beam {
          animation: laserBeamFire 0.25s ease-out 2.8s forwards;
          opacity: 0;
        }
        
        .laser-3 .laser-beam {
          animation: laserBeamFire 0.25s ease-out 3.8s forwards;
          opacity: 0;
        }
        
        .explosion-1 {
          animation: explosionFlash 0.5s ease-out 2s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .explosion-1-ring {
          animation: explosionRing 0.6s ease-out 2.05s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .explosion-2 {
          animation: explosionFlash 0.5s ease-out 3s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .explosion-2-ring {
          animation: explosionRing 0.6s ease-out 3.05s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .explosion-3 {
          animation: explosionFlash 0.5s ease-out 4s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .explosion-3-ring {
          animation: explosionRing 0.6s ease-out 4.05s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        .intro-title {
          animation: titleGlitchIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 4.5s forwards;
          opacity: 0;
          will-change: transform, opacity, filter;
        }
        
        .intro-title-main {
          animation: glowPulse 2s ease-in-out 5.3s infinite;
        }
        
        .intro-subtitle {
          animation: subtitleSlideUp 0.6s ease-out 5s forwards;
          opacity: 0;
          will-change: transform, opacity;
        }

        .intro-title.disintegrating .intro-title-main,
        .intro-title.disintegrating .intro-subtitle {
          animation: textDissolve 1.2s ease-out forwards;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .particle.active {
          animation: particleDisintegrate var(--particle-duration, 1s) ease-out var(--particle-delay, 0s) forwards;
        }
        
        .starfield-layer {
          animation: starScroll 8s linear infinite;
          will-change: transform;
        }
        
        .starfield-layer-fast {
          animation: starScroll 4s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* Starfield - Optimized with fewer elements */}
      <div className="absolute inset-0">
        {/* Layer 1 - Slow distant stars */}
        <div className="starfield-layer absolute" style={{ 
          width: '200%', 
          height: '100%',
          background: `
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 30% 45%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 70%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(2px 2px at 70% 30%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 15% 80%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(2px 2px at 85% 85%, rgba(255,255,255,0.5) 0%, transparent 100%)
          `
        }} />
        
        {/* Layer 2 - Fast close stars */}
        <div className="starfield-layer-fast absolute" style={{ 
          width: '200%', 
          height: '100%',
          background: `
            radial-gradient(2px 2px at 5% 35%, rgba(255,255,255,0.9) 0%, transparent 100%),
            radial-gradient(2.5px 2.5px at 25% 65%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(2px 2px at 55% 25%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(3px 3px at 75% 55%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(2px 2px at 95% 40%, rgba(255,255,255,0.9) 0%, transparent 100%)
          `
        }} />
        
        {/* Nebula effect */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse at 30% 40%, hsl(var(--primary) / 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, hsl(var(--accent) / 0.2) 0%, transparent 40%)'
        }} />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80 pointer-events-none" />

      {/* Hero Ship */}
      <div 
        className="hero-ship absolute"
        style={{ left: 0, top: '50%' }}
      >
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" style={{
          filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.6)) drop-shadow(0 0 20px hsl(var(--primary) / 0.6))'
        }}>
          <path d="M15 50 L35 35 L80 40 L95 50 L80 60 L35 65 Z" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="2"/>
          <ellipse cx="60" cy="50" rx="12" ry="8" fill="#001a33" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
          <path d="M40 35 L55 25 L70 35" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.8"/>
          <path d="M40 65 L55 75 L70 65" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.8"/>
          <ellipse cx="18" cy="50" rx="6" ry="10" fill="#00ffff" opacity="0.9">
            <animate attributeName="rx" values="6;8;6" dur="0.15s" repeatCount="indefinite"/>
          </ellipse>
        </svg>
      </div>

      {/* Enemy Ships */}
      <div className="enemy-1 absolute" style={{ right: '15%', top: '30%' }}>
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" style={{
          filter: 'drop-shadow(0 0 10px rgba(255, 68, 68, 0.6)) drop-shadow(0 0 20px rgba(255, 68, 68, 0.6))',
          transform: 'scaleX(-1)'
        }}>
          <path d="M15 50 L35 35 L80 40 L95 50 L80 60 L35 65 Z" fill="#ff4444" stroke="#ff4444" strokeWidth="2"/>
          <ellipse cx="60" cy="50" rx="12" ry="8" fill="#330000" stroke="#ff4444" strokeWidth="1.5"/>
          <ellipse cx="18" cy="50" rx="6" ry="10" fill="#ff6600" opacity="0.9"/>
        </svg>
      </div>

      <div className="enemy-2 absolute" style={{ right: '12%', top: '50%' }}>
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" style={{
          filter: 'drop-shadow(0 0 10px rgba(255, 68, 68, 0.6)) drop-shadow(0 0 20px rgba(255, 68, 68, 0.6))',
          transform: 'scaleX(-1)'
        }}>
          <path d="M15 50 L35 35 L80 40 L95 50 L80 60 L35 65 Z" fill="#ff4444" stroke="#ff4444" strokeWidth="2"/>
          <ellipse cx="60" cy="50" rx="12" ry="8" fill="#330000" stroke="#ff4444" strokeWidth="1.5"/>
          <ellipse cx="18" cy="50" rx="6" ry="10" fill="#ff6600" opacity="0.9"/>
        </svg>
      </div>

      <div className="enemy-3 absolute" style={{ right: '10%', top: '70%' }}>
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" style={{
          filter: 'drop-shadow(0 0 10px rgba(255, 68, 68, 0.6)) drop-shadow(0 0 20px rgba(255, 68, 68, 0.6))',
          transform: 'scaleX(-1)'
        }}>
          <path d="M15 50 L35 35 L80 40 L95 50 L80 60 L35 65 Z" fill="#ff4444" stroke="#ff4444" strokeWidth="2"/>
          <ellipse cx="60" cy="50" rx="12" ry="8" fill="#330000" stroke="#ff4444" strokeWidth="1.5"/>
          <ellipse cx="18" cy="50" rx="6" ry="10" fill="#ff6600" opacity="0.9"/>
        </svg>
      </div>

      {/* Laser Beams - wrapper holds rotation, inner beam animates scaleX */}
      {/* Laser 1: aims UP at enemy at top:30%, right:15% */}
      <div 
        className="laser-wrapper laser-1"
        style={{
          left: 'calc(20vw + 80px)',
          top: '50%',
          width: 'calc(65vw - 20vw)',
          height: '4px',
          transform: 'translateY(-50%) rotate(-15deg)',
        }}
      >
        <div 
          className="laser-beam"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--primary)), transparent)',
            boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))',
            borderRadius: '2px'
          }}
        />
      </div>
      
      {/* Laser 2: aims STRAIGHT at enemy at top:50%, right:12% */}
      <div 
        className="laser-wrapper laser-2"
        style={{
          left: 'calc(20vw + 80px)',
          top: '50%',
          width: 'calc(68vw - 20vw)',
          height: '4px',
          transform: 'translateY(-50%) rotate(0deg)',
        }}
      >
        <div 
          className="laser-beam"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--primary)), transparent)',
            boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))',
            borderRadius: '2px'
          }}
        />
      </div>
      
      {/* Laser 3: aims DOWN at enemy at top:70%, right:10% */}
      <div 
        className="laser-wrapper laser-3"
        style={{
          left: 'calc(20vw + 80px)',
          top: '50%',
          width: 'calc(70vw - 20vw)',
          height: '4px',
          transform: 'translateY(-50%) rotate(15deg)',
        }}
      >
        <div 
          className="laser-beam"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--primary)), transparent)',
            boxShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))',
            borderRadius: '2px'
          }}
        />
      </div>

      {/* Explosions */}
      <div className="explosion-1 absolute" style={{ right: '15%', top: '30%', width: '100px', height: '100px' }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, #ffaa00 30%, #ff4400 60%, transparent 100%)',
          boxShadow: '0 0 40px #ff6600, 0 0 80px #ff4400'
        }} />
      </div>
      <div className="explosion-1-ring absolute" style={{ 
        right: 'calc(15% + 20px)', 
        top: 'calc(30% + 20px)', 
        width: '60px', 
        height: '60px',
        borderRadius: '50%',
        border: '3px solid #ff8800',
        boxShadow: '0 0 20px #ff6600'
      }} />

      <div className="explosion-2 absolute" style={{ right: '12%', top: '50%', width: '100px', height: '100px' }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, #ffaa00 30%, #ff4400 60%, transparent 100%)',
          boxShadow: '0 0 40px #ff6600, 0 0 80px #ff4400'
        }} />
      </div>
      <div className="explosion-2-ring absolute" style={{ 
        right: 'calc(12% + 20px)', 
        top: 'calc(50% + 20px)', 
        width: '60px', 
        height: '60px',
        borderRadius: '50%',
        border: '3px solid #ff8800',
        boxShadow: '0 0 20px #ff6600'
      }} />

      <div className="explosion-3 absolute" style={{ right: '10%', top: '70%', width: '100px', height: '100px' }}>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, #ffaa00 30%, #ff4400 60%, transparent 100%)',
          boxShadow: '0 0 40px #ff6600, 0 0 80px #ff4400'
        }} />
      </div>
      <div className="explosion-3-ring absolute" style={{ 
        right: 'calc(10% + 20px)', 
        top: 'calc(70% + 20px)', 
        width: '60px', 
        height: '60px',
        borderRadius: '50%',
        border: '3px solid #ff8800',
        boxShadow: '0 0 20px #ff6600'
      }} />

      {/* Skip hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-sm animate-fade-in">
        Click anywhere to skip
      </div>

      {/* Title overlay with particle disintegration - CENTERED */}
      <div className={`intro-title absolute top-1/2 left-1/2 text-center ${isDisintegrating ? 'disintegrating' : ''}`}>
        {/* Title with particles */}
        <div className="relative">
          <h2 className="intro-title-main text-5xl sm:text-6xl md:text-8xl font-display font-bold text-gradient">
            MrVayn
          </h2>
          
          {/* Title disintegration particles */}
          {isDisintegrating && (
            <div className="absolute inset-0 pointer-events-none">
              {titleParticles.map((particle) => (
                <div
                  key={particle.id}
                  className="particle active"
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 100}%`,
                    top: `${50 + (Math.random() - 0.5) * 100}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))`,
                    boxShadow: `0 0 ${particle.size * 2}px hsl(var(--primary) / 0.8)`,
                    '--particle-x': `${particle.x * 3}px`,
                    '--particle-y': `${particle.y * 3}px`,
                    '--particle-delay': `${particle.delay}s`,
                    '--particle-duration': `${particle.duration}s`,
                    '--particle-opacity': particle.opacity,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>

        {/* Subtitle with particles */}
        <div className="relative mt-4">
          <p className="intro-subtitle text-xl sm:text-2xl md:text-3xl text-muted-foreground">
            Founder & Game Developer
          </p>
          
          {/* Subtitle disintegration particles */}
          {isDisintegrating && (
            <div className="absolute inset-0 pointer-events-none">
              {subtitleParticles.map((particle) => (
                <div
                  key={particle.id}
                  className="particle active"
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 100}%`,
                    top: `${50 + (Math.random() - 0.5) * 100}%`,
                    width: `${particle.size * 0.8}px`,
                    height: `${particle.size * 0.8}px`,
                    background: `hsl(var(--muted-foreground))`,
                    boxShadow: `0 0 ${particle.size}px hsl(var(--muted-foreground) / 0.5)`,
                    '--particle-x': `${particle.x * 2}px`,
                    '--particle-y': `${particle.y * 2}px`,
                    '--particle-delay': `${particle.delay + 0.2}s`,
                    '--particle-duration': `${particle.duration}s`,
                    '--particle-opacity': particle.opacity,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
