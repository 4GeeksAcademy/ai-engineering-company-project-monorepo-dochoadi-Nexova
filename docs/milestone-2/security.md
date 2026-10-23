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
