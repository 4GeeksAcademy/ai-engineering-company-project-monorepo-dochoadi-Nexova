// Milestone 3 demo: run with `pnpm demo` (or `node src/demo.ts`). Grows step by step until S08.
import {
  sampleCandidates,
  sampleClientVacancies,
  sampleClients,
  sampleRankingDecisions,
  sampleSelectionProcesses,
  sampleSupportTickets,
  sampleVacancy,
} from "./data/sampleData.ts";
import { filterTicketsByClient } from "./utils/collections.ts";
import {
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
  getCandidateScoreBreakdown,
  getSlaStatus,
  groupCandidatesBySeniority,
  isHighMatch,
  rankCandidatesForVacancy,
} from "./utils/transformations.ts";

// A fixed report time, so the SLA lines are the same on every run.
const REPORT_TIME = new Date("2026-11-05T10:00:00Z");

function formatCounts(counts: Record<string, number>): string {
  return Object.entries(counts)
    .map(([key, count]) => `${key} ${count}`)
    .join(" · ");
}

console.log(`Ranking for ${sampleVacancy.id} "${sampleVacancy.title}" (${sampleVacancy.companyName})`);
console.log("Score = skills (40) + experience (20) + seniority (15) + English (15) + salary (10). A ranking aid: the consultant decides.");
console.log("");

rankCandidatesForVacancy(sampleCandidates, sampleVacancy).forEach(({ candidate, score }, index) => {
  const parts = getCandidateScoreBreakdown(candidate, sampleVacancy);
  const highMatch = isHighMatch(score) ? "  HIGH MATCH" : "";
  console.log(`${index + 1}. ${candidate.fullName} (${candidate.id}): ${score}/100${highMatch}`);
  console.log(`   skills ${parts.skills} · experience ${parts.experience} · seniority ${parts.seniority} · English ${parts.english} · salary ${parts.salary}`);
  console.log(`   missing required skills: ${parts.missingRequiredSkills.join(", ") || "none"}`);
  console.log(`   warnings: ${parts.warnings.join(", ") || "none"}`);
});

console.log("");
console.log("Candidates by seniority:");
for (const [level, group] of Object.entries(groupCandidatesBySeniority(sampleCandidates))) {
  console.log(`   ${level}: ${group.map((candidate) => candidate.fullName).join(", ") || "none"}`);
}

console.log("");
console.log("Recruitment report (all sample data):");
console.log(`   candidates by status: ${formatCounts(countCandidatesByStatus(sampleCandidates))}`);
console.log(`   average expected salary: ${calculateAverageSalary(sampleCandidates)} USD`);
console.log(`   top 4 skills: ${findTopSkills(sampleCandidates, 4).map(({ skill, count }) => `${skill} (${count})`).join(", ")}`);
console.log(`   fill rate: ${calculateVacancyFillRate(sampleSelectionProcesses)} %`);
console.log(`   processes by stage: ${formatCounts(countProcessesByStage(sampleSelectionProcesses))}`);
console.log(`   average time to hire: ${calculateAverageTimeToHire(sampleSelectionProcesses)} days`);

console.log("");
console.log(`Per client (one client's data only; SLA ${SLA_HOURS} h, report time ${REPORT_TIME.toISOString()}):`);
for (const client of sampleClients) {
  const vacancyIds = sampleClientVacancies.filter((vacancy) => vacancy.clientId === client.id).map((vacancy) => vacancy.id);
  const decisions = sampleRankingDecisions.filter((decision) => vacancyIds.includes(decision.vacancyId));
  const tickets = filterTicketsByClient(sampleSupportTickets, client.id);
  console.log(`   ${client.name} (${client.id}, ${client.office}):`);
  console.log(`      ranking override rate: ${calculateOverrideRate(decisions)} % of ${decisions.length} decisions`);
  console.log(`      L1 resolution rate: ${calculateL1ResolutionRate(tickets)} % · average resolution: ${calculateAverageResolutionHours(tickets)} h`);
  for (const ticket of tickets) {
    console.log(`      ${ticket.id} ${ticket.status} ${ticket.level}: ${getSlaStatus(ticket, REPORT_TIME)}`);
  }
}

