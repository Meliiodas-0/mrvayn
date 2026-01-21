import { motion } from 'framer-motion';

interface LaserBeamProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  delay?: number;
  duration?: number;
  onComplete?: () => void;
}

export default function LaserBeam({ 
  startX, 
  startY, 
  endX, 
  endY, 
  color = '#00ffff',
  delay = 0,
  duration = 0.2,
  onComplete
}: LaserBeamProps) {
  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 1] }}
      transition={{ 
        duration: duration,
        delay: delay,
        times: [0, 0.1, 0.8, 1],
        ease: 'easeOut'
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        width: distance,
        height: 4,
        transformOrigin: 'left center',
        transform: `rotate(${angle}deg)`,
      }}
    >
      {/* Laser core */}
      <div 
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${color}, ${color}, transparent)`,
          borderRadius: 2,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
        }}
      />
      {/* Laser glow */}
      <div 
        style={{
          position: 'absolute',
          top: -4,
          left: 0,
          width: '100%',
          height: 12,
          background: `linear-gradient(90deg, transparent, ${color}40, ${color}40, transparent)`,
          borderRadius: 6,
          filter: 'blur(4px)',
        }}
      />
    </motion.div>
  );
}
