import { useRef, useMemo, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

type ScrollRef = MutableRefObject<number>;

// Parallax starfield that reacts to scroll
function ParallaxStars({ scrollRef }: { scrollRef: ScrollRef }) {
  const groupRef = useRef<THREE.Group>(null);

  const stars = useMemo(() => {
    return Array.from({ length: 200 }, () => ({
      position: [
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30 - 10,
      ] as [number, number, number],
      size: Math.random() * 0.03 + 0.01,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const s = scrollRef.current;
      groupRef.current.position.y = s * 15;
      groupRef.current.rotation.z = s * 0.12;
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
            color={i % 5 === 0 ? '#ff8a1e' : i % 7 === 0 ? '#16e0c8' : '#ffffff'}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

// Soft glowing nebula cloud (additive so it reads as light, not a dark disc)
function NebulaCloud({ position, color, scrollRef }: {
  position: [number, number, number];
  color: string;
  scrollRef: ScrollRef;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
      meshRef.current.position.y = position[1] + scrollRef.current * 3;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[4, 24, 24]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.07}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Energy particles floating around
function EnergyParticles({ scrollRef, isMobile }: { scrollRef: ScrollRef; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = isMobile ? 28 : 60;

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
      color: ['#ff8a1e', '#16e0c8', '#ff2d78', '#ffc24d'][i % 4],
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      const s = scrollRef.current;
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        if (particle) {
          const mesh = child as THREE.Mesh;
          mesh.position.y =
            particle.position[1] +
            Math.sin(state.clock.elapsedTime * particle.speed + particle.phase) * 2 +
            s * 5;
          mesh.position.x =
            particle.position[0] +
            Math.cos(state.clock.elapsedTime * particle.speed * 0.5 + particle.phase) * 1;
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
          <meshBasicMaterial color={particle.color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// Geometric floating shapes
function FloatingGeometry({ scrollRef, isMobile }: { scrollRef: ScrollRef; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = isMobile ? 6 : 12;

  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        -8 - Math.random() * 10,
      ] as [number, number, number],
      type: ['octahedron', 'tetrahedron', 'icosahedron'][i % 3],
      color: ['#ff8a1e', '#16e0c8', '#ff2d78'][i % 3],
      scale: 0.2 + Math.random() * 0.3,
    }));
  }, [count]);

  // Scroll-driven vertical drift for the whole group.
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = scrollRef.current * 8;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={shape.position} scale={shape.scale}>
            {shape.type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 'tetrahedron' && <tetrahedronGeometry args={[1, 0]} />}
            {shape.type === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
            <meshBasicMaterial color={shape.color} wireframe transparent opacity={0.32} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Grid floor with parallax
function InfiniteGrid({ scrollRef }: { scrollRef: ScrollRef }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.z = ((state.clock.elapsedTime * 0.3) % 2) - 15 + scrollRef.current * 5;
    }
    if (matRef.current) {
      matRef.current.opacity = Math.max(0.02, 0.09 - scrollRef.current * 0.04);
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -8, -15]}>
      <planeGeometry args={[100, 80, 80, 60]} />
      <meshBasicMaterial ref={matRef} color="#16e0c8" wireframe transparent opacity={0.1} />
    </mesh>
  );
}

// Color-shifting key light that tracks scroll position through the sections.
function SectionLight({ scrollRef }: { scrollRef: ScrollRef }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const amber = useMemo(() => new THREE.Color('#ff8a1e'), []);
  const teal = useMemo(() => new THREE.Color('#16e0c8'), []);
  const magenta = useMemo(() => new THREE.Color('#ff2d78'), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (lightRef.current) {
      const s = scrollRef.current;
      if (s < 0.5) {
        tmp.copy(amber).lerp(teal, s / 0.5);
      } else {
        tmp.copy(teal).lerp(magenta, (s - 0.5) / 0.5);
      }
      lightRef.current.color.copy(tmp);
    }
  });

  return <pointLight ref={lightRef} position={[0, 5, 5]} intensity={0.7} />;
}

// Camera rig: gentle pointer parallax for depth.
function CameraRig() {
  useFrame((state) => {
    const px = state.pointer.x;
    const py = state.pointer.y;
    state.camera.position.x += (px * 1.2 - state.camera.position.x) * 0.03;
    state.camera.position.y += (py * 0.8 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ scrollRef, isMobile }: { scrollRef: ScrollRef; isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <SectionLight scrollRef={scrollRef} />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#16e0c8" />
      <pointLight position={[10, 5, -5]} intensity={0.3} color="#ff8a1e" />

      <ParallaxStars scrollRef={scrollRef} />

      <NebulaCloud position={[-15, 10, -20]} color="#ff8a1e" scrollRef={scrollRef} />
      <NebulaCloud position={[20, -5, -25]} color="#16e0c8" scrollRef={scrollRef} />
      <NebulaCloud position={[-10, -15, -18]} color="#ff2d78" scrollRef={scrollRef} />

      <EnergyParticles scrollRef={scrollRef} isMobile={isMobile} />
      <FloatingGeometry scrollRef={scrollRef} isMobile={isMobile} />
      <InfiniteGrid scrollRef={scrollRef} />
      {!isMobile && <CameraRig />}
    </>
  );
}

export default function ScrollReactive3DScene() {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  const scrollRef = useRef(0);

  // Keep a plain-number mirror of the scroll MotionValue that the r3f frame
  // loop can read live every frame (the previous version read a stale React
  // render snapshot, so the scene never actually reacted to scroll).
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollRef.current = v;
  });

  return (
    <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.85 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance', alpha: true }}
      >
        <Scene scrollRef={scrollRef} isMobile={isMobile} />
      </Canvas>
    </motion.div>
  );
}
