"use client";

import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050510]">
      <PathDrawingPortfolioHero
        brand="Akshay Iyer"
        tagline="UI / Brand Designer — Tokyo"
        eyebrow="Portfolio"
        className="w-full"
      />
      <section id="works" className="relative z-10 bg-[#050510] py-20 px-6">
        <div className="mx-auto max-w-4xl space-y-10">
          <h2 className="text-3xl font-bold text-white font-orbitron">Blog</h2>
          {[
            { title: "Designing for the Future", excerpt: "Exploring the intersection of design and technology." },
            { title: "CSS Architecture", excerpt: "Best practices for scalable CSS in large projects." },
            { title: "React Patterns", excerpt: "Common patterns and anti-patterns in React development." },
          ].map((post) => (
            <article key={post.title} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-semibold text-white font-orbitron">{post.title}</h3>
              <p className="mt-2 text-sm text-white/60">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
