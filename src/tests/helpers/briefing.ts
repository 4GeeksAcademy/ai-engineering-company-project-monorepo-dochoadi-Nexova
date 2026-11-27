// Test helpers that read the official BRIEFING.md and src/ files from disk.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

export const REPO_ROOT: string = join(import.meta.dirname, "..", "..", "..");

export function readRepoFile(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), "utf8");
}

// Every ```typescript block of BRIEFING.md, joined into one source text.
export function briefingTypeScript(): string {
  const blocks = readRepoFile("BRIEFING.md").match(/```typescript\n([\s\S]*?)```/g) ?? [];
  return blocks.map((block) => block.replace(/^```typescript\n/, "").replace(/```$/, "")).join("\n");
}

export function parseTypeScript(fileName: string, text: string): ts.SourceFile {
  return ts.createSourceFile(fileName, text, ts.ScriptTarget.ES2022, true);
}

export interface InterfaceShape {
  name: string;
  fields: Array<{ name: string; type: string }>;
}

export interface UnionShape {
  name: string;
  values: string[];
}

// Interfaces (field names and type text, in order) and string-literal unions of a file.
export function readShapes(source: ts.SourceFile): { interfaces: InterfaceShape[]; unions: UnionShape[] } {
  const interfaces: InterfaceShape[] = [];
  const unions: UnionShape[] = [];
  for (const statement of source.statements) {
    if (ts.isInterfaceDeclaration(statement)) {
      const fields = statement.members.filter(ts.isPropertySignature).map((member) => ({
        name: member.name.getText(source),
        type: member.type?.getText(source) ?? "",
      }));
      interfaces.push({ name: statement.name.text, fields });
    }
    if (ts.isTypeAliasDeclaration(statement) && ts.isUnionTypeNode(statement.type)) {
      const values = statement.type.types
        .filter(ts.isLiteralTypeNode)
        .map((literal) => literal.literal)
        .filter(ts.isStringLiteral)
        .map((literal) => literal.text);
      unions.push({ name: statement.name.text, values });
    }
  }
  return { interfaces, unions };
}

export type LiteralValue = string | number | boolean | LiteralValue[] | { [key: string]: LiteralValue };

// Turns a plain object or array literal (strings, numbers, booleans) into a value, without eval.
export function literalToValue(node: ts.Expression): LiteralValue {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literalToValue);
  if (ts.isObjectLiteralExpression(node)) {
    const entries = node.properties.filter(ts.isPropertyAssignment).map((property) => [property.name.getText(), literalToValue(property.initializer)] as const);
    return Object.fromEntries(entries);
  }
  throw new Error(`Unsupported literal: ${ts.SyntaxKind[node.kind]}`);
}

// The initial value of `const <name> = …` in the briefing's code blocks.
export function briefingConstant(name: string): LiteralValue {
  const source = parseTypeScript("BRIEFING.ts", briefingTypeScript());
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(source) === name && declaration.initializer) {
        return literalToValue(declaration.initializer);
      }
    }
  }
  throw new Error(`${name} not found in BRIEFING.md`);
}
