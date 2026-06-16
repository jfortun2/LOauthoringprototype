import {
  getObjectiveProficiency,
  hasProficiencyData,
  proficiencyLabel,
  type ProficiencyDistribution,
} from "../../data/proficiency";
import type { LearningObjective } from "../../data/types";
import { ProficiencyBadge } from "../ProficiencyBadge/ProficiencyBadge";
import styles from "./ObjectivePerformanceSummary.module.css";

type ObjectivePerformanceSummaryProps = {
  objective: LearningObjective;
  onViewInsights: () => void;
};

const DIST_KEYS: (keyof ProficiencyDistribution)[] = [
  "high",
  "medium",
  "low",
  "insufficient",
];

function fillClass(key: keyof ProficiencyDistribution): string {
  switch (key) {
    case "high":
      return styles.distFillHigh;
    case "medium":
      return styles.distFillMedium;
    case "low":
      return styles.distFillLow;
    default:
      return styles.distFillInsufficient;
  }
}

export function ObjectivePerformanceSummary({
  objective,
  onViewInsights,
}: ObjectivePerformanceSummaryProps) {
  const proficiency = getObjectiveProficiency(objective);
  const hasData = hasProficiencyData(proficiency);

  return (
    <section className={styles.section} aria-labelledby={`perf-${objective.id}`}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h4 className={styles.title} id={`perf-${objective.id}`}>
            Learning performance
          </h4>
          <p className={styles.subtitle}>Based on student data across course sections</p>
        </div>
        <ProficiencyBadge level={proficiency.level} />
      </div>

      {hasData ? (
        <>
          <p className={styles.summary}>{proficiency.summary}</p>

          <div className={styles.distribution} aria-label="Proficiency distribution">
            {DIST_KEYS.map((key) => {
              const value = proficiency.distribution[key];
              if (value === 0) return null;
              return (
                <div key={key} className={styles.distRow}>
                  <span className={styles.distLabel}>{proficiencyLabel(key)}</span>
                  <div className={styles.distBar}>
                    <div
                      className={`${styles.distFill} ${fillClass(key)}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className={styles.distValue}>{value}%</span>
                </div>
              );
            })}
          </div>

          <p className={styles.counts}>
            <span>
              <span className={styles.countValue}>{proficiency.learnerCount}</span> learners
            </span>
            <span>
              across{" "}
              <span className={styles.countValue}>{proficiency.sectionCount}</span> section
              {proficiency.sectionCount === 1 ? "" : "s"}
            </span>
          </p>
        </>
      ) : (
        <p className={styles.insufficientNote}>{proficiency.summary}</p>
      )}

      <button type="button" className={styles.insightsBtn} onClick={onViewInsights}>
        View in Insights →
      </button>
    </section>
  );
}
