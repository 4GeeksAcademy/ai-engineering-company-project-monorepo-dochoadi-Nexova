"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { inView, observeOnce, onScrollFrame, prefersReducedMotion } from "@/lib/motion";
import OfficeClock from "./OfficeClock";
import PulseDot from "./PulseDot";
import styles from "./OfficePhotos.module.css";

interface Photo {
  city: string;
  src: string;
  alt: string;
}

/**
 * The two office photos: a bottom-up clip-path reveal and a slow parallax
 * (setupPhotos + tick() in the design).
 *
 * The reveal observes the grid wrapper, not the clipped <figure>: a figure
 * clipped with inset(100% …) never reports as intersecting, so observing it
 * would leave the photos hidden for good (bug in the original export).
 */
export default function OfficePhotos({ photos }: { photos: readonly Photo[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const figureRefs = useRef<(HTMLElement | null)[]>([]);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;

    const hidden = figureRefs.current.filter((f): f is HTMLElement => !!f && !inView(f));
    hidden.forEach((f) => {
      f.style.clipPath = "inset(100% 0 0 0 round 28px)";
    });
    const io =
      hidden.length > 0
        ? observeOnce(grid, () =>
            hidden.forEach((f) => {
              f.style.transition = "clip-path 1000ms var(--ease-in-out)";
              f.style.clipPath = "inset(0% 0 0 0 round 28px)";
            }),
          )
        : null;

    const stopScroll = onScrollFrame(() => {
      const vh = window.innerHeight;
      parallaxRefs.current.forEach((el) => {
        const parent = el?.parentElement;
        if (!el || !parent) return;
        const r = parent.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - vh / 2) * -0.08}px, 0)`;
      });
    });

    return () => {
      io?.disconnect();
      stopScroll();
    };
  }, []);

  return (
    <div ref={gridRef} className={styles.grid}>
      {photos.map((photo, i) => (
        <figure
          key={photo.city}
          ref={(el) => {
            figureRefs.current[i] = el;
          }}
          className={styles.photo}
        >
          <div
            ref={(el) => {
              parallaxRefs.current[i] = el;
            }}
            className={styles.parallax}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1320px) 612px, (min-width: 728px) 50vw, 100vw"
              loading="lazy"
              className={styles.image}
            />
          </div>
          <figcaption className={styles.caption}>
            <PulseDot />
            <span className={styles.city}>{photo.city}</span>
            <OfficeClock city={photo.city} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
