# Milestone 2 — Verification guide

How to re-check every step of Milestone 2 (S01–S11). Each section is filled in when its step is done: what was delivered, the commands to run from the repo root, and the expected output. Criteria IDs refer to the [evaluation matrix](./evaluation.md).

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

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S05 — Application form markup

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S06 — Form validation

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S07 — Accessibility, security and performance re-check

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S08 — Performance evidence and public URL

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S09 — To be defined

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S10 — Milestone recap

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._

## S11 — Pull request and merge

### Delivered

_To be filled in this step._

### Commands

_To be filled in this step._

### Expected

_To be filled in this step._
