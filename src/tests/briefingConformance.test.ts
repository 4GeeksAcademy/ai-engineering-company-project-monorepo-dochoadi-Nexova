// E1, E13: the briefing's interfaces and unions are copied exactly into models.ts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { briefingTypeScript, parseTypeScript, readRepoFile, readShapes } from "./helpers/briefing.ts";

const briefing = readShapes(parseTypeScript("BRIEFING.ts", briefingTypeScript()));
const models = readShapes(parseTypeScript("models.ts", readRepoFile("src/types/models.ts")));

const BRIEFING_INTERFACES = ["Candidate", "Vacancy", "SelectionProcess"];
const BRIEFING_UNIONS = ["EnglishLevel", "SeniorityLevel", "AvailabilityStatus", "CandidateStatus", "VacancyStatus", "ProcessStage"];

test("the briefing defines the 3 interfaces and 6 unions", () => {
  assert.deepEqual(briefing.interfaces.map((shape) => shape.name), BRIEFING_INTERFACES);
  assert.deepEqual(briefing.unions.map((shape) => shape.name).sort(), [...BRIEFING_UNIONS].sort());
});

for (const name of BRIEFING_INTERFACES) {
  test(`interface ${name}: same field names, order and types`, () => {
    const expected = briefing.interfaces.find((shape) => shape.name === name);
    const actual = models.interfaces.find((shape) => shape.name === name);
    assert.ok(expected && actual, `${name} missing`);
    assert.deepEqual(actual.fields, expected.fields);
  });
}

for (const name of BRIEFING_UNIONS) {
  test(`union ${name}: same values in the same order`, () => {
    const expected = briefing.unions.find((shape) => shape.name === name);
    const actual = models.unions.find((shape) => shape.name === name);
    assert.ok(expected && actual, `${name} missing`);
    assert.deepEqual(actual.values, expected.values);
  });
}
