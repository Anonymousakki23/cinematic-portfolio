"use client";

import { useEffect, useRef } from "react";

/** One Jarvis-style circular gauge, drawn as SVG. */
function Gauge({ size, flip = false }: { size: number; flip?: boolean }) {
  const c = 100;
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i * 5 * Math.PI) / 180;
    const long = i % 6 === 0;
    const r1 = long ? 82 : 87;
    const r2 = 92;
    return (
      <line
        key={i}
        x1={c + r1 * Math.cos(a)}
        y1={c + r1 * Math.sin(a)}
        x2={c + r2 * Math.cos(a)}
        y2={c + r2 * Math.sin(a)}
        strokeWidth={long ? 1.6 : 0.8}
        opacity={long ? 0.9 : 0.45}
      />
    );
  });
  const dots = [0, 90, 180, 270].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return <circle key={deg} cx={c + 96 * Math.cos(a)} cy={c + 96 * Math.sin(a)} r={2.4} fill="currentColor" />;
  });
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" stroke="currentColor">
      <circle cx={c} cy={c} r={97} strokeWidth={1} opacity={0.55} />
      {ticks}
      <circle cx={c} cy={c} r={70} strokeWidth={3.5} opacity={0.85}
        strokeDasharray="54 386" strokeLinecap="round"
        transform={`rotate(${flip ? 210 : 30} ${c} ${c})`} />
      <circle cx={c} cy={c} r={58} strokeWidth={1.4} opacity={0.6}
        strokeDasharray="120 244" strokeLinecap="round"
        transform={`rotate(${flip ? 40 : 160} ${c} ${c})`} />
      <circle cx={c} cy={c} r={44} strokeWidth={1} opacity={0.4} />
      <circle cx={c} cy={c} r={15} strokeWidth={1.2} opacity={0.7} />
      <circle cx={c} cy={c} r={5} fill="currentColor" stroke="none" opacity={0.9} />
      {dots}
    </svg>
  );
}

/**
 * Fixed Jarvis-HUD background: glowing gauges at several depths.
 * Scroll drives parallax (each layer drifts at its own rate) plus a subtle
 * perspective tilt on the whole layer for the 3D effect.
 */
export default function HudBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;
    const items = Array.from(layer.querySelectorAll<HTMLElement>("[data-hud-depth]"));
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        for (const el of items) {
          const d = parseFloat(el.dataset.hudDepth || "0");
          el.style.transform = `translate3d(0, ${(-y * d).toFixed(1)}px, 0)`;
        }
        layer.style.transform = `perspective(1400px) rotateX(${Math.min(7, y * 0.0035).toFixed(2)}deg)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={layerRef} className="hud-layer" aria-hidden>
      <div className="hud-par hud-p1" data-hud-depth="0.08">
        <div className="hud-spin"><Gauge size={560} /></div>
      </div>
      <div className="hud-par hud-p2" data-hud-depth="0.18">
        <div className="hud-spin hud-rev"><Gauge size={400} flip /></div>
      </div>
      <div className="hud-par hud-p3" data-hud-depth="0.32">
        <div className="hud-spin"><Gauge size={300} /></div>
      </div>
      <div className="hud-par hud-p4" data-hud-depth="0.05">
        <div className="hud-spin hud-rev"><Gauge size={200} flip /></div>
      </div>
    </div>
  );
}
