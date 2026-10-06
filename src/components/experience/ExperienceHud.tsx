"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export const CHAPTERS = [
  { id: "ch-intro", label: "ENTER", index: "00" },
  { id: "ch-data", label: "DATA", index: "01" },
  { id: "ch-training", label: "TRAINING", index: "02" },
  { id: "ch-photo", label: "PHOTO", index: "03" },
  { id: "ch-contact", label: "CONTACT", index: "04" },
];

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function Corner({ className }: { className: string }) {
  return <div aria-hidden className={`pointer-events-none absolute h-8 w-8 border-sci-cyan/60 ${className}`} />;
}

/* Custom cursor: difference-blend ring that lerps after the pointer */
function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const el = ref.current;
    if (!el) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      el.style.transform = `translate(${x - 14}px, ${y - 14}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] h-7 w-7 rounded-full border border-sci-cyan/80 mix-blend-difference"
      style={{ willChange: "transform" }}
    />
  );
}

export default function ExperienceHud({
  progress,
  activeChapter,
  onJump,
}: {
  progress: number;
  activeChapter: number;
  onJump: (id: string) => void;
}) {
  const pct = Math.round(progress * 100);
  const depth = Math.round(progress * 178);

  return (
    <>
      {/* film grain + vignette + scanlines */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
        <div
          className="absolute inset-0 opacity-[0.055] mix-blend-overlay animate-grain"
          style={{ backgroundImage: GRAIN_SVG, backgroundSize: "180px 180px" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 52%, rgba(2,2,8,0.55) 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,255,255,0.5) 2px 3px)",
          }}
        />
      </div>

      {/* corner brackets */}
      <div aria-hidden className="pointer-events-none fixed inset-4 z-[61] hidden sm:block">
        <Corner className="left-0 top-0 border-l-2 border-t-2" />
        <Corner className="right-0 top-0 border-r-2 border-t-2" />
        <Corner className="bottom-0 left-0 border-b-2 border-l-2" />
        <Corner className="bottom-0 right-0 border-b-2 border-r-2" />
      </div>

      {/* mono telemetry labels */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[61] hidden font-mono-sci text-[10px] tracking-[0.22em] text-sci-cyan/60 uppercase sm:block">
        <div className="absolute left-10 top-9">AI_ // experience</div>
        <div className="absolute right-10 top-9">traverse {String(pct).padStart(3, "0")}%</div>
        <div className="absolute bottom-9 left-10">depth −{depth}m · sector 7G</div>
        <div className="absolute bottom-9 right-10">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-blink rounded-full bg-sci-cyan" />
          sys.online
        </div>
      </div>

      {/* dot rail */}
      <nav aria-label="Experience chapters" className="fixed right-5 top-1/2 z-[62] hidden -translate-y-1/2 flex-col items-center gap-5 sm:flex">
        {CHAPTERS.map((ch, i) => {
          const active = i === activeChapter;
          return (
            <button
              key={ch.id}
              onClick={() => onJump(ch.id)}
              aria-label={`Go to ${ch.label}`}
              className="group relative flex items-center"
            >
              <span
                className={`mr-3 font-mono-sci text-[9px] tracking-[0.2em] transition-opacity ${
                  active ? "text-sci-cyan opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
                }`}
              >
                {ch.label}
              </span>
              <motion.span
                className={`block rounded-full transition-colors ${
                  active ? "bg-sci-cyan shadow-[0_0_10px_rgba(0,255,255,0.9)]" : "bg-white/25 group-hover:bg-white/60"
                }`}
                animate={{ width: active ? 10 : 6, height: active ? 10 : 6 }}
                transition={{ duration: 0.25 }}
              />
            </button>
          );
        })}
        <div className="mt-1 h-16 w-px bg-white/10">
          <motion.div className="w-px bg-sci-cyan/70" style={{ height: `${progress * 100}%` }} />
        </div>
      </nav>

      <CursorRing />
    </>
  );
}
