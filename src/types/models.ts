// Nexova domain types. The briefing's entities are copied exactly from BRIEFING.md
// (names, field order, types and comments); only `export` is added.

export interface Candidate {
  id: string; // Unique identifier (e.g., "C-2024-0451")
  fullName: string; // Full name
  email: string; // Contact email
  phone: string; // Contact phone
  yearsOfExperience: number; // Total years of professional experience
  skills: string[]; // Array of skills (e.g., ["TypeScript", "React", "Node.js"])
  englishLevel: EnglishLevel; // English proficiency
  seniority: SeniorityLevel; // Professional level
  currentSalary: number; // Current salary in USD
  expectedSalary: number; // Expected salary in USD
  availability: AvailabilityStatus; // Current availability
  location: string; // City and country (e.g., "Valencia, Spain")
  remoteOnly: boolean; // Only accepts remote positions
  status: CandidateStatus; // Current status in the database
}

export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";
export type SeniorityLevel =
  | "Junior"
  | "Semi-Senior"
  | "Senior"
  | "Lead"
  | "Executive";
export type AvailabilityStatus = "Immediate" | "2 weeks" | "1 month" | "Not available";
export type CandidateStatus = "Active" | "In process" | "Hired" | "Inactive";

export interface Vacancy {
  id: string; // Unique identifier (e.g., "V-2024-0892")
  title: string; // Position title (e.g., "Senior Full-Stack Developer")
  companyName: string; // Client company name
  requiredSkills: string[]; // Required technical skills
  preferredSkills: string[]; // Nice-to-have skills
  minYearsExperience: number; // Minimum required experience
  maxYearsExperience: number; // Maximum relevant experience
  requiredEnglishLevel: EnglishLevel; // Minimum English level
  requiredSeniority: SeniorityLevel; // Seniority level required
  salaryRangeMin: number; // Minimum salary offered (USD)
  salaryRangeMax: number; // Maximum salary offered (USD)
  isRemote: boolean; // Remote position
  location: string; // Office location if not remote
  status: VacancyStatus; // Current vacancy status
}

export type VacancyStatus = "Open" | "In progress" | "Closed" | "On hold";

export interface SelectionProcess {
  id: string; // Unique identifier (e.g., "SP-2024-1523")
  candidateId: string; // Reference to candidate
  vacancyId: string; // Reference to vacancy
  stage: ProcessStage; // Current stage
  score: number; // Match score (0-100)
  notes: string; // Consultant notes
  createdAt: Date; // Process start date
  updatedAt: Date; // Last update date
}

export type ProcessStage =
  | "Screening"
  | "Interview"
  | "Technical test"
  | "Final interview"
  | "Offer"
  | "Rejected"
  | "Hired";

// ===== Extensions from Company-choice.md =====
// Not part of the briefing (docs/milestone-3/model.md). `clientId` is the tenant id
// (decision 10c); the briefing entities reach their client through ClientVacancy.

export type NexovaOffice = "Valencia" | "Miami";
export type NexovaService = "Talent Selection" | "Customer Support";
export type EmployeeRole = "Selection Consultant" | "Support Agent";
export type TicketChannel = "Chat" | "Email" | "Widget" | "Phone";
export type TicketStatus = "Open" | "Resolved";
export type SupportLevel = "L1" | "L2";
export type RankingDecisionType = "Accepted" | "Overridden";

export interface ClientCompany {
  id: string;
  name: string;
  taxId: string;
  contactEmail: string;
  office: NexovaOffice;
  services: NexovaService[];
}

// A vacancy owned by one client and run by one consultant. It can be passed
// wherever a Vacancy is expected, so the briefing functions stay unchanged.
export interface ClientVacancy extends Vacancy {
  clientId: string;
  consultantId: string;
}

export interface NexovaEmployee {
  id: string;
  fullName: string;
  email: string;
  role: EmployeeRole;
  office: NexovaOffice;
}

export interface RankingDecision {
  id: string;
  vacancyId: string;
  candidateId: string;
  consultantId: string;
  suggestedRank: number;
  finalRank: number;
  decision: RankingDecisionType;
  reason: string;
  decidedAt: Date;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  channel: TicketChannel;
  query: string;
  status: TicketStatus;
  level: SupportLevel;
  assignedAgentId: string | null;
  escalationSummary: string;
  createdAt: Date;
  resolvedAt: Date | null;
}

export interface KnowledgeBaseArticle {
  id: string;
  clientId: string;
  title: string;
  problem: string;
  solution: string;
  keywords: string[];
  sourceTicketId: string | null;
  createdAt: Date;
}

// ===== Computed types (results of functions, never stored) =====

// Facts the consultant should check. A warning never changes a score and never removes a candidate.
export type ScoreWarning =
  | "missing-required-skills"
  | "under-half-required-skills"
  | "vacancy-has-no-required-skills"
  | "preferred-points-capped"
  | "remote-mismatch"
  | "candidate-not-available"
  | "candidate-not-active"
  | "experience-below-range"
  | "experience-above-range"
  | "seniority-mismatch"
  | "english-below-required"
  | "salary-below-range"
  | "salary-above-range";

// Points per part of the match score, which skills matched or are missing, and the warnings.
export interface ScoreBreakdown {
  skills: number;
  experience: number;
  seniority: number;
  english: number;
  salary: number;
  matchedRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  warnings: ScoreWarning[];
}

export type SlaStatus = "On time" | "At risk" | "Breached";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
