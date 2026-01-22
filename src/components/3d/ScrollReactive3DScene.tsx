import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, useScroll, useTransform } from 'framer-motion';

// Parallax starfield that reacts to scroll
function ParallaxStars({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const stars = useMemo(() => {
    return Array.from({ length: 200 }, () => ({
      position: [
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30 - 10,
      ] as [number, number, number],
      size: Math.random() * 0.03 + 0.01,
      speed: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Parallax based on scroll
      groupRef.current.position.y = scrollProgress * 15;
      groupRef.current.rotation.z = scrollProgress * 0.1;
      
      // Subtle breathing animation
      groupRef.current.children.forEach((child, i) => {
        const star = child as THREE.Mesh;
        const baseScale = stars[i]?.size || 0.02;
        const pulse = Math.sin(state.clock.elapsedTime * 2 + i) * 0.3 + 1;
        star.scale.setScalar(baseScale * pulse);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <mesh key={i} position={star.position}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial 
            color={i % 5 === 0 ? '#00ffff' : i % 7 === 0 ? '#a855f7' : '#ffffff'} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating nebula clouds
function NebulaCloud({ position, color, scrollProgress }: { 
  position: [number, number, number]; 
  color: string;
  scrollProgress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
      meshRef.current.position.y = position[1] + scrollProgress * 3;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

// Energy particles floating around
function EnergyParticles({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = isMobile ? 30 : 60;
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 5,
      ] as [number, number, number],
      size: Math.random() * 0.05 + 0.02,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.3,
      color: ['#00ffff', '#a855f7', '#ff0080', '#00ff88'][i % 4],
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        if (particle) {
          const mesh = child as THREE.Mesh;
          // Floating motion
          mesh.position.y = particle.position[1] + 
            Math.sin(state.clock.elapsedTime * particle.speed + particle.phase) * 2 +
            scrollProgress * 5;
          mesh.position.x = particle.position[0] + 
            Math.cos(state.clock.elapsedTime * particle.speed * 0.5 + particle.phase) * 1;
          
          // Pulse
          const scale = particle.size * (1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3);
          mesh.scale.setScalar(scale);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Geometric floating shapes
function FloatingGeometry({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) {
  const count = isMobile ? 6 : 12;
  
  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        -8 - Math.random() * 10,
      ] as [number, number, number],
      type: ['octahedron', 'tetrahedron', 'icosahedron'][i % 3],
      color: ['#00ffff', '#a855f7', '#ff0080'][i % 3],
      scale: 0.2 + Math.random() * 0.3,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));
  }, [count]);

  return (
    <>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <mesh 
            position={[
              shape.position[0], 
              shape.position[1] + scrollProgress * 8, 
              shape.position[2]
            ]} 
            scale={shape.scale}
          >
            {shape.type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 'tetrahedron' && <tetrahedronGeometry args={[1, 0]} />}
            {shape.type === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
            <meshBasicMaterial
              color={shape.color}
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Grid floor with parallax
function InfiniteGrid({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.z = ((state.clock.elapsedTime * 0.3) % 2) - 15 + scrollProgress * 5;
    }
  });

  const opacity = Math.max(0.02, 0.08 - scrollProgress * 0.03);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -8, -15]}>
      <planeGeometry args={[100, 80, 80, 60]} />
      <meshBasicMaterial
        color="#00ffff"
        wireframe
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

// Scene component that receives scroll progress
function Scene({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) {
  // Color transition based on scroll - cyan -> purple -> pink
  const sectionColor = useMemo(() => {
    if (scrollProgress < 0.3) return '#00ffff';
    if (scrollProgress < 0.6) return '#a855f7';
    return '#ff0080';
  }, [scrollProgress]);

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.2} />
      
      {/* Dynamic colored point light based on section */}
      <pointLight position={[0, 5, 5]} intensity={0.5} color={sectionColor} />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#a855f7" />
      <pointLight position={[10, 5, -5]} intensity={0.3} color="#00ffff" />
      
      {/* Parallax starfield */}
      <ParallaxStars scrollProgress={scrollProgress} />
      
      {/* Nebula clouds */}
      <NebulaCloud position={[-15, 10, -20]} color="#00ffff" scrollProgress={scrollProgress} />
      <NebulaCloud position={[20, -5, -25]} color="#a855f7" scrollProgress={scrollProgress} />
      <NebulaCloud position={[-10, -15, -18]} color="#ff0080" scrollProgress={scrollProgress} />
      
      {/* Energy particles */}
      <EnergyParticles scrollProgress={scrollProgress} isMobile={isMobile} />
      
      {/* Floating geometric shapes */}
      <FloatingGeometry scrollProgress={scrollProgress} isMobile={isMobile} />
      
      {/* Infinite grid */}
      <InfiniteGrid scrollProgress={scrollProgress} />
    </>
  );
}

export default function ScrollReactive3DScene() {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  
  // Convert MotionValue to number for Three.js
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        gl={{ 
          antialias: !isMobile,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        <ScrollReactiveScene scrollProgress={scrollProgress} isMobile={isMobile} />
      </Canvas>
    </motion.div>
  );
}

// Inner component to use scrollProgress inside Canvas
function ScrollReactiveScene({ scrollProgress, isMobile }: { scrollProgress: any; isMobile: boolean }) {
  const scrollValue = useRef(0);
  
  useFrame(() => {
    scrollValue.current = scrollProgress.get();
  });
  
  return <Scene scrollProgress={scrollValue.current} isMobile={isMobile} />;
}
