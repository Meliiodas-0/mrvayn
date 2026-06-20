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

// Decorative spaceship SVG for sections
export function DecorativeSpaceship({ 
  className = '', 
  color = '#16e0c8',
  size = 'md',
  rotation = 0,
  style = {}
}: { 
  className?: string; 
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  rotation?: number;
  style?: React.CSSProperties;
}) {
  const sizeClass = size === 'sm' ? 'w-6 h-8' : size === 'lg' ? 'w-12 h-16' : 'w-8 h-12';
  
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={style}
      animate={{
        y: [0, -8, 0],
        rotate: [rotation - 5, rotation + 5, rotation - 5],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg 
        viewBox="0 0 24 36" 
        className={sizeClass}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      >
        {/* Fuselage */}
        <ellipse cx="12" cy="18" rx="4" ry="12" fill="#1a1a2e" />
        {/* Nose */}
        <path d="M12 2 L8 10 L16 10 Z" fill="#2a2a4e" />
        {/* Wings */}
        <path d="M8 16 L2 22 L2 26 L8 22 Z" fill="#1a1a2e" />
        <path d="M16 16 L22 22 L22 26 L16 22 Z" fill="#1a1a2e" />
        {/* Wing tips */}
        <circle cx="2" cy="24" r="2" fill={color} opacity="0.8" />
        <circle cx="22" cy="24" r="2" fill={color} opacity="0.8" />
        {/* Cockpit */}
        <ellipse cx="12" cy="10" rx="2" ry="3" fill={color} opacity="0.6" />
        {/* Engines */}
        <ellipse cx="10" cy="30" rx="1.5" ry="2" fill={color} />
        <ellipse cx="14" cy="30" rx="1.5" ry="2" fill={color} />
        {/* Engine trails */}
        <path d="M10 32 L10 36" stroke={color} strokeWidth="2" opacity="0.5" />
        <path d="M14 32 L14 36" stroke={color} strokeWidth="2" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

// Multiple decorative spaceships for a section
export function SectionSpaceships({ count = 4 }: { count?: number }) {
  const positions = [
    { top: '10%', left: '5%', rotation: 15, color: '#ff0080', size: 'md' as const },
    { top: '20%', right: '8%', rotation: -20, color: '#16e0c8', size: 'sm' as const },
    { bottom: '25%', left: '3%', rotation: 30, color: '#a855f7', size: 'lg' as const },
    { bottom: '15%', right: '5%', rotation: -10, color: '#00ff88', size: 'md' as const },
    { top: '40%', left: '2%', rotation: 45, color: '#ffff00', size: 'sm' as const },
    { top: '60%', right: '4%', rotation: -35, color: '#ff6600', size: 'md' as const },
  ];

  return (
    <>
      {positions.slice(0, count).map((pos, i) => (
        <DecorativeSpaceship
          key={i}
          style={{
            top: pos.top,
            bottom: pos.bottom,
            left: pos.left,
            right: pos.right,
          }}
          rotation={pos.rotation}
          color={pos.color}
          size={pos.size}
        />
      ))}
    </>
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