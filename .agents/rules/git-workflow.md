---
description: Branching, commit naming, PR checklist and history rules for every change in the Nexova monorepo.
alwaysApply: true
---

Scope: always active

## Branches and commits

1. Work on a branch, never on `main`. Milestone work goes on the milestone branch (Milestone 1: `chore/hito-1-ai-setup`; Milestone 2: `milestone-your-companys-public-website`).
2. Make one commit per step. Never mix changes from two steps in one commit.
3. Run `git status --short` before committing and stage only the files of the current step.

## Milestone lifecycle

1. **Start:** `git switch main && git pull`, then create the milestone branch from the up-to-date `main`. Use the branch name the brief asks for; only if the brief names none, use the milestone title from the brief in lowercase with hyphens (M1 was `chore/hito-1-ai-setup`; M2 is `milestone-your-companys-public-website`, from "Milestone — Your Company's Public Website"). Put the milestone briefing in `BRIEFING.md` at the root, unmodified.
2. **Work:** one commit per step on that branch, then a PR to `main`.
3. **Review:** the PR stays open until the teacher has reviewed and validated it. Any fix the teacher requests goes on the same branch as an extra step commit (e.g. `[M2-S14] fix(form): …`), never directly on `main`.
4. **Merge only after validation:** the coding agent never merges a PR. The PR is merged only after the instructor has reviewed and approved it: by the instructor, or by the developer once that approval is recorded in the PR (an approving review or a comment).
5. **Next milestone:** only then does the next milestone start again from step 1.

## Milestone merge

- The last step of every milestone is merging the PR into `main` with **"Create a merge commit"** (never squash).
- **Title:** `[M<n>-S<last>][E1]…[E<all>] chore(release): merge Milestone <n> <name> into main (#<PR>)`.
- **Description:** the criteria groups, the evidence path `docs/milestone-<n>/`, and the line "Academic project for 4Geeks Academy: fictional company, no real data."
- M1 was merged with an earlier title format (`[M1] chore: merge …`); history is not rewritten.

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

- The coding agent never merges a PR. A PR is merged only after the instructor has reviewed and approved it: by the instructor, or by the developer once that approval is recorded in the PR (an approving review or a comment).
- Never rewrite published history: no `git push --force`, no `git rebase` or `git commit --amend` on pushed commits. Fix mistakes with a new commit.
- The coding agent may push its own milestone branch after each step's commit (it works in a GitHub Codespace with credentials). It never pushes to `main`, never force-pushes and never merges a PR.
