"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cascade } from "@/content/home";
import { cvField, CV_SHORTLIST_SIZE } from "@/lib/cvField";
import type { CvCard } from "@/lib/cvField";
import { cssVar, prefersReducedMotion } from "@/lib/motion";
import styles from "./CvCascade.module.css";

/**
 * "The shortlist": 72 CVs fall into a pile, a beam scores them, they sort to
 * the centre, five are shortlisted and one is placed. A port of setupCascade(),
 * playCascade(), cascadeFinal(), setPhase() and magnet() from the design.
 */

const FIELD = cvField();
const WIN = FIELD.cards[FIELD.winIndex];
/** Length of each phase in ms (C in the design). */
const C = 2400;
const START_DELAY = 450;
const PULSING = styles.pulsing ?? "";

type SetPhase = (n: number, instant?: boolean) => void;

/** Mutable motion state of one card, as in the design's card objects. */
interface Motion {
  card: CvCard;
  win: boolean;
  x: number;
  y: number;
  r: number;
  s: number;
  mx: number;
  my: number;
  ms: number;
}

const tf = (m: Pick<Motion, "x" | "y" | "r" | "s" | "mx" | "my" | "ms">) =>
  `translate(${m.mx}px, ${m.my}px) translate(${m.x * 100}%, ${m.y * 100}%) rotate(${m.r}deg) scale(${m.s * m.ms})`;

export default function CvCascade() {
  // Replay remounts the field with a new key, which restarts the timeline.
  const [run, setRun] = useState(0);
  const labelRef = useRef<HTMLSpanElement>(null);
  const segRefs = useRef<(HTMLDivElement | null)[]>([]);
  const segLabelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setPhase = useCallback<SetPhase>((n, instant = false) => {
    if (labelRef.current) labelRef.current.textContent = cascade.phases[n] ?? "";
    segRefs.current.forEach((sg, i) => {
      if (!sg) return;
      if (instant) {
        sg.style.transition = "none";
        sg.style.transform = `scaleX(${i <= n ? 1 : 0})`;
      } else if (i < n) {
        sg.style.transition = "transform 300ms var(--ease-out)";
        sg.style.transform = "scaleX(1)";
      } else if (i === n) {
        sg.style.transition = `transform ${n === 3 ? 700 : 2400}ms linear`;
        sg.style.transform = "scaleX(1)";
      } else {
        sg.style.transition = "none";
        sg.style.transform = "scaleX(0)";
      }
    });
    segLabelRefs.current.forEach((l, i) => {
      if (l) l.style.color = i === n ? "var(--color-cream)" : "var(--color-sage)";
    });
  }, []);

  const resetSegments = useCallback(() => {
    segRefs.current.forEach((sg) => {
      if (!sg) return;
      sg.style.transition = "none";
      sg.style.transform = "scaleX(0)";
    });
  }, []);

  return (
    <figure className={styles.card}>
      <div className={styles.top}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{cascade.title}</span>
          <button type="button" className={styles.replay} onClick={() => setRun((r) => r + 1)}>
            {cascade.replay}
          </button>
        </div>
        <span ref={labelRef} className={styles.phase}>
          {cascade.phases[0]}
        </span>
      </div>
      <CascadeField
        key={run}
        startDelay={run === 0 ? START_DELAY : 0}
        setPhase={setPhase}
        resetSegments={resetSegments}
      />
      <div className={styles.segments}>
        {cascade.phases.map((p, i) => (
          <div key={p}>
            <div className={styles.segTrack}>
              <div
                ref={(el) => {
                  segRefs.current[i] = el;
                }}
                className={styles.seg}
              />
            </div>
            <div
              ref={(el) => {
                segLabelRefs.current[i] = el;
              }}
              className={styles.segLabel}
            >
              {p}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

interface CascadeFieldProps {
  startDelay: number;
  setPhase: SetPhase;
  resetSegments: () => void;
}

interface CardEls {
  el: HTMLDivElement;
  em: HTMLDivElement;
  fill: HTMLDivElement;
  track: HTMLDivElement;
  glow: HTMLDivElement;
}

function CascadeField({ startDelay, setPhase, resetSegments }: CascadeFieldProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const field = fieldRef.current;
    const beam = beamRef.current;
    const ring = ringRef.current;
    const pulse = pulseRef.current;
    const pill = pillRef.current;
    if (!field || !beam || !ring || !pulse || !pill) return;

    const els: CardEls[] = [];
    for (const el of cardRefs.current) {
      const em = el?.querySelector<HTMLDivElement>("[data-em]");
      const fill = el?.querySelector<HTMLDivElement>("[data-fill]");
      const track = el?.querySelector<HTMLDivElement>("[data-track]");
      const glow = el?.querySelector<HTMLDivElement>("[data-glow]");
      if (!el || !em || !fill || !track || !glow) return;
      els.push({ el, em, fill, track, glow });
    }

    const reduced = prefersReducedMotion();
    const std = "var(--ease-out)";
    const timers: number[] = [];
    const anims: Animation[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };
    const cards: Motion[] = FIELD.cards.map((card) => ({
      card,
      win: card === WIN,
      x: card.px,
      y: -card.drop - 1,
      r: card.rot,
      s: 1,
      mx: 0,
      my: 0,
      ms: 1,
    }));
    const each = (fn: (m: Motion, e: CardEls) => void) =>
      cards.forEach((m, i) => {
        const e = els[i];
        if (e) fn(m, e);
      });
    let done = false;

    const resetCascade = () => {
      done = false;
      pill.style.transition = "none";
      pill.style.opacity = "0";
      pill.style.transform = "translate(-50%,-120%) scale(.4)";
      pulse.classList.remove(PULSING);
      pulse.style.opacity = "0";
      ring.style.opacity = "0";
      resetSegments();
    };

    const playCascade = () => {
      resetCascade();
      each((m, { el, fill, track, glow, em }) => {
        el.style.transition = "none";
        m.x = m.card.px;
        m.y = -m.card.drop - 1;
        m.r = m.card.rot;
        m.s = 1;
        m.mx = m.my = 0;
        m.ms = 1;
        el.style.transform = tf(m);
        el.style.opacity = "1";
        el.style.filter = "none";
        el.style.zIndex = String(Math.round(m.card.delay));
        fill.style.transition = "none";
        fill.style.transform = "scaleX(0)";
        fill.style.background = "var(--color-coral)";
        track.style.background = "var(--color-line)";
        glow.style.transition = "none";
        glow.style.opacity = "0";
        em.style.transition = "none";
        em.style.opacity = "0";
      });
      setPhase(0);
      void field.offsetWidth;

      // Fall into a pile.
      each((m, { el, glow, em }) => {
        el.style.transition = `transform 760ms var(--ease-drop) ${m.card.delay}ms`;
        m.y = m.card.py;
        el.style.transform = tf(m);
        glow.style.transition = `opacity 500ms ${std}`;
        em.style.transition = `opacity 400ms ${std}`;
      });

      // Screening: the beam sweeps and the score bars fill as it passes.
      later(() => {
        setPhase(1);
        anims.push(
          beam.animate(
            [
              { transform: "translateX(-100%)", opacity: 0 },
              { opacity: 1, offset: 0.12 },
              { opacity: 1, offset: 0.88 },
              { transform: "translateX(334%)", opacity: 0 },
            ],
            { duration: 1300, easing: "linear" },
          ),
        );
        each((m, { fill }) => {
          const d = ((m.card.px + 0.5) / FIELD.W) * 1300;
          fill.style.transition = `transform 450ms ${std} ${d}ms`;
          fill.style.transform = `scaleX(${m.card.fill})`;
        });
      }, C);

      // Sort by score, best to the centre.
      later(() => {
        each((m, { el }) => {
          el.style.transition = `transform 800ms var(--ease-in-out) ${m.card.rank * 9}ms`;
          el.style.zIndex = String(200 - m.card.rank);
          m.x = m.card.gx;
          m.y = m.card.gy;
          m.r = 0;
          el.style.transform = tf(m);
        });
      }, 1.5 * C);

      // Interviews: the top five lift and glow, the rest fade out.
      later(() => {
        setPhase(2);
        each((m, { el, glow }) => {
          if (m.card.rank < CV_SHORTLIST_SIZE) {
            el.style.transition = `transform 600ms ${std} ${m.card.rank * 60}ms`;
            el.style.zIndex = String(300 - m.card.rank);
            m.s = 1.14;
            el.style.transform = tf(m);
            glow.style.opacity = "1";
          } else {
            el.style.transition = `opacity 600ms ${std}, filter 600ms ${std}`;
            el.style.opacity = "0.13";
            el.style.filter = "grayscale(1)";
          }
        });
      }, 2 * C);

      // Placement: the winner pops, a shockwave rings out, then the badge and the pulse.
      later(() => {
        setPhase(3);
        each((m, { el, em, fill, track }) => {
          if (!m.win) return;
          el.style.transition = "transform 900ms var(--ease-place)";
          el.style.zIndex = "400";
          m.s = 1.8;
          el.style.transform = tf(m);
          em.style.opacity = "1";
          fill.style.background = "var(--color-cream)";
          track.style.background = "var(--color-cream-35)";
        });
        anims.push(
          ring.animate(
            [
              { transform: "translate(-50%,-50%) scale(.6)", opacity: 0.95 },
              { transform: "translate(-50%,-50%) scale(5.5)", opacity: 0 },
            ],
            { duration: 1100, easing: cssVar("--ease-out") },
          ),
        );
        later(() => {
          pill.style.transition = "transform 550ms var(--ease-pop), opacity 200ms linear";
          pill.style.opacity = "1";
          pill.style.transform = "translate(-50%,-120%) scale(1)";
        }, 260);
        later(() => pulse.classList.add(PULSING), 900);
      }, 3 * C);

      later(() => {
        done = true;
        each((_, { el }) => {
          el.style.transition = `transform 320ms ${std}, opacity 600ms ${std}, filter 600ms ${std}`;
        });
      }, 3 * C + 1000);
    };

    const cascadeFinal = () => {
      resetCascade();
      each((m, { el, em, fill, track, glow }) => {
        const short = m.card.rank < CV_SHORTLIST_SIZE;
        el.style.transition = "none";
        m.x = m.card.gx;
        m.y = m.card.gy;
        m.r = 0;
        m.mx = m.my = 0;
        m.ms = 1;
        m.s = m.win ? 1.8 : short ? 1.14 : 1;
        el.style.transform = tf(m);
        el.style.zIndex = String(m.win ? 400 : short ? 300 - m.card.rank : 200 - m.card.rank);
        el.style.opacity = short ? "1" : "0.13";
        el.style.filter = short ? "none" : "grayscale(1)";
        fill.style.transition = "none";
        fill.style.transform = `scaleX(${m.card.fill})`;
        glow.style.transition = "none";
        glow.style.opacity = short ? "1" : "0";
        em.style.transition = "none";
        em.style.opacity = m.win ? "1" : "0";
        fill.style.background = m.win ? "var(--color-cream)" : "var(--color-coral)";
        track.style.background = m.win ? "var(--color-cream-35)" : "var(--color-line)";
      });
      pill.style.opacity = "1";
      pill.style.transform = "translate(-50%,-120%) scale(1)";
      setPhase(3, true);
      done = true;
    };

    // After the sequence, cards near a mouse pointer lean towards it.
    const magnet = (ev: PointerEvent | null) => {
      const r = field.getBoundingClientRect();
      const cw = r.width / FIELD.W;
      const ch = (cw * 4) / 3;
      const R = cw * 3.2;
      const px = ev ? ev.clientX - r.left : -1e4;
      const py = ev ? ev.clientY - r.top : -1e4;
      each((m, { el }) => {
        const dx = px - (m.x + 0.5) * cw;
        const dy = py - (m.y + 0.5) * ch;
        const d = Math.hypot(dx, dy);
        if (d < R) {
          const f = 1 - d / R;
          m.mx = dx * f * 0.3;
          m.my = dy * f * 0.3;
          m.ms = 1 + (m.win ? 0.06 : 0.18) * f;
        } else {
          m.mx = 0;
          m.my = 0;
          m.ms = 1;
        }
        el.style.transform = tf(m);
      });
    };
    let mraf = 0;
    let last: PointerEvent | null = null;
    const onMove = (ev: PointerEvent) => {
      if (!done || reduced) return;
      last = ev;
      if (mraf) return;
      mraf = requestAnimationFrame(() => {
        mraf = 0;
        magnet(last);
      });
    };
    const onLeave = () => {
      if (done && !reduced) magnet(null);
    };
    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerleave", onLeave);

    if (reduced) cascadeFinal();
    else later(playCascade, startDelay);

    return () => {
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
      cancelAnimationFrame(mraf);
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerleave", onLeave);
    };
  }, [startDelay, setPhase, resetSegments]);

  const wf = 100 / FIELD.W;
  const hf = 100 / FIELD.H;
  const cx = WIN ? (WIN.gx + 0.5) * wf : 50;
  const cy = WIN ? (WIN.gy + 0.5) * hf : 50;
  const pillTop = WIN ? (WIN.gy + 0.5 - 0.9) * hf : 50;

  return (
    <div ref={fieldRef} role="img" aria-label={cascade.label} className={styles.field}>
      <div ref={beamRef} className={styles.beam} />
      <div ref={ringRef} className={styles.ring} style={{ left: `${cx}%`, top: `${cy}%` }} />
      <div ref={pulseRef} className={styles.pulse} style={{ left: `${cx}%`, top: `${cy}%` }} />
      <div ref={pillRef} className={styles.pill} style={{ left: `${cx}%`, top: `${pillTop}%` }}>
        <span className={styles.pillDot} />
        {cascade.placed}
      </div>
      {FIELD.cards.map((c, i) => (
        <div
          key={i}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          aria-hidden="true"
          className={styles.cv}
          style={{
            width: `${wf}%`,
            // Before the fall: above the field, out of sight.
            transform: tf({ x: c.px, y: -c.drop - 1, r: c.rot, s: 1, mx: 0, my: 0, ms: 1 }),
            zIndex: Math.round(c.delay),
          }}
        >
          <div className={styles.paper} />
          <div data-em="" className={styles.em} />
          <div className={styles.avatar} style={{ background: c.tone }} />
          <div className={styles.line1} style={{ width: `${c.l1}%` }} />
          <div className={styles.line2} style={{ width: `${c.l2}%` }} />
          <div data-track="" className={styles.track}>
            <div data-fill="" className={styles.fill} />
          </div>
          <div data-glow="" className={styles.glow} />
        </div>
      ))}
    </div>
  );
}
