import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import type { Mesh, Points, BufferGeometry, PointsMaterial } from 'three';
import * as THREE from 'three';

interface NetworkNode {
  lat: number;
  lng: number;
  size?: number;
}

// Convert lat/lng to 3D position
function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
}

// Sample network nodes
const networkNodes: NetworkNode[] = [
  { lat: 51.5, lng: -0.1, size: 1.2 },   // London
  { lat: 40.7, lng: -74, size: 1 },      // NYC
  { lat: -1.3, lng: 36.8, size: 1.5 },   // Nairobi
  { lat: 28.6, lng: 77.2, size: 1.3 },   // Delhi
  { lat: -23.5, lng: -46.6, size: 1 },   // Sao Paulo
  { lat: 35.7, lng: 139.7, size: 0.8 },  // Tokyo
  { lat: -33.9, lng: 18.4, size: 1.2 },  // Cape Town
  { lat: 1.3, lng: 103.8, size: 0.9 },   // Singapore
  { lat: 6.5, lng: 3.4, size: 1.4 },     // Lagos
  { lat: -6.2, lng: 106.8, size: 1.1 },  // Jakarta
];

function Globe() {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Main globe sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshBasicMaterial 
          color="#4338ca" 
          wireframe 
          transparent 
          opacity={0.15}
        />
      </Sphere>
      
      {/* Inner glow sphere */}
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial 
          color="#4338ca" 
          transparent 
          opacity={0.05}
        />
      </Sphere>
    </group>
  );
}

function NetworkPoints() {
  const pointsRef = useRef<Points<BufferGeometry, PointsMaterial>>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(networkNodes.length * 3);
    networkNodes.forEach((node, i) => {
      const [x, y, z] = latLngToVector3(node.lat, node.lng, 2.05);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    });
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#4338ca" 
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    
    // Create connections between nearby nodes
    networkNodes.forEach((node1, i) => {
      networkNodes.forEach((node2, j) => {
        if (i < j) {
          const distance = Math.sqrt(
            Math.pow(node1.lat - node2.lat, 2) + 
            Math.pow(node1.lng - node2.lng, 2)
          );
          if (distance < 60) {
            const [x1, y1, z1] = latLngToVector3(node1.lat, node1.lng, 2.05);
            const [x2, y2, z2] = latLngToVector3(node2.lat, node2.lng, 2.05);
            positions.push(x1, y1, z1, x2, y2, z2);
          }
        }
      });
    });
    
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#4338ca" transparent opacity={0.2} />
    </lineSegments>
  );
}

export function GlobeScene() {
  return (
    <div className="w-full aspect-square max-w-lg mx-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Globe />
        <NetworkPoints />
        <ConnectionLines />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
