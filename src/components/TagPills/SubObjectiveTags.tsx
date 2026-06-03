import { IconClipboardList, IconFlag } from "../icons/Icons";
import styles from "./TagPills.module.css";

type SubObjectiveTagsProps = {
  formativeCount: number;
  summativeCount: number;
  compact?: boolean;
};

export function SubObjectiveTags({
  formativeCount,
  summativeCount,
  compact = false,
}: SubObjectiveTagsProps) {
  const wrapperClass = compact ? styles.compactTags : styles.subGroupPill;

  return (
    <span className={wrapperClass}>
      <span className={styles.formativePill}>
        <IconClipboardList className={styles.icon} />
        {compact ? formativeCount : `${formativeCount} Formative`}
      </span>
      <span className={styles.summativePill}>
        <IconFlag className={styles.icon} />
        {compact ? summativeCount : `${summativeCount} Summative`}
      </span>
    </span>
  );
}
