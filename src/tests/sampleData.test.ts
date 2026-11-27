import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sampleCandidates,
  sampleClientVacancies,
  sampleClients,
  sampleEmployees,
  sampleKnowledgeBaseArticles,
  sampleRankingDecisions,
  sampleSelectionProcesses,
  sampleSupportTickets,
  sampleVacancy,
} from "../data/sampleData.ts";
import { briefingConstant } from "./helpers/briefing.ts";

const candidateIds = new Set(sampleCandidates.map((candidate) => candidate.id));
const vacancyIds = new Set(sampleClientVacancies.map((vacancy) => vacancy.id));
const clientIds = new Set(sampleClients.map((client) => client.id));
const employeeIds = new Set(sampleEmployees.map((employee) => employee.id));
const ticketIds = new Set(sampleSupportTickets.map((ticket) => ticket.id));

function clientOfVacancy(vacancyId: string): string | undefined {
  return sampleClientVacancies.find((vacancy) => vacancy.id === vacancyId)?.clientId;
}

test("the briefing sample is unchanged: 3 candidates, their ids and the vacancy id", () => {
  assert.equal(sampleCandidates.length, 3);
  assert.deepEqual(sampleCandidates.map((candidate) => candidate.id), ["C-2024-0451", "C-2024-0452", "C-2024-0453"]);
  assert.equal(sampleVacancy.id, "V-2024-0892");
});

test("the briefing sample equals BRIEFING.md value by value", () => {
  assert.deepEqual(sampleCandidates, briefingConstant("sampleCandidates"));
  assert.deepEqual(sampleVacancy, briefingConstant("sampleVacancy"));
});

test("the briefing vacancy is also a client vacancy with the same fields", () => {
  const { clientId, consultantId, ...vacancy } = sampleClientVacancies.find((item) => item.id === sampleVacancy.id) ?? assert.fail("missing");
  assert.deepEqual(vacancy, sampleVacancy);
  assert.ok(clientId && consultantId);
});

test("every client vacancy names an existing client and a selection consultant", () => {
  for (const vacancy of sampleClientVacancies) {
    assert.ok(clientIds.has(vacancy.clientId), `${vacancy.id}: unknown client`);
    const consultant = sampleEmployees.find((employee) => employee.id === vacancy.consultantId);
    assert.equal(consultant?.role, "Selection Consultant", `${vacancy.id}: not a consultant`);
  }
});

test("every selection process points to an existing candidate and vacancy", () => {
  for (const process of sampleSelectionProcesses) {
    assert.ok(candidateIds.has(process.candidateId), process.id);
    assert.ok(vacancyIds.has(process.vacancyId), process.id);
    assert.ok(process.updatedAt >= process.createdAt, process.id);
  }
});

test("worked case: one vacancy with several candidates", () => {
  const inBriefingVacancy = sampleSelectionProcesses.filter((process) => process.vacancyId === sampleVacancy.id);
  assert.ok(inBriefingVacancy.length >= 2);
});

test("a candidate in two vacancies stays inside one client (M3-17)", () => {
  const vacanciesByCandidate = new Map<string, Set<string>>();
  for (const process of sampleSelectionProcesses) {
    const vacancies = vacanciesByCandidate.get(process.candidateId) ?? new Set<string>();
    vacanciesByCandidate.set(process.candidateId, vacancies.add(process.vacancyId));
  }
  const multiVacancy = [...vacanciesByCandidate.entries()].filter(([, vacancies]) => vacancies.size >= 2);
  assert.ok(multiVacancy.length >= 1, "the worked case needs one candidate in two vacancies");
  for (const [candidateId, vacancies] of vacanciesByCandidate) {
    const clients = new Set([...vacancies].map(clientOfVacancy));
    assert.equal(clients.size, 1, `${candidateId} appears in more than one client`);
  }
});

test("every ranking decision points to existing records; both decision types exist", () => {
  for (const decision of sampleRankingDecisions) {
    assert.ok(candidateIds.has(decision.candidateId), decision.id);
    assert.ok(vacancyIds.has(decision.vacancyId), decision.id);
    assert.ok(employeeIds.has(decision.consultantId), decision.id);
  }
  const types = new Set(sampleRankingDecisions.map((decision) => decision.decision));
  assert.deepEqual([...types].sort(), ["Accepted", "Overridden"]);
});

test("tickets cover both clients, L1 and L2, Open and Resolved, and point to existing records", () => {
  for (const ticket of sampleSupportTickets) {
    assert.ok(clientIds.has(ticket.clientId), ticket.id);
    if (ticket.assignedAgentId !== null) {
      const agent = sampleEmployees.find((employee) => employee.id === ticket.assignedAgentId);
      assert.equal(agent?.role, "Support Agent", ticket.id);
    }
  }
  assert.equal(new Set(sampleSupportTickets.map((ticket) => ticket.clientId)).size, 2);
  assert.deepEqual([...new Set(sampleSupportTickets.map((ticket) => ticket.level))].sort(), ["L1", "L2"]);
  assert.deepEqual([...new Set(sampleSupportTickets.map((ticket) => ticket.status))].sort(), ["Open", "Resolved"]);
});

test("knowledge-base articles cover both clients; a source ticket is a resolved ticket of the same client", () => {
  assert.equal(new Set(sampleKnowledgeBaseArticles.map((article) => article.clientId)).size, 2);
  const fromTickets = sampleKnowledgeBaseArticles.filter((article) => article.sourceTicketId !== null);
  assert.ok(fromTickets.length >= 1);
  for (const article of sampleKnowledgeBaseArticles) {
    assert.ok(clientIds.has(article.clientId), article.id);
    if (article.sourceTicketId === null) continue;
    assert.ok(ticketIds.has(article.sourceTicketId), article.id);
    const ticket = sampleSupportTickets.find((item) => item.id === article.sourceTicketId);
    assert.equal(ticket?.clientId, article.clientId, article.id);
    assert.equal(ticket?.status, "Resolved", article.id);
  }
});

test("the two clients are one per office", () => {
  assert.deepEqual(sampleClients.map((client) => client.office).sort(), ["Miami", "Valencia"]);
});
