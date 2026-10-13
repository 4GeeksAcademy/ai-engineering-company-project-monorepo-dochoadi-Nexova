/** Pure calculations behind the overview. No React, no DOM: tested with node:test. */
import { NEED_TYPES } from "@repo/shared-types";
import type { Department, NeedType } from "@repo/shared-types";

const HOUR_MS = 3_600_000;

export interface SlaGap {
  /** Hours over (positive) or under (negative) the committed SLA. */
  hours: number;
  /** The gap as a rounded percentage of the committed hours. */
  percent: number;
  breached: boolean;
}

export function slaGap(currentHours: number, committedHours: number): SlaGap {
  const hours = currentHours - committedHours;
  return { hours, percent: Math.round((hours / committedHours) * 100), breached: currentHours > committedHours };
}

export interface HeadcountSummary {
  declared: number;
  /** Sum of the stated team sizes. */
  accountedFor: number;
  /** Names of the teams with no stated size, in input order. */
  unknownTeams: string[];
  difference: number;
}

export function headcountSummary(
  departments: readonly Pick<Department, "name" | "teamSize">[],
  declared: number,
): HeadcountSummary {
  let accountedFor = 0;
  const unknownTeams: string[] = [];
  for (const d of departments) {
    if (d.teamSize === null) unknownTeams.push(d.name);
    else accountedFor += d.teamSize;
  }
  return { declared, accountedFor, unknownTeams, difference: declared - accountedFor };
}

export function needsByType(departments: readonly Pick<Department, "needs">[]): Record<NeedType, number> {
  const counts = Object.fromEntries(NEED_TYPES.map((t) => [t.id, 0])) as Record<NeedType, number>;
  for (const d of departments) {
    for (const n of d.needs) counts[n.type] += 1;
  }
  return counts;
}

/** When a ticket arriving at `now` is due under the SLA, and when it is typically resolved today. */
export function slaDueTimes(now: Date, committedHours: number, currentHours: number): { due: Date; typical: Date } {
  return {
    due: new Date(now.getTime() + committedHours * HOUR_MS),
    typical: new Date(now.getTime() + currentHours * HOUR_MS),
  };
}
