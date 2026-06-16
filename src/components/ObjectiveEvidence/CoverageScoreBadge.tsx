import { useMemo } from "react";
import type { LearningObjective } from "../../data/types";
import {
  computeObjectiveEvidence,
  evidenceStrengthLabel,
} from "../../utils/objectiveEvidence";
import styles from "./CoverageScoreBadge.module.css";

type CoverageScoreBadgeProps = {
  objective: LearningObjective;
  /** sm = collapsed card header; md = expanded inline summary */
  size?: "sm" | "md";
};

export function CoverageScoreBadge({
  objective,
  size = "sm",
}: CoverageScoreBadgeProps) {
  const evidence = useMemo(() => computeObjectiveEvidence(objective), [objective]);

  const isWeakCoverage = evidence.strength === "weak";
  const label = evidenceStrengthLabel(evidence.strength);

  return (
    <div
      className={`${styles.badge} ${size === "md" ? styles.badgeMd : ""} ${isWeakCoverage ? styles.strengthWeak : ""}`}
      role="img"
      aria-label={`Coverage score ${evidence.score} out of 100, ${label}`}
    >
      <span className={styles.score}>{evidence.score}</span>
      <span className={styles.meta}>
        <span className={styles.label}>{label}</span>
        <span className={styles.meterTrack} aria-hidden>
          <span className={styles.meterFill} style={{ width: `${evidence.score}%` }} />
        </span>
      </span>
    </div>
  );
}
