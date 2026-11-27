import type { Candidate, ScoreBreakdown, ScoreWarning, SeniorityLevel, Vacancy } from "../types/models.ts";
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
