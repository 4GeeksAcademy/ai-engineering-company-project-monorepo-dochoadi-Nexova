"use client";

import type { Need } from "@repo/shared-types";
import { departmentsCopy } from "@/content/overview";
import { useNeedsFilter } from "./NeedsFilter";
import styles from "./DepartmentCard.module.css";

/** A department's needs; with a type filter on, matching needs are highlighted and the rest dimmed. */
export default function NeedList({ needs }: { needs: Need[] }) {
  const { filter } = useNeedsFilter();
  return (
    <ul className={styles.needs} aria-label={departmentsCopy.needs}>
      {needs.map((n) => (
        <li key={n.text} className={filter ? (n.type === filter ? styles.hit : styles.miss) : undefined}>
          {n.text}
        </li>
      ))}
    </ul>
  );
}
