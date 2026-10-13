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
