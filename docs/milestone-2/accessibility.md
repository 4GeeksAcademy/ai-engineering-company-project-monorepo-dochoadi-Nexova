# Milestone 2 — Accessibility (WCAG 2.2 AA gate)

Results of the `a11y-gate` skill (`.agents/skills/a11y-gate/`) for Milestone 2. Rule: [`.agents/rules/accessibility.md`](../../.agents/rules/accessibility.md). Findings are reported here and fixed only after the developer approves them.

## Gate on the public site

Run on 2026-10-23 (S02): `bash .agents/skills/a11y-gate/check.sh 2` prints `SKIP` for the 8 criteria of each of the 4 pages (`index.html`, `application.html`, `es/index.html`, `es/application.html`: none exists yet) and `a11y-gate passed (no FAIL; no site pages yet)`, `exit=0`. The pages are built from S04 on; the gate is re-run in S07.

## Baseline: Milestone 1

Run on 2026-10-23 (S02) against the production builds of the two Next.js apps (`pnpm build`, then `start`): `uis/website` on `localhost:3000` and `uis/backoffice` on `localhost:3001`, both on Next.js 16.4.1. Tools: Playwright Chromium and `axe-playwright-python` 0.1.8 (axe-core 4.12.1).

### axe part of the gate (as the page loads)

```text
$ python3 .agents/skills/a11y-gate/a11y_check.py --base http://localhost:3000 --pages / --axe-only
FAIL [1] / @375px: axe: 0 serious or critical violations — color-contrast (serious, 38 nodes)
FAIL [1] / @768px: axe: 0 serious or critical violations — color-contrast (serious, 38 nodes)
FAIL [1] / @1280px: axe: 0 serious or critical violations — color-contrast (serious, 38 nodes)
$ python3 .agents/skills/a11y-gate/a11y_check.py --base http://localhost:3001 --pages / --axe-only
PASS [1] / @375px: axe: 0 serious or critical violations
FAIL [1] / @768px: axe: 0 serious or critical violations — color-contrast (serious, 1 nodes)
FAIL [1] / @1280px: axe: 0 serious or critical violations — color-contrast (serious, 1 nodes)
```

Every violation is `color-contrast`, and every one is an in-between animation state, not a final colour:

- After scrolling the whole page and waiting 3 s, axe reports **0 violations** on both apps at 375 and 1280 px.
- With `prefers-reduced-motion: reduce`, axe reports **0 violations** on both apps as the page loads.

So the brand colours pass AA; the problems are the dimmed "not yet revealed" states (A11Y-1, A11Y-2).

### Other gate criteria (informative)

The full `a11y_check.py` run (criteria 2–7, without `--axe-only`) passes on both apps: `lang`, one `h1` and heading order; image `alt`s (2 images on the website); form labels (no controls); keyboard walk-through with a visible focus style (website 22 elements at 375/768 px and 26 at 1280 px; backoffice 14 and 22); no horizontal scroll at 320 px; no running CSS animations with reduced motion.

### Findings

| ID | Severity | File | Description | Proposed fix | Effort |
| --- | --- | --- | --- | --- | --- |
| A11Y-1 | Medium | `uis/website/components/Process.module.css`, `uis/website/components/HumanAndAi.module.css` (statement words) | Scroll-linked dim states: the process steps (number, title and body at 1.6–1.9:1) and the word-by-word statement (1.3–1.8:1) stay below AA until the reader scrolls past them. Someone who stops mid-section, or uses a screen magnifier, reads them at that contrast. Fine after a full scroll and with reduced motion. | Raise the dimmed state to at least 3:1 for large text and 4.5:1 for body text (start the reveal from a readable colour), or only dim content that is not yet in the viewport. | S (1–2 h) |
| A11Y-2 | Low | `uis/website/components/RoleTicker.module.css`, `uis/website/components/Hero.module.css`, `uis/backoffice/app/globals.css:88` (`.sec-note`) | Transient contrast during fades: the role ticker's cross-fade (down to 1.15:1 for a moment), the hero lede's fade-in (3.47:1 in the first second) and the backoffice section notes' fade-in (4.04:1). Each settles above AA. | No change needed for users; if the gate is run on these apps, wait for animations to finish (or run with reduced motion) before axe. | XS |
| A11Y-3 | Medium | `uis/backoffice/components/HeadcountKpi.tsx` | Known item: the headcount bar segments are focusable targets 12 px tall; the Human Resources segment is 6 px wide at 1280 px and 9 px at 375 px (Technology 9/14 px, Corporate Training 18/29 px). Below WCAG 2.2 "Target size (minimum)" (24 × 24 px) and the project's 44 px rule. | Keep the bar decorative (`aria-hidden`) and make a legend list below it the focus targets (one ≥ 44 px row per team with the same tooltip text). | S–M (2–3 h) |
| A11Y-4 | Low | `uis/backoffice/components/WorkByType.module.css` | The four "needs by type" filter buttons are 40 px tall: they pass WCAG (24 px) but not the project's 44 px rule. | `min-height: 44px`. | XS (10 min) |
| A11Y-5 | Medium | `uis/website/components/Marquee.module.css:15`, `Marquee.tsx` | Known item: the marquee scrolls for ever (42 s loop) next to other content and only pauses on hover. It is `aria-hidden`, which hides it from screen readers but not from sighted users; WCAG 2.2.2 "Pause, Stop, Hide" asks for a way to stop moving content that lasts more than 5 s (keyboard and touch included). It already stops with reduced motion. | Add a visible pause/play button, or stop the loop after a few passes. | S (1 h) |
| A11Y-6 | Low | `uis/website/components/CvCascade.module.css:101`, `uis/website/components/PulseDot.module.css:17` | Known item (long animations): the CV-cascade pulse (2.4 s) and the pulse dot ripple (1.8 s) loop for ever. Decorative and stopped with reduced motion, but the same WCAG 2.2.2 concern applies. | Stop each after a few cycles, or tie them to the marquee pause control. | XS–S (30–60 min) |
| A11Y-7 | Info | `uis/backoffice` (needs lists) | Known item: dimmed needs. Already fixed in M1-S12 (transparent fill and dashed outline instead of 35 % opacity); axe finds no contrast problem once the page settles. | None. | — |

Not automated here and recommended before the Milestone 2 PR: a manual screen-reader pass (NVDA or VoiceOver), text resized to 200 %, and the forced-colors screenshots that the gate saves for the new site.
