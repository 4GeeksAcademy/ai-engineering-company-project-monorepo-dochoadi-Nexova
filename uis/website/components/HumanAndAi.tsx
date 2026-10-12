"use client";

import { useEffect, useRef } from "react";
import { humanAndAi } from "@/content/home";
import { clamp01, onScrollFrame, prefersReducedMotion } from "@/lib/motion";
import Reveal from "./Reveal";
import styles from "./HumanAndAi.module.css";

/** Splits text into word spans, keeping the spaces between them. */
function words(text: string) {
  return text.split(/(\s+)/).map((part, i) =>
    !part || /^\s+$/.test(part) ? (
      part
    ) : (
      <span key={i} data-word="" className={styles.word}>
        {part}
      </span>
    ),
  );
}

export default function HumanAndAi() {
  const statementRef = useRef<HTMLParagraphElement>(null);

  // The statement lights up word by word as it scrolls through the viewport (setupWords + tick()).
  useEffect(() => {
    const reduced = prefersReducedMotion();
    return onScrollFrame(() => {
      const p = statementRef.current;
      if (!p) return;
      const all = p.querySelectorAll<HTMLSpanElement>("[data-word]");
      const vh = window.innerHeight;
      const r = p.getBoundingClientRect();
      const progress = reduced ? 1 : clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.3));
      const lit = Math.round(progress * all.length);
      all.forEach((s, i) => {
        s.style.opacity = i < lit ? "1" : "0.2";
      });
    });
  }, []);

  const { heading, statement } = humanAndAi;

  return (
    <section id="ai" aria-labelledby="ai-h" className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <Reveal as="h2" id="ai-h" index={0} className={`section-title ${styles.title}`}>
            {heading.before}
            <span className={styles.accent}>{heading.accent}</span>
            {heading.after}
          </Reveal>
          <Reveal as="p" index={1} className={styles.lead}>
            {humanAndAi.intro}
          </Reveal>
        </div>
        <p ref={statementRef} className={styles.statement}>
          {words(statement.before)}
          <span className={styles.accent}>{words(statement.accent)}</span>
          {words(statement.after)}
        </p>
        <div className={styles.pillars}>
          {humanAndAi.pillars.map((p, i) => (
            <Reveal key={p.title} index={i} className={styles.pillar}>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <dl className={styles.pairs}>
                <div>
                  <dt className={styles.ai}>{humanAndAi.aiLabel}</dt>
                  <dd className={styles.dd}>{p.ai}</dd>
                </div>
                <div className={styles.peopleRow}>
                  <dt className={styles.people}>{humanAndAi.peopleLabel}</dt>
                  <dd className={styles.dd}>{p.people}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
