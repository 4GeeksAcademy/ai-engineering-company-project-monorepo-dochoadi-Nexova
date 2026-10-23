# Milestone 2 — Evaluation "Your Company's Public Website"

Evidence matrix for Milestone 2 of the Nexova Solutions monorepo: Nexova's public website (landing page + talent pool application form) built with plain HTML, compiled Tailwind CSS and vanilla JavaScript at the repository root, from the official [`BRIEFING.md`](../../BRIEFING.md). Each row links to the files that prove it and to how to verify it; the step-by-step [verification guide](./verification.md) explains how to re-check every step (S01–S11). Results are filled in as each step is done.

## A — Evaluation criteria (E1–E30)

Criteria copied verbatim from the brief.

### HTML Structure and Semantics

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E1 | HTML uses appropriate semantic tags instead of generic divs | S04 | `index.html`, `application.html`, `es/index.html`, `es/application.html` | Inspect the landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`); count `div` elements against semantic tags | Partially met (S04): landing pages (`index.html`, `es/index.html`) use `header`, `nav`, `main`, 4 labelled `section`s, 3 `article`s, `address`, `ul`/`li`, `footer`; the generic `div`s left are layout wrappers and the `aria-hidden` illustration. Form pages in S05 |
| E2 | All images have descriptive alt attributes | S04 | `index.html`, `application.html`, `es/*.html`, `assets/` | Every `img` has a non-empty, descriptive `alt` (decorative images `alt=""`); automated a11y check | Met (S04): every `img` has a descriptive `alt` in its language (logo `Nexova`; office photos, e.g. "Valencia, City of Arts and Sciences — Nexova headquarters"); the decorative hero illustration is `aria-hidden`; `a11y-gate` criterion 3 PASS on all four pages |
| E3 | Forms use label correctly associated with inputs | S05 | `application.html`, `es/application.html` | Every control has a `<label for>` matching its `id` (radio group inside `fieldset`/`legend`) | Pending |
| E4 | Schema.org markup is present and correctly implemented | S04 | `index.html`, `es/index.html`, `docs/milestone-2/content-decisions.md` | Extract the `application/ld+json` block and parse it as JSON; compare with the briefing's Organization markup | Met (S04): the briefing's Organization JSON-LD on both landing pages (Spanish page: the Spanish briefing's `description`), angle brackets removed as in `content-decisions.md`; parsed and compared field by field: `schema OK` ×2 |
| E5 | Document structure is logical and hierarchical | S04 | `index.html`, `application.html`, `es/*.html` | One `h1` per page, headings in order with no skipped levels | Partially met (S04): landing pages (`index.html`, `es/index.html`): one `h1`, then `h2` (sections and footer) and `h3` (service cards), no skipped level (`a11y-gate` criterion 2 PASS). Form pages completed in S05 |

### Responsive Design and Tailwind

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E6 | The site is fully responsive (mobile, tablet, desktop) | S04 | `index.html`, `application.html`, `es/*.html`, `tailwind.css` | Screenshots at 375px, 768px and 1440px; no horizontal scroll | Partially met (S04): landing pages (`index.html`, `es/index.html`) at 375/768/1280 px with no horizontal scroll (and 320 px): `docs/milestone-2/screenshots/landing-*.png`. Form pages in S05 |
| E7 | There is a documented and working command, compatible with Codespaces, to run the project locally with npx | S03 | `README.md`, `package.json` (`build:site`, `serve:site`), `scripts/build-site.mjs` | Run the documented `npx http-server` command; `curl` port 8080 returns `200` | Met (S03): `pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false` documented in the root `README.md` ("Public website": what each flag does, port 8080, Codespaces Ports tab) and as `pnpm serve:site`; `/`, `/application.html`, `/es/`, `/es/application.html`, `/styles.css` → `200`; private paths → `404` (SEC-1) |
| E8 | Mobile-first design is used | S04 | `index.html`, `application.html`, `es/*.html` | Base (unprefixed) classes style mobile; larger screens add `sm:`/`md:`/`lg:` overrides | Partially met (S04): landing pages (`index.html`, `es/index.html`) are styled for phones first (one column), and `sm:`/`md:`/`lg:` add columns and spacing. Form pages in S05 |
| E9 | All styles use Tailwind utility classes | S03 | `tailwind.css`, `styles.css`, `*.html` | Styling lives in utility classes on the markup; `styles.css` is the compiled Tailwind output | Partially met (S03): the four page skeletons are styled only with Tailwind utility classes (`brand-*` names mapped from `packages/shared/styles/tokens.css`), `grep -c 'style="'` → 0 on every page; `styles.css` is the minified CLI output. Met when all pages are complete (S04–S06) |
| E10 | Tailwind breakpoints (sm:, md:, lg:) are used appropriately | S04 | `index.html`, `application.html`, `es/*.html` | `grep -oE "(sm\|md\|lg):" *.html es/*.html \| sort \| uniq -c` | Partially met (S04): landing pages (`index.html`, `es/index.html`) use `sm:` (spacing, type), `md:` (inline nav, 3 service columns, 2 "Why" columns, card padding) and `lg:` (hero 2 columns, type, contact 3 columns). Form pages in S05 |
| E11 | There is no unnecessary custom CSS (only Tailwind) | S03 | `tailwind.css` | `tailwind.css` holds only the Tailwind import and theme tokens; no hand-written rules | Partially met (S03): `tailwind.css` holds only `@import`, `@source`, `@theme inline` (token mapping, no hex values) and one commented `:root` variable (`--font-instrument-sans`, which next/font sets in the Next.js apps); no hand-written rules. Met when all pages are complete (S04–S06) |
| E12 | The design is visually coherent and professional | S04 | `index.html`, `application.html`, `es/*.html`, `packages/shared/styles/tokens.css` | Screenshots reviewed against the Nexova identity (green primary buttons, coral accent, Instrument Sans) | Partially met (S04): landing pages (`index.html`, `es/index.html`) reuse the M1 identity (cream/sand/paper, green headings, green pill buttons, coral only as decoration, Instrument Sans, M1 radii and shadows); screenshots reviewed. Form pages in S05 |
| E13 | Performance verified with a minimum score of 80 (ideal above 90) using PageSpeed Insights on the public Codespaces URL, or Lighthouse from Chrome DevTools if PageSpeed cannot reach Codespaces | S07, S08 | `docs/milestone-2/screenshots/` | PageSpeed Insights on the public Codespaces URL, or Lighthouse; screenshot of the score | Pending |

### Accessibility

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E14 | All interactive elements are keyboard accessible | S07 | `*.html`, `es/*.html`, `validation.js` | Tab through each page: every link, button and control is reachable with a visible focus ring | Pending |
| E15 | ARIA attributes are used where they improve accessibility | S07 | `*.html`, `es/*.html`, `validation.js` | Review `aria-*` usage (`aria-invalid`, `aria-describedby`, live regions, nav labels); no redundant ARIA | Pending |
| E16 | Color contrast meets minimum standards | S07 | `tailwind.css`, `*.html` | Automated contrast check (WCAG 2.2 AA: 4.5:1 text, 3:1 large text and UI) | Pending |
| E17 | Navigation is logical and predictable | S07 | `*.html`, `es/*.html` | Same header navigation on every page; skip link; focus order follows reading order | Pending |
| E18 | Error messages are announced appropriately | S06 | `validation.js`, `application.html`, `es/application.html` | Error text linked with `aria-describedby`, `aria-invalid` set, error summary in a live region | Pending |

### Form and Validation

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E19 | All fields specified in BRIEFING.md are present | S05 | `application.html`, `es/application.html` | The 11 fields of the briefing table are present | Pending |
| E20 | Input types are appropriate for each field | S05 | `application.html`, `es/application.html` | `text`, `email`, `tel`, `select`, `number`, `radio`, `url`, `textarea`, `checkbox` as in the briefing | Pending |
| E21 | JavaScript validation works correctly for all fields | S06 | `validation.js`, `tests/site/` | Automated tests of every rule with valid and invalid values | Pending |
| E22 | Error messages are specific and helpful (not just "invalid field") | S06 | `validation.js` | Messages match the briefing's "Expected error messages" exactly (English and Spanish) | Pending |
| E23 | Validation prevents submission of incorrect data | S06 | `validation.js`, `tests/site/` | Submit with invalid data: no success message, focus moves to the first error | Pending |
| E24 | Form visual states are clear (focus, error, success) | S06 | `application.html`, `validation.js` | Screenshots of focus, error and success states | Pending |
| E25 | The clear form button works correctly | S06 | `application.html`, `validation.js` | Clear resets every field, error, counter and the success message | Pending |

### Context Adherence

| ID | Criterion | Step | Files | How to verify | Result |
| --- | --- | --- | --- | --- | --- |
| E26 | The landing page faithfully reflects the company type and sector | S04 | `index.html`, `es/index.html`, `BRIEFING.md` | Sections and copy match the briefing (header, hero, services, why Nexova, contact, footer) | Met (S04): header, hero, services (3), why Nexova (4), contact and footer in the briefing's order and words (EN and ES), with only the documented content decisions |
| E27 | Content presents the company's experience and competitive advantages | S04 | `index.html`, `es/index.html` | "Why Nexova" shows the 4 advantages (with the documented market wording) | Met (S04): "Why Nexova" shows the four advantages, each figure emphasised (12 years, Spain and United States, +500, Sector specialization), with the documented "Spanish and US markets" wording; office photos of Valencia and Miami |
| E28 | Form fields exactly match those required in BRIEFING.md | S05 | `application.html`, `es/application.html`, `BRIEFING.md` | Field list, types, options and required flags compared one by one; no extra fields | Pending |
| E29 | Any domain-specific validation rules are implemented | S06 | `validation.js`, `tests/site/` | The 6 "Specific validations" of the briefing (email domain, phone `+` code, 0–50 years, LinkedIn URL, 500-character counter, data policy) | Pending |
| E30 | Tone and content are consistent with an established company going digital | S04 | `index.html`, `es/index.html` | Copy review against the briefing and `CONTEXT.md` | Met (S04): the briefing copy, verbatim, in a restrained layout (no invented figures, clients or testimonials); the same brand as Nexova's other apps |

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
| L13 | ARIA where appropriate | S04, S07 | Met for the landing pages (S04): labelled sections, `aria-current`, `aria-hidden` illustration, new-tab hints; re-checked in S07 |
| L14 | Schema.org Organization | S04 | Met (S04): Schema.org Organization JSON-LD on both landing pages |
| L15 | Exposed on a public Codespaces URL | S08 | Pending |

### Application form

| ID | Deliverable | Step | Status |
| --- | --- | --- | --- |
| A1 | `application.html` with a structured form | S05 | Pending |
| A2 | The fields from `BRIEFING.md` | S05 | Pending |
| A3 | Appropriate input types | S05 | Pending |
| A4 | `<label for>` | S05 | Pending |
| A5 | `<fieldset>`/`<legend>` | S05 | Pending |
| A6 | `required` | S05 | Pending |
| A7 | Responsive form | S05 | Pending |
| A8 | Tailwind styles (spacing, sizes, focus states) | S05 | Pending |
| A9 | A submit button and a clear button | S05 | Pending |
| A10 | `validation.js` validates all fields | S06 | Pending |
| A11 | Real-time validation (`input`/`blur`) | S06 | Pending |
| A12 | A specific message per validation type | S06 | Pending |
| A13 | Errors styled clearly | S06 | Pending |
| A14 | Submission prevented when there are errors | S06 | Pending |
| A15 | A success message (simulated submission) | S06 | Pending |

### Submission

| ID | Deliverable | Step | Status |
| --- | --- | --- | --- |
| S1 | `index.html`, `application.html`, `validation.js` and `BRIEFING.md` (unmodified) present | S01, S06 | Pending |
| S2 | The public Codespaces URL in the PR description | S11 | Pending |
| S3 | A PageSpeed or Lighthouse screenshot (≥ 80) in the PR description | S08, S11 | Pending |
| S4 | Tested at several window sizes | S07 | Pending |
| S5 | All validations tested | S06, S07 | Pending |
| S6 | No console errors | S07 | Pending |

## C — Project standards

Our own standards, agreed for this milestone.

| ID | Standard | Step | Status |
| --- | --- | --- | --- |
| P1 | CISO security gate passed | S02, S07 | Partial (S03): SEC-1 resolved (`dist/` allowlist), SEC-2 accepted exception (`auditConfig` in `pnpm-workspace.yaml`), criterion 3 self-match fixed; `security-gate` exit 0 (6 PASS, 1 SKIP: no `validation.js` yet); `/security-review`: no findings ≥ 8 ([`security.md`](./security.md)). Final run in S07 |
| P2 | Accessibility gate WCAG 2.2 AA passed | S02, S07 | Partial (S03): `a11y-gate` on the four skeleton pages: 72 PASS, 0 FAIL, exit 0 ([`accessibility.md`](./accessibility.md)); final run in S07 |
| P3 | Memory bank updated in every step | S01–S11 | In progress: S01, S02, S03 updated the memory bank (`check.sh` exit 0) |
| P4 | Milestone recap produced | S10 | Pending |
| P5 | Bilingual site: every page and every validation message exists in English and Spanish, with a language switcher, `hreflang` links and the correct `lang` on each page | S04–S06 | Partial (S04): both landing pages complete in English and Spanish (official Spanish copy, `lang="en"` on English words, `og:locale` + alternate, canonical, `hreflang`); form pages and validation messages in S05–S06 |
