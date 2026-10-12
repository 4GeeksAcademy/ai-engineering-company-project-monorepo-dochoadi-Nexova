import { marquee } from "@/content/home";
import styles from "./Marquee.module.css";

/** Decorative band repeating the services, industries and cities; pauses on hover. */
export default function Marquee() {
  return (
    <div aria-hidden="true" className={styles.wrap}>
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={styles.list}>
            {marquee.map((item) => (
              <li key={item} className={styles.item}>
                {item}
                <span className={styles.dot} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
