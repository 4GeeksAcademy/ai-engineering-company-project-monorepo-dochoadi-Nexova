# Milestone 2 — Verification guide

How to re-check every step of Milestone 2 (S01–S12). Each section is filled in when its step is done: what was delivered, the commands to run from the repo root, and the expected output. Criteria IDs refer to the [evaluation matrix](./evaluation.md).

## S01 — Setup: branch, briefing and evaluation matrix

### Delivered

- Branch `milestone-your-companys-public-website` created from the up-to-date `main`.
- Official briefing `BRIEFING.md` (root) and its Spanish version `docs/milestone-2/BRIEFING.es.md`, unmodified (4Geeks repo `ai-engineering-syllabus`, commit `ae89516`).
- `docs/milestone-2/`: `content-decisions.md`, `evaluation.md`, `learning-log.md`, `verification.md`, `README.md`; `docs/milestone-1/instructor-feedback.md`.
- Milestone lifecycle, branch-name rule, merge rule, root-site exception and plain-language summary convention in `AGENTS.md`, `.agents/rules/` and the memory bank.

### Commands

```bash
git branch --show-current
git diff --quiet origin/main -- CONTEXT.md && echo "CONTEXT.md unchanged"
sha256sum BRIEFING.md docs/milestone-2/BRIEFING.es.md
grep -cE "^\| E([1-9]|[12][0-9]|30) " docs/milestone-2/evaluation.md
grep -cE "^\| (L|A)[0-9]+ " docs/milestone-2/evaluation.md
grep -rn "merge your own" AGENTS.md .agents/rules/ || echo "old merge wording gone"
bash .agents/skills/update-memory-bank/check.sh; echo "exit=$?"
```

### Expected

- `milestone-your-companys-public-website`; `CONTEXT.md unchanged`.
- `de3eef75c30e5861d9ac4b1fef1e91dce4013d532f96f0f425ba6912976aedb6  BRIEFING.md` and `562b1ecf2f4d5593a78d1234abf42a0f27e11ddcce73b5ddcbcd9e9392082740  docs/milestone-2/BRIEFING.es.md`.
- `30` criteria rows and `30` landing/form deliverable rows.
- `old merge wording gone`; `check.sh` prints 5× `PASS` and `exit=0`.

## S02 — CISO security and accessibility gates, dev MCP servers

### Delivered

- Security policy extended in `.agents/rules/security-and-data.md` (Web, Forms, LLM and agents, Public repo, Free tools only, MCP servers, Verification) and new rule `.agents/rules/accessibility.md` (WCAG 2.2 AA, by audience).
- Own skills `security-gate` (7 criteria) and `a11y-gate` (8 criteria, `a11y_check.py` with `axe-playwright-python==0.1.8`), listed in `.agents/skills/README.md`; `AGENTS.md` workflow step 7 runs both before every PR.
- `.mcp.json` with three pinned dev MCP servers: `@playwright/mcp@0.0.83`, `chrome-devtools-mcp@1.12.0`, `@upstash/context7-mcp@4.4.4`; the matching Chromium install line in `.devcontainer/post-create.sh`.
- Milestone 1 baseline in `docs/milestone-2/security.md` and `docs/milestone-2/accessibility.md` (report only).
- Next.js 16.4.0 → 16.4.1 in `uis/website` and `uis/backoffice` (GHSA-673q-mjm6-r5xr, GHSA-2464-fhr4-w9xw, GHSA-p3m5-59mp-jv5r).

### Commands

```bash
python3 -c "import json;d=json.load(open('.mcp.json'));print(sorted(d['mcpServers']));print(all('@latest' not in ' '.join(v['args']) for v in d['mcpServers'].values()))"
grep -nE "api[_-]?key|token|secret" .mcp.json || echo "no keys"
claude mcp list 2>&1 | grep -E "playwright|chrome-devtools|context7"
bash .agents/skills/security-gate/check.sh 2; echo "exit=$?"
pip install --user -r .agents/skills/a11y-gate/requirements.txt
bash .agents/skills/a11y-gate/check.sh 2; echo "exit=$?"
awk '/^## Mandatory workflow before every commit/{f=1;next}/^## /{f=0}f' AGENTS.md | grep -cE "^[0-9]+\. "
grep -c "Baseline: Milestone 1" docs/milestone-2/security.md docs/milestone-2/accessibility.md
grep -h '"next"' uis/website/package.json uis/backoffice/package.json
pnpm install --frozen-lockfile && pnpm audit --prod
pnpm lint && pnpm typecheck && pnpm build && pnpm test
```

### Expected

- `['chrome-devtools', 'context7', 'playwright']`, `True`, `no keys`; the three servers listed (approval may be pending; they load in a new session).
- `security-gate`: criteria 1–3 `PASS`, 4 and 5 `FAIL` (known findings SEC-2 and SEC-1 in `security.md`, waiting for the developer's decision), 6–7 `SKIP`, `exit=1`. Once SEC-1 and SEC-2 are resolved: 1–5 `PASS`, `exit=0`.
- `a11y-gate`: 32 `SKIP` lines (4 pages × 8 criteria, no pages yet), `exit=0`.
- `8` numbered workflow steps; `1` "Baseline: Milestone 1" per file.
- `"next": "16.4.1"` twice; the lockfile is up to date and `pnpm audit --prod` reports no known vulnerabilities.
- Lint, typecheck and build pass; tests 15/15 (shared 6, website 4, backoffice 5).

## S03 — Tailwind build, npx server and page skeleton

### Delivered

- Compiled Tailwind CSS v4: `tailwind.css` (source: `@import "tailwindcss" source(none)`, `@source` for the site pages and `validation.js` only, the shared brand tokens imported from `packages/shared/styles/tokens.css` and mapped to `brand-*` names in `@theme inline`) → minified `styles.css` (committed). Root devDependencies `tailwindcss` and `@tailwindcss/cli` 4.3.3, pinned; `@parcel/watcher` added to the `allowBuilds` deny-list (prebuilt binary).
- Root scripts `build:site`, `watch:site`, `serve:site`, `test:site`; `scripts/build-site.mjs` copies only the public allowlist into the git-ignored `dist/` (no dotfiles, no symlinks).
- The documented command (E7) in the root `README.md` ("Public website"), serving `dist/` on port 8080 (SEC-1).
- SEC-2 accepted exception in `pnpm-workspace.yaml` (`auditConfig.ignoreGhsas`); `security-gate` criterion 5 serves `dist/`; criterion 3 no longer matches its own documentation.
- Bilingual semantic skeleton: `index.html`, `application.html`, `es/index.html`, `es/application.html` (head with CSP, `hreflang` alternates, Instrument Sans; skip link; sticky header with the wordmark `assets/nexova-logo.svg`, the main navigation, a `<details>` menu below `md:` and the language switcher; labelled empty sections; footer with `address`, copyright and social links), favicon `assets/favicon.svg`, `tests/site/README.md`.

### Commands

```bash
pnpm install --frozen-lockfile
pnpm build:site && ls -la styles.css
grep -nE "^\s*[.#a-z].*\{" tailwind.css | grep -v "@" | head
grep -cE "style=\"" index.html application.html es/index.html es/application.html
ls -A dist/
(npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false >/tmp/site.log 2>&1 &) ; sleep 3
for u in / /application.html /es/ /es/application.html /styles.css; do curl -s -o /dev/null -w "%{http_code} " "localhost:8080$u"; done; echo
for u in /.env /.git/config /.mcp.json /memory-bank/ /BRIEFING.md /package.json; do curl -s -o /dev/null -w "%{http_code} " "localhost:8080$u"; done; echo
for pid in $(ss -ltnpH "sport = :8080" | grep -oE 'pid=[0-9]+' | cut -d= -f2); do kill "$pid"; done
grep -H '<html lang' index.html application.html es/index.html es/application.html
git check-ignore dist && echo "dist ignored"
pnpm audit --audit-level high; echo "exit=$?"
pnpm test:site; echo "exit=$?"
bash .agents/skills/security-gate/check.sh 2; echo "exit=$?"
bash .agents/skills/a11y-gate/check.sh 2; echo "exit=$?"
```

Each URL gets its own `curl -o /dev/null`, because `-o` applies to one URL only. The server is stopped by its port: `pkill -f http-server` also matches the shell running the command and stops it.

### Expected

- `styles.css` about 18–19 KB (minified, only the classes used); no custom selector in `tailwind.css`; `0` inline styles on all four pages.
- `dist/` lists `application.html`, `assets`, `es`, `index.html`, `styles.css` (no dotfiles).
- `200 200 200 200 200`, then `404 404 404 404 404 404`; `lang="en"` ×2 and `lang="es"` ×2; `dist ignored`.
- `pnpm audit`: `1 ignored: 1 high`, `exit=0`; `pnpm test:site`: 0 tests, `exit=0` (tests arrive in S06).
- `security-gate`: 1–5 and 7 `PASS`, 6 `SKIP`, `exit=0`. `a11y-gate`: 72 `PASS`, `exit=0`.
- In the browser: at 375 px the header shows the wordmark, a "Menu" / "Menú" pill and the language link; at 768 px and up the four links appear inline; Tab first shows the "Skip to main content" pill.

## S04 — Landing page

### Delivered

- `index.html` and `es/index.html` filled from the official briefing (EN and ES), in the briefing's order:
  - hero: the headline, the subheadline, a "Join our talent pool" green pill, and a static, `aria-hidden` shortlist illustration (the M1 hero frozen in its "placed" state);
  - Our services: 3 `article` cards;
  - Why Nexova: the 4 points with emphasised figures, and the Valencia and Miami photos;
  - Contact: an `address` with `mailto:`/`tel:` links, and a second CTA.
- `<head>`: the briefing's Organization JSON-LD, `rel="canonical"` (`https://nexova.com/`, `https://nexova.com/es/`) and Open Graph (`og:title`, `og:description`, `og:type`, `og:locale`, `og:locale:alternate`).
- `assets/valencia.webp` (67,298 bytes) and `assets/miami.webp` (148,322 bytes): both 1200 × 800, converted from `uis/website/public/images/*.jpg` with a one-off Pillow 13.0.0 script in `/tmp` (WebP quality 78). Nothing was added to the repo.
- `a11y-gate` builds and serves `dist/` like `security-gate`.
- Screenshots `docs/milestone-2/screenshots/landing-{en,es}-{375,768,1280}.png`.

### Commands

```bash
pnpm build:site
for f in index.html es/index.html; do echo "== $f"; grep -c "<section" $f; grep -c "<article" $f; grep -oE "<h[1-3]" $f | sort | uniq -c; done
python3 - <<'EOF'
import json, re
for f in ("index.html", "es/index.html"):
    s = open(f).read()
    d = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S).group(1))
    print(f, d["@type"], d["url"], d["description"])
EOF
grep -c "We build exceptional teams for growing companies" index.html
grep -c "Construimos equipos excepcionales para empresas en crecimiento" es/index.html
grep -oE '<img[^>]*>' index.html es/index.html | grep -vc 'alt="'
grep -cE 'style="' index.html es/index.html
grep -c 'aria-current="page"' index.html es/index.html
bash .agents/skills/security-gate/check.sh 2; echo "exit=$?"
bash .agents/skills/a11y-gate/check.sh 2; echo "exit=$?"
```

### Expected

- Each page: `4` sections, `3` articles, `1 <h1`, `5 <h2` (3 sections + 2 footer headings), `3 <h3`.
- `Organization https://nexova.com Human resources consulting and talent acquisition` and the Spanish description `Consultora de recursos humanos y adquisición de talento`.
- `1` and `1`; `0` images without `alt`; `0` inline styles; `aria-current` on Home/Inicio (2 per page: desktop and mobile menu).
- `security-gate` exit 0 (6 PASS, 1 SKIP); `a11y-gate` 72 PASS, exit 0.
- In the browser (`pnpm serve:site`, port 8080):
  - at 375 px everything is one column, the "Menu" works and nothing is cut off;
  - at 768 px the three service cards sit side by side;
  - at 1280 px the hero illustration sits to the right of the text;
  - the CTAs open `application.html`, and the email and phone numbers are clickable.

## S05 — Application form markup

### Delivered

- `application.html` and `es/application.html`:
  - the 11 `BRIEFING.md` fields in five `fieldset`s (each `legend` holds an `h2`);
  - ids = names in snake_case, the same on both pages; option `value`s identical in both languages;
  - a visible label, an optional hint, an empty error container and `aria-describedby` on every field;
  - the comments counter (`aria-live="polite"`), the error summary (`#form-errors`) and the success box (`#form-success`), all hidden;
  - the company notice with a `mailto:` link, the data policy section (`#data-policy`), and the Submit and Clear buttons.
- No JavaScript and no `novalidate` in the HTML (S06 sets `noValidate` when `validation.js` loads).
- All four pages: absolute `hreflang` links (`https://nexova.com/…`, `x-default` → English) and a canonical URL of their own.
- Landing pages: the services heading is "Services" / "Servicios", as in the briefing.
- `content-decisions.md`: the office photos are used with the developer's confirmed permission.
- Screenshots `docs/milestone-2/screenshots/form-{en,es}-{375,768,1280}.png`.

### Commands

```bash
pnpm build:site
for f in application.html es/application.html; do echo "== $f"
  for id in full_name email phone country_of_residence years_of_experience sector_of_interest english_level availability linkedin additional_comments data_policy; do grep -q "name=\"$id\"" $f && echo "ok $id" || echo "MISSING $id"; done
  grep -c "<fieldset" $f; grep -c "<legend" $f
  grep -oE 'type="(text|email|tel|number|url|checkbox|radio)"' $f | sort | uniq -c
  grep -oE ' required[ >]' $f | wc -l
  grep -oE '<label for="[^"]+"' $f | wc -l
done
grep -c "Are you a company looking for talent" application.html
grep -c "¿Eres una empresa buscando talento" es/application.html
grep -cE 'style="' application.html es/application.html
grep -h 'hreflang="x-default"\|rel="canonical"' index.html application.html es/index.html es/application.html
bash .agents/skills/security-gate/check.sh 2; echo "exit=$?"
bash .agents/skills/a11y-gate/check.sh 2; echo "exit=$?"
```

### Expected

- `ok` ×11 per page; `5` fieldsets and `5` legends.
- `text` 1, `email` 1, `tel` 1, `number` 1, `url` 1, `checkbox` 1, `radio` 4.
- `12` `required` attributes per page. `grep -c " required"` gives 13 on the English page, because the note "Fields marked * are required" also matches.
- `14` `label for` per page (10 fields + 4 radios).
- The company notice once per page; `0` inline styles.
- Canonical and `x-default` are absolute `https://nexova.com/…` URLs.
- `security-gate` exit 0; `a11y-gate` 72 PASS, exit 0.
- In the browser: fields stack in one column at 375 px and pair up from 768 px; clicking a radio or checkbox label selects it; Tab shows the coral ring on every field. Nothing validates yet (S06).

## S06 — Form validation

### Delivered

- `validation.js` (root, plain JavaScript, no dependency):
  - pure rules and both languages' messages, verbatim from the briefings, exported for Node;
  - a DOM layer that only runs in the browser: `noValidate`, real-time validation (blur, then input/change), field errors with an icon and `aria-invalid`, the 500-character counter, an error summary with links and focus, a simulated submission ("Sending…" ~800 ms, then the success message), and the reset.
- Loaded with `<script src="validation.js" defer>` (ES: `../validation.js`) on both form pages.
- `tests/site/validation.test.cjs`: 14 `node:test` tests. The root `pnpm test` now also runs `pnpm test:site`.
- `scripts/build-site.mjs`: cache busting (`styles.css?v=<hash>`, `validation.js?v=<hash>` in `dist/` only).
- Screenshots `docs/milestone-2/screenshots/form-{en,es}-{errors,success}.png`.

### Commands

```bash
pnpm test:site; echo "exit=$?"
pnpm test; echo "exit=$?"
grep -nE "innerHTML|outerHTML|insertAdjacentHTML|eval\(|document\.write|localStorage|sessionStorage|fetch\(|XMLHttpRequest" validation.js
grep -c 'src="validation.js" defer' application.html; grep -c 'src="../validation.js" defer' es/application.html
pnpm build:site && grep -o 'styles.css?v=[0-9a-f]*' dist/index.html dist/es/application.html
grep -c "?v=" index.html application.html
bash .agents/skills/security-gate/check.sh 2; echo "exit=$?"
bash .agents/skills/a11y-gate/check.sh 2; echo "exit=$?"
```

### Expected

- `test:site`: 14 tests, 14 pass, `exit=0`. `pnpm test`: 6 + 4 + 5 package tests, then the 14 site tests, `exit=0`.
- No unsafe API in `validation.js` (no output); `1` and `1`.
- `styles.css?v=<8 hex>` in both `dist/` pages; `0` and `0` at the root (the source HTML is unchanged).
- `security-gate` 7 PASS, `exit=0`; `a11y-gate` 72 PASS, 0 SKIP, `exit=0`.
- In the browser (`pnpm serve:site`), on `/application.html` and `/es/application.html`:
  - an empty submit shows a summary with 9 errors, focused, with `aria-invalid="true"` on the 9 required fields;
  - each field shows its own message when you leave it and loses it as soon as it is fixed;
  - 520 characters show "20 characters over the limit" / "20 caracteres por encima del límite" and the comments error;
  - a valid submission shows "Sending…" / "Enviando…" (button disabled), then the thank-you message, focused, with no network request;
  - "Clear form" restores the initial state and focuses Full name;
  - all of it works with the keyboard only, and the console shows no errors.

## S07 — The Milestone 1 landing experience

### Delivered

- `index.html` and `es/index.html` with the M1 landing experience. The briefing sections keep their order and exact texts; the extra sections (marquee, process, offices) sit between them.
  - **Hero:** the CV cascade (72 CVs fall, are scored by a beam, sort, five are shortlisted and one is placed), with the phase label, the stage bars, "Replay" and the "Pause animations" control (`aria-pressed`, remembered in `localStorage`).
  - **Marquee:** briefing words only.
  - **Services:** M1's light, dark and coral cards with a hover lift.
  - **Process:** 4 steps, with a line that draws itself.
  - **Why Nexova:** key figures with count-ups ("12", "+500"), then the sector specialization as large Technology / Retail / Finance rows.
  - **Offices:** briefing facts only, with the clip-path photo reveal and live clocks for Valencia and Miami, updated each minute.
  - **Contact:** the green rounded band.
- `motion.js` (root, plain JavaScript, `defer`, no dependency, ~16 KB): a port of M1's `lib/motion.ts` and the behaviour of Reveal, CountUp, CvCascade, Marquee, OfficePhotos, OfficeClock and the header shadow. It uses only the Web Animations API and Tailwind class toggles, never `style=` or `innerHTML`. All four pages load it (the form pages for the header shadow).
- Progressive enhancement: without JavaScript every text, figure and photo is visible, and the hero shows the static shortlist. Reduced motion shows every final state at once.
- S06 review fixes:
  - `-c-1` on `serve:site`, the documented command and both gates, so HTML is never cached;
  - `motion.js` added to the version tags and the `dist/` allowlist;
  - after a successful submission the Submit button is hidden, and "Clear form" brings the form back (`layoutFor()` plus a test, 15 site tests).
- Steps renumbered: quality gates S08, public URL S09, docs S10, recap and PR S11, merge S12.
- Screenshots `docs/milestone-2/screenshots/landing-{en,es}-{375,768,1280}.png` retaken.

### Commands

```bash
pnpm build:site && ls dist/ && grep -o 'motion.js?v=[0-9a-f]*' dist/index.html dist/es/index.html
python3 - <<'EOF'
import re
for f in ["index.html", "es/index.html"]:
    ids = re.findall(r'<section[^>]*id="([^"]+)"', open(f).read())
    print(f, ids, [i for i in ids if i in ("top", "services", "why-nexova", "contact")] == ["top", "services", "why-nexova", "contact"])
EOF
grep -cE 'style="' index.html es/index.html application.html es/application.html
grep -nE "innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(" motion.js validation.js || echo "no unsafe DOM APIs"
wc -c motion.js
pnpm test
curl -sI localhost:8080/ | grep -i cache-control     # with pnpm serve:site running
bash .agents/skills/security-gate/check.sh 2; echo "exit=$?"
bash .agents/skills/a11y-gate/check.sh 2; echo "exit=$?"
```

### Expected

- `dist/` holds `application.html`, `assets`, `es`, `index.html`, `motion.js`, `styles.css`, `validation.js`; both landing pages load `motion.js?v=<8 hex>`.
- `['top', 'services', 'process', 'why-nexova', 'offices', 'contact'] True` for both pages; `0` inline styles on all four pages; no unsafe DOM APIs; `motion.js` about 16 KB.
- `pnpm test`: 15 package tests + 15 site tests pass; `cache-control: no-cache, no-store, must-revalidate`.
- `security-gate` 7 PASS, `exit=0`; `a11y-gate` 72 PASS, 0 SKIP, `exit=0`.
- In the browser:
  - **cascade and pause:** the cascade plays and ends with one coral card placed; "Replay" plays it again; "Pause animations" stops the cascade, the marquee and the clocks, and stays paused after a reload;
  - **scrolling:** sections slide in once, "12" and "+500" count up, the photos open, and the clocks show local time;
  - **reduced motion:** the final frame and final numbers at once, nothing moves;
  - **JavaScript off:** every text, figure and photo is visible;
  - **form pages:** after "Submit application", only the thank-you message and "Clear form" remain.

## S08 — Quality gates: accessibility, security and performance re-check

### Delivered

- Lighthouse 13.5.0 reports (HTML + JSON) for the four pages in `docs/milestone-2/lighthouse/`:

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (`index`) | 100 | 100 | 100 | 92 | 1.1 s | 1.4 s | 20 ms | 0 |
| `/application.html` | 100 | 100 | 100 | 92 | 1.1 s | 1.7 s | 0 ms | 0 |
| `/es/` (`es-index`) | 100 | 100 | 100 | 92 | 1.1 s | 1.6 s | 50 ms | 0 |
| `/es/application.html` | 100 | 100 | 100 | 92 | 1.1 s | 1.7 s | 10 ms | 0 |

- **Fixes:**
  - Instrument Sans self-hosted (`assets/fonts/`, OFL licence, preload, no Google requests, stricter CSP);
  - the cascade creates its animations phase by phase (no long task);
  - the focus ring no longer fades in;
  - `security-gate` criterion 3 skips the generated reports;
  - `[M2-S13]` in the `git-workflow.md` example.
- The manual checklist (keyboard, ARIA, contrast, navigation, widths, 200 % zoom, bilingual, console): results in `accessibility.md`, S08.
- M1 consistency: `docs/milestone-2/screenshots/consistency-{header,button,card,footer}-{m1,m2}.png`, side by side at 1280 px.
- The evaluation matrix re-checked against the files.

### Commands

```bash
pnpm build:site && pnpm test; echo "exit=$?"
bash .agents/skills/security-gate/check.sh 2; echo "exit=$?"
bash .agents/skills/a11y-gate/check.sh 2; echo "exit=$?"
(npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false -c-1 &) ; sleep 3
export CHROME_PATH=~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
npx lighthouse@13.5.0 http://localhost:8080/ --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path=docs/milestone-2/lighthouse/index
python3 -c "import json,glob;[print(f.split('/')[-1], {k:round(v['score']*100) for k,v in json.load(open(f))['categories'].items()}) for f in sorted(glob.glob('docs/milestone-2/lighthouse/*.json'))]"
grep -oE "(bg|text|border)-[a-z]+-[0-9]{2,3}" index.html application.html es/*.html     # empty: brand colours only
grep -c "googleapis\|gstatic" index.html application.html es/*.html                     # 0 on every page
grep -cE "Pending" docs/milestone-2/evaluation.md
```

### Expected

- Build and tests `exit=0` (15 + 15 tests); `security-gate` 7 PASS; `a11y-gate` 72 PASS, 0 SKIP.
- Lighthouse: Performance ≥ 90 (100 recorded), Accessibility, Best practices ≥ 90 (100), SEO ≥ 90 (92: only `robots.txt` is missing). Scores vary by a few points between runs; Total Blocking Time stays under 100 ms.
- No default Tailwind palette colour; no Google reference.
- `4` Pending rows (L15, S2, S3, P4); E13 "Partially met (local Lighthouse)" until S09.
- By hand:
  - keyboard only: everything reachable with a visible ring, and the phone menu opens and closes with Enter/Space;
  - the reports open in a browser from `docs/milestone-2/lighthouse/*.report.html`.

## S09 — Performance evidence and public URL

### Delivered

- **Developer (Part A):** port 8080 set to Public; the private paths checked (404); PageSpeed Insights only reached GitHub's development-port warning page, so Lighthouse 13.5.0 (command line) was run on the public URL for the home page and the form, mobile and desktop; four screenshots `docs/milestone-2/screenshots/pagespeed-{home,form}-{mobile,desktop}.png` (names kept) plus `pagespeed-codespaces-warning-page.png` (added in S10).
- [`performance.md`](./performance.md): the public URL, date, tool, the scores table, the screenshots, the local Lighthouse comparison, and why SEO reads 61 on Codespaces (the `x-robots-tag: noindex` header) and 92 locally (the strict CSP blocks Lighthouse's `robots.txt` fetch).
- `robots.txt` (allow all, `Sitemap: https://nexova.com/sitemap.xml`) and `sitemap.xml` (the four pages, absolute `https://nexova.com/…` URLs, `hreflang` en/es/x-default alternates) at the root; `build-site.mjs` copies both into `dist/`.
- Lighthouse reports in `docs/milestone-2/lighthouse/` re-run after the change.

### Commands

```bash
U=https://fantastic-space-doodle-q76p5vgw97r6cqrp-8080.app.github.dev
curl -sI "$U/" | grep -i x-robots-tag                                   # noindex, nofollow (added by Codespaces)
for p in /.env /.git/config /.mcp.json /package.json /memory-bank/; do curl -s -o /dev/null -w "%{http_code} " "$U$p"; done; echo
pnpm build:site && ls dist/
python3 -c "import xml.dom.minidom as m; print(len(m.parse('sitemap.xml').getElementsByTagName('url')))"
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" localhost:8080/robots.txt   # with pnpm serve:site running
python3 -c "import json,glob;[print(f.split('/')[-1], {k:round(v['score']*100) for k,v in json.load(open(f))['categories'].items()}) for f in sorted(glob.glob('docs/milestone-2/lighthouse/*.json'))]"
```

### Expected

- `x-robots-tag: noindex, nofollow`; `404 404 404 404 404`.
- `dist/` also holds `robots.txt` and `sitemap.xml`; `4` URLs in the sitemap; `200 text/plain; charset=UTF-8`.
- Lighthouse on the public URL (screenshots): Performance 99 / 100 (home), 95 / 100 (form), Accessibility and Best practices 100, SEO 61 on Codespaces.
- Local Lighthouse: Performance 95–100, Accessibility 100, Best practices 100, SEO 92 (the `robots-txt` audit reports a CSP violation, see `performance.md`).
- After the PR review, the developer sets port 8080 back to Private: the URL then redirects to the GitHub sign-in again.

## S10 — Documentation and devcontainer

### Delivered

- **Corrections from the S09 review:**
  - the public-link scores were measured with Lighthouse 13.5.0, because PageSpeed Insights only reached GitHub's development-port warning page (`screenshots/pagespeed-codespaces-warning-page.png`), corrected in `performance.md`, `evaluation.md`, this guide, the S09 learning-log section (a dated correction line) and the memory bank;
  - SEO 92 with `connect-src 'none'` is accepted (`performance.md`, `security.md`).
- This guide completed: the manual browser checklists and the five-command re-check below.
- Root `README.md` "Public website" section (pages, build, serve, tests, gates, docs links); `docs/README.md` and `docs/README.es.md` list Milestone 2; `docs/milestone-2/README.md` lists every file.
- The memory bank consolidated (goal and status, users, site stack, bilingual and gate patterns, open questions).
- `docs/milestone-1/learning-log.md`: a retroactive log of Milestone 1 (S01–S13 and the merge), linked from `docs/milestone-1/README.md` and `recap.md`.
- `.devcontainer/devcontainer.json` forwards 8080 ("Public site"); `.devcontainer/post-create.sh` pins `uv`, `playwright` (pip) and `@anthropic-ai/claude-code` (SEC-4 fixed).

### Commands

```bash
grep -cE "^## S(0[1-9]|1[01])" docs/milestone-2/verification.md
grep -cE "^## S0[1-9]" docs/milestone-2/learning-log.md
grep -cE "^## S[0-9]{2}" docs/milestone-1/learning-log.md
grep -n "npx http-server" README.md
grep -rnE "([0-9]{1,3}\.){3}[0-9]{1,3}|easypanel\.host|password" memory-bank docs README.md | grep -vE "127\.0\.0\.1|0\.0\.0\.0"
grep -cE "Pending" docs/milestone-2/evaluation.md
python3 -c "import json; d=json.load(open('.devcontainer/devcontainer.json')); print(d['forwardPorts'], d['portsAttributes']['8080'])"
grep -nE "uv==|playwright==|claude-code@" .devcontainer/post-create.sh
bash .agents/skills/update-memory-bank/check.sh; echo "exit=$?"
```

### Expected

- `11` step sections here; `9` sections `S01`–`S09` in the Milestone 2 learning log (plus S10); `14` sections in the Milestone 1 learning log.
- The documented `npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false -c-1` line in the README.
- No output from the IP/host/password search.
- `2` Pending rows (S2, P4).
- `[3000, 3001, 8000, 5678, 8080]` with the label "Public site"; three pinned install lines.
- `check.sh` 5 PASS, `exit=0`.
- Saving `.devcontainer/` files makes the Codespace offer a rebuild: click "Not now". The changes apply at the next rebuild.

## Manual browser checklists

Start the site with `pnpm serve:site` and open <http://localhost:8080/> (Codespaces: the Ports tab → 8080 → globe icon).

### Landing page (`/` and `/es/`) at 375, 768 and 1280 px

- [ ] Header: the Nexova wordmark, Home / Services / Talent / Contact (ES: Inicio / Servicios / Talento / Contacto), the language link; at 375 px a "Menu" / "Menú" pill opens and closes the links.
- [ ] Hero: the briefing headline and subheadline verbatim, the green "Join our talent pool" / "Únete a nuestro banco de talento" button (opens the form); the CV cascade plays and ends with one coral card "Placed"; "Replay" plays it again; "Pause animations" stops the cascade, the marquee and the clocks and stays paused after a reload.
- [ ] Services (3 cards), Process (4 steps), Why Nexova (2 columns from 768 px, 1 column on phones; "12" and "+500" count up; Spain and United States; the three sectors), Offices (the photos open; the Valencia and Miami clocks show local time), Contact (email and both phones are links), footer (© 2025 Nexova, LinkedIn and Instagram open in a new tab).
- [ ] One column at 375 px, nothing cut off; no horizontal scroll at any width.
- [ ] With "reduce motion" switched on in the operating system: the cascade shows its final frame, the numbers are final, nothing moves.

### Form (`/application.html` and `/es/application.html`)

- [ ] Empty submit: a summary at the top lists 9 errors in the page language, takes focus, and each link jumps to its field.
- [ ] Each field: type a wrong value and leave the field; the briefing's message appears with an icon. Fix it and the message disappears (name "Ana", email "ana@", phone "612345678", years "51", LinkedIn "linkedin.com/in/x", the three lists, the availability options, the data policy box).
- [ ] Counter: typing in Comments counts down from "500 characters remaining"; over 500 it says "N characters over the limit" and the comments error appears.
- [ ] Success: a complete, valid form shows "Sending…" (button disabled), then the thank-you message; only "Clear form" stays below it; no network request is made (DevTools → Network).
- [ ] Clear: "Clear form" empties everything, removes every error, resets the counter to 500 and puts the cursor in Full name.
- [ ] Keyboard only: Tab, Shift+Tab, arrows, Space and Enter fill and submit the whole form; the coral focus ring is always visible.
- [ ] Screen-reader spot check (VoiceOver or NVDA): the group names (legends) are read with their fields; an error is announced when it appears; the summary is announced on submit; the success message is announced.

### Language switcher (all four pages)

- [ ] "Español" on an English page opens the same page in Spanish, and "English" on a Spanish page opens the English twin; the menu and footer stay in the same place.

### Public URL (S09)

- [ ] With port 8080 Public, the link opens the site (after GitHub's one-time "development port" notice); `/.env`, `/.git/config`, `/.mcp.json` and `/package.json` say "Not found".
- [ ] After the PR review, set port 8080 back to Private: the link then asks for a GitHub sign-in.

## Re-check the whole milestone in 5 commands

```bash
pnpm install --frozen-lockfile && pnpm build:site && pnpm test; echo "build+tests exit=$?"
bash .agents/skills/security-gate/check.sh 2; echo "security exit=$?"
bash .agents/skills/a11y-gate/check.sh 2; echo "a11y exit=$?"
bash .agents/skills/update-memory-bank/check.sh; echo "memory bank exit=$?"
git diff --quiet origin/main -- CONTEXT.md && echo "CONTEXT.md unchanged"; sha256sum BRIEFING.md docs/milestone-2/BRIEFING.es.md
```

Expected:
- 15 package tests and 15 site tests pass; `security-gate` 7 PASS; `a11y-gate` 72 PASS; `check.sh` 5 PASS (every `exit=0`).
- `CONTEXT.md unchanged`, and the two briefing hashes from S01 (`de3eef75…` and `562b1ecf…`).

## S11 — Milestone recap and pull request

### Delivered

- "Why Nexova" in 2 columns, as the briefing asks (it was 3 columns): a 2×2 grid from `md:` (768 px), 1 column on phones, in `index.html` and `es/index.html`; `styles.css` rebuilt; the six `screenshots/landing-*` retaken; a row in `content-decisions.md`.
- Final security review: `security-gate` and `/security-review` (no findings), recorded in `security.md`.
- Final accessibility review: `a11y-gate`, recorded in `accessibility.md`.
- `recap.md` (the `milestone-recap` skill) and `report.md` (the deliverable report, same structure as Milestone 1).
- `evaluation.md`: E26 re-verified, S2 done in the PR, P1–P4 updated (P4 Met).
- Links to every report from `docs/milestone-2/README.md` and `docs/README.md`.
- The pull request to `main` (not merged).

### Commands

```bash
pnpm build:site && pnpm test; echo "exit=$?"
bash .agents/skills/security-gate/check.sh 2; echo "security exit=$?"
bash .agents/skills/a11y-gate/check.sh 2; echo "a11y exit=$?"
bash .agents/skills/milestone-recap/check.sh 2; echo "recap exit=$?"
bash .agents/skills/update-memory-bank/check.sh; echo "memory bank exit=$?"
grep -c 'md:grid-cols-2' index.html es/index.html
grep -n 'Pending' docs/milestone-2/evaluation.md
ls docs/milestone-2
gh pr view --json state,baseRefName,headRefName
```

### Expected

- 15 package tests and 15 site tests pass, `exit=0`.
- `security-gate` 7 PASS; `a11y-gate` 72 PASS, 0 FAIL, 0 SKIP; recap "All 6 criteria passed"; memory bank 5 PASS (every `exit=0`).
- At least `1` match of `md:grid-cols-2` per landing page (the "Why Nexova" list).
- No `Pending` rows left.
- `docs/milestone-2` lists `recap.md` and `report.md` next to the other reports.
- The PR is `OPEN`, base `main`, head `milestone-your-companys-public-website`.

## S13 — Fix from the final audit

### Delivered

- The final audit (Run 2) found one FAIL (E3): the memory bank still described the state after S10. `memory-bank/projectbrief.md` and `techContext.md` now describe the state after S11 (`tailwind.css` also scans `motion.js`; 15 site tests; SEC-2 reviewed in S11), and `activeContext.md`, `progress.md` and `systemPatterns.md` say the merge takes the next free step number.
- `evaluation.md`: S2 and S3 set to "Met (S11)" (both are in PR #2).
- `content-decisions.md`: a row for the LinkedIn field placed before Availability (the briefing does not fix the order on screen).
- The teacher-fix example is now `[M2-S14] fix(…): …` in `.agents/rules/git-workflow.md`, the memory bank and the PR #2 description.
- A comment on PR #2 listing the fixed items.
- No site file changed.

### Commands

```bash
bash .agents/skills/update-memory-bank/check.sh; echo "exit=$?"
grep -rnE "S1[12].*(pending|remaining|to do|next)" memory-bank/ | grep -viE "merge|teacher|approval" || echo "no stale step lines"
grep -n "motion.js" memory-bank/techContext.md | head -3
grep -nE "^\| S[23] " docs/milestone-2/evaluation.md
grep -c "M2-S14" .agents/rules/git-workflow.md
gh pr view 2 --json body --jq .body | grep -c "M2-S14"
```

### Expected

- `check.sh` 5 PASS, `exit=0`; `no stale step lines`; `motion.js` listed in `techContext.md`.
- The S2 and S3 rows say "Met (S11)".
- `1` match of `M2-S14` in `git-workflow.md` and `1` in the PR description.

## S12 — Merge (after the instructor's approval)

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._
