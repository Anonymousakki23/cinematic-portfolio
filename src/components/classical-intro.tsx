"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Classical gate intro, modeled on the reference site's ceremony:
 * - Oxblood radial vignette, warm off-white Cinzel wordmark
 * - Mark blooms, wordmark resolves as ONE unit (fade + rise 14px,
 *   .68s expo-out), tagline fades, ENTER stone button settles in
 * - Greek/Latin toggle crossfades per-letter with a glyph scramble
 * - Film-grain overlay, SKIP INTRO, auto-dismiss
 */
const LATIN = "AKSHAY";
const GREEK = "ΑΚΣΑΪ";
const GLYPH_POOL = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STORAGE_KEY = "cinematic-intro-seen";
const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ClassicalIntro({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [greek, setGreek] = useState(false);
  const [chars, setChars] = useState<string[]>(LATIN.split(""));
  const [reducedMotion, setReducedMotion] = useState(false);
  const scrambleRaf = useRef(0);
  const dismissed = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* storage unavailable — show intro once anyway */
    }
    setVisible(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  const dismiss = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    cancelAnimationFrame(scrambleRaf.current);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
    document.body.style.overflow = "";
    onDone?.();
  }, [onDone]);

  // Lock scroll while the gate is up
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // Ceremony timeline, then auto-dismiss
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(dismiss, reducedMotion ? 1200 : 12000);
    return () => window.clearTimeout(t);
  }, [visible, reducedMotion, dismiss]);

  useEffect(() => () => cancelAnimationFrame(scrambleRaf.current), []);

  const toggleScript = useCallback(() => {
    setGreek((prev) => {
      const next = !prev;
      const target = (next ? GREEK : LATIN).split("");
      cancelAnimationFrame(scrambleRaf.current);
      if (reducedMotion) {
        setChars(target);
        return next;
      }
      const dur = 550;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const resolved = Math.floor(t * target.length);
        setChars(
          target.map((c, i) =>
            i < resolved
              ? c
              : GLYPH_POOL[(Math.random() * GLYPH_POOL.length) | 0]
          )
        );
        if (t < 1) scrambleRaf.current = requestAnimationFrame(tick);
        else setChars(target);
      };
      scrambleRaf.current = requestAnimationFrame(tick);
      return next;
    });
  }, [reducedMotion]);

  const word = chars.join("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid cursor-pointer place-items-center"
          style={{
            background:
              "radial-gradient(ellipse at center, #4F0C1D 0%, #430816 55%, #240309 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
          onClick={dismiss}
          role="dialog"
          aria-label="Intro — activate to enter the portfolio"
        >
          {/* film grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-soft-light"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.55) 0 1px, transparent 1px 3px)",
            }}
          />

          {/* skip */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
            className="font-classical absolute top-6 right-8 text-[9px] tracking-[0.18em] text-[#f8f6f2]/60 uppercase transition-colors hover:text-[#f8f6f2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: reducedMotion ? 0 : 0.8,
              delay: reducedMotion ? 0 : 1.2,
            }}
          >
            Skip intro
          </motion.button>

          {/* centered lockup: mark → wordmark → tagline → toggle → enter */}
          <div className="flex w-[min(72%,560px)] flex-col items-center text-center">
            {/* diamond mark */}
            <motion.div
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reducedMotion ? 0 : 1.1,
                delay: reducedMotion ? 0 : 0.5,
                ease: EXPO_OUT,
              }}
              className="relative"
            >
              {/* ember bloom behind the mark */}
              <motion.div
                aria-hidden
                className="absolute inset-[-28px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(185,21,46,0.35) 0%, transparent 70%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: reducedMotion ? 0 : 1.6,
                  delay: reducedMotion ? 0 : 0.5,
                  times: [0, 0.45, 1],
                }}
              />
              <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden>
                <path
                  d="M36 6 L66 36 L36 66 L6 36 Z"
                  fill="none"
                  stroke="#f8f6f2"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                />
                <circle cx="36" cy="36" r="2.5" fill="#f8f6f2" fillOpacity="0.75" />
              </svg>
            </motion.div>

            {/* wordmark — resolves as one unit: fade + rise 14px */}
            <motion.h1
              className="font-classical mt-8 text-[clamp(42px,6vw,68px)] leading-none font-normal tracking-[0.26em] text-[#f8f6f2] uppercase"
              style={{
                textIndent: "0.26em",
                textShadow:
                  "0 1px 0 rgba(0,0,0,0.45), 0 2px 14px rgba(0,0,0,0.4)",
              }}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.68,
                delay: reducedMotion ? 0 : 1.6,
                ease: EXPO_OUT,
              }}
              aria-label={greek ? "Akshay in Greek lettering" : "Akshay"}
            >
              {word}
            </motion.h1>

            {/* tagline */}
            <motion.p
              className="font-accent mt-6 text-lg text-[#f8f6f2]/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0 : 0.8,
                delay: reducedMotion ? 0 : 2.5,
                ease: EXPO_OUT,
              }}
            >
              Chasing light toward the decisive moment.
            </motion.p>

            {/* greek/latin toggle */}
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleScript();
              }}
              aria-label="Activate to switch between Greek and Latin lettering."
              className="font-classical mt-8 text-[11px] tracking-[0.2em] text-[#f8f6f2]/55 transition-colors hover:text-[#f8f6f2]/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reducedMotion ? 0 : 0.8,
                delay: reducedMotion ? 0 : 3.0,
                ease: EXPO_OUT,
              }}
            >
              Activate to switch between Greek and Latin lettering.
            </motion.button>

            {/* enter */}
            <motion.div
              className="relative mt-12"
              style={{ transformPerspective: 400 }}
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 6,
                rotateX: reducedMotion ? 0 : 3.2,
              }}
              animate={{ opacity: 0.94, y: 0, rotateX: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.6,
                delay: reducedMotion ? 0 : 3.1,
                ease: EXPO_OUT,
              }}
            >
              {/* contact shadow */}
              <motion.div
                aria-hidden
                className="absolute -bottom-5 left-1/2 h-6 w-44 -translate-x-1/2 rounded-[50%] bg-black/50 blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.6,
                  delay: reducedMotion ? 0 : 3.1,
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  dismiss();
                }}
                className="font-classical rounded-md border border-white/10 bg-gradient-to-b from-[#0b090a] to-black px-12 py-4 text-xs tracking-[0.35em] text-[#f8f6f2] uppercase shadow-[inset_0_1px_0_rgba(248,246,242,0.12),0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-[1.03]"
                style={{ textIndent: "0.35em" }}
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
