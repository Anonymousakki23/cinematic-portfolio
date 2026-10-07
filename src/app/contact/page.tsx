"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  Cpu,
  Radio,
  Send,
  Satellite,
} from "lucide-react";

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

/** Signal-strength ring gauge, after the reference HUD dials. */
function SignalDial() {
  const r = 52;
  const c = 2 * Math.PI * r;
  const level = 98;
  return (
    <div className="flex flex-col items-center">
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
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-orbitron text-2xl font-bold text-white tabular-nums">
            {level}
            <span className="text-sm text-sci-cyan">%</span>
          </span>
          <span className="font-mono-sci mt-1 text-[9px] tracking-[0.25em] text-white/40">
            SIGNAL
          </span>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/30 font-mono-sci text-sm focus:outline-none focus:border-sci-cyan/60 focus:bg-sci-cyan/[0.04] transition-colors";

/* ---------------------------------- page --------------------------------- */

export default function ContactPage() {
  const [now, setNow] = useState("--:--:--");
  const [today, setToday] = useState("");
  const [krakowTime, setKrakowTime] = useState("--:--");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setToday(
        d
          .toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
          .toUpperCase()
      );
      setKrakowTime(
        d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" })
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:akshayiyer23@gmail.com?subject=${subject}&body=${body}`;
  };

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
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0 2px, #22d3ee 2px 3px)",
        }}
      />

      {/* system bar */}
      <div className="relative z-10 border-b border-sci-cyan/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-4">
          <p className="font-mono-sci text-xs tracking-[0.35em] text-sci-cyan uppercase">
            J.A.R.V.I.S.
          </p>
          <p className="hidden font-mono-sci text-xs tracking-[0.25em] text-white/40 uppercase md:block">
            Comms uplink // secure channel
          </p>
          <p className="font-mono-sci text-xs tracking-[0.15em] text-white/60 tabular-nums">
            <span className="mr-3 hidden text-white/35 sm:inline">{today}</span>
            {now} <span className="ml-2 text-sci-cyan">● SYS NOMINAL</span>
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8 px-6 py-14">
        {/* header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden border border-sci-cyan/20 bg-[#070b16]/85 p-8 backdrop-blur-sm md:p-12"
        >
          <Corners />
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative mx-auto md:mx-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-sci-cyan/60">
                <Satellite className="h-10 w-10 text-sci-cyan" />
              </div>
              <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-[#050510] bg-emerald-400" />
              <span className="absolute inset-0 animate-ping rounded-full border border-sci-cyan/30" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-mono-sci mb-3 text-xs tracking-[0.35em] text-sci-cyan/80 uppercase">
                Transmission terminal
              </p>
              <h1 className="font-orbitron text-3xl font-bold text-white md:text-5xl">
                Open a channel.
              </h1>
              <p className="mt-4 max-w-xl leading-relaxed text-white/60">
                Direct line to Akshay — no switchboard, no ticket queue.
                Pick a channel below or transmit a message; it lands straight
                in his inbox.
              </p>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            {/* direct channels */}
            <HudPanel index="01" title="Direct channels">
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
                      <span className="font-mono-sci block text-[10px] tracking-[0.3em] text-white/40">
                        {c.label}
                      </span>
                      <span className="block text-sm text-white/85 transition-colors group-hover:text-white">
                        {c.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </HudPanel>

            {/* transmit */}
            <HudPanel index="02" title="Transmit message">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="font-mono-sci mb-2 block text-[11px] tracking-[0.3em] text-white/50 uppercase">
                      Sender ID
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-mono-sci mb-2 block text-[11px] tracking-[0.3em] text-white/50 uppercase">
                      Return frequency
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono-sci mb-2 block text-[11px] tracking-[0.3em] text-white/50 uppercase">
                    Payload
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Your message..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="font-mono-sci inline-flex w-full items-center justify-center gap-3 border border-sci-cyan/50 bg-sci-cyan/10 px-6 py-4 text-xs tracking-[0.3em] text-sci-cyan uppercase transition-colors hover:bg-sci-cyan/20"
                >
                  <Send className="h-4 w-4" /> Transmit
                </button>
                <p className="font-mono-sci text-[10px] tracking-[0.2em] text-white/30 uppercase">
                  Opens your mail client addressed to akshayiyer23@gmail.com — nothing sends without you
                </p>
              </form>
            </HudPanel>
          </div>

          {/* signal intel */}
          <HudPanel index="03" title="Signal intel" className="h-fit lg:sticky lg:top-6">
            <SignalDial />
            <ul className="font-mono-sci mt-6 space-y-3 text-xs">
              {[
                ["LOCATION", "KRAKÓW, PL"],
                ["LOCAL TIME", `${krakowTime} CET`],
                ["CHANNEL", "OPEN"],
                ["RESPONSE", "< 24H"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-baseline gap-2">
                  <span className="text-white/40">{k}</span>
                  <span className="mx-1 flex-1 border-b border-dotted border-white/15" />
                  <span className="text-sci-cyan">{v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-sci-cyan/10 pt-4">
              <p className="flex items-center gap-2 font-mono-sci text-[11px] tracking-[0.25em] text-white/35 uppercase">
                <MapPin className="h-3.5 w-3.5 text-sci-cyan/60" />
                Karta pobytu — EU-wide remote OK
              </p>
              <p className="font-mono-sci mt-4 flex items-center gap-2 text-[11px] tracking-[0.25em] text-white/35 uppercase">
                <Radio className="h-3.5 w-3.5 text-sci-cyan/60" />
                Encryption: banter-grade
              </p>
            </div>
          </HudPanel>
        </div>

        <p className="pt-4 text-center font-mono-sci text-[11px] tracking-[0.3em] text-white/25 uppercase">
          End of file // J.A.R.V.I.S. stands by, sir
        </p>
      </div>
    </main>
  );
}
