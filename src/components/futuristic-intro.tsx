"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  "biometric scan",
  "neural link",
  "decrypting portfolio",
  "rendering dashboard",
];

/** Futuristic identity-verification intro. Skippable, auto-dismisses, and
 *  shows once per browser session. */
export default function FuturisticIntro({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (step < STEPS.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 620);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => doneRef.current(), 450);
    }, 900);
    return () => clearTimeout(t);
  }, [step]);

  const finish = () => {
    setLeaving(true);
    setTimeout(() => doneRef.current(), 450);
  };

  return (
    <div className={`fintro${leaving ? " fintro-out" : ""}`} role="dialog" aria-label="Site intro">
      <div className="fintro-bg" />
      <div className="fintro-scan" />
      <button className="fintro-skip" onClick={finish}>
        SKIP&nbsp;INTRO
      </button>
      <div className="fintro-box">
        <p className="fintro-kicker">AKSHAYIYER.INFO // SECURE UPLINK</p>
        <h2 className="fintro-title">Identity verification</h2>
        <div className="fintro-lines">
          {STEPS.map((s, i) => (
            <div key={s}>
              {i < step ? (
                <>
                  <span className="ok">✓</span> {s} … <span className="ok">ok</span>
                </>
              ) : i === step ? (
                <>
                  <span className="run">›</span> {s} … <span className="run">working</span>
                </>
              ) : (
                <>
                  <span>·</span> {s} …
                </>
              )}
            </div>
          ))}
        </div>
        <div className="fintro-bar">
          <i style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>
        {step >= STEPS.length && <p className="fintro-granted">ACCESS GRANTED</p>}
      </div>
    </div>
  );
}
