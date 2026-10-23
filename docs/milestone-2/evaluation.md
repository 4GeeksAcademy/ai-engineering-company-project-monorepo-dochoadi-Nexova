# Milestone 2 — Evaluation "Your Company's Public Website"

Evidence matrix for Milestone 2 of the Nexova Solutions monorepo: Nexova's public website (landing page + talent pool application form) built with plain HTML, compiled Tailwind CSS and vanilla JavaScript at the repository root, from the official [`BRIEFING.md`](../../BRIEFING.md). Each row links to the files that prove it and to how to verify it; the step-by-step [verification guide](./verification.md) explains how to re-check every step (S01–S12). Results are filled in as each step is done.

## Planned steps

| Step | What it delivers |
| --- | --- |
| S01 | Branch, official briefing, this matrix, conventions |
| S02 | CISO security gate, accessibility gate, dev MCP servers, Milestone 1 baseline |
| S03 | Compiled Tailwind, the `dist/` server command, bilingual page skeleton |
| S04 | Landing page from the briefing |
| S05 | Application form markup |
| S06 | Form validation with tests |
| S07 | The Milestone 1 landing experience (motion, extra sections) |
| S08 | Quality gates: every criterion re-checked with all four pages finished |
| S09 | Performance evidence on the public Codespaces URL (Lighthouse, because PageSpeed only reached the Codespaces warning page) |
| S10 | Documentation (and the devcontainer: port 8080 and the SEC-4 pins, planned for this step earlier) |
| S11 | Milestone recap and pull request |
| S12 | Merge, only after the instructor's recorded approval |

## A — Evaluation criteria (E1–E30)

Criteria copied verbatim from the brief.

### HTML Structure and Semantics

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E1 | HTML uses appropriate semantic tags instead of generic divs | S04 | `index.html`, `application.html`, `es/index.html`, `es/application.html` | Inspect the landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`); count `div` elements against semantic tags | Met (S08): all four pages (`index.html`, `application.html`, `es/index.html`, `es/application.html`) use `header`, `nav`, `main`, labelled `section`s, `article`, `address`, `figure`, `form` with `fieldset`/`legend`, `ol`/`ul`, `footer`; the remaining `div`s are layout wrappers or `aria-hidden` illustrations; ARIA audit: no redundant roles |
| E2 | All images have descriptive alt attributes | S04 | `index.html`, `application.html`, `es/*.html`, `assets/` | Every `img` has a non-empty, descriptive `alt` (decorative images `alt=""`); automated a11y check | Met (S04): every `img` has a descriptive `alt` in its language (logo `Nexova`; office photos, e.g. "Valencia, City of Arts and Sciences — Nexova headquarters"); the decorative hero illustration is `aria-hidden`; `a11y-gate` criterion 3 PASS on all four pages |
| E3 | Forms use label correctly associated with inputs | S05 | `application.html`, `es/application.html` | Every control has a `<label for>` matching its `id` (radio group inside `fieldset`/`legend`) | Met (S05): both form pages (`application.html`, `es/application.html`): every control has a visible `<label for>` matching its `id` (14 per page: 10 fields + 4 radios); the radios sit in a `fieldset`/`legend`; `a11y-gate` criterion 4 PASS (14 controls) |
| E4 | Schema.org markup is present and correctly implemented | S04 | `index.html`, `es/index.html`, `docs/milestone-2/content-decisions.md` | Extract the `application/ld+json` block and parse it as JSON; compare with the briefing's Organization markup | Met (S04): the briefing's Organization JSON-LD on both landing pages (Spanish page: the Spanish briefing's `description`), angle brackets removed as in `content-decisions.md`; parsed and compared field by field: `schema OK` ×2 |
| E5 | Document structure is logical and hierarchical | S04 | `index.html`, `application.html`, `es/*.html` | One `h1` per page, headings in order with no skipped levels | Met (S08): one `h1` per page, then `h2` and `h3` in order (fieldset legends hold `h2`s); `a11y-gate` criterion 2 PASS on all four pages (`index.html`, `application.html`, `es/index.html`, `es/application.html`) at 375/768/1280 px |

### Responsive Design and Tailwind

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E6 | The site is fully responsive (mobile, tablet, desktop) | S04, S07 | `index.html`, `application.html`, `es/*.html`, `tailwind.css` | Screenshots at 375px, 768px and 1440px; no horizontal scroll | Met (S08): all four pages (`index.html`, `application.html`, `es/index.html`, `es/application.html`) at 320, 375, 768, 1024 and 1280 px and at 200 % zoom: no horizontal scroll, no clipped text (manual audit 54/54); screenshots `landing-*.png`, `form-*.png` |
| E7 | There is a documented and working command, compatible with Codespaces, to run the project locally with npx | S03 | `README.md`, `package.json` (`build:site`, `serve:site`), `scripts/build-site.mjs` | Run the documented `npx http-server` command; `curl` port 8080 returns `200` | Met (S03): `pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false` documented in the root `README.md` ("Public website": what each flag does, port 8080, Codespaces Ports tab) and as `pnpm serve:site`; `/`, `/application.html`, `/es/`, `/es/application.html`, `/styles.css` → `200`; private paths → `404` (SEC-1) |
| E8 | Mobile-first design is used | S04, S07 | `index.html`, `application.html`, `es/*.html` | Base (unprefixed) classes style mobile; larger screens add `sm:`/`md:`/`lg:` overrides | Met (S08): base classes style phones (one column); `sm:`/`md:`/`lg:` only add columns and spacing on every page |
| E9 | All styles use Tailwind utility classes | S03 | `tailwind.css`, `styles.css`, `*.html` | Styling lives in utility classes on the markup; `styles.css` is the compiled Tailwind output | Met (S08): every style is a Tailwind utility class on the markup (0 `style="` on all four pages); `styles.css` is the compiled output; `motion.js`/`validation.js` only toggle Tailwind classes and use the Web Animations API |
| E10 | Tailwind breakpoints (sm:, md:, lg:) are used appropriately | S04, S07 | `index.html`, `application.html`, `es/*.html` | `grep -oE "(sm\|md\|lg):" *.html es/*.html \| sort \| uniq -c` | Met (S08): `sm:`, `md:` and `lg:` used on all four pages (header nav from `md:`, services and form fields from `md:`, hero, process, figures and form layout from `lg:`) |
| E11 | There is no unnecessary custom CSS (only Tailwind) | S03 | `tailwind.css` | `tailwind.css` holds only the Tailwind import and theme tokens; no hand-written rules | Met (S08): `tailwind.css` holds only `@import`, `@source`, `@theme inline` (brand token mapping, no hex values), and two commented blocks Tailwind utilities cannot express (the static-page font variable and the self-hosted `@font-face`); `grep -nE "^\s*[.#a-z].*\{"` finds no hand-written rule |
| E12 | The design is visually coherent and professional | S04, S07 | `index.html`, `application.html`, `es/*.html`, `packages/shared/styles/tokens.css` | Screenshots reviewed against the Nexova identity (green primary buttons, coral accent, Instrument Sans) | Met (S08): the same brand as the M1 apps, checked side by side at 1280 px (`docs/milestone-2/screenshots/consistency-*.png`): identical colours, Instrument Sans, 54 px green pill buttons (16.5 px, 600), card radius, border and fill, footer, and the 3 px coral focus ring; only `brand-*` colours (no default Tailwind palette) |
| E13 | Performance verified with a minimum score of 80 (ideal above 90) using PageSpeed Insights on the public Codespaces URL, or Lighthouse from Chrome DevTools if PageSpeed cannot reach Codespaces | S08, S09 | `docs/milestone-2/screenshots/` | PageSpeed Insights on the public Codespaces URL, or Lighthouse; screenshot of the score | Met (S09, corrected in S10): Lighthouse 13.5.0 on the public Codespaces URL (the brief's fallback: PageSpeed Insights only reached GitHub's development-port warning page, `screenshots/pagespeed-codespaces-warning-page.png`): Performance home 99 mobile / 100 desktop, form 95 mobile / 100 desktop; Accessibility and Best practices 100; details and local comparison in [`performance.md`](./performance.md) |

### Accessibility

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E14 | All interactive elements are keyboard accessible | S07, S08 | `*.html`, `es/*.html`, `validation.js` | Tab through each page: every link, button and control is reachable with a visible focus ring | Met (S08): all four pages (`index.html`, `application.html`, `es/index.html`, `es/application.html`): Tab reaches every link, button and control in visual order (column by column), the skip link moves into `main`, the `<details>` menu opens/closes with Enter/Space, no keyboard traps, a 3 px focus ring on every stop (`a11y-gate` criterion 5; manual audit; Playwright MCP) |
| E15 | ARIA attributes are used where they improve accessibility | S07, S08 | `*.html`, `es/*.html`, `validation.js` | Review `aria-*` usage (`aria-invalid`, `aria-describedby`, live regions, nav labels); no redundant ARIA | Met (S08): ARIA only where it adds something: `aria-current`, `aria-labelledby` on sections, `aria-describedby`/`aria-invalid` on fields, `aria-live` counter, `role="alert"`/`role="status"`, `aria-pressed` on Pause, `aria-hidden` on decorative motion, `role="list"` on styled lists (Safari); no redundant roles |
| E16 | Color contrast meets minimum standards | S08 | `tailwind.css`, `*.html` | Automated contrast check (WCAG 2.2 AA: 4.5:1 text, 3:1 large text and UI) | Met (S08): computed contrast of every visible text on all four pages (`index.html`, `application.html`, `es/index.html`, `es/application.html`) ≥ 4.5:1 (large ≥ 3:1), including the form's error state; field and choice borders ≥ 3:1 (`green-mid`); focus ring coral ≥ 3:1 on cream and paper, cream on dark bands; axe 0 serious/critical; Lighthouse Accessibility 100 |
| E17 | Navigation is logical and predictable | S08 | `*.html`, `es/*.html` | Same header navigation on every page; skip link; focus order follows reading order | Met (S08): the same header (logo, Home / Services / Talent / Contact, language switcher) and footer on every page, in the same place; `aria-current` on the current page; the switcher opens the twin page in the other language; skip link first |
| E18 | Error messages are announced appropriately | S06 | `validation.js`, `application.html`, `es/application.html` | Error text linked with `aria-describedby`, `aria-invalid` set, error summary in a live region | Met (S06): field errors in `#<id>-error` (linked by `aria-describedby`), `aria-invalid="true"` on the control; on submit, a `role="alert"` summary with links to each field takes focus; counter `aria-live`; success `role="status"` takes focus. Verified in the browser (EN and ES) |

### Form and Validation

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E19 | All fields specified in BRIEFING.md are present | S05 | `application.html`, `es/application.html` | The 11 fields of the briefing table are present | Met (S05): the 11 `BRIEFING.md` fields on both pages (`ok` ×11 per page); no extra field |
| E20 | Input types are appropriate for each field | S05 | `application.html`, `es/application.html` | `text`, `email`, `tel`, `select`, `number`, `radio`, `url`, `textarea`, `checkbox` as in the briefing | Met (S05): `text`, `email`, `tel`, `number` (`min=0 max=50 step=1`), 3 `select`s, 4 `radio`s, `url`, `textarea`, `checkbox`, exactly as the briefing's Type column; `autocomplete` on name, email, phone and URL |
| E21 | JavaScript validation works correctly for all fields | S06 | `validation.js`, `tests/site/` | Automated tests of every rule with valid and invalid values | Met (S06): `validation.js` validates all 11 fields; 14 `node:test` tests (`tests/site/validation.test.cjs`) with valid and invalid values per rule; 68/68 browser checks (EN and ES) |
| E22 | Error messages are specific and helpful (not just "invalid field") | S06 | `validation.js` | Messages match the briefing's "Expected error messages" exactly (English and Spanish) | Met (S06): every message equals the briefing's "Expected error messages" (EN) and "Mensajes de error esperados" (ES), checked by tests that parse both briefings; comments show X = characters left |
| E23 | Validation prevents submission of incorrect data | S06 | `validation.js`, `tests/site/` | Submit with invalid data: no success message, focus moves to the first error | Met (S06): the submit handler always calls `preventDefault()`; with errors, nothing is shown as sent: summary + focus on it; verified with an empty submission (9 errors) in both languages |
| E24 | Form visual states are clear (focus, error, success) | S06 | `application.html`, `validation.js` | Screenshots of focus, error and success states | Met (S06): focus (M1 coral ring), error (rust border, rust text with an icon), valid (green border), sending (disabled "Sending…"), success (green panel); screenshots `form-{en,es}-{errors,success}.png` |
| E25 | The clear form button works correctly | S06 | `application.html`, `validation.js` | Clear resets every field, error, counter and the success message | Met (S06): "Clear form" empties every field and restores errors, `aria-invalid`, summary, success box, counter (500), the submit button and the hidden fields, then focuses the first field; verified by mouse and keyboard (EN and ES) |

### Context Adherence

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E26 | The landing page faithfully reflects the company type and sector | S04, S07, S11 | `index.html`, `es/index.html`, `BRIEFING.md` | Sections and copy match the briefing (header, hero, services, why Nexova in 2 columns, contact, footer) | Met (S04, S07, re-verified S11): the briefing sections in order with their exact texts (header, hero, Services, Why Nexova, Contact, footer); "Why Nexova" in 2 columns as the briefing asks (fixed in S11: 2×2 grid from `md:`, 1 column on phones; `screenshots/landing-*`, `a11y-gate` 72 PASS); the extra sections (marquee, process, offices) only use briefing facts |
| E27 | Content presents the company's experience and competitive advantages | S04, S07 | `index.html`, `es/index.html` | "Why Nexova" shows the 4 advantages (with the documented market wording) | Met (S04, S07): "Why Nexova" as M1 key figures with count-ups (12 years, +500), the regional presence, and the sector specialization as large Technology / Retail / Finance rows; the offices section adds 2011, Valencia, Miami and about 120 people |
| E28 | Form fields exactly match those required in BRIEFING.md | S05 | `application.html`, `es/application.html`, `BRIEFING.md` | Field list, types, options and required flags compared one by one; no extra fields | Met (S05): field names, types, options (EN labels from `BRIEFING.md`, ES labels from `BRIEFING.es.md`, the same `value`s) and required flags (12 `required` attributes: 7 fields, 4 radios, the checkbox; LinkedIn and comments optional) compared one by one; ids/names in `systemPatterns.md` |
| E29 | Any domain-specific validation rules are implemented | S06 | `validation.js`, `tests/site/` | The 6 "Specific validations" of the briefing (email domain, phone `+` code, 0–50 years, LinkedIn URL, 500-character counter, data policy) | Met (S06): the 6 specific validations: email @ + domain with a dot; phone + country code (8–15 digits); years 0–50 integer; LinkedIn http(s) URL parsed by `new URL()`; 500-character counter ("N characters over the limit"); data policy must be ticked; plus at least first and last name |
| E30 | Tone and content are consistent with an established company going digital | S04, S07 | `index.html`, `es/index.html` | Copy review against the briefing and `CONTEXT.md` | Met (S04, S07): the briefing copy plus M1's tone (process, offices), with no invented figures, clients or testimonials, in the look of Nexova's own apps |

## B — Deliverables checklist

From the "What to do" lists of the brief.

### Landing

| ID | Deliverable | Step | Status |
| --- | --- | --- | --- |
| L1 | `index.html` with semantic HTML5 | S04 | Met (S04): `index.html` (and `es/index.html`) with semantic HTML5 |
| L2 | Runs locally with an npx command compatible with Codespaces | S03 | Met (S03): `pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false` |
| L3 | `<header>` with logo/name and navigation | S04 | Met (S03–S04): sticky `header` with the wordmark and `nav` (Home / Services / Talent / Contact, `aria-current` on Home) |
| L4 | A hero presenting the company and its value proposition | S04 | Met (S04): hero with the briefing headline, subheadline, CTA and a static shortlist illustration |
| L5 | At least two additional sections | S04 | Met (S04): Services, Why Nexova and Contact |
| L6 | `<footer>` with contact information | S04 | Met (S03): `footer` with email and both phones in an `address`, copyright and social links |
| L7 | A link/button to the application form | S04 | Met (S04): "Join our talent pool" in the hero and in Contact → `application.html` |
| L8 | Tailwind utility classes | S03, S04 | Met (S04): landing pages styled only with Tailwind utilities (`brand-*`), 0 inline styles |
| L9 | Responsive with mobile, tablet and desktop breakpoints | S04 | Met (S04): landing pages responsive at 375/768/1280 px (screenshots) |
| L10 | Mobile-first | S04 | Met (S04): mobile-first classes on the landing pages |
| L11 | Descriptive `alt` on all images | S04 | Met (S04): descriptive `alt` on the landing images |
| L12 | Semantic tags (`section`, `article`, `nav`…) | S04 | Met (S04): `section`, `article`, `nav`, `address`, `header`, `footer` on the landing pages |
| L13 | ARIA where appropriate | S04, S07, S08 | Met (S08): ARIA on all four pages reviewed (see E15); no redundant roles |
| L14 | Schema.org Organization | S04 | Met (S04): Schema.org Organization JSON-LD on both landing pages |
| L15 | Exposed on a public Codespaces URL | S09 | Met (S09): https://fantastic-space-doodle-q76p5vgw97r6cqrp-8080.app.github.dev/ (Codespaces port 8080 set to Public; private paths return 404; set back to Private after the PR review) |

### Application form

| ID | Deliverable | Step | Status |
| --- | --- | --- | --- |
| A1 | `application.html` with a structured form | S05 | Met (S05): `application.html` (and `es/application.html`) with `<form id="talent-form">`, named by its `h1` |
| A2 | The fields from `BRIEFING.md` | S05 | Met (S05): the 11 briefing fields |
| A3 | Appropriate input types | S05 | Met (S05): input types as in the briefing table |
| A4 | `<label for>` | S05 | Met (S05): `<label for>` on every control |
| A5 | `<fieldset>`/`<legend>` | S05 | Met (S05): 5 `fieldset`s with `legend` (Personal details, Professional profile, Availability, Additional information, Consent) |
| A6 | `required` | S05 | Met (S05): `required` on the 9 required fields (12 attributes, counting the 4 radios); `*` marker plus the note at the top |
| A7 | Responsive form | S05 | Met (S05): one column on phones, two from `md:`, the three profile fields in three from `lg:`; screenshots `form-*-{375,768,1280}.png` |
| A8 | Tailwind styles (spacing, sizes, focus states) | S05 | Met (S05): Tailwind utilities only: `brand-*` spacing, 48 px fields with `radius-field`, M1 focus ring, `aria-[invalid=true]:` error borders, `disabled:` submit state, 0 inline styles |
| A9 | A submit button and a clear button | S05 | Met (S05): "Submit application" (green pill) and "Clear form" (green outline); behaviour in S06 |
| A10 | `validation.js` validates all fields | S06 | Met (S06): `validation.js` validates every field (pure rules + DOM layer) |
| A11 | Real-time validation (`input`/`blur`) | S06 | Met (S06): on `blur`, then on `input`/`change` once touched; the counter on every `input` |
| A12 | A specific message per validation type | S06 | Met (S06): one briefing message per rule, EN and ES |
| A13 | Errors styled clearly | S06 | Met (S06): rust text with an icon and a hidden "Error:" prefix, rust border, `aria-invalid` |
| A14 | Submission prevented when there are errors | S06 | Met (S06): `preventDefault()` always; errors block the simulated submission |
| A15 | A success message (simulated submission) | S06 | Met (S06): "Sending…" for ~800 ms, then the briefing's success message in the page language, focused; 0 network requests |

### Submission

| ID | Deliverable | Step | Status |
| --- | --- | --- | --- |
| S1 | `index.html`, `application.html`, `validation.js` and `BRIEFING.md` (unmodified) present | S01, S06 | Met (S08): `index.html`, `application.html`, `validation.js` and the unmodified `BRIEFING.md` (SHA-256 checked) at the root |
| S2 | The public Codespaces URL in the PR description | S11 | Done in the pull request (S11): the public Codespaces URL is in the PR description |
| S3 | A PageSpeed or Lighthouse screenshot (≥ 80) in the PR description | S09, S11 | Ready for the PR (S09): Lighthouse screenshots of the public URL `docs/milestone-2/screenshots/pagespeed-{home,form}-{mobile,desktop}.png` (Performance 95–100) and the PageSpeed warning-page capture; pasted into the PR description (S11) |
| S4 | Tested at several window sizes | S07, S08 | Met (S08): 320, 375, 768, 1024 and 1280 px and 200 % zoom on all four pages |
| S5 | All validations tested | S06, S08 | Met (S08): 15 `node:test` site tests (every rule, every EN/ES message) + the browser checks of S06–S07 (68 + 18 form checks, both languages) |
| S6 | No console errors | S07, S08 | Met (S08): no console errors on any page (Playwright audit, chrome-devtools MCP `list_console_messages`, Lighthouse Best practices 100) |

## C — Project standards

Our own standards, agreed for this milestone.

| ID | Standard | Step | Status |
| --- | --- | --- | --- |
| P1 | CISO security gate passed | S02, S08 | Met (S08): `security-gate` 7 PASS, `exit=0` on the finished site ([`security.md`](./security.md)); re-run in S11: 7 PASS, `exit=0`, and `/security-review` with no findings |
| P2 | Accessibility gate WCAG 2.2 AA passed | S02, S08 | Met (S08): `a11y-gate` 72 PASS, 0 FAIL, 0 SKIP on all four pages at 375/768/1280 px, plus the manual checklist ([`accessibility.md`](./accessibility.md)); re-run in S11: 72 PASS, `exit=0` |
| P3 | Memory bank updated in every step | S01–S12 | Met (S11): every step S01–S11 updated the memory bank (`check.sh` exit 0) |
| P4 | Milestone recap produced | S11 | Met (S11): [`recap.md`](./recap.md) (`milestone-recap` `check.sh 2`: all 6 criteria passed), plus the deliverable [`report.md`](./report.md) |
| P5 | Bilingual site: every page and every validation message exists in English and Spanish, with a language switcher, `hreflang` links and the correct `lang` on each page | S04–S06 | Met (S08): all four pages and every validation message in English and Spanish; `lang`, `hreflang` (absolute, `x-default` → English) and the switcher checked on each page; no English left on the Spanish pages (audit) |
