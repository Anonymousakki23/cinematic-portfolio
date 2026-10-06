"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function ExperiencePreloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setPct(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        setTimeout(() => {
          document.body.style.overflow = "";
          onDone();
        }, 750);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#04040c]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <p className="mb-4 font-mono-sci text-[10px] tracking-[0.3em] text-sci-cyan/70 uppercase">
            initializing experience
          </p>
          <div className="font-orbitron text-6xl font-bold text-white">
            {String(pct).padStart(3, "0")}
            <span className="text-sci-cyan">%</span>
          </div>
          <div className="mt-6 h-px w-56 bg-white/10">
            <div className="h-px bg-sci-cyan shadow-[0_0_12px_rgba(0,255,255,0.9)] transition-[width] duration-100" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-4 font-mono-sci text-[10px] tracking-[0.25em] text-white/30 uppercase">
            {pct < 40 ? "warming reactors" : pct < 75 ? "aligning optics" : "signal acquired"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="leaving"
          className="fixed inset-0 z-[80] bg-[#04040c]"
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
