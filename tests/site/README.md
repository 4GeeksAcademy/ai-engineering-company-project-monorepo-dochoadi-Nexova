# `tests/site` — public website tests

Automated tests for the Milestone 2 public website (`index.html`, `application.html`, `validation.js` and the Spanish pages in `es/`).

- **Runner:** Node's built-in test runner (`node:test` and `node:assert`), with no test dependency, like the rest of the monorepo.
- **Run:** `pnpm test:site` from the repository root. It runs `node --test "tests/site/**/*.test.*"`: in Node 24 a bare folder argument (`tests/site/`) is treated as one file and fails, so the quoted glob lets Node find every `*.test.*` file itself.
- **Coming in S06:** one test per validation rule of `BRIEFING.md` (valid and invalid values) and the exact English and Spanish error messages.

The page-level accessibility and security checks are not here: they run with the `a11y-gate` and `security-gate` skills in `.agents/skills/`.
