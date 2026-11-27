import { test } from "node:test";
import assert from "node:assert/strict";
import { sampleCandidates, sampleSupportTickets } from "../data/sampleData.ts";
import type { Candidate } from "../types/models.ts";
import {
  filterCandidatesByAvailability,
  filterCandidatesBySeniority,
  filterCandidatesBySkills,
  filterTicketsByClient,
  filterTicketsByStatus,
  sortCandidatesByExperience,
  sortCandidatesByFields,
  sortCandidatesBySalary,
  sortTicketsByAge,
} from "../utils/collections.ts";
import { deepFrozen } from "./helpers/frozen.ts";

const names = (candidates: Candidate[]): string[] => candidates.map((candidate) => candidate.fullName);
const ids = (items: Array<{ id: string }>): string[] => items.map((item) => item.id);

function candidate(id: string, fullName: string, expectedSalary: number, yearsOfExperience: number): Candidate {
  const base = sampleCandidates[0] ?? assert.fail("sample data missing");
  return { ...base, id, fullName, expectedSalary, yearsOfExperience };
}

// --- Filters ---------------------------------------------------------------

test("filterCandidatesBySkills keeps candidates with all the required skills", () => {
  assert.deepEqual(names(filterCandidatesBySkills(sampleCandidates, ["TypeScript", "Node.js"])), ["María González", "Carolina Silva"]);
});

test("filterCandidatesBySkills ignores capital letters and spaces", () => {
  assert.deepEqual(names(filterCandidatesBySkills(sampleCandidates, ["typescript", " react "])), ["María González"]);
});

test("filterCandidatesBySkills with no required skills returns every candidate in a new array", () => {
  const result = filterCandidatesBySkills(sampleCandidates, []);
  assert.deepEqual(result, sampleCandidates);
  assert.notEqual(result, sampleCandidates);
});

test("filterCandidatesBySkills returns [] when nobody has the skill", () => {
  assert.deepEqual(filterCandidatesBySkills(sampleCandidates, ["Kotlin"]), []);
});

test("filterCandidatesBySeniority keeps the exact level only", () => {
  assert.deepEqual(names(filterCandidatesBySeniority(sampleCandidates, "Senior")), ["Carolina Silva"]);
  assert.deepEqual(filterCandidatesBySeniority(sampleCandidates, "Lead"), []);
});

test("filterCandidatesByAvailability matches any of the given statuses", () => {
  assert.deepEqual(names(filterCandidatesByAvailability(sampleCandidates, ["Immediate", "2 weeks"])), ["Juan Pérez", "Carolina Silva"]);
  assert.deepEqual(filterCandidatesByAvailability(sampleCandidates, ["Not available"]), []);
  assert.deepEqual(filterCandidatesByAvailability(sampleCandidates, []), []);
});

// --- Sorting ---------------------------------------------------------------

test("sortCandidatesBySalary ascending and descending", () => {
  const ascending = sortCandidatesBySalary(sampleCandidates, "asc");
  assert.deepEqual(names(ascending), ["Juan Pérez", "María González", "Carolina Silva"]);
  assert.deepEqual(ascending.map((c) => c.expectedSalary), [2800, 4200, 6500]);
  assert.deepEqual(names(sortCandidatesBySalary(sampleCandidates, "desc")), ["Carolina Silva", "María González", "Juan Pérez"]);
});

test("sortCandidatesByExperience ascending and descending", () => {
  const ascending = sortCandidatesByExperience(sampleCandidates, "asc");
  assert.deepEqual(ascending.map((c) => c.yearsOfExperience), [3, 5, 8]);
  assert.deepEqual(names(ascending), ["Juan Pérez", "María González", "Carolina Silva"]);
  assert.deepEqual(names(sortCandidatesByExperience(sampleCandidates, "desc")), ["Carolina Silva", "María González", "Juan Pérez"]);
});

test("equal values keep their original order in both sorts and both directions", () => {
  const list = [candidate("C-1", "Ana", 3000, 4), candidate("C-2", "Beto", 3000, 4), candidate("C-3", "Cris", 2000, 2)];
  assert.deepEqual(ids(sortCandidatesBySalary(list, "asc")), ["C-3", "C-1", "C-2"]);
  assert.deepEqual(ids(sortCandidatesBySalary(list, "desc")), ["C-1", "C-2", "C-3"]);
  assert.deepEqual(ids(sortCandidatesByExperience(list, "asc")), ["C-3", "C-1", "C-2"]);
  assert.deepEqual(ids(sortCandidatesByExperience(list, "desc")), ["C-1", "C-2", "C-3"]);
});

test("sortCandidatesByFields: the second field breaks ties of the first", () => {
  const list = [candidate("C-1", "Ana", 4000, 3), candidate("C-2", "Beto", 3000, 9), candidate("C-3", "Cris", 4000, 7)];
  const result = sortCandidatesByFields(list, [
    { field: "expectedSalary", order: "desc" },
    { field: "yearsOfExperience", order: "desc" },
  ]);
  assert.deepEqual(ids(result), ["C-3", "C-1", "C-2"]);
});

test("sortCandidatesByFields: three levels deep, with names compared by localeCompare", () => {
  const list = [
    candidate("C-1", "Óscar", 3000, 5),
    candidate("C-2", "Ana", 3000, 5),
    candidate("C-3", "Bruno", 3000, 2),
    candidate("C-4", "Zoe", 2500, 9),
  ];
  const result = sortCandidatesByFields(list, [
    { field: "expectedSalary", order: "asc" },
    { field: "yearsOfExperience", order: "desc" },
    { field: "fullName", order: "asc" },
  ]);
  assert.deepEqual(ids(result), ["C-4", "C-2", "C-1", "C-3"]);
  const byNameDesc = sortCandidatesByFields(list, [{ field: "fullName", order: "desc" }]);
  assert.deepEqual(names(byNameDesc), ["Zoe", "Óscar", "Bruno", "Ana"]);
});

test("sortCandidatesByFields with no criteria keeps the original order in a new array", () => {
  const result = sortCandidatesByFields(sampleCandidates, []);
  assert.deepEqual(result, sampleCandidates);
  assert.notEqual(result, sampleCandidates);
});

// --- Tickets ---------------------------------------------------------------

test("filterTicketsByClient never returns another client's ticket", () => {
  for (const clientId of ["CL-001", "CL-002"]) {
    const result = filterTicketsByClient(sampleSupportTickets, clientId);
    assert.equal(result.length, 2);
    assert.ok(result.every((ticket) => ticket.clientId === clientId));
  }
  assert.deepEqual(filterTicketsByClient(sampleSupportTickets, "CL-999"), []);
});

test("filterTicketsByStatus with one and with two statuses", () => {
  assert.deepEqual(ids(filterTicketsByStatus(sampleSupportTickets, ["Open"])), ["TK-2026-0002", "TK-2026-0003"]);
  assert.equal(filterTicketsByStatus(sampleSupportTickets, ["Open", "Resolved"]).length, 4);
  assert.deepEqual(filterTicketsByStatus(sampleSupportTickets, []), []);
});

test("filterTicketsByStatus after filterTicketsByClient: one client's open tickets", () => {
  const openForOne = filterTicketsByStatus(filterTicketsByClient(sampleSupportTickets, "CL-002"), ["Open"]);
  assert.deepEqual(ids(openForOne), ["TK-2026-0003"]);
});

test("sortTicketsByAge: oldest first and newest first", () => {
  assert.deepEqual(ids(sortTicketsByAge(sampleSupportTickets, "asc")), ["TK-2026-0004", "TK-2026-0001", "TK-2026-0002", "TK-2026-0003"]);
  assert.deepEqual(ids(sortTicketsByAge(sampleSupportTickets, "desc")), ["TK-2026-0003", "TK-2026-0002", "TK-2026-0001", "TK-2026-0004"]);
});

// --- Empty inputs and no mutation -------------------------------------------

test("every function returns [] for an empty input list", () => {
  assert.deepEqual(filterCandidatesBySkills([], ["React"]), []);
  assert.deepEqual(filterCandidatesBySkills([], []), []);
  assert.deepEqual(filterCandidatesBySeniority([], "Junior"), []);
  assert.deepEqual(filterCandidatesByAvailability([], ["Immediate"]), []);
  assert.deepEqual(sortCandidatesBySalary([], "asc"), []);
  assert.deepEqual(sortCandidatesByExperience([], "desc"), []);
  assert.deepEqual(sortCandidatesByFields([], [{ field: "fullName", order: "asc" }]), []);
  assert.deepEqual(filterTicketsByClient([], "CL-001"), []);
  assert.deepEqual(filterTicketsByStatus([], ["Open"]), []);
  assert.deepEqual(sortTicketsByAge([], "asc"), []);
});

test("no function changes its input (frozen lists passed directly, compared with a copy)", () => {
  const candidatesBefore = structuredClone(sampleCandidates);
  const ticketsBefore = structuredClone(sampleSupportTickets);
  const frozenCandidates = deepFrozen(sampleCandidates);
  const frozenTickets = deepFrozen(sampleSupportTickets);

  assert.equal(filterCandidatesBySkills(frozenCandidates, ["React"]).length, 2);
  assert.equal(filterCandidatesBySeniority(frozenCandidates, "Junior").length, 1);
  assert.equal(filterCandidatesByAvailability(frozenCandidates, ["1 month"]).length, 1);
  assert.equal(sortCandidatesBySalary(frozenCandidates, "desc")[0]?.fullName, "Carolina Silva");
  assert.equal(sortCandidatesByExperience(frozenCandidates, "asc")[0]?.fullName, "Juan Pérez");
  assert.equal(sortCandidatesByFields(frozenCandidates, [{ field: "fullName", order: "asc" }])[0]?.fullName, "Carolina Silva");
  assert.equal(filterTicketsByClient(frozenTickets, "CL-001").length, 2);
  assert.equal(filterTicketsByStatus(frozenTickets, ["Resolved"]).length, 2);
  assert.equal(sortTicketsByAge(frozenTickets, "asc")[0]?.id, "TK-2026-0004");

  assert.deepEqual(sampleCandidates, candidatesBefore);
  assert.deepEqual(sampleSupportTickets, ticketsBefore);
});
