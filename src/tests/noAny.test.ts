// E18: no `any` type anywhere under src/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { REPO_ROOT, parseTypeScript, readRepoFile } from "./helpers/briefing.ts";

function countAny(node: ts.Node): number {
  const own = node.kind === ts.SyntaxKind.AnyKeyword ? 1 : 0;
  let children = 0;
  node.forEachChild((child) => {
    children += countAny(child);
  });
  return own + children;
}

const files = readdirSync(join(REPO_ROOT, "src"), { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".ts"))
  .map((file) => `src/${file.replaceAll("\\", "/")}`);

test("src/ has TypeScript files to check", () => {
  assert.ok(files.includes("src/types/models.ts"));
});

for (const file of files) {
  test(`no any in ${file}`, () => {
    assert.equal(countAny(parseTypeScript(file, readRepoFile(file))), 0);
  });
}
