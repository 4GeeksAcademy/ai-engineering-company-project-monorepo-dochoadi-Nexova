import { hero } from "@/content/home";
import Button from "./Button";
import CvCascade from "./CvCascade";
import PulseDot from "./PulseDot";
import RoleTicker from "./RoleTicker";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section aria-labelledby="hero-h" className={styles.hero}>
      <div className={styles.copy}>
        <p className={`${styles.eyebrow} ${styles.fade}`}>
          <PulseDot />
          {hero.eyebrow}
        </p>
        <h1 id="hero-h" className={styles.title}>
          {hero.headline.map((line) => (
            <span key={line.text} className={styles.line}>
              <span className={styles.rise}>
                {line.accent && <span className={styles.accent}>{line.accent}</span>}
                {line.text}
              </span>
            </span>
          ))}
        </h1>
        <p className={`${styles.lede} ${styles.fade}`}>{hero.lede}</p>
        <p className={`${styles.search} ${styles.fade}`}>
          <RoleTicker prefix={hero.tickerPrefix} roles={hero.roles} />
        </p>
        <div className={`${styles.actions} ${styles.fade}`}>
          <Button href={hero.primaryCta.href} magnetic>
            {hero.primaryCta.label}
          </Button>
          <Button href={hero.secondaryCta.href} variant="outline">
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>
      <CvCascade />
    </section>
  );
}
