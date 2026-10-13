#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# pnpm at the exact version pinned in the root package.json ("packageManager").
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
sudo corepack enable
corepack install

pnpm install --frozen-lockfile

# Python dependencies, only once the repo has a pyproject.toml.
if [ -f pyproject.toml ]; then
  python -m pip install --user uv
  python -m uv sync
fi

# Playwright + Chromium for .agents/skills/webapp-testing.
python -m pip install --user playwright
python -m playwright install --with-deps chromium

# Claude Code CLI inside the Codespace.
npm install -g @anthropic-ai/claude-code

echo "Devcontainer ready: Node $(node -v), pnpm $(pnpm -v), $(python --version)"
