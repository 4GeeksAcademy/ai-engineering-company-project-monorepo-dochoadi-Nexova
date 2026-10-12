import { test } from "node:test";
import assert from "node:assert/strict";
import { businessLines, departments, supportSla } from "./company.ts";

test("there are 8 departments with unique ids, each with a manager", () => {
  assert.equal(departments.length, 8);
  assert.equal(new Set(departments.map((d) => d.id)).size, 8);
  for (const d of departments) {
    assert.ok(d.manager.trim().length > 0, `${d.id} has no manager`);
  }
});

test("current support resolution time breaches the committed SLA", () => {
  assert.ok(supportSla.currentAverageHours > supportSla.committedHours);
});

test("there are exactly 3 business lines", () => {
  assert.equal(businessLines.length, 3);
});

test("the Sales manager is Marcos Ibáñez", () => {
  const sales = departments.find((d) => d.id === "sales");
  assert.equal(sales?.manager, "Marcos Ibáñez");
});
