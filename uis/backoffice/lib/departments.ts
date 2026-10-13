import { departments } from "@repo/shared-types";
import type { Department } from "@repo/shared-types";
import { departmentLabels } from "@/content/overview";

export interface BoardDepartment extends Department {
  /** Short name for the sidebar and summaries. */
  label: string;
}

/** The shared departments in the design's display order, each with its short label. */
export const boardDepartments: BoardDepartment[] = departmentLabels.map(({ id, label }) => {
  const d = departments.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown department id: ${id}`);
  return { ...d, label };
});
