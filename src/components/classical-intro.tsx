"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const LATIN = "AKSHAY";
const GREEK = "ΑΚΣΑΪ";
const SEEN_KEY = "cinematic-portfolio-intro-seen";

const letterVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay: 0.35 + i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ClassicalIntro({ onDone }: { onDone: () => void }) {
  const [greek, setGreek] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [render, setRender] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY)) {
      setRender(false);
      onDone();
      return;
    }
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => dismiss(), reduce ? 800 : 5600);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    setLeaving(true);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setTimeout(() => {
      setRender(false);
      document.body.style.overflow = "";
      onDone();
    }, 750);
  };

  const name = greek ? GREEK : LATIN;

  return (
    <AnimatePresence>
      {render && (
        <motion.div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#f4efe4]"
          onClick={dismiss}
          initial={{ opacity: 1 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          role="dialog"
          aria-label="Site introduction"
        >
          {/* faint Greek-key inspired border */}
          <div className="pointer-events-none absolute inset-4 border border-[#1a1a1a]/15 sm:inset-6" />
          <div className="pointer-events-none absolute inset-5 border border-[#1a1a1a]/8 sm:inset-7" />

          <div className="relative flex flex-col items-center px-8 text-center text-[#1c1a15]">
            <motion.div
              className="mb-8 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <span className="h-px w-16 bg-[#1c1a15]/40 sm:w-24" />
              <span className="font-classical text-sm tracking-[0.5em] text-[#1c1a15]/70">
                I
              </span>
              <span className="h-px w-16 bg-[#1c1a15]/40 sm:w-24" />
            </motion.div>

            <motion.h1
              className="font-classical text-6xl font-medium tracking-[0.18em] sm:text-8xl md:text-9xl"
              initial="hidden"
              animate="show"
              aria-label={greek ? "Akshay in Greek lettering" : "Akshay"}
            >
              {name.split("").map((ch, i) => (
                <motion.span
                  key={`${greek}-${i}`}
                  custom={i}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {ch}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="font-classical mt-6 text-xl italic text-[#1c1a15]/75 sm:text-2xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              Chasing light toward the decisive moment.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGreek((g) => !g);
                }}
                className="font-classical text-xs tracking-[0.25em] text-[#1c1a15]/60 uppercase underline decoration-[#1c1a15]/30 underline-offset-4 hover:text-[#1c1a15] hover:decoration-[#1c1a15]/70"
              >
                Activate to switch between Greek and Latin lettering.
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismiss();
                }}
                className="font-classical border border-[#1c1a15]/50 px-10 py-3 text-sm tracking-[0.4em] uppercase transition-colors duration-300 hover:bg-[#1c1a15] hover:text-[#f4efe4]"
              >
                Enter
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
