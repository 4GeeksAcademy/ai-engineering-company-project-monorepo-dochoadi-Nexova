"use client";

import { useEffect, useRef } from "react";
import { cssVar, prefersReducedMotion } from "@/lib/motion";
import styles from "./RoleTicker.module.css";

interface RoleTickerProps {
  prefix: string;
  roles: readonly string[];
}

/** "a CFO, a Head of Customer Support, … or a leadership programme." */
function srSentence(prefix: string, roles: readonly string[]): string {
  const bare = roles.map((r) => r.replace(/\.$/, ""));
  return `${prefix} ${bare.slice(0, -1).join(", ")} or ${bare[bare.length - 1]}.`;
}

/**
 * Cycles through the roles once, then rests on the first one again
 * (setupHero in the design). Hidden from assistive technology, which reads
 * one sentence listing every role instead.
 */
export default function RoleTicker({ prefix, roles }: RoleTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const easeOut = cssVar("--ease-out");
    const easeInOut = cssVar("--ease-in-out");
    const timers: number[] = [];
    const anims: Animation[] = [];
    let i = 0;
    const step = () => {
      i++;
      const out = el.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(-100%)", opacity: 0 },
        ],
        { duration: 280, easing: easeInOut, fill: "forwards" },
      );
      anims.push(out);
      out.onfinish = () => {
        el.textContent = roles[i % roles.length] ?? "";
        anims.push(
          el.animate(
            [
              { transform: "translateY(100%)", opacity: 0 },
              { transform: "translateY(0)", opacity: 1 },
            ],
            { duration: 460, easing: easeOut },
          ),
        );
        out.cancel();
        if (i < roles.length) timers.push(window.setTimeout(step, 1700));
      };
    };
    timers.push(window.setTimeout(step, 2400));
    return () => {
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
      el.textContent = roles[0] ?? "";
    };
  }, [roles]);

  return (
    <>
      <span aria-hidden="true">
        {prefix}{" "}
        <span className={styles.window}>
          <span ref={ref} className={styles.role}>
            {roles[0]}
          </span>
        </span>
      </span>
      <span className="sr-only">{srSentence(prefix, roles)}</span>
    </>
  );
}
