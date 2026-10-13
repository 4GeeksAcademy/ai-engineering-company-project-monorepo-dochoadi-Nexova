"use client";

import { useEffect, useRef, useState } from "react";
import { brand, navigation } from "@/content/home";
import { clamp01, NARROW_QUERY, onScrollFrame } from "@/lib/motion";
import MobileNav from "./MobileNav";
import styles from "./Header.module.css";

const MOBILE_NAV_ID = "mobile-nav";

export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Shadow after 8px of scroll and the scroll-progress bar (tick() in the design).
  useEffect(
    () =>
      onScrollFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? clamp01(y / max) : 0})`;
        if (headerRef.current) headerRef.current.style.boxShadow = y > 8 ? "var(--shadow-header)" : "none";
      }),
    [],
  );

  // While open: Escape closes and returns focus to the button; widening past 860px closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const mq = window.matchMedia(NARROW_QUERY);
    const onChange = () => {
      if (!mq.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.inner}>
        <a href="#top" aria-label={brand.homeLabel} className={styles.logo}>
          {brand.name}
          <span className={styles.logoDot} />
        </a>
        <nav aria-label="Primary" className={styles.nav}>
          <div className={styles.links}>
            {navigation.links.map((l) => (
              <a key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </a>
            ))}
          </div>
          <a href={navigation.cta.href} className={styles.cta}>
            {navigation.cta.label}
          </a>
        </nav>
        <button
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={MOBILE_NAV_ID}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? navigation.menuClose : navigation.menuOpen}
        </button>
      </div>
      {open && <MobileNav id={MOBILE_NAV_ID} onNavigate={() => setOpen(false)} />}
      <div aria-hidden="true" className={styles.progressTrack}>
        <div ref={barRef} className={styles.progress} />
      </div>
    </header>
  );
}
