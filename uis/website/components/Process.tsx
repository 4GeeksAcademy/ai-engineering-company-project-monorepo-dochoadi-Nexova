"use client";

import { useEffect, useRef } from "react";
import { processSection } from "@/content/home";
import { clamp01, NARROW_QUERY, onScrollFrame, prefersReducedMotion } from "@/lib/motion";
import Reveal from "./Reveal";
import styles from "./Process.module.css";

export default function Process() {
  const procRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // The line draws with scroll (horizontal, or vertical under 860px) and steps light up as it passes (tick()).
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const mq = window.matchMedia(NARROW_QUERY);
    return onScrollFrame(() => {
      const proc = procRef.current;
      if (!proc) return;
      const vh = window.innerHeight;
      const narrow = mq.matches;
      const r = proc.getBoundingClientRect();
      const p = reduced ? 1 : clamp01(narrow ? (vh * 0.65 - r.top) / r.height : (vh * 0.85 - r.top) / (vh * 0.5));
      if (hRef.current) hRef.current.style.transform = `scaleX(${p})`;
      if (vRef.current) vRef.current.style.transform = `scaleY(${p})`;
      stepRefs.current.forEach((s) => {
        if (!s) return;
        const sr = s.getBoundingClientRect();
        const pos = narrow ? (sr.top - r.top) / r.height : (sr.left - r.left) / r.width;
        s.style.opacity = p >= pos + 0.01 ? "1" : "0.35";
      });
    });
  }, []);

  return (
    <section id="process" aria-labelledby="process-h" className={styles.section}>
      <div className="container">
        <Reveal as="h2" id="process-h" index={0} className={`section-title ${styles.title}`}>
          {processSection.heading}
        </Reveal>
        <div ref={procRef} className={styles.proc}>
          <div aria-hidden="true" className={styles.hLine}>
            <div ref={hRef} className={styles.hFill} />
          </div>
          <div aria-hidden="true" className={styles.vLine}>
            <div ref={vRef} className={styles.vFill} />
          </div>
          <ol className={styles.steps}>
            {processSection.steps.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={styles.step}
              >
                <div aria-hidden="true" className={styles.dots}>
                  {Array.from({ length: step.dots }, (_, d) => (
                    <span key={d} className={step.dots === 1 ? styles.dotFinal : styles.dot} />
                  ))}
                </div>
                <p className={styles.number}>
                  {processSection.stepLabel} {i + 1}
                </p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
