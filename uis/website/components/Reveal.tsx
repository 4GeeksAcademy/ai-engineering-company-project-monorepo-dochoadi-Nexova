"use client";

import { useEffect, useRef } from "react";
import type { HTMLAttributes } from "react";
import { inView, observeOnce, prefersReducedMotion } from "@/lib/motion";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "h2" | "p" | "a";
  /** Stagger position: the reveal waits index × 100 ms. */
  index?: number;
  href?: string;
}

/**
 * Fades and lifts its element in the first time it scrolls into view
 * (setupReveals in the design). Elements already on screen at load stay put.
 */
export default function Reveal({ as = "div", index = 0, ...props }: RevealProps) {
  // Typed as a div for JSX; the effect only uses HTMLElement members, true for every allowed tag.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || inView(el)) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    const io = observeOnce(el, () => {
      const d = index * 100;
      el.style.transition = `opacity 700ms var(--ease-out) ${d}ms, transform 700ms var(--ease-out) ${d}ms`;
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return () => io.disconnect();
  }, [index]);

  const Tag = as as "div";
  return <Tag ref={ref} {...props} />;
}
