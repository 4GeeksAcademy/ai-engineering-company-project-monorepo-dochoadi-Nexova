import type { Company } from "@repo/shared-types";
import { openQuestions } from "@/content/overview";
import type { BoardDepartment } from "@/lib/departments";
import styles from "./OpenQuestions.module.css";

/** Every ambiguous team size from the shared data, plus the missing office split. */
export default function OpenQuestions({ departments, company }: { departments: BoardDepartment[]; company: Company }) {
  const cities = [company.headquarters.city, ...company.offices.map((o) => o.city)];
  const notes = departments.flatMap((d) => (d.teamSizeNote ? [{ topic: d.label, text: d.teamSizeNote }] : []));
  notes.push({ topic: openQuestions.officesTopic, text: openQuestions.offices(cities) });

  return (
    <section className={styles.notes} aria-labelledby="notes-h">
      <h2 className="h2" id="notes-h">
        {openQuestions.title}
      </h2>
      <ul>
        {notes.map((n) => (
          <li key={n.topic}>
            <b>{n.topic}:</b> {n.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
