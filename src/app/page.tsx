"use client";

import { motion, useInView, animate, useTransform } from "motion/react";
import { ChevronRight, ChevronDown, BarChart3, Users, Camera } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Hero3D from "@/components/hero-3d";
import ClassicalIntro from "@/components/classical-intro";
import { usePointerMotion, TiltCard } from "@/components/motion-controls";

const navItems = [
  { href: "/about", label: "About", color: "bg-sci-cyan" },
  { href: "/resume", label: "Resume", color: "bg-sci-purple" },
  { href: "/photography", label: "Photography", color: "bg-sci-magenta" },
  { href: "/contact", label: "Contact", color: "bg-sci-cyan" },
];

const galleryShots = [
  { src: "/photography/ig-bee.webp", alt: "Honey bee macro" },
  { src: "/photography/ig-lightning.jpg", alt: "Lightning storm over the city" },
  { src: "/photography/ig-squirrel.webp", alt: "Red squirrel, Park Jordana" },
  { src: "/photography/ig-spider.jpg", alt: "Striped lynx spider" },
  { src: "/photography/ig-kingfisher.jpg", alt: "Common kingfisher with catch" },
  { src: "/photography/ig-moss.jpg", alt: "Forest floor micro-ecosystem" },
  { src: "/photography/ig-snake.jpg", alt: "Checkered keelback" },
  { src: "/photography/ig-glowshroom.jpg", alt: "Glowing mushroom in the forest" },
  { src: "/photography/ig-ant.jpg", alt: "Weaver ant" },
  { src: "/photography/ig-butterfly.jpg", alt: "Butterfly in monochrome" },
];

const stats = [
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 400, suffix: "+", label: "Team Members Led" },
  { value: 2, suffix: "", label: "Countries Worked" },
  { value: 2, suffix: "+", label: "Awards Won" },
];

const capabilities = [
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: "Data Analysis",
    text: "Pipelines, dashboards and insights that turn raw data into decisions.",
    accent: "text-sci-cyan",
    ring: "hover:border-sci-cyan/50",
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Training & Leadership",
    text: "Built and mentored high-performing teams across regions and time zones.",
    accent: "text-sci-purple",
    ring: "hover:border-sci-purple/50",
  },
  {
    icon: <Camera className="h-7 w-7" />,
    title: "Photography",
    text: "Macro and wildlife photography — patience, light and a Canon 77D.",
    accent: "text-sci-magenta",
    ring: "hover:border-sci-magenta/50",
  },
];

function StatCounter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
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
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <motion.p
      className="mb-8 text-center font-mono-sci text-xs tracking-[0.3em] text-sci-cyan/80 uppercase"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.p>
  );
}

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const { x, y, needsPermission, enableTilt } = usePointerMotion();
  // Hero drifts subtly against the pointer; the glow follows it.
  const heroX = useTransform(x, (v) => v * -22);
  const heroY = useTransform(y, (v) => v * -14);
  const glowX = useTransform(x, (v) => v * 140);
  const glowY = useTransform(y, (v) => v * 100);

  return (
    <main className="relative min-h-screen bg-[#050510] overflow-hidden">
      {showIntro && <ClassicalIntro onDone={() => setShowIntro(false)} />}
      <Hero3D />
      {needsPermission && (
        <button
          onClick={enableTilt}
          className="fixed bottom-5 right-5 z-50 rounded-full border border-sci-cyan/40 bg-black/60 px-4 py-2 font-mono-sci text-xs tracking-widest text-sci-cyan uppercase backdrop-blur-sm hover:bg-sci-cyan/10"
        >
          Enable motion
        </button>
      )}
      <div className="relative z-10">
        {/* Hero */}
        <section className="grid-bg mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-24 pb-16">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] rounded-full opacity-25 blur-3xl"
            style={{
              x: glowX,
              y: glowY,
              marginLeft: "-18rem",
              marginTop: "-18rem",
              background:
                "radial-gradient(circle, rgba(0,255,255,0.35), rgba(123,97,255,0.15) 45%, transparent 65%)",
            }}
          />
          <motion.div className="w-full max-w-4xl text-center" style={{ x: heroX, y: heroY }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="mb-6 font-mono-sci text-xs tracking-[0.3em] text-sci-cyan/80 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {"// portfolio v2.0 — online"}
            </motion.p>

            <motion.h1
              className="font-orbitron text-6xl font-bold text-white sm:text-7xl md:text-8xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Akshay
              <span className="text-gradient"> Iyer</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/70 font-sans sm:text-xl text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Lead Analyst & Trainer — Crafting data-driven solutions and global leadership experiences across 400+ team members
            </motion.p>

            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
              }}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <TiltCard max={6}>
                  <Link
                    href={item.href}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-7 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sci-cyan/50 hover:bg-sci-cyan/10 hover:glow-cyan"
                  >
                    <span className={`h-2 w-2 rounded-full ${item.color} animate-pulse`} />
                    <span className="font-orbitron text-sm tracking-wide text-white group-hover:text-sci-cyan">
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-sci-cyan/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sci-cyan" />
                  </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-10 font-mono-sci text-xs text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <span className="text-sci-cyan/60">krakow,pl</span>
              <span className="mx-2 text-white/20">|</span>
              <span>data · training · photography</span>
            </motion.div>
          </motion.div>
          </motion.div>

          <motion.a
            href="#showreel"
            aria-label="Scroll to showreel"
            className="absolute bottom-8 text-sci-cyan/60 hover:text-sci-cyan transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.a>
        </section>

        {/* Photo filmstrip */}
        <section id="showreel" className="relative py-16">
          <SectionEyebrow>{"// showreel — through my lens"}</SectionEyebrow>
          <div className="marquee-hover overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="animate-marquee motion-reduce:animate-none flex w-max gap-4 pr-4">
              {[...galleryShots, ...galleryShots].map((shot, i) => (
                <div
                  key={`${shot.src}-${i}`}
                  className="group relative h-44 w-44 shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-52 sm:w-52"
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-xs text-white/90 font-mono-sci">{shot.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-center">
            <Link href="/photography" className="font-mono-sci text-xs tracking-[0.2em] text-sci-cyan/70 uppercase hover:text-sci-cyan transition-colors">
              {"view full gallery →"}
            </Link>
          </p>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionEyebrow>{"// by the numbers"}</SectionEyebrow>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6 text-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="font-orbitron text-4xl font-bold text-gradient md:text-5xl">
                  <StatCounter to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 font-mono-sci text-xs tracking-widest text-white/50 uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="mx-auto max-w-6xl px-6 py-16 pb-24">
          <SectionEyebrow>{"// what i do"}</SectionEyebrow>
          <div className="grid gap-6 md:grid-cols-3">
            {capabilities.map((cap, i) => (
              <TiltCard
                key={cap.title}
                max={8}
                className={`glass-card group p-8 ${cap.ring}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`${cap.accent} mb-5`}>{cap.icon}</div>
                <h3 className="font-orbitron text-lg font-semibold text-white mb-3">
                  {cap.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">{cap.text}</p>
              </TiltCard>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
