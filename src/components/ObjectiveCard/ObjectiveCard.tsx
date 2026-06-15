import type { LearningObjective } from "../../data/types";
import type { ProductModel } from "../../utils/objectiveMappingViews";
import { ObjectiveLinkSummary } from "./ObjectiveLinkSummary";
import { FlexibleTaggingObjectiveDetail } from "../ObjectiveMapping/FlexibleTaggingObjectiveDetail";
import { StrictHierarchyObjectiveDetail } from "../ObjectiveMapping/StrictHierarchyObjectiveDetail";
import { RowExpandChevron } from "../RowExpandChevron/RowExpandChevron";
import { ObjectiveActions } from "./ObjectiveActions";
import styles from "./ObjectiveCard.module.css";

type ObjectiveCardProps = {
  objective: LearningObjective;
  productModel: ProductModel;
  expanded: boolean;
  highlighted: boolean;
  selectedSubId: string | null;
  onToggle: () => void;
  onSelectSub: (subId: string | null) => void;
  onSelectContent?: (contentId: string) => void;
  onEditObjective: (objectiveId: string) => void;
  onRemoveObjective: (objectiveId: string) => void;
};

export function ObjectiveCard({
  objective,
  productModel,
  expanded,
  highlighted,
  selectedSubId,
  onToggle,
  onSelectSub,
  onSelectContent,
  onEditObjective,
  onRemoveObjective,
}: ObjectiveCardProps) {
  return (
    <article
      className={`${styles.card} ${highlighted ? styles.cardHighlighted : ""} ${expanded ? styles.cardExpanded : ""}`}
      id={`objective-${objective.id}`}
    >
      <div className={styles.cardBody}>
        <RowExpandChevron
          expanded={expanded}
          onClick={onToggle}
          label={expanded ? "Collapse learning objective" : "Expand learning objective"}
        />
        <span className={styles.loLabel}>lo {objective.id}</span>
        <div className={styles.content}>
          <div className={styles.headerRow}>
            <button
              type="button"
              className={styles.headerBtn}
              onClick={onToggle}
              aria-expanded={expanded}
            >
              <h3 className={styles.title}>{objective.title}</h3>
            </button>
            <ObjectiveActions
              editLabel="Edit learning objective"
              removeLabel="Remove learning objective"
              onEdit={() => onEditObjective(objective.id)}
              onRemove={() => onRemoveObjective(objective.id)}
            />
          </div>

          {!expanded && (
            <div className={styles.summary}>
              <ObjectiveLinkSummary objective={objective} productModel={productModel} />
            </div>
          )}

          {expanded && (
            <div className={styles.details}>
              {productModel === "strict" ? (
                <StrictHierarchyObjectiveDetail
                  objective={objective}
                  selectedSubId={selectedSubId}
                  onSelectSub={onSelectSub}
                  onSelectContent={onSelectContent}
                />
              ) : (
                <FlexibleTaggingObjectiveDetail
                  objective={objective}
                  selectedSubId={selectedSubId}
                  onSelectSub={onSelectSub}
                  onSelectContent={onSelectContent}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
