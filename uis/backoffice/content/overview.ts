/**
 * Backoffice copy, word for word from the approved design
 * (docs/milestone-1/design/nexova-backoffice.html). Company facts are not
 * retyped here: they come from @repo/shared-types and are passed in.
 */
import type { DepartmentId } from "@repo/shared-types";

export const metadataCopy = {
  title: "Nexova Backoffice — Operations overview",
  description: "Internal operations overview of Nexova Solutions, built from the company briefing.",
};

export const shell = {
  brandName: "Nexova",
  brandTag: "Backoffice",
  brandLabel: "Nexova Backoffice, overview",
  navLabel: "Backoffice",
  overview: "Overview",
  departmentsGroup: "Departments",
  noTeamSize: "–",
  footer: "Internal tool. Sign-in comes later.",
  menuOpen: "Menu",
  menuClose: "Close",
  crumbRoot: "Backoffice / ",
  crumbPage: "Operations overview",
  avatar: "NX",
  avatarLabel: "Signed in as Nexova staff",
  timePlaceholder: "--:--",
  datePlaceholder: "–",
};

/** Display order and short sidebar labels of the 8 departments, as in the design. */
export const departmentLabels: { id: DepartmentId; label: string }[] = [
  { id: "selection", label: "Talent Selection" },
  { id: "support", label: "Customer Support" },
  { id: "training", label: "Corporate Training" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "hr", label: "Human Resources" },
  { id: "technology", label: "Technology" },
  { id: "executive", label: "Executive" },
];

export const intro = {
  title: "Operations overview",
  lede: "Where Nexova stands today, from the company briefing. Live data arrives with the first integrations.",
};

export const kpis = {
  heading: "Key indicators",
  sla: {
    label: "Support SLA",
    chip: "Breached",
    value: (hours: number) => `+${hours} h`,
    srValue: (hours: number) => `${hours} hours over the SLA`,
    sub: (current: number, committed: number, percent: number) =>
      `${current} h average against ${committed} h committed, ${percent} % over.`,
    barLabel: (current: number, committed: number) =>
      `Average resolution ${current} hours against a ${committed} hour SLA`,
    legendStart: "0 h",
    legendCommitted: (committed: number) => `${committed} h SLA`,
    legendCurrent: (current: number) => `${current} h`,
  },
  headcount: {
    label: "Headcount",
    declared: (declared: number) => `declared ${declared}`,
    of: (declared: number) => ` of ${declared}`,
    srValue: (accountedFor: number, declared: number) => `${accountedFor} of ${declared} people accounted for by team`,
    unknown: (teams: string[]) => `${teams.length} teams without a stated size: ${teams.join(" and ")}.`,
    segmentLabel: (team: string, size: number) => `${team}, ${size} people`,
    segmentTip: (team: string, size: number, percent: number, declared: number) =>
      `${team}: ${size} people (${percent} % of ${declared})`,
    tipIdle: "Point at a segment to see the team.",
  },
  businessLines: { label: "Business lines" },
  agents: { label: "Flagship agents", chip: "Planned" },
};

export const work = {
  title: "Where the work is",
  note: (total: number, departments: number) => `${total} needs across ${departments} departments, by type`,
  filtersLabel: "Highlight needs by type",
  idle: "Choose a type to highlight it in every department.",
  summary: (count: number, label: string, departments: number) =>
    `${count} ${label.toLowerCase()} across ${departments} departments, highlighted below.`,
};

export const departmentsCopy = {
  title: "Departments",
  note: "Managers, team size and what each area needs, from the briefing",
  people: "people",
  notStated: "Not stated",
  teamSize: "team size",
  today: "Today:",
  problem: "Problem:",
  needs: "Needs",
  clockCaption: (time: string) => `If a ticket arrived now (${time})`,
  slaDue: "SLA due",
  typical: "Typical resolution",
};

export const agentsCopy = {
  title: "Flagship agents",
  note: "The first AI systems this project will build",
  chip: "Planned",
  flowLabel: "How it works",
  flowHint: "Hover or focus to play the flow",
  /** Delay between the flow steps' highlights, in ms. */
  stepDelayMs: 1300,
};

export const openQuestions = {
  title: "Open questions from the company briefing",
  officesTopic: "Offices",
  offices: (cities: string[]) => `the headcount split between ${cities.join(" and ")} is not given.`,
};
