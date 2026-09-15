import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ExternalLink, Code2, Sparkles, Mail, User, Briefcase } from 'lucide-react';

// ----------------------------------------------------
// 1. Interactive 3D Background Particles
// ----------------------------------------------------
function Starfield({ count = 1500 }) {
  const points = useRef();
  
  const particlesPosition = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x += delta * 0.03;
      points.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#6366f1" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

// ----------------------------------------------------
// 2. Interactive Central 3D Shape
// ----------------------------------------------------
function FloatingCore() {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4;
      meshRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh
        ref={meshRef}
        scale={hovered ? 1.25 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, 0, -2]}
      >
        <icosahedronGeometry args={[1.8, 1]} />
        <MeshWobbleMaterial
          color={hovered ? "#818cf8" : "#4f46e5"}
          wireframe
          factor={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// ----------------------------------------------------
// 3. 3D Floating Project Screen Frame
// ----------------------------------------------------
function ProjectScreen3D({ position, title, url, description }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        {/* 3D Glass Panel Frame */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[4.2, 2.7, 0.1]} />
          <meshPhysicalMaterial
            color="#1e1b4b"
            roughness={0.2}
            metalness={0.8}
            transmission={0.6}
            thickness={0.5}
          />
        </mesh>

        {/* Embedded HTML Canvas Overlay */}
        <Html
          transform
          occlude
          position={[0, 0, 0.06]}
          distanceFactor={4}
          style={{
            width: '400px',
            height: '250px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            color: '#fff',
            fontFamily: 'sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase' }}>Featured Project</span>
              <Code2 size={16} color="#818cf8" />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#f8fafc' }}>{title}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.4' }}>{description}</p>
          </div>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#4f46e5',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600',
              width: 'fit-content',
            }}
          >
            Visit Live Site <ExternalLink size={14} />
          </a>
        </Html>
      </group>
    </Float>
  );
}

// ----------------------------------------------------
// 4. Main Scene Component
// ----------------------------------------------------
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#c7d2fe" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />

      <Starfield />
      <FloatingCore />

      {/* 3D Project Displays */}
      <ProjectScreen3D
        position={[-3.5, 0.5, 0]}
        title="Hamim Furniture"
        description="Custom modern furniture store web application built with a responsive catalog layout."
        url="https://hamimfurniture.vercel.app/"
      />

      <ProjectScreen3D
        position={[3.5, -0.5, 0]}
        title="Joha Online"
        description="E-commerce portal showcasing commercial hardware and modern retail interfaces."
        url="https://johamas.vercel.app/"
      />

      <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.2} />
    </>
  );
}

// ----------------------------------------------------
// 5. Main Application Entry Point
// ----------------------------------------------------
export default function App() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: '#090d16', color: '#fff', overflowX: 'hidden' }}>
      
      {/* Background WebGL 3D Canvas */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
          <Scene3D />
        </Canvas>
      </div>

      {/* Foreground Interactive Overlay UI */}
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        
        {/* Navigation Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 48px', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '18px' }}>
            <Sparkles color="#818cf8" /> Web Creator Studio
          </div>
          <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#cbd5e1' }}>
            <a href="#projects" style={{ color: 'inherit', textDecoration: 'none' }}>Projects</a>
            <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
            <a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
          </nav>
        </header>

        {/* Hero Section */}
        <section style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: '800', margin: '0 0 16px 0', background: 'linear-gradient(to right, #ffffff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Interactive 3D Web Experiences
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 0 32px 0' }}>
            Drag to rotate the 3D space, explore real-time interactive models, and inspect custom web builds.
          </p>
        </section>

        {/* Services / Feature Grid Section */}
        <section style={{ padding: '80px 48px', maxWidth: '1100px', margin: '0 auto', pointerEvents: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
              <Briefcase color="#818cf8" style={{ marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 12px 0' }}>Modern Web Development</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                High-performance web applications built with modern frontend frameworks, optimized layout pipelines, and fast responsive designs.
              </p>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
              <Code2 color="#818cf8" style={{ marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 12px 0' }}>3D & Graphics Integration</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Integrating WebGL, custom shaders, and Three.js scenes to turn conventional 2D pages into engaging spatial environments.
              </p>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
              <User color="#818cf8" style={{ marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 12px 0' }}>Client Solution Design</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                Tailored digital platforms for businesses, commercial ventures, and modern storefronts seeking distinct online branding.
              </p>
            </div>

          </div>
        </section>

        {/* Contact Footer */}
        <footer style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '14px', pointerEvents: 'auto' }}>
          <p style={{ margin: 0 }}>© 2026 Web Creator Studio. Powered by React Three Fiber & WebGL.</p>
        </footer>

      </div>
    </div>
  );
}
