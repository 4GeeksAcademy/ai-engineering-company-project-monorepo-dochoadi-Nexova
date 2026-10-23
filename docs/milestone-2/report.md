# Milestone 2 — Report

Deliverable report for the instructor on Milestone 2 ("Your Company's Public Website") of the Nexova Solutions monorepo, branch `milestone-your-companys-public-website`. The evidence for each row is in the [evaluation matrix](./evaluation.md), how to re-check it in the [verification guide](./verification.md), the learning recap in [recap.md](./recap.md), and the step-by-step notes in the [learning log](./learning-log.md).

## Summary

The milestone built Nexova's public website from the official [`BRIEFING.md`](../../BRIEFING.md), at the repository root as the brief requires:

- **Pages:** `index.html` (landing) and `application.html` (talent pool form), with their Spanish twins in `es/`. Plain HTML, compiled Tailwind CSS 4.3.3 and vanilla JavaScript (`validation.js`, `motion.js`).
- **Content:** the briefing's sections, order and texts verbatim, plus three extra sections from the Milestone 1 landing page (marquee, process, offices) that use briefing facts only.
- **Form:** the 11 briefing fields, real-time validation with the briefing's exact messages in both languages, and a simulated submission (no data leaves the browser).
- **Quality:**
  - WCAG 2.2 AA (`a11y-gate` 72 PASS);
  - a security gate (7 PASS, no `/security-review` findings);
  - Lighthouse 100/100/100/92 locally and Performance 95–100 on the public Codespaces URL.
- **Serving:** `pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false -c-1`. Only a `dist/` copy of the public files is served.

| Group | Criteria | Status |
| --- | --- | --- |
| HTML structure and semantics | E1–E5 | Met |
| Responsive design and Tailwind | E6–E13 | Met (E13 on the public URL with Lighthouse) |
| Accessibility | E14–E18 | Met |
| Form and validation | E19–E25 | Met |
| Context adherence | E26–E30 | Met (E26 re-verified after the S11 two-column fix) |

`pnpm lint`, `pnpm typecheck`, `pnpm build` and `pnpm test` pass: 15 package tests and 15 site tests.

## Evaluation criteria and evidence

| ID | Criterion | Evidence |
| --- | --- | --- |
| E1 | HTML uses appropriate semantic tags | Landmarks, labelled sections, `article`, `address`, `figure`, `fieldset`/`legend` on all four pages; no redundant roles. |
| E2 | Images have descriptive `alt` | Logo `alt="Nexova"`, office photos with descriptive `alt` in each language; the decorative illustration is `aria-hidden`. |
| E3 | Labels associated with inputs | 14 `<label for>` per form page; `a11y-gate` criterion 4. |
| E4 | Schema.org present and correct | The briefing's Organization JSON-LD, parsed and compared field by field on both landing pages. |
| E5 | Logical document structure | One `h1`, ordered `h2`/`h3`; `a11y-gate` criterion 2. |
| E6 | Fully responsive | 320, 375, 768, 1024, 1280 px and 200 % zoom, no horizontal scroll; `screenshots/landing-*`, `form-*`. |
| E7 | Documented npx command for Codespaces | Root `README.md`, "Public website". |
| E8 | Mobile-first | Base classes for phones, breakpoints add columns. |
| E9 | Tailwind utility classes | 0 `style="` on all pages; `styles.css` is the compiled output. |
| E10 | Breakpoints used appropriately | `sm:`, `md:`, `lg:` on all pages (services 3 columns and "Why Nexova" 2 columns from `md:`). |
| E11 | No unnecessary custom CSS | `tailwind.css`: directives, the theme mapping and two commented blocks. |
| E12 | Visually coherent and professional | Side-by-side comparison with Milestone 1 (`screenshots/consistency-*`). |
| E13 | Performance ≥ 80 | Lighthouse 13.5.0 on the public URL: home 99 mobile / 100 desktop, form 95 / 100 ([`performance.md`](./performance.md)). |
| E14 | Keyboard accessible | Full keyboard walk-through, skip link, phone menu, Pause/Replay, 3 px focus ring. |
| E15 | Useful ARIA | `aria-current`, `aria-describedby`, `aria-invalid`, live regions, `aria-pressed`. |
| E16 | Contrast | Computed contrast of every text (4.5:1) and form border (3:1); axe 0 serious/critical. |
| E17 | Logical navigation | Same header and footer on every page; the language switcher opens the twin page. |
| E18 | Errors announced | Focused `role="alert"` summary, field errors linked by `aria-describedby`. |
| E19 | All briefing fields | The 11 fields on both form pages. |
| E20 | Appropriate input types | As in the briefing table. |
| E21 | Validation works | 15 `node:test` tests + browser checks in both languages. |
| E22 | Specific messages | Every message equals the briefing text (tests parse both briefings). |
| E23 | Submission prevented with errors | `preventDefault()` always; errors block the simulated submission. |
| E24 | Clear visual states | Focus ring, error icon + border, success panel (`screenshots/form-*-errors`, `-success`). |
| E25 | Clear button works | Resets fields, errors, counter and success; focus on the first field. |
| E26 | Reflects the company type and sector | Briefing sections in order and verbatim; "Why Nexova" in 2 columns (fixed in S11). |
| E27 | Experience and advantages | The four points (12 years, Spain and United States, +500, sector specialization). |
| E28 | Fields exactly as the briefing | Types, options and required flags compared one by one. |
| E29 | Domain validation rules | The six specific validations (email, phone, years, LinkedIn, 500-character counter, data policy). |
| E30 | Tone of an established company | Briefing copy plus the Milestone 1 tone; no invented figures, clients or testimonials. |

## Deliverables and standards

| Group | Items | Status |
| --- | --- | --- |
| Landing | L1–L15 | Met (L15: the public Codespaces URL in `performance.md`). |
| Application form | A1–A15 | Met. |
| Submission | S1–S6 | S1, S3–S6 met; S2 (the URL in the PR description) is done in the pull request. |
| Standards | P1 CISO gate, P2 accessibility gate, P3 memory bank, P4 recap, P5 bilingual | Met (P3 updated in every step S01–S11). |

## Decisions (and the deliberate differences from the briefing)

- **Site at the root, plain files.** As the brief requires; the Next.js apps stay in `uis/`.
- **Bilingual.** English at the root, Spanish in `es/`, the same field ids and values, and messages verbatim from each briefing.
- **Content differences**, only those in [`content-decisions.md`](./content-decisions.md):
  - "Spanish and US markets" instead of "Latin American market";
  - plain URLs in the JSON-LD;
  - the Spanish option labels;
  - the extra M1 sections (marquee, process, offices) with briefing facts only;
  - the office photos (permission confirmed);
  - the decorative "72" CVs of the hero illustration;
  - the two-column "Why Nexova".
- **Security:**
  - only the `dist/` allowlist is served (SEC-1);
  - a strict per-page CSP (`connect-src 'none'`, so SEO 92 locally is accepted);
  - no data leaves the browser;
  - a self-hosted font;
  - no caching plus version tags;
  - SEC-2 accepted, SEC-4 fixed.
- **Motion.** The Milestone 1 landing experience, accessible: progressive enhancement, reduced motion, one pause control, no dimmed text at rest.
- **Performance evidence.** Lighthouse on the public URL, because PageSpeed Insights only reached GitHub's development-port warning page (`screenshots/pagespeed-codespaces-warning-page.png`).

## Milestone 1 feedback applied

From [`docs/milestone-1/instructor-feedback.md`](../milestone-1/instructor-feedback.md):

| Feedback | Action |
| --- | --- |
| Use the branch name the brief asks for | Branch `milestone-your-companys-public-website` (the milestone title in lowercase with hyphens); rule in `.agents/rules/git-workflow.md`. |
| Put the briefing in `BRIEFING.md` | The official file at the root, unmodified (SHA-256 checked), with the Spanish copy in `docs/milestone-2/BRIEFING.es.md`. |
| Do not merge your own PR before validation | `AGENTS.md` and `git-workflow.md`: the coding agent never merges; the PR is merged only after the instructor's recorded approval, with a merge commit. |

## Problems found and fixed

The problems are listed in [recap.md](./recap.md), with symptom, cause, fix and lesson:
- **Security:** SEC-1 (dotfiles served), the gate's false positives, stale cached HTML.
- **Accessibility and layout:** the Submit button after success, the `<details>` menu and the gate, forced-colors buttons, the "Why Nexova" layout.
- **Performance:** the long animation task, the render-blocking font.

## Open questions

- Milestone 1 findings not fixed here: SEC-3, SEC-5, SEC-6, SEC-7, A11Y-1 to A11Y-6 (planned: M1 hardening, needs approval).
- SEC-2 dev-only advisory: review when a fix is published.
- Office photos: a licence and consent record before any real launch.
- Set the Codespaces port 8080 back to Private after the review.
- Carried over from Milestone 1: the Sales manager (Megan Clarke or Marcos Ibáñez), backoffice authentication, the real contact email, the open technical decisions.

Academic project for 4Geeks Academy: fictional company, no real data.
