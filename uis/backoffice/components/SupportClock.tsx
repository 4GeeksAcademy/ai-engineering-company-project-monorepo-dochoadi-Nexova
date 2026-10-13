"use client";

import { departmentsCopy, shell } from "@/content/overview";
import { formatClock, formatDue } from "@/lib/format";
import { slaDueTimes } from "@/lib/metrics";
import { useNow } from "@/lib/motion";
import styles from "./DepartmentCard.module.css";

/** When a ticket arriving now is due under the SLA, and when it is typically resolved; recomputed every 30 s. */
export default function SupportClock({ committedHours, currentHours }: { committedHours: number; currentHours: number }) {
  const now = useNow();
  const times = now === null ? null : slaDueTimes(new Date(now), committedHours, currentHours);
  return (
    <div className={styles.clock}>
      <span className={styles.clockCap}>
        {departmentsCopy.clockCaption(now === null ? shell.timePlaceholder : formatClock(now))}
      </span>
      <span>
        {departmentsCopy.slaDue}
        <b>{times ? formatDue(times.due) : shell.timePlaceholder}</b>
      </span>
      <span className={styles.late}>
        {departmentsCopy.typical}
        <b>{times ? formatDue(times.typical) : shell.timePlaceholder}</b>
      </span>
    </div>
  );
}
