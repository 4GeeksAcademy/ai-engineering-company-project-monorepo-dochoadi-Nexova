# AGENTS.md — Nexova monorepo

This monorepo builds the AI systems of Nexova Solutions, a human resources consulting and talent acquisition firm based in Valencia (Spain) with an office in Miami: agents, automations and apps for Talent Selection, Customer Support, Corporate Training, Sales, internal HR and Executive Direction. This file is the mandatory operating protocol for any coding agent working in this repo (Claude Code, Cursor, Copilot or any other).

## At the start of every session

Read, in this order:

1. `memory-bank/projectbrief.md`
2. `memory-bank/productContext.md`
3. `memory-bank/techContext.md`
4. `memory-bank/systemPatterns.md`
5. `memory-bank/activeContext.md`
6. `memory-bank/progress.md`
7. The always-active rules in `.agents/rules/`, plus any rule whose `globs` match the files you will touch, plus `hr-domain-glossary.md` when naming domain entities.
8. `CONTEXT.md` when a task touches business content.

## Before writing code

- Confirm the target folder using the folder READMEs and `.agents/rules/monorepo-structure.md`.
- If the task is ambiguous, ask before coding.

## Mandatory workflow before every commit

Follow these steps in order. No step may be skipped.

1. Work on a dedicated branch (`feat/…`, `fix/…`, `chore/…`, `docs/…`), never on `main`.
2. Run the project checks with zero errors: `pnpm lint`, `pnpm typecheck` and `pnpm build`. Until the pnpm workspace exists (milestone 1, step 8), run the checks defined in the current task instead.
3. Run the affected tests with `pnpm test`; all must pass.
4. Review the full staged diff (`git diff --staged`): no secrets, no `.env` files, no real personal data, no files unrelated to the task.
5. Update the memory bank with the `update-memory-bank` skill (`.agents/skills/update-memory-bank/`) and make sure its `check.sh` exits with code 0.
6. Commit once per step, following the commit naming convention below.
7. Deliver through a pull request with the checklist from `.agents/rules/git-workflow.md`. Never merge your own PR.

## Commit naming

This convention applies to all milestones, not only Milestone 1.

- **Format:** `[M<milestone>-S<NN>][E<n>] <type>(<scope>): <imperative English description>`
- **`M<milestone>-S<NN>`:** milestone number and two-digit step number; always present for milestone work (e.g. `M1-S04`, `M2-S01`).
- **`[E<n>]`:** the evaluation criteria covered by the commit, as defined in `docs/milestone-<n>/evaluation.md`; omit when the step covers none, repeat when it covers several (e.g. `[E5][E6]`).
- **`<type>`:** one of `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.
- **One commit per step**, on the milestone branch.
- **Commits outside a milestone** use only `<type>(<scope>): <description>`.
- **Example:** `[M1-S04][E3] docs(agents): add development rules with explicit scope`.

## Do not modify without explicit confirmation from the developer

- `CONTEXT.md` and `Company-choice.md`: business source of truth.
- `AGENTS.md`, `CLAUDE.md` and `.agents/`: the rules themselves.
- `.github/`, `.devcontainer/` and `infra/`: CI, environment and deployment.
- `.gitignore`, `pnpm-lock.yaml`, any `package.json` or `pyproject.toml`: dependencies and repo hygiene.
- `data/raw/`: original source data.
- `/agents`, `/skills` and `/mcps`: product code, out of scope unless the task says so.
- Any `.env*` file: secrets.

## Stop and ask when

- Business requirements are ambiguous (e.g. the Sales manager discrepancy recorded in `memory-bank/activeContext.md`).
- A task needs a new dependency.
- A change affects the architecture (new top-level folder, new service, new datastore).
- Anything involves personal data (candidates, employees, end customers).
- An action is irreversible: deleting files, rewriting history, force pushing.
- A check fails and you do not know why.

## Never

- Push to `main`.
- Rewrite or force-push history.
- Add a dependency without justification.
- Mix data between tenants: every client-company record carries `tenant_id`, filtered in the data layer (`.agents/rules/security-and-data.md`).
- Send ticket or CV content to an LLM without treating it as untrusted input.
- Let a CV ranking auto-reject a candidate; the selection consultant decides (GDPR Art. 22).

## Where things are

| Path | What it is for |
| --- | --- |
| `memory-bank/` | Persistent project memory: business context, technical context, patterns, current focus and progress. |
| `.agents/rules/` | Coding-agent rules, each with an explicit scope (always active, by `globs`, or requested by the agent). |
| `.agents/skills/` | Coding-agent skills, such as `update-memory-bank`. |
| `docs/milestone-1/evaluation.md` | Milestone 1 evidence matrix: criteria E1–E9, files, how to verify and result. |
| `CONTEXT.md` | Nexova company briefing: departments, managers, figures and problems. |
