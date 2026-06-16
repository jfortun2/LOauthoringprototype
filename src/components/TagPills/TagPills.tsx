import { getObjectiveTagCounts } from "../../data/objectives";
import type { LearningObjective } from "../../data/types";
import { countUnderAssessedSubObjectives } from "../../utils/mappings";
import { IconClipboardList, IconFlag, IconPages, IconWarningTriangle } from "../icons/Icons";
import styles from "./TagPills.module.css";

type TagPillsProps = {
  objective: LearningObjective;
};

export function TagPills({ objective }: TagPillsProps) {
  const { pages, subObjectives, formative, summative } = getObjectiveTagCounts(objective);
  const hasWarning = countUnderAssessedSubObjectives(objective) > 0;

  return (
    <div className={styles.tags} aria-label="Objective summary">
      <span className={styles.pagesPill}>
        <IconPages className={styles.icon} />
        {pages} Pages
      </span>
      <span
        className={`${styles.subGroupPill} ${hasWarning ? styles.subGroupPillWarning : ""}`}
      >
        {hasWarning && (
          <IconWarningTriangle className={styles.warningIcon} aria-hidden />
        )}
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
