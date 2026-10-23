# Milestone 2 — Accessibility (WCAG 2.2 AA gate)

Results of the `a11y-gate` skill (`.agents/skills/a11y-gate/`) for Milestone 2. Rule: [`.agents/rules/accessibility.md`](../../.agents/rules/accessibility.md). Findings are reported here and fixed only after the developer approves them.

## Gate on the public site

Run on 2026-10-23 (S02): `bash .agents/skills/a11y-gate/check.sh 2` prints `SKIP` for the 8 criteria of each of the 4 pages (`index.html`, `application.html`, `es/index.html`, `es/application.html`: none exists yet) and `a11y-gate passed (no FAIL; no site pages yet)`, `exit=0`. The pages are built from S04 on; the gate is re-run in S08.

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

## S03 — Page skeleton

Run on 2026-10-23 (S03) on the four skeleton pages (header, navigation, language switcher, empty labelled sections, footer). `bash .agents/skills/a11y-gate/check.sh 2` → **72 PASS, 0 FAIL, 0 SKIP**, `a11y-gate passed (no FAIL)`, `exit=0`.

- **Criteria 1–5** at 375, 768 and 1280 px pass on every page: 0 serious or critical axe violations; one `h1`; headings in order; the logo `img` has `alt="Nexova"`; no form controls yet. The keyboard walk-through covers 10 elements at 375 px and 13 at 768/1280 px.
- **Criteria 6–8** pass: no horizontal scroll at 320 px, no running animation with reduced motion, forced-colors screenshots saved.
- **Fixed during the step:** the first run failed criterion 5 at 375 px. In current Chromium, the content of a closed `<details>` is hidden with `content-visibility`, so the four mobile-menu links still had layout boxes. The gate counted them as tabbable, while the browser (correctly) skipped them. The menu panel now has `hidden group-open:block`, so it is `display: none` until the menu opens, and the gate agrees with the browser.
- **Forced-colors review** (`docs/milestone-2/a11y/*.png`): links take the system link colour, the header and footer rules stay visible, and the logo image keeps its own contrast. The decorative coral dot in the footer wordmark disappears, which is fine because it carries no information.
- **Baseline findings A11Y-1 to A11Y-6** (M1 apps): not fixed in this milestone's site steps. Status: **Planned: M1 hardening (separate change, needs approval)**.

## S04 — Landing page

Run on 2026-10-23 (S04) with the landing content in both languages. `a11y-gate` now builds and serves the `dist/` copy (like `security-gate`). Result: **72 PASS, 0 FAIL, 0 SKIP**, `exit=0`. The landing pages have 0 serious or critical axe violations at 375, 768 and 1280 px; the keyboard walk-through covers 15 elements at 375 px and 18 at 1280 px.

- **Structure:** one `h1` (the headline), `h2` for Our services / Why Nexova / Contact (plus the two footer headings), `h3` for the three service cards; four labelled sections; the contact details in an `<address>`.
- **Images:** both office photos have descriptive `alt`s in each language. The hero "shortlist" illustration is decorative and `aria-hidden="true"` (no text inside).
- **Language:** English words inside the Spanish copy (`headhunting`, `outsourcing`, `soft skills`, `retail`) are marked `lang="en"` (rule 3).
- **Lists:** the service bullets, the four "Why Nexova" points and the contact list carry `role="list"`, because Safari's VoiceOver drops list semantics when `list-style: none` (Tailwind's default) is set.
- **Reading order:** the "Regional presence: Spain and United States" point keeps the briefing's word order in the HTML. `flex-col-reverse` only shows the figure above its label, matching the other three points.
- **Forced-colors review, with a fix in this step:**
  - The first run showed both "Join our talent pool" buttons as plain text: forced-colors mode removes background colours, so the pill shape disappeared (rule 25).
  - Both buttons now have `border-2 border-transparent`, and the contact panel `border border-transparent`. Forced-colors mode paints these transparent borders in the system colour, so the pill and the panel edge stay visible (checked with a forced-colors screenshot of the contact panel).
  - The decorative hero illustration disappears in forced colours, which is expected and fine.
- **Gate screenshot limitation:** the gate's full-page forced-colors screenshot does not scroll, so the two lazy-loaded photos (`loading="lazy"`) appear empty in `docs/milestone-2/a11y/*index-forced-colors.png`. They load normally when scrolled (`images_loaded=True` in the S04 screenshots).
- **Contrast:**
  - Text pairs are ink / ink-soft on cream, paper and sand, green on cream and sand, cream and sage on green; all pass AA (axe: 0 violations).
  - Coral appears only in decorative shapes (the placed card, the stage bars, the bullet dots, the logo dot), never as text.
- **Body text:** at least 16 px everywhere. Service bullets are 17 px, reduced to 16 px only between `md:` and `lg:` so the three cards stay readable at 768 px.

## S05 — Form markup

Run on 2026-10-23 (S05) on the form pages. Result: **72 PASS, 0 FAIL**, `exit=0`. The form pages have 0 serious or critical axe violations at 375, 768 and 1280 px and 14 labelled controls per page. The keyboard walk-through covers 25 elements at 375 px and 28 at 1280 px, with the radio group as one stop.

- **Labels and groups:**
  - Every control has a visible `<label for>` (each radio and the checkbox are wrapped in theirs, so the whole tile is clickable and at least 48 px tall).
  - There are five `fieldset`s (Personal details, Professional profile, Availability, Additional information, Consent).
  - Each `legend` holds an `h2`, so screen-reader users hear the group name with every field and can also jump between groups by heading.
- **Descriptions:**
  - Every field has `aria-describedby` pointing to its hint (phone, years, LinkedIn), the comments counter where present, and an empty error container filled in S06.
  - The counter is `aria-live="polite"`.
  - The error summary (`#form-errors`, `role="alert"`, `tabindex="-1"`) and the success box (`#form-success`, `role="status"`) are present and hidden.
- **Required fields:** they have the `required` attribute (announced by screen readers) and a visual `*` (`aria-hidden`), explained by the note at the top of the form.
- **Field borders: a deliberate deviation from the step brief.**
  - The brief asked for a "line" border, but `line` on paper is 1.31:1, below WCAG 1.4.11 (control boundaries need 3:1) and rule 23.
  - Fields and choice tiles use `green-mid` instead (4.55:1 on paper, 4.28:1 on cream), still a brand token. Error borders and error text use `rust` (5.30:1 on paper).
  - The form cards are paper, not sand, because the coral focus ring is only 2.89:1 on sand (3.13–3.3:1 on cream and paper).
- **Hints below the inputs:** a hint above the input wrapped to a different number of lines in neighbouring columns, which pushed the inputs out of line. Below the input, the inputs line up and the hint is still announced with the field.
- **Forced-colors review** (`docs/milestone-2/a11y/*application-forced-colors.png`): every field border, the radio and checkbox tiles, the fieldset boxes, both buttons and the company notice stay visible.

## S06 — Form validation

Run on 2026-10-23 (S06). `a11y-gate`: **72 PASS, 0 FAIL, 0 SKIP**, `exit=0`. axe was also run on the states that `validation.js` creates, which the gate does not reach: 0 serious or critical violations in the error state and the success state, in English and Spanish.

- **Errors are announced and linked** (rules 8, 28–30):
  - Each field's error goes into its `#<id>-error`, already referenced by `aria-describedby`, and the control gets `aria-invalid="true"` (all four radios for the availability group).
  - On submit, the summary (`role="alert"`) lists every error as a link to its field and receives focus. The links move focus to the field (verified by mouse and keyboard).
- **Not colour alone** (rule 24): each error has a rust "!" icon (`aria-hidden`), a visually hidden "Error: " prefix for screen readers, and a rust border on the field. Rust text is 5.30:1 on paper.
- **Real time without noise:** a field is first checked when you leave it, then on every change, so an error disappears as soon as it is fixed. Moving between radios does not count as leaving the group. The comments counter (`aria-live="polite"`) updates on every keystroke and turns rust when over the limit.
- **Success:** a green panel with cream text, `radius-card` corners; it takes focus (`role="status"`, `tabindex="-1"`). The submit button is disabled (`disabled` + `aria-disabled`) while "Sending…" and after success, until "Clear form".
- **Keyboard only:** the whole flow was verified in both languages: Enter submits, a summary link focuses its field, the selects use the arrow keys, the radios and the checkbox use Space, the success message takes focus, Tab reaches "Clear form", and the reset puts focus on the first field.

## S07 — The Milestone 1 landing experience

Run on 2026-10-23 (S07). `a11y-gate`: **72 PASS, 0 FAIL, 0 SKIP**, `exit=0`. The landing pages have 0 serious or critical axe violations at 375/768/1280 px; the keyboard walk covers 17 elements at 375 px and 20 at 1280 px, including Replay and Pause.

The motion is designed not to repeat the Milestone 1 findings:

| M1 finding | How the public site avoids it |
| --- | --- |
| A11Y-1 (dimmed scroll-linked text) | No dimmed text at rest. A reveal lasts 700 ms and ends at full opacity, and only content below the fold at load is hidden until it scrolls in. Process steps are revealed, not dimmed until the line passes. |
| A11Y-2 (contrast during fades) | Fades are short and end at full opacity. axe reports 0 serious or critical issues. |
| A11Y-5 (endless marquee without a pause) | One visible "Pause animations" / "Pausar animaciones" button (`aria-pressed`, keyboard operable, remembered after a reload) stops the cascade, the marquee and the clocks. The marquee also pauses on hover and focus (WCAG 2.2.2). |
| A11Y-6 (endless pulses) | The placed card pulses three times, then stays still. |

- **Reduced motion:** the cascade shows its final placed frame, the figures show "12" and "+500", the marquee is still, there are no reveals, and Replay is hidden. Verified: 0 running animations.
- **JavaScript off:**
  - Every heading, paragraph, list item, figure value and both photos are visible at full opacity.
  - The hero shows the static shortlist.
  - The clocks stay hidden, because there is no time to show without JavaScript.
- **Screen readers:**
  - The cascade field, the stage bars and the marquee are `aria-hidden`.
  - The figure has a visually hidden description.
  - Replay reads "Replay the shortlist animation".
  - The phase label is not announced on every change.
  - The clocks update once a minute without a live region.
- **No flashing:** nothing changes more than three times per second; the fastest effect is the 1.1 s placement ring.
- **Forced colours:** the gate's forced-colors screenshot does not scroll, so sections revealed on scroll appear empty in `docs/milestone-2/a11y/index-forced-colors.png`. A scrolled forced-colors check shows every section, the card edges (transparent borders), both pill buttons, the contact panel border and all the text.

## S08 — Quality gates and manual checklist

Run on 2026-10-23 (S08) on the four finished pages. `a11y-gate`: **72 PASS, 0 FAIL, 0 SKIP**, `exit=0`. Lighthouse Accessibility: 100 on every page.

Manual checklist (a Python Playwright audit of the four pages, 54/54, plus the Playwright MCP for the phone menu):

| Check | Result |
| --- | --- |
| Keyboard | Tab follows the visual order (column by column in the footer and beside the form intro); the skip link moves into `main`; the `<details>` menu opens with Enter, closes with Space, and its links follow it; no keyboard traps (Tab wraps to the start). Every link and button is reachable. |
| Focus | 3 px coral ring with a 3 px offset (cream on dark bands) on every stop. Fixed: `transition-colors` also animated `outline-color`, so the ring faded in from a lighter coral for about 100 ms. Transitions now cover only text, background, border and underline colours. |
| ARIA | `aria-current`, `aria-labelledby` (sections), `aria-describedby`/`aria-invalid` (fields), `aria-live` (counter), `role="alert"`/`role="status"`, `aria-pressed` (Pause), `aria-hidden` (decorative motion), `role="list"` (styled lists, for Safari). No redundant roles. |
| Contrast | The computed colour of every visible text against its real background is ≥ 4.5:1 (large ≥ 3:1) on all four pages, including the form's error state; field and choice borders ≥ 3:1. |
| Navigation | The same header, nav, footer and language switcher on every page, in the same place; `aria-current` on the current page; the switcher opens the twin page. |
| Responsive | 320, 375, 768, 1024 and 1280 px: no horizontal scroll, no clipped text, every target ≥ 44 px (inline links inside a sentence are the WCAG 2.5.8 exception). |
| Text zoom | 200 % (640 CSS px at 2× scale): no loss of content, no horizontal scroll. |
| Bilingual | No English left in the visible text, `alt`, `aria-label`, descriptions or button labels of the `es/` pages (brand names aside); `lang="es"`; `hreflang` en/es/x-default; the switcher points to the English twin. |
| Console | No errors on any page. |

## S11 — Final accessibility review (before the pull request)

Run on 2026-10-23 (S11), including the "Why Nexova" two-column fix. `bash .agents/skills/a11y-gate/check.sh 2` → **72 PASS, 0 FAIL, 0 SKIP**, `exit=0`.

| Page | 375 px | 768 px | 1280 px | Page-level checks |
| --- | --- | --- | --- | --- |
| `index.html` | axe 0 serious/critical; structure, images, labels PASS; keyboard 17 stops | same; keyboard 20 stops | same; keyboard 20 stops | reflow at 320 px, reduced motion, forced-colors screenshot: PASS |
| `application.html` | axe 0; 14 labelled controls; keyboard PASS | same | same | PASS |
| `es/index.html` | axe 0; keyboard 17 stops | same; 20 stops | same; 20 stops | PASS |
| `es/application.html` | axe 0; 14 labelled controls; keyboard PASS | same | same | PASS |

**The S08 manual checklist still holds** (54/54, re-run in the final audit):
- keyboard order column by column, the skip link, the `<details>` menu with Enter/Space, no keyboard traps;
- ARIA only where useful, no redundant roles;
- computed contrast of every text and form border;
- the same navigation on every page;
- 320–1280 px and 200 % zoom;
- no English left on the Spanish pages, and no console errors.

The form was re-verified in the final audit in both languages (every rule and message, the summary, the live regions, success, Clear).

**Milestone 1 baseline items still open** (in `uis/`, not the public site): A11Y-1 (scroll-linked dimmed text), A11Y-2 (contrast during fades), A11Y-3 (tiny headcount segments), A11Y-4 (40 px filter buttons), A11Y-5 (endless marquee without a pause), A11Y-6 (endless pulses). Status: Planned: M1 hardening (separate change, needs approval). The public site avoids all of them (see S07).

### How each audience is served

| Audience | How the public site serves them |
| --- | --- |
| Blind or low-vision people | Landmarks and labelled sections; one `h1` and ordered headings (form legends hold `h2`s); descriptive `alt`s; decorative motion hidden from screen readers; labels, `aria-describedby`, `aria-invalid`, a focused `role="alert"` summary, a `role="status"` success message and an `aria-live` counter; `lang` on pages and on English words in Spanish text. |
| Deaf or hard of hearing | No audio or video; nothing is conveyed by sound. |
| Limited mobility | Everything works by keyboard in a logical order; a skip link; a visible 3 px focus ring; targets of at least 44 px (whole radio and checkbox labels are clickable); the menu works with Enter/Space; no keyboard traps. |
| Cognitive | Plain briefing language; labels always visible; hints below the fields; specific error messages that say how to fix the problem; the same header and footer everywhere; nothing changes on focus; one "Pause animations" control, remembered after a reload. |
| Older adults | Body text of at least 16 px; generous spacing; content reflows at 320 px and at 200 % zoom with no loss. |
| Harsh environments (bright sun, noise) | AA contrast for every text (4.5:1) and form border (3:1); errors shown with text, an icon and a border, never colour alone; forced-colors mode keeps borders, buttons and focus visible (transparent borders). |
| Everyone | Reduced motion shows final states at once; nothing flashes; all content is visible without JavaScript; fast pages (Lighthouse Performance 95–100). |
