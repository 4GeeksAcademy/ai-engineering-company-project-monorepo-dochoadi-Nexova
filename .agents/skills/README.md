# Coding-agent skills

Skills that coding agents (Claude Code, Cursor, Copilot, etc.) use while working on this repo. They are versioned here because the repo is worked on from GitHub Codespaces, where skills installed on a developer's laptop do not exist. Claude Code discovers them through the `.claude/skills` symlink, which points to this folder.

| Skill | Type | Goal | When to use |
| --- | --- | --- | --- |
| [`update-memory-bank`](./update-memory-bank/SKILL.md) | own | Keep the memory bank in sync with the real state of the repository after every change. | After any feature, architecture decision, stack change or problem found; always before a PR (step 5 of the pre-commit workflow in `AGENTS.md`). |
| [`milestone-recap`](./milestone-recap/SKILL.md) | own | Produce a learning recap of a finished milestone, so the developer can review what was built, why, and what was learned. | At the end of every milestone, before opening its pull request; `check.sh <n>` verifies `docs/milestone-<n>/recap.md`. |
| [`security-gate`](./security-gate/SKILL.md) | own | Virtual CISO gate: prove that a branch leaks no secrets or infrastructure details, has no high or critical dependency vulnerabilities, serves the static site safely and keeps site pages and `validation.js` free of unsafe patterns. | Before every pull request and at the end of every milestone; `check.sh <n>` prints PASS/FAIL/SKIP per criterion; results in `docs/milestone-<n>/security.md`. |
| [`a11y-gate`](./a11y-gate/SKILL.md) | own | Accessibility gate (WCAG 2.2 AA): axe-core and Playwright checks of the site pages at 375/768/1280 px, structure, labels, keyboard, reflow, reduced motion and a forced-colors screenshot. | Before every pull request and at the end of every milestone; `check.sh <n>`; results in `docs/milestone-<n>/accessibility.md`. |
| [`frontend-design`](./frontend-design/SKILL.md) | external | Guidance for distinctive, intentional visual design: aesthetic direction, typography and choices that don't read as templated defaults. | When building new UI or reshaping an existing one (e.g. `uis/website`, `uis/backoffice`). |
| [`webapp-testing`](./webapp-testing/SKILL.md) | external | Interact with and test local web applications using Playwright: verify frontend functionality, debug UI behaviour, capture screenshots and view browser logs. | To check that pages load and to take screenshots for a PR; see its `SOURCE.md` for where to write outputs in this repo. |

External skills are vendored unchanged; each has a `SOURCE.md` with its origin, commit, license and review notes.

## `.agents/skills/` vs `/skills`

`.agents/skills/` holds coding-agent skills: instructions and scripts that help an agent build and maintain this repo, never shipped to Nexova. `/skills` is Nexova product code: reusable capabilities for the product agents that Nexova's teams will use (for example the L1 HelpDesk Support Agent or the CV–Vacancy Matching Agent). Do not mix them.

## Rule

External skills require approval from the developer; awesome-lists are indexes, not installable skills.
