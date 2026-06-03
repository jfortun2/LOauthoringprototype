import { IconClipboardList, IconFlag } from "../icons/Icons";
import styles from "./SubObjectiveActivityPreview.module.css";

type SubObjectiveActivityPreviewProps = {
  formativeCount: number;
  summativeCount: number;
};

export function SubObjectiveActivityPreview({
  formativeCount,
  summativeCount,
}: SubObjectiveActivityPreviewProps) {
  if (formativeCount === 0 && summativeCount === 0) return null;

  return (
    <span className={styles.preview} aria-label="Linked activities">
      {formativeCount > 0 && (
        <span className={styles.formative} title={`${formativeCount} formative`}>
          <IconClipboardList className={styles.icon} />
          <span className={styles.count}>{formativeCount}</span>
        </span>
      )}
      {summativeCount > 0 && (
        <span className={styles.summative} title={`${summativeCount} summative`}>
          <IconFlag className={styles.icon} />
          <span className={styles.count}>{summativeCount}</span>
        </span>
      )}
    </span>
  );
}
