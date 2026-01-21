import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

function GameController({ position = [0, 0, 0], isMobile = false }: { position?: [number, number, number]; isMobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const scale = isMobile ? 0.7 : 1;
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={position} ref={groupRef} scale={scale}>
        {/* Controller body */}
        <mesh castShadow>
          <capsuleGeometry args={[0.4, 1.2, 8, 16]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Left grip */}
        <mesh position={[-0.7, -0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Right grip */}
        <mesh position={[0.7, -0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* D-pad glow */}
        <mesh position={[-0.35, 0.1, 0.35]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={1.2}
          />
        </mesh>
        
        {/* Buttons - simplified */}
        {[
          [0.35, 0.1, 0.35],
          [0.45, 0, 0.35],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial 
              color={['#ff0080', '#00ff88'][i]} 
              emissive={['#ff0080', '#00ff88'][i]}
              emissiveIntensity={1}
            />
          </mesh>
        ))}
        
        {/* Center button glow */}
        <mesh position={[0, 0.1, 0.4]}>
          <boxGeometry args={[0.12, 0.06, 0.02]} />
          <meshStandardMaterial 
            color="#a855f7" 
            emissive="#a855f7"
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingOrbs({ isMobile = false }: { isMobile?: boolean }) {
  const orbCount = isMobile ? 3 : 5;
  
  const orbs = useMemo(() => {
    return Array.from({ length: orbCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3 - 2,
      ] as [number, number, number],
      scale: 0.08 + Math.random() * 0.15,
      color: ['#00ffff', '#ff0080', '#a855f7'][i % 3],
      speed: 0.3 + Math.random() * 0.5,
    }));
  }, [orbCount]);

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.1} floatIntensity={1}>
          <mesh position={orb.position} scale={orb.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[30, 30, 20, 20]} />
      <meshStandardMaterial
        color="#0a0a1a"
        wireframe
        transparent
        opacity={0.2}
      />
    </mesh>
  );
}

function Scene({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#00ffff" />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#ff0080" />
      
      <GameController position={[0, 0.3, 0]} isMobile={isMobile} />
      <FloatingOrbs isMobile={isMobile} />
      <GridFloor />
      
      <Environment preset="night" />
    </>
  );
}

export default function GamingSetup3D() {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 6 : 5], fov: isMobile ? 50 : 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
