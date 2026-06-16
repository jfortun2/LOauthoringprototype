import { getObjectiveProficiency, hasProficiencyData } from "../../data/proficiency";
import type { LearningObjective } from "../../data/types";
import { countUnderAssessedSubObjectives } from "../../utils/mappings";
import { ProficiencyBadge } from "../ProficiencyBadge/ProficiencyBadge";
import { TagPills } from "../TagPills/TagPills";
import { IconWarningTriangle } from "../icons/Icons";
import { RowExpandChevron } from "../RowExpandChevron/RowExpandChevron";
import { ObjectiveActions } from "./ObjectiveActions";
import { ObjectiveExpandedContent } from "./ObjectiveExpandedContent";
import styles from "./ObjectiveCard.module.css";

type ObjectiveCardProps = {
  objective: LearningObjective;
  expanded: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onSelectContent?: (contentId: string) => void;
  onEditObjective: (objectiveId: string) => void;
  onRemoveObjective: (objectiveId: string) => void;
  onEditSubObjective: (objectiveId: string, subObjectiveId: string) => void;
  onRemoveSubObjective: (objectiveId: string, subObjectiveId: string) => void;
  onViewInsights: (objectiveId: string) => void;
};

export function ObjectiveCard({
  objective,
  expanded,
  highlighted,
  onToggle,
  onSelectContent,
  onEditObjective,
  onRemoveObjective,
  onEditSubObjective,
  onRemoveSubObjective,
  onViewInsights,
}: ObjectiveCardProps) {
  const proficiency = getObjectiveProficiency(objective);
  const showInsightsLink = hasProficiencyData(proficiency);
  const underAssessedCount = countUnderAssessedSubObjectives(objective);

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
            <div className={styles.collapsedBody}>
              <div className={styles.tagsRow}>
                <TagPills objective={objective} />
                <div className={styles.proficiencyStrip}>
                  <ProficiencyBadge level={proficiency.level} compact />
                  {showInsightsLink && (
                    <button
                      type="button"
                      className={styles.insightsLink}
                      onClick={() => onViewInsights(objective.id)}
                    >
                      View Insights
                    </button>
                  )}
                </div>
              </div>
              {underAssessedCount > 0 && (
                <span
                  className={styles.assessmentWarning}
                  title={`${underAssessedCount} sub-objective${underAssessedCount === 1 ? "" : "s"} below the recommended 3 formative and 3 summative activities`}
                >
                  <IconWarningTriangle className={styles.assessmentWarningIcon} />
                  {underAssessedCount} sub-objective{underAssessedCount === 1 ? "" : "s"} need
                  {underAssessedCount === 1 ? "s" : ""} activities
                </span>
              )}
            </div>
          )}

          {expanded && (
            <div className={styles.details}>
              <ObjectiveExpandedContent
                key={objective.id}
                objective={objective}
                onSelectContent={onSelectContent}
                onEditSubObjective={(subObjectiveId) =>
                  onEditSubObjective(objective.id, subObjectiveId)
                }
                onRemoveSubObjective={(subObjectiveId) =>
                  onRemoveSubObjective(objective.id, subObjectiveId)
                }
                onViewInsights={() => onViewInsights(objective.id)}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
