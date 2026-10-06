"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Grid, useTexture } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type ScrollRig = {
  progress: number; // 0..1 scroll through the experience
  pointerX: number; // -1..1
  pointerY: number; // -1..1
};

const CYAN = "#00FFFF";
const PURPLE = "#7B61FF";
const MAGENTA = "#FF00FF";
const AMBER = "#FFC35C";

/* ------------------------------------------------------------------ */
/* Scroll-driven camera: cruises down the neon avenue as you scroll     */
/* ------------------------------------------------------------------ */
function CameraRig({ rig }: { rig: React.MutableRefObject<ScrollRig> }) {
  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(rig.current.progress, 0, 1);
    const targetZ = THREE.MathUtils.lerp(26, -152, p);
    const targetX = Math.sin(p * Math.PI * 1.6) * 1.8 + rig.current.pointerX * 2.6;
    const targetY = 3.1 + Math.sin(p * Math.PI * 2) * 0.5 + rig.current.pointerY * 1.2;
    const cam = state.camera;
    const d = 2.8;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, targetX, d, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, targetY, d, delta);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, d, delta);
    cam.lookAt(cam.position.x * 0.3, 4.2, cam.position.z - 34);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Procedural lit-window facade texture                                 */
/* ------------------------------------------------------------------ */
function makeFacadeTexture(accent: string, seed: number): THREE.CanvasTexture {
  // tiny deterministic PRNG so buildings don't shimmer between renders
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#04060c";
  g.fillRect(0, 0, 128, 256);
  for (let y = 10; y < 246; y += 15) {
    for (let x = 10; x < 118; x += 15) {
      if (rnd() < 0.4) {
        const warm = rnd() < 0.22;
        g.fillStyle = warm ? AMBER : accent;
        g.globalAlpha = 0.45 + rnd() * 0.55;
        g.fillRect(x, y, 8, 9);
      }
    }
  }
  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Building canyon walls (instanced)                                    */
/* ------------------------------------------------------------------ */
function Buildings({
  side,
  texture,
  count,
  seed,
}: {
  side: 1 | -1;
  texture: THREE.Texture;
  count: number;
  seed: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    let s = seed;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      const z = 36 - (i / count) * 232 - rnd() * 7;
      const h = 26 + rnd() * 44;
      const w = 7 + rnd() * 6;
      dummy.position.set(side * (15 + rnd() * 8), h / 2 - 0.6, z);
      dummy.scale.set(w, h, w + rnd() * 4);
      dummy.rotation.y = (rnd() - 0.5) * 0.12;
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    }
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [count, dummy, seed, side]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* Holographic billboard: his photography as neon ads on the towers     */
/* ------------------------------------------------------------------ */
function HoloBillboard({
  src,
  position,
  rotationY,
  accent,
  seed,
}: {
  src: string;
  position: [number, number, number];
  rotationY: number;
  accent: string;
  seed: number;
}) {
  const tex = useTexture(src);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
  }, [tex]);

  useFrame((state) => {
    if (!mat.current) return;
    const t = state.clock.elapsedTime;
    // subtle holographic flicker
    let o = 0.88 + Math.sin(t * 11 + seed) * 0.05 + Math.sin(t * 47 + seed * 2) * 0.03;
    if (Math.sin(t * 3.1 + seed * 5) > 0.996) o -= 0.35; // occasional glitch dip
    mat.current.opacity = o;
  });

  return (
    <Float speed={1.4} floatIntensity={0.35} rotationIntensity={0.04}>
      <group position={position} rotation={[0, rotationY, 0]}>
        {/* glow frame */}
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[8.6, 5.4]} />
          <meshBasicMaterial color={accent} transparent opacity={0.5} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.03]}>
          <planeGeometry args={[8.6, 5.4]} />
          <meshBasicMaterial color="#02030a" />
        </mesh>
        <mesh>
          <planeGeometry args={[8.1, 4.95]} />
          <meshBasicMaterial ref={mat} map={tex} transparent toneMapped={false} />
        </mesh>
        <pointLight color={accent} intensity={26} distance={26} decay={1.8} position={[0, 0, 3]} />
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/* Neon district gate: ring arching over the street at chapter bounds   */
/* ------------------------------------------------------------------ */
function DistrictGate({ z, color }: { z: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.08;
  });
  return (
    <group position={[0, 7.5, z]}>
      <mesh ref={ref}>
        <torusGeometry args={[10.5, 0.22, 16, 96]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[10.5, 0.9, 16, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={70} distance={55} decay={1.7} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Rain: falling streak particles                                       */
/* ------------------------------------------------------------------ */
function Rain({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 30 - 1;
      positions[i * 3 + 2] = 34 - Math.random() * 230;
      speeds[i] = 22 + Math.random() * 14;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    const attr = ref.current!.geometry.attributes.position as THREE.BufferAttribute;
    const d = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) - speeds[i] * d;
      if (y < -1) y = 29;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#9fd8ff"
        size={0.14}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Flying vehicles with light trails                                    */
/* ------------------------------------------------------------------ */
function Vehicles() {
  const group = useRef<THREE.Group>(null);
  const cars = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x: (i % 2 === 0 ? -1 : 1) * (2.5 + Math.random() * 4),
        y: 11 + Math.random() * 11,
        z: -Math.random() * 190,
        speed: 16 + Math.random() * 12,
        dir: i % 2 === 0 ? 1 : -1,
        color: i % 3 === 0 ? MAGENTA : CYAN,
      })),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    group.current!.children.forEach((m, i) => {
      const c = cars[i];
      c.z += c.dir * c.speed * delta;
      if (c.z > 36) c.z = -196;
      if (c.z < -196) c.z = 36;
      m.position.set(c.x, c.y + Math.sin(t * 1.3 + i * 2.1) * 0.35, c.z);
    });
  });

  return (
    <group ref={group}>
      {cars.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]}>
          <mesh>
            <boxGeometry args={[0.9, 0.45, 3.2]} />
            <meshBasicMaterial color={c.color} toneMapped={false} />
          </mesh>
          {/* light trail */}
          <mesh position={[0, 0, c.dir * -4.5]}>
            <boxGeometry args={[0.28, 0.14, 9]} />
            <meshBasicMaterial color={c.color} transparent opacity={0.35} toneMapped={false} />
          </mesh>
        </group>
      ))}
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
  const facades = useMemo(
    () => [makeFacadeTexture(CYAN, 11), makeFacadeTexture(MAGENTA, 47), makeFacadeTexture(PURPLE, 83)],
    []
  );
  const rainCount = useMemo(
    () => (typeof window !== "undefined" && window.innerWidth < 768 ? 600 : 1300),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 3.1, 26], fov: 58, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#04050d"]} />
        <fogExp2 attach="fog" args={["#04050d", 0.014]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[6, 14, 10]} intensity={0.4} color="#8fb8ff" />

        <Suspense fallback={null}>
          {/* wet asphalt */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, -80]}>
            <planeGeometry args={[70, 280]} />
            <meshBasicMaterial color="#030409" />
          </mesh>
          {/* faint reflective grid on the street */}
          <Grid
            position={[0, -0.5, -80]}
            args={[70, 280]}
            cellSize={4}
            cellThickness={0.6}
            cellColor="#0b2b33"
            sectionSize={20}
            sectionThickness={1}
            sectionColor="#00cccc"
            fadeDistance={150}
            fadeStrength={2.5}
          />
          {/* neon curb strips */}
          <mesh position={[-7.2, 0.05, -80]}>
            <boxGeometry args={[0.35, 0.12, 260]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
          <mesh position={[7.2, 0.05, -80]}>
            <boxGeometry args={[0.35, 0.12, 260]} />
            <meshBasicMaterial color={MAGENTA} toneMapped={false} />
          </mesh>

          {/* building canyons */}
          {facades.map((tex, i) => (
            <Buildings key={i} side={1} texture={tex} count={15} seed={100 + i * 37} />
          ))}
          {facades.map((tex, i) => (
            <Buildings key={`l${i}`} side={-1} texture={tex} count={15} seed={500 + i * 53} />
          ))}

          {/* district gates */}
          <DistrictGate z={-44} color={CYAN} />
          <DistrictGate z={-94} color={PURPLE} />
          <DistrictGate z={-142} color={MAGENTA} />

          {/* holographic billboards — his photography as neon ads */}
          <HoloBillboard src={PHOTOS[0]} position={[-11.5, 11, -58]} rotationY={Math.PI / 2 - 0.25} accent={CYAN} seed={1} />
          <HoloBillboard src={PHOTOS[1]} position={[11.5, 13, -72]} rotationY={-Math.PI / 2 + 0.22} accent={MAGENTA} seed={2} />
          <HoloBillboard src={PHOTOS[2]} position={[-11.5, 9, -102]} rotationY={Math.PI / 2 - 0.3} accent={PURPLE} seed={3} />
          <HoloBillboard src={PHOTOS[3]} position={[11.5, 12, -114]} rotationY={-Math.PI / 2 + 0.28} accent={CYAN} seed={4} />
          <HoloBillboard src={PHOTOS[4]} position={[-11.5, 14, -126]} rotationY={Math.PI / 2 - 0.2} accent={MAGENTA} seed={5} />
          <HoloBillboard src={PHOTOS[5]} position={[11.5, 10, -136]} rotationY={-Math.PI / 2 + 0.25} accent={PURPLE} seed={6} />

          {/* street lights */}
          <pointLight color={CYAN} intensity={50} distance={60} decay={1.8} position={[-6, 9, -50]} />
          <pointLight color={MAGENTA} intensity={50} distance={60} decay={1.8} position={[6, 9, -100]} />
          <pointLight color={PURPLE} intensity={50} distance={60} decay={1.8} position={[-6, 9, -140]} />

          <Rain count={rainCount} />
          <Vehicles />
          <CameraRig rig={rig} />
        </Suspense>
      </Canvas>
    </div>
  );
}
