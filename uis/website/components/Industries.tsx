import { industrySection } from "@/content/home";
import Reveal from "./Reveal";
import styles from "./Industries.module.css";

/** Hover or focus sweeps the name to rust and indents the row (setupIndustries, done in CSS). */
export default function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-h" className={styles.section}>
      <div className="container">
        <Reveal as="h2" id="industries-h" index={0} className={`section-title ${styles.title}`}>
          {industrySection.heading}
        </Reveal>
        <div className={styles.list}>
          {industrySection.rows.map((row, i) => (
            <Reveal key={row.name} as="a" href="#contact" index={i} className={styles.row}>
              <span className={styles.shift}>
                <span className={styles.name}>
                  {row.name}
                  <span aria-hidden="true" className={styles.sweep}>
                    {row.name}
                  </span>
                </span>
                <span className={styles.desc}>{row.body}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
