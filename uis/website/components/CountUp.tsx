"use client";

import { useEffect, useRef } from "react";
import { inView, observeOnce, prefersReducedMotion } from "@/lib/motion";

interface CountUpProps {
  to: number;
  from?: number;
}

/** Counts from `from` to `to` in 1.3s (ease-out cubic) when it first scrolls into view (setupCounts). */
export default function CountUp({ to, from = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || inView(el)) return;
    el.textContent = String(from);
    let raf = 0;
    const io = observeOnce(el, () => {
      const t0 = performance.now();
      const d = 1300;
      const frame = (now: number) => {
        const k = Math.min(1, (now - t0) / d);
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = String(Math.round(from + (to - from) * e));
        if (k < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = String(to);
    };
  }, [to, from]);

  return <span ref={ref}>{to}</span>;
}
