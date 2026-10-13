import { test } from "node:test";
import assert from "node:assert/strict";
import { businessLines, departments, flagshipAgents, NEED_TYPES, supportSla } from "./company.ts";

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

test("every department need has a valid type", () => {
  const valid = new Set(NEED_TYPES.map((t) => t.id));
  assert.equal(valid.size, 4);
  for (const d of departments) {
    assert.ok(d.needs.length > 0, `${d.id} has no needs`);
    for (const n of d.needs) {
      assert.ok(n.text.trim().length > 0, `${d.id} has an empty need`);
      assert.ok(valid.has(n.type), `${d.id}: "${n.text}" has an invalid type ${n.type}`);
    }
  }
});

test("every flagship agent has a 4-step flow", () => {
  for (const a of flagshipAgents) {
    assert.equal(a.flow.length, 4, `${a.id} flow`);
  }
});
