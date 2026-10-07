"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import Link from "next/link";

/**
 * FPV voyage demo — the same Goa → Kraków crossing panorama as the
 * experience page, but travelled in first person: scroll drives the
 * camera forward through the scene instead of panning past it.
 */
export default function VoyageDemoPage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ vw: 0, vh: 0 });
  const [km, setKm] = useState(6500);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const measure = () =>
      setDims({ vw: window.innerWidth, vh: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Panorama is 3:1 — at full viewport height it's 300vh wide.
  const imgW = dims.vh * 3;
  const maxScale = 1.45;
  const maxX = Math.max(0, imgW * maxScale - dims.vw);

  // Camera: travel right while pushing in = first-person forward motion.
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, maxScale]);

  const kmMotion = useTransform(scrollYProgress, [0, 1], [6500, 0]);
  useMotionValueEvent(kmMotion, "change", (v) => setKm(Math.round(v)));
  useMotionValueEvent(scrollYProgress, "change", (v) => setArrived(v > 0.93));
  const routeW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Caption beats.
  const cap1 = useTransform(scrollYProgress, [0, 0.06, 0.2, 0.3], [0, 1, 1, 0]);
  const cap2 = useTransform(
    scrollYProgress,
    [0.34, 0.42, 0.56, 0.64],
    [0, 1, 1, 0]
  );
  const cap3 = useTransform(scrollYProgress, [0.68, 0.76, 1, 1], [0, 1, 1, 1]);
  const endCard = useTransform(scrollYProgress, [0.88, 0.96], [0, 1]);
  const hudDim = useTransform(scrollYProgress, [0.88, 0.96], [1, 0.25]);

  return (
    <main className="bg-[#050510] text-white">
      {/* intro */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono-sci mb-6 text-xs tracking-[0.35em] text-sci-cyan/80 uppercase">
          FPV voyage — demo
        </p>
        <h1 className="font-orbitron max-w-3xl text-3xl font-bold md:text-5xl">
          The crossing, in first person.
        </h1>
        <p className="mt-6 max-w-xl text-white/60">
          The same Goa → Kraków panorama from the experience page — but this
          time you&apos;re on the boat. Scroll to travel.
        </p>
        <p className="font-mono-sci mt-10 animate-bounce text-xs tracking-[0.3em] text-white/40 uppercase">
          ↓ scroll
        </p>
      </section>

      {/* voyage */}
      <div ref={targetRef} className="relative h-[450vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* camera */}
          <motion.div
            style={{ x, scale, transformOrigin: "left center" }}
            className="absolute inset-y-0 left-0"
          >
            {/* gentle boat bob */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="h-full"
            >
              <img
                src="/journey/fg/crossing-panorama.webp"
                alt="Watercolor panorama: Goa fort and beach giving way to Kraków's church towers"
                draggable={false}
                className="h-full w-auto max-w-none select-none"
                style={imgW ? { width: `${imgW}px` } : undefined}
              />
            </motion.div>
          </motion.div>

          {/* cinematic vignette + letterbox */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,0.55)_100%)]"
          />
          <div aria-hidden className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

          {/* HUD */}
          <motion.div
            style={{ opacity: hudDim }}
            className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5"
          >
            <p className="font-mono-sci text-[11px] tracking-[0.3em] text-white/70 uppercase">
              02 — The Crossing <span className="text-sci-cyan">// FPV</span>
            </p>
            <p className="font-mono-sci text-[11px] tracking-[0.25em] text-white/70 uppercase tabular-nums">
              Kraków{" "}
              <span className="text-sci-cyan">
                {km.toLocaleString("en-US")} km
              </span>
            </p>
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
              <div className="font-mono-sci mt-3 flex justify-between text-[10px] tracking-[0.3em] text-white/45 uppercase">
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
                Departure
              </p>
              <h2 className="font-orbitron text-3xl font-bold md:text-5xl">
                The fort falls behind.
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
                Arrived — Kraków, PL
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
