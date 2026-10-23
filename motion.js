/*
 * Nexova site motion: a port of the Milestone 1 landing behaviour (uis/website lib/motion.ts and components).
 * The HTML already shows every final state; this script animates it with the Web Animations API or Tailwind
 * classes. Reduced motion shows final states at once; one pause control stops all ongoing motion (WCAG 2.2.2).
 */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const es = (root.lang || "en").slice(0, 2) === "es";
  const STORE = "nexova-motion-paused";

  // Helpers (lib/motion.ts).
  const all = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const token = (name) => getComputedStyle(root).getPropertyValue(name).trim() || "ease-out";
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  };
  const observeOnce = (el, fn, threshold = 0.15) => {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    }, { threshold });
    io.observe(el);
  };
  const onScrollFrame = (fn) => {
    let raf = 0;
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; fn(); });
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    fn();
  };
  // Paused animations that play once the trigger scrolls into view, then hand back to the CSS.
  const onEnter = (trigger, anims, threshold) => {
    anims.forEach((a) => a.pause());
    observeOnce(trigger, () => anims.forEach((a) => {
      a.play();
      a.finished.then(() => a.cancel(), () => {});
    }), threshold);
  };

  // Header: a soft shadow once the page scrolls.
  const header = document.querySelector("body > header");
  if (header) onScrollFrame(() => header.classList.toggle("shadow-brand-header", scrollY > 8));

  // One pause control for everything that moves or updates by itself, remembered between visits.
  let paused = false;
  try { paused = localStorage.getItem(STORE) === "1"; } catch (e) { /* storage blocked */ }
  const pausables = [];
  const toggle = document.querySelector("[data-motion-toggle]");
  const renderToggle = () => {
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.textContent = toggle.getAttribute(paused ? "data-label-play" : "data-label-pause");
  };
  const setPaused = (next) => {
    paused = next;
    try { localStorage.setItem(STORE, paused ? "1" : "0"); } catch (e) { /* storage blocked: this page only */ }
    pausables.forEach((p) => (paused ? p.pause() : p.play()));
    renderToggle();
  };
  if (toggle) {
    toggle.classList.remove("hidden");
    renderToggle();
    toggle.addEventListener("click", () => setPaused(!paused));
  }

  // Reveals, count-ups, the process line and the office photos run once, only for content below the fold.
  if (!reduced) {
    all("[data-reveal]").filter((el) => !inView(el)).forEach((el) => onEnter(el, [el.animate(
      [{ opacity: 0, transform: "translateY(32px)" }, { opacity: 1, transform: "none" }],
      { duration: 700, delay: Number(el.dataset.reveal) * 100, easing: token("--ease-out"), fill: "both" })]));

    all("[data-count]").filter((el) => !inView(el)).forEach((el) => {
      const to = Number(el.dataset.count);
      el.textContent = "0";
      observeOnce(el, () => {
        const t0 = performance.now();
        const frame = (now) => {
          const k = Math.min(1, (now - t0) / 1300);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
    });

    all("[data-process-line]").filter((el) => !inView(el)).forEach((line) => onEnter(line.parentElement, [line.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 1200, easing: token("--ease-in-out"), fill: "both" })]));

    // Bottom-up clip-path reveal. Observe the grid, never the clipped figure (the M1 fix).
    all("[data-photos]").forEach((grid) => {
      const figures = all("figure", grid).filter((f) => !inView(f));
      if (figures.length) onEnter(grid, figures.map((f) => f.animate(
        [{ clipPath: "inset(100% 0 0 0 round 28px)" }, { clipPath: "inset(0% 0 0 0 round 28px)" }],
        { duration: 1000, easing: token("--ease-in-out"), fill: "both" })), 0.05);
    });
  }

  // Marquee: an endless slide that pauses on hover, on focus and with the pause control.
  all("[data-marquee]").forEach((wrap) => {
    const track = wrap.firstElementChild;
    if (!track || reduced) return;
    const anim = track.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: 42000, iterations: Infinity, easing: "linear" });
    let hover = false;
    const sync = () => (paused || hover ? anim.pause() : anim.play());
    ["mouseenter", "focusin"].forEach((t) => wrap.addEventListener(t, () => { hover = true; sync(); }));
    ["mouseleave", "focusout"].forEach((t) => wrap.addEventListener(t, () => { hover = false; sync(); }));
    pausables.push({ pause: sync, play: sync });
    sync();
  });

  // Office clocks: local time in Valencia and Miami, refreshed at the start of each minute.
  const clocks = all("[data-clock]");
  const gap = document.querySelector("[data-hours-apart]");
  let clockTimer = 0;
  const wall = (now, tz) => new Date(new Date(now).toLocaleString("en-US", { timeZone: tz })).getTime();
  const renderClocks = () => {
    const now = Date.now();
    clocks.forEach((c) => {
      try {
        c.textContent = new Intl.DateTimeFormat("en-GB", { timeZone: c.dataset.clock, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
        c.classList.remove("hidden");
      } catch (e) { c.classList.add("hidden"); }
    });
    if (gap) {
      try {
        const [a, b] = gap.dataset.hoursApart.split(" ");
        gap.textContent = String(Math.round(Math.abs(wall(now, a) - wall(now, b)) / 3.6e6));
      } catch (e) { /* keep the static value */ }
    }
  };
  const startClocks = () => {
    if (clockTimer) return;
    const tick = () => {
      renderClocks();
      clockTimer = setTimeout(tick, 60000 - (Date.now() % 60000));
    };
    clockTimer = setTimeout(tick, 60000 - (Date.now() % 60000));
  };
  if (clocks.length || gap) {
    renderClocks();
    pausables.push({ pause: () => { clearTimeout(clockTimer); clockTimer = 0; }, play: () => { renderClocks(); startClocks(); } });
    if (!paused) startClocks();
  }

  // The CV cascade (CvCascade + cvField): 72 CVs fall, are scored, sort, five are shortlisted, one is placed.
  const fig = document.querySelector("[data-cascade]");
  if (fig) cascade(fig);

  function cvField(seed) {
    // The design's seeded PRNG and maths, in the same call order: the same seed always gives the same field.
    let s = seed >>> 0;
    const rnd = () => {
      s |= 0; s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const COLS = 12, ROWS = 6, G = 0.18, XU = 1 + G, YU = 1 + G * 0.75;
    const W = COLS + G * (COLS - 1), H = ROWS + G * 0.75 * (ROWS - 1);
    const cells = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const dx = c * XU + 0.5 - W / 2, dy = ((r * YU + 0.5 - H / 2) * 4) / 3;
        cells.push({ c, r, d: dx * dx + dy * dy, k: r * COLS + c });
      }
    }
    cells.sort((a, b) => a.d - b.d || a.k - b.k);
    const g3 = () => rnd() + rnd() + rnd() - 1.5;
    const cards = [];
    for (let i = 0; i < 72; i++) {
      cards.push({
        score: rnd(),
        px: Math.max(0, Math.min(W - 1, W / 2 - 0.5 + g3() * 5.4)),
        py: Math.max(0, Math.min(H - 1, H / 2 - 0.5 + g3() * 2.6)),
        rot: (rnd() * 2 - 1) * 15, delay: rnd() * 900, drop: 1.4 + rnd() * 1.6,
        tone: Math.floor(rnd() * 4), l1: 58 + rnd() * 26, l2: 34 + rnd() * 24,
      });
    }
    cards.map((_, j) => j).sort((a, b) => cards[b].score - cards[a].score).forEach((ci, rank) => {
      const card = cards[ci], cell = cells[rank];
      Object.assign(card, { rank, gx: cell.c * XU, gy: cell.r * YU, fill: 0.98 - (rank / 71) * 0.72 });
    });
    return { cards, W };
  }

  function cascade(fig) {
    const q = (name) => fig.querySelector(`[data-cascade-${name}]`);
    const field = q("field"), label = q("phase"), beam = q("beam"), ring = q("ring"), pulse = q("pulse"), pill = q("pill");
    const segs = all("[data-cascade-seg]", fig), segLabels = all("[data-cascade-seg-label]", fig);
    const phases = es ? ["Briefing", "Cribado", "Entrevistas", "Incorporación"] : ["Briefing", "Screening", "Interviews", "Placement"];
    const C = 2400;
    const { cards, W } = cvField(2011);
    const win = cards.find((c) => c.rank === 0);
    const TONES = ["bg-brand-sage", "bg-brand-sage-tone", "bg-brand-tan", "bg-brand-green-mid"];
    const L1 = ["w-[60%]", "w-[66%]", "w-[72%]", "w-[78%]", "w-[84%]"];
    const L2 = ["w-[36%]", "w-[42%]", "w-[48%]", "w-[54%]"];
    let anims = [], cues = [], master = null, raf = 0, built = false;

    const div = (cls, parent) => {
      const n = document.createElement("div");
      n.className = cls;
      parent.appendChild(n);
      return n;
    };
    const pick = (list, v, lo, hi) => list[Math.round(((v - lo) / (hi - lo)) * (list.length - 1))];
    const tf = (x, y, r, s) => `translate(${x * 100}%,${y * 100}%) rotate(${r}deg) scale(${s})`;
    const add = (target, frames, opts) => {
      const a = target.animate(frames, opts);
      anims.push(a);
      return a;
    };

    // Cards are built when the cascade first runs (the static shortlist shows until then), in fall order.
    const build = () => {
      if (built) return;
      built = true;
      q("fallback")?.remove();
      cards.slice().sort((a, b) => a.delay - b.delay).forEach((c) => {
        c.el = div("absolute left-0 top-0 aspect-[3/4] w-[7.153%]", field);
        div("absolute inset-0 rounded-brand-cv bg-brand-cream shadow-brand-cv", c.el);
        c.em = div("absolute inset-0 rounded-brand-cv bg-brand-coral opacity-0", c.el);
        div("absolute left-[14%] top-[9%] aspect-square w-[36%] rounded-full " + TONES[c.tone], c.el);
        div("absolute left-[14%] top-1/2 h-[5.5%] rounded-[2px] bg-brand-tan-line " + pick(L1, c.l1, 58, 84), c.el);
        div("absolute left-[14%] top-[62%] h-[5.5%] rounded-[2px] bg-brand-line " + pick(L2, c.l2, 34, 58), c.el);
        c.track = div("absolute left-[14%] top-[79%] h-[6%] w-[72%] overflow-hidden rounded-[2px] bg-brand-line", c.el);
        c.bar = div("h-full w-full origin-left bg-brand-coral", c.track);
        c.glow = div("absolute -inset-[3px] rounded-[5px] border-[1.5px] border-brand-coral-light opacity-0 shadow-brand-cv-glow", c.el);
      });
    };
    const setPhase = (n) => {
      label.textContent = phases[n];
      segLabels.forEach((l, i) => {
        l.classList.toggle("text-brand-cream", i === n);
        l.classList.toggle("text-brand-sage", i !== n);
      });
    };
    const winColours = (on) => {
      win.bar.classList.toggle("bg-brand-cream", on);
      win.bar.classList.toggle("bg-brand-coral", !on);
      win.track.classList.toggle("bg-brand-cream/35", on);
      win.track.classList.toggle("bg-brand-line", !on);
    };
    const clear = () => {
      anims.forEach((a) => a.cancel());
      anims = [];
      cues = [];
      cancelAnimationFrame(raf);
      master = null;
    };

    // The final "placed" frame at once (reduced motion, or paused at load).
    const finalFrame = () => {
      build();
      clear();
      const o = { duration: 1, fill: "forwards" };
      cards.forEach((c) => {
        const short = c.rank < 5, w = c === win;
        add(c.el, [{ transform: tf(c.gx, c.gy, 0, w ? 1.8 : short ? 1.14 : 1), opacity: short ? 1 : 0.13, zIndex: w ? 400 : short ? 300 - c.rank : 200 - c.rank }], o);
        add(c.bar, [{ transform: `scaleX(${c.fill})` }], o);
        add(c.glow, [{ opacity: short ? 1 : 0 }], o);
        add(c.em, [{ opacity: w ? 1 : 0 }], o);
      });
      add(pill, [{ opacity: 1 }], o);
      winColours(true);
      setPhase(3);
    };

    // The whole timeline is scheduled at once with delays, so pausing every animation pauses the story.
    const play = () => {
      build();
      clear();
      winColours(false);
      setPhase(0);
      const std = token("--ease-out"), inOut = token("--ease-in-out"), drop = token("--ease-drop");
      const t = (duration, delay, easing, fill) => ({ duration, delay, easing, fill });
      master = add(field, [{ opacity: 1 }, { opacity: 1 }], { duration: 3 * C + 1600 });
      cards.forEach((c) => {
        const short = c.rank < 5, w = c === win;
        const pile = tf(c.px, c.py, c.rot, 1), grid = tf(c.gx, c.gy, 0, 1), lifted = tf(c.gx, c.gy, 0, 1.14);
        add(c.el, [{ transform: tf(c.px, -c.drop - 1, c.rot, 1) }, { transform: pile }], t(760, c.delay, drop, "both"));
        add(c.bar, [{ transform: "scaleX(0)" }, { transform: `scaleX(${c.fill})` }], t(450, C + ((c.px + 0.5) / W) * 1300, std, "both"));
        const z = 200 - c.rank;
        add(c.el, [{ transform: pile, zIndex: z }, { transform: grid, zIndex: z }], t(800, 1.5 * C + c.rank * 9, inOut, "forwards"));
        if (short) {
          add(c.el, [{ transform: grid, zIndex: z + 100 }, { transform: lifted, zIndex: z + 100 }], t(600, 2 * C + c.rank * 60, std, "forwards"));
          add(c.glow, [{ opacity: 0 }, { opacity: 1 }], t(500, 2 * C, std, "both"));
        } else {
          add(c.el, [{ opacity: 1 }, { opacity: 0.13 }], t(600, 2 * C, std, "forwards"));
        }
        if (w) {
          add(c.el, [{ transform: lifted, zIndex: 400 }, { transform: tf(c.gx, c.gy, 0, 1.8), zIndex: 400 }], t(900, 3 * C, token("--ease-place"), "forwards"));
          add(c.em, [{ opacity: 0 }, { opacity: 1 }], t(400, 3 * C, std, "both"));
        }
      });
      segs.forEach((s, i) => add(s, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], t(i === 3 ? 700 : C, i * C, "linear", "both")));
      add(beam, [{ transform: "translateX(-100%)", opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.88 }, { transform: "translateX(334%)", opacity: 0 }],
        t(1300, C, "linear"));
      add(ring, [{ transform: "scale(.6)", opacity: 0.95 }, { transform: "scale(5.5)", opacity: 0 }], t(1100, 3 * C, std));
      add(pill, [{ transform: "scale(.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], t(550, 3 * C + 260, token("--ease-pop"), "both"));
      // Three pulses, then still: no endless loop (M1 finding A11Y-6).
      add(pulse, [{ transform: "scale(1)", opacity: 0.9 }, { transform: "scale(1.6)", opacity: 0, offset: 0.8 }, { transform: "scale(1.6)", opacity: 0 }],
        { ...t(2400, 3 * C + 900, std), iterations: 3 });

      // Class changes follow the master animation's clock, so they pause with it.
      cues = [[C, () => setPhase(1)], [2 * C, () => setPhase(2)], [3 * C, () => { setPhase(3); winColours(true); }]];
      const watch = () => {
        const now = master && master.currentTime;
        while (cues.length && now !== null && now >= cues[0][0]) cues.shift()[1]();
        if (master && master.playState !== "finished") raf = requestAnimationFrame(watch);
      };
      raf = requestAnimationFrame(watch);
      if (paused) anims.forEach((a) => a.pause());
    };

    pausables.push({
      pause: () => anims.forEach((a) => a.playState === "running" && a.pause()),
      play: () => anims.forEach((a) => a.playState === "paused" && a.play()),
    });

    if (reduced || paused) finalFrame();
    else if (document.readyState === "complete") setTimeout(play, 450);
    else addEventListener("load", () => setTimeout(play, 450), { once: true });

    const replay = q("replay");
    if (replay && !reduced) {
      replay.classList.remove("hidden");
      replay.addEventListener("click", () => {
        if (paused) setPaused(false);
        play();
      });
    }
  }
})();
