import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
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

// Detailed Enemy Spaceship component
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
  const engineGlowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current && !isExploding) {
      // Hovering motion
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + id) * 0.2;
      groupRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 1.2 + id * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5 + id) * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime + id) * 0.1;
    }
    
    // Engine glow pulsing
    if (engineGlowRef.current && !isExploding) {
      const scale = 0.12 + Math.sin(state.clock.elapsedTime * 8) * 0.03;
      engineGlowRef.current.scale.setScalar(scale);
    }
    
    if (isExploding) {
      setExplosionScale(prev => {
        if (prev >= 1) {
          onDestroy(id);
          return prev;
        }
        return prev + 0.06;
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
        {/* Explosion ring */}
        <mesh scale={explosionScale * 1.5}>
          <ringGeometry args={[0.8, 1, 16]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={3}
            transparent
            opacity={1 - explosionScale}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Explosion particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos(i * Math.PI / 6) * explosionScale * 0.8,
              Math.sin(i * Math.PI / 6) * explosionScale * 0.8,
              (Math.random() - 0.5) * explosionScale * 0.3
            ]}
            scale={0.08 * (1 - explosionScale * 0.8)}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? color : '#ffffff'} 
              emissive={color} 
              emissiveIntensity={2}
              transparent
              opacity={1 - explosionScale}
            />
          </mesh>
        ))}
        {/* Central flash */}
        <mesh scale={0.5 * (1 - explosionScale)}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff" 
            emissiveIntensity={5}
            transparent
            opacity={1 - explosionScale}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position} onClick={handleClick} scale={0.4}>
      {/* Main fuselage - elongated body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Nose cone */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.15, 0.35, 8]} />
        <meshStandardMaterial color="#2a2a4e" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Cockpit window */}
      <mesh position={[0, 0.3, 0.12]} rotation={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Left wing - angled */}
      <mesh position={[-0.35, 0, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.5, 0.03, 0.25]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Left wing tip */}
      <mesh position={[-0.55, -0.04, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.15, 0.02, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Right wing - angled */}
      <mesh position={[0.35, 0, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.5, 0.03, 0.25]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right wing tip */}
      <mesh position={[0.55, -0.04, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.15, 0.02, 0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      
      {/* Rear fins */}
      <mesh position={[0, -0.35, 0.12]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.03, 0.2, 0.15]} />
        <meshStandardMaterial color="#2a2a4e" metalness={0.8} />
      </mesh>
      <mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.03, 0.15, 0.12]} />
        <meshStandardMaterial color="#2a2a4e" metalness={0.8} />
      </mesh>
      <mesh position={[0.1, -0.3, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.03, 0.15, 0.12]} />
        <meshStandardMaterial color="#2a2a4e" metalness={0.8} />
      </mesh>
      
      {/* Engine housings */}
      <mesh position={[-0.18, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.15, 8]} />
        <meshStandardMaterial color="#0a0a1e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.18, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.15, 8]} />
        <meshStandardMaterial color="#0a0a1e" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Engine glow - left */}
      <mesh ref={engineGlowRef} position={[-0.18, -0.5, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Engine glow - right */}
      <mesh position={[0.18, -0.5, 0]} scale={0.12}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Engine trails */}
      <mesh position={[-0.18, -0.65, 0]} scale={[0.04, 0.2, 0.04]}>
        <coneGeometry args={[1, 1, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={2}
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh position={[0.18, -0.65, 0]} scale={[0.04, 0.2, 0.04]}>
        <coneGeometry args={[1, 1, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={2}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Weapon mounts on wings */}
      <mesh position={[-0.4, -0.02, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
        <meshStandardMaterial color="#3a3a5e" metalness={0.9} />
      </mesh>
      <mesh position={[0.4, -0.02, 0.08]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
        <meshStandardMaterial color="#3a3a5e" metalness={0.9} />
      </mesh>
    </group>
  );
}

// Generate positions spread across the entire viewport (avoiding center text area)
function generateSpreadPosition(isMobile: boolean, index: number, total: number): [number, number, number] {
  const spreadX = isMobile ? 6 : 8;
  const spreadY = isMobile ? 5 : 7; // Much larger vertical spread
  const centerExcludeX = isMobile ? 2 : 2.5;
  const centerExcludeY = isMobile ? 1.5 : 2;
  
  // Divide into zones: top-left, top-right, mid-left, mid-right, bottom-left, bottom-right
  const zone = index % 8;
  let x: number, y: number;
  
  switch (zone) {
    case 0: // Top left
      x = -spreadX + Math.random() * (spreadX - centerExcludeX);
      y = centerExcludeY + Math.random() * (spreadY - centerExcludeY);
      break;
    case 1: // Top right
      x = centerExcludeX + Math.random() * (spreadX - centerExcludeX);
      y = centerExcludeY + Math.random() * (spreadY - centerExcludeY);
      break;
    case 2: // Mid left (far)
      x = -spreadX + Math.random() * 1.5;
      y = (Math.random() - 0.5) * centerExcludeY * 2;
      break;
    case 3: // Mid right (far)
      x = spreadX - 1.5 + Math.random() * 1.5;
      y = (Math.random() - 0.5) * centerExcludeY * 2;
      break;
    case 4: // Bottom left
      x = -spreadX + Math.random() * (spreadX - centerExcludeX);
      y = -centerExcludeY - Math.random() * (spreadY - centerExcludeY);
      break;
    case 5: // Bottom right
      x = centerExcludeX + Math.random() * (spreadX - centerExcludeX);
      y = -centerExcludeY - Math.random() * (spreadY - centerExcludeY);
      break;
    case 6: // Far top center (above text)
      x = (Math.random() - 0.5) * 4;
      y = spreadY - Math.random() * 1.5;
      break;
    default: // Far bottom center (below text)
      x = (Math.random() - 0.5) * 4;
      y = -spreadY + Math.random() * 1.5;
      break;
  }
  
  return [x, y, -1 - Math.random() * 2];
}

// Enemy fleet manager
function EnemyFleet({ isMobile = false }: { isMobile?: boolean }) {
  const initialCount = isMobile ? 6 : 10;
  
  const [enemies, setEnemies] = useState(() => 
    Array.from({ length: initialCount }, (_, i) => ({
      id: i,
      position: generateSpreadPosition(isMobile, i, initialCount),
      color: ['#ff0080', '#00ffff', '#ffff00', '#00ff88', '#ff6600', '#a855f7', '#ff3366', '#00aaff'][i % 8],
    }))
  );

  const handleDestroy = useCallback((id: number) => {
    setEnemies(prev => prev.filter(e => e.id !== id));
    
    // Respawn after delay
    setTimeout(() => {
      const newId = Date.now();
      setEnemies(prev => [...prev, {
        id: newId,
        position: generateSpreadPosition(isMobile, Math.floor(Math.random() * 8), 8),
        color: ['#ff0080', '#00ffff', '#ffff00', '#00ff88', '#ff6600', '#a855f7', '#ff3366', '#00aaff'][Math.floor(Math.random() * 8)],
      }]);
    }, 2500);
  }, [isMobile]);

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

// Floating power-ups - spread throughout
function PowerUps({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 4 : 6;
  
  const powerUps = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: generateSpreadPosition(isMobile, i + 3, count),
      type: ['health', 'shield', 'speed', 'power', 'coin'][i % 5],
      color: ['#00ff88', '#00ffff', '#ffff00', '#ff0080', '#ffd700'][i % 5],
    }));
  }, [count, isMobile]);

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

// Asteroid field - spread throughout
function Asteroids({ isMobile = false }: { isMobile?: boolean }) {
  const count = isMobile ? 5 : 10;
  const groupRef = useRef<THREE.Group>(null);
  
  const asteroids = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const pos = generateSpreadPosition(isMobile, i + 5, count);
      return {
        position: [pos[0] * 1.1, pos[1] * 1.1, -3 - Math.random() * 2] as [number, number, number],
        scale: 0.08 + Math.random() * 0.15,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      };
    });
  }, [count, isMobile]);

  useFrame(() => {
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
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -5, -5]}>
      <planeGeometry args={[60, 40, 60, 40]} />
      <meshStandardMaterial
        color="#00ffff"
        wireframe
        transparent
        opacity={0.06}
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
        count={isMobile ? 40 : 80}
        scale={20}
        size={1}
        speed={0.2}
        color="#ffffff"
        opacity={0.3}
      />
      
      <Environment preset="night" />
    </>
  );
}

export default function GamingSetup3D() {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 z-0 cursor-none">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 8 : 7], fov: isMobile ? 55 : 60 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, isMobile ? 1.5 : 2]}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}