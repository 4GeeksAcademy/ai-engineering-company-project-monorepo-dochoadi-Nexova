import { test } from "node:test";
import assert from "node:assert/strict";
import { company, departments, NEED_TYPES } from "@repo/shared-types";
import { headcountSummary, needsByType, slaDueTimes, slaGap } from "./metrics.ts";

test("slaGap reports a 24 h, 100 % breach for 48 h against 24 h", () => {
  assert.deepEqual(slaGap(48, 24), { hours: 24, percent: 100, breached: true });
});

test("slaGap is not breached when the average is under the SLA", () => {
  const gap = slaGap(20, 24);
  assert.equal(gap.breached, false);
  assert.equal(gap.hours, -4);
});

test("headcountSummary sums the stated team sizes and lists the teams without one", () => {
  const summary = headcountSummary(departments, company.employees);
  const stated = departments.reduce((sum, d) => sum + (d.teamSize ?? 0), 0);
  assert.equal(summary.declared, company.employees);
  assert.equal(summary.accountedFor, stated);
  assert.equal(summary.difference, company.employees - stated);
  assert.ok(summary.unknownTeams.some((n) => n.includes("Executive")), "Executive is missing");
  assert.ok(summary.unknownTeams.some((n) => n.includes("Marketing")), "Marketing is missing");
  assert.equal(summary.unknownTeams.length, 2);
});

test("needsByType counts every need exactly once, for every type", () => {
  const counts = needsByType(departments);
  const total = departments.reduce((sum, d) => sum + d.needs.length, 0);
  assert.deepEqual(Object.keys(counts).sort(), NEED_TYPES.map((t) => t.id).sort());
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), total);
});

test("slaDueTimes adds exactly the committed and current hours", () => {
  const now = new Date("2026-10-13T09:07:00Z");
  const { due, typical } = slaDueTimes(now, 24, 48);
  assert.equal(due.getTime() - now.getTime(), 24 * 3_600_000);
  assert.equal(typical.getTime() - now.getTime(), 48 * 3_600_000);
});
