---
name: security-gate
description: Virtual CISO gate. Verify that the branch leaks no secrets or infrastructure details, has no high or critical dependency vulnerabilities, serves the static site safely and keeps site pages and validation.js free of unsafe patterns. Use before every pull request and at the end of every milestone.
---

## Goal

Prove, with a command, that a branch meets the project's security policy (`.agents/rules/security-and-data.md`) before it reaches a pull request.

## When to use it

- Before every pull request (pre-commit workflow in `AGENTS.md`, together with `a11y-gate`).
- At the end of every milestone, before the `milestone-recap` skill.
- After adding a dependency, an MCP server, a site page or any script that handles user input.

## Inputs

| Name | Source | Format |
| --- | --- | --- |
| `n` | the milestone number (e.g. `2`) | integer, first argument of `check.sh` |
| `tracked_files` | `git ls-files` / `git grep` on the working tree | text |
| `history` | `git log -p --all` | text |
| `audit` | `pnpm audit --audit-level high` | text, exit code |
| `site` | `*.html` at the root, `es/*.html`, `validation.js` | HTML / JavaScript |
| `security_review` | the result of Claude Code's built-in `/security-review` on the branch | text |

## Steps

1. Run `bash .agents/skills/security-gate/check.sh <n>` from the repo root.
2. For every `FAIL`, find the cause. Fix it only if it belongs to the current step; otherwise record it as a finding (severity, file, description, proposed fix, effort) and ask the developer.
3. Run Claude Code's built-in `/security-review` on the branch (it reviews the branch's pending changes against `main`). If the agent cannot invoke it, ask the developer to run it and paste the result.
4. Write or update `docs/milestone-<n>/security.md`: date, the `check.sh` output, the `/security-review` result, and the findings table.
5. Rerun `check.sh` until it exits 0, or until every remaining `FAIL` is an accepted finding approved by the developer.

## Output

- `docs/milestone-<n>/security.md`, with the `check.sh` output, the `/security-review` result and the findings.
- The `check.sh` output, pasted in the PR description.

## Acceptance criteria

Each criterion is checked by `check.sh`, in this order. Every line prints `PASS`, `FAIL` or `SKIP`; the script exits 0 only when there is no `FAIL`.

1. No secret patterns in tracked files (private key blocks, `sk-` / `sk-ant-` keys, `ghp_` / `github_pat_` tokens, `AKIA` access keys, password assignments) and no tracked `.env` files (`.env.example` is allowed).
2. No secret patterns in the full git history (`git log -p --all`).
3. No IPv4 addresses (other than `127.0.0.1` and `0.0.0.0`) and no Easypanel host URLs (`<name>.easypanel.host`) in tracked files. The bare domain name in documentation is not a host URL and is not flagged. Generated Lighthouse reports (`docs/milestone-<n>/lighthouse/`) are skipped by the IPv4 scan, because browser version strings (a "Chrome/" version with four dotted numbers) and SVG path data look like addresses (developer's decision, M2-S08).
4. `pnpm audit --audit-level high` reports no high or critical vulnerabilities.
5. The static site server is safe: `pnpm build:site` copies only the public allowlist into `dist/`, then `npx http-server@14.1.1 dist -p 8099 -a 127.0.0.1 -d false -c-1` (the documented site command, on the gate's own port) is started temporarily, and `/.env`, `/.git/config`, `/.mcp.json` and `/memory-bank/` must not return `200`. The server is stopped afterwards. The repo root is never served: in `http-server` 14.1.1, `--no-dotfiles` still serves dotfiles by direct URL (SEC-1).
6. `validation.js` uses none of `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, `document.write`, `localStorage`, `sessionStorage`, `fetch` or `XMLHttpRequest`. `SKIP` if the file does not exist yet.
7. Every site page (`*.html` at the root and `es/*.html`) has a `<meta http-equiv="Content-Security-Policy">`, and every `target="_blank"` link has `rel="noopener noreferrer"`. `SKIP` if there is no HTML yet.

## Out of scope

- Fixing findings in code outside the current step: they are reported, and the developer approves fixes separately.
- Penetration testing, load testing or scanning deployed infrastructure.
- LLM and agent controls (prompt injection, tool allowlists): they are policy in `.agents/rules/security-and-data.md` and get their own checks when agents exist.
- This skill's own folder is excluded from the secret scans in criteria 1–2, because it documents the patterns.
