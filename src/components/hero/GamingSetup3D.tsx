import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
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
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Grips */}
        <mesh position={[-0.7, -0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.7, -0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* D-pad */}
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

// Enemy spaceship component
function EnemyShip({ 
  position, 
  onDestroy, 
  id,
  color 
}: { 
  position: [number, number, number]; 
  onDestroy: (id: number) => void;
  id: number;
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [isExploding, setIsExploding] = useState(false);
  const [explosionScale, setExplosionScale] = useState(0);
  
  useFrame((state) => {
    if (groupRef.current && !isExploding) {
      // Hovering motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + id) * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + id) * 0.1;
    }
    
    if (isExploding) {
      setExplosionScale(prev => {
        if (prev >= 1) {
          onDestroy(id);
          return prev;
        }
        return prev + 0.08;
      });
    }
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isExploding) {
      setIsExploding(true);
    }
  }, [isExploding]);

  if (isExploding) {
    return (
      <group position={position}>
        {/* Explosion particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 4) * explosionScale * 0.5,
              Math.sin(i * Math.PI / 4) * explosionScale * 0.5,
              0
            ]}
            scale={0.1 * (1 - explosionScale)}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial 
              color={color} 
              emissive={color} 
              emissiveIntensity={3}
              transparent
              opacity={1 - explosionScale}
            />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position} onClick={handleClick}>
      {/* Ship body */}
      <mesh rotation={[0, 0, Math.PI]} scale={0.25}>
        <coneGeometry args={[0.5, 1.2, 4]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -0.3]} scale={[0.3, 0.08, 0.15]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, 0.3]} scale={[0.3, 0.08, 0.15]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, 0.2, 0]} scale={0.08}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
      {/* Cockpit */}
      <mesh position={[0, -0.1, 0.08]} scale={0.08}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Enemy fleet manager
function EnemyFleet({ isMobile = false }: { isMobile?: boolean }) {
  const initialCount = isMobile ? 4 : 7;
  
  const [enemies, setEnemies] = useState(() => 
    Array.from({ length: initialCount }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        -2 - Math.random() * 2,
      ] as [number, number, number],
      color: ['#ff0080', '#00ffff', '#ffff00', '#00ff88', '#ff6600', '#a855f7', '#ff3366'][i % 7],
    }))
  );

  const handleDestroy = useCallback((id: number) => {
    setEnemies(prev => prev.filter(e => e.id !== id));
    
    // Respawn after delay
    setTimeout(() => {
      setEnemies(prev => [...prev, {
        id: Date.now(),
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4,
          -2 - Math.random() * 2,
        ] as [number, number, number],
        color: ['#ff0080', '#00ffff', '#ffff00', '#00ff88', '#ff6600', '#a855f7'][Math.floor(Math.random() * 6)],
      }]);
    }, 2000);
  }, []);

  return (
    <>
      {enemies.map((enemy) => (
        <EnemyShip
          key={enemy.id}
          id={enemy.id}
          position={enemy.position}
          color={enemy.color}
          onDestroy={handleDestroy}
        />
      ))}
    </>
  );
}

// Floating power-ups
function PowerUps({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 3 : 5;
  
  const powerUps = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        -3 - Math.random() * 2,
      ] as [number, number, number],
      type: ['health', 'shield', 'speed', 'power', 'coin'][i % 5],
      color: ['#00ff88', '#00ffff', '#ffff00', '#ff0080', '#ffd700'][i % 5],
    }));
  }, [count]);

  return (
    <>
      {powerUps.map((pu, i) => (
        <Float key={i} speed={1} rotationIntensity={2} floatIntensity={1}>
          <group position={pu.position} scale={0.15}>
            {/* Outer glow */}
            <mesh>
              <octahedronGeometry args={[1.5, 0]} />
              <meshStandardMaterial
                color={pu.color}
                emissive={pu.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.3}
                wireframe
              />
            </mesh>
            {/* Inner core */}
            <mesh>
              <octahedronGeometry args={[0.8, 0]} />
              <meshStandardMaterial
                color={pu.color}
                emissive={pu.color}
                emissiveIntensity={1.5}
              />
            </mesh>
          </group>
        </Float>
      ))}
    </>
  );
}

// Asteroid field
function Asteroids({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 4 : 8;
  const groupRef = useRef<THREE.Group>(null);
  
  const asteroids = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6,
        -4 - Math.random() * 3,
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.2,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
        child.rotation.y += 0.003 * (i % 2 === 0 ? -1 : 1);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {asteroids.map((ast, i) => (
        <mesh key={i} position={ast.position} rotation={ast.rotation} scale={ast.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#2a2a3e"
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Animated starfield grid
function StarfieldGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.z = ((state.clock.elapsedTime * 0.5) % 2) - 5;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -4, -5]}>
      <planeGeometry args={[50, 30, 50, 30]} />
      <meshStandardMaterial
        color="#00ffff"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

function Scene({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00ffff" />
      <pointLight position={[-5, 5, 5]} intensity={1} color="#ff0080" />
      <pointLight position={[0, -3, 3]} intensity={0.5} color="#a855f7" />
      
      <GameController position={[0, 0.3, 0]} isMobile={isMobile} />
      <EnemyFleet isMobile={isMobile} />
      <PowerUps isMobile={isMobile} />
      <Asteroids isMobile={isMobile} />
      <StarfieldGrid />
      
      <Sparkles
        count={isMobile ? 30 : 60}
        scale={15}
        size={1}
        speed={0.2}
        color="#ffffff"
        opacity={0.4}
      />
      
      <Environment preset="night" />
    </>
  );
}

export default function GamingSetup3D() {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 z-0 cursor-crosshair">
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