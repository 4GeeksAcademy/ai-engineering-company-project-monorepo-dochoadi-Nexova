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

## S03 — Tailwind, npx server and page skeleton (2026-10-23)

**What was done**
- Set up Tailwind, the styling tool the brief asks for, in its "compiled" form. A small program turns our style instructions into one compact file (`styles.css`) ahead of time, so visitors' browsers don't have to do that work on every visit. That keeps the site fast for the PageSpeed score (E13).
- Connected Tailwind to the Nexova brand colours, corner shapes and shadows from Milestone 1, without copying them. The new site uses the same green, cream and coral as the other two Nexova apps.
- Fixed SEC-1, the hidden-files problem. A small script copies only the public website files into a separate folder (`dist/`), and the web server shows only that folder. Private files such as passwords and project history can no longer be downloaded: the test now returns "not found" (404) for every one of them.
- Wrote down the one command that starts the site on port 8080 (E7), with an explanation in the main `README.md`, including how to open it in Codespaces.
- Built the empty frame of the four pages: English and Spanish, home page and form page. Each has a header with the logo, menu and language switch, the sections in the brief's order, and a footer with contact details. The text and the form come in the next steps.
- Recorded SEC-2 (a warning in a development-only tool with no fix yet) as an accepted exception, to be reviewed again in step 10.

**What I learned**
- **Compiled CSS versus the CDN:** the CDN version of Tailwind builds the styles inside each visitor's browser, every time. Compiling does that work once, on our side, and ships only the styles the pages actually use (about 19 KB).
- **Allowlist:** a list of what is allowed, where everything else is blocked. It's safer than a blocklist (a list of what is forbidden), because a new private file is blocked automatically.
- **`hreflang` and `lang`:** small labels that tell search engines and screen readers which language a page or link is in. A screen reader then reads "Español" with a Spanish voice, and Google shows Spanish visitors the Spanish page.
- **Skip link:** a hidden "Skip to main content" link that appears when you press Tab. It lets keyboard and screen-reader users jump past the menu instead of tabbing through it on every page.

**How to check it yourself**
- In the terminal, run `pnpm build:site && npx http-server@14.1.1 dist -p 8080 -a 0.0.0.0 -d false`, then open port 8080 in the Codespaces **Ports** tab. Click "Español" in the header, then make the window narrow and open "Menu".
- Press Tab once on any page: a green "Skip to main content" button appears in the top-left corner.
- Read the "Public website" section of the main `README.md`.

**Decisions or open questions**
- Decided (by the developer, after S02): serve only `dist/` (SEC-1), and accept SEC-2 as a documented exception. The other Milestone 1 findings wait for a separate "M1 hardening" change; SEC-4 is fixed in S09.
- Decided during the step:
  - The SEC-2 exception lives in `pnpm-workspace.yaml`, because this pnpm version ignores the setting in `package.json`.
  - A helper of the Tailwind tool (`@parcel/watcher`) was added to the list of packages whose install scripts are not run, like two others before it. Without that, setting up a new Codespace would fail.
  - The site test command uses a pattern instead of a folder name, because Node 24 rejects a bare folder.
- Fixed in the security checker, for you to review: one rule was flagging its own help text as a server address. It now looks only for real addresses, and it still catches a real one.
- Open: the security checker found that the accessibility checker still shows the whole project folder for a few seconds while it runs. The risk is very low (only this computer can reach it), and making it use `dist/` needs your approval.
- Open (production note): the font is loaded from Google's servers, which shares each visitor's internet address with Google. Hosting the font file ourselves would avoid that if the site ever goes live in the EU.

**Commit:** `[M2-S03][E7][E9][E11] chore(site): set up compiled Tailwind, npx server and bilingual semantic page skeleton`
