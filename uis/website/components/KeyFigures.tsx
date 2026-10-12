import { keyFigures } from "@/content/home";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import styles from "./KeyFigures.module.css";

export default function KeyFigures() {
  return (
    <section aria-label={keyFigures.label} className={styles.section}>
      <div className="container">
        <dl className={styles.list}>
          {keyFigures.items.map((f, i) => (
            <Reveal key={f.label} index={i} className={styles.item}>
              <dt className={styles.label}>{f.label}</dt>
              <dd className={styles.value}>
                <CountUp to={f.value} from={f.from} />
              </dd>
              <dd className={styles.note}>{f.note}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
