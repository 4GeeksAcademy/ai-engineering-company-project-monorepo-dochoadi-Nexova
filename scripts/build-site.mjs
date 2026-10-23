// Copies ONLY the public site files into dist/, which is what the static server serves (SEC-1:
// serving the repo root would expose .git, .env, .mcp.json and the docs). Run via `pnpm build:site`.
import { createHash } from "node:crypto";
import { cpSync, existsSync, lstatSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";

const ALLOWLIST = ["index.html", "application.html", "validation.js", "motion.js", "styles.css", "assets", "es", "robots.txt", "sitemap.xml"];
const OUT = "dist";

rmSync(OUT, { recursive: true, force: true });
for (const entry of ALLOWLIST) {
  if (!existsSync(entry)) continue; // robots.txt and sitemap.xml arrive later.
  // Skip dotfiles and symlinks: a link such as es/x.html -> ../.env would otherwise be served.
  const filter = (src) => !/(^|\/)\.[^/]/.test(src) && !lstatSync(src).isSymbolicLink();
  cpSync(entry, `${OUT}/${entry}`, { recursive: true, filter });
}

// Cache busting: browsers may keep a stale copy of a file (any cache, any server), so the copied pages ask for
// styles.css, validation.js and motion.js with ?v=<hash>. A changed file gets a new URL; the root HTML is untouched.
const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);
const versions = Object.fromEntries(["styles.css", "validation.js", "motion.js"].filter((f) => existsSync(f)).map((f) => [f, hash(f)]));
const pages = [OUT, `${OUT}/es`].filter((d) => existsSync(d)).flatMap((d) => readdirSync(d).filter((f) => f.endsWith(".html")).map((f) => `${d}/${f}`));
for (const page of pages) {
  const html = readFileSync(page, "utf8").replace(/(href|src)="((?:\.\.\/)?)(styles\.css|validation\.js|motion\.js)"/g,
    (match, attr, up, file) => (versions[file] ? `${attr}="${up}${file}?v=${versions[file]}"` : match));
  writeFileSync(page, html);
}
console.log(`build-site: copied ${ALLOWLIST.filter((e) => existsSync(e)).join(", ")} into ${OUT}/ (versions: ${Object.entries(versions).map(([f, v]) => `${f}?v=${v}`).join(", ")})`);
