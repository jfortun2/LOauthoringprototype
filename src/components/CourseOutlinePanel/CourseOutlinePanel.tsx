import { courseUnits } from "../../data/courseUnits";
import {
  IconChevronRight,
  IconCircleChevronLeft,
  IconCircleChevronRight,
} from "../icons/Icons";
import styles from "./CourseOutlinePanel.module.css";

type CourseOutlinePanelProps = {
  open: boolean;
  onToggle: () => void;
  selectedUnitId: string | null;
  onSelectUnit: (unitId: string) => void;
};

export function CourseOutlinePanel({
  open,
  onToggle,
  selectedUnitId,
  onSelectUnit,
}: CourseOutlinePanelProps) {
  if (!open) {
    return (
      <div className={styles.openBtnWrap}>
        <span className={styles.tooltip} role="tooltip">
          Open Outline
        </span>
        <button
          type="button"
          className={styles.openBtn}
          onClick={onToggle}
          aria-expanded={false}
          aria-controls="course-content-panel"
          aria-label="Open outline"
        >
          <IconCircleChevronRight />
        </button>
      </div>
    );
  }

  return (
    <aside
      id="course-content-panel"
      className={styles.panel}
      aria-label="Course content outline"
    >
      <div className={styles.panelHeader}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onToggle}
          aria-label="Close outline"
        >
          <IconCircleChevronLeft />
        </button>
        <h2 className={styles.panelTitle}>Course Content</h2>
      </div>
      <div className={styles.divider} role="separator" />
      <ul className={styles.unitList}>
        {courseUnits.map((unit) => (
          <li key={unit.id}>
            <button
              type="button"
              className={`${styles.unitBtn} ${selectedUnitId === unit.id ? styles.unitBtnSelected : ""}`}
              onClick={() => onSelectUnit(unit.id)}
              aria-current={selectedUnitId === unit.id ? "true" : undefined}
            >
              <IconChevronRight className={styles.unitChevron} />
              {unit.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}