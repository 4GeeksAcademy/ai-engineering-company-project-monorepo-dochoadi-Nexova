import type { CSSProperties } from "react";
import type { FlagshipAgent } from "@repo/shared-types";
import { agentsCopy } from "@/content/overview";
import styles from "./AgentCard.module.css";

/** Forest agent card; its flow plays a travelling highlight only while the card is hovered or focused. */
export default function AgentCard({ agent }: { agent: FlagshipAgent }) {
  return (
    <article className={styles.agent} tabIndex={0} aria-label={agent.name}>
      <div className={styles.head}>
        <h3 className={styles.name}>{agent.name}</h3>
        <span className={`chip chip-plan ${styles.chip}`}>{agentsCopy.chip}</span>
      </div>
      <p className={styles.goal}>{agent.goal}</p>
      <ol className={styles.flow} aria-label={agentsCopy.flowLabel}>
        {agent.flow.map((step, i) => (
          <li key={step} className={styles.step} style={{ "--sd": `${i * agentsCopy.stepDelayMs}ms` } as CSSProperties}>
            {step}
          </li>
        ))}
      </ol>
      <span className={styles.hint}>{agentsCopy.flowHint}</span>
      <ul className={styles.targets}>
        {agent.targetMetrics.map((t) => (
          <li key={t.name}>
            {t.name}: {t.target}
          </li>
        ))}
      </ul>
    </article>
  );
}
