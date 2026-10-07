"use client";

import { motion, useInView, animate, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { BarChart3, Users, Camera, ArrowRight } from "lucide-react";

/**
 * HOME-DEMO — sample: the home page restyled in the JARVIS module system,
 * with a scroll-driven 3D hologram layer behind the content.
 * Standalone demo; not linked in nav.
 */

/* --------------------------------- pieces -------------------------------- */

function Corners() {
  const c = "pointer-events-none absolute h-4 w-4 border-sci-cyan/80";
  return (
    <>
      <span className={`${c} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${c} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} right-0 bottom-0 border-r-2 border-b-2`} />
    </>
  );
}

function HudPanel({
  index,
  title,
  children,
  className = "",
}: {
  index: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className={`relative border border-sci-cyan/15 bg-[#070b16]/85 p-6 backdrop-blur-sm md:p-8 ${className}`}
    >
      <Corners />
      <div className="mb-6 flex items-center justify-between border-b border-sci-cyan/10 pb-4">
        <p className="font-mono-sci text-xs tracking-[0.3em] text-sci-cyan/90 uppercase">
          <span className="text-white/30">{index}</span>
          <span className="mx-3 text-white/20">//</span>
          {title}
        </p>
        <span className="flex items-center gap-2 font-mono-sci text-[10px] tracking-[0.25em] text-sci-cyan/60 uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sci-cyan" />
          live
        </span>
      </div>
      {children}
    </motion.section>
  );
}

function StatCell({ to, suffix, label }: { to: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <div ref={ref} className="relative border border-white/10 bg-white/[0.02] p-6 text-center">
      <span className="pointer-events-none absolute top-1 left-1 h-3 w-3 border-t border-l border-sci-cyan/50" />
      <span className="pointer-events-none absolute right-1 bottom-1 h-3 w-3 border-r border-b border-sci-cyan/50" />
      <p className="font-orbitron text-3xl font-bold text-sci-cyan tabular-nums md:text-4xl">
        {val}
        {suffix}
      </p>
      <p className="font-mono-sci mt-2 text-[10px] tracking-[0.25em] text-white/40 uppercase">
        {label}
      </p>
    </div>
  );
}

/** Scroll-driven 3D hologram layer: wireframe reactor + particle field. */
function HologramLayer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 500);
    camera.position.set(0, 0, 62);

    const holo = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: "#22d3ee", wireframe: true, transparent: true, opacity: 0.32 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(15, 3.6, 10, 42), mat);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(6.5, 1), mat.clone());
    (core.material as THREE.Material).transparent = true;
    (core.material as THREE.MeshBasicMaterial).opacity = 0.22;
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(22, 0.5, 8, 64), mat.clone());
    (orbit.material as THREE.MeshBasicMaterial).opacity = 0.18;
    orbit.rotation.x = Math.PI / 2.4;
    holo.add(ring, core, orbit);
    holo.position.set(window.innerWidth > 768 ? 20 : 0, 2, 0);
    scene.add(holo);

    // particle field
    const pCount = 260;
    const pGeo = new THREE.BufferGeometry();
    const pArr = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pArr[i * 3] = (Math.random() - 0.5) * 160;
      pArr[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pArr[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: "#22d3ee", size: 0.55, transparent: true, opacity: 0.5 })
    );
    scene.add(points);

    let raf = 0;
    const clock = new THREE.Clock();
    function scrollP() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      return Math.min(1, Math.max(0, window.scrollY / (total || 1)));
    }
    function tick() {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const p = scrollP();
      // scroll choreography: spin up, rise, fade as content takes over
      holo.rotation.y = t * 0.08 + p * Math.PI * 2.5;
      holo.rotation.x = Math.sin(t * 0.2) * 0.15 + p * 0.6;
      holo.position.y = 2 - p * 34;
      const fade = 1 - p * 0.75;
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.32 * fade;
      (core.material as THREE.MeshBasicMaterial).opacity = 0.22 * fade;
      (orbit.material as THREE.MeshBasicMaterial).opacity = 0.18 * fade;
      (points.material as THREE.PointsMaterial).opacity = 0.5 * fade;
      points.rotation.y = t * 0.015;
      camera.position.z = 62 - p * 14;
      renderer.render(scene, camera);
    }
    tick();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      holo.position.x = window.innerWidth > 768 ? 20 : 0;
    }
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

/* ---------------------------------- data --------------------------------- */

const stats = [
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 400, suffix: "+", label: "Team Members Led" },
  { value: 2, suffix: "", label: "Countries Worked" },
  { value: 2, suffix: "+", label: "Awards Won" },
];

const capabilities = [
  { icon: BarChart3, title: "Data Analysis", text: "Pipelines, dashboards and insights that turn raw data into decisions.", accent: "text-sci-cyan" },
  { icon: Users, title: "Training & Leadership", text: "Built and mentored high-performing teams across regions and time zones.", accent: "text-sci-purple" },
  { icon: Camera, title: "Photography", text: "Macro and wildlife photography — patience, light and a Canon 77D.", accent: "text-sci-magenta" },
];

const shots = [
  { src: "/photography/ig-bee.webp", tag: "MACRO // APIS" },
  { src: "/photography/ig-kingfisher.jpg", tag: "WILDLIFE // ALCEDO" },
  { src: "/photography/ig-lightning.jpg", tag: "STORM // KRAKÓW" },
  { src: "/photography/ig-squirrel.webp", tag: "PARK JORDANA" },
];

/* ---------------------------------- page --------------------------------- */

export default function HomeDemoPage() {
  const [now, setNow] = useState("--:--:--");
  const [today, setToday] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setToday(
        d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase()
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const { scrollYProgress } = useScroll();
  void scrollYProgress;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050510]">
      <HologramLayer />

      {/* backdrop grid + scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.05]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 2px, #22d3ee 2px 3px)" }}
      />

      {/* system bar */}
      <div className="relative z-10 border-b border-sci-cyan/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4">
          <p className="font-mono-sci text-xs tracking-[0.35em] text-sci-cyan uppercase">J.A.R.V.I.S.</p>
          <p className="hidden font-mono-sci text-xs tracking-[0.25em] text-white/40 uppercase md:block">
            Home interface // demo
          </p>
          <p className="font-mono-sci text-xs tracking-[0.15em] text-white/60 tabular-nums">
            <span className="mr-3 hidden text-white/35 sm:inline">{today}</span>
            {now} <span className="ml-2 text-sci-cyan">● SYS NOMINAL</span>
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-6 py-14">
        {/* hero viewport */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden border border-sci-cyan/20 bg-[#070b16]/80 p-8 backdrop-blur-sm md:p-14"
        >
          <Corners />
          <p className="font-mono-sci mb-6 text-xs tracking-[0.35em] text-sci-cyan/80 uppercase">
            Main viewport // subject
          </p>
          <h1 className="font-orbitron text-4xl font-bold text-white md:text-6xl">
            Akshay Iyer
          </h1>
          <p className="font-mono-sci mt-4 text-sm tracking-[0.2em] text-sci-cyan uppercase">
            Ecommerce Trainer — TELUS Digital
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
            Chasing light toward the decisive moment.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/50">
            Trainer, analyst and photographer — from Goan kitchens to
            Google-scale data programs, now crafting AI data solutions in Kraków.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/experience"
              className="font-mono-sci inline-flex items-center gap-3 border border-sci-cyan/50 bg-sci-cyan/10 px-6 py-3 text-xs tracking-[0.25em] text-sci-cyan uppercase transition-colors hover:bg-sci-cyan/20"
            >
              Enter the journey <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="font-mono-sci inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-xs tracking-[0.25em] text-white/70 uppercase transition-colors hover:border-sci-cyan/40 hover:text-white"
            >
              Open a channel
            </Link>
          </div>
        </motion.header>

        {/* metrics */}
        <HudPanel index="02" title="Performance metrics">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <StatCell key={s.label} to={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </HudPanel>

        {/* optical archive */}
        <HudPanel index="03" title="Optical archive">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {shots.map((s) => (
              <div key={s.src} className="group relative overflow-hidden border border-white/10">
                <img src={s.src} alt={s.tag} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <p className="font-mono-sci absolute bottom-0 left-0 bg-black/60 px-2 py-1 text-[9px] tracking-[0.2em] text-sci-cyan">
                  {s.tag}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <Link href="/photography" className="font-mono-sci text-xs tracking-[0.25em] text-sci-cyan/70 uppercase transition-colors hover:text-sci-cyan">
              Full archive →
            </Link>
          </div>
        </HudPanel>

        {/* capabilities */}
        <HudPanel index="04" title="Capability modules">
          <div className="grid gap-6 md:grid-cols-3">
            {capabilities.map((c) => (
              <div key={c.title} className="border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-sci-cyan/30">
                <c.icon className={`h-7 w-7 ${c.accent} mb-4`} />
                <h3 className="font-orbitron mb-2 text-base font-semibold text-white">{c.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{c.text}</p>
              </div>
            ))}
          </div>
        </HudPanel>

        {/* journey teaser */}
        <HudPanel index="05" title="The journey">
          <Link href="/experience" className="group relative block overflow-hidden border border-amber-200/15">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2a1503] via-[#0d0a18] to-[#050510]" />
            <div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_20%_50%,rgba(240,168,64,0.22),transparent_70%)]" />
            <div className="relative px-8 py-10 md:px-12">
              <p className="font-mono-sci mb-3 text-xs tracking-[0.3em] text-amber-200/70 uppercase">
                Goa, IN ————— Kraków, PL
              </p>
              <h2 className="font-orbitron text-2xl font-bold text-white md:text-3xl">
                From Goa to Kraków.
              </h2>
              <p className="font-mono-sci mt-4 inline-flex items-center gap-3 text-xs tracking-[0.25em] text-amber-100/80 uppercase transition-colors group-hover:text-amber-100">
                Enter the journey <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
        </HudPanel>

        <p className="pt-4 text-center font-mono-sci text-[11px] tracking-[0.3em] text-white/25 uppercase">
          End of demo // J.A.R.V.I.S. stands by, sir
        </p>
      </div>
    </main>
  );
}
