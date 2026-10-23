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

## S04 — Landing page (2026-10-23)

**What was done**
- Filled the home page in English and Spanish with the exact words of the official briefing, in its order: the big headline, "Our services" (three cards), "Why Nexova" (four strong points), and Contact. The evaluation checks that the page matches the briefing.
- Added a still picture next to the headline: a small grid of CV cards, with one card highlighted in coral as the "chosen" candidate. It reuses the Milestone 1 animation, frozen at its last frame, so nothing moves.
- Added the Valencia and Miami office photos, made lighter for the web (WebP, a modern image format), each with a description for people who can't see it.
- Added hidden information for search engines and social networks: the company "ID card" from the briefing (Schema.org), the page's official address (canonical), and the title and description shown when someone shares the link (Open Graph).
- The accessibility checker now tests the safe `dist/` copy of the site, like the security checker.
- Checked screenshots at phone, tablet and computer sizes, and fixed what looked wrong: cramped cards at tablet size, the email address breaking in the middle, and buttons that disappeared in high-contrast mode.

**What I learned**
- **Schema.org:** a small block of data in the page that tells Google "this is a company called Nexova, founded in 2011, with offices in Valencia and Miami". People don't see it, but search engines read it.
- **High-contrast (forced-colors) mode:** some people set their computer to show only a few strong colours. Background colours disappear, so a button drawn only with a background colour vanishes. An invisible border fixes it, because that mode redraws borders in a visible colour.
- **Lazy loading:** photos further down the page load only when you scroll near them. The page opens faster, which helps the speed score.
- **Mobile-first:** we design for phones first (one column), then add columns for bigger screens. On a small screen the page stays simple and nothing is cut off.

**How to check it yourself**
- Open the site (link below), read the home page in English, then click "Español" in the header.
- Click the green "Join our talent pool" button: it opens the form page (still empty until the next step).
- Open `docs/milestone-2/screenshots/` to see the home page at phone, tablet and computer sizes.

**Decisions or open questions**
- Decided (by the developer, after S03): the S03 deviations are approved; the accessibility checker uses `dist/`; Google Fonts stays for now, with a production note to host the font ourselves before a real launch in the EU.
- Decided in this step:
  - The contact block is a green rounded panel with a cream button, because coral is kept only for the highlighted CV card and the logo dot.
  - The page's official address points to `nexova.com`, the domain in the briefing's company data.
- Open: the step asked for the heading "Our services", while the briefing calls the section "Services". Should this be listed in `content-decisions.md`, the file of deliberate differences from the briefing?
- Open (from Milestone 1): the licence of the two office photos is not confirmed, and the Miami photo shows people who can be recognised.

**Commit:** `[M2-S04][E1][E2][E4][E5][E6][E8][E10][E12][E26][E27][E30] feat(site): build bilingual landing page from the official briefing`

## S05 — Form markup (2026-10-23)

**What was done**
- Built the "Join our talent pool" form page in English and Spanish with exactly the 11 fields from the briefing, each with the right kind of box: an email box, a phone box, a number box for years, lists to choose from, round option buttons for availability, and a tick box for the data policy.
- Grouped the fields into five boxes (personal details, professional profile, availability, additional information, consent), so the long form feels shorter and screen readers say which part you are in.
- Added the briefing's notice for companies ("Are you a company looking for talent?") with a clickable email, plus a short "Data policy" section that says this is a demo and nothing is sent or stored.
- Prepared the empty spaces where the next step will show error messages, the character counter and the "thank you" message.
- Small fixes approved after your review: the services heading is "Services" again, as in the briefing, and the page addresses given to search engines are now complete web addresses.
- Recorded your permission to use the two office photos.

**What I learned**
- **Label:** the visible name of a field, connected to it in the code. Clicking the label puts the cursor in the field, and a screen reader reads the label aloud. A placeholder (grey text inside the box) disappears when you type, so it is never used as the label.
- **Fieldset and legend:** a fieldset is a box around related fields, and the legend is its title. Screen readers announce "Availability" before each option, so a blind user knows what "1 month" answers.
- **Input types:** telling the browser that a box is for an email or a phone number makes phones show the right keyboard (with @ or with numbers) and lets the browser check the format.
- **Contrast for borders:** the edge of a form box must stand out at least 3 to 1 from the background, or people with low vision can't see where to type. The light beige border was too faint (1.3 to 1), so the boxes use a darker green-grey (4.5 to 1).

**How to check it yourself**
- Open the form page on the site (link below) and in Spanish (`/es/application.html`). Click the words "Immediate" or "I accept the data policy": the option gets selected, not only when you hit the tiny circle or square.
- Make the window narrow: the fields stack in one column.
- Press Tab through the form: a coral ring shows where you are.

**Decisions or open questions**
- Decided (by the developer, after S04): the heading goes back to "Services"; the office photos may be used (including the people in the Miami photo); the page addresses for search engines become full addresses.
- Decided in this step:
  - The field borders use a darker brand colour than the brief suggested, so they are visible enough (accessibility rule).
  - Hints sit under the boxes, so the boxes line up.
  - The form uses the "post" method, so answers never appear in the address bar, even without JavaScript.
- Open: with the form pages done, should the rows that said "form pages in S05" (E1, E5, E6, E8, E10, E12) now be marked "Met"? This step was told to update only E3, E19, E20, E28 and A1–A9.

**Commit:** `[M2-S05][E3][E19][E20][E28] feat(form): build bilingual talent registration form markup`

## S06 — Form validation (2026-10-23)

**What was done**
- The form now checks every answer, in English and Spanish, using the exact error messages from the briefing. For example, a phone number without "+" shows "Phone must include country code (example: +34 612 345 678)".
- Errors appear when you leave a field and disappear as soon as you fix it. Each one has a small "!" icon, so it isn't shown by colour alone.
- Pressing "Submit" with mistakes shows a list of problems at the top. Each item is a link that jumps to the field to fix. Screen readers read the list aloud.
- A correct form shows "Sending…" for a moment, then the briefing's thank-you message. Nothing is actually sent or saved anywhere: we checked that the browser makes no network request. "Clear form" puts everything back to the start.
- 14 automatic tests check every rule and compare every message, word for word, with the two briefing files.
- Fixed the problem you found in review: after an update, a browser could keep showing the old design for up to an hour. The style and script files now get a "version tag" (`?v=…`) that changes whenever the file changes, so browsers fetch the new one.

**What I learned**
- **Validation:** checking that an answer has the right shape (an email with @ and a domain, a phone starting with +, years between 0 and 50) before accepting it. Checking in the browser is for user comfort; a real backend (server) must check again.
- **Pure function:** a small piece of code that only takes a value and returns an answer, without touching the page. Pure functions can be tested in a second, without opening a browser.
- **Live region (`role="alert"`):** a part of the page that screen readers announce as soon as it changes. That's how a blind user hears that there are errors.
- **Browser cache:** browsers keep copies of files so pages open faster. A changing "version tag" in the file's address is the usual way to say "this is a new file, download it again".

**How to check it yourself**
- Open the form page (link below) and press "Submit application" with everything empty: a list of 9 problems appears at the top.
- Type a phone number without "+" and press Tab: the message appears. Add "+34 " at the start: it disappears.
- Fill everything correctly and submit: you see "Sending…" and then the thank-you message. Try the Spanish page too.

**Decisions or open questions**
- Decided (by the developer, after S05): the cache-busting fix goes into this step; rows E1, E5, E6, E8, E10 and E12 are marked in S07, when every criterion is checked again with all four pages finished.
- Decided in this step:
  - After a successful submission, the Submit button stays disabled until "Clear form", so the same application can't be sent twice.
  - The counter also uses the singular ("1 character remaining" / "Queda 1 carácter").
  - The `tests/site/README.md` note "Coming in S06" was updated to describe the new tests.
- Open: none.

**Commit:** `[M2-S06][E18][E21][E22][E23][E24][E25][E29] feat(form): add bilingual real-time validation with tests`

## S07 — The Milestone 1 landing experience (2026-10-23)

**What was done**
- The home page now looks and moves like the Milestone 1 landing page. In the top section, 72 small CV cards fall into a pile, get "scored", sort themselves, and one coral card is chosen and "Placed". A "Replay" button plays it again.
- Added the Milestone 1 extras between the briefing's sections (the briefing's sections, order and words are unchanged):
  - a band of scrolling words;
  - a four-step "Process";
  - big numbers that count up ("12 years", "+500");
  - the three sectors in large letters;
  - an "Offices" section where the Valencia and Miami photos open as you scroll, with the live local time in each city.
- Added one "Pause animations" button that stops everything that moves or changes by itself. The page remembers your choice next time. This is an accessibility rule: anything moving for more than 5 seconds needs a way to stop it.
- People who ask their device for less motion see the finished picture straight away, and people without JavaScript still see every text, number and photo.
- Fixed the two problems from your review:
  - pages are no longer kept in the browser's memory (cache), so a normal reload always shows the latest version;
  - after a successful application, the grey Submit button is hidden and "Clear form" brings the empty form back.
- Renumbered the remaining steps: quality checks S08, public link S09, documentation S10, recap and pull request S11, merge S12.

**What I learned**
- **Progressive enhancement:** build the page so it works fully without the extra effects, then add the effects on top. If the script fails or is switched off, nobody loses content.
- **Reduced motion:** a setting in phones and computers for people who get dizzy or distracted by movement. The page reads it and shows the end result without animating.
- **Web Animations API:** the browser's built-in way to animate from JavaScript. Every animation can be paused and resumed, which is how one button can pause the whole CV story at the exact frame where it is.
- **Cache:** browsers keep copies of pages to load them faster. During development that can show an old page, so the site now tells browsers not to keep copies.

**How to check it yourself**
- Open the home page (link below) and watch the CV cards fall and sort until one coral card is "Placed". Press "Replay".
- Press "Pause animations": the cards, the scrolling words and the clocks stop. Reload the page: it stays paused. Press the button again to resume.
- On the form page, send a correct application: only the thank-you message and "Clear form" remain. "Clear form" brings the form back.

**Decisions or open questions**
- Decided (by the developer): bring the Milestone 1 look and motion to the public site, replacing the "static hero"; do not port "Human & AI" or the changing role words in the hero. The S06 review fixes (no cache, hidden Submit button) are included.
- Decided in this step:
  - The process step "Screening" no longer mentions AI, because the briefing doesn't.
  - The three sectors are shown as big words only, without Milestone 1's extra descriptions.
  - On phones the small stage names under the CV picture are hidden, because the stage name at the top already says it.
  - The "Why Nexova" figures stack until large screens.
- Open:
  - The motion script is 16 KB, a little above the 15 KB target; it is still small and loads after the page.
  - Step S10 is called "documentation". It also carries the devcontainer changes (port 8080 and the tool pins) that were planned for the old S09. Is that right?
  - The `.agents/rules/git-workflow.md` example of a teacher-requested fix still says `[M2-S12]`, which is now the merge step. Changing a rule file needs your approval.

**Commit:** `[M2-S07][E6][E8][E10][E12][E14][E15][E26][E27][E30] feat(site): bring the Milestone 1 landing experience to the public site`

## S08 — Quality gates (2026-10-23)

**What was done**
- Measured the four pages with Lighthouse, Google's free quality tool. Every page now scores 100 for speed, 100 for accessibility, 100 for good practice and 92 for search engines (the only thing missing is a small `robots.txt` file).
- Made the site faster and more private: the Instrument Sans font now comes from our own site instead of Google's servers. Pages show text sooner (1.1 s instead of 2.4 s), nothing jumps while loading, and no visitor information goes to Google, which also closes the GDPR (EU privacy law) note.
- Made the CV animation lighter: it now prepares its work step by step instead of all at once, so the page never freezes for half a second on a slow phone.
- Checked by hand what the automatic checkers can't prove: keyboard-only use, the order of the Tab key, colour contrast of every text, the same menu and footer on every page, five screen widths, 200 % zoom, and no English left on the Spanish pages. All passed, with one fix: the coral focus ring now appears at once, as on the Milestone 1 website, instead of fading in.
- Compared the site side by side with the Milestone 1 website (header, button, card, footer) to confirm it looks like the same company.
- Re-checked every row of the evaluation table: all done except the public-link items, which come in steps 9–11.

**What I learned**
- **Lighthouse scores:** four marks out of 100. Performance (how fast the page appears), Accessibility (whether everyone can use it), Best practices (safe, modern code), SEO (how well search engines understand it).
- **Render-blocking resource:** a file the browser must download before it can draw anything. The Google font file was one; serving it from our own site, and telling the browser early ("preload"), removed the wait.
- **Total Blocking Time:** how long the page is too busy to react to a tap. Doing a lot of work in one go (like preparing 600 animations) blocks the page; splitting it into small pieces keeps it responsive.
- **False positive:** a check that raises an alarm about something harmless. The security check mistook browser version numbers (like a "Chrome/" version with four numbers) for internet addresses inside the Lighthouse reports.

**How to check it yourself**
- Open the Lighthouse reports in `docs/milestone-2/lighthouse/` (the `.report.html` files) in your browser: every score is 92 or higher.
- Use the site with only the keyboard (Tab, Shift+Tab, Enter, Space): you can reach everything and always see the coral ring.
- Compare `docs/milestone-2/screenshots/consistency-button-m1.png` and `consistency-button-m2.png`: the same green pill.

**Decisions or open questions**
- Decided (by the developer): the security check skips the Lighthouse reports (they contain version numbers that look like addresses); the rule example of a teacher-requested fix is now `[M2-S13]`; the motion script stays at about 16 KB.
- Decided in this step: host the font ourselves (it was the main cause of the slower first view, and it removes the Google privacy issue).
- Open: adding a `robots.txt` file (and a site map) would raise the search score from 92 to 100. It is a new file at the root, so it needs your approval.

**Commit:** `[M2-S08][E13][E14][E15][E16][E17] test(site): pass security, accessibility and Lighthouse quality gates`

## S09 — Public URL and PageSpeed (2026-10-23)

**What was done**
- You made the site public for a while (port 8080 in the Codespaces Ports tab) and checked that private project files are still hidden: every one answers "Not found".
- You ran Google's PageSpeed Insights on the public link. Speed scores: home page 99 on phones and 100 on computers, form 95 on phones and 100 on computers; accessibility and good practice 100 everywhere. This proves criterion E13 (at least 80) on the real public address.
- Wrote `docs/milestone-2/performance.md` with the link, the date, the scores, your four screenshots and the local scores for comparison.
- Added two small files for search engines: `robots.txt` ("you may read the whole site") and `sitemap.xml` (a list of the four pages and their English/Spanish twins).
- Explained the lower search score (SEO): on the Codespaces link, GitHub adds a hidden "do not index" label to every page, so Google's tool scores it 61. On a real website that label isn't there.

**What I learned**
- **Public URL:** a web address anyone can open. A Codespace port is private by default (only you, after signing in); making it public lets tools like PageSpeed visit it. It's temporary, so it goes back to private after the review.
- **PageSpeed Insights:** Google's free online version of Lighthouse. It tests the page from Google's own computers, so the score reflects a real visit over the internet.
- **robots.txt and sitemap:** two small text files for search engines. The first says what they may read; the second lists the pages, so they find all of them (and know which Spanish page matches which English one).
- **Response header:** a hidden label a server sends with each page. Codespaces adds one saying "do not index", which is why the public SEO score is lower than the local one.

**How to check it yourself**
- Open `docs/milestone-2/performance.md`: the table and your four screenshots.
- Open `https://fantastic-space-doodle-q76p5vgw97r6cqrp-8080.app.github.dev/robots.txt` and `/sitemap.xml` while the site is running.
- Open `/.env` on the public link: it says "Not found".

**Decisions or open questions**
- Decided (by the developer, after S08): add `robots.txt` and `sitemap.xml`. Your speed screenshots were taken before these files existed.
- Open: locally, the search score stays at 92 even with `robots.txt`. Lighthouse reads that file from inside the page, and our strict security rule (no network requests from the page, so form data can't leave the browser) blocks it. Search engines read the file directly, so they're not affected. Relaxing the rule would give 100 but weaken that protection; I recommend keeping it.
- To do: after the instructor reviews the pull request, set port 8080 back to Private.

**Commit:** `[M2-S09][E13] docs(site): record public Codespaces URL and PageSpeed results`

_Correction (2026-10-23, S10): the public-link scores above were measured with Lighthouse 13.5.0 (command line), not PageSpeed Insights. PageSpeed only reached GitHub's "You are about to access a development port" warning page, so the fallback the brief allows was used (see `docs/milestone-2/performance.md`)._

## S10 — Docs and memory bank (2026-10-23)

**What was done**
- Corrected the name of the speed tool. The public-link scores came from Lighthouse (run from the command line), not PageSpeed Insights: PageSpeed only reached GitHub's "You are about to access a development port" warning page. The brief allows Lighthouse in that case. A screenshot of that warning page is now the evidence, and every document says the same.
- Recorded your decision to keep the strict security rule that stops the page making network requests. It keeps form data in the browser, at the cost of a search score of 92 instead of 100 in Lighthouse (search engines aren't affected).
- Completed the verification guide: for each step, what was delivered, the exact commands and the expected results, plus click-by-click checklists for the home page, the form, the language switch and the public link, and a five-command re-check of the whole milestone.
- Updated the main README ("Public website": the four pages, how to build, start, test and check the site) and the Spanish `docs/README.es.md`, and listed every file in `docs/milestone-2/`.
- Wrote a learning log for Milestone 1 after the fact, one section per step plus the merge, using only what git history and the Milestone 1 documents record.
- Prepared the Codespace setup for next time: port 8080 is forwarded automatically as "Public site", and the tools installed when a Codespace is created now have exact versions (security finding SEC-4 fixed).

**What I learned**
- **Verification guide:** a recipe anyone can follow to prove the work is correct: what to run, and what you should see. It lets the instructor (or you, in a month) re-check everything without asking.
- **Retroactive documentation:** writing notes about past work afterwards. It's only trustworthy if every sentence comes from real evidence (commits, reports), and anything unknown is marked "Not recorded" instead of guessed.
- **Pinned versions:** saying exactly which version of a tool to install (like `uv==0.13.5`) instead of "the latest". Every new Codespace then gets the same tools, and a broken or unsafe new release can't sneak in.
- **Memory bank consolidation:** making sure every decision of the milestone is written in the project's memory files, so a future session (human or AI) starts from the truth.

**How to check it yourself**
- Follow the "Public website" section of the main `README.md` exactly: the command should start the site and the four pages should open.
- Read `docs/milestone-1/learning-log.md` and `docs/milestone-2/learning-log.md`. They should make sense to you.
- Open `docs/milestone-2/performance.md` to see the warning-page screenshot and the corrected tool name.

**Decisions or open questions**
- Decided (by the developer, after S09): the public-link tool is Lighthouse (PageSpeed couldn't reach the Codespace); the strict security rule stays, with a search score of 92.
- Note: your own warning-page screenshot wasn't in the project, so the agent captured the same page with a browser that isn't signed in (what PageSpeed sees) on 2026-10-23.
- To do: when the Codespace offers to rebuild after the devcontainer change, click "Not now". The new port and versions apply at the next rebuild.
- Open (carried forward): the Milestone 1 findings not fixed in this milestone, a licence record for the office photos before any real launch, and making port 8080 private after the review.

**Commit:** `[M2-S10] docs: complete Milestone 2 verification guide, M1 learning log, README and memory bank`
