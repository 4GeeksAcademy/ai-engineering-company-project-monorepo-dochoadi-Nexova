import { test } from "node:test";
import assert from "node:assert/strict";
import { supportSla } from "../../packages/shared/company.ts";
import {
  sampleCandidates,
  sampleClientVacancies,
  sampleRankingDecisions,
  sampleSelectionProcesses,
  sampleSupportTickets,
} from "../data/sampleData.ts";
import type { Candidate, RankingDecision, SelectionProcess, SupportTicket } from "../types/models.ts";
import { filterTicketsByClient } from "../utils/collections.ts";
import {
  SLA_AT_RISK_HOURS,
  SLA_HOURS,
  calculateAverageResolutionHours,
  calculateAverageSalary,
  calculateAverageTimeToHire,
  calculateL1ResolutionRate,
  calculateOverrideRate,
  calculateVacancyFillRate,
  countCandidatesByStatus,
  countProcessesByStage,
  findTopSkills,
  getSlaStatus,
} from "../utils/transformations.ts";
import { deepFrozen } from "./helpers/frozen.ts";

const REPORT_TIME = new Date("2026-11-05T10:00:00Z");
const HOUR = 60 * 60 * 1000;

function ticket(id: string): SupportTicket {
  return sampleSupportTickets.find((item) => item.id === id) ?? assert.fail(`missing ${id}`);
}

// An open L1 ticket created at `createdAt`, or resolved when `resolvedAt` is given.
function localTicket(createdAt: Date, resolvedAt: Date | null = null): SupportTicket {
  return {
    ...ticket("TK-2026-0003"),
    id: "TK-TEST",
    createdAt,
    resolvedAt,
    status: resolvedAt === null ? "Open" : "Resolved",
  };
}

function withSkills(id: string, skills: string[]): Candidate {
  return { ...(sampleCandidates[0] ?? assert.fail("sample data missing")), id, skills };
}

// --- Recruitment reports on the briefing sample --------------------------------

test("countCandidatesByStatus: Active 3, the other three statuses 0", () => {
  assert.deepEqual(countCandidatesByStatus(sampleCandidates), { Active: 3, "In process": 0, Hired: 0, Inactive: 0 });
});

test("calculateAverageSalary: (4200 + 2800 + 6500) / 3 = 4500", () => {
  assert.equal(calculateAverageSalary(sampleCandidates), 4500);
});

test("calculateAverageSalary rounds to 2 decimals", () => {
  const salaries = [1000, 1000, 1001].map((salary, index) => ({ ...withSkills(`C-${index}`, ["X"]), expectedSalary: salary }));
  assert.equal(calculateAverageSalary(salaries), 1000.33);
});

test("findTopSkills with topN 4: Node.js, PostgreSQL, React, TypeScript, 2 each (alphabetical among ties)", () => {
  assert.deepEqual(findTopSkills(sampleCandidates, 4), [
    { skill: "Node.js", count: 2 },
    { skill: "PostgreSQL", count: 2 },
    { skill: "React", count: 2 },
    { skill: "TypeScript", count: 2 },
  ]);
});

test("calculateVacancyFillRate: 1 Hired of 4 processes = 25", () => {
  assert.equal(calculateVacancyFillRate(sampleSelectionProcesses), 25);
});

test("countProcessesByStage: Screening 1, Interview 1, Final interview 1, Hired 1, the others 0", () => {
  assert.deepEqual(countProcessesByStage(sampleSelectionProcesses), {
    Screening: 1,
    Interview: 1,
    "Technical test": 0,
    "Final interview": 1,
    Offer: 0,
    Rejected: 0,
    Hired: 1,
  });
});

test("calculateAverageTimeToHire: 2026-08-01 09:00 to 2026-09-12 17:00 = 42 days 8 h = 42.33 days", () => {
  assert.equal(calculateAverageTimeToHire(sampleSelectionProcesses), 42.33);
});

// --- findTopSkills rules (decisions 5 and 13G) -----------------------------------

test("findTopSkills groups spellings and shows the most common one: ' react', 'React', 'REACT', 'React' → React 4", () => {
  const candidates = [withSkills("C-1", [" react"]), withSkills("C-2", ["React"]), withSkills("C-3", ["REACT"]), withSkills("C-4", ["React"])];
  assert.deepEqual(findTopSkills(candidates, 5), [{ skill: "React", count: 4 }]);
});

test("findTopSkills on a spelling tie shows the first spelling found", () => {
  const candidates = [withSkills("C-1", ["REACT"]), withSkills("C-2", [" react"]), withSkills("C-3", ["React"])];
  assert.deepEqual(findTopSkills(candidates, 5), [{ skill: "REACT", count: 3 }]);
});

test("findTopSkills counts a skill once per candidate, even when listed twice", () => {
  const candidates = [withSkills("C-1", ["Go", "go", "Go"]), withSkills("C-2", ["Go"])];
  assert.deepEqual(findTopSkills(candidates, 5), [{ skill: "Go", count: 2 }]);
});

test("findTopSkills: topN 0 or negative gives []; topN 99 gives the whole list", () => {
  assert.deepEqual(findTopSkills(sampleCandidates, 0), []);
  assert.deepEqual(findTopSkills(sampleCandidates, -3), []);
  assert.equal(findTopSkills(sampleCandidates, 99).length, 9);
});

test("findTopSkills sorts by count, then alphabetically among equal counts", () => {
  const candidates = [withSkills("C-1", ["Zig", "Ada", "Kotlin"]), withSkills("C-2", ["Kotlin"])];
  assert.deepEqual(findTopSkills(candidates, 3).map((entry) => entry.skill), ["Kotlin", "Ada", "Zig"]);
});

// --- Support KPIs per client (decisions 10c, 14A, 14B) --------------------------------

test("CL-001 (filtered by client): L1 rate 100 (1 L1 of 1 resolved), average resolution 1.5 h", () => {
  const tickets = filterTicketsByClient(sampleSupportTickets, "CL-001");
  assert.equal(calculateL1ResolutionRate(tickets), 100);
  assert.equal(calculateAverageResolutionHours(tickets), 1.5);
});

test("CL-002 (filtered by client): L1 rate 0 (the only resolved ticket is L2), average resolution 20 h", () => {
  const tickets = filterTicketsByClient(sampleSupportTickets, "CL-002");
  assert.equal(calculateL1ResolutionRate(tickets), 0);
  assert.equal(calculateAverageResolutionHours(tickets), 20);
});

test("all tickets: L1 rate 50 (1 of 2 resolved), average (1.5 + 20) / 2 = 10.75 h; open tickets are left out", () => {
  assert.equal(calculateL1ResolutionRate(sampleSupportTickets), 50);
  assert.equal(calculateAverageResolutionHours(sampleSupportTickets), 10.75);
});

test("calculateOverrideRate on all decisions: 1 Overridden of 3 = 33.33", () => {
  assert.equal(calculateOverrideRate(sampleRankingDecisions), 33.33);
});

// --- SLA traffic light (decision 14C) -------------------------------------------------

test("SLA_HOURS comes from packages/shared (supportSla.committedHours = 24); at risk from 20 h", () => {
  assert.equal(SLA_HOURS, supportSla.committedHours);
  assert.equal(SLA_HOURS, 24);
  assert.equal(SLA_AT_RISK_HOURS, 20);
});

test("SLA at 2026-11-05T10:00Z: TK-0001 On time, TK-0002 Breached (48 h), TK-0003 At risk (exactly 20 h), TK-0004 On time (resolved in 20 h)", () => {
  assert.equal(getSlaStatus(ticket("TK-2026-0001"), REPORT_TIME), "On time");
  assert.equal(getSlaStatus(ticket("TK-2026-0002"), REPORT_TIME), "Breached");
  assert.equal(getSlaStatus(ticket("TK-2026-0003"), REPORT_TIME), "At risk");
  assert.equal(getSlaStatus(ticket("TK-2026-0004"), REPORT_TIME), "On time");
});

test("SLA boundaries for an open ticket: 19.99 h On time, 20 h At risk, 24 h At risk, 24 h + 1 ms Breached", () => {
  const created = new Date("2026-11-01T00:00:00Z");
  const after = (milliseconds: number): Date => new Date(created.getTime() + milliseconds);
  assert.equal(getSlaStatus(localTicket(created), after(19.99 * HOUR)), "On time");
  assert.equal(getSlaStatus(localTicket(created), after(20 * HOUR)), "At risk");
  assert.equal(getSlaStatus(localTicket(created), after(24 * HOUR)), "At risk");
  assert.equal(getSlaStatus(localTicket(created), after(24 * HOUR + 1)), "Breached");
});

test("SLA: a ticket resolved after 25 h is Breached, whatever the time now", () => {
  const created = new Date("2026-11-01T00:00:00Z");
  const resolved = new Date(created.getTime() + 25 * HOUR);
  assert.equal(getSlaStatus(localTicket(created, resolved), REPORT_TIME), "Breached");
});

test("SLA: a now before createdAt counts as 0 h (On time)", () => {
  assert.equal(getSlaStatus(localTicket(new Date("2026-11-10T00:00:00Z")), REPORT_TIME), "On time");
});

// --- Empty inputs -----------------------------------------------------------------------

test("empty inputs: every average and rate is 0, and both counts have every key at 0", () => {
  assert.equal(calculateAverageSalary([]), 0);
  assert.equal(calculateVacancyFillRate([]), 0);
  assert.equal(calculateAverageTimeToHire([]), 0);
  assert.equal(calculateL1ResolutionRate([]), 0);
  assert.equal(calculateAverageResolutionHours([]), 0);
  assert.equal(calculateOverrideRate([]), 0);
  assert.deepEqual(findTopSkills([], 3), []);
  assert.deepEqual(countCandidatesByStatus([]), { Active: 0, "In process": 0, Hired: 0, Inactive: 0 });
  assert.deepEqual(countProcessesByStage([]), {
    Screening: 0,
    Interview: 0,
    "Technical test": 0,
    "Final interview": 0,
    Offer: 0,
    Rejected: 0,
    Hired: 0,
  });
});

test("no hired process or no resolved ticket gives 0, not an error", () => {
  const notHired = sampleSelectionProcesses.filter((process) => process.stage !== "Hired");
  assert.equal(calculateAverageTimeToHire(notHired), 0);
  const openOnly = sampleSupportTickets.filter((item) => item.status === "Open");
  assert.equal(calculateL1ResolutionRate(openOnly), 0);
  assert.equal(calculateAverageResolutionHours(openOnly), 0);
});

// --- Two clients (decision 10c, M3-18, M3-33) ----------------------------------------------

test("one client's recruitment numbers never include another client's records", () => {
  // Test data only: CL-002 gets a hired process and an overridden decision on V-2024-0894.
  const cl002Process: SelectionProcess = {
    id: "SP-TEST-0005",
    candidateId: "C-2024-0452",
    vacancyId: "V-2024-0894",
    stage: "Hired",
    score: 0,
    notes: "Test data.",
    createdAt: new Date("2026-09-01T09:00:00Z"),
    updatedAt: new Date("2026-09-11T09:00:00Z"),
  };
  const cl002Decision: RankingDecision = {
    id: "RD-TEST-0004",
    vacancyId: "V-2024-0894",
    candidateId: "C-2024-0452",
    consultantId: "EMP-002",
    suggestedRank: 2,
    finalRank: 1,
    decision: "Overridden",
    reason: "Test data.",
    decidedAt: new Date("2026-09-02T09:00:00Z"),
  };
  const processes = [...sampleSelectionProcesses, cl002Process];
  const decisions = [...sampleRankingDecisions, cl002Decision];
  const vacancyIdsOf = (clientId: string): string[] =>
    sampleClientVacancies.filter((vacancy) => vacancy.clientId === clientId).map((vacancy) => vacancy.id);
  const processesOf = (clientId: string): SelectionProcess[] => processes.filter((process) => vacancyIdsOf(clientId).includes(process.vacancyId));
  const decisionsOf = (clientId: string): RankingDecision[] => decisions.filter((decision) => vacancyIdsOf(clientId).includes(decision.vacancyId));

  // CL-001 is unchanged by CL-002's records: the same values as on the sample alone.
  assert.equal(calculateVacancyFillRate(processesOf("CL-001")), calculateVacancyFillRate(sampleSelectionProcesses));
  assert.equal(calculateVacancyFillRate(processesOf("CL-001")), 25);
  assert.equal(calculateAverageTimeToHire(processesOf("CL-001")), 42.33);
  assert.equal(calculateOverrideRate(decisionsOf("CL-001")), 33.33);

  // CL-002 gets only its own: 1 of 1 hired in 10 days, 1 of 1 overridden.
  assert.equal(calculateVacancyFillRate(processesOf("CL-002")), 100);
  assert.equal(calculateAverageTimeToHire(processesOf("CL-002")), 10);
  assert.equal(calculateOverrideRate(decisionsOf("CL-002")), 100);

  // Mixing them would give different numbers, which is what the filter prevents.
  assert.equal(calculateVacancyFillRate(processes), 40);
  assert.equal(calculateOverrideRate(decisions), 50);
});

test("one client's support KPIs never include another client's tickets", () => {
  const cl001 = filterTicketsByClient(sampleSupportTickets, "CL-001");
  const cl002 = filterTicketsByClient(sampleSupportTickets, "CL-002");
  assert.ok(cl001.every((item) => item.clientId === "CL-001"));
  assert.notEqual(calculateL1ResolutionRate(cl001), calculateL1ResolutionRate(cl002));
  assert.notEqual(calculateAverageResolutionHours(cl001), calculateAverageResolutionHours(sampleSupportTickets));
});

// --- Inputs are never changed ------------------------------------------------------------------

test("no report changes its input (frozen lists passed directly, compared with a copy)", () => {
  const before = structuredClone([sampleCandidates, sampleSelectionProcesses, sampleSupportTickets, sampleRankingDecisions]);
  const candidates = deepFrozen(sampleCandidates);
  const processes = deepFrozen(sampleSelectionProcesses);
  const tickets = deepFrozen(sampleSupportTickets);
  const decisions = deepFrozen(sampleRankingDecisions);

  assert.equal(countCandidatesByStatus(candidates).Active, 3);
  assert.equal(calculateAverageSalary(candidates), 4500);
  assert.equal(findTopSkills(candidates, 1).length, 1);
  assert.equal(calculateVacancyFillRate(processes), 25);
  assert.equal(countProcessesByStage(processes).Hired, 1);
  assert.equal(calculateAverageTimeToHire(processes), 42.33);
  assert.equal(getSlaStatus(tickets[1] ?? assert.fail("missing"), REPORT_TIME), "Breached");
  assert.equal(calculateL1ResolutionRate(tickets), 50);
  assert.equal(calculateAverageResolutionHours(tickets), 10.75);
  assert.equal(calculateOverrideRate(decisions), 33.33);

  assert.deepEqual([sampleCandidates, sampleSelectionProcesses, sampleSupportTickets, sampleRankingDecisions], before);
});
