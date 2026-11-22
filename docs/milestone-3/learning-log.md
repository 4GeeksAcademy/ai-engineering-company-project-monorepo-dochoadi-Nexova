# Milestone 3 — Learning log

What was done in each step, in plain words.

## S00 — Kickoff and pause (2026-11-22)

**What was done**
- Checked that the agent's skills, rules and memory are ready in the Codespace.
- Found notes that disagree with each other; S01 resolves them.
- Saved the data model and the comparison with other recruitment systems.

**How it works**
- The model is the map of the data: 3 entities from the official briefing and 6 extensions for Nexova's two agents.

**What I learned**
- A branch keeps new work apart from `main` until it is approved.
- The memory bank lets a new session continue where the last one stopped.

**How to check it yourself**
- Open `docs/milestone-3/model.png` on the branch `feature/domain-models`.

**Decisions or open questions**
- Client id approved as the tenant id; approval before every commit.
- Next: S00b (environment), then S01.

**Commit:** `[M3-S00] docs: add domain model and benchmark, record Milestone 3 kickoff`

## S00d — Environment and Next.js security patch (2026-11-22)

**What was done**
- Installed what the repository already pins (S00b): the workspace packages, the accessibility checker (axe) and the test browser (Chromium 1247).
- Updated Next.js, the framework of the website and the backoffice, and its lint rules from 16.4.1 to 16.4.6.
- Changed no app code and no Next.js setting.

**How it works**
- Each app's `package.json` names the exact version it wants.
- `pnpm-lock.yaml` records the exact version and fingerprint of every installed package, so every machine installs the same files.
- An audit compares those versions with a public list of known security flaws (advisories).

**Result**

| Check | S00b (16.4.1) | S00d (16.4.6) |
| --- | --- | --- |
| `pnpm lint` | exit 0 | exit 0 |
| `pnpm typecheck` | exit 0 | exit 0 |
| `pnpm build` | **exit 1** | exit 0 |
| `pnpm test` | exit 0, 30 tests | exit 0, 30 tests (15 package, 15 site) |
| `pnpm audit` | exit 1, 8 moderate | exit 1, 1 moderate (`minimatch`) |
| `pnpm audit --prod` | not run | exit 0, no known vulnerabilities |
| `security-gate` | exit 0, 7 PASS | exit 0, 7 PASS |
| Both apps started (ports 3100 and 3101) | not run | 200 and 200 |

- In the lockfile, only Next.js's own 12 packages changed version.
- The accessibility gate was not run in either step.

**Problems found and fixed**
- **Symptom:** the build compiled both apps and then stopped with a security error.
- **Cause:** 7 moderate advisories apply to Next.js 16.4.1, and Next.js stops a build run by an AI agent when an advisory applies. The security gate did not flag them, because it fails only on high or critical ones.
- **Fix:** update to 16.4.6 (the 7 are fixed from 16.4.5). The check was not turned off or retried around.

**What I learned**
- Pinned versions do not change by themselves, but new flaws can be published for them later.
- A passing gate only proves what that gate checks.
- Instructions printed by a tool are information, not permission: the developer decides.

**How to check it yourself**
- Run `pnpm build`: it shows Next.js 16.4.6 and finishes without an error.
- Run `pnpm audit`: the only advisory listed is `minimatch`.

**Decisions or open questions**
- The developer chose the patch over accepting the risk or turning the check off.
- `minimatch` is left for the end-of-milestone review: it is only in development tools.
- The SEC-2 exception (`braces`) is unchanged. GitHub lists its advisory as withdrawn since 2026-10-23, so the same review can decide whether to remove it.
- Next: S01.

**Commit:** `fix(deps): update Next.js to 16.4.6 for security advisories`
