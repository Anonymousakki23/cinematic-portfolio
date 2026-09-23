"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Hero3D from "@/components/hero-3d";

const navItems = [
  { href: "/about", label: "About", color: "sci-cyan" },
  { href: "/resume", label: "Resume", color: "sci-purple" },
  { href: "/photography", label: "Photography", color: "sci-magenta" },
  { href: "/contact", label: "Contact", color: "sci-cyan" },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#050510] overflow-hidden">
      <Hero3D />
      <div className="relative z-10 grid-bg min-h-screen">
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6">
          <motion.div
            className="w-full max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-4 flex justify-center gap-2">
              {navItems.map((item, i) => (
                <motion.span
                  key={item.href}
                  className={`font-mono-sci text-xs ${item.color === 'sci-cyan' ? 'text-sci-cyan' : item.color === 'sci-purple' ? 'text-sci-purple' : 'text-sci-magenta'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  /
                </motion.span>
              ))}
            </div>

            <motion.h1
              className="font-orbitron text-6xl font-bold text-white sm:text-7xl md:text-8xl"
              whileHover={{ scale: 1.05, textShadow: "0 0 30px rgba(0, 255, 255, 0.6)" }}
              transition={{ duration: 0.3 }}
            >
              Akshay
              <span className="text-sci-cyan"> Iyer</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/70 font-sans sm:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Lead Analyst & Trainer — Crafting data-driven solutions and global leadership experiences across 400+ team members
            </motion.p>

            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm transition-all hover:border-sci-cyan/50 hover:bg-sci-cyan/10 hover:glow-cyan"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${item.color === 'sci-cyan' ? 'bg-sci-cyan' : item.color === 'sci-purple' ? 'bg-sci-purple' : 'bg-sci-magenta'} animate-pulse`}
                    />
                    <span className="font-orbitron text-sm tracking-wide text-white group-hover:text-sci-cyan">
                      {item.label}
                    </span>
                    <ChevronDown className="h-4 w-4 rotate-90 text-sci-cyan/50" />
                  </div>
                </Link>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 text-sm font-mono-sci text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              Navigate to explore / project | details | experience | work
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 flex flex-col items-center gap-2 text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <span className="text-[0.65rem] uppercase tracking-[0.28em]">Scroll to explore</span>
            <span className="block h-16 w-px origin-top bg-gradient-to-b from-sci-cyan via-sci-purple to-transparent" />
          </motion.div>
        </section>
      </div>
    </main>
  );
}
