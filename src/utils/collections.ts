import type { AvailabilityStatus, Candidate, SeniorityLevel, SupportTicket, TicketStatus } from "../types/models.ts";

type SortOrder = "asc" | "desc";

// One step of a multi-field sort: the first criterion decides, the next ones break ties.
export interface CandidateSortCriterion {
  field: "expectedSalary" | "yearsOfExperience" | "fullName";
  order: SortOrder;
}

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

export function filterCandidatesBySkills(candidates: Candidate[], requiredSkills: string[]): Candidate[] {
  const required = requiredSkills.map(normalizeSkill);
  return candidates.filter((candidate) => {
    const owned = new Set(candidate.skills.map(normalizeSkill));
    return required.every((skill) => owned.has(skill));
  });
}

export function filterCandidatesBySeniority(candidates: Candidate[], seniority: SeniorityLevel): Candidate[] {
  return candidates.filter((candidate) => candidate.seniority === seniority);
}

export function filterCandidatesByAvailability(candidates: Candidate[], availability: AvailabilityStatus[]): Candidate[] {
  return candidates.filter((candidate) => availability.includes(candidate.availability));
}

// Positive when `a` goes after `b`: flipping the sign turns ascending into descending.
function byNumber(a: number, b: number, order: SortOrder): number {
  return order === "asc" ? a - b : b - a;
}

// Array.prototype.sort is stable, so equal values keep their original order.
export function sortCandidatesBySalary(candidates: Candidate[], order: "asc" | "desc"): Candidate[] {
  return [...candidates].sort((a, b) => byNumber(a.expectedSalary, b.expectedSalary, order));
}

export function sortCandidatesByExperience(candidates: Candidate[], order: "asc" | "desc"): Candidate[] {
  return [...candidates].sort((a, b) => byNumber(a.yearsOfExperience, b.yearsOfExperience, order));
}

function compareByCriterion(a: Candidate, b: Candidate, criterion: CandidateSortCriterion): number {
  if (criterion.field === "fullName") {
    const result = a.fullName.localeCompare(b.fullName);
    return criterion.order === "asc" ? result : -result;
  }
  return byNumber(a[criterion.field], b[criterion.field], criterion.order);
}

export function sortCandidatesByFields(candidates: Candidate[], criteria: CandidateSortCriterion[]): Candidate[] {
  return [...candidates].sort((a, b) => {
    for (const criterion of criteria) {
      const result = compareByCriterion(a, b, criterion);
      if (result !== 0) return result;
    }
    return 0;
  });
}

// Ticket lists are expected to be filtered by client first (filterTicketsByClient, decision 10c).

export function filterTicketsByClient(tickets: SupportTicket[], clientId: string): SupportTicket[] {
  return tickets.filter((ticket) => ticket.clientId === clientId);
}

export function filterTicketsByStatus(tickets: SupportTicket[], statuses: TicketStatus[]): SupportTicket[] {
  return tickets.filter((ticket) => statuses.includes(ticket.status));
}

// "asc" = oldest first, the most urgent for the 24 h SLA.
export function sortTicketsByAge(tickets: SupportTicket[], order: "asc" | "desc"): SupportTicket[] {
  return [...tickets].sort((a, b) => byNumber(a.createdAt.getTime(), b.createdAt.getTime(), order));
}
