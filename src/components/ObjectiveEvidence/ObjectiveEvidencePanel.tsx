import { useMemo } from "react";
import type { LearningObjective } from "../../data/types";
import {
  computeObjectiveEvidence,
  type EvidenceWarning,
} from "../../utils/objectiveEvidence";
import { IconWarningTriangle } from "../icons/Icons";
import { CoverageScoreBadge } from "./CoverageScoreBadge";
import styles from "./ObjectiveEvidencePanel.module.css";

type ObjectiveEvidencePanelProps = {
  objective: LearningObjective;
  variant?: "compact" | "full";
};

function WarningChip({ warning }: { warning: EvidenceWarning }) {
  const severityClass =
    warning.severity === "critical"
      ? styles.warningCritical
      : warning.severity === "warning"
        ? styles.warningDefault
        : styles.warningInfo;

  return (
    <li className={`${styles.warningChip} ${severityClass}`}>
      <IconWarningTriangle className={styles.warningIcon} aria-hidden />
      <span>{warning.message}</span>
    </li>
  );
}

export function ObjectiveEvidencePanel({
  objective,
  variant = "full",
}: ObjectiveEvidencePanelProps) {
  const evidence = useMemo(() => computeObjectiveEvidence(objective), [objective]);
  const topWarnings = evidence.warnings.slice(0, 2);

  if (variant === "compact") {
    return (
      <div className={styles.compact} aria-label="Coverage summary">
        <CoverageScoreBadge objective={objective} size="md" />
        <p className={styles.compactBreakdown}>
          {evidence.breakdown.pages} pages · {evidence.breakdown.formative} formative ·{" "}
          {evidence.breakdown.summative} summative
        </p>
        {topWarnings.length > 0 && (
          <ul className={styles.compactWarnings} aria-label="Coverage warnings">
            {topWarnings.map((warning) => (
              <WarningChip key={warning.id} warning={warning} />
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <section
      className={styles.full}
      aria-labelledby={`${objective.id}-evidence-title`}
    >
      <div className={styles.fullTop}>
        <div className={styles.fullLead}>
          <h4 className={styles.fullTitle} id={`${objective.id}-evidence-title`}>
            Coverage
          </h4>
          <p className={styles.fullHint}>
            Score reflects linked pages and assessments — not learner performance.
          </p>
        </div>
        <CoverageScoreBadge objective={objective} size="md" />
      </div>

      <div className={styles.breakdownRow} aria-label="Coverage breakdown">
        <span className={styles.breakdownChip}>
          <strong>{evidence.breakdown.pages}</strong> pages
        </span>
        <span className={styles.breakdownChip}>
          <strong>{evidence.breakdown.formative}</strong> formative
        </span>
        <span
          className={`${styles.breakdownChip} ${evidence.breakdown.summative === 0 ? styles.breakdownChipAlert : ""}`}
        >
          <strong>{evidence.breakdown.summative}</strong> summative
        </span>
        <span className={styles.breakdownChip}>
          <strong>{evidence.breakdown.subObjectives}</strong> sub-objectives
        </span>
      </div>

      {evidence.warnings.length > 0 && (
        <ul className={styles.warningsRow} aria-label="Improvement opportunities">
          {evidence.warnings.map((warning) => (
            <WarningChip key={warning.id} warning={warning} />
          ))}
        </ul>
      )}
    </section>
  );
}
