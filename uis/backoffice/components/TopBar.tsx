import { shell } from "@/content/overview";
import LiveClock from "./LiveClock";
import styles from "./TopBar.module.css";

export default function TopBar() {
  return (
    <header className={styles.top}>
      <span className={styles.crumb}>
        {shell.crumbRoot}
        <strong>{shell.crumbPage}</strong>
      </span>
      <span className={styles.right}>
        <LiveClock className={styles.live} dotClassName={styles.dot} />
        <span className={styles.avatar} role="img" aria-label={shell.avatarLabel}>
          {shell.avatar}
        </span>
      </span>
    </header>
  );
}
