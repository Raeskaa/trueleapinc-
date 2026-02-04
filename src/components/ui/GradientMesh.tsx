import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader for the gradient mesh
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    // Subtle vertex displacement for organic movement
    vec3 pos = position;
    float displacement = sin(pos.x * 2.0 + uTime * 0.5) * cos(pos.y * 2.0 + uTime * 0.3) * 0.05;
    pos.z += displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader for smooth gradient blending
const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uNoiseScale;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    // Create flowing noise pattern
    float time = uTime * 0.15;
    
    vec2 uv = vUv;
    
    // Multiple layers of noise for organic movement
    float n1 = snoise(vec3(uv * uNoiseScale, time));
    float n2 = snoise(vec3(uv * uNoiseScale * 2.0 + 100.0, time * 1.2));
    float n3 = snoise(vec3(uv * uNoiseScale * 0.5 + 200.0, time * 0.8));
    
    float noise = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
    
    // Create smooth gradient zones based on position and noise
    float zone1 = smoothstep(0.0, 0.5, uv.x + noise * 0.3);
    float zone2 = smoothstep(0.3, 0.8, uv.y + noise * 0.2);
    float zone3 = smoothstep(0.0, 1.0, length(uv - 0.5 + noise * 0.1) * 1.5);
    
    // Blend colors
    vec3 color = uColor1;
    color = mix(color, uColor2, zone1 * (1.0 - zone2 * 0.5));
    color = mix(color, uColor3, zone2 * (1.0 - zone1 * 0.3));
    color = mix(color, uColor4, zone3 * 0.4 * (1.0 + noise * 0.2));
    
    // Add subtle brightness variation
    float brightness = 1.0 + noise * 0.08;
    color *= brightness;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface GradientPlaneProps {
  colors?: {
    color1: string;
    color2: string;
    color3: string;
    color4: string;
  };
  speed?: number;
  noiseScale?: number;
}

function GradientPlane({ 
  colors = {
    color1: '#faf9f7', // cream
    color2: '#e0e7ff', // indigo-light
    color3: '#ede9fe', // violet-light
    color4: '#fdf4ff', // fuchsia-light
  },
  speed = 1,
  noiseScale = 1.5,
}: GradientPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(colors.color1) },
    uColor2: { value: new THREE.Color(colors.color2) },
    uColor3: { value: new THREE.Color(colors.color3) },
    uColor4: { value: new THREE.Color(colors.color4) },
    uNoiseScale: { value: noiseScale },
  }), [colors, noiseScale]);
  
  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = 
        state.clock.getElapsedTime() * speed;
    }
  });
  
  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export interface GradientMeshProps {
  className?: string;
  variant?: 'light' | 'dark' | 'hero';
  speed?: number;
  noiseScale?: number;
}

const colorPresets = {
  light: {
    color1: '#faf9f7',
    color2: '#e0e7ff',
    color3: '#ede9fe',
    color4: '#f8fafc',
  },
  dark: {
    color1: '#0a0a0a',
    color2: '#1e1b4b',
    color3: '#312e81',
    color4: '#1a1a2e',
  },
  hero: {
    color1: '#faf9f7',
    color2: '#c7d2fe',
    color3: '#ddd6fe',
    color4: '#e0e7ff',
  },
};

export function GradientMesh({ 
  className = '', 
  variant = 'light',
  speed = 1,
  noiseScale = 1.5,
}: GradientMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  
  // Pause animation when not in viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  
  const colors = colorPresets[variant];
  
  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: 'none' }}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <GradientPlane 
          colors={colors}
          speed={speed}
          noiseScale={noiseScale}
        />
      </Canvas>
    </div>
  );
}

// Lightweight CSS-only fallback for reduced motion or performance
export function GradientMeshFallback({ 
  className = '', 
  variant = 'light' 
}: { className?: string; variant?: 'light' | 'dark' | 'hero' }) {
  const gradients = {
    light: 'from-cream via-indigo-light/30 to-violet-100/20',
    dark: 'from-charcoal via-indigo-dark/30 to-slate-900',
    hero: 'from-cream via-indigo-100/40 to-violet-100/30',
  };
  
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]} ${className}`}>
      <div className="absolute inset-0 opacity-50">
        <div 
          className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full blur-[100px]"
          style={{ 
            background: variant === 'dark' 
              ? 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(199,210,254,0.6) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full blur-[80px]"
          style={{ 
            background: variant === 'dark'
              ? 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(221,214,254,0.5) 0%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
}

// Smart loader that uses WebGL or fallback based on capabilities
export function GradientMeshLoader(props: GradientMeshProps) {
  const [useWebGL, setUseWebGL] = useState(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return false;
    }
    return true;
  });
  
  if (!useWebGL) {
    return <GradientMeshFallback variant={props.variant} className={props.className} />;
  }
  
  return <GradientMesh {...props} />;
}
