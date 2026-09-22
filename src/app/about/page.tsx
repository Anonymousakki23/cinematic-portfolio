"use client";

import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MapPin, Mail, Phone, Link } from "lucide-react";

const skills = [
  { name: "Data & Analytics", level: 95 },
  { name: "Global Leadership", level: 90 },
  { name: "Training & Onboarding", level: 88 },
  { name: "Operations & Compliance", level: 92 },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050510]">
      <PathDrawingPortfolioHero
        brand="Akshay Iyer"
        tagline="Lead Analyst & Trainer"
        eyebrow="About"
        className="w-full"
      />
      
      <section id="about" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-6xl space-y-12">
          <Card className="card-sci border-sci-cyan/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full border-2 border-sci-cyan/50 flex items-center justify-center font-mono-sci text-xl text-sci-cyan">
                  AI
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-orbitron">Akshay Iyer</h2>
                  <p className="text-sci-cyan">Lead Analyst & Trainer</p>
                </div>
              </div>
              <p className="text-white/80 text-lg leading-relaxed">
                Results-oriented Lead Analyst and Trainer with proven expertise in global operations management (400+ members), data analytics, and project leadership. Demonstrated success in providing agreed deliverables, generating quality reports, and fostering collaborative team environments. Adept at onboarding, technical guidance, and proactive communication with stakeholders.
              </p>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-2xl font-bold font-orbitron mb-8 text-sci-cyan">What I Do</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <Card key={skill.name} className="card-sci group hover:scale-[1.02] transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold font-orbitron text-white group-hover:text-sci-cyan transition-colors">{skill.name}</h4>
                      <span className="text-sm font-mono-sci text-sci-cyan">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2 bg-white/10" />
                    <div className="mt-3 text-sm text-white/60">
                      {skill.level >= 95 ? "Expert level" : skill.level >= 90 ? "Advanced expertise" : "Strong capability"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold font-orbitron mb-8 text-sci-cyan">Languages</h3>
            <Card className="card-sci">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {[
                    { lang: "English", level: 100, prof: "C2" },
                    { lang: "Tamil", level: 100, prof: "Native" },
                    { lang: "Hindi", level: 85, prof: "C1" },
                    { lang: "Marathi", level: 85, prof: "C1" },
                    { lang: "Polish", level: 35, prof: "A2" },
                  ].map((item) => (
                    <div key={item.lang} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 font-medium">{item.lang}</span>
                        <span className="text-sci-cyan font-mono-sci">{item.prof}</span>
                      </div>
                      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", item.level >= 90 ? "bg-sci-cyan" : item.level >= 80 ? "bg-sci-purple" : "bg-sci-magenta")}
                          style={{ width: `${item.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-sci border-sci-purple/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold font-orbitron mb-6 text-sci-purple">Contact & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/80"><MapPin className="h-5 w-5 text-sci-cyan" /><span>Krakow, Poland</span></div>
                  <div className="flex items-center gap-3 text-white/80"><Mail className="h-5 w-5 text-sci-purple" /><span>akshayiyer23@gmail.com</span></div>
                  <div className="flex items-center gap-3 text-white/80"><Phone className="h-5 w-5 text-sci-magenta" /><span>(+48) 729303604</span></div>
                </div>
                <div className="flex items-center gap-3 text-white/80"><span className="text-sci-cyan font-mono-sci">in</span><a href="https://linkedin.com/in/akshayiyer23" target="_blank" rel="noopener noreferrer" className="hover:text-sci-cyan transition-colors">linkedin.com/in/akshayiyer23</a></div>
                <div><Badge variant="outline" className="border-sci-cyan/50 text-sci-cyan">Polish Karta pobytu (no work permit required)</Badge></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
