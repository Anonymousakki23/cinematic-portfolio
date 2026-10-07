"use client";

import { motion, useScroll, useTransform } from "motion/react";
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
  Activity,
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

const telemetry: Array<[string, string]> = [
  ["CORE", "NOMINAL"],
  ["POWER", "100%"],
  ["UPLINK", "SECURE"],
  ["THREATS", "NONE"],
  ["MODE", "STANDBY"],
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
        <span className="flex items-center gap-2 font-mono-sci text-[10px] tracking-[0.25em] text-sci-cyan/60 uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sci-cyan" />
          live
        </span>
      </div>
      {children}
    </motion.section>
  );
}

/** Arc-reactor avatar — rotating HUD rings around the monogram core. */
function ReactorAvatar() {
  return (
    <div className="relative mx-auto h-48 w-48 shrink-0 md:mx-0 md:h-56 md:w-56">
      <style>{`
        @keyframes j-spin { to { transform: rotate(360deg); } }
        @keyframes j-spin-rev { to { transform: rotate(-360deg); } }
        .j-ring-a { transform-box: fill-box; transform-origin: center; animation: j-spin 50s linear infinite; }
        .j-ring-b { transform-box: fill-box; transform-origin: center; animation: j-spin-rev 32s linear infinite; }
        .j-ring-c { transform-box: fill-box; transform-origin: center; animation: j-spin 85s linear infinite; }
      `}</style>
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="jcore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="30%" stopColor="#22d3ee" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#0e7490" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="j-ring-a">
          <circle cx="100" cy="100" r="96" fill="none" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="2.5" strokeDasharray="2 8" />
        </g>
        <circle cx="100" cy="100" r="88" fill="none" stroke="#22d3ee" strokeOpacity="0.28" strokeWidth="1" />
        <g className="j-ring-b">
          <circle cx="100" cy="100" r="78" fill="none" stroke="#22d3ee" strokeOpacity="0.7" strokeWidth="5" strokeDasharray="42 30" strokeLinecap="round" />
        </g>
        <g className="j-ring-c">
          <circle cx="100" cy="100" r="66" fill="none" stroke="#22d3ee" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="1 6" />
        </g>
        <circle cx="100" cy="100" r="58" fill="url(#jcore)" opacity="0.92" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#a5f3fc" strokeOpacity="0.85" strokeWidth="1.5" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-orbitron text-4xl font-bold text-[#04121a] drop-shadow-[0_0_10px_rgba(165,243,252,0.9)]">
          AI
        </span>
      </div>
      <span className="absolute right-3 bottom-3 h-4 w-4 rounded-full border-2 border-[#050510] bg-emerald-400" />
    </div>
  );
}

/** Circular HUD gauge for a capability. */
function RingGauge({
  level,
  label,
  note,
  delay = 0,
}: {
  level: number;
  label: string;
  note: string;
  delay?: number;
}) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex flex-col items-center border border-white/10 bg-white/[0.02] p-6 text-center">
      <span className="pointer-events-none absolute top-1 left-1 h-3 w-3 border-t border-l border-sci-cyan/50" />
      <span className="pointer-events-none absolute right-1 bottom-1 h-3 w-3 border-r border-b border-sci-cyan/50" />
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle cx="60" cy="60" r="40" fill="none" stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="1 5" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - level / 100) }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.3, delay, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-orbitron text-2xl font-bold text-white tabular-nums">
            {level}
            <span className="text-sm text-sci-cyan">%</span>
          </span>
        </div>
      </div>
      <h3 className="mt-4 font-orbitron text-xs font-semibold tracking-[0.12em] text-white">
        {label.toUpperCase()}
      </h3>
      <p className="mt-1 font-mono-sci text-[11px] tracking-[0.25em] text-sci-cyan/70">
        {note}
      </p>
    </div>
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
  const [today, setToday] = useState("");
  const { scrollYProgress, scrollY } = useScroll();
  // Scroll choreography: progress bar + reactor parallax drift.
  const reactorY = useTransform(scrollY, [0, 700], [0, 90]);
  const reactorScale = useTransform(scrollY, [0, 700], [1, 0.92]);
  const headerFade = useTransform(scrollY, [0, 500], [1, 0.25]);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        d.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setToday(
        d
          .toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .toUpperCase()
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050510]">
      {/* backdrop grid + scanlines */}
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
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 2px, #22d3ee 2px 3px)",
        }}
      />
      {/* scroll progress — HUD energy bar */}
      <motion.div
        aria-hidden
        className="fixed top-0 right-0 left-0 z-50 h-[3px] origin-left bg-sci-cyan shadow-[0_0_14px_rgba(34,211,238,0.9)]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* system bar */}
      <div className="relative z-10 border-b border-sci-cyan/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4">
          <p className="font-mono-sci text-xs tracking-[0.35em] text-sci-cyan uppercase">
            J.A.R.V.I.S.
          </p>
          <p className="hidden font-mono-sci text-xs tracking-[0.25em] text-white/40 uppercase md:block">
            Personnel file // access granted
          </p>
          <p className="font-mono-sci text-xs tracking-[0.15em] text-white/60 tabular-nums">
            <span className="mr-3 hidden text-white/35 sm:inline">{today}</span>
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
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <motion.div style={{ y: reactorY, scale: reactorScale, opacity: headerFade }}>
              <ReactorAvatar />
            </motion.div>
            <div className="flex-1 text-center md:text-left">
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
            <div className="hidden w-full max-w-[240px] lg:block">
              <div className="grid grid-cols-3 gap-px bg-sci-cyan/15 text-center font-mono-sci">
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
              <p className="mt-3 flex items-center justify-center gap-2 font-mono-sci text-[10px] tracking-[0.25em] text-white/30 uppercase">
                <Activity className="h-3 w-3 text-sci-cyan/60" /> vitals steady
              </p>
            </div>
          </div>
        </motion.header>

        {/* dossier + telemetry */}
        <HudPanel index="01" title="Dossier">
          <div className="grid gap-8 md:grid-cols-[1fr_230px]">
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
            <aside className="border border-sci-cyan/15 bg-black/30 p-5">
              <p className="mb-4 font-mono-sci text-[10px] tracking-[0.3em] text-sci-cyan/70 uppercase">
                System telemetry
              </p>
              <ul className="space-y-3 font-mono-sci text-xs">
                {telemetry.map(([k, v]) => (
                  <li key={k} className="flex items-baseline gap-2">
                    <span className="text-white/40">{k}</span>
                    <span className="mx-1 flex-1 border-b border-dotted border-white/15" />
                    <span className="text-sci-cyan">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-sci-cyan/10 pt-4">
                <div className="flex items-end justify-between font-mono-sci text-[10px] text-white/35">
                  <span>REACTOR OUTPUT</span>
                  <span className="text-sci-cyan">3.1 GJ/s</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-sci-cyan shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                    initial={{ width: "12%" }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            </aside>
          </div>
        </HudPanel>

        {/* capability modules — ring gauges */}
        <HudPanel index="02" title="Capability modules">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c, i) => (
              <RingGauge
                key={c.name}
                level={c.level}
                label={c.name}
                note={c.note}
                delay={i * 0.12}
              />
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
