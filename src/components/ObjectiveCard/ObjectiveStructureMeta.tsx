import { getObjectiveTagCounts } from "../../data/objectives";
import type { LearningObjective } from "../../data/types";
import styles from "./ObjectiveStructureMeta.module.css";

type ObjectiveStructureMetaProps = {
  objective: LearningObjective;
};

export function ObjectiveStructureMeta({ objective }: ObjectiveStructureMetaProps) {
  const { pages, subObjectives, formative, summative } = getObjectiveTagCounts(objective);

  return (
    <ul className={styles.meta} aria-label="Objective structure">
      <li className={styles.item}>
        <span className={styles.value}>{pages}</span> page{pages === 1 ? "" : "s"}
      </li>
      <li className={styles.item}>
        <span className={styles.value}>{subObjectives}</span> sub-objective
        {subObjectives === 1 ? "" : "s"}
      </li>
      <li className={styles.item}>
        <span className={styles.value}>{formative}</span> formative
      </li>
      <li className={styles.item}>
        <span className={styles.value}>{summative}</span> summative
      </li>
    </ul>
  );
}
