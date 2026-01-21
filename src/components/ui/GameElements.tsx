import { motion } from 'framer-motion';

// Floating pixel decorations for sections
export function FloatingPixels({ count = 6, color = 'primary' }: { count?: number; color?: string }) {
  const colorClass = color === 'primary' ? 'bg-primary' : color === 'secondary' ? 'bg-secondary' : 'bg-accent';
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 sm:w-2 sm:h-2 ${colorClass} opacity-20`}
          style={{
            left: `${10 + (i * 15) % 80}%`,
            top: `${10 + (i * 20) % 80}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

// Scan line effect
export function ScanLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
        }}
      />
    </div>
  );
}

// Corner brackets decoration
export function CornerBrackets({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Top left */}
      <div className="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-t-2 border-primary/30" />
      {/* Top right */}
      <div className="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-t-2 border-primary/30" />
      {/* Bottom left */}
      <div className="absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-l-2 border-b-2 border-primary/30" />
      {/* Bottom right */}
      <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-r-2 border-b-2 border-primary/30" />
    </div>
  );
}

// Animated health bar style progress
export function GamingProgress({ value, max, label }: { value: number; max: number; label: string }) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="relative">
      <div className="flex justify-between mb-1 text-xs sm:text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-primary font-mono">{value}/{max}</span>
      </div>
      <div className="h-2 sm:h-3 bg-muted/50 rounded overflow-hidden border border-primary/20">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-primary to-secondary relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}

// Achievement badge
export function AchievementBadge({ icon: Icon, title, unlocked = true }: { icon: React.ElementType; title: string; unlocked?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative p-3 sm:p-4 rounded-lg border ${
        unlocked 
          ? 'bg-primary/10 border-primary/30 text-primary' 
          : 'bg-muted/30 border-muted text-muted-foreground'
      }`}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
      <p className="text-[10px] sm:text-xs text-center font-medium">{title}</p>
      {unlocked && (
        <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full animate-pulse" />
      )}
    </motion.div>
  );
}

// Retro button style
export function RetroButton({ children, onClick, variant = 'primary' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative px-4 sm:px-6 py-2 sm:py-3 font-bold text-sm sm:text-base uppercase tracking-wider
        ${variant === 'primary' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-transparent border-2 border-primary text-primary'}
        clip-path-retro overflow-hidden group
      `}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
    </motion.button>
  );
}

// XP/Level indicator
export function LevelIndicator({ level, xp, maxXp }: { level: number; xp: number; maxXp: number }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
        <span className="text-primary font-bold text-sm sm:text-base">{level}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mb-1">
          <span>Level {level}</span>
          <span>{xp} / {maxXp} XP</span>
        </div>
        <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${(xp / maxXp) * 100}%` }}
            viewport={{ once: true }}
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
          />
        </div>
      </div>
    </div>
  );
}

// Glitch text effect
export function GlitchText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute top-0 left-0 -ml-[2px] text-primary opacity-70 animate-pulse"
        aria-hidden
      >
        {children}
      </span>
      <span 
        className="absolute top-0 left-0 ml-[2px] text-secondary opacity-70 animate-pulse"
        style={{ animationDelay: '0.1s' }}
        aria-hidden
      >
        {children}
      </span>
    </span>
  );
}