import { motion } from 'framer-motion';

interface IntroSpaceshipProps {
  variant: 'hero' | 'enemy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export default function IntroSpaceship({ variant, size = 'md', className = '', style }: IntroSpaceshipProps) {
  const sizeMap = { sm: 40, md: 60, lg: 80 };
  const dimension = sizeMap[size];
  
  const isHero = variant === 'hero';
  const primaryColor = isHero ? 'hsl(var(--primary))' : '#ff4444';
  const glowColor = isHero ? 'hsl(var(--primary) / 0.6)' : 'rgba(255, 68, 68, 0.6)';
  const engineColor = isHero ? '#00ffff' : '#ff6600';

  return (
    <motion.div 
      className={className} 
      style={{ width: dimension, height: dimension, ...style }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          width: '100%', 
          height: '100%',
          filter: `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 20px ${glowColor})`,
          transform: isHero ? 'scaleX(1)' : 'scaleX(-1)',
        }}
      >
        {/* Ship body */}
        <path
          d={isHero 
            ? "M15 50 L35 35 L80 40 L95 50 L80 60 L35 65 Z"
            : "M15 50 L35 35 L80 40 L95 50 L80 60 L35 65 Z"
          }
          fill={primaryColor}
          stroke={primaryColor}
          strokeWidth="2"
        />
        
        {/* Cockpit */}
        <ellipse
          cx={isHero ? "60" : "60"}
          cy="50"
          rx="12"
          ry="8"
          fill={isHero ? '#001a33' : '#330000'}
          stroke={primaryColor}
          strokeWidth="1.5"
        />
        
        {/* Wing details */}
        <path
          d="M40 35 L55 25 L70 35"
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          opacity="0.8"
        />
        <path
          d="M40 65 L55 75 L70 65"
          fill="none"
          stroke={primaryColor}
          strokeWidth="2"
          opacity="0.8"
        />
        
        {/* Engine glow */}
        <ellipse
          cx="18"
          cy="50"
          rx="6"
          ry="10"
          fill={engineColor}
          opacity="0.9"
        >
          <animate
            attributeName="rx"
            values="6;8;6"
            dur="0.15s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9;1;0.9"
            dur="0.1s"
            repeatCount="indefinite"
          />
        </ellipse>
        
        {/* Engine trail */}
        <ellipse
          cx="8"
          cy="50"
          rx="4"
          ry="6"
          fill={engineColor}
          opacity="0.5"
        >
          <animate
            attributeName="rx"
            values="4;6;4"
            dur="0.12s"
            repeatCount="indefinite"
          />
        </ellipse>
      </svg>
    </motion.div>
  );
}
