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
 * Drone-flight demo — the Goa → Kraków crossing panorama travelled like
 * a drone: high and wide over Goa, across the sea, descending onto the
 * church towers. Same asset as the experience page.
 */
export default function VoyageDemoPage() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ vw: 0, vh: 0 });
  const [km, setKm] = useState(6500);
  const [alt, setAlt] = useState(120);
  const [coords, setCoords] = useState("15.49°N 073.83°E");
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

  // Wide aerial framing: image is 140vw, so most of the panorama stays
  // visible — the drone descends (scale up) as it travels right.
  const imgW = dims.vw * 1.4;
  const startScale = 0.8;
  const endScale = 1.12;
  const maxX = Math.max(0, imgW * endScale - dims.vw);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const scale = useTransform(scrollYProgress, [0, 1], [startScale, endScale]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setKm(Math.round(6500 * (1 - p)));
    setAlt(Math.round(120 - 95 * p));
    const lat = 15.49 + (50.06 - 15.49) * p;
    const lng = 73.83 + (19.94 - 73.83) * p;
    setCoords(
      `${lat.toFixed(2)}°N ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? "E" : "W"}`
    );
    setArrived(p > 0.93);
  });

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

  const edgeFade =
    "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)";

  return (
    <main className="bg-[#050510] text-white">
      {/* intro */}
      <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <p className="font-mono-sci mb-6 text-xs tracking-[0.35em] text-sci-cyan/80 uppercase">
          Drone flight — demo
        </p>
        <h1 className="font-orbitron max-w-3xl text-3xl font-bold md:text-5xl">
          The crossing, by drone.
        </h1>
        <p className="mt-6 max-w-xl text-white/60">
          The same Goa → Kraków panorama from the experience page — flown like
          a drone: liftoff over the fort, across 6,500 km of sea, descending
          onto the church towers. Scroll to fly.
        </p>
        <p className="font-mono-sci mt-10 animate-bounce text-xs tracking-[0.3em] text-white/40 uppercase">
          ↓ scroll
        </p>
      </section>

      {/* flight */}
      <div ref={targetRef} className="relative h-[450vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* aerial environment: dusk sky above, deep sea below */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #e9b96e 0%, #cf9460 28%, #7c5580 44%, #22346b 52%, #101a45 62%, #070d28 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(70%_40%_at_50%_48%,rgba(255,220,160,0.35),transparent_70%)]"
          />

          {/* drone camera */}
          <motion.div
            style={{ x, scale, transformOrigin: "left center" }}
            className="absolute inset-0"
          >
            <div className="flex h-full items-center">
              {/* gentle hover sway */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src="/journey/fg/crossing-panorama.webp"
                  alt="Watercolor panorama: Goa fort and beach giving way to Kraków's church towers"
                  draggable={false}
                  className="h-auto max-w-none select-none"
                  style={
                    imgW
                      ? {
                          width: `${imgW}px`,
                          maskImage: edgeFade,
                          WebkitMaskImage: edgeFade,
                        }
                      : undefined
                  }
                />
              </motion.div>
            </div>
          </motion.div>

          {/* cinematic vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,0.5)_100%)]"
          />

          {/* HUD */}
          <motion.div
            style={{ opacity: hudDim }}
            className="absolute inset-x-0 top-0 px-6 py-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono-sci text-[11px] tracking-[0.3em] text-white/80 uppercase">
                02 — The Crossing <span className="text-sci-cyan">// drone</span>
              </p>
              <p className="font-mono-sci text-[11px] tracking-[0.25em] text-white/80 uppercase tabular-nums">
                alt <span className="text-sci-cyan">{alt} m</span>
              </p>
            </div>
            <div className="font-mono-sci mt-2 flex items-center justify-between text-[11px] tracking-[0.25em] text-white/60 uppercase tabular-nums">
              <span>{coords}</span>
              <span>
                Kraków{" "}
                <span className="text-sci-cyan">
                  {km.toLocaleString("en-US")} km
                </span>
              </span>
            </div>
          </motion.div>

          {/* crosshair */}
          <motion.div
            style={{ opacity: hudDim }}
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="text-xl text-white/25">+</span>
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
              <div className="font-mono-sci mt-3 flex justify-between text-[10px] tracking-[0.3em] text-white/50 uppercase">
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
                Liftoff
              </p>
              <h2 className="font-orbitron text-3xl font-bold md:text-5xl">
                Over the fort.
              </h2>
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: cap2 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
          >
            <div className="text-center">
              <p className="font-mono-sci mb-3 text-[11px] tracking-[0.35em] text-sci-cyan uppercase">
                Cruise — 120 m
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
                Descent
              </p>
              <h2 className="font-orbitron text-3xl font-bold md:text-5xl">
                Onto the towers.
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
                Touchdown — Kraków, PL
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
