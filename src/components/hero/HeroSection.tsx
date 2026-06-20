import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crosshair, X, ArrowUpRight } from 'lucide-react';
import ShootableSpaceships from '@/components/ui/ShootableSpaceships';

// Safe zones for hero - central text only
const heroSafeZones = [
  { top: 24, left: 8, width: 84, height: 58 },
];

const roles = [
  'Founder & Game Developer',
  'Unreal Engine 5 Specialist',
  'Multiplayer Architect',
  'Niagara VFX & Cutscenes',
];

const techChips = ['Unreal Engine 5', 'C++', 'Multiplayer', 'Niagara VFX', 'Blender'];

// Lightweight typewriter that cycles through the roles.
function useTypewriter(words: string[], typeMs = 55, holdMs = 1600) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const phase = useRef<'typing' | 'holding' | 'deleting'>('typing');

  useEffect(() => {
    const word = words[index % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase.current === 'typing') {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), typeMs);
      } else {
        phase.current = 'holding';
        timeout = setTimeout(() => { phase.current = 'deleting'; setText(word.slice(0, word.length - 1)); }, holdMs);
      }
    } else if (phase.current === 'deleting') {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(word.slice(0, text.length - 1)), typeMs / 2);
      } else {
        phase.current = 'typing';
        setIndex((i) => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, index, words, typeMs, holdMs]);

  return text;
}

interface HeroSectionProps {
  introComplete?: boolean;
}

export default function HeroSection({ introComplete = true }: HeroSectionProps) {
  const [showHint, setShowHint] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const role = useTypewriter(roles);

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
      {/* Shootable Spaceships */}
      <ShootableSpaceships sectionId="hero" count={6} safeZones={heroSafeZones} />

      {/* HUD corner brackets framing the viewport */}
      <div className="absolute inset-4 sm:inset-6 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-t-2 border-primary/25" />
        <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-primary/25" />
        <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-b-2 border-primary/25" />
        <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-b-2 border-primary/25" />
      </div>

      {/* Shooting hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="glass-strong border border-primary/30 rounded-lg px-4 py-2.5 flex items-center gap-3">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Crosshair className="w-4 h-4 text-primary" />
              </motion.div>
              <div className="text-xs sm:text-sm whitespace-nowrap">
                <span className="text-foreground font-medium">Click the enemy ships</span>
                <span className="text-muted-foreground"> to destroy them!</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowHint(false); }}
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss hint"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto pointer-events-none">
        {/* Status line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-5 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
          <span>System Online</span>
          <span className="text-primary/40">//</span>
          <span className="text-primary/70">Portfolio v2.0</span>
        </motion.div>

        {/* Role tag (typewriter) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-6"
        >
          <span className="inline-flex items-center px-4 py-2 text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-primary/80 border border-primary/25 bg-primary/5 rounded-sm min-h-[2.25rem]">
            {role || ' '}
            <span className="ml-0.5 w-2 h-4 bg-primary/70 animate-pulse" />
          </span>
        </motion.div>

        {/* NAME */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-5"
        >
          <span className="block text-fluid-hero font-display font-bold tracking-tight">
            <span className="text-foreground">Hi, I'm </span>
            <span className="text-gradient text-glow-strong">MrVayn</span>
          </span>
          {/* Scanning underline */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 1, ease: 'easeOut' }}
            className="block mx-auto mt-4 h-px w-40 sm:w-56 origin-center bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-sm sm:text-base md:text-lg text-foreground/70 mb-7 max-w-lg mx-auto font-normal leading-relaxed"
        >
          Building next-gen game experiences with{' '}
          <span className="text-foreground font-medium">strong tech foundations</span>
        </motion.p>

        {/* Tech chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
        >
          {techChips.map((chip) => (
            <span
              key={chip}
              className="px-3 py-1 text-[10px] sm:text-xs font-mono text-muted-foreground border border-border/60 bg-card/40 rounded-full"
            >
              {chip}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center pointer-events-auto"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] rounded-sm"
          >
            View Projects
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#about"
            className="px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider border border-foreground/20 text-foreground/70 hover:border-primary/40 hover:text-primary transition-all duration-300 rounded-sm"
          >
            About Me
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-primary transition-colors"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}
