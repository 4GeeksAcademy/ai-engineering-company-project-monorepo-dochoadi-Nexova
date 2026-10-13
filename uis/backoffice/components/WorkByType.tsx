"use client";

import type { NeedTypeInfo } from "@repo/shared-types";
import { work } from "@/content/overview";
import { useLoadProgress } from "@/lib/motion";
import { useNeedsFilter } from "./NeedsFilter";
import styles from "./WorkByType.module.css";

interface TypeTotal extends NeedTypeInfo {
  count: number;
  /** How many departments have at least one need of this type. */
  departments: number;
}

/** Stacked bar of all needs by type, growing on load, with toggle filters that highlight the department cards. */
export default function WorkByType({ types, departmentCount }: { types: TypeTotal[]; departmentCount: number }) {
  const p = useLoadProgress();
  const { filter, toggle } = useNeedsFilter();
  const total = types.reduce((sum, t) => sum + t.count, 0);
  const active = types.find((t) => t.id === filter);

  return (
    <section aria-labelledby="work-h" className={`${styles.work} rise`}>
      <div className={`sec-head ${styles.head}`}>
        <h2 className="h2" id="work-h">
          {work.title}
        </h2>
        <span className="sec-note">{work.note(total, departmentCount)}</span>
      </div>
      <div className={styles.bar} aria-hidden="true">
        {types.map((t) => (
          <span
            key={t.id}
            className={`${styles.seg} ${filter && filter !== t.id ? styles.dim : ""}`}
            style={{ width: `${((t.count / total) * 100 * p).toFixed(2)}%`, background: `var(${t.colorToken})` }}
          >
            {t.count}
          </span>
        ))}
      </div>
      <div className={styles.filters} role="group" aria-label={work.filtersLabel}>
        {types.map((t) => (
          <button
            key={t.id}
            type="button"
            className={styles.filter}
            aria-pressed={filter === t.id}
            onClick={() => toggle(t.id)}
          >
            <span className={styles.swatch} style={{ background: `var(${t.colorToken})` }} aria-hidden="true" />
            {t.label} · {t.count}
          </button>
        ))}
      </div>
      <p className={styles.summary} aria-live="polite">
        {active ? work.summary(active.count, active.label, active.departments) : work.idle}
      </p>
    </section>
  );
}
