"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export const CHAPTERS = [
  { id: "ch-intro", label: "ENTER", index: "00" },
  { id: "ch-origin", label: "ORIGIN", index: "01" },
  { id: "ch-crossing", label: "CROSSING", index: "02" },
  { id: "ch-krakow", label: "KRAKÓW", index: "03" },
  { id: "ch-photo", label: "LIGHT", index: "04" },
  { id: "ch-contact", label: "CONTACT", index: "05" },
];

const AMBER = "#ffb454";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function Corner({ className, style }: { className: string; style?: React.CSSProperties }) {
  return <div aria-hidden style={style} className={`pointer-events-none absolute h-8 w-8 ${className}`} />;
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
      className="pointer-events-none fixed left-0 top-0 z-[70] h-7 w-7 rounded-full border mix-blend-difference"
      style={{ borderColor: `${AMBER}cc`, willChange: "transform" }}
    />
  );
}

/* Goa 15.4969°N 73.8278°E → Kraków 50.0647°N 19.9450°E */
function useCoordinates(progress: number) {
  const lat = 15.4969 + progress * (50.0647 - 15.4969);
  const lon = 73.8278 + progress * (19.945 - 73.8278);
  return `${lat.toFixed(2)}°N · ${Math.abs(lon).toFixed(2)}°E`;
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
  const km = Math.round(progress * 6500);
  const coords = useCoordinates(progress);

  return (
    <>
      {/* film grain + vignette */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay animate-grain"
          style={{ backgroundImage: GRAIN_SVG, backgroundSize: "180px 180px" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 52%, rgba(4,3,10,0.55) 100%)" }}
        />
      </div>

      {/* corner brackets */}
      <div aria-hidden className="pointer-events-none fixed inset-4 z-[61] hidden sm:block">
        <Corner className="left-0 top-0 border-l-2 border-t-2" style={{ borderColor: `${AMBER}99` }} />
        <Corner className="right-0 top-0 border-r-2 border-t-2" style={{ borderColor: `${AMBER}99` }} />
        <Corner className="bottom-0 left-0 border-b-2 border-l-2" style={{ borderColor: `${AMBER}99` }} />
        <Corner className="bottom-0 right-0 border-b-2 border-r-2" style={{ borderColor: `${AMBER}99` }} />
      </div>

      {/* mono telemetry labels */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[61] hidden font-mono-sci text-[10px] tracking-[0.22em] uppercase sm:block"
        style={{ color: `${AMBER}99` }}
      >
        <div className="absolute left-10 top-9">goa, in → kraków, pl</div>
        <div className="absolute right-10 top-9">journey {String(pct).padStart(3, "0")}%</div>
        <div className="absolute bottom-9 left-10">{km.toLocaleString()} km · {coords}</div>
        <div className="absolute bottom-9 right-10">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-blink rounded-full" style={{ backgroundColor: AMBER }} />
          en route
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
                  active ? "opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
                }`}
                style={active ? { color: AMBER } : undefined}
              >
                {ch.label}
              </span>
              <motion.span
                className={`block rounded-full transition-colors ${
                  active ? "" : "bg-white/25 group-hover:bg-white/60"
                }`}
                style={active ? { backgroundColor: AMBER, boxShadow: `0 0 10px ${AMBER}e6` } : undefined}
                animate={{ width: active ? 10 : 6, height: active ? 10 : 6 }}
                transition={{ duration: 0.25 }}
              />
            </button>
          );
        })}
        <div className="mt-1 h-16 w-px bg-white/10">
          <motion.div className="w-px" style={{ height: `${progress * 100}%`, backgroundColor: `${AMBER}b3` }} />
        </div>
      </nav>

      <CursorRing />
    </>
  );
}
