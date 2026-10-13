import styles from "./PulseDot.module.css";

/** The coral dot with a repeating ripple used in the hero eyebrow and the office captions. */
export default function PulseDot() {
  return <span className={styles.dot} aria-hidden="true" />;
}
