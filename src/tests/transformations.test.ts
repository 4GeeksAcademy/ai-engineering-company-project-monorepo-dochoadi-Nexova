import { test } from "node:test";
import assert from "node:assert/strict";
import { sampleCandidates, sampleVacancy } from "../data/sampleData.ts";
import type { Candidate, ScoreBreakdown, Vacancy } from "../types/models.ts";
import {
  calculateCandidateScore,
  getCandidateScoreBreakdown,
  groupCandidatesBySeniority,
  isHighMatch,
  rankCandidatesForVacancy,
} from "../utils/transformations.ts";
import { deepFrozen } from "./helpers/frozen.ts";

function sample(id: string): Candidate {
  return sampleCandidates.find((candidate) => candidate.id === id) ?? assert.fail(`missing ${id}`);
}
const maria = sample("C-2024-0451");
const juan = sample("C-2024-0452");
const carolina = sample("C-2024-0453");

// A candidate that fits `vacancy` exactly (score 100); each boundary test changes one field.
const vacancy: Vacancy = {
  ...sampleVacancy,
  requiredSkills: ["TypeScript", "React", "Node.js", "SQL"],
  preferredSkills: ["Docker", "AWS", "GraphQL"],
  minYearsExperience: 4,
  maxYearsExperience: 8,
  requiredEnglishLevel: "B2",
  requiredSeniority: "Senior",
  salaryRangeMin: 5000,
  salaryRangeMax: 7000,
  isRemote: false,
};
const fit: Candidate = {
  ...carolina,
  id: "C-TEST-0001",
  skills: ["TypeScript", "React", "Node.js", "SQL"],
  yearsOfExperience: 6,
  seniority: "Senior",
  englishLevel: "B2",
  expectedSalary: 6000,
  remoteOnly: false,
  availability: "Immediate",
  status: "Active",
};
const breakdown = (changes: Partial<Candidate>, target: Vacancy = vacancy): ScoreBreakdown =>
  getCandidateScoreBreakdown({ ...fit, ...changes }, target);
const parts = (b: ScoreBreakdown): number[] => [b.skills, b.experience, b.seniority, b.english, b.salary];

// --- Briefing sample (decision 12) --------------------------------------------

test("Carolina Silva scores 100 (40/20/15/15/10) with missing-required-skills (React)", () => {
  const b = getCandidateScoreBreakdown(carolina, sampleVacancy);
  assert.deepEqual(parts(b), [40, 20, 15, 15, 10]);
  assert.deepEqual(b.missingRequiredSkills, ["React"]);
  assert.deepEqual(b.matchedPreferredSkills, ["PostgreSQL", "Docker"]);
  assert.deepEqual(b.warnings, ["missing-required-skills"]);
  assert.equal(calculateCandidateScore(carolina, sampleVacancy), 100);
});

test("María González scores 92 (40/20/7/15/10) with preferred-points-capped and salary-below-range", () => {
  const b = getCandidateScoreBreakdown(maria, sampleVacancy);
  assert.deepEqual(parts(b), [40, 20, 7, 15, 10]);
  assert.deepEqual(b.missingRequiredSkills, []);
  assert.deepEqual(b.warnings, ["preferred-points-capped", "salary-below-range"]);
  assert.equal(calculateCandidateScore(maria, sampleVacancy), 92);
  assert.equal(isHighMatch(92), true);
});

test("Juan Pérez scores 20 (0/10/0/0/10) with six warnings, none of them capped points", () => {
  const b = getCandidateScoreBreakdown(juan, sampleVacancy);
  assert.deepEqual(parts(b), [0, 10, 0, 0, 10]);
  assert.deepEqual(b.matchedRequiredSkills, ["React"]);
  assert.deepEqual(b.warnings, [
    "missing-required-skills",
    "under-half-required-skills",
    "experience-below-range",
    "seniority-mismatch",
    "english-below-required",
    "salary-below-range",
  ]);
  assert.equal(calculateCandidateScore(juan, sampleVacancy), 20);
});

test("calculateCandidateScore equals the sum of the breakdown for every sample candidate", () => {
  for (const candidate of sampleCandidates) {
    const b = getCandidateScoreBreakdown(candidate, sampleVacancy);
    assert.equal(calculateCandidateScore(candidate, sampleVacancy), parts(b).reduce((sum, points) => sum + points, 0));
  }
});

test("the fitting test candidate scores 100 with no warnings", () => {
  assert.deepEqual(parts(breakdown({})), [40, 20, 15, 15, 10]);
  assert.deepEqual(breakdown({}).warnings, []);
});

// --- Skills -------------------------------------------------------------------

test("skills: exactly 50 % of the required skills gives 20; below 50 % gives 0", () => {
  assert.equal(breakdown({ skills: ["TypeScript", "React"] }).skills, 20);
  assert.equal(breakdown({ skills: ["TypeScript"] }).skills, 0);
});

test("missing skills: all required gives neither warning", () => {
  assert.deepEqual(breakdown({}).warnings, []);
});

test("missing skills: exactly 50 % gives missing-required-skills only", () => {
  const half = breakdown({ skills: ["TypeScript", "React"] });
  assert.deepEqual(half.missingRequiredSkills, ["Node.js", "SQL"]);
  assert.deepEqual(half.warnings, ["missing-required-skills"]);
});

test("missing skills: below 50 % gives missing-required-skills and under-half-required-skills", () => {
  assert.deepEqual(breakdown({ skills: ["TypeScript"] }).warnings, ["missing-required-skills", "under-half-required-skills"]);
  assert.deepEqual(breakdown({ skills: [] }).warnings, ["missing-required-skills", "under-half-required-skills"]);
});

test("skills: compared trimmed and ignoring capital letters", () => {
  assert.equal(breakdown({ skills: [" typescript", "REACT ", "node.js", "sql"] }).skills, 40);
});

test("skills: 10 per preferred skill, at most 20, and the part at most 40 (preferred-points-capped)", () => {
  const halfPlusOne = breakdown({ skills: ["TypeScript", "React", "Docker"] });
  assert.equal(halfPlusOne.skills, 30);
  const halfPlusThree = breakdown({ skills: ["TypeScript", "React", "Docker", "AWS", "GraphQL"] });
  assert.equal(halfPlusThree.skills, 40);
  assert.deepEqual(halfPlusThree.warnings, ["missing-required-skills"]);
  const allPlusOne = breakdown({ skills: [...fit.skills, "Docker"] });
  assert.equal(allPlusOne.skills, 40);
  assert.deepEqual(allPlusOne.warnings, ["preferred-points-capped"]);
});

test("skills: a vacancy with no required skills gives 0 and vacancy-has-no-required-skills", () => {
  const b = breakdown({ skills: ["Docker", "AWS"] }, { ...vacancy, requiredSkills: [] });
  assert.equal(b.skills, 0);
  assert.deepEqual(b.matchedPreferredSkills, ["Docker", "AWS"]);
  assert.deepEqual(b.warnings, ["vacancy-has-no-required-skills"]);
});

// --- Experience, seniority, English -------------------------------------------

test("experience: exactly at the minimum and the maximum gives 20", () => {
  assert.equal(breakdown({ yearsOfExperience: 4 }).experience, 20);
  assert.equal(breakdown({ yearsOfExperience: 8 }).experience, 20);
});

test("experience: 2 years outside gives 10, 3 years outside gives 0, with the warning", () => {
  assert.deepEqual([breakdown({ yearsOfExperience: 2 }).experience, breakdown({ yearsOfExperience: 2 }).warnings], [10, ["experience-below-range"]]);
  assert.deepEqual([breakdown({ yearsOfExperience: 10 }).experience, breakdown({ yearsOfExperience: 10 }).warnings], [10, ["experience-above-range"]]);
  assert.equal(breakdown({ yearsOfExperience: 1 }).experience, 0);
  assert.equal(breakdown({ yearsOfExperience: 11 }).experience, 0);
});

test("seniority: one level away gives 7 with no warning; two levels away gives 0 and seniority-mismatch", () => {
  assert.deepEqual([breakdown({ seniority: "Lead" }).seniority, breakdown({ seniority: "Lead" }).warnings], [7, []]);
  assert.equal(breakdown({ seniority: "Semi-Senior" }).seniority, 7);
  assert.deepEqual([breakdown({ seniority: "Junior" }).seniority, breakdown({ seniority: "Junior" }).warnings], [0, ["seniority-mismatch"]]);
  assert.equal(breakdown({ seniority: "Executive" }).seniority, 0);
});

test("English: equal or above gives 15; one level below gives 0 and english-below-required", () => {
  assert.equal(breakdown({ englishLevel: "B2" }).english, 15);
  assert.equal(breakdown({ englishLevel: "Native" }).english, 15);
  assert.deepEqual([breakdown({ englishLevel: "B1" }).english, breakdown({ englishLevel: "B1" }).warnings], [0, ["english-below-required"]]);
});

// --- Salary (decision A) --------------------------------------------------------

test("salary: exactly at the maximum gives 10", () => {
  assert.deepEqual([breakdown({ expectedSalary: 7000 }).salary, breakdown({ expectedSalary: 7000 }).warnings], [10, []]);
  assert.equal(breakdown({ expectedSalary: 5000 }).salary, 10);
});

test("salary: exactly 120 % of the maximum gives 5; just above gives 0; both warn salary-above-range", () => {
  assert.deepEqual([breakdown({ expectedSalary: 8400 }).salary, breakdown({ expectedSalary: 8400 }).warnings], [5, ["salary-above-range"]]);
  assert.deepEqual([breakdown({ expectedSalary: 8401 }).salary, breakdown({ expectedSalary: 8401 }).warnings], [0, ["salary-above-range"]]);
});

test("salary: below the minimum gives 10 and salary-below-range", () => {
  assert.deepEqual([breakdown({ expectedSalary: 4999 }).salary, breakdown({ expectedSalary: 4999 }).warnings], [10, ["salary-below-range"]]);
});

// --- Warnings that never change the score ---------------------------------------

test("a remote-only candidate for an office vacancy gets remote-mismatch and the same score", () => {
  const remote = breakdown({ remoteOnly: true });
  assert.deepEqual(remote.warnings, ["remote-mismatch"]);
  assert.equal(calculateCandidateScore({ ...fit, remoteOnly: true }, vacancy), 100);
  assert.deepEqual(breakdown({ remoteOnly: true }, { ...vacancy, isRemote: true }).warnings, []);
});

test("not available, hired or inactive candidates get a warning and keep their score", () => {
  assert.deepEqual(breakdown({ availability: "Not available" }).warnings, ["candidate-not-available"]);
  assert.deepEqual(breakdown({ status: "Hired" }).warnings, ["candidate-not-active"]);
  assert.deepEqual(breakdown({ status: "Inactive" }).warnings, ["candidate-not-active"]);
  assert.deepEqual(breakdown({ status: "In process" }).warnings, []);
  assert.equal(calculateCandidateScore({ ...fit, status: "Hired", availability: "Not available" }, vacancy), 100);
});

// --- Ranking (decision B) --------------------------------------------------------

test("ranking on the briefing sample: Carolina 100, María 92, Juan 20", () => {
  const ranking = rankCandidatesForVacancy(sampleCandidates, sampleVacancy);
  assert.deepEqual(ranking.map(({ candidate, score }) => [candidate.fullName, score]), [
    ["Carolina Silva", 100],
    ["María González", 92],
    ["Juan Pérez", 20],
  ]);
});

test("ranking tie: the candidate with more required skills matched goes first", () => {
  // Both score 40 in skills: 4/4 required, or 2/4 required plus 2 preferred.
  const allRequired = { ...fit, id: "C-ALL" };
  const halfPlusPreferred = { ...fit, id: "C-HALF", skills: ["TypeScript", "React", "Docker", "AWS"] };
  const ranking = rankCandidatesForVacancy([halfPlusPreferred, allRequired], vacancy);
  assert.deepEqual(ranking.map((entry) => [entry.candidate.id, entry.score]), [["C-ALL", 100], ["C-HALF", 100]]);
});

test("ranking tie: sooner availability goes first", () => {
  const later = { ...fit, id: "C-LATER", availability: "1 month" as const };
  const sooner = { ...fit, id: "C-SOONER", availability: "2 weeks" as const };
  const ranking = rankCandidatesForVacancy([later, sooner], vacancy);
  assert.deepEqual(ranking.map((entry) => entry.candidate.id), ["C-SOONER", "C-LATER"]);
});

test("ranking: an exact tie keeps the original order, and salary never breaks a tie", () => {
  const first = { ...fit, id: "C-FIRST", expectedSalary: 6900 };
  const second = { ...fit, id: "C-SECOND", expectedSalary: 5100 };
  assert.deepEqual(rankCandidatesForVacancy([first, second], vacancy).map((entry) => entry.candidate.id), ["C-FIRST", "C-SECOND"]);
  assert.deepEqual(rankCandidatesForVacancy([second, first], vacancy).map((entry) => entry.candidate.id), ["C-SECOND", "C-FIRST"]);
});

test("ranking returns a new list of { candidate, score } and never changes its input", () => {
  const before = structuredClone(sampleCandidates);
  const frozen = deepFrozen(sampleCandidates);
  const ranking = rankCandidatesForVacancy(frozen, sampleVacancy);
  assert.deepEqual(Object.keys(ranking[0] ?? {}), ["candidate", "score"]);
  assert.notEqual(ranking, frozen);
  assert.deepEqual(sampleCandidates, before);
  assert.deepEqual(rankCandidatesForVacancy([], sampleVacancy), []);
});

// --- Grouping and high match -----------------------------------------------------

test("groupCandidatesBySeniority has all 5 levels, in the original order inside each group", () => {
  const groups = groupCandidatesBySeniority([...sampleCandidates, { ...carolina, id: "C-SECOND-SENIOR" }]);
  assert.deepEqual(Object.keys(groups), ["Junior", "Semi-Senior", "Senior", "Lead", "Executive"]);
  assert.deepEqual(groups.Senior.map((candidate) => candidate.id), ["C-2024-0453", "C-SECOND-SENIOR"]);
  assert.deepEqual(groups.Junior.map((candidate) => candidate.id), ["C-2024-0452"]);
  assert.deepEqual(groups.Lead, []);
});

test("groupCandidatesBySeniority on an empty list gives 5 empty lists", () => {
  assert.deepEqual(groupCandidatesBySeniority([]), { Junior: [], "Semi-Senior": [], Senior: [], Lead: [], Executive: [] });
});

test("groupCandidatesBySeniority never changes its input", () => {
  const frozen = deepFrozen(sampleCandidates);
  assert.equal(groupCandidatesBySeniority(frozen).Senior.length, 1);
});

test("isHighMatch: 89 false, 90 true, 100 true", () => {
  assert.equal(isHighMatch(89), false);
  assert.equal(isHighMatch(90), true);
  assert.equal(isHighMatch(100), true);
});
