"use client";

import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Camera, ImagePlus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const photos = [
  { src: "/photography/ig-bee.webp", category: "Macro", alt: "Honey bee macro" },
  { src: "/photography/ig-squirrel.webp", category: "Wildlife", alt: "Red squirrel, Park Jordana" },
  { src: "/photography/ig-spider.jpg", category: "Macro", alt: "Striped lynx spider" },
  { src: "/photography/ig-lightning.jpg", category: "Landscape", alt: "Lightning storm over the city" },
  { src: "/photography/ig-moss.jpg", category: "Macro", alt: "Forest floor micro-ecosystem" },
  { src: "/photography/ig-kingfisher.jpg", category: "Wildlife", alt: "Common kingfisher with catch" },
  { src: "/photography/ig-glowshroom.jpg", category: "Macro", alt: "Glowing mushroom in the forest" },
  { src: "/photography/ig-snake.jpg", category: "Wildlife", alt: "Checkered keelback" },
  { src: "/photography/ig-ant.jpg", category: "Macro", alt: "Weaver ant" },
  { src: "/photography/ig-butterfly.jpg", category: "Macro", alt: "Butterfly in monochrome" },
  { src: "/photography/ig-peacock.jpg", category: "Wildlife", alt: "Peacock in flight" },
  { src: "/photography/ig-lily.jpg", category: "Macro", alt: "Water lily in bloom" },
  { src: "/photography/ig-lizard.jpg", category: "Wildlife", alt: "Monitor lizard portrait" },
  { src: "/photography/ig-waterfall.jpg", category: "Landscape", alt: "Waterfall long exposure, Bali" },
  { src: "/photography/ig-trainstreet.jpg", category: "Travel", alt: "Train Street, Hanoi at dusk" },
  { src: "/photography/ig-lanterns.jpg", category: "Travel", alt: "Lantern-lit night market" },
  { src: "/photography/ig-bonfire.jpg", category: "Landscape", alt: "Beach bonfire at sunset" },
  { src: "/photography/ig-reichstag.jpg", category: "Travel", alt: "Reichstag dome interior, Berlin" },
  { src: "/photography/ig-dragon.jpg", category: "Travel", alt: "Wawel dragon breathing fire" },
  { src: "/photography/ig-pagoda.jpg", category: "Travel", alt: "Pagoda on the lake, Vietnam" },
  { src: "/photography/ig-baligate.jpg", category: "Travel", alt: "Temple gate, Bali" },
  { src: "/photography/ig-prague.jpg", category: "Travel", alt: "Prague old town panorama" },
  { src: "/photography/ig-ghost.jpg", category: "Travel", alt: "Hooded statue, Prague" },
  { src: "/photography/ig-bruges.jpg", category: "Travel", alt: "Bruges canal at night" },
  { src: "/photography/ig-strasbourg.jpg", category: "Travel", alt: "Strasbourg Cathedral" },
];

const categories = ["All", ...new Set(photos.map((p) => p.category))];

export default function PhotographyPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const filtered = selectedCat === "All" ? photos : photos.filter((p) => p.category === selectedCat);

  const openLightbox = useCallback((idx: number) => {
    setSelectedIdx(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  const goPrev = useCallback(() => {
    setSelectedIdx((prev) => (prev !== null ? (prev - 1 + filtered.length) % filtered.length : null));
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setSelectedIdx((prev) => (prev !== null ? (prev + 1) % filtered.length : null));
  }, [filtered.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeLightbox, goPrev, goNext]);

  // Close lightbox when category changes and selected photo is out of bounds
  useEffect(() => {
    if (selectedIdx !== null && selectedIdx >= filtered.length) {
      setSelectedIdx(null);
    }
  }, [selectedCat, filtered.length, selectedIdx]);

  return (
    <main className="min-h-screen bg-[#050510]">
      <PathDrawingPortfolioHero
        brand="Photography"
        tagline="Capturing moments through the lens"
        eyebrow="Gallery"
        className="w-full"
      />
      
      <section className="relative z-10 py-10 px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={cn(
                  "px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300",
                  selectedCat === cat
                    ? "border-sci-cyan bg-sci-cyan/20 text-sci-cyan glow-cyan"
                    : "border-white/20 text-white/70 hover:border-sci-cyan/50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((photo, idx) => (
              <motion.button
                key={`${photo.src}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4">
                  <span className="text-white font-orbitron text-sm">{photo.alt}</span>
                  <span className="text-sci-cyan text-xs mt-1">{photo.category}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Camera className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 font-orbitron">No photos in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && filtered[selectedIdx] && (
          <Dialog open={true} onOpenChange={() => setSelectedIdx(null)}>
            <DialogContent className="max-w-5xl p-0 border-white/20 bg-[#050510]/95 backdrop-blur-xl">
              <button
                onClick={closeLightbox}
                className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative flex items-center justify-center p-4 sm:p-8">
                <img src={filtered[selectedIdx].src} alt={filtered[selectedIdx].alt} className="max-h-[76vh] max-w-full rounded-lg object-contain" />
                <button
                  onClick={goPrev}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white/80 border border-white/10 hover:text-sci-cyan hover:border-sci-cyan/50 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white/80 border border-white/10 hover:text-sci-cyan hover:border-sci-cyan/50 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                <div>
                  <p className="font-orbitron text-sm text-white">{filtered[selectedIdx].alt}</p>
                  <p className="text-xs text-sci-cyan mt-0.5">{filtered[selectedIdx].category}</p>
                </div>
                <span className="font-mono-sci text-xs text-white/50">
                  {selectedIdx + 1} / {filtered.length}
                </span>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </main>
  );
}
