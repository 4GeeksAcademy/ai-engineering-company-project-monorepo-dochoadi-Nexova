import type { SupportSla } from "@repo/shared-types";
import { departmentsCopy } from "@/content/overview";
import type { BoardDepartment } from "@/lib/departments";
import NeedList from "./NeedList";
import SpotlightCard from "./SpotlightCard";
import SupportClock from "./SupportClock";
import styles from "./DepartmentCard.module.css";

/** Customer Support carries the live "If a ticket arrived now" panel. */
const SLA_DEPARTMENT = "support";

export default function DepartmentCard({ department: d, sla }: { department: BoardDepartment; sla: SupportSla }) {
  return (
    <SpotlightCard id={d.id} className={styles.dept} spotClassName={styles.spot}>
      <div className={styles.top}>
        <div>
          <h3 className={styles.name}>{d.name}</h3>
          <p className={styles.who}>{d.manager}</p>
        </div>
        <span className={styles.size}>
          {d.teamSize === null ? (
            <span className={styles.sizeNa}>{departmentsCopy.notStated}</span>
          ) : (
            <span className={styles.sizeN}>{d.teamSize}</span>
          )}
          <span className={styles.sizeL}>{d.teamSize === null ? departmentsCopy.teamSize : departmentsCopy.people}</span>
        </span>
      </div>
      {d.id === SLA_DEPARTMENT && <SupportClock committedHours={sla.committedHours} currentHours={sla.currentAverageHours} />}
      <p className={styles.row}>
        <b>{departmentsCopy.today}</b> {d.today}
      </p>
      <p className={styles.row}>
        <b>{departmentsCopy.problem}</b> {d.problem}
      </p>
      <NeedList needs={d.needs} />
    </SpotlightCard>
  );
}
