// Copies ONLY the public site files into dist/, which is what the static server serves (SEC-1:
// serving the repo root would expose .git, .env, .mcp.json and the docs). Run via `pnpm build:site`.
import { cpSync, existsSync, lstatSync, rmSync } from "node:fs";

const ALLOWLIST = ["index.html", "application.html", "validation.js", "styles.css", "assets", "es", "robots.txt", "sitemap.xml"];
const OUT = "dist";

rmSync(OUT, { recursive: true, force: true });
for (const entry of ALLOWLIST) {
  if (!existsSync(entry)) continue; // validation.js arrives in S06; robots.txt and sitemap.xml later.
  // Skip dotfiles and symlinks: a link such as es/x.html -> ../.env would otherwise be served.
  const filter = (src) => !/(^|\/)\.[^/]/.test(src) && !lstatSync(src).isSymbolicLink();
  cpSync(entry, `${OUT}/${entry}`, { recursive: true, filter });
}
console.log(`build-site: copied ${ALLOWLIST.filter((e) => existsSync(e)).join(", ")} into ${OUT}/`);
