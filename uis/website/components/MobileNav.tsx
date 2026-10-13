"use client";

import { useEffect, useRef } from "react";
import { navigation } from "@/content/home";
import styles from "./MobileNav.module.css";

interface MobileNavProps {
  id: string;
  /** Called when a link is followed, so the menu closes. */
  onNavigate: () => void;
}

export default function MobileNav({ id, onNavigate }: MobileNavProps) {
  const ref = useRef<HTMLElement>(null);

  // Move focus into the menu when it opens.
  useEffect(() => {
    ref.current?.querySelector("a")?.focus();
  }, []);

  return (
    <nav ref={ref} id={id} aria-label="Mobile" className={styles.nav}>
      <div className={styles.list}>
        {navigation.links.map((l) => (
          <a key={l.href} href={l.href} className={styles.link} onClick={onNavigate}>
            {l.label}
          </a>
        ))}
      </div>
      <a href={navigation.cta.href} className={styles.cta} onClick={onNavigate}>
        {navigation.cta.label}
      </a>
    </nav>
  );
}
