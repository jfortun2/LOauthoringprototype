import type { LearningObjective } from "../../data/types";
import { IconChevronDown } from "../icons/Icons";
import { TagPills } from "../TagPills/TagPills";
import { ObjectiveExpandedContent } from "./ObjectiveExpandedContent";
import styles from "./ObjectiveCard.module.css";

type ObjectiveCardProps = {
  objective: LearningObjective;
  expanded: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onSelectContent?: (contentId: string) => void;
};

export function ObjectiveCard({
  objective,
  expanded,
  highlighted,
  onToggle,
  onSelectContent,
}: ObjectiveCardProps) {
  return (
    <article
      className={`${styles.card} ${highlighted ? styles.cardHighlighted : ""} ${expanded ? styles.cardExpanded : ""}`}
      id={`objective-${objective.id}`}
    >
      <div className={styles.cardBody}>
        <span className={styles.loLabel}>lo {objective.id}</span>
        <div className={styles.content}>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={onToggle}
            aria-expanded={expanded}
          >
            <span className={styles.headerRow}>
              <h3 className={styles.title}>{objective.title}</h3>
              <IconChevronDown
                className={`${styles.headerChevron} ${expanded ? styles.headerChevronExpanded : ""}`}
              />
            </span>
          </button>

          {!expanded && (
            <div className={styles.tags}>
              <TagPills objective={objective} />
            </div>
          )}

          {expanded && (
            <div className={styles.details}>
              <ObjectiveExpandedContent
                key={objective.id}
                objective={objective}
                onSelectContent={onSelectContent}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
