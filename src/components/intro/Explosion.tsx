import { motion } from 'framer-motion';

interface ExplosionProps {
  x: number;
  y: number;
  size?: number;
  delay?: number;
  onComplete?: () => void;
}

export default function Explosion({ x, y, size = 80, delay = 0, onComplete }: ExplosionProps) {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i * 30) * (Math.PI / 180),
    distance: 20 + Math.random() * 30,
    size: 4 + Math.random() * 8,
    duration: 0.4 + Math.random() * 0.3,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
      }}
      onAnimationComplete={() => setTimeout(onComplete, 600)}
    >
      {/* Central flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.5, 2], opacity: [1, 0.8, 0] }}
        transition={{ duration: 0.4, delay, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, #ffaa00 30%, #ff4400 60%, transparent 100%)',
          boxShadow: '0 0 40px #ff6600, 0 0 80px #ff4400',
        }}
      />
      
      {/* Particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1, 
            opacity: 1 
          }}
          animate={{ 
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            scale: 0,
            opacity: 0,
          }}
          transition={{ 
            duration: particle.duration, 
            delay: delay + 0.05,
            ease: 'easeOut' 
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: particle.size,
            height: particle.size,
            marginLeft: -particle.size / 2,
            marginTop: -particle.size / 2,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#ffaa00' : '#ff6600',
            boxShadow: `0 0 ${particle.size}px ${i % 2 === 0 ? '#ffaa00' : '#ff6600'}`,
          }}
        />
      ))}
      
      {/* Ring expansion */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.8 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.1, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: '50%',
          border: '3px solid #ff8800',
          boxShadow: '0 0 20px #ff6600',
        }}
      />
    </motion.div>
  );
}
