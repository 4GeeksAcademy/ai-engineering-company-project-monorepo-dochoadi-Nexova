"use client";

import type { CSSProperties } from "react";
import { kpis } from "@/content/overview";
import type { SlaGap } from "@/lib/metrics";
import { useLoadProgress } from "@/lib/motion";
import styles from "./Kpi.module.css";

interface SlaKpiProps {
  current: number;
  committed: number;
  gap: SlaGap;
}

/** Support SLA tile: the gap counts up on load and the bar fills from 0 to the current average. */
export default function SlaKpi({ current, committed, gap }: SlaKpiProps) {
  const p = useLoadProgress();
  const copy = kpis.sla;
  // The bar spans 0 h to the current average; the gradient is sized to the full bar while it grows.
  const split = `${(committed / current) * 100}%`;
  const fill: CSSProperties = {
    width: `${(100 * p).toFixed(1)}%`,
    backgroundSize: `${(100 / Math.max(p, 0.01)).toFixed(1)}% 100%`,
  };

  return (
    <article
      className={`${styles.kpi} ${gap.breached ? styles.kpiAlert : ""} rise`}
      style={{ "--sla-split": split } as CSSProperties}
    >
      <div className={styles.kpiHead}>
        <span>{copy.label}</span>
        {gap.breached && (
          <span className={`chip ${styles.chipBad}`}>
            <span className={styles.chipDot} aria-hidden="true" />
            {copy.chip}
          </span>
        )}
      </div>
      <div className={styles.kpiVal} aria-hidden="true">
        {copy.value(Math.round(gap.hours * p))}
      </div>
      <span className="sr-only">{copy.srValue(gap.hours)}</span>
      <div className={styles.kpiSub}>{copy.sub(current, committed, Math.round(gap.percent * p))}</div>
      <div className={styles.slaTrack} role="img" aria-label={copy.barLabel(current, committed)}>
        <span className={styles.slaFill} style={fill} />
        <span className={styles.slaMark} />
      </div>
      <div className={styles.slaLegend}>
        <span>{copy.legendStart}</span>
        <span>{copy.legendCommitted(committed)}</span>
        <span>{copy.legendCurrent(current)}</span>
      </div>
    </article>
  );
}
