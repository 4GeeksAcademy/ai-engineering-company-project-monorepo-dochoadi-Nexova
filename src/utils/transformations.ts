import { supportSla } from "../../packages/shared/company.ts";
import type {
  Candidate,
  CandidateStatus,
  ProcessStage,
  RankingDecision,
  ScoreBreakdown,
  ScoreWarning,
  SelectionProcess,
  SeniorityLevel,
  SlaStatus,
  SupportTicket,
  Vacancy,
} from "../types/models.ts";
import { AVAILABILITY_ORDER, compareEnglishLevel, seniorityDistance } from "./levels.ts";

const HIGH_MATCH_SCORE = 90;

function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

interface SkillsResult {
  points: number;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  warnings: ScoreWarning[];
}

// Skills part, max 40 (decisions 1, 5 and C).
function scoreSkills(candidate: Candidate, vacancy: Vacancy): SkillsResult {
  const owned = new Set(candidate.skills.map(normalizeSkill));
  const has = (skill: string): boolean => owned.has(normalizeSkill(skill));
  const matchedRequiredSkills = vacancy.requiredSkills.filter(has);
  const missingRequiredSkills = vacancy.requiredSkills.filter((skill) => !has(skill));
  const matchedPreferredSkills = vacancy.preferredSkills.filter(has);
  const missingPreferredSkills = vacancy.preferredSkills.filter((skill) => !has(skill));
  const lists = { matchedRequiredSkills, missingRequiredSkills, matchedPreferredSkills, missingPreferredSkills };

  if (vacancy.requiredSkills.length === 0) {
    return { points: 0, ...lists, warnings: ["vacancy-has-no-required-skills"] };
  }
  const share = matchedRequiredSkills.length / vacancy.requiredSkills.length;
  const base = share === 1 ? 40 : share >= 0.5 ? 20 : 0;
  const preferred = Math.min(20, 10 * matchedPreferredSkills.length);
  const warnings: ScoreWarning[] = [];
  if (missingRequiredSkills.length > 0) warnings.push("missing-required-skills");
  if (share < 0.5) warnings.push("under-half-required-skills");
  if (base + preferred > 40) warnings.push("preferred-points-capped");
  return { points: Math.min(40, base + preferred), ...lists, warnings };
}

// Experience part, max 20: inside the range, or the distance to its nearest bound (decision 3).
function scoreExperience(candidate: Candidate, vacancy: Vacancy): { points: number; warnings: ScoreWarning[] } {
  const years = candidate.yearsOfExperience;
  if (years < vacancy.minYearsExperience) {
    return { points: vacancy.minYearsExperience - years <= 2 ? 10 : 0, warnings: ["experience-below-range"] };
  }
  if (years > vacancy.maxYearsExperience) {
    return { points: years - vacancy.maxYearsExperience <= 2 ? 10 : 0, warnings: ["experience-above-range"] };
  }
  return { points: 20, warnings: [] };
}

function scoreSeniority(candidate: Candidate, vacancy: Vacancy): { points: number; warnings: ScoreWarning[] } {
  const distance = seniorityDistance(candidate.seniority, vacancy.requiredSeniority);
  if (distance === 0) return { points: 15, warnings: [] };
  if (distance === 1) return { points: 7, warnings: [] };
  return { points: 0, warnings: ["seniority-mismatch"] };
}

function scoreEnglish(candidate: Candidate, vacancy: Vacancy): { points: number; warnings: ScoreWarning[] } {
  return compareEnglishLevel(candidate.englishLevel, vacancy.requiredEnglishLevel) >= 0
    ? { points: 15, warnings: [] }
    : { points: 0, warnings: ["english-below-required"] };
}

// Salary part, max 10; below the minimum still earns 10 (decision A).
function scoreSalary(candidate: Candidate, vacancy: Vacancy): { points: number; warnings: ScoreWarning[] } {
  const expected = candidate.expectedSalary;
  if (expected < vacancy.salaryRangeMin) return { points: 10, warnings: ["salary-below-range"] };
  if (expected <= vacancy.salaryRangeMax) return { points: 10, warnings: [] };
  // "Up to 20 % above the max", in whole numbers so 120 % of the max is never lost to rounding.
  const withinTwentyPercent = expected * 100 <= vacancy.salaryRangeMax * 120;
  return { points: withinTwentyPercent ? 5 : 0, warnings: ["salary-above-range"] };
}

function candidateWarnings(candidate: Candidate, vacancy: Vacancy): { fit: ScoreWarning[]; status: ScoreWarning[] } {
  const fit: ScoreWarning[] = candidate.remoteOnly && !vacancy.isRemote ? ["remote-mismatch"] : [];
  const status: ScoreWarning[] = [];
  if (candidate.availability === "Not available") status.push("candidate-not-available");
  if (candidate.status === "Hired" || candidate.status === "Inactive") status.push("candidate-not-active");
  return { fit, status };
}

export function getCandidateScoreBreakdown(candidate: Candidate, vacancy: Vacancy): ScoreBreakdown {
  const skills = scoreSkills(candidate, vacancy);
  const experience = scoreExperience(candidate, vacancy);
  const seniority = scoreSeniority(candidate, vacancy);
  const english = scoreEnglish(candidate, vacancy);
  const salary = scoreSalary(candidate, vacancy);
  const other = candidateWarnings(candidate, vacancy);
  return {
    skills: skills.points,
    experience: experience.points,
    seniority: seniority.points,
    english: english.points,
    salary: salary.points,
    matchedRequiredSkills: skills.matchedRequiredSkills,
    missingRequiredSkills: skills.missingRequiredSkills,
    matchedPreferredSkills: skills.matchedPreferredSkills,
    missingPreferredSkills: skills.missingPreferredSkills,
    // Same order as the ScoreWarning union.
    warnings: [
      ...skills.warnings,
      ...other.fit,
      ...other.status,
      ...experience.warnings,
      ...seniority.warnings,
      ...english.warnings,
      ...salary.warnings,
    ],
  };
}

function totalPoints(breakdown: ScoreBreakdown): number {
  return breakdown.skills + breakdown.experience + breakdown.seniority + breakdown.english + breakdown.salary;
}

export function calculateCandidateScore(candidate: Candidate, vacancy: Vacancy): number {
  return totalPoints(getCandidateScoreBreakdown(candidate, vacancy));
}

// Highest score first; ties: more required skills matched, then sooner availability, then the original order (decision B).
export function rankCandidatesForVacancy(candidates: Candidate[], vacancy: Vacancy): Array<{ candidate: Candidate; score: number }> {
  return candidates
    .map((candidate) => {
      const breakdown = getCandidateScoreBreakdown(candidate, vacancy);
      return { candidate, score: totalPoints(breakdown), requiredMatched: breakdown.matchedRequiredSkills.length };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.requiredMatched - a.requiredMatched ||
        AVAILABILITY_ORDER.indexOf(a.candidate.availability) - AVAILABILITY_ORDER.indexOf(b.candidate.availability),
    )
    .map(({ candidate, score }) => ({ candidate, score }));
}

export function groupCandidatesBySeniority(candidates: Candidate[]): Record<SeniorityLevel, Candidate[]> {
  const ofLevel = (level: SeniorityLevel): Candidate[] => candidates.filter((candidate) => candidate.seniority === level);
  return {
    Junior: ofLevel("Junior"),
    "Semi-Senior": ofLevel("Semi-Senior"),
    Senior: ofLevel("Senior"),
    Lead: ofLevel("Lead"),
    Executive: ofLevel("Executive"),
  };
}

export function isHighMatch(score: number): boolean {
  return score >= HIGH_MATCH_SCORE;
}

// ===== Reports and KPIs (S06) =====
// Ticket, process and decision lists are expected to be one client's already (decision 10c).

export const SLA_HOURS: number = supportSla.committedHours;
export const SLA_AT_RISK_HOURS = 20;

const MS_PER_HOUR = 60 * 60 * 1000;

// Decision 8: round to 2 decimals.
function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

function percentage(part: number, total: number): number {
  return total === 0 ? 0 : roundTo2((part / total) * 100);
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : roundTo2(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function hoursBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / MS_PER_HOUR;
}

export function countCandidatesByStatus(candidates: Candidate[]): Record<CandidateStatus, number> {
  const countOf = (status: CandidateStatus): number => candidates.filter((candidate) => candidate.status === status).length;
  return {
    Active: countOf("Active"),
    "In process": countOf("In process"),
    Hired: countOf("Hired"),
    Inactive: countOf("Inactive"),
  };
}

export function calculateAverageSalary(candidates: Candidate[]): number {
  return average(candidates.map((candidate) => candidate.expectedSalary));
}

interface SkillTally {
  count: number;
  spellings: Map<string, number>;
}

// Each candidate counts a skill once; the label is the most common spelling, the first found on a tie (decision 13G).
export function findTopSkills(candidates: Candidate[], topN: number): Array<{ skill: string; count: number }> {
  if (topN <= 0) return [];
  const tallies = new Map<string, SkillTally>();
  for (const candidate of candidates) {
    const seen = new Set<string>();
    for (const rawSkill of candidate.skills) {
      const spelling = rawSkill.trim();
      const key = spelling.toLowerCase();
      if (key === "" || seen.has(key)) continue;
      seen.add(key);
      const tally = tallies.get(key) ?? { count: 0, spellings: new Map<string, number>() };
      tally.count += 1;
      tally.spellings.set(spelling, (tally.spellings.get(spelling) ?? 0) + 1);
      tallies.set(key, tally);
    }
  }
  return [...tallies.values()]
    .map((tally) => ({ skill: mostCommonSpelling(tally.spellings), count: tally.count }))
    .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill))
    .slice(0, topN);
}

// Map keeps insertion order, so with `>` the first spelling found wins a tie.
function mostCommonSpelling(spellings: Map<string, number>): string {
  let best = "";
  let bestCount = 0;
  for (const [spelling, count] of spellings) {
    if (count > bestCount) {
      best = spelling;
      bestCount = count;
    }
  }
  return best;
}

export function calculateVacancyFillRate(processes: SelectionProcess[]): number {
  return percentage(processes.filter((process) => process.stage === "Hired").length, processes.length);
}

export function countProcessesByStage(processes: SelectionProcess[]): Record<ProcessStage, number> {
  const countOf = (stage: ProcessStage): number => processes.filter((process) => process.stage === stage).length;
  return {
    Screening: countOf("Screening"),
    Interview: countOf("Interview"),
    "Technical test": countOf("Technical test"),
    "Final interview": countOf("Final interview"),
    Offer: countOf("Offer"),
    Rejected: countOf("Rejected"),
    Hired: countOf("Hired"),
  };
}

// Days from createdAt to updatedAt of the "Hired" processes (decision 14E).
export function calculateAverageTimeToHire(processes: SelectionProcess[]): number {
  const hired = processes.filter((process) => process.stage === "Hired");
  return average(hired.map((process) => hoursBetween(process.createdAt, process.updatedAt) / 24));
}

// Decision 14C: resolved tickets stop the clock; a `now` before createdAt counts as 0 h.
export function getSlaStatus(ticket: SupportTicket, now: Date): SlaStatus {
  const end = ticket.resolvedAt ?? now;
  const elapsed = Math.max(0, hoursBetween(ticket.createdAt, end));
  if (elapsed > SLA_HOURS) return "Breached";
  if (ticket.resolvedAt === null && elapsed >= SLA_AT_RISK_HOURS) return "At risk";
  return "On time";
}

// Decision 14A: open tickets have no outcome yet, so only resolved tickets count.
export function calculateL1ResolutionRate(tickets: SupportTicket[]): number {
  const resolved = tickets.filter((ticket) => ticket.status === "Resolved");
  return percentage(resolved.filter((ticket) => ticket.level === "L1").length, resolved.length);
}

export function calculateAverageResolutionHours(tickets: SupportTicket[]): number {
  return average(tickets.flatMap((ticket) => (ticket.resolvedAt === null ? [] : [hoursBetween(ticket.createdAt, ticket.resolvedAt)])));
}

export function calculateOverrideRate(decisions: RankingDecision[]): number {
  return percentage(decisions.filter((decision) => decision.decision === "Overridden").length, decisions.length);
}

