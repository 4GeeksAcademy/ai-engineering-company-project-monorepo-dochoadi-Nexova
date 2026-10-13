"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Button.module.css";

type Variant = "primary" | "outline" | "outlineInk";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** The button drifts towards a mouse pointer (setupMagnetic in the design). */
  magnetic?: boolean;
}

export default function Button({ href, children, variant = "primary", magnetic = false }: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!magnetic || !el || prefersReducedMotion()) return;
    el.style.transition = "transform 250ms var(--ease-out)";
    const move = (ev: PointerEvent) => {
      if (ev.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * 0.22}px, ${(ev.clientY - r.top - r.height / 2) * 0.32}px)`;
    };
    const leave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [magnetic]);

  return (
    <a ref={ref} href={href} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </a>
  );
}
