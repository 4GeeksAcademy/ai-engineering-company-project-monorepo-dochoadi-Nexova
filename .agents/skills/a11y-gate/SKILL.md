---
name: a11y-gate
description: Accessibility gate (WCAG 2.2 AA). Check the public site pages with axe-core and Playwright at mobile, tablet and desktop widths, plus structure, labels, keyboard walk-through, reflow, reduced motion and a forced-colors screenshot. Use before every pull request and at the end of every milestone.
---

## Goal

Prove, with a command, that every public site page meets the project's accessibility rule (`.agents/rules/accessibility.md`, WCAG 2.2 AA) before it reaches a pull request.

## When to use it

- Before every pull request (pre-commit workflow in `AGENTS.md`, together with `security-gate`).
- At the end of every milestone, before the `milestone-recap` skill.
- After any change to a site page, `validation.js` or the Tailwind styles.

## Inputs

| Name | Source | Format |
| --- | --- | --- |
| `n` | the milestone number (e.g. `2`) | integer, first argument of `check.sh` |
| `pages` | `index.html`, `application.html`, `es/index.html`, `es/application.html` (those that exist) | HTML served by `npx http-server@14.1.1` on `127.0.0.1:8099` |
| `tools` | Playwright for Python with Chromium (`.devcontainer/post-create.sh`) and `axe-playwright-python==0.1.8` (`requirements.txt`, bundles axe-core 4.12.1) | Python packages |

## Steps

1. If needed, install the Python tool: `pip install --user -r .agents/skills/a11y-gate/requirements.txt`.
2. Run `bash .agents/skills/a11y-gate/check.sh <n>` from the repo root. It starts the static server on port 8099, runs `a11y_check.py` on each existing page at 375, 768 and 1280 px, and stops the server.
3. For every `FAIL`, fix it if it belongs to the current step; otherwise record it as a finding (severity, file, description, proposed fix, effort) and ask the developer.
4. Open the forced-colors screenshots in `docs/milestone-<n>/a11y/` and check that focus rings, borders, buttons and error states stay visible.
5. Write or update `docs/milestone-<n>/accessibility.md`: date, the `check.sh` output, the manual review of the screenshots and the findings table.
6. Other targets (e.g. the Next.js apps): `python3 .agents/skills/a11y-gate/a11y_check.py --base http://localhost:3000 --pages / --axe-only`.

## Output

- `docs/milestone-<n>/accessibility.md`, with the `check.sh` output, the manual screenshot review and the findings.
- Forced-colors screenshots in `docs/milestone-<n>/a11y/`.
- The `check.sh` output, pasted in the PR description.

## Acceptance criteria

Each criterion is checked by `check.sh` (through `a11y_check.py`) for each existing page; criteria 1–5 at 375, 768 and 1280 px. Every line prints `PASS`, `FAIL` or `SKIP` (`SKIP` when a page does not exist yet); the script exits 0 only when there is no `FAIL`.

1. axe-core reports 0 violations of impact `serious` or `critical` (minor and moderate ones are listed for review).
2. `<html lang>` is set and correct (`en` at the root, `es` under `es/`); exactly one `h1`; no skipped heading levels.
3. Every `img` has a non-empty `alt`, or `alt=""` with `aria-hidden="true"` (or `role="presentation"`) when it is decorative.
4. Every form control has an associated label (`<label for>`, a wrapping label or `aria-labelledby`/`aria-label`).
5. Keyboard walk-through: pressing Tab reaches every interactive element in DOM order (one stop per radio group), and each shows a visible focus style (a non-`none` outline or a box-shadow).
6. Reflow: no horizontal scroll at 320 px wide.
7. With `prefers-reduced-motion: reduce`, no CSS animation is running.
8. A full-page screenshot with `forced-colors: active` is saved to `docs/milestone-<n>/a11y/` for manual review.

## Out of scope

- Manual screen-reader testing (NVDA, VoiceOver) and text-resize to 200 %: recommended before the PR and recorded in `accessibility.md`, but not automated here.
- Colour-contrast decisions beyond what axe-core detects (e.g. text over images).
- Fixing findings in code outside the current step: they are reported, and the developer approves fixes separately.
