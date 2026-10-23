# `tests/site` — public website tests

Automated tests for the Milestone 2 public website (`index.html`, `application.html`, `validation.js` and the Spanish pages in `es/`).

- **Runner:** Node's built-in test runner (`node:test` and `node:assert`), with no test dependency, like the rest of the monorepo.
- **Run:** `pnpm test:site` from the repository root. It runs `node --test "tests/site/**/*.test.*"`: in Node 24 a bare folder argument (`tests/site/`) is treated as one file and fails, so the quoted glob lets Node find every `*.test.*` file itself.
- **`validation.test.cjs`** (S06, 14 tests): every validation rule of `BRIEFING.md` with valid and invalid values (including the edge values), every English and Spanish error message and the success message compared with the text parsed from `BRIEFING.md` and `docs/milestone-2/BRIEFING.es.md`, and `validateAll` on an empty and a complete application. It loads `../../validation.js` with `require`, the same file the browser runs.
- The root `pnpm test` also runs these tests.

The page-level accessibility and security checks are not here: they run with the `a11y-gate` and `security-gate` skills in `.agents/skills/`.
