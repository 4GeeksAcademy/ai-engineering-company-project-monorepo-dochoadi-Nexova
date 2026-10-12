import { about } from "@/content/home";
import { HoursApart } from "./OfficeClock";
import OfficePhotos from "./OfficePhotos";
import Reveal from "./Reveal";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-h" className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <Reveal as="h2" id="about-h" index={0} className={`section-title ${styles.title}`}>
            {about.heading}
          </Reveal>
          <div className={styles.paragraphs}>
            {about.paragraphs.map((text, i) => (
              <Reveal key={i} as="p" index={i + 1} className={styles.paragraph}>
                {text}
              </Reveal>
            ))}
          </div>
        </div>
        <OfficePhotos photos={about.photos} />
        <Reveal as="p" index={0} className={styles.hours}>
          <HoursApart
            cityA={about.photos[0]?.city ?? ""}
            cityB={about.photos[1]?.city ?? ""}
            className={styles.hoursNumber}
          />
          {about.hoursApartSuffix}
        </Reveal>
      </div>
    </section>
  );
}
