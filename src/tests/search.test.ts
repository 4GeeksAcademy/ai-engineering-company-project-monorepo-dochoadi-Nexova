import { test } from "node:test";
import assert from "node:assert/strict";
import { sampleCandidates, sampleKnowledgeBaseArticles } from "../data/sampleData.ts";
import type { Candidate, KnowledgeBaseArticle } from "../types/models.ts";
import {
  binarySearchCandidateBySalary,
  findCandidateByEmail,
  findCandidateById,
  searchKnowledgeBase,
} from "../utils/search.ts";

// A sorted copy (2800, 4200, 6500); the briefing order (4200, 2800, 6500) stays as it is.
const bySalary: Candidate[] = [...sampleCandidates].sort((a, b) => a.expectedSalary - b.expectedSalary);

function withSalary(id: string, expectedSalary: number): Candidate {
  const base = sampleCandidates[0] ?? assert.fail("sample data missing");
  return { ...base, id, expectedSalary };
}

// --- Linear search by id -------------------------------------------------

test("findCandidateById finds a candidate in the unsorted briefing list", () => {
  assert.equal(findCandidateById(sampleCandidates, "C-2024-0453")?.fullName, "Carolina Silva");
  assert.equal(findCandidateById(sampleCandidates, "C-2024-0451")?.fullName, "María González");
});

test("findCandidateById returns null when the id is not found", () => {
  assert.equal(findCandidateById(sampleCandidates, "C-2024-9999"), null);
  assert.equal(findCandidateById(sampleCandidates, "c-2024-0451"), null);
});

test("findCandidateById returns null on an empty list", () => {
  assert.equal(findCandidateById([], "C-2024-0451"), null);
});

// --- Linear search by email ----------------------------------------------

test("findCandidateByEmail finds a candidate by exact email", () => {
  assert.equal(findCandidateByEmail(sampleCandidates, "juan.perez@email.com")?.id, "C-2024-0452");
});

test("findCandidateByEmail ignores capital letters and surrounding spaces", () => {
  assert.equal(findCandidateByEmail(sampleCandidates, "Carolina.Silva@EMAIL.com")?.id, "C-2024-0453");
  assert.equal(findCandidateByEmail(sampleCandidates, "  maria.gonzalez@email.com ")?.id, "C-2024-0451");
});

test("findCandidateByEmail returns null when not found or the list is empty", () => {
  assert.equal(findCandidateByEmail(sampleCandidates, "nobody@email.com"), null);
  assert.equal(findCandidateByEmail([], "juan.perez@email.com"), null);
});

// --- Binary search by expected salary --------------------------------------

test("binary search finds every briefing salary at its sorted index", () => {
  assert.deepEqual(bySalary.map((candidate) => candidate.expectedSalary), [2800, 4200, 6500]);
  assert.equal(binarySearchCandidateBySalary(bySalary, 2800), 0);
  assert.equal(binarySearchCandidateBySalary(bySalary, 4200), 1);
  assert.equal(binarySearchCandidateBySalary(bySalary, 6500), 2);
});

test("binary search returns -1 for a missing salary, below and above every salary", () => {
  assert.equal(binarySearchCandidateBySalary(bySalary, 5000), -1);
  assert.equal(binarySearchCandidateBySalary(bySalary, 1000), -1);
  assert.equal(binarySearchCandidateBySalary(bySalary, 9000), -1);
});

test("binary search returns -1 on an empty list", () => {
  assert.equal(binarySearchCandidateBySalary([], 4200), -1);
});

test("binary search on one element: found and not found", () => {
  const one = [withSalary("C-X-1", 3000)];
  assert.equal(binarySearchCandidateBySalary(one, 3000), 0);
  assert.equal(binarySearchCandidateBySalary(one, 2999), -1);
  assert.equal(binarySearchCandidateBySalary(one, 3001), -1);
});

test("binary search with repeated salaries returns any matching index", () => {
  const repeated = [1000, 3000, 3000, 3000, 5000].map((salary, index) => withSalary(`C-X-${index}`, salary));
  const index = binarySearchCandidateBySalary(repeated, 3000);
  assert.equal(repeated[index]?.expectedSalary, 3000);
  assert.equal(binarySearchCandidateBySalary(repeated, 1000), 0);
  assert.equal(binarySearchCandidateBySalary(repeated, 5000), 4);
  assert.equal(binarySearchCandidateBySalary(repeated, 4000), -1);
});

test("binary search on a longer list finds every element", () => {
  const salaries = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500];
  const list = salaries.map((salary, index) => withSalary(`C-L-${index}`, salary));
  salaries.forEach((salary, index) => assert.equal(binarySearchCandidateBySalary(list, salary), index));
  assert.equal(binarySearchCandidateBySalary(list, 2750), -1);
});

// --- Knowledge base (client-scoped) ----------------------------------------

// Same password article for both clients, to prove the client filter.
const twoClients: KnowledgeBaseArticle[] = [
  ...sampleKnowledgeBaseArticles,
  { ...(sampleKnowledgeBaseArticles[0] ?? assert.fail("sample data missing")), id: "KB-TEST-0003", clientId: "CL-002", sourceTicketId: null },
];

test("searchKnowledgeBase returns only the requested client's articles", () => {
  assert.deepEqual(searchKnowledgeBase(twoClients, "CL-001", "password").map((article) => article.id), ["KB-2026-0001"]);
  assert.deepEqual(searchKnowledgeBase(twoClients, "CL-002", "password").map((article) => article.id), ["KB-TEST-0003"]);
});

test("searchKnowledgeBase matches title, problem, solution and keywords, ignoring case and spaces", () => {
  assert.deepEqual(searchKnowledgeBase(sampleKnowledgeBaseArticles, "CL-002", "  DELIVERY ").map((a) => a.id), ["KB-2026-0002"]);
  assert.deepEqual(searchKnowledgeBase(sampleKnowledgeBaseArticles, "CL-001", "spam folder").map((a) => a.id), ["KB-2026-0001"]);
  assert.deepEqual(searchKnowledgeBase(sampleKnowledgeBaseArticles, "CL-001", "LOGIN").map((a) => a.id), ["KB-2026-0001"]);
});

test("searchKnowledgeBase keeps the original order", () => {
  const ordered = searchKnowledgeBase(twoClients, "CL-002", "the").map((article) => article.id);
  assert.deepEqual(ordered, ["KB-2026-0002", "KB-TEST-0003"]);
});

test("searchKnowledgeBase returns [] for a blank keyword, an unknown client or no match", () => {
  assert.deepEqual(searchKnowledgeBase(twoClients, "CL-001", ""), []);
  assert.deepEqual(searchKnowledgeBase(twoClients, "CL-001", "   "), []);
  assert.deepEqual(searchKnowledgeBase(twoClients, "CL-999", "password"), []);
  assert.deepEqual(searchKnowledgeBase(twoClients, "CL-001", "refund"), []);
  assert.deepEqual(searchKnowledgeBase([], "CL-001", "password"), []);
});

// --- Inputs are never changed ----------------------------------------------

// Freezes the list and every object in it; a change attempt then throws (modules run in strict mode).
function deepFrozen<T extends object>(items: T[]): T[] {
  return Object.freeze(items.map((item) => Object.freeze(structuredClone(item)))) as T[];
}

test("no search function changes its input (frozen inputs, compared before and after)", () => {
  const candidatesBefore = structuredClone(sampleCandidates);
  const articlesBefore = structuredClone(twoClients);
  const frozenCandidates = deepFrozen(sampleCandidates);
  const frozenSorted = deepFrozen(bySalary);
  const frozenArticles = deepFrozen(twoClients);

  assert.equal(findCandidateById(frozenCandidates, "C-2024-0452")?.id, "C-2024-0452");
  assert.equal(findCandidateByEmail(frozenCandidates, "JUAN.PEREZ@email.com")?.id, "C-2024-0452");
  assert.equal(binarySearchCandidateBySalary(frozenSorted, 4200), 1);
  const result = searchKnowledgeBase(frozenArticles, "CL-001", "password");

  assert.notEqual(result, frozenArticles);
  assert.deepEqual(sampleCandidates, candidatesBefore);
  assert.deepEqual(twoClients, articlesBefore);
});
