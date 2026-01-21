import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function GameController({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} ref={groupRef}>
        {/* Controller body */}
        <mesh castShadow>
          <capsuleGeometry args={[0.4, 1.2, 8, 16]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Left grip */}
        <mesh position={[-0.7, -0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Right grip */}
        <mesh position={[0.7, -0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* D-pad glow */}
        <mesh position={[-0.35, 0.1, 0.35]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={2}
          />
        </mesh>
        
        {/* Buttons */}
        {[
          [0.35, 0.15, 0.35],
          [0.45, 0.05, 0.35],
          [0.25, 0.05, 0.35],
          [0.35, -0.05, 0.35],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial 
              color={['#ff0080', '#00ff00', '#0080ff', '#ffff00'][i]} 
              emissive={['#ff0080', '#00ff00', '#0080ff', '#ffff00'][i]}
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}
        
        {/* Analog sticks */}
        <mesh position={[-0.2, -0.1, 0.35]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 32]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.15, -0.25, 0.35]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 32]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Center button glow */}
        <mesh position={[0, 0.1, 0.4]}>
          <boxGeometry args={[0.15, 0.08, 0.02]} />
          <meshStandardMaterial 
            color="#a855f7" 
            emissive="#a855f7"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingOrbs() {
  const orbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 2,
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.3,
      color: ['#00ffff', '#ff0080', '#a855f7', '#00ff88'][i % 4],
      speed: 0.5 + Math.random() * 1,
    }));
  }, []);

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.2} floatIntensity={2}>
          <mesh position={orb.position} scale={orb.scale}>
            <sphereGeometry args={[1, 32, 32]} />
            <MeshDistortMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.5}
              distort={0.4}
              speed={2}
              transparent
              opacity={0.6}
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
      <planeGeometry args={[50, 50, 50, 50]} />
      <meshStandardMaterial
        color="#0a0a1a"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
      <pointLight position={[-5, 5, 5]} intensity={1} color="#ff0080" />
      <pointLight position={[0, -3, 5]} intensity={0.5} color="#a855f7" />
      
      <GameController position={[0, 0.5, 0]} />
      <FloatingOrbs />
      <GridFloor />
      
      <Sparkles
        count={100}
        scale={10}
        size={2}
        speed={0.5}
        color="#00ffff"
      />
      
      <Environment preset="night" />
    </>
  );
}

export default function GamingSetup3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
