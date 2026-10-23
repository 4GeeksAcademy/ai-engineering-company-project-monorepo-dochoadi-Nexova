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

## S02 — CISO security gate and accessibility gate (2026-10-23)

**What was done**
- Wrote down the project's security rules for the website, forms, future AI agents and helper tools. For example: never put secrets in the code, and form data never leaves the browser until there is a real backend (server).
- Wrote accessibility rules (WCAG 2.2 AA, the usual legal standard) grouped by who they help: blind people, deaf people, people who only use a keyboard, older adults, people reading in bright sun, and everyone else.
- Built two automatic checkers, a "security gate" and an "accessibility gate". Each prints PASS or FAIL per rule, and both must pass before every pull request (the request to add our work to the main version).
- Gave the AI assistant three free helper tools ("MCP servers"): a robot browser to fill in the form, browser developer tools to measure speed, and up-to-date documentation for Tailwind.
- Checked the Milestone 1 websites and wrote down every problem found, with how serious it is and how long a fix would take. We only report them for now; you decide what gets fixed.
- Applied one approved urgent fix: Next.js (the framework of the Milestone 1 websites) moved from version 16.4.0 to 16.4.1, which closes two critical and one high security holes.
- This step was interrupted once by a Codespace rebuild before saving; it was resumed and finished without losing any work.

**What I learned**
- **Security gate:** a script that runs the same security checks every time, so safety does not depend on someone remembering to look.
- **Dotfiles:** files whose names start with a dot (like `.env` for passwords, or the `.git` folder with the project history). The checker found that our planned web server option `--no-dotfiles` only hides them from folder lists: anyone who types the exact address can still download them. That is why we test with a script instead of trusting an option's name.
- **Colour contrast:** how much the text stands out from its background. Text that slowly fades in looks fine at the end, but anyone who stops scrolling halfway reads faded, hard-to-read text.
- **Target size:** buttons and links must be big enough to hit with a finger or a shaky hand. Our rule is at least 44 × 44 pixels, about the size of a fingertip.

**How to check it yourself**
- Open `docs/milestone-2/security.md` and `docs/milestone-2/accessibility.md` to read the findings, each with a severity, a proposed fix and an effort estimate.
- In the terminal, run `bash .agents/skills/a11y-gate/check.sh 2`. Every line says SKIP, because the website pages do not exist yet.
- Open `.mcp.json` to see the three helper tools, each with an exact version number and no passwords.

**Decisions or open questions**
- Decided (by the developer): the Next.js update goes into this step; the alpha (pre-release) version of Playwright stays, because the browser helper tool requires exactly that version.
- Open: which Milestone 1 findings to fix. The most important one is SEC-1: the web server planned for step 3 would show hidden project files, so step 3 must decide how to serve only the website files. Also open is SEC-2, a warning in a development-only tool that has no fix yet; you can accept it as a documented exception.
- Open: approve the three helper tools in Claude Code and start a new session.

**Commit:** `[M2-S02] chore(agents): add CISO and accessibility gates, dev MCP servers, M1 baseline and Next.js security patch`
