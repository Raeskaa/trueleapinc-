import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { getWorldDots, latLngToVector3, getArcPoints } from './worldDots';
import { 
  networkClusters, 
  networkConnections, 
  getClusterById, 
  getHeatIntensity,
  type NetworkCluster 
} from './networkData';
import { colors } from '../../lib/theme';

const GLOBE_RADIUS = 2;
const COLORS = colors.globe;

interface GlobeSceneProps {
  onClusterClick?: (cluster: NetworkCluster) => void;
  selectedCluster?: string | null;
}

// Instanced mesh for world dots (performance optimization)
function WorldDots() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dots = useMemo(() => getWorldDots(), []);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    dots.forEach((dot, i) => {
      const [x, y, z] = latLngToVector3(dot[0], dot[1], GLOBE_RADIUS);
      dummy.position.set(x, y, z);
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dots, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, dots.length]}>
      <circleGeometry args={[0.015, 6]} />
      <meshBasicMaterial color={COLORS.land} transparent opacity={0.6} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

// Network cluster points with glow effect
function ClusterPoints({ 
  onClusterClick, 
  selectedCluster 
}: { 
  onClusterClick?: (cluster: NetworkCluster) => void;
  selectedCluster?: string | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const { camera } = useThree();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Pulse animation
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const cluster = networkClusters[i];
        const isSelected = cluster?.id === selectedCluster;
        const isHovered = cluster?.id === hovered;
        
        const baseScale = 0.03 + getHeatIntensity(cluster?.nodes || 0) * 0.04;
        const pulse = Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.005;
        const scale = baseScale + pulse + (isHovered || isSelected ? 0.02 : 0);
        
        child.scale.setScalar(scale);
      }
    });
  });
  
  const handleClick = useCallback((cluster: NetworkCluster) => {
    onClusterClick?.(cluster);
  }, [onClusterClick]);

  return (
    <group ref={groupRef}>
      {networkClusters.map((cluster) => {
        const [x, y, z] = latLngToVector3(cluster.lat, cluster.lng, GLOBE_RADIUS + 0.02);
        const intensity = getHeatIntensity(cluster.nodes);
        const isSelected = cluster.id === selectedCluster;
        const isHovered = cluster.id === hovered;
        
        return (
          <group key={cluster.id} position={[x, y, z]}>
            {/* Glow ring */}
            <mesh
              scale={0.08 + intensity * 0.06}
              onPointerOver={() => setHovered(cluster.id)}
              onPointerOut={() => setHovered(null)}
              onClick={() => handleClick(cluster)}
            >
              <ringGeometry args={[0.8, 1, 32]} />
              <meshBasicMaterial 
                color={COLORS.clusterBright} 
                transparent 
                opacity={(isHovered || isSelected ? 0.6 : 0.3) * intensity}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* Core dot */}
            <mesh
              scale={0.03 + intensity * 0.04}
              onPointerOver={() => setHovered(cluster.id)}
              onPointerOut={() => setHovered(null)}
              onClick={() => handleClick(cluster)}
            >
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial 
                color={isHovered || isSelected ? COLORS.clusterBright : COLORS.cluster}
              />
            </mesh>
            
            {/* Outer glow for large clusters */}
            {intensity > 0.5 && (
              <mesh scale={0.15 + intensity * 0.1}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial 
                  color={COLORS.glow} 
                  transparent 
                  opacity={0.1 * intensity}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Animated connection arcs
function ConnectionArcs() {
  const arcsRef = useRef<THREE.Group>(null);
  const [dashOffset, setDashOffset] = useState(0);
  
  useFrame((_, delta) => {
    setDashOffset(prev => (prev + delta * 0.5) % 1);
  });
  
  const arcs = useMemo(() => {
    return networkConnections.map((conn) => {
      const fromCluster = getClusterById(conn.from);
      const toCluster = getClusterById(conn.to);
      
      if (!fromCluster || !toCluster) return null;
      
      const points = getArcPoints(
        [fromCluster.lat, fromCluster.lng],
        [toCluster.lat, toCluster.lng],
        GLOBE_RADIUS + 0.01,
        40
      );
      
      return {
        points: points.map(p => new THREE.Vector3(...p)),
        traffic: conn.traffic,
      };
    }).filter(Boolean);
  }, []);

  return (
    <group ref={arcsRef}>
      {arcs.map((arc, i) => {
        if (!arc) return null;
        
        const opacity = arc.traffic === 'high' ? 0.6 : arc.traffic === 'medium' ? 0.4 : 0.2;
        const lineWidth = arc.traffic === 'high' ? 1.5 : arc.traffic === 'medium' ? 1 : 0.5;
        
        return (
          <Line
            key={i}
            points={arc.points}
            color={COLORS.arc}
            lineWidth={lineWidth}
            transparent
            opacity={opacity}
            dashed
            dashScale={50}
            dashSize={0.1}
            gapSize={0.05}
            dashOffset={-dashOffset}
          />
        );
      })}
    </group>
  );
}

// Atmosphere glow effect
function Atmosphere() {
  return (
    <mesh scale={GLOBE_RADIUS * 1.15}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        color={COLORS.atmosphere}
        transparent
        opacity={0.05}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Globe base sphere (light mode)
function GlobeBase() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[GLOBE_RADIUS - 0.01, 64, 64]} />
      <meshBasicMaterial
        color={COLORS.base}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

// Latitude/longitude grid lines
function GridLines() {
  const lines = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 5) {
        const [x, y, z] = latLngToVector3(lat, lng, GLOBE_RADIUS + 0.001);
        points.push(new THREE.Vector3(x, y, z));
      }
      result.push(points);
    }
    
    // Longitude lines
    for (let lng = -180; lng < 180; lng += 30) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        const [x, y, z] = latLngToVector3(lat, lng, GLOBE_RADIUS + 0.001);
        points.push(new THREE.Vector3(x, y, z));
      }
      result.push(points);
    }
    
    return result;
  }, []);

  return (
    <group>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={COLORS.grid}
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}

// Camera controller for zoom-to-cluster functionality
function CameraController({ 
  selectedCluster,
  onAnimationComplete 
}: { 
  selectedCluster: string | null;
  onAnimationComplete?: () => void;
}) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 5));
  const isAnimating = useRef(false);
  
  useEffect(() => {
    if (selectedCluster) {
      const cluster = getClusterById(selectedCluster);
      if (cluster) {
        const [x, y, z] = latLngToVector3(cluster.lat, cluster.lng, GLOBE_RADIUS + 3);
        targetRef.current.set(x, y, z);
        isAnimating.current = true;
      }
    } else {
      targetRef.current.set(0, 0, 5);
      isAnimating.current = true;
    }
  }, [selectedCluster]);
  
  useFrame(() => {
    if (isAnimating.current) {
      camera.position.lerp(targetRef.current, 0.05);
      camera.lookAt(0, 0, 0);
      
      if (camera.position.distanceTo(targetRef.current) < 0.1) {
        isAnimating.current = false;
        onAnimationComplete?.();
      }
    }
  });
  
  return null;
}

// Main scene component
function Scene({ onClusterClick, selectedCluster }: GlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    // Slow auto-rotation when nothing is selected
    if (groupRef.current && !selectedCluster) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <group ref={groupRef}>
        <GlobeBase />
        <GridLines />
        <WorldDots />
        <ClusterPoints onClusterClick={onClusterClick} selectedCluster={selectedCluster} />
        <ConnectionArcs />
        <Atmosphere />
      </group>
      
      <CameraController selectedCluster={selectedCluster} />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        autoRotate={!selectedCluster}
        autoRotateSpeed={0.3}
      />
    </>
  );
}

// Exported component
export function GlobeScene({ onClusterClick, selectedCluster }: GlobeSceneProps = {}) {
  return (
    <div className="w-full h-full" style={{ display: 'block' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Handle DPI scaling: min 1, max 2 for Retina
        style={{ 
          background: 'transparent',
          display: 'block', // Remove inline whitespace
          width: '100%',
          height: '100%',
        }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        <Scene onClusterClick={onClusterClick} selectedCluster={selectedCluster} />
      </Canvas>
    </div>
  );
}
