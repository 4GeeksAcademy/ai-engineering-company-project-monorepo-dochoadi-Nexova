import { brand, footer } from "@/content/home";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <a href="#top" className={styles.logo}>
              {brand.name}
              <span className={styles.logoDot} />
            </a>
            <p className={styles.tagline}>{footer.tagline}</p>
          </div>
          <div>
            <h2 className={styles.heading}>{footer.officesHeading}</h2>
            <ul className={styles.offices}>
              {footer.offices.map((o) => (
                <li key={o.place}>
                  {o.place}
                  <br />
                  <span className={styles.muted}>{o.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label={footer.navLabel}>
            <h2 className={styles.heading}>{footer.navHeading}</h2>
            <ul className={styles.links}>
              {footer.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className={styles.heading}>{footer.legalHeading}</h2>
            <ul className={styles.links}>
              {footer.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" className={`${styles.link} ${styles.button}`}>
                  {footer.cookieSettings}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <p className={styles.copyright}>{footer.copyright}</p>
      </div>
    </footer>
  );
}
