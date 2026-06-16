import { proficiencyLabel, type ProficiencyLevel } from "../../data/proficiency";
import styles from "./ProficiencyBadge.module.css";

type ProficiencyBadgeProps = {
  level: ProficiencyLevel;
  compact?: boolean;
};

export function ProficiencyBadge({ level, compact = false }: ProficiencyBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[level]} ${compact ? styles.compact : ""}`}
      aria-label={`Proficiency: ${proficiencyLabel(level)}`}
    >
      <span className={styles.dot} aria-hidden />
      {proficiencyLabel(level)}
    </span>
  );
}
