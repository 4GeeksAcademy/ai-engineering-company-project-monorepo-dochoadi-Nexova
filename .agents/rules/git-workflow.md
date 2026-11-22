---
description: Branching, commit naming, PR checklist and history rules for every change in the Nexova monorepo.
alwaysApply: true
---

Scope: always active

## Branches and commits

1. Work on a branch, never on `main`. Milestone work goes on the milestone branch (Milestone 1: `chore/hito-1-ai-setup`; Milestone 2: `milestone-your-companys-public-website`; Milestone 3: `feature/domain-models`, named by the brief).
2. Make one commit per step. Never mix changes from two steps in one commit.
3. Run `git status --short` before committing and stage only the files of the current step.
4. **Approval before commit:** a step ends with its changes staged, not committed, plus a review patch. The agent commits and pushes to the milestone branch only when the developer sends that step's commit prompt, after approving the result, and only if the staged tree is the approved one. Fixes requested in the review are made before the commit, so there is still one commit per step.

## Milestone lifecycle

1. **Start:** `git switch main && git pull`, then create the milestone branch from the up-to-date `main`. Use the branch name the brief asks for; only if the brief names none, use the milestone title from the brief in lowercase with hyphens (M1 was `chore/hito-1-ai-setup`; M2 was `milestone-your-companys-public-website`, from "Milestone — Your Company's Public Website"; M3 is `feature/domain-models`, named by the brief). Put the milestone briefing in `BRIEFING.md` at the root, unmodified.
2. **Work:** one commit per step on that branch, then a PR to `main`.
3. **Review:** the PR stays open until the teacher has reviewed and validated it. Any fix the teacher requests goes on the same branch as an extra step commit (e.g. `[M<n>-S<next>] fix(<scope>): …`; in Milestone 3 the next one after the PR is `[M3-S13] fix(…): …`), never directly on `main`.
4. **Merge only after validation:** The coding agent never merges a PR. The developer merges it, only when they decide to, after the instructor has approved it; recording the approval in the PR is recommended, not required. Nothing is merged into `main` until the developer explicitly asks for it (after the instructor's approval); then "Create a merge commit". No step prompt merges, rebases onto or pushes to `main`, and finishing all steps does not mean merging.
   - Exception before this wording (aligned in M3-S01): Milestone 2 was approved through the 4Geeks platform before its 2026-11-16 merge, with no comment in PR #2 (developer's choice).
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

- The coding agent never merges a PR. The developer merges it, only when they decide to, after the instructor has approved it; recording the approval in the PR is recommended, not required.
- Never rewrite published history: no `git push --force`, no `git rebase` or `git commit --amend` on pushed commits. Fix mistakes with a new commit.
- The coding agent may push its own milestone branch after each step's approved commit (it works in a GitHub Codespace with credentials). It never pushes to `main`, never force-pushes and never merges a PR.
