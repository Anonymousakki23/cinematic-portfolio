"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export type ScrollRig = { progress: number; pointerX: number; pointerY: number };

/* ------------------------------------------------------------------ */
/* Palette: golden Goan dusk dissolving into Kraków blue hour           */
/* ------------------------------------------------------------------ */
const AMBER = "#ffb454";
const EMBER = "#ff8c42";

const SKY_WARM = {
  top: new THREE.Color("#2b3a6b"),
  mid: new THREE.Color("#b25a4a"),
  horizon: new THREE.Color("#ffb14a"),
};
const SKY_NIGHT = {
  top: new THREE.Color("#04060e"),
  mid: new THREE.Color("#141c38"),
  horizon: new THREE.Color("#4a3f55"),
};
const FOG_WARM = new THREE.Color("#4a2c3f");
const FOG_NIGHT = new THREE.Color("#060a14");

const PHOTOS = [
  "/photography/ig-lightning.jpg",
  "/photography/ig-kingfisher.jpg",
  "/photography/ig-bee.webp",
  "/photography/ig-glowshroom.jpg",
  "/photography/ig-prague.jpg",
  "/photography/ig-butterfly.jpg",
];

function mulberry(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ------------------------------------------------------------------ */
/* Sky dome: gradient that cools from Goan dusk to Kraków night         */
/* ------------------------------------------------------------------ */
function SkyDome({ rig }: { rig: React.MutableRefObject<ScrollRig> }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: SKY_WARM.top.clone() },
          uMid: { value: SKY_WARM.mid.clone() },
          uHorizon: { value: SKY_WARM.horizon.clone() },
        },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uHorizon;
          varying vec3 vPos;
          void main() {
            float h = normalize(vPos).y;
            vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.28, h));
            col = mix(col, uTop, smoothstep(0.22, 0.75, h));
            col = mix(vec3(0.015, 0.015, 0.04), col, smoothstep(-0.2, 0.02, h));
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    []
  );
  const tmp = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    const p = rig.current.progress;
    const u = mat.uniforms;
    (u.uTop.value as THREE.Color).copy(tmp.copy(SKY_WARM.top).lerp(SKY_NIGHT.top, p));
    (u.uMid.value as THREE.Color).copy(tmp.copy(SKY_WARM.mid).lerp(SKY_NIGHT.mid, p));
    (u.uHorizon.value as THREE.Color).copy(tmp.copy(SKY_WARM.horizon).lerp(SKY_NIGHT.horizon, p));
  });
  return (
    <mesh material={mat} renderOrder={-10}>
      <sphereGeometry args={[420, 32, 20]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Sun: big amber disc over the Goan sea, sinks as you cross north      */
/* ------------------------------------------------------------------ */
function Sun({ rig }: { rig: React.MutableRefObject<ScrollRig> }) {
  const group = useRef<THREE.Group>(null);
  const glowMat = useRef<THREE.SpriteMaterial>(null);
  const discMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, "rgba(255,190,110,0.85)");
    g.addColorStop(0.4, "rgba(255,150,80,0.28)");
    g.addColorStop(1, "rgba(255,140,60,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    return t;
  }, []);
  useFrame(() => {
    const p = rig.current.progress;
    // sun sinks below the horizon during the crossing (p 0.25 → 0.5)
    const sink = THREE.MathUtils.smoothstep(p, 0.22, 0.52);
    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(9, -9, sink);
      group.current.position.x = THREE.MathUtils.lerp(-34, -60, sink);
    }
    const fade = 1 - sink;
    if (glowMat.current) glowMat.current.opacity = fade * 0.95;
    if (discMat.current) discMat.current.opacity = fade;
  });
  return (
    <group ref={group} position={[-34, 9, -95]}>
      <sprite scale={[64, 64, 1]}>
        <spriteMaterial ref={glowMat} map={glowTex} transparent depthWrite={false} toneMapped={false} />
      </sprite>
      <mesh>
        <circleGeometry args={[8.5, 48]} />
        <meshBasicMaterial ref={discMat} color="#ffd9a0" transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Sea + sun streak + sand (Goa zone)                                   */
/* ------------------------------------------------------------------ */
function Sea() {
  const streak = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (streak.current)
      streak.current.opacity = 0.32 + Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
  });
  return (
    <group>
      {/* water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-45, -0.35, -60]}>
        <planeGeometry args={[170, 200]} />
        <meshStandardMaterial color="#0d2137" roughness={0.25} metalness={0.65} />
      </mesh>
      {/* sun reflection streak */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-34, -0.28, -60]}>
        <planeGeometry args={[7, 120]} />
        <meshBasicMaterial
          ref={streak}
          color={EMBER}
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* sand */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[30, -0.3, -30]}>
        <planeGeometry args={[130, 160]} />
        <meshStandardMaterial color="#4a3a28" roughness={1} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Palm grove: instanced trunks + instanced drooping fronds             */
/* ------------------------------------------------------------------ */
function makeFrondGeometry() {
  const g = new THREE.PlaneGeometry(0.55, 3.4, 1, 8);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = (y + 1.7) / 3.4; // 0 base → 1 tip
    pos.setZ(i, pos.getZ(i) - t * t * 1.5); // droop
    pos.setX(i, pos.getX(i) * (1 - t * 0.55)); // taper
  }
  g.computeVertexNormals();
  g.translate(0, 1.7, 0); // base at origin, extends +y
  return g;
}

function Palms() {
  const trunks = useRef<THREE.InstancedMesh>(null);
  const fronds = useRef<THREE.InstancedMesh>(null);
  const frondGeo = useMemo(makeFrondGeometry, []);
  const spots = useMemo(() => {
    const rnd = mulberry(77);
    const arr: { x: number; z: number; h: number; lean: number; leanDir: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      arr.push({
        x: side * (9 + rnd() * 34),
        z: 18 - rnd() * 72,
        h: 5.5 + rnd() * 3.5,
        lean: rnd() * 0.16,
        leanDir: rnd() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    spots.forEach((s, i) => {
      dummy.position.set(s.x, s.h / 2 - 0.3, s.z);
      dummy.rotation.set(Math.cos(s.leanDir) * s.lean, 0, Math.sin(s.leanDir) * s.lean);
      dummy.scale.set(1, s.h / 7, 1);
      dummy.updateMatrix();
      trunks.current!.setMatrixAt(i, dummy.matrix);
      // 7 fronds per palm
      for (let f = 0; f < 7; f++) {
        const a = (f / 7) * Math.PI * 2 + s.leanDir;
        dummy.position.set(s.x, s.h - 0.3, s.z);
        dummy.rotation.set(0, 0, 0);
        dummy.rotateY(a);
        dummy.rotateX(-0.85); // arc outward-down
        dummy.scale.setScalar(0.85 + (i % 3) * 0.12);
        dummy.updateMatrix();
        fronds.current!.setMatrixAt(i * 7 + f, dummy.matrix);
      }
    });
    trunks.current!.instanceMatrix.needsUpdate = true;
    fronds.current!.instanceMatrix.needsUpdate = true;
  }, [dummy, spots]);

  const silhouette = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#0e1a12", roughness: 1, side: THREE.DoubleSide }),
    []
  );
  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, spots.length]} material={silhouette}>
        <cylinderGeometry args={[0.14, 0.24, 7, 6]} />
      </instancedMesh>
      <instancedMesh ref={fronds} args={[undefined, undefined, spots.length * 7]} geometry={frondGeo} material={silhouette} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Goan chapel: white facade, pediment, tower + cross — warm windows    */
/* ------------------------------------------------------------------ */
function Chapel() {
  const glow = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffcf8a", toneMapped: false }), []);
  const wall = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d8cfc0", roughness: 0.9 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#241d18", roughness: 1 }), []);
  return (
    <group position={[27, 0, -38]} rotation={[0, -0.35, 0]}>
      {/* nave */}
      <mesh material={wall} position={[0, 3.5, 0]}>
        <boxGeometry args={[11, 7, 9]} />
      </mesh>
      {/* pediment */}
      <mesh material={wall} position={[0, 8.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[7.6, 2.6, 4]} />
      </mesh>
      {/* tower */}
      <mesh material={wall} position={[0, 7, -5.5]}>
        <boxGeometry args={[3.4, 11, 3.4]} />
      </mesh>
      <mesh material={dark} position={[0, 13.4, -5.5]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.6, 3, 4]} />
      </mesh>
      {/* cross */}
      <mesh material={dark} position={[0, 16.4, -5.5]}>
        <boxGeometry args={[0.25, 1.8, 0.25]} />
      </mesh>
      <mesh material={dark} position={[0, 16.6, -5.5]}>
        <boxGeometry args={[1, 0.25, 0.25]} />
      </mesh>
      {/* warm windows */}
      {[-3, 0, 3].map((x) => (
        <mesh key={x} material={glow} position={[x, 3.4, 4.52]}>
          <planeGeometry args={[1.1, 2.4]} />
        </mesh>
      ))}
      <mesh material={glow} position={[0, 7, -3.78]}>
        <planeGeometry args={[1, 1.8]} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Fishing boats on the water, tiny lamps aboard                        */
/* ------------------------------------------------------------------ */
function Boats() {
  const hull = useMemo(() => new THREE.MeshStandardMaterial({ color: "#101820", roughness: 0.9 }), []);
  const lamp = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffcf8a", toneMapped: false }), []);
  const spots: [number, number, number][] = [
    [-28, -14, 0.5],
    [-44, -38, -0.4],
    [-30, -52, 0.9],
  ];
  return (
    <group>
      {spots.map(([x, z, r], i) => (
        <group key={i} position={[x, 0.1, z]} rotation={[0, r, 0]}>
          <mesh material={hull} position={[0, 0.5, 0]}>
            <boxGeometry args={[5.5, 1.1, 1.8]} />
          </mesh>
          <mesh material={hull} position={[0, 2.6, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 4.4, 6]} />
          </mesh>
          <mesh material={lamp} position={[1.4, 1.4, 0]}>
            <sphereGeometry args={[0.22, 10, 10]} />
          </mesh>
          <pointLight color="#ffbf70" intensity={8} distance={14} decay={2} position={[1.4, 1.8, 0]} />
        </group>
      ))}
    </group>
  );
}
/* ------------------------------------------------------------------ */
/* The crossing: a lamp-lit causeway over open water                  */
/* ------------------------------------------------------------------ */
function Causeway() {
  const posts = useRef<THREE.InstancedMesh>(null);
  const lamps = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const N = 10; // lamp pairs
  useLayoutEffect(() => {
    for (let i = 0; i < N; i++) {
      const z = -52 - i * 6.4;
      for (let s = 0; s < 2; s++) {
        const idx = i * 2 + s;
        const x = s === 0 ? -4.4 : 4.4;
        dummy.position.set(x, 1.1, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        posts.current!.setMatrixAt(idx, dummy.matrix);
        dummy.position.set(x, 2.5, z);
        dummy.updateMatrix();
        lamps.current!.setMatrixAt(idx, dummy.matrix);
      }
    }
    posts.current!.instanceMatrix.needsUpdate = true;
    lamps.current!.instanceMatrix.needsUpdate = true;
  }, [dummy]);
  const iron = useMemo(() => new THREE.MeshStandardMaterial({ color: "#14161f", roughness: 0.8 }), []);
  const bulb = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffc37a", toneMapped: false }), []);
  return (
    <group>
      {/* road deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -86]}>
        <planeGeometry args={[8, 72]} />
        <meshStandardMaterial color="#232028" roughness={0.9} />
      </mesh>
      {/* center dashes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, -56 - i * 5.4]}>
          <planeGeometry args={[0.28, 2.2]} />
          <meshBasicMaterial color="#c8a25e" toneMapped={false} transparent opacity={0.75} />
        </mesh>
      ))}
      <instancedMesh ref={posts} args={[undefined, undefined, N * 2]} material={iron}>
        <cylinderGeometry args={[0.09, 0.12, 2.4, 6]} />
      </instancedMesh>
      <instancedMesh ref={lamps} args={[undefined, undefined, N * 2]} material={bulb}>
        <sphereGeometry args={[0.3, 10, 10]} />
      </instancedMesh>
      {/* a few real lights for pools of warmth */}
      {[-58, -84, -110].map((z) => (
        <pointLight key={z} color="#ffb060" intensity={26} distance={26} decay={2} position={[0, 3.4, z]} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Stars fade in as the night deepens                                   */
/* ------------------------------------------------------------------ */
function Stars({ rig }: { rig: React.MutableRefObject<ScrollRig> }) {
  const mat = useRef<THREE.PointsMaterial>(null);
  const geo = useMemo(() => {
    const rnd = mulberry(4242);
    const n = 700;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 380;
      const theta = rnd() * Math.PI * 2;
      const y = 30 + rnd() * 300;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame(() => {
    if (mat.current) mat.current.opacity = THREE.MathUtils.smoothstep(rig.current.progress, 0.3, 0.65) * 0.9;
  });
  return (
    <points geometry={geo}>
      <pointsMaterial ref={mat} color="#cfe0ff" size={1.6} sizeAttenuation={false} transparent opacity={0} depthWrite={false} />
    </points>
  );
}

/* Distant ship lights on the crossing horizon */
function ShipLights() {
  const spots: [number, number][] = [
    [-70, -128],
    [-20, -134],
    [40, -126],
    [90, -136],
  ];
  return (
    <group>
      {spots.map(([x, z], i) => (
        <mesh key={i} position={[x, 1.2, z]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial color="#ffd9a0" toneMapped={false} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Kraków: gabled townhouses with warm windows, instanced               */
/* ------------------------------------------------------------------ */
function makeFacadeTexture(seed: number) {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#17131f";
  ctx.fillRect(0, 0, 128, 256);
  const rnd = mulberry(seed);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const lit = rnd() > 0.42;
      ctx.fillStyle = lit ? (rnd() > 0.2 ? "#ffbe6e" : "#ffd9a0") : "#0a0c14";
      const x = 10 + col * 29;
      const y = 14 + row * 40;
      ctx.fillRect(x, y, 18, 26);
      if (lit) {
        ctx.fillStyle = "rgba(255,190,110,0.25)";
        ctx.fillRect(x - 4, y - 4, 26, 34);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Townhouses({ narrow }: { narrow: boolean }) {
  const bodiesA = useRef<THREE.InstancedMesh>(null);
  const bodiesB = useRef<THREE.InstancedMesh>(null);
  const roofs = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const texA = useMemo(() => makeFacadeTexture(11), []);
  const texB = useMemo(() => makeFacadeTexture(77), []);
  const spots = useMemo(() => {
    const rnd = mulberry(9001);
    const arr: { x: number; z: number; w: number; h: number; d: number; tex: number }[] = [];
    for (let i = 0; i < 44; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      arr.push({
        x: side * (narrow ? 8 + rnd() * 4 : 10 + rnd() * 6),
        z: -112 - (i / 44) * 88 - rnd() * 3,
        w: 7 + rnd() * 5,
        h: 9 + rnd() * 11,
        d: 7 + rnd() * 4,
        tex: i % 2,
      });
    }
    return arr;
  }, [narrow]);

  const matA = useMemo(
    () => new THREE.MeshStandardMaterial({ map: texA, roughness: 0.95, emissive: "#ffffff", emissiveMap: texA, emissiveIntensity: 0.85 }),
    [texA]
  );
  const matB = useMemo(
    () => new THREE.MeshStandardMaterial({ map: texB, roughness: 0.95, emissive: "#ffffff", emissiveMap: texB, emissiveIntensity: 0.85 }),
    [texB]
  );
  const roofMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#241a20", roughness: 1 }), []);

  useLayoutEffect(() => {
    let pa = 0;
    let pb = 0;
    spots.forEach((s, i) => {
      dummy.position.set(s.x, s.h / 2 - 0.2, s.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(s.w / 8, s.h / 14, s.d / 8);
      dummy.updateMatrix();
      if (s.tex === 0) bodiesA.current!.setMatrixAt(pa++, dummy.matrix);
      else bodiesB.current!.setMatrixAt(pb++, dummy.matrix);
      // pyramid roof cap
      dummy.position.set(s.x, s.h - 0.2 + s.w * 0.2, s.z);
      dummy.rotation.set(0, Math.PI / 4, 0);
      dummy.scale.set(s.w / 8, (s.w * 0.42) / 4, s.d / 8);
      dummy.updateMatrix();
      roofs.current!.setMatrixAt(i, dummy.matrix);
    });
    bodiesA.current!.instanceMatrix.needsUpdate = true;
    bodiesB.current!.instanceMatrix.needsUpdate = true;
    roofs.current!.instanceMatrix.needsUpdate = true;
  }, [dummy, spots]);

  const countA = spots.filter((s) => s.tex === 0).length;
  const countB = spots.length - countA;
  return (
    <group>
      <instancedMesh ref={bodiesA} args={[undefined, undefined, countA]} material={matA}>
        <boxGeometry args={[8, 14, 8]} />
      </instancedMesh>
      <instancedMesh ref={bodiesB} args={[undefined, undefined, countB]} material={matB}>
        <boxGeometry args={[8, 14, 8]} />
      </instancedMesh>
      <instancedMesh ref={roofs} args={[undefined, undefined, spots.length]} material={roofMat}>
        <coneGeometry args={[4, 4, 4]} />
      </instancedMesh>
    </group>
  );
}
/* ------------------------------------------------------------------ */
/* St. Mary's homage: twin towers, one taller — plus town hall tower    */
/* ------------------------------------------------------------------ */
function ChurchTowers() {
  const stone = useMemo(() => new THREE.MeshStandardMaterial({ color: "#16121f", roughness: 1 }), []);
  const spire = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0d0a14", roughness: 1 }), []);
  const lit = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffcf8a", toneMapped: false }), []);
  return (
    <group>
      {/* taller tower (Mariacki homage) */}
      <group position={[-13, 0, -196]}>
        <mesh material={stone} position={[0, 19, 0]}>
          <boxGeometry args={[6, 38, 6]} />
        </mesh>
        <mesh material={spire} position={[0, 43, 0]}>
          <coneGeometry args={[3.4, 10, 8]} />
        </mesh>
        <mesh material={lit} position={[0, 30, 3.02]}>
          <planeGeometry args={[1.2, 3]} />
        </mesh>
        <mesh material={lit} position={[0, 24, 3.02]}>
          <planeGeometry args={[1.2, 3]} />
        </mesh>
      </group>
      {/* shorter tower */}
      <group position={[-4, 0, -196]}>
        <mesh material={stone} position={[0, 14, 0]}>
          <boxGeometry args={[5.4, 28, 5.4]} />
        </mesh>
        <mesh material={spire} position={[0, 31.5, 0]}>
          <coneGeometry args={[3, 7, 8]} />
        </mesh>
        <mesh material={lit} position={[0, 20, 2.72]}>
          <planeGeometry args={[1.1, 2.6]} />
        </mesh>
      </group>
      {/* town hall tower */}
      <group position={[14, 0, -182]} rotation={[0, -0.3, 0]}>
        <mesh material={stone} position={[0, 15, 0]}>
          <boxGeometry args={[5, 30, 5]} />
        </mesh>
        <mesh material={spire} position={[0, 33.5, 0]}>
          <coneGeometry args={[3.2, 8, 4]} />
        </mesh>
        <mesh material={lit} position={[0, 22, 2.52]}>
          <circleGeometry args={[1.1, 24]} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Gas-lamp style street lamps along the Kraków street                 */
/* ------------------------------------------------------------------ */
function StreetLamps() {
  const posts = useRef<THREE.InstancedMesh>(null);
  const globes = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const N = 9;
  useLayoutEffect(() => {
    for (let i = 0; i < N; i++) {
      const z = -118 - i * 9;
      for (let s = 0; s < 2; s++) {
        const idx = i * 2 + s;
        const x = s === 0 ? -5.6 : 5.6;
        dummy.position.set(x, 2.1, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        posts.current!.setMatrixAt(idx, dummy.matrix);
        dummy.position.set(x, 4.4, z);
        dummy.updateMatrix();
        globes.current!.setMatrixAt(idx, dummy.matrix);
      }
    }
    posts.current!.instanceMatrix.needsUpdate = true;
    globes.current!.instanceMatrix.needsUpdate = true;
  }, [dummy]);
  const iron = useMemo(() => new THREE.MeshStandardMaterial({ color: "#101219", roughness: 0.7, metalness: 0.4 }), []);
  const globe = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffc37a", toneMapped: false }), []);
  return (
    <group>
      <instancedMesh ref={posts} args={[undefined, undefined, N * 2]} material={iron}>
        <cylinderGeometry args={[0.08, 0.12, 4.4, 6]} />
      </instancedMesh>
      <instancedMesh ref={globes} args={[undefined, undefined, N * 2]} material={globe}>
        <sphereGeometry args={[0.42, 12, 12]} />
      </instancedMesh>
      {[-127, -154, -181].map((z) => (
        <pointLight key={z} color="#ffb060" intensity={30} distance={30} decay={2} position={[0, 5, z]} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Open-air gallery: his photographs in floating gilt frames           */
/* ------------------------------------------------------------------ */
function GalleryFrames() {
  const textures = useTexture(PHOTOS);
  const group = useRef<THREE.Group>(null);
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#8a6a35", roughness: 0.5, metalness: 0.6 }), []);
  const frames: { x: number; y: number; z: number; w: number; h: number; seed: number }[] = [
    { x: -6.4, y: 4.6, z: -138, w: 4.4, h: 3.2, seed: 1 },
    { x: 6.4, y: 5.2, z: -146, w: 3.6, h: 4.4, seed: 2 },
    { x: -6.4, y: 4.2, z: -156, w: 4.8, h: 3.4, seed: 3 },
    { x: 6.4, y: 5.6, z: -164, w: 3.8, h: 3.8, seed: 4 },
    { x: -6.4, y: 5.0, z: -172, w: 4.2, h: 3.0, seed: 5 },
    { x: 6.4, y: 4.4, z: -180, w: 4.6, h: 3.4, seed: 6 },
  ];
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      child.position.y = frames[i].y + Math.sin(t * 0.7 + frames[i].seed * 1.7) * 0.22;
    });
  });
  return (
    <group ref={group}>
      {frames.map((f, i) => (
        <group key={i} position={[f.x, f.y, f.z]} rotation={[0, f.x < 0 ? 0.32 : -0.32, 0]}>
          {/* gilt frame */}
          <mesh material={frameMat}>
            <boxGeometry args={[f.w + 0.35, f.h + 0.35, 0.12]} />
          </mesh>
          {/* photo */}
          <mesh position={[0, 0, 0.08]}>
            <planeGeometry args={[f.w, f.h]} />
            <meshBasicMaterial map={textures[i]} toneMapped={false} />
          </mesh>
          {/* soft glow behind */}
          <mesh position={[0, 0, -0.15]}>
            <planeGeometry args={[f.w + 1.2, f.h + 1.2]} />
            <meshBasicMaterial color={AMBER} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Fireflies drifting over the Kraków street                            */
/* ------------------------------------------------------------------ */
function Fireflies() {
  const ref = useRef<THREE.Points>(null);
  const N = 90;
  const { geo, seeds } = useMemo(() => {
    const rnd = mulberry(31337);
    const pos = new Float32Array(N * 3);
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (rnd() - 0.5) * 22;
      pos[i * 3 + 1] = 1 + rnd() * 7;
      pos[i * 3 + 2] = -115 - rnd() * 80;
      seeds[i] = rnd() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo: g, seeds };
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = ref.current?.geometry.attributes.position as THREE.BufferAttribute;
    if (!p) return;
    for (let i = 0; i < N; i++) {
      p.setX(i, p.getX(i) + Math.sin(t * 0.6 + seeds[i]) * 0.006);
      p.setY(i, p.getY(i) + Math.cos(t * 0.45 + seeds[i] * 1.3) * 0.005);
    }
    p.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#ffcf7a" size={0.14} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig: scroll flight Goa → crossing → Kraków + light grading    */
/* ------------------------------------------------------------------ */
function CameraRig({ rig }: { rig: React.MutableRefObject<ScrollRig> }) {
  const hemi = useRef<THREE.HemisphereLight>(null);
  const dir = useRef<THREE.DirectionalLight>(null);
  const dirWarm = useMemo(() => new THREE.Color("#ff9a50"), []);
  const dirCool = useMemo(() => new THREE.Color("#7a90c8"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const p = rig.current.progress;
    const cam = state.camera;
    // flight path: beach → causeway → old town
    cam.position.z = 26 - p * 224;
    cam.position.x = Math.sin(p * Math.PI * 2.2) * 1.4 + rig.current.pointerX * 1.1;
    cam.position.y = 3.6 + Math.sin(p * Math.PI) * 0.9 + rig.current.pointerY * 0.5;
    cam.lookAt(cam.position.x * 0.4, 3.1, cam.position.z - 32);
    // grade the world: warm dusk → blue night
    (state.scene.fog as THREE.Fog).color.copy(tmp.copy(FOG_WARM).lerp(FOG_NIGHT, p));
    if (hemi.current) hemi.current.intensity = THREE.MathUtils.lerp(0.55, 0.32, p);
    if (dir.current) {
      dir.current.intensity = THREE.MathUtils.lerp(1.35, 0.5, p);
      dir.current.color.copy(tmp.copy(dirWarm).lerp(dirCool, p));
    }
  });
  return (
    <>
      <fogExp2 attach="fog" args={[FOG_WARM.clone(), 0.0075]} />
      <hemisphereLight ref={hemi} args={["#35406b", "#1a120c", 0.55]} />
      <directionalLight ref={dir} position={[-40, 26, -40]} intensity={1.35} color="#ff9a50" />
      <ambientLight intensity={0.14} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                                */
/* ------------------------------------------------------------------ */
export default function ExperienceScene({ rig }: { rig: React.MutableRefObject<ScrollRig> }) {
  const narrow = useMemo(() => typeof window !== "undefined" && window.innerWidth < 768, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 3.6, 26], fov: narrow ? 74 : 58, near: 0.1, far: 900 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <React.Suspense fallback={null}>
          <SkyDome rig={rig} />
          <Stars rig={rig} />
          <Sun rig={rig} />
          <Sea />
          <Palms />
          <Chapel />
          <Boats />
          <Causeway />
          <ShipLights />
          <Townhouses narrow={narrow} />
          <ChurchTowers />
          <StreetLamps />
          <GalleryFrames />
          <Fireflies />
          {/* Kraków cobblestone street */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, -158]}>
            <planeGeometry args={[13, 100]} />
            <meshStandardMaterial color="#1c1a24" roughness={0.55} metalness={0.25} />
          </mesh>
          <CameraRig rig={rig} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
