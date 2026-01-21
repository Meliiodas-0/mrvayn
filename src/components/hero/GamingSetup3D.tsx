import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

function GameController({ position = [0, 0, 0], isMobile = false }: { position?: [number, number, number]; isMobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const scale = isMobile ? 0.6 : 0.85;
  
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
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Left grip */}
        <mesh position={[-0.7, -0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Right grip */}
        <mesh position={[0.7, -0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* D-pad glow */}
        <mesh position={[-0.35, 0.1, 0.35]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>
        
        {/* Buttons */}
        {[
          { pos: [0.35, 0.15, 0.35], color: '#ff0080' },
          { pos: [0.45, 0.05, 0.35], color: '#00ff88' },
          { pos: [0.25, 0.05, 0.35], color: '#0080ff' },
          { pos: [0.35, -0.05, 0.35], color: '#ffff00' },
        ].map((btn, i) => (
          <mesh key={i} position={btn.pos as [number, number, number]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color={btn.color} emissive={btn.color} emissiveIntensity={1.5} />
          </mesh>
        ))}
        
        {/* Center button */}
        <mesh position={[0, 0.1, 0.4]}>
          <boxGeometry args={[0.12, 0.06, 0.02]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
        </mesh>
      </group>
    </Float>
  );
}

// Floating hexagons
function FloatingHexagons({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 4 : 8;
  const groupRef = useRef<THREE.Group>(null);
  
  const hexagons = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 3,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: 0.15 + Math.random() * 0.25,
      speed: 0.2 + Math.random() * 0.3,
      color: ['#00ffff', '#ff0080', '#a855f7', '#00ff88'][i % 4],
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {hexagons.map((hex, i) => (
        <Float key={i} speed={hex.speed} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={hex.position} rotation={hex.rotation} scale={hex.scale}>
            <cylinderGeometry args={[1, 1, 0.1, 6]} />
            <meshStandardMaterial
              color={hex.color}
              emissive={hex.color}
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Glowing orbital rings
function OrbitalRings({ isMobile = false }: { isMobile?: boolean }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  const scale = isMobile ? 0.7 : 1;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.15;
      ring1Ref.current.rotation.y = t * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.1;
      ring2Ref.current.rotation.z = t * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.08;
      ring3Ref.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <group scale={scale}>
      <mesh ref={ring1Ref} position={[0, 0.3, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} transparent opacity={0.7} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0.3, 0]}>
        <torusGeometry args={[2.6, 0.01, 16, 100]} />
        <meshStandardMaterial color="#ff0080" emissive="#ff0080" emissiveIntensity={1.5} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring3Ref} position={[0, 0.3, 0]}>
        <torusGeometry args={[3, 0.008, 16, 100]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Floating cubes
function FloatingCubes({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 3 : 6;
  
  const cubes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        -2 - Math.random() * 3,
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.2,
      color: ['#00ffff', '#ff0080', '#a855f7'][i % 3],
      rotationSpeed: 0.5 + Math.random() * 0.5,
    }));
  }, [count]);

  return (
    <>
      {cubes.map((cube, i) => (
        <Float key={i} speed={1} rotationIntensity={cube.rotationSpeed} floatIntensity={1.5}>
          <mesh position={cube.position} scale={cube.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={cube.color}
              emissive={cube.color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.5}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Energy orbs with trails
function EnergyOrbs({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 3 : 5;
  
  const orbs = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        -1 - Math.random() * 2,
      ] as [number, number, number],
      scale: 0.06 + Math.random() * 0.1,
      color: ['#00ffff', '#ff0080', '#00ff88', '#a855f7', '#ffff00'][i % 5],
    }));
  }, [count]);

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={0.5 + Math.random() * 0.5} rotationIntensity={0.2} floatIntensity={2}>
          <group position={orb.position}>
            {/* Core */}
            <mesh scale={orb.scale}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={orb.color}
                emissive={orb.color}
                emissiveIntensity={2}
              />
            </mesh>
            {/* Glow halo */}
            <mesh scale={orb.scale * 2}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial
                color={orb.color}
                emissive={orb.color}
                emissiveIntensity={0.5}
                transparent
                opacity={0.2}
              />
            </mesh>
          </group>
        </Float>
      ))}
    </>
  );
}

// Animated grid floor
function GridFloor() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 
        0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshStandardMaterial
        color="#00ffff"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// Vertical light beams
function LightBeams({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 2 : 4;
  
  const beams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (i - count / 2 + 0.5) * 3,
        0,
        -4,
      ] as [number, number, number],
      color: ['#00ffff', '#ff0080', '#a855f7', '#00ff88'][i % 4],
      height: 8 + Math.random() * 4,
    }));
  }, [count]);

  return (
    <>
      {beams.map((beam, i) => (
        <mesh key={i} position={beam.position}>
          <cylinderGeometry args={[0.02, 0.02, beam.height, 8]} />
          <meshStandardMaterial
            color={beam.color}
            emissive={beam.color}
            emissiveIntensity={1}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

function Scene({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
      <pointLight position={[-5, 5, 5]} intensity={1} color="#ff0080" />
      <pointLight position={[0, -3, 3]} intensity={0.5} color="#a855f7" />
      
      <GameController position={[0, 0.3, 0]} isMobile={isMobile} />
      <OrbitalRings isMobile={isMobile} />
      <FloatingHexagons isMobile={isMobile} />
      <FloatingCubes isMobile={isMobile} />
      <EnergyOrbs isMobile={isMobile} />
      <LightBeams isMobile={isMobile} />
      <GridFloor />
      
      <Sparkles
        count={isMobile ? 50 : 100}
        scale={12}
        size={1.5}
        speed={0.3}
        color="#00ffff"
        opacity={0.5}
      />
      
      <Environment preset="night" />
    </>
  );
}

export default function GamingSetup3D() {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 7 : 6], fov: isMobile ? 50 : 55 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}