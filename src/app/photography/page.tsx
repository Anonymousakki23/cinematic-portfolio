"use client";

import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Camera, ImagePlus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const photos = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", category: "Landscape", alt: "Mountain landscape" },
  { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800", category: "Landscape", alt: "Night sky stars" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", category: "Portrait", alt: "Portrait photo" },
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800", category: "Portrait", alt: "Person portrait" },
  { src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", category: "Food", alt: "Food photography" },
  { src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", category: "Food", alt: "Pizza" },
  { src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", category: "Architecture", alt: "Modern architecture" },
  { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", category: "Architecture", alt: "City building" },
  { src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800", category: "Nature", alt: "Nature" },
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
              <div className="flex items-center justify-center gap-4 p-4">
                <button onClick={goPrev} className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors" aria-label="Previous">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <img src={filtered[selectedIdx].src} alt={filtered[selectedIdx].alt} className="max-h-[80vh] max-w-full rounded-lg object-contain" />
                <button onClick={goNext} className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors" aria-label="Next">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </main>
  );
}
