# Milestone 1 — Instructor feedback

Feedback received from the instructor on the Milestone 1 pull request (#1), and what was done about each point.

## Original (Spanish, verbatim)

> La infraestructura de agentes está de lujo, sobre todo la skill con su check.sh. Para la próxima, usa el nombre de rama que pide el enunciado (feature/agent-memory-bank) y pon el briefing en BRIEFING.md. Por otro lado, tu AGENTS.md dice que nunca fusiones tu propia PR y la fusionaste tú, revisa eso.

## English translation

> The agent infrastructure is excellent, especially the skill with its check.sh. Next time, use the branch name the brief asks for (feature/agent-memory-bank) and put the briefing in BRIEFING.md. On the other hand, your AGENTS.md says never to merge your own PR and you merged it yourself; review that.

## Actions

| Point | Action taken | Where |
| --- | --- | --- |
| Branch name | From Milestone 2 on, the milestone branch is the name the brief asks for; if the brief names none, it is the milestone title from the brief in lowercase with hyphens (Milestone 2: `milestone-your-companys-public-website`). M1 history (`chore/hito-1-ai-setup`) is not rewritten. | `AGENTS.md` (workflow step 1), `.agents/rules/git-workflow.md`, `memory-bank/systemPatterns.md` |
| Briefing file | Each milestone's briefing lives in `BRIEFING.md` at the repo root. Milestone 2: the official 4Geeks file, unmodified (SHA-256 checked), plus the official Spanish copy in `docs/milestone-2/BRIEFING.es.md`. | `BRIEFING.md`, `docs/milestone-2/content-decisions.md` |
| Merge rule | Clarified: the coding agent never merges a PR. A PR is merged only after the instructor has reviewed and approved it, by the instructor or by the developer once that approval is recorded in the PR (an approving review or a comment). The old "never merge your own PR" wording is replaced. | `AGENTS.md` (workflow step 7), `.agents/rules/git-workflow.md`, `memory-bank/systemPatterns.md` |
| Positive point: skill with `check.sh` | Kept: skills keep a `check.sh` that proves their output. | `.agents/skills/update-memory-bank/`, `.agents/skills/milestone-recap/` |
