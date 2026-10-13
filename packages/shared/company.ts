/**
 * Nexova Solutions company data, defined once for every app in the monorepo.
 * Sources: CONTEXT.md and Company-choice.md only. No computed values here;
 * apps derive totals or gaps themselves.
 */

export type BusinessLineId = "headhunting" | "outsourcing" | "training";

export type DepartmentId =
  | "executive"
  | "selection"
  | "training"
  | "support"
  | "sales"
  | "marketing"
  | "hr"
  | "technology";

export type FlagshipAgentId = "helpdesk-support" | "cv-vacancy-matching";

/** What kind of system a department need calls for. */
export type NeedType = "agent" | "dashboard" | "automation" | "portal";

export interface Need {
  text: string;
  type: NeedType;
}

export interface NeedTypeInfo {
  id: NeedType;
  label: string;
  /** CSS variable from packages/shared/styles/tokens.css. */
  colorToken: string;
}

export interface Company {
  name: string;
  foundedYear: number;
  headquarters: { city: string; country: string };
  offices: { city: string; region: string; country: string }[];
  employees: number;
  approxAnnualRevenueUsd: number;
  clientProfile: string;
  clientIndustries: string[];
}

export interface BusinessLine {
  id: BusinessLineId;
  name: string;
  description: string;
}

export interface Department {
  id: DepartmentId;
  name: string;
  manager: string;
  /** Team size exactly as CONTEXT.md states it; null when it gives no number. */
  teamSize: number | null;
  /** Present when the team size figure is ambiguous or missing. */
  teamSizeNote?: string;
  today: string;
  problem: string;
  needs: Need[];
}

export interface SupportSla {
  committedHours: number;
  currentAverageHours: number;
  agents: number;
}

export interface TargetMetric {
  name: string;
  target: string;
}

export interface FlagshipAgent {
  id: FlagshipAgentId;
  name: string;
  departmentId: DepartmentId;
  goal: string;
  targetMetrics: TargetMetric[];
  /** How the agent works, in 4 steps. */
  flow: string[];
  status: "planned";
}

export const company: Company = {
  name: "Nexova Solutions",
  foundedYear: 2011,
  headquarters: { city: "Valencia", country: "Spain" },
  offices: [{ city: "Miami", region: "Florida", country: "United States" }],
  employees: 120,
  approxAnnualRevenueUsd: 8_000_000,
  clientProfile:
    "Mid-sized companies that have decided to outsource some or all of their talent management.",
  clientIndustries: ["technology", "retail", "financial services"],
};

export const businessLines: BusinessLine[] = [
  {
    id: "headhunting",
    name: "Executive and mid-management headhunting",
    description:
      "Recruitment processes run on behalf of client companies, from the initial briefing through CV screening and interviews to final placement.",
  },
  {
    id: "outsourcing",
    name: "Customer support team outsourcing",
    description:
      "Dedicated support teams that handle customer incidents by phone, email and chat on behalf of technology, retail and finance client companies.",
  },
  {
    id: "training",
    name: "Corporate training",
    description:
      "Courses, workshops and webinars in soft skills and leadership, designed and delivered for client companies.",
  },
];

export const NEED_TYPES: NeedTypeInfo[] = [
  { id: "agent", label: "AI agents and assistants", colorToken: "--color-green" },
  { id: "dashboard", label: "Dashboards and metrics", colorToken: "--color-green-line" },
  { id: "automation", label: "Automations and alerts", colorToken: "--color-rust" },
  { id: "portal", label: "Portals and knowledge bases", colorToken: "--color-ink-muted" },
];

export const departments: Department[] = [
  {
    id: "executive",
    name: "Executive Direction",
    manager: "Laura Mendoza",
    teamSize: null,
    teamSizeNote: "CONTEXT.md gives no team size for Executive Direction; Laura Mendoza is the CEO and founder.",
    today: "Each department head prepares a weekly PDF report for Laura by hand, taking 4 to 8 hours per manager.",
    problem: "There is no unified view of the business, and strategic decisions are made with week-old data.",
    needs: [
      { text: "Unified executive dashboard with real-time KPIs from all areas", type: "dashboard" },
      { text: "Automatically generated weekly report", type: "automation" },
      { text: "Strategic threshold alerts", type: "automation" },
      { text: "Natural-language AI assistant she can query directly", type: "agent" },
    ],
  },
  {
    id: "selection",
    name: "Talent Selection Operations",
    manager: "Javier Almeida",
    teamSize: 40,
    today: "Consultants screen 30 to 80 CVs by hand per search and email candidates individually with no templates.",
    problem:
      "There is no real-time view of each candidate's status, so clients call to ask, and candidate–vacancy matching relies entirely on consultant intuition.",
    needs: [
      { text: "AI-assisted selection pipeline with automatic CV scoring and ranking", type: "agent" },
      { text: "RAG system over the candidate database", type: "agent" },
      { text: "Candidate portal with real-time status", type: "portal" },
      { text: "Communication agent that sends automatic status emails", type: "automation" },
    ],
  },
  {
    id: "training",
    name: "Corporate Training",
    manager: "Elena Vargas",
    teamSize: 12,
    teamSizeNote: "CONTEXT.md says Elena Vargas \"leads a team of 12\"; it does not say whether she is included.",
    today:
      "The catalogue is a PDF updated quarterly, enrolments arrive through a Google Form managed in a spreadsheet, and attendance is tracked in Excel lists.",
    problem:
      "The catalogue is invisible to most potential buyers, completions are not recorded, and every client receives the same proposal.",
    needs: [
      { text: "Searchable training catalogue with online enrolment", type: "portal" },
      { text: "Recommendation system that suggests programmes based on client profile", type: "agent" },
      { text: "Learner portal with progress tracking", type: "portal" },
      { text: "Training advisory chatbot that builds personalised training plans", type: "agent" },
    ],
  },
  {
    id: "support",
    name: "Customer Support",
    manager: "Roberto Díaz",
    teamSize: 30,
    today:
      "Agents handle incidents by phone, email and web chat, resolving them from experience and a shared Word document on Drive.",
    problem:
      "Average resolution time is 48 hours against a committed 24-hour SLA, and supervisors have no real-time visibility into workload or backlog.",
    needs: [
      { text: "First-line support chatbot that resolves 40% of queries without human intervention using RAG", type: "agent" },
      { text: "Centralised knowledge base with semantic search", type: "portal" },
      { text: "Real-time support dashboard", type: "dashboard" },
      { text: "Ticket sentiment analysis that flags dissatisfied clients before they escalate", type: "agent" },
    ],
  },
  {
    id: "sales",
    name: "Sales and Business Development",
    manager: "Marcos Ibáñez",
    teamSize: 18,
    teamSizeNote:
      "18 people: 6 account managers and 12 SDRs. CONTEXT.md names Megan Clarke as Sales lead in its overview and Marcos Ibáñez in the department profile; Marcos Ibáñez is used pending confirmation.",
    today:
      "SDRs prospect manually on LinkedIn, export lists to Excel and follow up by email; only 40% of the team updates HubSpot consistently.",
    problem:
      "Deals are lost for lack of follow-up, and there is no visibility into which prospects are most likely to close.",
    needs: [
      { text: "Sales pipeline dashboard", type: "dashboard" },
      { text: "Prospecting sequence automation (first contact, follow-up, close or discard)", type: "automation" },
      { text: "Deal alerts for inactive conversations", type: "automation" },
      { text: "AI agent that suggests personalised proposal angles based on a prospect's profile", type: "agent" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing and Communications",
    manager: "Carmen Ruiz",
    teamSize: null,
    teamSizeNote: "CONTEXT.md describes \"a small team\" without a number.",
    today: "The team produces the corporate website, LinkedIn, the monthly newsletter and the blog by hand.",
    problem:
      "The 2019 website is slow, not accessible and outdated, and the team knows visit counts but not what converts.",
    needs: [
      { text: "Corporate website redesign with SEO/GEO optimisation and schema.org markup", type: "portal" },
      { text: "AI-assisted content pipeline", type: "automation" },
      { text: "Marketing metrics dashboard tracking visits, traffic sources and conversion rates", type: "dashboard" },
    ],
  },
  {
    id: "hr",
    name: "Human Resources",
    manager: "Patricia Solís",
    teamSize: 4,
    teamSizeNote: "CONTEXT.md says Patricia Solís works \"with a team of four\"; it does not say whether she is included.",
    today:
      "Holidays, absences and queries are handled by email and spreadsheets, onboarding is manual, and twice-yearly reviews run on Google Forms.",
    problem: "There are no HR metrics: no turnover rate, no absenteeism data and no average time-to-fill for internal roles.",
    needs: [
      { text: "Internal HR portal", type: "portal" },
      { text: "Automated onboarding flow with progressive checklists", type: "automation" },
      { text: "HR KPI dashboard", type: "dashboard" },
      { text: "Internal HR agent that answers questions about policies and benefits", type: "agent" },
    ],
  },
  {
    id: "technology",
    name: "Technology and Infrastructure",
    manager: "Sergio Molina",
    teamSize: 6,
    teamSizeNote: "CONTEXT.md says CTO Sergio Molina \"has a team of six\"; it does not say whether he is included.",
    today:
      "The team runs disconnected tools (HubSpot, legacy Zendesk, Google Workspace, a home-built ATS from the 2010s and spreadsheets) and deploys manually.",
    problem: "There is no telemetry or centralised logging, so failures are reported by users.",
    needs: [
      { text: "Centralised telemetry and logging", type: "dashboard" },
      { text: "Data pipeline that feeds all company dashboards", type: "automation" },
      { text: "Real-time monitoring with automatic alerts", type: "automation" },
      { text: "Internal engineering agent that answers architecture questions from technical documentation", type: "agent" },
    ],
  },
];

export const supportSla: SupportSla = {
  committedHours: 24,
  currentAverageHours: 48,
  agents: 30,
};

export const flagshipAgents: FlagshipAgent[] = [
  {
    id: "helpdesk-support",
    name: "L1 HelpDesk Support Agent",
    departmentId: "support",
    goal:
      "Cut average incident resolution time from 48 hours to the committed 24-hour SLA by resolving tickets at Level 1 and escalating the rest to Level 2 with a summary, keeping each client company's data isolated.",
    targetMetrics: [
      { name: "Tickets resolved at Level 1 without escalation", target: "40% or more within the first 3 months live" },
      { name: "Average resolution time", target: "Under 24 hours (48 hours today)" },
      { name: "Groundedness of Level 1 answers against the knowledge base", target: "No hallucinated answers reaching the customer" },
    ],
    flow: [
      "Ticket arrives, tagged by client",
      "Searches that client’s knowledge base only",
      "Confident and not sensitive?",
      "Answers, or escalates with a summary",
    ],
    status: "planned",
  },
  {
    id: "cv-vacancy-matching",
    name: "CV–Vacancy Matching Agent",
    departmentId: "selection",
    goal:
      "Rank incoming CVs against a vacancy's must-have and nice-to-have requirements, so selection consultants review an explainable shortlist instead of reading 30 to 80 CVs by hand.",
    targetMetrics: [
      { name: "Top-5 recall against who was actually hired for similar roles", target: "The right candidates appear near the top" },
      { name: "Time saved per search", target: "Less than reading 30 to 80 CVs manually" },
      { name: "Consultant override rate", target: "Trending down over time as weights are calibrated" },
    ],
    flow: ["Vacancy brief with must-haves", "CVs parsed into fields", "Scored and explained", "Consultant accepts or reorders"],
    status: "planned",
  },
];
