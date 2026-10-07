"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  ShieldCheck,
  Fingerprint,
  Cpu,
  Radio,
} from "lucide-react";

/* ---------------------------------- data --------------------------------- */

const capabilities = [
  { name: "Data & Analytics", level: 95, note: "EXPERT" },
  { name: "Global Leadership", level: 90, note: "ADVANCED" },
  { name: "Training & Onboarding", level: 88, note: "ADVANCED" },
  { name: "Operations & Compliance", level: 92, note: "ADVANCED" },
];

const serviceRecord = [
  {
    period: "2025 — PRESENT",
    role: "Ecommerce Trainer",
    org: "TELUS Digital AI Data Solutions",
    detail: "Training AI data-solutions teams on ecommerce workflows, quality and delivery.",
  },
  {
    period: "2024 — 2025",
    role: "Lead Analyst Trainer",
    org: "HCLTech · Google project",
    detail: "Led analyst training tracks; owned onboarding and capability uplift.",
  },
  {
    period: "2022 — 2024",
    role: "Senior Analyst",
    org: "HCLTech · Google project",
    detail: "Data analysis, quality reporting and stakeholder delivery at global scale.",
  },
  {
    period: "2014 — 2017",
    role: "Technical Lead",
    org: "PC-Clinik Sales and Service",
    detail: "Technical operations, client systems and service delivery.",
  },
];

const languages = [
  { lang: "Tamil", level: 100, prof: "NATIVE" },
  { lang: "English", level: 100, prof: "C2" },
  { lang: "Hindi", level: 85, prof: "C1" },
  { lang: "Marathi", level: 85, prof: "C1" },
  { lang: "Polish", level: 35, prof: "A2" },
];

/* --------------------------------- pieces -------------------------------- */

function Corners() {
  const c = "pointer-events-none absolute h-4 w-4 border-sci-cyan/80";
  return (
    <>
      <span className={`${c} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${c} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} right-0 bottom-0 border-r-2 border-b-2`} />
    </>
  );
}

function HudPanel({
  index,
  title,
  children,
  className = "",
}: {
  index: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55 }}
      className={`relative border border-sci-cyan/15 bg-[#070b16]/85 p-6 backdrop-blur-sm md:p-8 ${className}`}
    >
      <Corners />
      <div className="mb-6 flex items-center justify-between border-b border-sci-cyan/10 pb-4">
        <p className="font-mono-sci text-xs tracking-[0.3em] text-sci-cyan/90 uppercase">
          <span className="text-white/30">{index}</span>
          <span className="mx-3 text-white/20">//</span>
          {title}
        </p>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sci-cyan" />
      </div>
      {children}
    </motion.section>
  );
}

function Meter({ level, delay = 0 }: { level: number; delay?: number }) {
  return (
    <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-sci-cyan/70 to-sci-cyan shadow-[0_0_12px_rgba(34,211,238,0.55)]"
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.1, delay, ease: "easeOut" }}
      />
    </div>
  );
}

/* ---------------------------------- page --------------------------------- */

export default function AboutPage() {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050510]">
      {/* backdrop grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(34,211,238,0.08),transparent_70%)]"
      />

      {/* system bar */}
      <div className="relative z-10 border-b border-sci-cyan/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="font-mono-sci text-xs tracking-[0.35em] text-sci-cyan uppercase">
            J.A.R.V.I.S.
          </p>
          <p className="hidden font-mono-sci text-xs tracking-[0.25em] text-white/40 uppercase sm:block">
            Personnel file // access granted
          </p>
          <p className="font-mono-sci text-xs tracking-[0.2em] text-white/60 tabular-nums">
            {now} <span className="ml-2 text-sci-cyan">● SYS NOMINAL</span>
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-6 py-14">
        {/* subject identification */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden border border-sci-cyan/20 bg-[#070b16]/85 p-8 backdrop-blur-sm md:p-12"
        >
          <Corners />
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            <div className="relative mx-auto md:mx-0">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-sci-cyan/60 font-orbitron text-3xl font-bold text-sci-cyan">
                AI
              </div>
              <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-[#050510] bg-emerald-400" />
            </div>
            <div className="text-center md:text-left">
              <p className="mb-3 font-mono-sci text-xs tracking-[0.35em] text-sci-cyan/80 uppercase">
                Subject identification
              </p>
              <h1 className="font-orbitron text-3xl font-bold text-white md:text-5xl">
                Akshay Iyer
              </h1>
              <p className="mt-3 font-mono-sci text-sm tracking-[0.2em] text-sci-cyan uppercase">
                Ecommerce Trainer — TELUS Digital
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-sci-cyan/30 px-4 py-1.5 font-mono-sci text-[11px] tracking-[0.2em] text-white/70 uppercase">
                  <MapPin className="h-3.5 w-3.5 text-sci-cyan" /> Kraków, PL
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 px-4 py-1.5 font-mono-sci text-[11px] tracking-[0.2em] text-emerald-300/90 uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" /> Karta pobytu — no work permit required
                </span>
              </div>
            </div>
            <div className="hidden flex-1 lg:block">
              <div className="ml-auto grid max-w-xs grid-cols-3 gap-px bg-sci-cyan/15 font-mono-sci text-center">
                {[
                  ["400+", "TEAM LED"],
                  ["8+", "YRS FIELD"],
                  ["5", "LANGUAGES"],
                ].map(([v, l]) => (
                  <div key={l} className="bg-[#070b16] px-2 py-4">
                    <p className="font-orbitron text-xl font-bold text-sci-cyan">{v}</p>
                    <p className="mt-1 text-[10px] tracking-[0.2em] text-white/40">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.header>

        {/* dossier */}
        <HudPanel index="01" title="Dossier">
          <div className="flex items-start gap-4">
            <Fingerprint className="mt-1 h-5 w-5 shrink-0 text-sci-cyan/70" />
            <div className="space-y-4 text-base leading-relaxed text-white/80 md:text-lg">
              <p>
                Results-oriented trainer and analyst with proven expertise in
                global operations management across{" "}
                <span className="text-sci-cyan">400+ team members</span>, data
                analytics and project leadership. Demonstrated success in
                delivering agreed outcomes, generating quality reports and
                fostering collaborative team environments.
              </p>
              <p className="text-white/60">
                Adept at onboarding, technical guidance and proactive
                communication with stakeholders — from ecommerce AI data
                solutions at TELUS Digital to Google-scale analytics programs
                at HCLTech. Started in hospitality kitchens before moving into
                tech and data; still applies what the coast taught him:
                patience, observation, and that light changes everything.
              </p>
            </div>
          </div>
        </HudPanel>

        {/* capability modules */}
        <HudPanel index="02" title="Capability modules">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {capabilities.map((c, i) => (
              <div
                key={c.name}
                className="border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-orbitron text-sm font-semibold tracking-wide text-white">
                    {c.name.toUpperCase()}
                  </h3>
                  <span className="font-mono-sci text-sm text-sci-cyan tabular-nums">
                    {c.level}%
                  </span>
                </div>
                <Meter level={c.level} delay={i * 0.12} />
                <p className="mt-3 font-mono-sci text-[11px] tracking-[0.25em] text-white/40">
                  RATING: <span className="text-sci-cyan/80">{c.note}</span>
                </p>
              </div>
            ))}
          </div>
        </HudPanel>

        {/* service record */}
        <HudPanel index="03" title="Service record">
          <ol className="relative space-y-0 border-l border-sci-cyan/20">
            {serviceRecord.map((s) => (
              <li key={s.role} className="relative pb-8 pl-8 last:pb-0">
                <span className="absolute top-1 -left-[5px] h-2.5 w-2.5 rotate-45 border border-sci-cyan bg-[#050510]" />
                <p className="font-mono-sci text-[11px] tracking-[0.3em] text-sci-cyan/80">
                  {s.period}
                </p>
                <h3 className="mt-2 font-orbitron text-lg font-semibold text-white">
                  {s.role}
                </h3>
                <p className="font-mono-sci text-xs tracking-[0.15em] text-white/50 uppercase">
                  {s.org}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                  {s.detail}
                </p>
              </li>
            ))}
          </ol>
        </HudPanel>

        {/* language matrix */}
        <HudPanel index="04" title="Language matrix">
          <div className="space-y-5">
            {languages.map((l, i) => (
              <div key={l.lang}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-white/90">{l.lang}</span>
                  <span className="font-mono-sci text-xs tracking-[0.2em] text-sci-cyan">
                    {l.prof}
                  </span>
                </div>
                <Meter level={l.level} delay={i * 0.08} />
              </div>
            ))}
          </div>
        </HudPanel>

        {/* comms uplink */}
        <HudPanel index="05" title="Comms uplink">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { icon: Mail, label: "EMAIL", value: "akshayiyer23@gmail.com", href: "mailto:akshayiyer23@gmail.com" },
              { icon: Phone, label: "PHONE", value: "(+48) 729 303 604", href: "tel:+48729303604" },
              { icon: LinkIcon, label: "LINKEDIN", value: "linkedin.com/in/akshayiyer23", href: "https://linkedin.com/in/akshayiyer23" },
              { icon: Cpu, label: "PORTFOLIO", value: "akshayiyer.info", href: "https://www.akshayiyer.info" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-sci-cyan/40"
              >
                <c.icon className="h-5 w-5 shrink-0 text-sci-cyan/80 transition-colors group-hover:text-sci-cyan" />
                <span>
                  <span className="block font-mono-sci text-[10px] tracking-[0.3em] text-white/40">
                    {c.label}
                  </span>
                  <span className="block text-sm text-white/85 transition-colors group-hover:text-white">
                    {c.value}
                  </span>
                </span>
              </a>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 font-mono-sci text-[11px] tracking-[0.25em] text-white/35 uppercase">
            <Radio className="h-3.5 w-3.5 text-sci-cyan/60" />
            Channel open — direct line preferred
          </p>
        </HudPanel>

        <p className="pt-4 text-center font-mono-sci text-[11px] tracking-[0.3em] text-white/25 uppercase">
          End of file // J.A.R.V.I.S. stands by, sir
        </p>
      </div>
    </main>
  );
}
