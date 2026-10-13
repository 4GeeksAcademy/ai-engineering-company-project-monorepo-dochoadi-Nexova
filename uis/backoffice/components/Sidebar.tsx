"use client";

import { useEffect, useRef, useState } from "react";
import { shell } from "@/content/overview";
import styles from "./Sidebar.module.css";

interface NavItem {
  id: string;
  label: string;
  /** Team size, or the "–" placeholder. */
  count: string;
}

const NAV_ID = "bo-nav";

/** Forest sidebar: wordmark, overview and departments with scroll-spy; a Menu toggle under 960px. */
export default function Sidebar({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [spy, setSpy] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Scroll-spy: the department card crossing the middle band of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSpy(e.target.getAttribute("data-dept"));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document.querySelectorAll("[data-dept]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Escape closes the open menu and returns focus to its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <aside className={styles.side}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <a className={styles.mark} href="#overview" aria-label={shell.brandLabel}>
            <span className={styles.markName}>{shell.brandName}</span>
            <span className={styles.markDot} aria-hidden="true" />
            <span className={styles.markTag}>{shell.brandTag}</span>
          </a>
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuBtn}
            aria-controls={NAV_ID}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? shell.menuClose : shell.menuOpen}
          </button>
        </div>
        <nav id={NAV_ID} aria-label={shell.navLabel} className={`${styles.nav} ${open ? "" : styles.navClosed}`}>
          <a className={`${styles.link} ${styles.on}`} href="#overview" aria-current="page" onClick={close}>
            {shell.overview}
          </a>
          <div className={styles.group}>{shell.departmentsGroup}</div>
          {items.map((d) => (
            <a key={d.id} href={`#${d.id}`} className={`${styles.link} ${spy === d.id ? styles.spy : ""}`} onClick={close}>
              {d.label}
              <span className={styles.count}>{d.count}</span>
            </a>
          ))}
        </nav>
        <p className={styles.foot}>{shell.footer}</p>
      </div>
    </aside>
  );
}
