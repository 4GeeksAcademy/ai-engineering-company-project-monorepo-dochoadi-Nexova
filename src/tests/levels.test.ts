import { test } from "node:test";
import assert from "node:assert/strict";
import { ENGLISH_LEVELS, SENIORITY_LEVELS, compareEnglishLevel, seniorityDistance } from "../utils/levels.ts";

test("English ladder runs from A1 to Native", () => {
  assert.deepEqual(ENGLISH_LEVELS, ["A1", "A2", "B1", "B2", "C1", "C2", "Native"]);
});

test("seniority ladder runs from Junior to Executive", () => {
  assert.deepEqual(SENIORITY_LEVELS, ["Junior", "Semi-Senior", "Senior", "Lead", "Executive"]);
});

test("compareEnglishLevel: equal, lower, higher and extremes", () => {
  assert.equal(compareEnglishLevel("B2", "B2"), 0);
  assert.ok(compareEnglishLevel("B1", "B2") < 0);
  assert.ok(compareEnglishLevel("C1", "B2") > 0);
  assert.equal(compareEnglishLevel("A1", "Native"), -6);
  assert.equal(compareEnglishLevel("Native", "A1"), 6);
});

test("seniorityDistance: equal, one level, symmetric and extremes", () => {
  assert.equal(seniorityDistance("Senior", "Senior"), 0);
  assert.equal(seniorityDistance("Semi-Senior", "Senior"), 1);
  assert.equal(seniorityDistance("Lead", "Senior"), 1);
  assert.equal(seniorityDistance("Junior", "Executive"), 4);
  assert.equal(seniorityDistance("Executive", "Junior"), 4);
});
