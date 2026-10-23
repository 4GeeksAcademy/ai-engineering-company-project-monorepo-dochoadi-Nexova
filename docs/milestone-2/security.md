# Milestone 2 — Security (CISO gate)

Results of the `security-gate` skill (`.agents/skills/security-gate/`) and of Claude Code's built-in `/security-review` for Milestone 2. Policy: [`.agents/rules/security-and-data.md`](../../.agents/rules/security-and-data.md). Findings are reported here and fixed only after the developer approves them.

## Baseline: Milestone 1

Run on 2026-10-23 (S02), on the branch `milestone-your-companys-public-website` after the Next.js patch below. No site page or `validation.js` exists yet.

### `security-gate` output

```text
$ bash .agents/skills/security-gate/check.sh 2
security-gate — Milestone 2
PASS [1] no secret patterns or .env files in tracked files
PASS [2] no secret patterns in the full git history (git log -p --all)
PASS [3] no IPv4 addresses (except 127.0.0.1 / 0.0.0.0) or easypanel.host URLs in tracked files
FAIL [4] pnpm audit --audit-level high reports no high or critical vulnerabilities:  More info https://github.com/advisories/GHSA-vfj7-8cjw-p6xm  Severity: 1 high
FAIL [5] static server (http-server -d false --no-dotfiles) does not serve /.env, /.git/config or /memory-bank/: /.git/config=200
SKIP [6] validation.js has no innerHTML, outerHTML, insertAdjacentHTML, eval, document.write, localStorage, sessionStorage, fetch or XMLHttpRequest: validation.js does not exist yet
SKIP [7] every site page has a CSP meta tag and rel="noopener noreferrer" on target="_blank" links: no site HTML pages yet
security-gate failed: 2 criterion/criteria with FAIL
exit=1
```

Both FAILs are real findings in existing tools, not in S02 code (SEC-1 and SEC-2 below). They are reported, not fixed, as S02 requires; the gate must exit 0 before the Milestone 2 pull request.

### `/security-review`

Run by the coding agent on 2026-10-23 on the branch's pending changes against `main` (S01 commit plus the S02 working tree: both gate scripts, `a11y_check.py`, `requirements.txt`, `.mcp.json`, the `post-create.sh` line and the Next.js lockfile change). Result: **no findings with confidence ≥ 8**. The milestone number is validated as digits, every other value is a constant, the temporary server binds to `127.0.0.1`, screenshot names are sanitised, versions are pinned and there are no secrets. Below the reporting bar and listed here as SEC-6: `--no-sandbox` on `chrome-devtools-mcp`.

### Manual review

- `.devcontainer/post-create.sh`: SEC-4.
- `.agents/skills/webapp-testing/scripts/with_server.py`: SEC-5.
- Unsafe DOM APIs in `uis/website`, `uis/backoffice` and `packages/`: the only hit is `dangerouslySetInnerHTML` for the JSON-LD block in `uis/website/app/layout.tsx:29` (SEC-7). No `innerHTML`, `eval`, `document.write`, storage, `fetch` or `target="_blank"` links.
- Security headers of the Next.js apps: SEC-3.

### Findings

| ID | Severity | File | Description | Proposed fix | Effort |
| --- | --- | --- | --- | --- | --- |
| SEC-1 | High | `.agents/rules/security-and-data.md` (rule 16), planned S03 server command | `http-server@14.1.1 --no-dotfiles` only hides dotfiles from directory listings; it still serves them by direct URL. Verified: `/.git/config` and `/.mcp.json` return `200`; any `.env` would too (`/.env` returned `404` only because none exists). Served from the repo root, every file of the repo (including untracked ones such as `test-results/`) is reachable, and in S08 the port becomes a public URL. | Serve only the site: a small copy step puts `index.html`, `application.html`, `validation.js`, `styles.css`, `assets/` and `es/` into a git-ignored folder (e.g. `dist/site/`), and `http-server` serves that folder; then update rule 16 and gate criterion 5 to test the real command. Decide in S03. | S (1–2 h) |
| SEC-2 | Low (advisory: high) | `pnpm-lock.yaml` via `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces` | `braces` ≤ 3.0.3, GHSA-vfj7-8cjw-p6xm (stack-exhaustion denial of service with deeply nested patterns). No patched version exists. Development-only (ESLint), patterns come from our own config, so the real risk is low; it still blocks gate criterion 4. | Accept as a documented exception: add the advisory to `pnpm.auditConfig.ignoreGhsas` in the root `package.json` (needs approval: protected file), and remove it when a patch ships. | XS (15 min) |
| SEC-3 | Medium | `uis/website/next.config.ts`, `uis/backoffice/next.config.ts` | The M1 apps send no Content-Security-Policy or other security headers (`X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`), against rule 12. | Add `headers()` in both `next.config.ts` with a CSP (nonce for Next.js inline scripts and the JSON-LD block) and the basic headers. Before any public deployment. | M (2–4 h) |
| SEC-4 | Medium | `.devcontainer/post-create.sh:15,20,26` | Unpinned installs on every Codespace build: `pip install --user uv`, `pip install --user playwright`, `npm install -g @anthropic-ai/claude-code`. A compromised or breaking release would enter the dev environment silently. | Pin exact versions (as with pnpm and the MCP servers). Edit `.devcontainer/` in its own commit, outside a running step. | XS (15 min) |
| SEC-5 | Low | `.agents/skills/webapp-testing/scripts/with_server.py:69-74` (vendored, unchanged) | Starts server commands with `subprocess.Popen(..., shell=True)`. The commands are the developer's or agent's own CLI arguments, not user input, so there is no injection path today; it would become one if an agent built the command from untrusted text (a ticket, a CV). | Note in `.agents/skills/webapp-testing/SOURCE.md`: only literal, hand-written commands. Keep the vendored file unchanged. | XS (10 min) |
| SEC-6 | Low | `.mcp.json` (`chrome-devtools`) | `--chrome-arg=--no-sandbox` turns off Chromium's sandbox. Exploiting it needs a browser exploit served by a page the agent opens. | Only point the dev MCP browsers at `localhost` and trusted pages; try removing the flag and keep it only if Chromium does not start without it. | XS (15 min) |
| SEC-7 | Low (info) | `uis/website/app/layout.tsx:29` | `dangerouslySetInnerHTML` for the JSON-LD block. Data is static and `<` is escaped, so it is safe today. | Keep the data static; never put user input in it. No change. | — |

The missing backoffice authentication is already an open question in `memory-bank/activeContext.md`; the backoffice must not be exposed publicly until it is decided.

### Fixed in S02

| Package | Old → new | Advisories |
| --- | --- | --- |
| `next` and `eslint-config-next` in `uis/website` and `uis/backoffice` | 16.4.0 → 16.4.1 (lowest patched version in the 16.4 line) | GHSA-673q-mjm6-r5xr (critical: remote code execution in `use cache` functions returning typed arrays); GHSA-2464-fhr4-w9xw (critical: remote code execution in the Image Optimization API with SVG files); GHSA-p3m5-59mp-jv5r / CVE-2026-94482 (high: denial of service in the App Router with Server Actions) |

After the patch: `pnpm audit --prod` reports no known vulnerabilities, `pnpm install --frozen-lockfile` passes, and lint, typecheck, build and tests (15/15) pass; both apps start and return `200` on ports 3000 and 3001.

## S03 — Site server, accepted exceptions and gate run

Run on 2026-10-23 (S03), after the page skeleton, the Tailwind build and the `dist/` server were added.

### Decisions applied (approved by the developer after S02)

- **SEC-1 — resolved.** The site files stay at the root (the brief requires them there), but the server never serves the repo root. `pnpm build:site` compiles the CSS and `scripts/build-site.mjs` copies **only** an allowlist (`index.html`, `application.html`, `validation.js`, `styles.css`, `assets/`, `es/`, `robots.txt`, `sitemap.xml`; missing entries are skipped) into the git-ignored `dist/`, skipping dotfiles and symlinks. The documented command serves `dist/`: `pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false`. Gate criterion 5 now builds and serves `dist/` the same way (on its own port, `127.0.0.1:8099`) and also probes `/.mcp.json`. Verified: `/.env`, `/.git/config`, `/.mcp.json`, `/memory-bank/`, `/BRIEFING.md` and `/package.json` all return `404`; a symlink `es/x.html → ../.mcp.json` is not copied.
- **SEC-2 — accepted exception** (see below).
- **SEC-3, SEC-5, SEC-6, SEC-7:** not fixed in this milestone's site steps. Status: **Planned: M1 hardening (separate change, needs approval)**.
- **SEC-4:** fixed in S09, together with the other `.devcontainer/` changes.

### Accepted exceptions

| ID | Advisory | Where | Why it is accepted | Mechanism | Review |
| --- | --- | --- | --- | --- | --- |
| SEC-2 | GHSA-vfj7-8cjw-p6xm, `braces` ≤ 3.0.3 (audit severity high; real risk low) | `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`, in `uis/website` and `uis/backoffice` | Development-only ESLint tooling, not shipped to the browser (the public site has no dependency at runtime); the patterns come from our own config; no fixed version is published. | `auditConfig.ignoreGhsas` in `pnpm-workspace.yaml`. pnpm 12 ignores the old `"pnpm"` field in `package.json` (tested: `pnpm audit` still failed with it), so the setting lives where pnpm reads it. `pnpm audit --audit-level high` now prints `1 ignored: 1 high`, exit 0. | Again in S10; remove the entry as soon as a fixed `braces` (or a `micromatch`/`fast-glob` without it) is published. |

### Gate fix: criterion 3 matched its own documentation

Criterion 3 searched tracked files for the bare word `easypanel.host`. In S02 it passed only because the gate's files were not committed yet; once tracked, it matched its own `SKILL.md`, `check.sh` and the S02 output pasted above. The pattern is now `[A-Za-z0-9-]+\.easypanel\.host`: a real host URL always has a name before the domain, while the bare word in documentation does not. Negative test: a temporary tracked line with a made-up host URL (a name, then the Easypanel domain) is still reported.

### `security-gate` output

```text
$ bash .agents/skills/security-gate/check.sh 2
security-gate — Milestone 2
PASS [1] no secret patterns or .env files in tracked files
PASS [2] no secret patterns in the full git history (git log -p --all)
PASS [3] no IPv4 addresses (except 127.0.0.1 / 0.0.0.0) or easypanel.host URLs in tracked files
PASS [4] pnpm audit --audit-level high reports no high or critical vulnerabilities
PASS [5] static server (pnpm build:site, then http-server dist -d false) does not serve /.env, /.git/config, /.mcp.json or /memory-bank/
SKIP [6] validation.js has no innerHTML, outerHTML, insertAdjacentHTML, eval, document.write, localStorage, sessionStorage, fetch or XMLHttpRequest: validation.js does not exist yet
PASS [7] every site page has a CSP meta tag and rel="noopener noreferrer" on target="_blank" links (4 pages)
security-gate passed (no FAIL)
exit=0
```

### `/security-review`

Run by the coding agent on 2026-10-23 on the branch against `main`, including the uncommitted S03 work. Result: **no findings with confidence ≥ 8**. Below the bar:

- symlinks inside `es/` or `assets/` would have been copied into `dist/` (confidence 2/10, needs commit access). Hardened anyway: `build-site.mjs` now skips symlinks.
- `a11y-gate` still serves the repo root on `127.0.0.1` for the few seconds it runs (confidence 1/10). It is loopback-only and temporary, and those files are already public in the repo. Possible follow-up: point it at `dist/` like `security-gate`. This needs approval, because it changes a skill outside this step.

Checked and clean: the four pages (no inline scripts or handlers, strict CSP meta, `rel="noopener noreferrer"` on the two external links), the two SVGs (no script or external references), the pinned Tailwind packages and `allowBuilds`.

## S04 — Landing page

Run on 2026-10-23 (S04), after the landing content (both languages), the office photos and the `a11y-gate` change.

- **`a11y-gate` now serves `dist/` (approved by the developer after S03):** its `check.sh` runs `pnpm build:site` and starts `npx http-server@14.1.1 dist -p 8099 -a 127.0.0.1 -d false`, the documented site command on the gate's own port, exactly like `security-gate`. Neither gate serves the repo root any more, which closes the confidence-1/10 note from the S03 `/security-review`.
- **The S03 deviations were approved as done.** Where each is recorded:

  | Deviation | Recorded in |
  | --- | --- |
  | SEC-2 exception in `pnpm-workspace.yaml` (`auditConfig`) | this file, S03 "Accepted exceptions"; `techContext.md` |
  | `@parcel/watcher` in `allowBuilds: false` | `techContext.md` (pnpm settings); `pnpm-workspace.yaml` comment |
  | `security-gate` criterion 3: real `<name>.easypanel.host` addresses only, with its negative test | this file, S03 "Gate fix"; `security-gate/SKILL.md` |
  | `test:site` glob | `techContext.md` (scripts); `tests/site/README.md` |
  | Hidden mobile-menu panel (`hidden group-open:block`) | `accessibility.md` (S03); `techContext.md` (pages) |
  | Symlinks skipped in `build-site.mjs` | this file, S03 `/security-review`; `techContext.md` (serving) |
  | Path-based wordmark SVG | `techContext.md` (pages) |

- **The new content adds no attack surface:**
  - The JSON-LD block is static data (`type="application/ld+json"` is not executed, so `script-src 'self'` still holds). There are no inline scripts or event handlers, no forms, and no new external origins.
  - The photos are local WebP files.
  - `mailto:` / `tel:` links carry only the briefing's public contact details.
- **Gate results:** `security-gate` exit 0 (criteria 1–5 and 7 PASS, 6 SKIP: no `validation.js` yet).

## Production notes

Not blockers for this academic milestone; to resolve before any real launch.

| Topic | Note | When |
| --- | --- | --- |
| Google Fonts (Instrument Sans) | Loading the font from Google's servers sends each visitor's IP address to Google, a GDPR concern in the EU (Nexova is in Valencia). Before any real EU launch, self-host the font file in `assets/` (Instrument Sans is open source, SIL Open Font License) and drop the two Google origins from the CSP. Kept for now (developer's decision). | S07 decides whether self-hosting is also needed for the PageSpeed score. |
| Office photo licences | `valencia.webp` and `miami.webp` come from the M1 design (`uis/website/public/images/`); their licence is not confirmed, and the Miami photo shows identifiable people (open question in `memory-bank/activeContext.md`). | Before publishing. |

## S05 — Form markup

Run on 2026-10-23 (S05) with the form markup on both form pages and absolute `hreflang`/canonical links on all four pages.

- **The form sends nothing to a third party:** `<form id="talent-form" action="#" method="post">`, with no `fetch`, no third-party form service and no JavaScript yet (S06 intercepts the submit and simulates it). `method="post"` keeps the answers out of the URL (rule 15): with `get`, a native submit would put the name, email and phone in the address bar and the server log.
- **Without JavaScript,** the browser validates natively (`required`, `type`, `min`/`max`) and then posts to the page itself (CSP `form-action 'self'`). The static server stores nothing and only serves files. This is acceptable for a demo with no backend; a real backend validates every field again (rule 17).
- **No `novalidate` in the HTML:** `validation.js` sets it when it loads (S06), so native validation still protects users who have JavaScript off.
- **Gate results:** `security-gate` exit 0 (criteria 1–5 and 7 PASS, 6 SKIP: no `validation.js` yet).
- **Production note update:** the office photo licence question is closed. The developer confirmed on 2026-10-23 that the project may use both photos, including the people visible in the Miami photo (`content-decisions.md`).
