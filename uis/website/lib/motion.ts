/** Small browser helpers shared by the animated components. Call them only from effects. */

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reads a design token, e.g. an easing for the Web Animations API, which does not accept var(). */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function inView(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

/** Calls `fn` once, the first time `el` intersects. Disconnect the returned observer on cleanup. */
export function observeOnce(el: Element, fn: () => void, threshold = 0.15): IntersectionObserver {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    },
    { threshold },
  );
  io.observe(el);
  return io;
}

/** Runs `fn` now and at most once per animation frame on scroll and resize. Returns the cleanup. */
export function onScrollFrame(fn: () => void): () => void {
  let raf = 0;
  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      fn();
    });
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  fn();
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

/** Matches the design's `w < 860` breakpoint. */
export const NARROW_QUERY = "(max-width: 859.98px)";
