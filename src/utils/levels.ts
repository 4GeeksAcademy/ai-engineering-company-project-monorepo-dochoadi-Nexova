import type { AvailabilityStatus, EnglishLevel, SeniorityLevel } from "../types/models.ts";

// Lowest to highest (decision 4 in docs/milestone-3/decisions.md).
export const ENGLISH_LEVELS: readonly EnglishLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];

export const SENIORITY_LEVELS: readonly SeniorityLevel[] = ["Junior", "Semi-Senior", "Senior", "Lead", "Executive"];

// Soonest first: the tie-break order of the ranking (decision B).
export const AVAILABILITY_ORDER: readonly AvailabilityStatus[] = ["Immediate", "2 weeks", "1 month", "Not available"];

// Negative when `a` is below `b`, 0 when equal, positive when above.
export function compareEnglishLevel(a: EnglishLevel, b: EnglishLevel): number {
  return ENGLISH_LEVELS.indexOf(a) - ENGLISH_LEVELS.indexOf(b);
}

export function seniorityDistance(a: SeniorityLevel, b: SeniorityLevel): number {
  return Math.abs(SENIORITY_LEVELS.indexOf(a) - SENIORITY_LEVELS.indexOf(b));
}
