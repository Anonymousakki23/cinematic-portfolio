"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Grid, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

export type ScrollRig = {
  progress: number; // 0..1 scroll through the experience
  pointerX: number; // -1..1
  pointerY: number; // -1..1
};

const CYAN = "#00FFFF";
const PURPLE = "#7B61FF";
const MAGENTA = "#FF00FF";

/* ------------------------------------------------------------------ */
/* Scroll-driven camera: flies forward through the diorama as you scroll */
/* ------------------------------------------------------------------ */
function CameraRig({ rig }: { rig: React.MutableRefObject<ScrollRig> }) {
  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(rig.current.progress, 0, 1);
    const targetZ = THREE.MathUtils.lerp(26, -152, p);
    const targetX = Math.sin(p * Math.PI * 2.2) * 2.4 + rig.current.pointerX * 3.2;
    const targetY = 2.4 + Math.sin(p * Math.PI) * 1.4 + rig.current.pointerY * 1.6;
    const cam = state.camera;
    const d = 2.6;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, targetX, d, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, targetY, d, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, d, delta);
    cam.lookAt(cam.position.x * 0.35, 1.1, cam.position.z - 30);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Particle nebula: cyan / purple / magenta dust drifting in the dark   */
/* ------------------------------------------------------------------ */
function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color(CYAN), new THREE.Color(PURPLE), new THREE.Color(MAGENTA)];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = Math.random() * 26 - 6;
      positions[i * 3 + 2] = 30 - Math.random() * 210;
      const c = palette[Math.floor(Math.random() * palette.length)];
      const dim = 0.35 + Math.random() * 0.65;
      colors[i * 3] = c.r * dim;
      colors[i * 3 + 1] = c.g * dim;
      colors[i * 3 + 2] = c.b * dim;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.6;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.32}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Data core: rotating wireframe icosahedron marking each chapter       */
/* ------------------------------------------------------------------ */
function DataCore({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (outer.current) {
      outer.current.rotation.y += delta * 0.28;
      outer.current.rotation.x += delta * 0.12;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.5;
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08;
      inner.current.scale.setScalar(s);
    }
  });
  return (
    <group position={position} scale={scale}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[3.2, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.9} />
      </mesh>
      <pointLight color={color} intensity={60} distance={42} decay={1.8} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Holographic photo panel: his photography floating in the world       */
/* ------------------------------------------------------------------ */
function PhotoPanel({
  src,
  position,
  rotationY = 0,
  accent,
}: {
  src: string;
  position: [number, number, number];
  rotationY?: number;
  accent: string;
}) {
  const tex = useTexture(src);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
  }, [tex]);
  return (
    <Float speed={2.2} floatIntensity={0.7} rotationIntensity={0.12}>
      <group position={position} rotation={[0, rotationY, 0]}>
        {/* accent backplate = glowing frame */}
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[4.7, 3.35]} />
          <meshBasicMaterial color={accent} transparent opacity={0.32} />
        </mesh>
        <mesh position={[0, 0, -0.015]}>
          <planeGeometry args={[4.7, 3.35]} />
          <meshBasicMaterial color="#04060f" />
        </mesh>
        <mesh>
          <planeGeometry args={[4.4, 3.05]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
        <pointLight color={accent} intensity={14} distance={16} decay={1.8} position={[0, 0, 2]} />
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/* The moon: a huge glowing ring hanging at the end of the journey      */
/* ------------------------------------------------------------------ */
function MoonRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.05;
  });
  return (
    <group position={[0, 9, -178]}>
      <mesh ref={ref}>
        <torusGeometry args={[11, 0.35, 24, 128]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.85} />
      </mesh>
      <mesh>
        <torusGeometry args={[11, 1.6, 24, 128]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.08} />
      </mesh>
      <mesh>
        <circleGeometry args={[8.4, 64]} />
        <meshBasicMaterial color={PURPLE} transparent opacity={0.14} />
      </mesh>
      <pointLight color={CYAN} intensity={120} distance={90} decay={1.6} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The scene                                                            */
/* ------------------------------------------------------------------ */
const PHOTOS = [
  "/photography/ig-lightning.jpg",
  "/photography/ig-kingfisher.jpg",
  "/photography/ig-bee.webp",
  "/photography/ig-glowshroom.jpg",
  "/photography/ig-prague.jpg",
  "/photography/ig-butterfly.jpg",
];

export default function ExperienceScene({ rig }: { rig: React.MutableRefObject<ScrollRig> }) {
  const particleCount = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth < 768 ? 420 : 900),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.4, 26], fov: 55, near: 0.1, far: 460 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#04040c"]} />
        <fogExp2 attach="fog" args={["#04040c", 0.011]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 12, 8]} intensity={0.5} color={CYAN} />

        <Suspense fallback={null}>
          <ParticleField count={particleCount} />

          {/* infinite tech grid floor */}
          <Grid
            position={[0, -4.2, -60]}
            args={[300, 300]}
            cellSize={3}
            cellThickness={0.7}
            cellColor="#0a3a44"
            sectionSize={15}
            sectionThickness={1.2}
            sectionColor="#00ffff"
            fadeDistance={190}
            fadeStrength={2.2}
            infiniteGrid
          />

          {/* chapter cores */}
          <DataCore position={[-7.5, 2.2, -30]} color={CYAN} />
          <DataCore position={[7.5, 1.4, -70]} color={PURPLE} scale={1.25} />
          <DataCore position={[-7.5, 2.6, -132]} color={MAGENTA} scale={0.9} />

          {/* photography chapter: floating holo panels */}
          <PhotoPanel src={PHOTOS[0]} position={[-6.4, 2.6, -102]} rotationY={0.32} accent={MAGENTA} />
          <PhotoPanel src={PHOTOS[1]} position={[6.6, 1.6, -110]} rotationY={-0.3} accent={CYAN} />
          <PhotoPanel src={PHOTOS[2]} position={[0.4, 4.6, -118]} rotationY={0.06} accent={PURPLE} />
          <PhotoPanel src={PHOTOS[3]} position={[-5.8, 0.6, -124]} rotationY={0.28} accent={CYAN} />
          <PhotoPanel src={PHOTOS[4]} position={[6.2, 4.2, -128]} rotationY={-0.34} accent={MAGENTA} />
          <PhotoPanel src={PHOTOS[5]} position={[0, 2.2, -136]} rotationY={0} accent={PURPLE} />

          <MoonRing />
          <CameraRig rig={rig} />
        </Suspense>
      </Canvas>
    </div>
  );
}
