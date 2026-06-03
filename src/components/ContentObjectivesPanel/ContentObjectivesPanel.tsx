import type { ContentNode, LearningObjective } from "../../data/types";
import styles from "./ContentObjectivesPanel.module.css";

type ContentObjectivesPanelProps = {
  content: ContentNode;
  linkedObjectives: LearningObjective[];
  activeObjectiveId: string | null;
  onSelectObjective: (id: string) => void;
  onClose: () => void;
};

export function ContentObjectivesPanel({
  content,
  linkedObjectives,
  activeObjectiveId,
  onSelectObjective,
  onClose,
}: ContentObjectivesPanelProps) {
  const contentLabel = content.type === "activity" ? "Activity" : "Page";

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <div className={styles.content}>
        <p className={styles.eyebrow}>
          Objectives for this {contentLabel.toLowerCase()}
        </p>
        <p className={styles.title}>{content.title}</p>

        {linkedObjectives.length === 0 ? (
          <p className={styles.empty}>
            No objectives linked. Add mappings to show what this content supports.
          </p>
        ) : (
          <div className={styles.chips} role="list">
            {linkedObjectives.map((obj) => (
              <button
                key={obj.id}
                type="button"
                role="listitem"
                className={`${styles.chip} ${activeObjectiveId === obj.id ? styles.chipActive : ""}`}
                onClick={() => onSelectObjective(obj.id)}
              >
                {obj.title}
              </button>
            ))}
          </div>
        )}
      </div>
      <button type="button" className={styles.closeBtn} onClick={onClose}>
        Clear selection
      </button>
    </div>
  );
}
