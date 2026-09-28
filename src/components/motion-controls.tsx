"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionProps,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Tracks the user's pointer (mouse) or device tilt (mobile) as smoothed
 * motion values in the range -1..1. Respects prefers-reduced-motion.
 */
export function usePointerMotion() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.6 });
  const [needsPermission, setNeedsPermission] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMouse = (e: globalThis.MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      rawX.set(clamp(e.gamma / 30));
      rawY.set(clamp((e.beta - 45) / 30));
    };

    window.addEventListener("mousemove", onMouse, { passive: true });

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE?.requestPermission === "function") {
      // iOS: tilt needs an explicit user gesture
      setNeedsPermission(true);
    } else {
      window.addEventListener("deviceorientation", onTilt);
    }

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [rawX, rawY]);

  const enableTilt = async () => {
    try {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission: () => Promise<string>;
      };
      const res = await DOE.requestPermission();
      if (res === "granted") {
        window.addEventListener("deviceorientation", (e) => {
          if (e.gamma == null || e.beta == null) return;
          rawX.set(clamp(e.gamma / 30));
          rawY.set(clamp((e.beta - 45) / 30));
        });
      }
    } catch {
      /* permission denied or unavailable — mouse still works */
    }
    setNeedsPermission(false);
  };

  return { x, y, needsPermission, enableTilt };
}

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
} & MotionProps;

/**
 * Card that tilts in 3D toward the pointer with a moving glare highlight.
 */
export function TiltCard({ children, className, max = 9, ...rest }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });

  const glareX = useTransform(sry, [-max, max], [15, 85]);
  const glareY = useTransform(srx, [-max, max], [15, 85]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.16), transparent 65%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      className={`relative ${className ?? ""}`}
      {...rest}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: glare }}
      />
    </motion.div>
  );
}
