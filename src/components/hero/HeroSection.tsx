import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Gamepad2, Crosshair, X } from 'lucide-react';
import GamingSetup3D from './GamingSetup3D';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

// Safe zones for hero - central text and buttons only
const heroSafeZones = [
  { top: 30, left: 20, width: 60, height: 45 }, // Central content area
];

export default function HeroSection() {
  const [showHint, setShowHint] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Hide hint after first interaction or after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSectionClick = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowHint(false);
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onClick={handleSectionClick}
    >
      {/* 3D Background */}
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      }>
        <GamingSetup3D />
      </Suspense>
      
      {/* Shootable Spaceships */}
      <ShootableSpaceships sectionId="hero" count={6} safeZones={heroSafeZones} />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background pointer-events-none z-10" />

      {/* Shooting hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="glass rounded-xl px-4 py-3 border border-primary/30 flex items-center gap-3 group">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Crosshair className="w-5 h-5 text-primary" />
              </motion.div>
              <div className="text-sm">
                <span className="text-foreground font-medium">Click the enemy ships</span>
                <span className="text-muted-foreground"> to destroy them!</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowHint(false); }}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-sm text-primary font-medium">
            <Gamepad2 className="w-4 h-4" />
            Game Developer & Creative Technologist
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 tracking-tight"
        >
          <span className="text-foreground">Hi, I'm </span>
          <span className="text-gradient">Your Name</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Crafting immersive gaming experiences and interactive digital worlds. 
          Specializing in game development, 3D environments, and creative coding.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
        >
          <a
            href="#projects"
            className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold hover-glow glow-primary transition-all duration-300 hover:scale-105"
          >
            View My Work
          </a>
          <a
            href="#about"
            className="px-8 py-4 rounded-lg glass neon-border font-semibold hover-glow transition-all duration-300 hover:scale-105"
          >
            About Me
          </a>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.a>
      </motion.div>
    </section>
  );
}