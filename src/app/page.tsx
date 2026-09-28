"use client";

import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Hero3D from "@/components/hero-3d";

const navItems = [
  { href: "/about", label: "About", color: "bg-sci-cyan" },
  { href: "/resume", label: "Resume", color: "bg-sci-purple" },
  { href: "/photography", label: "Photography", color: "bg-sci-magenta" },
  { href: "/contact", label: "Contact", color: "bg-sci-cyan" },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#050510] overflow-hidden">
      <Hero3D />
      <div className="relative z-10 grid-bg min-h-screen">
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-24 pb-16">
          <motion.div
            className="w-full max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="mb-6 font-mono-sci text-xs tracking-[0.3em] text-sci-cyan/80 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {"// portfolio v2.0 — online"}
            </motion.p>

            <motion.h1
              className="font-orbitron text-6xl font-bold text-white sm:text-7xl md:text-8xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              Akshay
              <span className="text-gradient"> Iyer</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/70 font-sans sm:text-xl text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Lead Analyst & Trainer — Crafting data-driven solutions and global leadership experiences across 400+ team members
            </motion.p>

            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
              }}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <Link
                    href={item.href}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-7 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sci-cyan/50 hover:bg-sci-cyan/10 hover:glow-cyan"
                  >
                    <span className={`h-2 w-2 rounded-full ${item.color} animate-pulse`} />
                    <span className="font-orbitron text-sm tracking-wide text-white group-hover:text-sci-cyan">
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-sci-cyan/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sci-cyan" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-10 font-mono-sci text-xs text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <span className="text-sci-cyan/60">krakow,pl</span>
              <span className="mx-2 text-white/20">|</span>
              <span>data · training · photography</span>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
