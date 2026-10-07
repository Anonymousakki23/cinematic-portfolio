"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

/**
 * /welcome — the card-scan landing. A short JARVIS handshake ("card
 * scanned // access granted") that opens into the site. Linked from
 * the QR code and NFC tag on the business card.
 */

const SCAN_LINES = [
  "SIGNAL DETECTED // HANDSHAKE OK",
  "READING CREDENTIALS ............",
  "IDENTITY: GUEST // CLEARANCE: VISITOR",
  "DECRYPTING WELCOME PROTOCOL ....",
  "PROTOCOL READY",
];

export default function WelcomePage() {
  const [phase, setPhase] = useState<"scan" | "granted">("scan");
  const [lineCount, setLineCount] = useState(0);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (phase !== "scan") return;
    if (lineCount < SCAN_LINES.length) {
      const t = setTimeout(() => setLineCount((c) => c + 1), 620);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("granted"), 900);
    return () => clearTimeout(t);
  }, [lineCount, phase]);

  // Auto-lead into the home screen after access is granted.
  useEffect(() => {
    if (phase !== "granted") return;
    if (countdown <= 0) {
      window.location.href = "/";
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050510] px-6">
      <style>{`
        @keyframes scan-sweep {
          0% { top: 4%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: 94%; opacity: 0; }
        }
        .scan-beam { animation: scan-sweep 2.2s ease-in-out infinite; }
      `}</style>

      {/* backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,rgba(34,211,238,0.1),transparent_70%)]"
      />

      <AnimatePresence mode="wait">
        {phase === "scan" ? (
          <motion.div
            key="scan"
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-sm"
          >
            {/* card frame */}
            <div className="relative mx-auto aspect-[8/5] w-full max-w-xs border border-sci-cyan/30 bg-[#070b16]/80">
              <span className="pointer-events-none absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-sci-cyan" />
              <span className="pointer-events-none absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-sci-cyan" />
              <span className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-sci-cyan" />
              <span className="pointer-events-none absolute right-0 bottom-0 h-5 w-5 border-r-2 border-b-2 border-sci-cyan" />
              <div className="scan-beam absolute right-[6%] left-[6%] h-[3px] bg-sci-cyan shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-mono-sci text-[11px] tracking-[0.4em] text-sci-cyan/70 uppercase">
                  Scanning
                </p>
              </div>
            </div>

            {/* terminal lines */}
            <div className="font-mono-sci mt-8 min-h-32 space-y-2 text-xs tracking-[0.15em] text-sci-cyan/90">
              {SCAN_LINES.slice(0, lineCount).map((l, i) => (
                <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="mr-2 text-white/30">&gt;</span>
                  {l}
                </motion.p>
              ))}
            </div>

            {/* progress */}
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-sci-cyan shadow-[0_0_12px_rgba(34,211,238,0.7)] transition-all duration-500"
                style={{ width: `${(lineCount / SCAN_LINES.length) * 100}%` }}
              />
            </div>

            <button
              onClick={() => setPhase("granted")}
              className="font-mono-sci mt-8 w-full text-center text-[11px] tracking-[0.3em] text-white/35 uppercase transition-colors hover:text-white/70"
            >
              Tap to skip
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="granted"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-sm text-center"
          >
            <motion.img
              src="/brand/akki-logo.jpg"
              alt="AKKI emblem"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="mx-auto h-36 w-36 rounded-full border-2 border-sci-cyan/40 object-cover shadow-[0_0_40px_rgba(34,211,238,0.35)]"
            />
            <p className="font-mono-sci mt-8 text-xs tracking-[0.4em] text-emerald-300 uppercase">
              ● Access granted
            </p>
            <h1 className="font-orbitron mt-4 text-3xl font-bold text-white">
              Welcome.
            </h1>
            <p className="mt-4 leading-relaxed text-white/60">
              I&apos;m <span className="text-white">Akshay Iyer</span> — trainer,
              analyst, photographer. You scanned the card, so let me show you
              around properly.
            </p>
            <div className="mt-8 space-y-3">
              <Link
                href="/experience"
                className="font-mono-sci flex items-center justify-center gap-3 border border-sci-cyan/50 bg-sci-cyan/10 px-6 py-4 text-xs tracking-[0.25em] text-sci-cyan uppercase transition-colors hover:bg-sci-cyan/20"
              >
                Enter the journey <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="font-mono-sci flex items-center justify-center gap-3 border border-white/20 px-6 py-4 text-xs tracking-[0.25em] text-white/70 uppercase transition-colors hover:border-sci-cyan/40 hover:text-white"
              >
                <Home className="h-4 w-4" /> Home interface
              </Link>
            </div>
            <p className="font-mono-sci mt-8 text-[10px] tracking-[0.3em] text-white/25 uppercase">
              Scanned via card // J.A.R.V.I.S. stands by
            </p>
            <p className="font-mono-sci mt-3 text-[11px] tracking-[0.3em] text-sci-cyan/70 uppercase tabular-nums">
              Entering home interface in {countdown}…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
