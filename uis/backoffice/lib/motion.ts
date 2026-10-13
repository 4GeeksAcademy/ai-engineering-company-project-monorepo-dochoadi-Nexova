"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The design refreshes the clocks every 30 s. */
const CLOCK_REFRESH_MS = 30_000;

function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, CLOCK_REFRESH_MS);
  return () => window.clearInterval(id);
}
// Whole minutes, so repeated reads within one render agree.
const getNow = () => Math.floor(Date.now() / 60_000) * 60_000;
// No clock on the server: the first client render matches it, then switches to the real time.
const getServerNow = () => null;

/** Current time to the minute, refreshed every 30 s; null on the server and during hydration. */
export function useNow(): number | null {
  return useSyncExternalStore(subscribeClock, getNow, getServerNow);
}

const LOAD_DELAY_MS = 350;
const LOAD_DURATION_MS = 1500;

/**
 * Page-load progress from 0 to 1 (ease-out cubic, 1.5 s after a 350 ms pause), driving the
 * count-ups and bar growth. Jumps straight to 1 under prefers-reduced-motion.
 */
export function useLoadProgress(): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    if (prefersReducedMotion()) {
      raf = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(raf);
    }
    let t0 = 0;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / LOAD_DURATION_MS);
      setP(1 - Math.pow(1 - k, 3));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    const start = window.setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, LOAD_DELAY_MS);
    return () => {
      window.clearTimeout(start);
      cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}
