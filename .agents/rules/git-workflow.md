---
description: Branching, commit naming, PR checklist and history rules for every change in the Nexova monorepo.
alwaysApply: true
---

Scope: always active

## Branches and commits

1. Work on a branch, never on `main`. Milestone work goes on the milestone branch (Milestone 1: `chore/hito-1-ai-setup`).
2. Make one commit per step. Never mix changes from two steps in one commit.
3. Run `git status --short` before committing and stage only the files of the current step.

## Commit naming

This convention applies to all milestones, not only Milestone 1.

- **Format:** `[M<milestone>-S<NN>][E<n>] <type>(<scope>): <imperative English description>`
- **`M<milestone>-S<NN>`:** milestone number and two-digit step number; always present for milestone work (e.g. `M1-S04`, `M2-S01`).
- **`[E<n>]`:** the evaluation criteria covered by the commit, as defined in `docs/milestone-<n>/evaluation.md`; omit when the step covers none, repeat when it covers several (e.g. `[E5][E6]`).
- **`<type>`:** one of `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.
- **One commit per step**, on the milestone branch.
- **Commits outside a milestone** use only `<type>(<scope>): <description>`.
- **Example:** `[M1-S04][E3] docs(agents): add development rules with explicit scope`.

## Pull request checklist

Every PR description includes:

- [ ] **Summary:** what changed and why, in a few lines.
- [ ] **Evaluation criteria covered:** the `E<n>` IDs from `docs/milestone-<n>/evaluation.md`, with the matrix row updated.
- [ ] **Check output:** the verification commands that were run and their output.
- [ ] **Screenshots** for any change under `uis/` (website on port 3000, backoffice on port 3001).
- [ ] **Open questions:** anything still undecided (e.g. the Megan Clarke / Marcos Ibáñez Sales discrepancy in `CONTEXT.md`).

## History

- Never merge your own PR; a reviewer merges it.
- Never rewrite published history: no `git push --force`, no `git rebase` or `git commit --amend` on pushed commits. Fix mistakes with a new commit.
- The coding agent does not push from this environment (no GitHub credentials); the developer pushes manually after each step.
