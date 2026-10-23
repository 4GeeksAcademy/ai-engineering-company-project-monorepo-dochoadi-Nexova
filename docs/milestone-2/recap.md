# Milestone 2 recap — Your Company's Public Website

A learning recap of Milestone 2, written with the `milestone-recap` skill. Its main source is the [learning log](./learning-log.md) (S01–S10), together with the real history (`git log origin/main..HEAD`), the [evaluation matrix](./evaluation.md), the [verification guide](./verification.md), the [report](./report.md) and the memory bank. It explains what we built and, above all, why.

## Milestone goal

Give Nexova its first public digital touchpoint, as Carmen Ruiz (Marketing) asked in the official briefing: a landing page that says who Nexova is, what it does and why companies choose it, plus a separate form where professionals join the talent pool. It must be plain HTML, Tailwind and JavaScript at the repository root, bilingual, responsive, accessible, SEO-ready, with every form rule working. It must also look and feel like the same company as our Milestone 1 apps.

## What we built, step by step

| Step | Commit | What it delivered | Why it matters |
| --- | --- | --- | --- |
| S01 | `60d39a8` | Milestone branch, the official briefing (`BRIEFING.md`, unmodified, SHA-256 checked) and its Spanish copy, the evaluation matrix (E1–E30, deliverables, standards), conventions and the learning log. | Starting from the real brief, with a place for every piece of evidence, and applying the Milestone 1 feedback (branch name, `BRIEFING.md`, merge only after approval). |
| S02 | `29dbc78` | Security (CISO) and accessibility gates as skills with `check.sh`; three pinned dev MCP servers; the Milestone 1 baseline (SEC-1…7, A11Y-1…7); the urgent Next.js 16.4.1 patch. | Every page was born secure and accessible instead of being patched at the end; the baseline found SEC-1 before any page existed. |
| S03 | `68cd6c6` | Compiled Tailwind 4.3.3 with the shared brand tokens as `brand-*` utilities; the `dist/` allowlist build and the documented `npx http-server` command; the bilingual page skeleton. | E7, E9 and E11, and the fix for SEC-1: the server never shows the repository's private files. |
| S04 | `cc0ec9d` | The landing page in English and Spanish with the briefing copy verbatim, Schema.org JSON-LD, canonical and Open Graph, WebP office photos. | The briefing's sections, order and words (E26, E27, E30) and structured data for search engines (E4). |
| S05 | `f1b5513` | The form markup: exactly the 11 briefing fields, five fieldsets, labels, hints, error containers, the company notice and the data policy. | The field contract (ids, names, values) that validation and a future backend share (E3, E19, E20, E28). |
| S06 | `0a44341` | `validation.js`: real-time validation with the briefing's exact messages in both languages, an error summary, a counter, a simulated submission and Clear; 14 `node:test` tests; cache busting. | Every rule works and every message is checked word for word against the briefing (E18, E21–E25, E29). |
| S07 | `63ffd93` | The Milestone 1 landing experience: the CV cascade, marquee, M1 service cards, process, count-ups, office photos with live clocks, one "Pause animations" control, `motion.js`; HTML not cached; the submit button hidden after success. | The "wow" of Milestone 1 without its accessibility problems (no dimmed text at rest, everything pausable, reduced motion). |
| S08 | `fa7522f` | Quality gates on all four pages: Lighthouse 100/100/100/92 locally; the self-hosted font; a phase-by-phase cascade; a focus ring with no fade; the manual audit (keyboard, ARIA, contrast, widths, zoom, bilingual). | E13–E17 with evidence; faster first view and no visitor data sent to Google. |
| S09 | `d1d8258` | The public Codespaces URL, measured with Lighthouse (95–100 Performance); `performance.md`; `robots.txt` and `sitemap.xml`. | E13 on the real public address and L15. |
| S10 | `dc6293d` | The corrected tool name (PageSpeed only reached the Codespaces warning page), the complete verification guide, README, memory bank, the retroactive Milestone 1 learning log, and devcontainer pins (SEC-4). | The milestone can be re-checked by anyone, and every decision is written down. |
| S11 | this commit | The "Why Nexova" 2-column fix from the final audit, the final security and accessibility reviews, this recap, the report and the pull request. | Closes the milestone with evidence for the instructor. |

## Evaluation criteria and evidence

| ID | Criterion (short) | Where it is proven |
| --- | --- | --- |
| E1 | Semantic tags | All four pages: landmarks, labelled sections, `article`, `address`, `fieldset`/`legend` (S04, S05; S08 audit). |
| E2 | Descriptive `alt` | Logo and office photos; decorative illustration `aria-hidden`; `a11y-gate` criterion 3. |
| E3 | Labels associated with inputs | `<label for>` on 14 controls per form page (S05); `a11y-gate` criterion 4. |
| E4 | Schema.org | The briefing's Organization JSON-LD on both landing pages, parsed and compared (S04). |
| E5 | Logical heading structure | One `h1`, ordered `h2`/`h3`; `a11y-gate` criterion 2 on all pages. |
| E6 | Responsive | 320–1280 px and 200 % zoom, no horizontal scroll (S08 audit; screenshots). |
| E7 | Documented npx command | README "Public website": `pnpm build:site`, then `npx http-server@14.1.1 dist` on port 8080, listening on every interface, with no directory listing and no caching (S03, S07). |
| E8 | Mobile-first | Base classes for phones, breakpoints add columns (S04–S07). |
| E9 | Tailwind utility classes | 0 inline styles; compiled `styles.css` (S03, S08). |
| E10 | `sm:`/`md:`/`lg:` used | On all four pages, e.g. services and "Why Nexova" in 2–3 columns from `md:` (S04, S07, S11). |
| E11 | No unnecessary custom CSS | `tailwind.css` holds only directives, the theme and two commented blocks (S03, S08). |
| E12 | Coherent, professional design | Side-by-side comparison with Milestone 1 (`consistency-*.png`, S08). |
| E13 | Performance ≥ 80 | Lighthouse on the public URL: 99/100 (home), 95/100 (form) ([`performance.md`](./performance.md), S09–S10). |
| E14 | Keyboard accessible | Tab order, skip link, menu, Pause/Replay, focus ring (S07, S08). |
| E15 | Useful ARIA | `aria-current`, `aria-describedby`, `aria-invalid`, live regions, `aria-pressed`, no redundant roles (S08). |
| E16 | Contrast | Computed contrast of every text and border (S08); axe 0 serious/critical. |
| E17 | Logical navigation | Same header and footer everywhere; the switcher opens the twin page (S08). |
| E18 | Errors announced | `role="alert"` summary with focus, `aria-invalid`, `aria-describedby`, `aria-live` counter (S06). |
| E19 | All briefing fields | The 11 fields (S05). |
| E20 | Appropriate input types | text, email, tel, number, select, radio, url, textarea, checkbox (S05). |
| E21 | Validation works | 15 site tests and browser checks (S06–S07; final audit). |
| E22 | Specific messages | Every message compared with both briefings by tests (S06). |
| E23 | Prevents incorrect submission | `preventDefault()` always; errors block the simulated submission (S06). |
| E24 | Clear visual states | Focus ring, error icon + border, green success panel (S06; screenshots). |
| E25 | Clear button works | Resets everything and brings the form back (S06, S07). |
| E26 | Company type and sector | Briefing sections in order and verbatim; "Why Nexova" in 2 columns (S04, S07, S11). |
| E27 | Experience and advantages | The four points with count-ups and the sector words (S04, S07, S11). |
| E28 | Fields exactly as the briefing | Types, options, required flags compared one by one (S05). |
| E29 | Domain validation rules | The six specific validations (S06). |
| E30 | Tone of an established company | Briefing copy plus M1 tone, nothing invented (S04, S07). |

The deliverables L1–L15, A1–A15, S1–S6 and the standards P1–P5 are tracked in the [evaluation matrix](./evaluation.md), with the commands in the [verification guide](./verification.md).

## Key decisions and their reasons

- **Static HTML at the root, not Next.js.** The brief asks for `index.html`, `application.html` and `validation.js` at the root, served with an npx command. Next.js would need a build server and would hide the plain files the evaluation reads. `uis/website` stays as the Milestone 1 prototype.
- **Compiled Tailwind, not the CDN.** The CDN builds the CSS inside every visitor's browser on every visit, which costs speed. Compiling ahead of time ships only the classes we use, one small file, which is part of why Performance reached 95–100.
- **Bilingual, with one contract.** English at the root and Spanish in `es/`, with the same field ids and values; every message comes verbatim from the matching briefing; `hreflang` tells search engines which page is which language.
- **Serve only a `dist/` allowlist (SEC-1).** `http-server --no-dotfiles` only hides dotfiles from folder listings and still serves `/.git/config` by direct address. Copying only the public files into `dist/` makes private files unreachable by design; `-d false` disables directory listings.
- **A strict CSP.** Every page declares what it may load (`'self'` only) and that it may not connect anywhere (`connect-src 'none'`), so even a bug could not send form data away. We accepted SEO 92 in Lighthouse as the cost.
- **The Milestone 1 look and motion (S07).** The developer wanted the same "wow"; we kept it accessible: progressive enhancement, reduced motion, one pause control, no dimmed text at rest.
- **A self-hosted font (S08).** Google Fonts blocked the first paint and shared visitors' IP addresses with Google; hosting the open-source font ourselves fixed both.
- **Lighthouse on the public URL (S09–S10).** PageSpeed Insights only reached GitHub's development-port warning page, so we used the fallback the brief allows.

## Problems we hit and how we solved them

| Symptom | Cause | Fix | Lesson |
| --- | --- | --- | --- |
| `/.git/config` downloadable from the planned server | `--no-dotfiles` only hides dotfiles from listings | Serve a `dist/` allowlist copy; the gate tests the real command (S03) | Test a security option instead of trusting its name. |
| The security gate flagged its own help text, then Lighthouse reports | A word-based pattern matched documentation and browser version strings | Match real host URLs only; skip generated reports (S03, S08) | Checks need their own false-positive tests. |
| The Spanish form ran without validation after an update | `-c 3600` cached old HTML that pointed to old files | `-c-1` plus `?v=<hash>` tags (S06–S07) | Caching bugs look like code bugs. |
| Submit button still visible after success | Its `inline-flex` class beat Tailwind's `hidden` class | Use the `hidden` attribute (S07) | Two classes setting the same property fight. |
| Mobile menu links counted as tabbable while closed | Chromium hides closed `<details>` content with `content-visibility` | `hidden group-open:block` on the panel (S03) | Make hidden states explicit. |
| Buttons vanished in high-contrast mode | Forced colours remove backgrounds | Transparent borders, which forced colours repaint (S04) | Test in forced-colors mode. |
| Lighthouse 87–88 on the landing pages | ~600 animations created in one long task | Create them phase by phase (S08) | Split big JavaScript work. |
| First paint 2.4 s | Render-blocking Google Fonts CSS | Self-hosted font with `preload` (S08) | Third-party requests cost speed and privacy. |
| "Why Nexova" not in 2 columns | S07 replaced the layout with three figures | 2 × 2 grid from `md:` (S11, final audit) | Re-check the brief after big redesigns. |

## Concepts learned

- **Static HTML vs Next.js.** Static pages are plain files the browser opens directly; Next.js renders pages with a build step and a server. When the brief asks for plain files, plain files are the right answer.
- **Compiled Tailwind vs the CDN.** Compiling scans our pages and writes only the classes used into one CSS file; the CDN does that work in every visitor's browser. Compiled is faster for visitors.
- **Mobile-first and breakpoints.** We style for phones first; `sm:`, `md:` and `lg:` add columns from 640, 768 and 1024 px.
- **Semantic HTML and landmarks.** `header`, `nav`, `main`, `section`, `footer` tell screen readers where things are, so users can jump between regions.
- **Schema.org.** A JSON block that tells search engines "this is a company, founded in 2011, with offices in Valencia and Miami".
- **Labels, fieldsets and ARIA for forms.** A label names a field; a fieldset with a legend names a group ("Availability"); `aria-describedby` links a field to its hint and error; `aria-invalid` marks a wrong field.
- **Real-time validation UX.** Check a field when the person leaves it, then on every change, so errors disappear as soon as they are fixed. Client-side validation is help for the user, not security: anyone can bypass the browser, so a real backend must check again.
- **Live regions.** Page areas (`role="alert"`, `aria-live`) that screen readers announce when they change, such as the error summary and the counter.
- **Bilingual structure and `hreflang`.** Twin pages in English and Spanish, linked with `hreflang` so each visitor and search engine gets the right language.
- **Static-server hardening.** Serve a copy that contains only public files, never the project folder, and turn off directory listings.
- **CSP.** A page-level rule that says which sources the page may load and contact; ours allows only our own site and no network requests.
- **Lighthouse and PageSpeed.** Lighthouse measures speed, accessibility, best practices and SEO; PageSpeed Insights runs it from Google's servers, but cannot see a Codespace behind GitHub's warning page.

## What I would do differently

- **Check the brief's layout words after a redesign.** S07's richer layout quietly dropped "Why Nexova (2 columns)" until the final audit.
- **Self-host fonts from the start.** It would have avoided the render-blocking request and the privacy note.
- **Plan for caching on day one.** Version tags and no-cache would have saved the stale-file confusion.
- **Test the public URL's reachability before planning PageSpeed.** The Codespaces warning page made us change the tool late.
- **Keep the motion budget in mind.** Creating hundreds of animations at once was only caught by Lighthouse.

## Open questions carried forward

- The Milestone 1 findings not fixed in this milestone: SEC-3, SEC-5, SEC-6, SEC-7 and A11Y-1 to A11Y-6 in the M1 Next.js apps (planned: M1 hardening, needs approval).
- SEC-2: the dev-only `braces` advisory, accepted until a fix is published.
- The office photos: permission confirmed by the developer, but a licence and consent record is needed before any real launch.
- The Codespaces port 8080 goes back to Private after the review.
- From Milestone 1: the Sales manager (Megan Clarke or Marcos Ibáñez), backoffice authentication, the real contact email, and the open technical decisions.

## Glossary

| Term | Meaning in this milestone |
| --- | --- |
| `BRIEFING.md` | The official 4Geeks brief, kept unmodified and checked by SHA-256. |
| Content decision | A deliberate difference from the briefing text, listed in `content-decisions.md`. |
| Compiled Tailwind | Tailwind CSS built ahead of time into `styles.css`. |
| Brand tokens | Nexova's shared colours, radii, shadows and easings, exposed as `brand-*` utilities. |
| `dist/` allowlist | The folder of public files the server shows; nothing else can be reached. |
| CSP | Content-Security-Policy: which sources a page may load and contact. |
| `hreflang` | Links that tell search engines which page is the English or Spanish twin. |
| Schema.org / JSON-LD | Structured company data inside the page for search engines. |
| Live region | A page area that screen readers announce when it changes. |
| Progressive enhancement | The page works without JavaScript; scripts only add motion. |
| Reduced motion | A device setting the page respects by showing final states at once. |
| Web Animations API | The browser's built-in way to animate from JavaScript, pausable at any moment. |
| Lighthouse / PageSpeed | Google's quality audit (local) and its online runner. |
| Gate | A script that checks a rule set and exits 0 only when everything passes. |
| Codespaces port | A forwarded port of the cloud development machine, private or public. |
