"use client";

import Link from "next/link";

/* The experience is the re-themed Kage engine: a standalone WebGL page
   (Goan chapel, palms, golden sun — his Goa → Kraków story) served from
   /journey/journey.html and framed here full-viewport. */
export default function ExperiencePage() {
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0705]">
      <iframe
        src="/journey/journey.html"
        title="From Goa to Kraków — an interactive journey"
        className="h-full w-full border-0"
        allow="autoplay"
      />
      <Link
        href="/"
        aria-label="Back to portfolio"
        className="group fixed left-5 top-5 z-[70] inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/45 px-4 py-2.5 font-mono-sci text-[11px] tracking-[0.22em] text-[#f0a840] uppercase backdrop-blur-md transition-all duration-300 hover:border-[#f0a840]/60 hover:bg-black/65"
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
        portfolio
      </Link>
    </main>
  );
}
