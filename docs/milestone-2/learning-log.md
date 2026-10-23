# Milestone 2 — Learning log

A plain-language log of Milestone 2, written for the developer.
One section is appended at the end of every step (S01…S10), before that step's commit.
Each section says what was done, why it matters, what was learned and how to check it yourself.

## S01 — Setup: branch, briefing and evaluation matrix (2026-10-23)

**What was done**
- Created a separate workspace for this milestone (a "branch" called `milestone-your-companys-public-website`), named after the milestone title, as the instructor asked.
- Added the official course briefing as `BRIEFING.md`, plus its Spanish version, downloaded straight from 4Geeks and checked with a fingerprint so we know nobody changed a single character.
- Wrote down the few places where the website will say something different from the briefing, and why (for example "Spanish and US markets" instead of "Latin American market", because Nexova works from Valencia and Miami).
- Created the evaluation checklist: the 30 criteria the teacher will grade, the list of deliverables and our own standards, all marked "Pending" for now.
- Recorded the instructor's Milestone 1 feedback and what we changed because of it: branch names, where the briefing goes, and the rule that the AI assistant never merges (joins) a pull request into the main version.
- Updated the project notes (the "memory bank"), which still said Milestone 1 was waiting for review although it was already merged.

**What I learned**
- **Branch:** a parallel copy of the project where you can work without touching the main version. When the work is approved, it is "merged" back into `main`.
- **SHA-256 fingerprint:** a long code calculated from a file's content. If even one letter changes, the code changes completely, so it proves the briefing is the original.
- **Evaluation matrix:** a table that links each grading criterion to the files that prove it and the command to check it, so nobody has to guess whether something is done.
- **Merge commit vs squash:** a merge commit keeps every step's commit visible in the history; "squash" would flatten them into one and hide the step codes.

**How to check it yourself**
- Open `BRIEFING.md` at the top of the project and read what the website must contain.
- Open `docs/milestone-2/evaluation.md` and look at the 30 criteria, all "Pending".
- Open `docs/milestone-1/instructor-feedback.md` to see the teacher's comments and our response.

**Decisions or open questions**
- Decided (by the developer): official briefing kept unmodified; English site at the root and Spanish under `es/`; site files at the top folder of the project; compiled Tailwind; served on port 8080; exactly the 11 form fields; a static hero.
- Open: the briefing calls itself "Milestone 1" (the course's numbering) and its link to the Spanish version does not work in our repo. We cannot fix either, because the file must stay unmodified.

**Commit:** `[M2-S01] docs: start Milestone 2 with official briefing, evaluation matrix and conventions`
