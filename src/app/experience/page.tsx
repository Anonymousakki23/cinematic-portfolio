"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ExperienceHud, { CHAPTERS } from "@/components/experience/ExperienceHud";
import ExperiencePreloader from "@/components/experience/ExperiencePreloader";
import type { ScrollRig } from "@/components/experience/ExperienceScene";

const ExperienceScene = dynamic(() => import("@/components/experience/ExperienceScene"), {
  ssr: false,
});

/* Masked line reveal: line rises out of an overflow-hidden mask.
   The whileInView trigger sits on the OUTER mask element (which is never
   clipped, so the observer fires reliably); the inner line animates via
   variants. Observing the translated child directly never fires — a fully
   clipped element has zero intersection area. */
function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.span
      className="block overflow-hidden pb-1"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-18%" }}
    >
      <motion.span
        className="block will-change-transform"
        variants={{
          hidden: { y: "112%" },
          show: {
            y: "0%",
            transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
          },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <motion.p
      className="mb-6 font-mono-sci text-[11px] tracking-[0.32em] text-sci-cyan/80 uppercase"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.p>
  );
}

function ChapterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group mt-10 inline-flex items-center gap-3 rounded-md border border-sci-cyan/40 bg-sci-cyan/5 px-7 py-3.5 font-orbitron text-xs tracking-[0.2em] text-sci-cyan uppercase backdrop-blur-sm transition-all duration-300 hover:bg-sci-cyan/15 hover:glow-cyan"
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
    </Link>
  );
}

export default function ExperiencePage() {
  const rig = useRef<ScrollRig>({ progress: 0, pointerX: 0, pointerY: 0 });
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    const chapters = () => Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        rig.current.progress = p;
        setProgress(p);
        const els = chapters();
        let active = 0;
        els.forEach((el, i) => {
          if (el.getBoundingClientRect().top <= window.innerHeight * 0.55) active = i;
        });
        setActiveChapter(active);
      });
    };
    const onPointer = (e: PointerEvent) => {
      rig.current.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      rig.current.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const jump = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="relative overflow-x-hidden bg-[#04040c] text-white">
      {!ready && <ExperiencePreloader onDone={() => setReady(true)} />}
      <ExperienceScene rig={rig} />
      <ExperienceHud progress={progress} activeChapter={activeChapter} onJump={jump} />

      <div className="relative z-10">
        {/* 00 — ENTER */}
        <section id="ch-intro" data-chapter className="flex min-h-[130vh] flex-col items-center justify-center px-6 text-center">
          <Eyebrow>{"00 // enter — night city online"}</Eyebrow>
          <h1 className="font-orbitron text-5xl font-bold leading-[1.05] sm:text-7xl md:text-8xl">
            <RevealLine>TRAVERSE</RevealLine>
            <RevealLine delay={0.12}>
              <span className="text-gradient">THE SIGNAL</span>
            </RevealLine>
          </h1>
          <motion.p
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            A scroll-flight down the neon avenue. Every district is a craft I
            practice: data, training, photography. Keep scrolling — the city
            moves with you.
          </motion.p>
          <motion.div
            className="mt-16 flex flex-col items-center gap-3 font-mono-sci text-[10px] tracking-[0.3em] text-sci-cyan/60 uppercase"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            scroll to enter
            <motion.span
              className="block w-px bg-sci-cyan/70"
              animate={{ height: [24, 56, 24] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </section>

        {/* 01 — DATA */}
        <section id="ch-data" data-chapter className="flex min-h-[150vh] items-center px-6">
          <div className="mx-auto w-full max-w-6xl md:ml-[8%] md:max-w-xl md:text-left text-center">
            <Eyebrow>{"01 // data district"}</Eyebrow>
            <h2 className="font-orbitron text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              <RevealLine>DATA,</RevealLine>
              <RevealLine delay={0.12}>
                <span className="text-sci-cyan">DECODED</span>
              </RevealLine>
            </h2>
            <motion.p
              className="mt-6 max-w-md leading-relaxed text-white/60"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Pipelines, dashboards and insights that turn raw data into decisions.
              Ecommerce analytics at TELUS Digital — precision over noise, signal over static.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <ChapterLink href="/resume">view resume</ChapterLink>
            </motion.div>
          </div>
        </section>

        {/* 02 — TRAINING */}
        <section id="ch-training" data-chapter className="flex min-h-[150vh] items-center justify-end px-6">
          <div className="mx-auto w-full max-w-6xl md:mr-[8%] md:max-w-xl md:text-right text-center">
            <Eyebrow>{"02 // training district"}</Eyebrow>
            <h2 className="font-orbitron text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              <RevealLine>400+ MINDS,</RevealLine>
              <RevealLine delay={0.12}>
                <span className="text-sci-purple">ONE SIGNAL</span>
              </RevealLine>
            </h2>
            <motion.p
              className="mt-6 leading-relaxed text-white/60 md:ml-auto md:max-w-md"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Built and mentored high-performing teams across regions and time zones.
              Training systems that scale — from onboarding to leadership.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <ChapterLink href="/about">about me</ChapterLink>
            </motion.div>
          </div>
        </section>

        {/* 03 — PHOTOGRAPHY */}
        <section id="ch-photo" data-chapter className="flex min-h-[160vh] flex-col items-center justify-center px-6 text-center">
          <Eyebrow>{"03 // photo district"}</Eyebrow>
          <h2 className="font-orbitron text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            <RevealLine>LIGHT,</RevealLine>
            <RevealLine delay={0.12}>
              <span className="text-sci-magenta">CAPTURED</span>
            </RevealLine>
          </h2>
          <motion.p
            className="mx-auto mt-6 max-w-md leading-relaxed text-white/60"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Macro and wildlife photography — patience, light and a Canon 77D.
            The holographic billboards around you are real shots from the field.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <ChapterLink href="/photography">full gallery</ChapterLink>
          </motion.div>
        </section>

        {/* 04 — CONTACT */}
        <section id="ch-contact" data-chapter className="flex min-h-[130vh] flex-col items-center justify-center px-6 text-center">
          <Eyebrow>{"04 // city exit"}</Eyebrow>
          <h2 className="font-orbitron text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
            <RevealLine>OPEN A</RevealLine>
            <RevealLine delay={0.12}>
              <span className="text-gradient">CHANNEL</span>
            </RevealLine>
          </h2>
          <motion.p
            className="mx-auto mt-6 max-w-md leading-relaxed text-white/60"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            You have reached the end of the avenue. The city hums below.
            Say hello — I answer fast.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <ChapterLink href="/contact">contact me</ChapterLink>
          </motion.div>
          <motion.p
            className="mt-20 font-mono-sci text-[10px] tracking-[0.3em] text-white/25 uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            end of transmission_
          </motion.p>
        </section>
      </div>
    </main>
  );
}
