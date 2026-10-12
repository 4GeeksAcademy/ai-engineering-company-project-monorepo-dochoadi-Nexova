"use client";

import { useEffect, useRef } from "react";
import { services } from "@/content/home";
import { clamp01, onScrollFrame, prefersReducedMotion } from "@/lib/motion";
import Reveal from "./Reveal";
import styles from "./Services.module.css";

/** Sticky offset of each stacked card, in px (data-top in the design). */
const STACK_TOPS = [96, 120, 144];

export default function Services() {
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const spotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Stacking: a card shrinks and dims as the next one slides over it (tick()).
    const stopScroll = onScrollFrame(() => {
      const slots = slotRefs.current;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const next = slots[i + 1];
        if (!next) {
          card.style.transform = "none";
          card.style.filter = "none";
          return;
        }
        const top = STACK_TOPS[i] ?? 0;
        const h = card.offsetHeight;
        const p = clamp01((top + h - next.getBoundingClientRect().top) / Math.max(1, h - 24));
        card.style.transform = `scale(${1 - 0.05 * p})`;
        card.style.filter = p > 0 ? `brightness(${1 - 0.14 * p})` : "none";
      });
    });

    // Pointer spotlight (setupSpots).
    const cleanups = cardRefs.current.map((card, i) => {
      const spot = spotRefs.current[i];
      if (!card || !spot) return () => {};
      const move = (ev: PointerEvent) => {
        if (ev.pointerType !== "mouse") return;
        const r = card.getBoundingClientRect();
        spot.style.opacity = "1";
        spot.style.transform = `translate(${ev.clientX - r.left - 320}px, ${ev.clientY - r.top - 320}px)`;
      };
      const leave = () => {
        spot.style.opacity = "0";
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      return () => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      };
    });

    return () => {
      stopScroll();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section id="services" aria-labelledby="services-h" className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <Reveal as="h2" id="services-h" index={0} className={`section-title ${styles.title}`}>
            {services.heading}
          </Reveal>
          <Reveal as="p" index={1} className={styles.lead}>
            {services.intro}
          </Reveal>
        </div>
        <div className={styles.stack}>
          {services.cards.map((card, i) => (
            <div
              key={card.businessLine}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className={styles.slot}
              style={{ top: STACK_TOPS[i] }}
            >
              <article
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`${styles.card} ${styles[card.theme]}`}
              >
                <div
                  ref={(el) => {
                    spotRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className={styles.spot}
                />
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <div className={styles.bottom}>
                  <div className={styles.text}>
                    <p className={styles.body}>{card.body}</p>
                    <ul className={styles.tags}>
                      {card.tags.map((t) => (
                        <li key={t} className={styles.tag}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href="#contact" aria-label={card.moreLabel} className={styles.more}>
                    {services.more} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
