// Milestone 3 demo: run with `pnpm demo` (or `node src/demo.ts`). Grows step by step until S08.
import { sampleCandidates, sampleVacancy } from "./data/sampleData.ts";
import { getCandidateScoreBreakdown, groupCandidatesBySeniority, isHighMatch, rankCandidatesForVacancy } from "./utils/transformations.ts";

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
