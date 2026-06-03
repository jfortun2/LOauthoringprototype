import type { LearningObjective } from "../../data/types";
import { getObjectiveCounts } from "../../data/objectives";
import { coverageLabel } from "../../utils/mappings";
import styles from "./MetricPills.module.css";

type MetricPillsProps = {
  objective: LearningObjective;
};

function WarningIcon() {
  return (
    <svg className={styles.warningIcon} viewBox="0 0 14 14" aria-hidden>
      <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 4v4M7 10v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function MetricPills({ objective }: MetricPillsProps) {
  const { subObjectives, pages, activities } = getObjectiveCounts(objective);

  const coverageClass =
    objective.coverage === "none"
      ? styles.coverageNone
      : objective.coverage === "weak"
        ? styles.coverageWeak
        : objective.coverage === "moderate"
          ? styles.coverageModerate
          : styles.coverageStrong;

  return (
    <dl className={styles.stats} aria-label="Objective coverage and performance">
      <div className={styles.stat}>
        <dt className={styles.label}>Coverage</dt>
        <dd className={styles.value}>
          <span className={`${styles.coverage} ${coverageClass}`}>
            {coverageLabel(objective.coverage)}
          </span>
        </dd>
      </div>
      <div className={styles.stat}>
        <dt className={styles.label}>Pages</dt>
        <dd className={`${styles.value} ${pages === 0 ? styles.valueWarning : ""}`}>
          {pages === 0 && <WarningIcon />}
          {pages}
        </dd>
      </div>
      <div className={styles.stat}>
        <dt className={styles.label}>Sub-objectives</dt>
        <dd className={styles.value}>{subObjectives}</dd>
      </div>
      <div className={styles.stat}>
        <dt className={styles.label}>Assessments</dt>
        <dd className={`${styles.value} ${activities === 0 ? styles.valueWarning : ""}`}>
          {activities === 0 && <WarningIcon />}
          {activities}
        </dd>
      </div>
      <div className={styles.stat}>
        <dt className={styles.label}>Mastery</dt>
        <dd
          className={`${styles.value} ${objective.performancePercent == null ? styles.valueMuted : ""}`}
        >
          {objective.performancePercent != null
            ? `${objective.performancePercent}%`
            : "—"}
        </dd>
      </div>
    </dl>
  );
}
