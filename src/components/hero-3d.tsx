"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text, Text3D } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.15 : 1}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#00FFFF"
        emissive="#00FFFF"
        emissiveIntensity={0.4}
        wireframe
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const points = useRef<THREE.Points>(null);
  const positions = new Float32Array(200 * 3);

  for (let i = 0; i < 200; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00FFFF"
        size={0.15}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Torus() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[5, 0, -3]} scale={0.7}>
      <torusGeometry args={[1.5, 0.05, 16, 100]} />
      <meshStandardMaterial color="#7B61FF" emissive="#7B61FF" emissiveIntensity={0.5} />
    </mesh>
  );
}

function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} position={[-5, 0, -4]} scale={0.6}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial color="#FF00FF" emissive="#FF00FF" emissiveIntensity={0.5} wireframe />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00FFFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7B61FF" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
            <RotatingCube />
          </Float>
          <Torus />
          <Sphere />
          <FloatingParticles />
        </Suspense>
      </Canvas>
    </div>
  );
}
