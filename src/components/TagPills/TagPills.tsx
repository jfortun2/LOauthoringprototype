import { getObjectiveTagCounts } from "../../data/objectives";
import type { LearningObjective } from "../../data/types";
import { IconClipboardList, IconFlag, IconPages } from "../icons/Icons";
import styles from "./TagPills.module.css";

type TagPillsProps = {
  objective: LearningObjective;
};

export function TagPills({ objective }: TagPillsProps) {
  const { pages, subObjectives, formative, summative } = getObjectiveTagCounts(objective);

  return (
    <div className={styles.tags} aria-label="Objective summary">
      <span className={styles.pagesPill}>
        <IconPages className={styles.icon} />
        {pages} Pages
      </span>
      <span className={styles.subGroupPill}>
        <span className={styles.subCount}>{subObjectives} Sub-Objectives</span>
        <span className={styles.formativePill}>
          <IconClipboardList className={styles.icon} />
          {formative} Formative
        </span>
        <span className={styles.summativePill}>
          <IconFlag className={styles.icon} />
          {summative} Summative
        </span>
      </span>
    </div>
  );
}
