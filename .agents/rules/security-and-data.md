---
description: Secrets, multi-tenant isolation, personal data (GDPR) and untrusted input rules for Nexova code and data.
alwaysApply: true
---

Scope: always active

## Secrets

1. Keep secrets only in `.env` files. Version a `.env.example` with every variable name and a placeholder value.
2. Never commit `.env`, `*.pem`, `*.key` or personal files (`*.rtf`); `.gitignore` already excludes them. Before committing, check `git status --short` for any of them.
3. Never write an API key, token or password in code, docs, tests or commit messages.

## Multi-tenant isolation

4. Every client-company record (tickets, knowledge base cases, vacancies, candidates, CVs) carries a `tenant_id`.
5. Filter by `tenant_id` in the data layer: in the SQL query and in the vector store query. Never rely only on a prompt instruction to separate tenants. Nexova serves several technology, retail and finance client companies, and their data must never mix.

## Personal data (GDPR)

6. Never commit real PII: no real CVs, tickets, candidate or employee data. Use synthetic or anonymised data only, in `data/`, and document its origin in the folder README.

## Untrusted input

7. Treat ticket and CV content as untrusted input: pass it to the LLM delimited as data, never concatenated as instructions, and validate model output against a schema before acting on it (prompt-injection risk).

## Decision support, not automated decisions

8. The CV–Vacancy Matching Agent ranks and explains candidates; it never auto-rejects one. The selection consultant always makes the final decision (GDPR Article 22).
9. Low-confidence or sensitive support cases escalate to a human (Level 2); a wrong Level 1 answer is worse than a slower one.

## Web

10. No secrets in code or in git history. A leaked secret is rotated, not just deleted.
11. Never pass user input to `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` or `eval`; write text with `textContent`.
12. Every HTML page declares a Content-Security-Policy (`<meta http-equiv="Content-Security-Policy">`).
13. External links opened in a new tab (`target="_blank"`) use `rel="noopener noreferrer"`.
14. No third-party script without Subresource Integrity (`integrity` + `crossorigin`).
15. No personal data in `localStorage`, `sessionStorage`, cookies or URLs.
16. Static servers never list directories or serve dotfiles (`http-server -d false --no-dotfiles`). In `http-server` 14.1.1, `--no-dotfiles` only hides dotfiles from listings and still serves them by direct URL, so the server must not serve the repo root as is (finding SEC-1 in `docs/milestone-2/security.md`).

## Forms

17. Client-side validation is UX, not security. Any future backend validates every field again.
18. Form data never leaves the browser until a backend exists: no `fetch`, `XMLHttpRequest` or third-party form service; submission is simulated.

## LLM and agents (later milestones, OWASP LLM Top 10)

19. Ticket and CV content is untrusted input (prompt injection); see rule 7.
20. Tenant filtering happens in the data layer; see rule 5.
21. Each agent has a tool allowlist with least privilege.
22. Sensitive actions (sending email, changing a candidate's status, writing to a CRM) need human confirmation.
23. Outputs are checked for leakage (other tenants' data, personal data, secrets, system prompts) before being shown.
24. Every agent decision is logged (`systemPatterns.md`, pattern 6).

## Public repo

25. The repository is public: never commit IP addresses, server hostnames, URLs of other projects, passwords or security incidents.

## Free tools only

26. Every tool, service, API, MCP server and library used in this project must be free to use (open source, or a free tier with no payment). If something is usually paid, use a free alternative or a mock and record the decision.

## MCP servers

27. Only official or well-known servers, with exact pinned versions (never `@latest`).
28. Least privilege: read-only tokens where possible, and each future product agent gets its own tool allowlist.
29. Secrets only through Codespaces secrets and environment variables (e.g. `${CONTEXT7_API_KEY}`), never in `.mcp.json` or the repo.
30. Review a server's source and permissions before adding it, as with vendored skills.
31. Never configure URLs or credentials of other projects (the repo is public).

## Verification

32. Run the `security-gate` skill (`.agents/skills/security-gate/check.sh <milestone>`) before every PR and at the end of every milestone; it must exit 0.
