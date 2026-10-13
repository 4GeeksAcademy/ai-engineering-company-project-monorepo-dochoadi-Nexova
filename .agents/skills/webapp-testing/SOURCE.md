# Source

- **Source URL:** https://github.com/anthropics/skills
- **Path in the source repo:** `skills/webapp-testing/`
- **Commit:** `dbd4588f9e1033efb41dad4bef2f7947c8993d44`
- **Date copied:** 2026-10-12
- **License:** Apache License 2.0; full text in [`LICENSE.txt`](./LICENSE.txt).

Vendored, do not edit. To update, copy again from the source and update this file.

## Security notes (review of 2026-10-12)

Approved by the developer for vendoring unchanged, with these notes:

- **Writes outside the working directory:** the upstream files use hardcoded output paths outside this repo:
  - `examples/console_logging.py` → `/mnt/user-data/outputs/console.log`
  - `examples/static_html_automation.py` → `/mnt/user-data/outputs/static_page.png`, `/mnt/user-data/outputs/after_submit.png`
  - `examples/element_discovery.py` → `/tmp/page_discovery.png`
  - `SKILL.md` (Reconnaissance-Then-Action Pattern) → `/tmp/inspect.png`
- **Local command execution:** `scripts/with_server.py` runs the commands passed to it (`--server "…"` with `shell=True`, plus the trailing command), polls `localhost` ports and stops the servers when done.
- **No remote code and no outbound data:** nothing downloads or runs remote code, and nothing sends data outside the machine; the examples only open `localhost` or local `file://` URLs.

### How to use it in this repo

- Do not run the `examples/` as they are; use them as reference only.
- Write screenshots and logs inside the repo under `test-results/` (already in `.gitignore`), never to `/tmp` or `/mnt/user-data/outputs`. Screenshots meant for a PR are attached to the PR, not committed.
- Only pass `with_server.py` the project's own dev commands (e.g. the website on port 3000, the backoffice on port 3001).
