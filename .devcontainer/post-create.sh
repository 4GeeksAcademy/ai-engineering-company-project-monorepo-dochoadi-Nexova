#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# pnpm at the exact version pinned in the root package.json ("packageManager").
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
sudo corepack enable
corepack install

pnpm install --frozen-lockfile

# Python dependencies, only once the repo has a pyproject.toml. Every install below is pinned (SEC-4).
if [ -f pyproject.toml ]; then
  python -m pip install --user uv==0.13.5
  python -m uv sync
fi

# Playwright + Chromium for .agents/skills/webapp-testing.
python -m pip install --user playwright==1.64.1
python -m playwright install --with-deps chromium
# Alpha on purpose: @playwright/mcp@0.0.83 pins exactly this Playwright, and its Chromium build must match.
npx -y playwright@1.64.0-alpha-1790635538000 install chromium  # Chromium for the playwright and chrome-devtools MCP servers (.mcp.json)

# Claude Code CLI inside the Codespace.
npm install -g @anthropic-ai/claude-code@2.1.309

echo "Devcontainer ready: Node $(node -v), pnpm $(pnpm -v), $(python --version)"
