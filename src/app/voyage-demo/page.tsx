"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import Link from "next/link";
import * as THREE from "three";

/**
 * The Crossing — 3D drone flight. Scroll flies a real camera through a
 * stylized 3D world: Goa fort and palms → open ocean → Kraków's towers
 * rising out of indigo dusk. Same journey as the experience page.
 */

const AMBER = new THREE.Color("#f7c489");
const INDIGO = new THREE.Color("#2b2a5e");

type Key = { p: number; pos: [number, number, number]; look: [number, number, number] };
const KEYS: Key[] = [
  { p: 0.0, pos: [-115, 44, 135], look: [-35, 12, -5] },
  { p: 0.22, pos: [40, 52, 115], look: [70, 10, -10] },
  { p: 0.45, pos: [240, 60, 85], look: [290, 12, -20] },
  { p: 0.68, pos: [420, 50, 90], look: [505, 24, 0] },
  { p: 0.85, pos: [520, 34, 62], look: [562, 32, 0] },
  { p: 1.0, pos: [578, 27, 44], look: [564, 36, 0] },
];

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function keyframe(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  let a = KEYS[0];
  let b = KEYS[KEYS.length - 1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (p >= KEYS[i].p && p <= KEYS[i + 1].p) {
      a = KEYS[i];
      b = KEYS[i + 1];
      break;
    }
  }
  const t = smooth(Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p || 1))));
  outPos.set(
    a.pos[0] + (b.pos[0] - a.pos[0]) * t,
    a.pos[1] + (b.pos[1] - a.pos[1]) * t,
    a.pos[2] + (b.pos[2] - a.pos[2]) * t
  );
  outLook.set(
    a.look[0] + (b.look[0] - a.look[0]) * t,
    a.look[1] + (b.look[1] - a.look[1]) * t,
    a.look[2] + (b.look[2] - a.look[2]) * t
  );
}

function makePalm(): THREE.Group {
  const g = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: "#8a6a45", roughness: 1 });
  const frondMat = new THREE.MeshStandardMaterial({ color: "#3f7a3a", roughness: 1, side: THREE.DoubleSide });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 9, 6), trunkMat);
  trunk.position.y = 4.5;
  trunk.rotation.z = (Math.random() - 0.5) * 0.15;
  g.add(trunk);
  for (let i = 0; i < 7; i++) {
    const frond = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 4.6), frondMat);
    const a = (i / 7) * Math.PI * 2;
    frond.position.y = 9;
    frond.rotation.y = a;
    frond.rotation.x = -0.55 - Math.random() * 0.25;
    frond.translateZ(1.6);
    g.add(frond);
  }
  const nuts = new THREE.Mesh(new THREE.SphereGeometry(0.5, 6, 6), new THREE.MeshStandardMaterial({ color: "#6a4a25" }));
  nuts.position.y = 8.6;
  g.add(nuts);
  return g;
}

function makeBoat(): THREE.Group {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: "#6a4a30", roughness: 1 });
  const hull = new THREE.Mesh(new THREE.BoxGeometry(7, 1.6, 2.4), hullMat);
  hull.position.y = 0.8;
  g.add(hull);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 7, 5), hullMat);
  mast.position.y = 4.5;
  g.add(mast);
  const sailShape = new THREE.Shape();
  sailShape.moveTo(0, 0);
  sailShape.lineTo(4.6, 1.2);
  sailShape.lineTo(0, 6.2);
  sailShape.lineTo(0, 0);
  const sail = new THREE.Mesh(
    new THREE.ShapeGeometry(sailShape),
    new THREE.MeshStandardMaterial({ color: "#d9c49a", side: THREE.DoubleSide, roughness: 1 })
  );
  sail.position.set(0.15, 1.8, 0);
  g.add(sail);
  return g;
}

export default function VoyageDemoPage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [km, setKm] = useState(6500);
  const [alt, setAlt] = useState(120);
  const [coords, setCoords] = useState("15.49°N 073.83°E");
  const [arrived, setArrived] = useState(false);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setKm(Math.round(6500 * (1 - p)));
    setAlt(Math.round(120 - 95 * p));
    const lat = 15.49 + (50.06 - 15.49) * p;
    const lng = 73.83 + (19.94 - 73.83) * p;
    setCoords(`${lat.toFixed(2)}°N ${Math.abs(lng).toFixed(2)}°E`);
    setArrived(p > 0.94);
  });

  const routeW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const cap1 = useTransform(scrollYProgress, [0, 0.06, 0.18, 0.28], [0, 1, 1, 0]);
  const cap2 = useTransform(scrollYProgress, [0.32, 0.4, 0.55, 0.63], [0, 1, 1, 0]);
  const cap3 = useTransform(scrollYProgress, [0.67, 0.75, 1, 1], [0, 1, 1, 1]);
  const endCard = useTransform(scrollYProgress, [0.9, 0.97], [0, 1]);
  const hudDim = useTransform(scrollYProgress, [0.9, 0.97], [1, 0.25]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color().copy(AMBER);
    scene.fog = new THREE.Fog(new THREE.Color().copy(AMBER), 130, 680);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.5,
      2200
    );

    // lights
    const hemi = new THREE.HemisphereLight("#ffd9a0", "#1a2a5e", 0.95);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight("#ffb36b", 1.5);
    sun.position.set(420, 140, 220);
    scene.add(sun);
    const krakowGlow = new THREE.PointLight("#ff9a5a", 900, 260, 1.8);
    krakowGlow.position.set(560, 45, 0);
    scene.add(krakowGlow);

    // ocean
    const oceanGeo = new THREE.PlaneGeometry(1500, 850, 64, 36);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanBase = oceanGeo.attributes.position.array.slice();
    const ocean = new THREE.Mesh(
      oceanGeo,
      new THREE.MeshStandardMaterial({ color: "#1d3a6e", roughness: 0.55, metalness: 0.25 })
    );
    ocean.position.set(280, 0, 0);
    scene.add(ocean);

    // sun disc
    const sunDisc = new THREE.Mesh(
      new THREE.SphereGeometry(26, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#ffd9a0", fog: false })
    );
    sunDisc.position.set(760, 85, -220);
    scene.add(sunDisc);

    // ---- Goa island ----
    const sandMat = new THREE.MeshStandardMaterial({ color: "#d9b77c", roughness: 1 });
    const grassMat = new THREE.MeshStandardMaterial({ color: "#6f9448", roughness: 1 });
    const beach = new THREE.Mesh(new THREE.CylinderGeometry(88, 96, 5, 28), sandMat);
    beach.position.set(-30, 1, 0);
    scene.add(beach);
    const island = new THREE.Mesh(new THREE.CylinderGeometry(68, 80, 9, 28), grassMat);
    island.position.set(-30, 5.5, 0);
    scene.add(island);

    // fort
    const fortMat = new THREE.MeshStandardMaterial({ color: "#c9a06a", roughness: 1 });
    const fort = new THREE.Group();
    const wall = new THREE.Mesh(new THREE.BoxGeometry(38, 11, 26), fortMat);
    wall.position.y = 5.5;
    fort.add(wall);
    for (const [bx, bz] of [[-19, -13], [19, -13], [-19, 13], [19, 13]] as const) {
      const bastion = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5, 15, 8), fortMat);
      bastion.position.set(bx, 7.5, bz);
      fort.add(bastion);
    }
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4, 20, 8), fortMat);
    tower.position.set(0, 10, 0);
    fort.add(tower);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(3.6, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: "#a8814f", roughness: 1 })
    );
    dome.position.set(0, 20, 0);
    fort.add(dome);
    fort.position.set(-42, 10, -8);
    scene.add(fort);

    // palms
    for (let i = 0; i < 18; i++) {
      const palm = makePalm();
      const a = Math.random() * Math.PI * 2;
      const r = 18 + Math.random() * 42;
      palm.position.set(-30 + Math.cos(a) * r, 10, Math.sin(a) * r * 0.8);
      palm.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.8 + Math.random() * 0.5;
      palm.scale.setScalar(s);
      scene.add(palm);
    }

    // boats
    const boat1 = makeBoat();
    boat1.position.set(55, 0.4, 42);
    boat1.rotation.y = 0.7;
    scene.add(boat1);
    const boat2 = makeBoat();
    boat2.position.set(78, 0.4, 18);
    boat2.rotation.y = -0.4;
    boat2.scale.setScalar(0.8);
    scene.add(boat2);

    // ---- Kraków ----
    const cityBase = new THREE.Mesh(
      new THREE.CylinderGeometry(115, 128, 13, 28),
      new THREE.MeshStandardMaterial({ color: "#3c3a55", roughness: 1 })
    );
    cityBase.position.set(560, 4, 0);
    scene.add(cityBase);

    const churchMat = new THREE.MeshStandardMaterial({ color: "#6b5a4e", roughness: 1 });
    const spireMat = new THREE.MeshStandardMaterial({ color: "#2a2438", roughness: 1 });
    const windowMat = new THREE.MeshBasicMaterial({ color: "#ffd27a" });
    function churchTower(x: number, z: number, h: number, spireH: number) {
      const g = new THREE.Group();
      const t = new THREE.Mesh(new THREE.BoxGeometry(11, h, 11), churchMat);
      t.position.y = h / 2;
      g.add(t);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(7.5, spireH, 4), spireMat);
      spire.position.y = h + spireH / 2;
      spire.rotation.y = Math.PI / 4;
      g.add(spire);
      for (let i = 0; i < 3; i++) {
        const w = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.6), windowMat);
        w.position.set(0, h * 0.45 + i * 8, 5.55);
        g.add(w);
      }
      g.position.set(x, 10.5, z);
      scene.add(g);
    }
    churchTower(548, -14, 58, 30); // taller spire — St. Mary's signature
    churchTower(548, 14, 46, 18);
    const nave = new THREE.Mesh(new THREE.BoxGeometry(30, 20, 34), churchMat);
    nave.position.set(566, 20, 0);
    scene.add(nave);

    // old-town rooftops
    const roofCount = 30;
    const houseGeo = new THREE.BoxGeometry(8, 6, 8);
    const roofGeo = new THREE.ConeGeometry(6.4, 4.5, 4);
    const houseMat = new THREE.MeshStandardMaterial({ color: "#4d4260", roughness: 1 });
    const roofMat = new THREE.MeshStandardMaterial({ color: "#5e3a3f", roughness: 1 });
    const houses = new THREE.InstancedMesh(houseGeo, houseMat, roofCount);
    const roofs = new THREE.InstancedMesh(roofGeo, roofMat, roofCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < roofCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 30 + Math.random() * 72;
      const hx = 560 + Math.cos(a) * r;
      const hz = Math.sin(a) * r * 0.85;
      const hh = 4 + Math.random() * 5;
      dummy.position.set(hx, 10.5 + hh / 2, hz);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      houses.setMatrixAt(i, dummy.matrix);
      dummy.position.y = 10.5 + hh + 2.2;
      dummy.rotation.y += Math.PI / 4;
      dummy.updateMatrix();
      roofs.setMatrixAt(i, dummy.matrix);
    }
    scene.add(houses);
    scene.add(roofs);

    // voyage path — dotted arc fort → church
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-42, 34, -8),
      new THREE.Vector3(260, 120, -40),
      new THREE.Vector3(552, 78, 0)
    );
    const dotGeo = new THREE.SphereGeometry(1.4, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: "#ffd27a" });
    const dots = new THREE.InstancedMesh(dotGeo, dotMat, 26);
    for (let i = 0; i < 26; i++) {
      const pt = curve.getPoint(i / 25);
      dummy.position.copy(pt);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      dots.setMatrixAt(i, dummy.matrix);
    }
    scene.add(dots);

    // birds
    const birdMat = new THREE.MeshBasicMaterial({ color: "#20203a", side: THREE.DoubleSide });
    const birds: THREE.Group[] = [];
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Group();
      const w1 = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.7), birdMat);
      w1.position.x = -1.5;
      w1.rotation.z = 0.35;
      const w2 = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.7), birdMat);
      w2.position.x = 1.5;
      w2.rotation.z = -0.35;
      b.add(w1, w2);
      b.position.set(-60 + Math.random() * 120, 40 + Math.random() * 25, -40 + Math.random() * 60);
      scene.add(b);
      birds.push(b);
    }

    // camera state
    const camPos = new THREE.Vector3(...KEYS[0].pos);
    const camLook = new THREE.Vector3(...KEYS[0].look);
    const tgtPos = new THREE.Vector3();
    const tgtLook = new THREE.Vector3();
    const bg = new THREE.Color();

    const el = targetRef.current;
    let raf = 0;
    const clock = new THREE.Clock();

    function progress() {
      if (!el) return 0;
      const start = el.offsetTop;
      const total = el.offsetHeight - window.innerHeight;
      return Math.min(1, Math.max(0, (window.scrollY - start) / (total || 1)));
    }

    function tick() {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const p = progress();

      // ocean waves
      const posAttr = oceanGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const bx = oceanBase[i * 3];
        const bz = oceanBase[i * 3 + 2];
        posAttr.setY(i, Math.sin(bx * 0.045 + t * 1.1) * 0.9 + Math.cos(bz * 0.06 + t * 1.4) * 0.7);
      }
      posAttr.needsUpdate = true;
      oceanGeo.computeVertexNormals();

      // birds drift
      for (let i = 0; i < birds.length; i++) {
        const b = birds[i];
        b.position.x += 0.12 + i * 0.015;
        b.position.y += Math.sin(t * 2 + i * 2.4) * 0.03;
        if (b.position.x > 160) b.position.x = -90;
      }

      // dots pulse
      dots.scale.setScalar(1 + Math.sin(t * 3) * 0.12);

      // boats bob
      boat1.position.y = 0.4 + Math.sin(t * 1.6) * 0.35;
      boat1.rotation.z = Math.sin(t * 1.2) * 0.05;
      boat2.position.y = 0.4 + Math.sin(t * 1.9 + 2) * 0.3;

      // camera
      keyframe(p, tgtPos, tgtLook);
      camPos.lerp(tgtPos, 0.07);
      camLook.lerp(tgtLook, 0.07);
      camera.position.copy(camPos);
      camera.lookAt(camLook);

      // amber → indigo grade
      bg.lerpColors(AMBER, INDIGO, smooth(Math.min(1, Math.max(0, (p - 0.35) / 0.65))));
      (scene.background as THREE.Color).copy(bg);
      (scene.fog as THREE.Fog).color.copy(bg);
      hemi.intensity = 0.95 - p * 0.35;
      sun.intensity = 1.5 - p * 0.8;
      krakowGlow.intensity = 900 + p * 1400;

      renderer.render(scene, camera);
    }
    tick();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
    };
  }, []);

  return (
    <main className="bg-[#050510] text-white">
      {/* intro */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono-sci mb-6 text-xs tracking-[0.35em] text-sci-cyan/80 uppercase">
          3D drone flight — demo
        </p>
        <h1 className="font-orbitron max-w-3xl text-3xl font-bold md:text-5xl">
          The crossing, in the round.
        </h1>
        <p className="mt-6 max-w-xl text-white/60">
          A real 3D world this time — no flat image. Scroll to fly the drone
          from the Goan fort, across the ocean, onto Kraków&apos;s church
          towers.
        </p>
        <p className="font-mono-sci mt-10 animate-bounce text-xs tracking-[0.3em] text-white/40 uppercase">
          ↓ scroll
        </p>
      </section>

      {/* flight */}
      <div ref={targetRef} className="relative h-[500vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div ref={mountRef} className="absolute inset-0" />

          {/* cinematic vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,0.45)_100%)]"
          />

          {/* HUD */}
          <motion.div
            style={{ opacity: hudDim }}
            className="absolute inset-x-0 top-0 px-6 py-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono-sci text-[11px] tracking-[0.3em] text-white/80 uppercase">
                02 — The Crossing <span className="text-sci-cyan">// 3D</span>
              </p>
              <p className="font-mono-sci text-[11px] tracking-[0.25em] text-white/80 uppercase tabular-nums">
                alt <span className="text-sci-cyan">{alt} m</span>
              </p>
            </div>
            <div className="font-mono-sci mt-2 flex items-center justify-between text-[11px] tracking-[0.25em] text-white/60 uppercase tabular-nums">
              <span>{coords}</span>
              <span>
                Kraków{" "}
                <span className="text-sci-cyan">
                  {km.toLocaleString("en-US")} km
                </span>
              </span>
            </div>
          </motion.div>

          {/* route progress */}
          <motion.div
            style={{ opacity: hudDim }}
            className="absolute inset-x-0 bottom-8 px-6"
          >
            <div className="mx-auto max-w-md">
              <div className="relative h-px bg-white/20">
                <motion.div
                  className="absolute top-0 left-0 h-px bg-sci-cyan shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                  style={{ width: routeW }}
                />
              </div>
              <div className="font-mono-sci mt-3 flex justify-between text-[10px] tracking-[0.3em] text-white/50 uppercase">
                <span>Goa</span>
                <span>6,500 km</span>
                <span>Kraków</span>
              </div>
            </div>
          </motion.div>

          {/* caption beats */}
          <motion.div
            style={{ opacity: cap1 }}
            className="pointer-events-none absolute inset-0 flex items-end px-6 pb-28 md:px-16"
          >
            <div>
              <p className="font-mono-sci mb-3 text-[11px] tracking-[0.35em] text-sci-cyan uppercase">
                Liftoff
              </p>
              <h2 className="font-orbitron text-3xl font-bold md:text-5xl">
                Over the fort.
              </h2>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: cap2 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
          >
            <div className="text-center">
              <p className="font-mono-sci mb-3 text-[11px] tracking-[0.35em] text-sci-cyan uppercase">
                Open water
              </p>
              <h2 className="font-orbitron text-3xl font-bold md:text-5xl">
                6,500 km of blue.
              </h2>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: cap3 }}
            className="pointer-events-none absolute inset-0 flex items-end justify-end px-6 pb-28 text-right md:px-16"
          >
            <div>
              <p className="font-mono-sci mb-3 text-[11px] tracking-[0.35em] text-sci-cyan uppercase">
                Landfall
              </p>
              <h2 className="font-orbitron text-3xl font-bold md:text-5xl">
                The towers rise.
              </h2>
            </div>
          </motion.div>

          {/* end card */}
          <motion.div
            style={{ opacity: endCard }}
            className={`absolute inset-0 flex items-center justify-center bg-black/55 px-6 backdrop-blur-[2px] ${
              arrived ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div className="text-center">
              <p className="font-mono-sci mb-4 text-xs tracking-[0.35em] text-sci-cyan uppercase">
                Touchdown — Kraków, PL
              </p>
              <h2 className="font-orbitron text-3xl font-bold md:text-4xl">
                End of the crossing.
              </h2>
              <Link
                href="/experience"
                className="font-mono-sci mt-8 inline-flex items-center gap-3 rounded-full border border-sci-cyan/40 px-8 py-3 text-xs tracking-[0.25em] text-white uppercase transition-colors hover:bg-sci-cyan/10"
              >
                Continue the journey <span aria-hidden="true">→</span>
              </Link>
              <p className="font-mono-sci mt-6 text-[10px] tracking-[0.25em] text-white/35 uppercase">
                Demo — not part of the main experience
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
