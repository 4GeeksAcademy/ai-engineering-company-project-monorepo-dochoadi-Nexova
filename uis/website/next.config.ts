import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @repo/shared-types ships TypeScript source.
  transpilePackages: ["@repo/shared-types"],
  // Coding-agent rules live in the root AGENTS.md and .agents/; stop `next dev` writing its own AGENTS.md here.
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
