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

const AMBER = "#ffb454";

/* Masked line reveal: line rises out of an overflow-hidden mask.
   The whileInView trigger sits on the OUTER mask element (which is never
   clipped, so the observer fires reliably); the inner line animates via
   variants. Observing the translated child directly never fires — a fully
   clipped element has zero intersection area. */
function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.span
      className="block overflow-hidden pb-2"
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
      className="mb-6 font-mono-sci text-xs tracking-[0.32em] uppercase"
      style={{ color: `${AMBER}cc` }}
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
      className="group mt-10 inline-flex items-center gap-3 rounded-md border px-7 py-3.5 font-mono-sci text-xs tracking-[0.2em] uppercase backdrop-blur-sm transition-all duration-300"
      style={{
        borderColor: `${AMBER}66`,
        backgroundColor: `${AMBER}0d`,
        color: AMBER,
      }}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
    </Link>
  );
}

function Body({ children, right = false }: { children: React.ReactNode; right?: boolean }) {
  return (
    <motion.p
      className={`mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg ${right ? "md:ml-auto" : ""}`}
      style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      {children}
    </motion.p>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-classical text-4xl font-medium leading-[1.12] text-[#f5ead6] sm:text-5xl md:text-6xl"
      style={{ textShadow: "0 2px 24px rgba(0,0,0,0.75)" }}
    >
      {children}
    </h2>
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
    <main className="relative overflow-x-hidden bg-[#070a14] text-white">
      {!ready && <ExperiencePreloader onDone={() => setReady(true)} />}
      <ExperienceScene rig={rig} />
      <ExperienceHud progress={progress} activeChapter={activeChapter} onJump={jump} />

      <div className="relative z-10">
        {/* 00 — ENTER */}
        <section id="ch-intro" data-chapter className="flex min-h-[130vh] flex-col items-center justify-center px-6 text-center">
          <Eyebrow>goa · india ————— kraków · poland</Eyebrow>
          <h1
            className="font-classical text-5xl font-medium leading-[1.08] text-[#f5ead6] sm:text-7xl md:text-8xl"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.8)" }}
          >
            <RevealLine>FROM GOA</RevealLine>
            <RevealLine delay={0.12}>
              <span style={{ color: AMBER }}>TO KRAKÓW</span>
            </RevealLine>
          </h1>
          <motion.p
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            One scroll, two homes. The coast that raised me, the city that made
            me — and the crafts I picked up along the way: data, training,
            photography. Keep scrolling; the journey moves with you.
          </motion.p>
          <motion.div
            className="mt-16 flex flex-col items-center gap-3 font-mono-sci text-[11px] tracking-[0.3em] uppercase"
            style={{ color: `${AMBER}99` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            scroll to begin the journey
            <motion.span
              className="block w-px"
              style={{ backgroundColor: `${AMBER}b3` }}
              animate={{ height: [24, 56, 24] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </section>

        {/* 01 — ORIGIN / GOA */}
        <section id="ch-origin" data-chapter className="flex min-h-[150vh] items-center px-6">
          <div className="mx-auto w-full max-w-6xl text-center md:ml-[8%] md:max-w-xl md:text-left">
            <Eyebrow>01 · origin — goa, india</Eyebrow>
            <Heading>
              <RevealLine>WHERE THE</RevealLine>
              <RevealLine delay={0.12}>
                <span style={{ color: AMBER }}>LIGHT BEGINS</span>
              </RevealLine>
            </Heading>
            <Body>
              Goa. Salt air, monsoon light, and a kid who took everything apart
              to see how it worked — from kitchen recipes to broken radios to
              code. Curiosity was the first skill. Everything else followed.
            </Body>
          </div>
        </section>

        {/* 02 — CROSSING */}
        <section id="ch-crossing" data-chapter className="flex min-h-[140vh] items-center justify-end px-6">
          <div className="mx-auto w-full max-w-6xl text-center md:mr-[8%] md:max-w-xl md:text-right">
            <Eyebrow>02 · the crossing — 6,500 km north</Eyebrow>
            <Heading>
              <RevealLine>THE LONG</RevealLine>
              <RevealLine delay={0.12}>
                <span style={{ color: AMBER }}>WAY NORTH</span>
              </RevealLine>
            </Heading>
            <Body right>
              One suitcase, one winter coat, one MSc in biotechnology. From the
              Arabian Sea to the Vistula. What survived the journey: work ethic,
              adaptability, and an appetite for reinvention.
            </Body>
          </div>
        </section>

        {/* 03 — KRAKÓW / CRAFT */}
        <section id="ch-krakow" data-chapter className="flex min-h-[160vh] items-center px-6">
          <div className="mx-auto w-full max-w-6xl text-center md:ml-[8%] md:max-w-xl md:text-left">
            <Eyebrow>03 · home — kraków, poland</Eyebrow>
            <Heading>
              <RevealLine>A CITY THAT</RevealLine>
              <RevealLine delay={0.12}>
                <span style={{ color: AMBER }}>ADOPTED ME</span>
              </RevealLine>
            </Heading>
            <Body>
              Kraków gave me a career. From hospitality kitchens to HCLTech to
              TELUS Digital — ecommerce analytics, training systems, and 400+
              people mentored across regions and time zones.
            </Body>
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

        {/* 04 — PHOTOGRAPHY */}
        <section id="ch-photo" data-chapter className="flex min-h-[160vh] flex-col items-center justify-center px-6 text-center">
          <Eyebrow>04 · the craft — light</Eyebrow>
          <Heading>
            <RevealLine>LIGHT,</RevealLine>
            <RevealLine delay={0.12}>
              <span style={{ color: AMBER }}>CAPTURED</span>
            </RevealLine>
          </Heading>
          <Body>
            Canon 77D, macro lens, infinite patience. The frames floating along
            this street are real shots — insects, birds, and street corners
            from two countries.
          </Body>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <ChapterLink href="/photography">full gallery</ChapterLink>
          </motion.div>
        </section>

        {/* 05 — CONTACT */}
        <section id="ch-contact" data-chapter className="flex min-h-[130vh] flex-col items-center justify-center px-6 text-center">
          <Eyebrow>05 · arrival</Eyebrow>
          <Heading>
            <RevealLine>WRITE THE</RevealLine>
            <RevealLine delay={0.12}>
              <span style={{ color: AMBER }}>NEXT CHAPTER</span>
            </RevealLine>
          </Heading>
          <Body>
            The journey continues. Say hello — I answer fast.
          </Body>
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
            goa ————— kraków · end of journey
          </motion.p>
        </section>
      </div>
    </main>
  );
}
