export type { Id, BaseEntity } from "./types/index.ts";
export type {
  Company,
  BusinessLine,
  BusinessLineId,
  Department,
  DepartmentId,
  SupportSla,
  FlagshipAgent,
  FlagshipAgentId,
  TargetMetric,
} from "./company.ts";
export { company, businessLines, departments, supportSla, flagshipAgents } from "./company.ts";
