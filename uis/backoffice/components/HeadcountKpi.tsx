"use client";

import { useState } from "react";
import { kpis } from "@/content/overview";
import type { HeadcountSummary } from "@/lib/metrics";
import { prefersReducedMotion, useLoadProgress } from "@/lib/motion";
import styles from "./Kpi.module.css";

interface Segment {
  id: string;
  label: string;
  size: number;
}

/** Headcount tile: teams counted up to the declared total, one focusable bar segment per team. */
export default function HeadcountKpi({ summary, segments }: { summary: HeadcountSummary; segments: Segment[] }) {
  const p = useLoadProgress();
  const [tip, setTip] = useState<string | null>(null);
  const copy = kpis.headcount;
  const { declared } = summary;

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  };

  return (
    <article className={`${styles.kpi} rise`}>
      <div className={styles.kpiHead}>
        <span>{copy.label}</span>
        <span>{copy.declared(declared)}</span>
      </div>
      <div className={styles.kpiVal} aria-hidden="true">
        {Math.round(summary.accountedFor * p)}
        <span className={styles.of}>{copy.of(declared)}</span>
      </div>
      <span className="sr-only">{copy.srValue(summary.accountedFor, declared)}</span>
      <div className={styles.kpiSub}>{copy.unknown(summary.unknownTeams)}</div>
      <div className={styles.hcBar}>
        {segments.map((s) => {
          const show = () => setTip(copy.segmentTip(s.label, s.size, Math.round((s.size / declared) * 100), declared));
          return (
            <button
              key={s.id}
              type="button"
              className={styles.hcSeg}
              style={{ width: `${((s.size / declared) * 100 * p).toFixed(2)}%` }}
              aria-label={copy.segmentLabel(s.label, s.size)}
              onMouseEnter={show}
              onFocus={show}
              onMouseLeave={() => setTip(null)}
              onBlur={() => setTip(null)}
              onClick={() => goTo(s.id)}
            />
          );
        })}
      </div>
      <p className={styles.hcTip} aria-live="polite">
        {tip ?? copy.tipIdle}
      </p>
    </article>
  );
}
