"use client";

import PathDrawingPortfolioHero from "@/components/ui/path-drawing-portfolio-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2, Award, TrendingUp, BookOpen, Target, Users, CheckCircle } from "lucide-react";

const experience = [
  {
    title: "Ecommerce Trainer",
    company: "TELUS International",
    location: "Krakow, Poland",
    period: "June 2025 – Present",
    achievements: [
      "Assist in new hire onboarding and standardized vendor knowledge transfers",
      "Track deliverables, reporting, and comprehensive project documentation",
      "Lead cross-regional calibrations across India and Vietnam",
      "Designed modules on LLM models within the Google ecosystem",
    ],
  },
  {
    title: "Lead Analyst Trainer",
    company: "HCL Technologies",
    location: "Krakow, Poland",
    period: "July 2024 – June 2025",
    achievements: [
      "Managed data vetting, project tracker maintenance, and high-fidelity QA",
      "Generated productivity, quality, and ad hoc status reports for leadership and clients",
      "Maintained compliance with confidential and sensitive data assets",
      "Awarded 'Best Lead' (Q4 2024)",
    ],
  },
  {
    title: "Senior Data Analyst",
    company: "HCL Technologies",
    location: "Krakow, Poland",
    period: "October 2022 – July 2024",
    achievements: [
      "Analyzed large datasets to deliver actionable business insights",
      "Created executive visualization tools and supported management dashboards",
      "Mentored junior analysts and conducted skill assessments",
    ],
  },
  {
    title: "Technical Lead",
    company: "PC-Clinik Sales and Service",
    location: "Goa, India",
    period: "March 2014 – August 2017",
    achievements: [
      "Managed operations for authorized service center handling major hardware brands (Asus, AOC)",
      "Resolved high-pressure technical service issues and workflow bottlenecks",
    ],
  },
];

const education = [
  {
    degree: "M.Sc. Plant and Environmental Biotechnology",
    school: "Uniwersytet Rolniczy",
    location: "Krakow, Poland",
    period: "Graduated: February 2022",
  },
  {
    degree: "B.Sc. Biotechnology",
    school: "Sanquelim College of Arts, Science & Commerce, Goa University",
    location: "Goa, India",
    period: "Graduated: May 2018",
  },
];

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-[#050510]">
      <PathDrawingPortfolioHero
        brand="Akshay Iyer"
        tagline="Lead Analyst & Trainer"
        eyebrow="Resume"
        className="w-full"
      />
      
      <section id="experience" className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-4xl space-y-16">
          <h2 className="text-3xl font-bold font-orbitron text-sci-cyan">Experience</h2>
          
          <div className="relative border-l-2 border-sci-cyan/30 pl-8">
            {experience.map((job, idx) => (
              <div key={job.title} className="relative mb-12 last:mb-0">
                <div className="absolute left-[-28px] top-0 flex h-4 w-4 items-center justify-center">
                  <div className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-sci-cyan bg-[#050510] z-10">
                    <div className="h-1.5 w-1.5 rounded-full bg-sci-cyan" />
                  </div>
                </div>
                <Card className="card-sci group hover:border-sci-cyan/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold font-orbitron text-white group-hover:text-sci-cyan transition-colors">{job.title}</h3>
                        <p className="text-sm text-sci-cyan font-medium">{job.company}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60 text-right">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {job.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-2 text-white/70">
                      {job.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle className="h-4 w-4 text-sci-cyan shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="education" className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="mx-auto max-w-4xl space-y-16">
          <h2 className="text-3xl font-bold font-orbitron text-sci-purple">Education</h2>
          
          <div className="relative border-l-2 border-sci-purple/30 pl-8">
            {education.map((edu, idx) => (
              <div key={edu.degree} className="relative mb-12 last:mb-0">
                <div className="absolute left-[-28px] top-0 flex h-4 w-4 items-center justify-center">
                  <div className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-sci-purple bg-[#050510] z-10">
                    <div className="h-1.5 w-1.5 rounded-full bg-sci-purple" />
                  </div>
                </div>
                <Card className="card-sci group hover:border-sci-purple/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold font-orbitron text-white group-hover:text-sci-purple transition-colors">{edu.degree}</h3>
                        <p className="text-sm text-sci-purple font-medium">{edu.school}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60 text-right">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {edu.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {edu.period}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-sci-purple/50 text-sci-purple">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Degree
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative z-10 py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold font-orbitron text-sci-magenta mb-10">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Years Experience", value: "10+", icon: <Calendar className="h-6 w-6" /> },
              { label: "Team Size Managed", value: "400+", icon: <Users className="h-6 w-6" /> },
              { label: "Awards Won", value: "2+", icon: <Award className="h-6 w-6" /> },
              { label: "Countries Worked", value: "3", icon: <MapPin className="h-6 w-6" /> },
            ].map((stat, i) => (
              <Card key={i} className="card-sci text-center p-8">
                <div className="text-sci-cyan mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold font-orbitron text-white">{stat.value}</div>
                <div className="text-white/60 mt-1">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
