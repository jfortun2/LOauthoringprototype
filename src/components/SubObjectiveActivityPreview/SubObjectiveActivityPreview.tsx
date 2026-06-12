import { IconClipboardList, IconFlag, IconWarningTriangle } from "../icons/Icons";
import {
  MIN_FORMATIVE_ACTIVITIES,
  MIN_SUMMATIVE_ACTIVITIES,
} from "../../utils/mappings";
import styles from "./SubObjectiveActivityPreview.module.css";

type SubObjectiveActivityPreviewProps = {
  formativeCount: number;
  summativeCount: number;
};

export function SubObjectiveActivityPreview({
  formativeCount,
  summativeCount,
}: SubObjectiveActivityPreviewProps) {
  const formativeLow = formativeCount < MIN_FORMATIVE_ACTIVITIES;
  const summativeLow = summativeCount < MIN_SUMMATIVE_ACTIVITIES;

  return (
    <span className={styles.preview} aria-label="Linked activities">
      <span
        className={`${styles.formative} ${formativeLow ? styles.warning : ""}`}
        title={
          formativeLow
            ? `${formativeCount} of ${MIN_FORMATIVE_ACTIVITIES} recommended formative activities`
            : `${formativeCount} formative`
        }
      >
        {formativeLow && <IconWarningTriangle className={styles.warningIcon} />}
        <IconClipboardList className={styles.icon} />
        <span className={styles.count}>{formativeCount}</span>
      </span>
      <span
        className={`${styles.summative} ${summativeLow ? styles.warning : ""}`}
        title={
          summativeLow
            ? `${summativeCount} of ${MIN_SUMMATIVE_ACTIVITIES} recommended summative activities`
            : `${summativeCount} summative`
        }
      >
        {summativeLow && <IconWarningTriangle className={styles.warningIcon} />}
        <IconFlag className={styles.icon} />
        <span className={styles.count}>{summativeCount}</span>
      </span>
    </span>
  );
}
