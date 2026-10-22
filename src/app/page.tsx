"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FuturisticIntro from "@/components/futuristic-intro";
import HudBackground from "@/components/hud-background";
import "./homepage.css";

/* ------------------------------- data ---------------------------------- */

const shots = [
  { src: "/photography/ig-bee.webp", tag: "HONEY BEE MACRO" },
  { src: "/photography/ig-lightning.jpg", tag: "LIGHTNING // KRAKÓW" },
  { src: "/photography/ig-squirrel.webp", tag: "RED SQUIRREL" },
  { src: "/photography/ig-spider.jpg", tag: "LYNX SPIDER" },
  { src: "/photography/ig-kingfisher.jpg", tag: "KINGFISHER" },
  { src: "/photography/ig-moss.jpg", tag: "FOREST FLOOR" },
  { src: "/photography/ig-snake.jpg", tag: "KEELBACK" },
  { src: "/photography/ig-glowshroom.jpg", tag: "GLOWSHROOM" },
  { src: "/photography/ig-ant.jpg", tag: "WEAVER ANT" },
  { src: "/photography/ig-butterfly.jpg", tag: "BUTTERFLY" },
  { src: "/photography/ig-mushroom.jpg", tag: "FOREST LANTERN" },
  { src: "/photography/ig-lizard.jpg", tag: "GARDEN LIZARD" },
  { src: "/photography/ig-sunset-ride.jpg", tag: "SUNSET RIDE" },
  { src: "/photography/ig-winter-stream.jpg", tag: "WINTER STREAM" },
  { src: "/photography/ig-jellyfish.jpg", tag: "NIGHT TIDE" },
];

type Msg = { from: "ai" | "me"; html: string };

const OPENING: Msg[] = [
  { from: "ai", html: `<span class="hp-who">ASTRO</span>Good evening, and welcome in. I'm Astro — the voice of this site.` },
  { from: "me", html: `What do you do, Akshay?` },
  {
    from: "ai",
    html: `<span class="hp-who">ASTRO</span>I train ecommerce &amp; AI teams at TELUS Digital, shoot macro photography on a Canon 77D, and build things for the web — from Kraków to Goa.`,
  },
];

const CHIP_REPLIES: Record<string, string> = {
  work: `Start with the <a href="/photography">optical archive</a> — macro, lightning and street frames.`,
  journey: `Goa → Kraków — tech lead alongside my studies, now data & AI. The full story lives on the <a href="/experience">journey page</a>.`,
  hello: `The fastest way is the <a href="/contact">contact terminal</a> — I reply properly, not just the holding text.`,
};

/** Rotating role line with typewriter effect — replaces the old equalizer. */
function RoleTyper() {
  const roles = ["Data & AI Trainer", "Macro Photographer", "Builder of Things", "Based in Kraków"];
  const [ri, setRi] = useState(0);
  const [txt, setTxt] = useState("");
  const [phase, setPhase] = useState<"type" | "hold" | "del">("type");

  useEffect(() => {
    const role = roles[ri % roles.length];
    let t: ReturnType<typeof setTimeout>;
    if (phase === "type") {
      if (txt.length < role.length) t = setTimeout(() => setTxt(role.slice(0, txt.length + 1)), 55);
      else t = setTimeout(() => setPhase("hold"), 1500);
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("del"), 250);
    } else if (txt.length > 0) {
      t = setTimeout(() => setTxt(role.slice(0, txt.length - 1)), 26);
    } else {
      setRi((r) => r + 1);
      setPhase("type");
      return;
    }
    return () => clearTimeout(t);
  }, [txt, phase, ri]);

  return (
    <p className="hp-typer" aria-live="polite">
      <span className="hp-prompt">▸</span> {txt}
      <span className="hp-caret">▌</span>
    </p>
  );
}

function wxLabel(code: number): string {  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  return "Thunderstorm";
}

/* --------------------------------- page ---------------------------------- */

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);
  const [clock, setClock] = useState("--:--");
  const [msgs, setMsgs] = useState<Msg[]>(OPENING);
  const [wx, setWx] = useState<{ t: number; label: string; days: { d: string; t: number }[] } | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const galRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("hp-intro-seen")) setShowIntro(true);
    } catch {
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=50.0614&longitude=19.9366&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&timezone=Europe%2FWarsaw&forecast_days=6"
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j?.current) return;
        const days = (j.daily?.time ?? [])
          .slice(1, 6)
          .map((iso: string, i: number) => ({
            d: new Date(iso + "T12:00:00")
              .toLocaleDateString("en-GB", { weekday: "short" })
              .toUpperCase(),
            t: Math.round(j.daily.temperature_2m_max[i + 1]),
          }));
        setWx({ t: Math.round(j.current.temperature_2m), label: wxLabel(j.current.weather_code), days });
      })
      .catch(() => {});
  }, []);

  const introDone = () => {
    try {
      sessionStorage.setItem("hp-intro-seen", "1");
    } catch {}
    setShowIntro(false);
  };

  const ask = (key: string, label: string) => {
    setMsgs((m) => [...m, { from: "me", html: label }, { from: "ai", html: `<span class="hp-who">ASTRO</span>${CHIP_REPLIES[key]}` }]);
  };

  const scrollToChat = () => chatRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  /* Auto-scroll the photo gallery; pauses while the user interacts. */
  useEffect(() => {
    const el = galRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let paused = false;
    let resumeT: ReturnType<typeof setTimeout>;
    const pause = () => {
      paused = true;
      clearTimeout(resumeT);
      resumeT = setTimeout(() => {
        paused = false;
      }, 5000);
    };
    el.addEventListener("pointerdown", pause);
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("touchstart", pause, { passive: true });
    const id = setInterval(() => {
      if (paused || document.hidden) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 8) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: Math.min(340, el.clientWidth * 0.8), behavior: "smooth" });
    }, 2600);
    return () => {
      clearInterval(id);
      clearTimeout(resumeT);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("touchstart", pause);
    };
  }, []);

  return (
    <>
      {showIntro && <FuturisticIntro onDone={introDone} />}
      <main className="hp-root">
        <HudBackground />
        <div className="hp-wrap">
          <header className="hp-top">
            <div className="hp-kicker">AKSHAYIYER.INFO</div>
            <h1>Hello, I&apos;m Akshay</h1>
            <p>Data &amp; AI trainer, photographer, builder — based in Kraków. What would you like to explore?</p>
          </header>

          <div className="hp-grid">
            {/* LEFT */}
            <div className="hp-col">
              <div className="hp-card hp-hello">
                <RoleTyper />
              </div>

              <div className="hp-card">
                <h3>MY CRAFT</h3>
                <div className="hp-tools">
                  <Link className="hp-tool" href="/photography"><span className="hp-ic">📷</span>Photography<small>macro · street</small></Link>
                  <Link className="hp-tool" href="/about"><span className="hp-ic">🤖</span>Data &amp; AI<small>trainer</small></Link>
                  <Link className="hp-tool" href="/experience"><span className="hp-ic">💼</span>Experience<small>10+ yrs</small></Link>
                  <Link className="hp-tool" href="/experience"><span className="hp-ic">🛠️</span>Projects<small>50+ shipped</small></Link>
                  <Link className="hp-tool" href="/recommendations"><span className="hp-ic">⭐</span>Reviews<small>kind words</small></Link>
                  <Link className="hp-tool" href="/contact"><span className="hp-ic">✉️</span>Contact<small>say hello</small></Link>
                </div>
              </div>

              <div className="hp-card">
                <h3>QUICK LINKS</h3>
                <Link className="hp-row-link" href="/photography"><span className="hp-ic">🖼️</span><span>View my work<small>portfolio &amp; galleries</small></span><span className="hp-arr">›</span></Link>
                <Link className="hp-row-link" href="/resume"><span className="hp-ic">📄</span><span>Download résumé<small>PDF · updated 2026</small></span><span className="hp-arr">›</span></Link>
                <Link className="hp-row-link" href="/recommendations"><span className="hp-ic">💬</span><span>Recommendations<small>LinkedIn + community</small></span><span className="hp-arr">›</span></Link>
                <a className="hp-row-link" href="https://www.etsy.com/shop/PixelNordova" target="_blank" rel="noreferrer"><span className="hp-ic">🚀</span><span>Etsy shop<small>PixelNordova digital goods</small></span><span className="hp-arr">›</span></a>
              </div>

              <div className="hp-card">
                <h3>FIND ME</h3>
                <a className="hp-dev" href="https://github.com/Anonymousakki23" target="_blank" rel="noreferrer">🐙 GitHub <small>· Anonymousakki23</small><span className="hp-dot" /></a>
                <a className="hp-dev" href="https://www.linkedin.com/in/akshayiyer23" target="_blank" rel="noreferrer">💼 LinkedIn <small>· akshayiyer23</small><span className="hp-dot" /></a>
                <a className="hp-dev" href="https://www.instagram.com/kaja_krakow/" target="_blank" rel="noreferrer">📸 Instagram <small>· @kaja_krakow</small><span className="hp-dot" /></a>
                <a className="hp-dev" href="https://www.etsy.com/shop/PixelNordova" target="_blank" rel="noreferrer">🛒 Etsy <small>· PixelNordova</small><span className="hp-dot" /></a>
              </div>
            </div>

            {/* CENTER */}
            <div className="hp-col">
              <div className="hp-card hp-holo">
                <div className="hp-tag">AI ASSISTANT</div>
                <img src="/homepage/ai-hologram.jpg" alt="Holographic AI assistant" />
              </div>

              <div className="hp-card" id="hp-chat" ref={chatRef}>
                <h3>TODAY · {clock}</h3>
                <div className="hp-chat">
                  {msgs.map((m, i) => (
                    <div
                      key={i}
                      className={`hp-bubble ${m.from === "ai" ? "hp-ai" : "hp-me"}`}
                      dangerouslySetInnerHTML={{ __html: m.html }}
                    />
                  ))}
                </div>
                <div className="hp-chips">
                  <button className="hp-chip" onClick={() => ask("work", "Show me your work")}>See my work</button>
                  <button className="hp-chip" onClick={() => ask("journey", "Tell me your story")}>The journey</button>
                  <button className="hp-chip" onClick={() => ask("hello", "How do I reach you?")}>Say hello</button>
                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="hp-col">
              <div className="hp-card">
                <h3>📍 KRAKÓW</h3>
                <div className="hp-wx-big">{wx ? `${wx.t}°` : "––°"}</div>
                <div className="hp-wx-sub">{wx ? wx.label : "checking sky…"}</div>
                <div className="hp-days">
                  {wx ? (
                    wx.days.map((d) => (
                      <div key={d.d}>{d.d}<b>{d.t}°</b></div>
                    ))
                  ) : (
                    ["···", "···", "···", "···", "···"].map((d, i) => (
                      <div key={i}>{d}<b>–</b></div>
                    ))
                  )}
                </div>
              </div>

              <div className="hp-card">
                <h3>AT A GLANCE</h3>
                <div className="hp-stat-ring">
                  <div className="hp-ring"><span>10+</span></div>
                  <div><b>Years of experience</b><br /><small>tech → data → AI</small></div>
                </div>
                <div className="hp-bars">
                  <div className="hp-bar"><i style={{ height: 52 }} /><b>50+</b><br /><small>projects</small></div>
                  <div className="hp-bar"><i style={{ height: 64 }} /><b>5</b><br /><small>languages</small></div>
                  <div className="hp-bar"><i style={{ height: 40 }} /><b>2</b><br /><small>countries</small></div>
                </div>
              </div>

              <Link className="hp-card" href="/experience">
                <h3>JOURNEY</h3>
                <div className="hp-tl">
                  <div><b>2014</b>Technical Lead, PC-Clinik — Goa · alongside BSc</div>
                  <div><b>2018</b>Kraków · MSc Biotechnology · part-time hospitality alongside</div>
                  <div><b>2022</b>HCLTech</div>
                  <div><b>2025</b>TELUS Digital — Ecommerce Trainer</div>
                </div>
              </Link>

              <div className="hp-card">
                <h3>FEATURED</h3>
                <Link className="hp-trend" href="/experience"><span className="hp-th">🗺️</span><span><b>The Journey</b><small>Goa → Kraków · the full story</small></span></Link>
                <a className="hp-trend" href="https://www.etsy.com/shop/PixelNordova" target="_blank" rel="noreferrer"><span className="hp-th">🃏</span><span><b>Photographer&apos;s Pose Deck</b><small>Etsy · 50 posing cards</small></span></a>
                <a className="hp-trend" href="https://www.instagram.com/kaja_krakow/" target="_blank" rel="noreferrer"><span className="hp-th">🤳</span><span><b>Kaja — AI influencer</b><small>@kaja_krakow · Kraków guide</small></span></a>
              </div>
            </div>
          </div>

          {/* gallery — full width */}
          <div className="hp-card" style={{ marginTop: 18 }}>
            <h3>OPTICAL ARCHIVE</h3>
            <div className="hp-gal" ref={galRef}>
              {shots.map((s) => (
                <figure key={s.src}>
                  <img src={s.src} alt={s.tag} loading="lazy" />
                  <figcaption>{s.tag}</figcaption>
                </figure>
              ))}
            </div>
            <div className="hp-card-foot">
              <p className="hp-gal-hint">AUTO-SCROLL · SWIPE TO TAKE OVER</p>
              <Link className="hp-more" href="/photography">FULL ARCHIVE →</Link>
            </div>
          </div>

          <p className="hp-foot">END OF FILE // ASTRO STANDS BY</p>
        </div>

        <nav className="hp-bottom" aria-label="Quick navigation">
          <div className="hp-in">
            <Link href="/"><span className="hp-ic">🏠</span>HOME</Link>
            <Link href="/experience"><span className="hp-ic">🗺️</span>JOURNEY</Link>
            <button className="hp-cta" onClick={scrollToChat} aria-label="Talk to Astro"><span className="hp-ic">AI</span></button>
            <Link href="/photography"><span className="hp-ic">📷</span>WORK</Link>
            <Link href="/contact"><span className="hp-ic">👤</span>CONTACT</Link>
          </div>
        </nav>
      </main>
    </>
  );
}
