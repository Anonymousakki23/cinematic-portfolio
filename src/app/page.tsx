import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050510]">
      <PathDrawingPortfolioHero
        brand="Akshay Iyer"
        tagline="Lead Analyst & Trainer — Krakow, Poland"
        eyebrow="Portfolio"
        className="w-full"
      />
    </main>
  );
}
