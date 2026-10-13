import { businessLines, company, departments, flagshipAgents, NEED_TYPES, supportSla } from "@repo/shared-types";
import AgentCard from "@/components/AgentCard";
import DepartmentCard from "@/components/DepartmentCard";
import HeadcountKpi from "@/components/HeadcountKpi";
import { NeedsFilterProvider } from "@/components/NeedsFilter";
import OpenQuestions from "@/components/OpenQuestions";
import SlaKpi from "@/components/SlaKpi";
import WorkByType from "@/components/WorkByType";
import { agentsCopy, departmentsCopy, intro, kpis } from "@/content/overview";
import { boardDepartments } from "@/lib/departments";
import { headcountSummary, needsByType, slaGap } from "@/lib/metrics";
import kpi from "@/components/Kpi.module.css";
import styles from "./page.module.css";

const gap = slaGap(supportSla.currentAverageHours, supportSla.committedHours);
const headcount = headcountSummary(
  boardDepartments.map((d) => ({ name: d.label, teamSize: d.teamSize })),
  company.employees,
);
const segments = boardDepartments.flatMap((d) => (d.teamSize === null ? [] : [{ id: d.id, label: d.label, size: d.teamSize }]));
const counts = needsByType(departments);
const needTypes = NEED_TYPES.map((t) => ({
  ...t,
  count: counts[t.id],
  departments: departments.filter((d) => d.needs.some((n) => n.type === t.id)).length,
}));

export default function OverviewPage() {
  return (
    <>
      <div className="rise">
        <h1 className={styles.h1}>{intro.title}</h1>
        <p className={styles.lede}>{intro.lede}</p>
      </div>

      <section aria-labelledby="kpi-h">
        <h2 className="h2 sr-only" id="kpi-h">
          {kpis.heading}
        </h2>
        <div className={styles.kpis}>
          <SlaKpi current={supportSla.currentAverageHours} committed={supportSla.committedHours} gap={gap} />
          <HeadcountKpi summary={headcount} segments={segments} />
          <article className={`${kpi.kpi} rise`}>
            <div className={kpi.kpiHead}>
              <span>{kpis.businessLines.label}</span>
            </div>
            <div className={kpi.kpiVal}>{businessLines.length}</div>
            <ul className={kpi.lines}>
              {businessLines.map((l) => (
                <li key={l.id}>{l.name}</li>
              ))}
            </ul>
          </article>
          <article className={`${kpi.kpi} rise`}>
            <div className={kpi.kpiHead}>
              <span>{kpis.agents.label}</span>
              <span className="chip chip-plan">{kpis.agents.chip}</span>
            </div>
            <div className={kpi.kpiVal}>{flagshipAgents.length}</div>
            <ul className={kpi.lines}>
              {flagshipAgents.map((a) => (
                <li key={a.id}>{a.name}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <NeedsFilterProvider>
        <WorkByType types={needTypes} departmentCount={departments.length} />

        <section aria-labelledby="dept-h">
          <div className="sec-head">
            <h2 className="h2" id="dept-h">
              {departmentsCopy.title}
            </h2>
            <span className="sec-note">{departmentsCopy.note}</span>
          </div>
          <div className={styles.grid}>
            {boardDepartments.map((d) => (
              <DepartmentCard key={d.id} department={d} sla={supportSla} />
            ))}
          </div>
        </section>
      </NeedsFilterProvider>

      <section aria-labelledby="agents-h">
        <div className="sec-head">
          <h2 className="h2" id="agents-h">
            {agentsCopy.title}
          </h2>
          <span className="sec-note">{agentsCopy.note}</span>
        </div>
        <div className={styles.grid}>
          {flagshipAgents.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      </section>

      <OpenQuestions departments={boardDepartments} company={company} />
    </>
  );
}
