"use client";

import type { PointerEvent, ReactNode } from "react";

interface SpotlightCardProps {
  id: string;
  className?: string;
  spotClassName?: string;
  children: ReactNode;
}

/** Department card whose soft spotlight follows the pointer; `data-dept` feeds the sidebar scroll-spy. */
export default function SpotlightCard({ id, className, spotClassName, children }: SpotlightCardProps) {
  const move = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <article id={id} data-dept={id} className={className} onPointerMove={move}>
      <span className={spotClassName} aria-hidden="true" />
      {children}
    </article>
  );
}
