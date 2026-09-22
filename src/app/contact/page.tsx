"use client";

import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Mail, Phone, Link } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050510]">
      <PathDrawingPortfolioHero
        brand="Akshay Iyer"
        tagline="Lead Analyst & Trainer — Krakow, Poland"
        eyebrow="Contact"
        className="w-full"
      />
      
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold font-orbitron text-sci-cyan mb-6">Get In Touch</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sci-cyan focus:bg-white/10 transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sci-cyan focus:bg-white/10 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-sci-cyan focus:bg-white/10 transition-colors"
                    placeholder="Your message..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-sci-cyan/50 bg-sci-cyan/10 px-6 py-3 text-sm font-medium text-sci-cyan transition-all hover:bg-sci-cyan/20 hover:glow-cyan focus:outline-none focus:ring-2 focus:ring-sci-cyan focus:ring-offset-2 focus:ring-offset-[#050510]"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-3xl font-bold font-orbitron text-sci-cyan mb-6">Contact Details</h2>
              <div className="space-y-6 text-white/80">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-sci-cyan" />
                  <span>Krakow, Poland</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-sci-purple" />
                  <span>akshayiyer23@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-sci-magenta" />
                  <span>(+48) 729303604</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link className="h-5 w-5 text-sci-cyan" />
                  <a href="https://linkedin.com/in/akshayiyer23" className="hover:text-sci-cyan transition-colors" target="_blank" rel="noopener">
                    linkedin.com/in/akshayiyer23
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
